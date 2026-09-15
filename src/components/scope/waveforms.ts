/**
 * Waveform scenarios for the live scope. Each one has what the simulation
 * said the net should look like, what actually came back from the board,
 * and the fault the model names once the residual collapses.
 */
export interface Scenario {
  id: string;
  net: string;
  expectedLabel: string;
  measuredLabel: string;
  expected: (t: number) => number; // t in [0,1] across the screen, returns [-1,1]
  measured: (t: number) => number;
  candidates: string[]; // what the search tries, in order; last one is the answer
  fault: string;
  evidence: string;
  timebase: string;
  volts: string;
}

const TAU = Math.PI * 2;
const square = (t: number, cycles: number) => (Math.sin(TAU * cycles * t) >= 0 ? 1 : -1);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** First-order low-pass of a square wave, computed analytically per half-cycle. */
const rcSquare = (t: number, cycles: number, tauFrac: number) => {
  const period = 1 / cycles;
  const half = period / 2;
  const phase = ((t % period) + period) % period;
  const k = Math.floor(phase / half); // 0 = high half, 1 = low half
  const local = phase - k * half;
  const target = k === 0 ? 1 : -1;
  const start = -target * Math.tanh(half / (2 * tauFrac)); // steady-state start value
  return target + (start - target) * Math.exp(-local / tauFrac);
};

/** Square wave with damped ringing after each edge (no series termination). */
const ringingSquare = (t: number, cycles: number) => {
  const period = 1 / cycles;
  const half = period / 2;
  const phase = ((t % period) + period) % period;
  const k = Math.floor(phase / half);
  const local = phase - k * half;
  const target = k === 0 ? 1 : -1;
  const ring = 0.5 * Math.exp(-local / (half * 0.2)) * Math.cos(TAU * local * cycles * 14);
  return target * (1 + ring);
};

export const scenarios: Scenario[] = [
  {
    id: "lowpass",
    net: "CLK_A → U3.7",
    expectedLabel: "1 kHz square, 3.3 V",
    measuredLabel: "Rounded, never reaches the rail",
    expected: (t) => square(t, 3) * 0.8,
    measured: (t) => rcSquare(t, 3, 0.055) * 0.8,
    candidates: ["Open pull-up R4", "Solder bridge U3.7–8", "Wrong C7 value"],
    fault: "C7 fitted as 10 nF, designed 100 pF",
    evidence: "RC on CLK_A ≈ 110 µs. The rounded edge matches C7 at 100× value.",
    timebase: "200 µs / div",
    volts: "1 V / div",
  },
  {
    id: "ringing",
    net: "SPI_SCK → J2",
    expectedLabel: "Clean 5 MHz edges",
    measuredLabel: "Overshoot and ringing on every edge",
    expected: (t) => square(t, 2.5) * 0.7,
    measured: (t) => ringingSquare(t, 2.5) * 0.7,
    candidates: ["Ground return on J2", "Driver strength U1", "Missing R12 termination"],
    fault: "No series termination at R12 — 48 mm trace to J2",
    evidence: "Ring at 71 MHz fits the unterminated trace length. Fitting 33 Ω at R12 damps it in sim.",
    timebase: "50 ns / div",
    volts: "1 V / div",
  },
  {
    id: "clipped",
    net: "AOUT ← U2.6",
    expectedLabel: "2 Vpp sine, centred",
    measuredLabel: "Flat-topped on the negative half",
    expected: (t) => Math.sin(TAU * 2 * t) * 0.75,
    measured: (t) => clamp(Math.sin(TAU * 2 * t) * 0.75, -0.08, 1),
    candidates: ["Gain resistor R21", "Input bias on U2.3", "VEE rail open at U2.4"],
    fault: "VEE open at U2.4 — op-amp running single-supply",
    evidence: "Clipping sits at 0 V, not at a gain limit. Only a missing negative rail reproduces it.",
    timebase: "500 µs / div",
    volts: "500 mV / div",
  },
  {
    id: "ripple",
    net: "3V3 ← U5.OUT",
    expectedLabel: "3.30 V DC",
    measuredLabel: "100 Hz sawtooth on the rail",
    expected: () => 0.35,
    measured: (t) => 0.35 + 0.28 * ((((t * 4) % 1) + 1) % 1 - 0.5) + 0.02 * Math.sin(TAU * 60 * t),
    candidates: ["Load transient U6", "Regulator U5 dropout", "Bulk C1 open"],
    fault: "C1 cold joint — bulk cap open on 3V3",
    evidence: "Sawtooth at twice mains frequency with no smoothing. Removing C1 in sim gives this ripple.",
    timebase: "5 ms / div",
    volts: "200 mV / div",
  },
  {
    id: "sine-not-square",
    net: "PWM_OUT → Q1.G",
    expectedLabel: "Square, 20 kHz",
    measuredLabel: "Sine — the wished square is gone",
    expected: (t) => square(t, 3) * 0.7,
    measured: (t) => rcSquare(t, 3, 0.16) * 0.7,
    candidates: ["Gate driver U4 weak", "Q1 gate charge", "R5 / R6 swapped"],
    fault: "R5 and R6 swapped — 100 kΩ in series with the gate",
    evidence: "Corner at ≈ 300 Hz. A 100 kΩ gate resistor with Cgs makes exactly this low-pass.",
    timebase: "20 µs / div",
    volts: "2 V / div",
  },
];
