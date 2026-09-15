import { useEffect, useRef, useState } from "react";
import { scenarios, type Scenario, type Wave } from "./waveforms";
import type { Phase, ScopeState } from "./ScopeCanvas";

export const MEASURE_MS = 2200;
export const CANDIDATE_MS = 1300;
export const NAMED_MS = 3600;

export interface SequenceView {
  scenario: Scenario;
  phase: Phase;
  candidateIndex: number;
  residual: number; // RMS of (candidate sim − measured), in screen units
  index: number;
}

/** RMS distance between two waves, sampled coarsely. */
const rms = (a: Wave, b: Wave) => {
  let s = 0;
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const d = a(t) - b(t);
    s += d * d;
  }
  return Math.sqrt(s / (n + 1));
};

/**
 * Drives the scope through measure → search → named for each scenario in a
 * loop. The canvas reads `stateRef` every frame; React re-renders only on
 * phase/candidate changes and a throttled residual readout.
 */
export const useScopeSequence = (autoplay = true, startIndex = 0) => {
  const stateRef = useRef<ScopeState>({
    scenario: scenarios[startIndex],
    phase: "measure",
    sweep: 0,
    simFrom: null,
    simTo: null,
    blend: 0,
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
    let lastTick = 0;
    let stopped = false;

    const set = (p: Phase, i: number) => {
      phase = p;
      index = i;
      phaseStart = performance.now();
      lastCandidate = -1;
      const sc = scenarios[i];
      const last = sc.candidates[sc.candidates.length - 1].sim;
      stateRef.current = {
        scenario: sc,
        phase: p,
        sweep: p === "measure" ? 0 : 1,
        simFrom: p === "named" ? last : null,
        simTo: p === "named" ? last : null,
        blend: p === "named" ? 1 : 0,
      };
      setView((v) => ({ ...v, scenario: sc, phase: p, candidateIndex: 0, residual: p === "named" ? 0.004 : 1, index: i }));
    };

    const tick = (now: number) => {
      if (stopped) return;
      // don't burn cycles in a background tab
      if (document.hidden) {
        raf = requestAnimationFrame(tick);
        phaseStart = now - Math.min(now - phaseStart, 1);
        return;
      }
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
        if (ci !== lastCandidate) {
          lastCandidate = ci;
          s.simFrom = ci === 0 ? sc.expected : sc.candidates[ci - 1].sim;
          s.simTo = sc.candidates[ci].sim;
          setView((v) => ({ ...v, candidateIndex: ci }));
        }
        // settle onto this candidate in the first 40% of its window, then hold
        const b = Math.min(1, local / 0.4);
        s.blend = 1 - Math.pow(1 - b, 3);
        if (now - lastTick > 160 && s.simTo) {
          lastTick = now;
          const from = s.simFrom ?? sc.expected;
          const to = s.simTo;
          const bl = s.blend;
          const cur: Wave = (t) => from(t) + (to(t) - from(t)) * bl;
          const r = Math.max(0.004, rms(cur, sc.measured));
          setView((v) => ({ ...v, residual: r }));
        }
        if (el > n * CANDIDATE_MS + 150) set("named", index);
      } else if (el > NAMED_MS) {
        set("measure", (index + 1) % scenarios.length);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [autoplay, startIndex]);

  return { stateRef, view };
};
