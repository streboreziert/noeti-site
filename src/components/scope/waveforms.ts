/**
 * Waveform scenarios for the live scope. Each one has what the simulation
 * said the net should look like, what actually came back from the board,
 * and the faults the model tries — each candidate has its own simulated
 * trace, so the search visibly tries wrong shapes before the right one.
 */
export type Wave = (t: number) => number; // t in [0,1] across the screen, returns [-1,1]

export interface Candidate {
  label: string;
  sim: Wave;
}

export interface Scenario {
  id: string;
  net: string;
  expectedLabel: string;
  measuredLabel: string;
  expected: Wave;
  measured: Wave;
  candidates: Candidate[]; // last one reproduces the measurement
  fault: string;
  evidence: string;
  timebase: string;
  volts: string;
}

const TAU = Math.PI * 2;
const square = (cycles: number, amp = 1): Wave => (t) => (Math.sin(TAU * cycles * t) >= 0 ? amp : -amp);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** First-order low-pass of a square wave, computed analytically per half-cycle. */
const rcSquare = (cycles: number, tauFrac: number, amp = 1, tauLow = tauFrac): Wave => (t) => {
  const period = 1 / cycles;
  const half = period / 2;
  const phase = ((t % period) + period) % period;
  const k = Math.floor(phase / half);
  const local = phase - k * half;
  const target = k === 0 ? 1 : -1;
  const tau = k === 0 ? tauFrac : tauLow;
  const start = -target * Math.tanh(half / (tauFrac + tauLow));
  return amp * (target + (start - target) * Math.exp(-local / tau));
};

/** Square wave with damped ringing after each edge. */
const ringingSquare = (cycles: number, amp = 1, ring = 0.5): Wave => (t) => {
  const period = 1 / cycles;
  const half = period / 2;
  const phase = ((t % period) + period) % period;
  const k = Math.floor(phase / half);
  const local = phase - k * half;
  const target = k === 0 ? 1 : -1;
  return amp * target * (1 + ring * Math.exp(-local / (half * 0.2)) * Math.cos(TAU * local * cycles * 14));
};

/** Square with a Miller-plateau step on each edge (gate charge). */
const plateauSquare = (cycles: number, amp = 1): Wave => (t) => {
  const period = 1 / cycles;
  const half = period / 2;
  const phase = ((t % period) + period) % period;
  const k = Math.floor(phase / half);
  const local = phase - k * half;
  const target = k === 0 ? 1 : -1;
  const p = local / half;
  const shape = p < 0.08 ? p / 0.08 * 0.45 : p < 0.3 ? 0.45 : p < 0.38 ? 0.45 + ((p - 0.3) / 0.08) * 0.55 : 1;
  return amp * (-target + 2 * target * shape);
};

const saw = (cycles: number): Wave => (t) => (((t * cycles) % 1) + 1) % 1 - 0.5;
const sine = (cycles: number, amp = 1): Wave => (t) => amp * Math.sin(TAU * cycles * t);
const add = (a: Wave, b: Wave): Wave => (t) => a(t) + b(t);
const off = (a: Wave, dc: number): Wave => (t) => a(t) + dc;
const clip = (a: Wave, lo: number, hi: number): Wave => (t) => clamp(a(t), lo, hi);
const noise = (a: Wave, amp: number, f = 90): Wave => (t) => a(t) + amp * Math.sin(TAU * f * t) * Math.sin(TAU * 7.3 * t);

export const scenarios: Scenario[] = [
  {
    id: "lowpass",
    net: "CLK_A → U3.7",
    expectedLabel: "1 kHz square, 3.3 V",
    measuredLabel: "Rounded, never reaches the rail",
    expected: square(3, 0.8),
    measured: rcSquare(3, 0.055, 0.8),
    candidates: [
      { label: "Open pull-up R4", sim: rcSquare(3, 0.09, 0.8, 0.004) }, // slow rise, fast fall
      { label: "Solder bridge U3.7–8", sim: off(square(3, 0.42), -0.3) }, // half amplitude, pulled down
      { label: "Wrong C7 value", sim: rcSquare(3, 0.055, 0.8) },
    ],
    fault: "C7 fitted as 10 nF, designed 100 pF",
    evidence: "RC on CLK_A ≈ 110 µs. Only a 100× cap gives that corner; a weak pull-up would round the rising edge alone.",
    timebase: "200 µs / div",
    volts: "1 V / div",
  },
  {
    id: "ringing",
    net: "SPI_SCK → J2",
    expectedLabel: "Clean 5 MHz edges",
    measuredLabel: "Overshoot and ringing on every edge",
    expected: square(2.5, 0.7),
    measured: ringingSquare(2.5, 0.7),
    candidates: [
      { label: "Ground return on J2", sim: noise(square(2.5, 0.7), 0.12, 40) },
      { label: "Driver strength U1", sim: rcSquare(2.5, 0.02, 0.62) },
      { label: "Missing R12 termination", sim: ringingSquare(2.5, 0.7) },
    ],
    fault: "No series termination at R12 — 48 mm trace to J2",
    evidence: "Ring at 71 MHz fits the unterminated trace length. 33 Ω at R12 damps it in sim.",
    timebase: "50 ns / div",
    volts: "1 V / div",
  },
  {
    id: "clipped",
    net: "AOUT ← U2.6",
    expectedLabel: "2 Vpp sine, centred",
    measuredLabel: "Flat-topped on the negative half",
    expected: sine(2, 0.75),
    measured: clip(sine(2, 0.75), -0.08, 1),
    candidates: [
      { label: "Gain resistor R21", sim: clip(sine(2, 1.3), -0.85, 0.85) },
      { label: "Input bias on U2.3", sim: off(sine(2, 0.75), 0.25) },
      { label: "VEE rail open at U2.4", sim: clip(sine(2, 0.75), -0.08, 1) },
    ],
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
    measured: add(off(saw(4), 0.35), (t) => 0.02 * Math.sin(TAU * 60 * t)),
    candidates: [
      { label: "Load transient U6", sim: (t) => 0.35 - 0.3 * Math.max(0, Math.sin(TAU * 4 * t)) ** 12 },
      { label: "Regulator U5 dropout", sim: (t) => 0.18 + 0.05 * saw(4)(t) },
      { label: "Bulk C1 open", sim: add(off(saw(4), 0.35), (t) => 0.02 * Math.sin(TAU * 60 * t)) },
    ],
    fault: "C1 cold joint — bulk cap open on 3V3",
    evidence: "Sawtooth at twice mains frequency with no smoothing. Removing C1 in sim gives this ripple.",
    timebase: "5 ms / div",
    volts: "200 mV / div",
  },
  {
    id: "sine-not-square",
    net: "PWM_OUT → Q1.G",
    expectedLabel: "Square, 20 kHz",
    measuredLabel: "Sine where the square should be",
    expected: square(3, 0.7),
    measured: rcSquare(3, 0.16, 0.7),
    candidates: [
      { label: "Gate driver U4 weak", sim: rcSquare(3, 0.03, 0.7) },
      { label: "Q1 gate charge", sim: plateauSquare(3, 0.7) },
      { label: "R5 / R6 swapped", sim: rcSquare(3, 0.16, 0.7) },
    ],
    fault: "R5 and R6 swapped — 100 kΩ in series with the gate",
    evidence: "Corner at ≈ 300 Hz. 100 kΩ into Cgs is exactly this low-pass; a weak driver would still reach the rail.",
    timebase: "20 µs / div",
    volts: "2 V / div",
  },
];
