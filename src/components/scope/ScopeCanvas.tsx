import { useEffect, useRef, type MutableRefObject } from "react";
import type { Scenario } from "./waveforms";

export type Phase = "measure" | "search" | "named";

export interface ScopeState {
  scenario: Scenario;
  phase: Phase;
  /** 0..1 how much of the measured trace has been drawn */
  sweep: number;
  /** 0..1 how close the simulated candidate is to the measured trace */
  fit: number;
  /** ms timestamp when the phase started */
  since: number;
}

interface Props {
  stateRef: MutableRefObject<ScopeState>;
  className?: string;
  /** draw the expected (simulation) trace */
  showExpected?: boolean;
}

const COL = {
  grid: "rgba(120, 255, 190, 0.07)",
  gridStrong: "rgba(120, 255, 190, 0.14)",
  expected: "rgba(224, 178, 72, 0.9)",
  measured: "rgb(96, 245, 170)",
  sim: "rgb(120, 200, 255)",
  residual: "rgba(255, 110, 90, 0.35)",
};

/**
 * A phosphor oscilloscope screen. Reads the shared state ref every frame so
 * the React side can drive phases without re-rendering the canvas.
 */
const ScopeCanvas = ({ stateRef, className, showExpected = true }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0,
      h = 0,
      dpr = 1;
    const noise = new Float32Array(2048).map(() => (Math.random() - 0.5) * 2);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const yOf = (v: number) => h / 2 - v * (h / 2) * 0.82;

    const tracePath = (fn: (t: number) => number, upTo = 1, jitter = 0) => {
      const n = Math.max(200, Math.floor(w / 2));
      ctx.beginPath();
      for (let i = 0; i <= n * upTo; i++) {
        const t = i / n;
        const v = fn(t) + (jitter ? noise[i % noise.length] * jitter : 0);
        const x = t * w;
        const y = yOf(v);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    };

    const draw = (now: number) => {
      const s = stateRef.current;
      ctx.clearRect(0, 0, w, h);

      // grid: 10 x 8 divisions
      ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        ctx.strokeStyle = i === 5 ? COL.gridStrong : COL.grid;
        ctx.beginPath();
        ctx.moveTo((i / 10) * w + 0.5, 0);
        ctx.lineTo((i / 10) * w + 0.5, h);
        ctx.stroke();
      }
      for (let i = 0; i <= 8; i++) {
        ctx.strokeStyle = i === 4 ? COL.gridStrong : COL.grid;
        ctx.beginPath();
        ctx.moveTo(0, (i / 8) * h + 0.5);
        ctx.lineTo(w, (i / 8) * h + 0.5);
        ctx.stroke();
      }
      // centre tick marks
      ctx.strokeStyle = COL.gridStrong;
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50) * w;
        ctx.beginPath();
        ctx.moveTo(x, h / 2 - 3);
        ctx.lineTo(x, h / 2 + 3);
        ctx.stroke();
      }

      const { scenario, phase, sweep, fit } = s;

      // residual shading between expected and measured while searching
      if (phase !== "measure" && showExpected) {
        const n = Math.floor(w / 3);
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const t = i / n;
          const x = t * w;
          if (i === 0) ctx.moveTo(x, yOf(scenario.expected(t)));
          else ctx.lineTo(x, yOf(scenario.expected(t)));
        }
        for (let i = n; i >= 0; i--) {
          const t = i / n;
          ctx.lineTo(t * w, yOf(scenario.measured(t)));
        }
        ctx.closePath();
        const alpha = phase === "named" ? 0.12 : 0.3 * (1 - fit * 0.6);
        ctx.fillStyle = `rgba(255, 120, 90, ${alpha})`;
        ctx.fill();
      }

      // expected (simulation) — dashed gold
      if (showExpected && phase !== "measure") {
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = COL.expected;
        tracePath(scenario.expected);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // simulated candidate — blue, morphing toward the measurement
      if (phase === "search" || phase === "named") {
        const f = phase === "named" ? 1 : fit;
        const wobble = phase === "search" ? Math.sin(now / 90) * 0.02 * (1 - f) : 0;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = phase === "named" ? "rgba(120,200,255,0.55)" : COL.sim;
        tracePath((t) => scenario.expected(t) + (scenario.measured(t) - scenario.expected(t)) * f + wobble);
        ctx.stroke();
      }

      // measured — phosphor green with glow, drawn up to the sweep position
      const upTo = phase === "measure" ? sweep : 1;
      const jitter = 0.012;
      ctx.lineWidth = 6;
      ctx.strokeStyle = "rgba(96,245,170,0.18)";
      tracePath(scenario.measured, upTo, jitter);
      ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = COL.measured;
      tracePath(scenario.measured, upTo, jitter);
      ctx.stroke();

      // sweep dot
      if (phase === "measure" && sweep < 1) {
        const x = sweep * w;
        const y = yOf(scenario.measured(sweep));
        const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
        g.addColorStop(0, "rgba(200,255,225,0.9)");
        g.addColorStop(1, "rgba(96,245,170,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
      }

      // subtle scanline
      const sy = ((now / 3000) % 1) * h;
      const sg = ctx.createLinearGradient(0, sy - 40, 0, sy + 40);
      sg.addColorStop(0, "rgba(255,255,255,0)");
      sg.addColorStop(0.5, "rgba(255,255,255,0.025)");
      sg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, sy - 40, w, 80);

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [stateRef, showExpected]);

  return <canvas ref={ref} className={className} aria-hidden />;
};

export default ScopeCanvas;
