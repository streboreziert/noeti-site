import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, GitCompare, Crosshair, RefreshCw, Check } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import { scenarios } from "./scope/waveforms";
import { EASE } from "@/lib/motion";

const steps = [
  {
    icon: Radio,
    n: "01",
    title: "Measure the circuit",
    body: "Connect a scope or logger, or upload a capture — waveform, screenshot, or CSV. The measurement stays in volts, amps, and seconds. That trajectory is what the model reads.",
  },
  {
    icon: GitCompare,
    n: "02",
    title: "Compare should to is",
    body: "From the netlist, the model computes the expected state — .tran, .ac, operating point — and sets it next to what you measured. The residual ΔV, ΔI is the disagreement, in physical units.",
  },
  {
    icon: Crosshair,
    n: "03",
    title: "Name the likely fault",
    body: "Candidate faults are simulated forward. The model asks which disagreement on the schematic would produce this signal, and returns the likely cause: net, part, and why this residual matches.",
  },
  {
    icon: RefreshCw,
    n: "04",
    title: "Probe again until it works",
    body: "The next probe is the next measurement. Capture, compare, prove. The loop closes when the residual collapses and the realized circuit does what the simulation said it should.",
  },
];

const W = 600;
const H = 300;
const N = 240;
const toPoints = (fn: (t: number) => number) =>
  Array.from({ length: N + 1 }, (_, i) => {
    const t = i / N;
    return `${(t * W).toFixed(1)} ${(H / 2 - fn(t) * (H / 2) * 0.82).toFixed(1)}`;
  });
const toPath = (fn: (t: number) => number) => "M" + toPoints(fn).join(" L");

/** Scrollytelling: the four steps on the left drive one small scope on the right. */
const Process = () => {
  const [active, setActive] = useState(0);
  const sc = scenarios[0]; // the rounded clock edge
  const paths = useMemo(() => {
    const exp = toPoints(sc.expected);
    const meas = toPoints(sc.measured);
    return {
      expected: "M" + exp.join(" L"),
      measured: "M" + meas.join(" L"),
      mid: toPath((t) => sc.expected(t) + (sc.measured(t) - sc.expected(t)) * 0.45),
      area: "M" + meas.join(" L") + " L" + [...exp].reverse().join(" L") + " Z",
    };
  }, [sc]);

  return (
    <section id="process" className="relative py-28 lg:py-40 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="max-w-2xl mb-16 lg:mb-24">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-5 block">After fabrication</span>
          </Reveal>
          <TextReveal as="h2" text="Measure. Compare. Prove. Repeat." className="font-serif text-3xl md:text-5xl font-normal tracking-[-0.02em] mb-6" />
          <Reveal delay={0.2}>
            <p className="text-muted-foreground font-light leading-relaxed max-w-xl">
              Bring a signal from the bench — a live scope, or an image of the capture. The model compares what should be to what is,
              simulates the faults that would produce that residual, and sends you back to the next probe until the circuit works.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Steps */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
                >
                <motion.button
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  onViewportEnter={() => setActive(i)}
                  viewport={{ amount: 0.5, margin: "-30% 0px -30% 0px" }}
                  className={`w-full text-left rounded-lg border p-6 transition-all duration-500 ${
                    isActive ? "border-primary/50 bg-card shadow-hover" : "border-border bg-transparent hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start gap-5">
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <s.icon className="h-4 w-4" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground mb-1">{s.n}</div>
                      <div className={`text-lg tracking-tight ${isActive ? "text-foreground" : "text-foreground/80"}`}>{s.title}</div>
                      <motion.p
                        initial={false}
                        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="text-sm text-muted-foreground font-light leading-relaxed overflow-hidden"
                      >
                        <span className="block pt-2.5">{s.body}</span>
                      </motion.p>
                    </div>
                  </div>
                </motion.button>
                </motion.div>
              );
            })}
          </div>

          {/* Sticky instrument */}
          <div className="lg:col-span-7 lg:sticky lg:top-28 order-first lg:order-none">
            <Reveal>
              <div className="rounded-lg border border-white/10 bg-ink overflow-hidden shadow-hover">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  <span>CH1 · {sc.net}</span>
                  <span className="normal-case">{sc.timebase} · {sc.volts}</span>
                </div>
                <div className="relative scope-grid">
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="Scope screen showing the four steps">
                    <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(120,255,190,0.18)" />

                    {/* 02: residual area */}
                    <AnimatePresence>
                      {active >= 1 && active < 3 && (
                        <motion.path
                          key="area"
                          d={paths.area}
                          fill="rgba(255,120,90,0.22)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: active === 2 ? 0.5 : 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* 02+: expected dashed */}
                    <AnimatePresence>
                      {active >= 1 && (
                        <motion.path
                          key="expected"
                          d={paths.expected}
                          fill="none"
                          stroke="hsl(45 80% 60%)"
                          strokeWidth="1.5"
                          strokeDasharray="6 6"
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1, ease: EASE }}
                        />
                      )}
                    </AnimatePresence>

                    {/* 03: candidate sims */}
                    <AnimatePresence>
                      {active === 2 && (
                        <motion.g key="cands">
                          <motion.path
                            d={paths.mid}
                            fill="none"
                            stroke="hsl(200 90% 70%)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 1, 0.25] }}
                            transition={{ duration: 1.6, times: [0, 0.3, 0.7, 1], ease: EASE }}
                          />
                          <motion.path
                            d={paths.measured}
                            fill="none"
                            stroke="hsl(200 90% 70%)"
                            strokeWidth="1.5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2, delay: 1.2, ease: EASE }}
                          />
                        </motion.g>
                      )}
                    </AnimatePresence>

                    {/* measured — halo then crisp; snaps to the fixed board in step 04 */}
                    <motion.path
                      d={active === 3 ? paths.expected : paths.measured}
                      fill="none"
                      stroke="hsl(150 85% 62% / 0.18)"
                      strokeWidth="7"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: EASE }}
                    />
                    <motion.path
                      d={active === 3 ? paths.expected : paths.measured}
                      fill="none"
                      stroke="hsl(150 85% 62%)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: EASE }}
                    />
                  </svg>

                  {/* overlays */}
                  <AnimatePresence mode="wait">
                    {active === 1 && (
                      <motion.div
                        key="dv"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-4 top-4 font-mono text-right"
                      >
                        <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">ΔV on CLK_A</div>
                        <div className="text-xl text-white tabular-nums">1.42 V</div>
                        <div className="text-[10px] text-white/45">peak, at t = 110 µs</div>
                      </motion.div>
                    )}
                    {active === 2 && (
                      <motion.div
                        key="cause"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 2.2, duration: 0.5 }}
                        className="absolute left-4 right-4 bottom-4 md:left-auto md:max-w-[60%] rounded-xl border border-primary/40 bg-ink/90 px-4 py-3"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-1">likely cause</div>
                        <div className="text-sm text-white">{sc.fault}</div>
                        <div className="text-xs text-white/55 font-light mt-1">{sc.evidence}</div>
                      </motion.div>
                    )}
                    {active === 3 && (
                      <motion.div
                        key="ok"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 1.2, duration: 0.5, ease: EASE }}
                        className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-[hsl(var(--trace))]/40 bg-ink/90 px-3 py-1.5 font-mono text-[11px] text-trace"
                      >
                        <Check className="h-3.5 w-3.5" /> residual 0.004 — matches sim
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  <span>step {steps[active].n} · {steps[active].title}</span>
                  <span className="flex gap-1.5">
                    {steps.map((_, i) => (
                      <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-primary" : "w-3 bg-white/20"}`} />
                    ))}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
