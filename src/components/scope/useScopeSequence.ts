import { useEffect, useRef, useState } from "react";
import { scenarios, type Scenario } from "./waveforms";
import type { Phase, ScopeState } from "./ScopeCanvas";

export const MEASURE_MS = 2200;
export const CANDIDATE_MS = 1150;
export const NAMED_MS = 3400;

export interface SequenceView {
  scenario: Scenario;
  phase: Phase;
  candidateIndex: number; // which candidate is being simulated (search phase)
  residual: number; // 0..1, shown in the HUD
  index: number;
}

/**
 * Drives the scope through measure → search → named for each scenario in a
 * loop. The canvas reads `stateRef` every frame; React re-renders only on
 * phase/candidate changes for the HUD.
 */
export const useScopeSequence = (autoplay = true, startIndex = 0) => {
  const stateRef = useRef<ScopeState>({
    scenario: scenarios[startIndex],
    phase: "measure",
    sweep: 0,
    fit: 0,
    since: performance.now(),
  });
  const [view, setView] = useState<SequenceView>({
    scenario: scenarios[startIndex],
    phase: "measure",
    candidateIndex: 0,
    residual: 1,
    index: startIndex,
  });

  useEffect(() => {
    if (!autoplay) return;
    let raf = 0;
    let index = startIndex;
    let phase: Phase = "measure";
    let phaseStart = performance.now();
    let lastCandidate = -1;
    let lastResidualTick = 0;

    const set = (p: Phase, i: number) => {
      phase = p;
      index = i;
      phaseStart = performance.now();
      lastCandidate = -1;
      stateRef.current = { scenario: scenarios[i], phase: p, sweep: p === "measure" ? 0 : 1, fit: 0, since: phaseStart };
      setView((v) => ({ ...v, scenario: scenarios[i], phase: p, candidateIndex: 0, residual: p === "named" ? 0.03 : 1, index: i }));
    };

    const tick = (now: number) => {
      const s = stateRef.current;
      const el = now - phaseStart;
      const sc = scenarios[index];
      if (phase === "measure") {
        s.sweep = Math.min(1, el / MEASURE_MS);
        if (el > MEASURE_MS + 350) set("search", index);
      } else if (phase === "search") {
        const n = sc.candidates.length;
        const ci = Math.min(n - 1, Math.floor(el / CANDIDATE_MS));
        const local = (el - ci * CANDIDATE_MS) / CANDIDATE_MS;
        // each candidate gets closer; the last one lands exactly
        const from = ci / n;
        const to = (ci + 1) / n;
        const eased = 1 - Math.pow(1 - Math.min(1, local * 1.4), 3);
        s.fit = from + (to - from) * eased;
        if (ci !== lastCandidate) {
          lastCandidate = ci;
          setView((v) => ({ ...v, candidateIndex: ci }));
        }
        if (now - lastResidualTick > 90) {
          lastResidualTick = now;
          const r = Math.max(0.03, 1 - s.fit) * (0.9 + Math.random() * 0.2);
          setView((v) => ({ ...v, residual: r }));
        }
        if (el > n * CANDIDATE_MS + 200) set("named", index);
      } else {
        s.fit = 1;
        if (el > NAMED_MS) set("measure", (index + 1) % scenarios.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, startIndex]);

  return { stateRef, view };
};
