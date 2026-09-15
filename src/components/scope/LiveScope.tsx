import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, Radio, Crosshair } from "lucide-react";
import ScopeCanvas from "./ScopeCanvas";
import { useScopeSequence } from "./useScopeSequence";
import { scenarios } from "./waveforms";
import { EASE } from "@/lib/motion";

interface LiveScopeProps {
  className?: string;
  compact?: boolean;
}

const phaseMeta = {
  measure: { icon: Radio, label: "Measuring", hint: "reading V(t) from the bench" },
  search: { icon: Search, label: "Simulating faults", hint: "which disagreement makes this trace?" },
  named: { icon: Crosshair, label: "Fault named", hint: "residual collapsed" },
} as const;

/** The hero instrument: a scope screen plus a HUD that narrates measure → search → named. */
const LiveScope = ({ className = "", compact = false }: LiveScopeProps) => {
  const { stateRef, view } = useScopeSequence(true);
  const { scenario, phase, candidateIndex, residual, index } = view;
  const PhaseIcon = phaseMeta[phase].icon;

  return (
    <div className={`relative rounded-lg border border-white/10 bg-ink shadow-hover overflow-hidden ${className}`}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/55">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex items-center gap-1.5 text-trace">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ backgroundColor: "hsl(var(--trace))", opacity: 0.7 }} />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "hsl(var(--trace))" }} />
            </span>
            CH1
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={scenario.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="truncate text-white/80"
            >
              {scenario.net}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span className="normal-case">{scenario.timebase}</span>
          <span className="normal-case">{scenario.volts}</span>
          <span className="text-white/35">
            {String(index + 1).padStart(2, "0")}/{String(scenarios.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Screen */}
      <div className={`relative ${compact ? "h-[220px] md:h-[260px]" : "h-[260px] md:h-[340px]"}`}>
        <ScopeCanvas stateRef={stateRef} className="absolute inset-0 w-full h-full" />
        {/* legend */}
        <div className="absolute left-3 top-3 flex flex-col gap-1 font-mono text-[10px] tracking-wider">
          <span className="flex items-center gap-2 text-trace">
            <span className="h-px w-5" style={{ backgroundColor: "hsl(var(--trace))" }} /> measured
          </span>
          <AnimatePresence>
            {phase !== "measure" && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-amber"
              >
                <span className="h-px w-5 border-t border-dashed" style={{ borderColor: "hsl(var(--amber))" }} /> simulation said
              </motion.span>
            )}
            {phase !== "measure" && (
              <motion.span
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2"
                style={{ color: "hsl(var(--trace-sim))" }}
              >
                <span className="h-px w-5" style={{ backgroundColor: "hsl(var(--trace-sim))" }} /> candidate fault, simulated
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* residual readout */}
        <AnimatePresence>
          {phase !== "measure" && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-3 top-3 text-right font-mono"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">r = y<sub>scope</sub> − ŷ<sub>sim</sub></div>
              <div className={`text-xl md:text-2xl tabular-nums ${residual < 0.05 ? "text-trace" : "text-white"}`}>{residual.toFixed(3)}<span className="text-xs text-white/40 ml-1">rms</span></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* fault callout */}
        <AnimatePresence>
          {phase === "named" && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="absolute left-3 right-3 bottom-3 md:left-auto md:max-w-[62%] rounded-xl border border-primary/40 bg-ink/95 px-4 py-3"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary mb-1">
                <Check className="h-3 w-3" /> likely cause
              </div>
              <div className="text-sm md:text-base text-white leading-snug">{scenario.fault}</div>
              {!compact && <div className="text-xs text-white/55 font-light mt-1 leading-relaxed">{scenario.evidence}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HUD: phase + candidates */}
      <div className="border-t border-white/10 px-4 py-3 grid gap-3 md:grid-cols-[auto_1fr] md:items-center">
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em]">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${phase === "named" ? "bg-primary text-primary-foreground" : "bg-white/10 text-white"}`}>
            <PhaseIcon className={`h-3.5 w-3.5 ${phase === "search" ? "animate-spin [animation-duration:2.4s]" : ""}`} />
          </span>
          <div className="leading-tight">
            <div className="text-white">{phaseMeta[phase].label}</div>
            <div className="text-white/40 normal-case tracking-normal font-sans text-xs">{phaseMeta[phase].hint}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:justify-end">
          {scenario.candidates.map(({ label: c }, i) => {
            const tried = phase === "named" || (phase === "search" && i < candidateIndex);
            const active = phase === "search" && i === candidateIndex;
            const answer = i === scenario.candidates.length - 1 && phase === "named";
            return (
              <motion.span
                key={c}
                layout
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: phase === "measure" ? 0.25 : 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`font-mono text-[10px] md:text-[11px] px-2.5 py-1 rounded-full border transition-colors duration-300 ${
                  answer
                    ? "border-primary bg-primary/20 text-primary"
                    : active
                      ? "border-[hsl(var(--trace-sim))] text-white"
                      : tried
                        ? "border-white/10 text-white/35 line-through"
                        : "border-white/10 text-white/60"
                }`}
              >
                {active && <span className="inline-block h-1.5 w-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: "hsl(var(--trace-sim))" }} />}
                {c}
              </motion.span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveScope;
