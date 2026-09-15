import { useEffect, useRef, type MutableRefObject } from "react";
import type { Scenario, Wave } from "./waveforms";

export type Phase = "measure" | "search" | "named";

export interface ScopeState {
  scenario: Scenario;
  phase: Phase;
  /** 0..1 how much of the measured trace has been drawn */
  sweep: number;
  /** candidate being simulated: crossfades from `simFrom` to `simTo` */
  simFrom: Wave | null;
  simTo: Wave | null;
  blend: number;
}

interface Props {
  stateRef: MutableRefObject<ScopeState>;
  className?: string;
}

const COL = {
  grid: "rgba(120, 255, 190, 0.07)",
  gridStrong: "rgba(120, 255, 190, 0.14)",
  expected: "rgba(224, 178, 72, 0.9)",
  measured: "rgb(96, 245, 170)",
  sim: "rgb(120, 200, 255)",
};

/**
 * A phosphor oscilloscope screen. Reads the shared state ref every frame so
 * the React side can drive phases without re-rendering the canvas. Pauses
 * when scrolled out of view or the tab is hidden.
 */
const ScopeCanvas = ({ stateRef, className }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let w = 0,
      h = 0;
    let visible = true;
    const noise = new Float32Array(1024).map(() => (Math.random() - 0.5) * 2);
    const cursor = { t: -1, active: false };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      cursor.t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      cursor.active = true;
    };
    const onLeave = () => {
      cursor.active = false;
    };
    const voltsPerDiv = (label: string) => {
      const m = label.match(/([\d.]+)\s*(m?)V/);
      if (!m) return 1;
      return parseFloat(m[1]) * (m[2] === "m" ? 0.001 : 1);
    };
    const fmtV = (v: number) => (Math.abs(v) < 1 ? `${(v * 1000).toFixed(0)} mV` : `${v.toFixed(2)} V`);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const yOf = (v: number) => h / 2 - v * (h / 2) * 0.82;

    const tracePath = (fn: Wave, upTo = 1, jitter = 0) => {
      const n = Math.max(160, Math.floor(w / 3));
      ctx.beginPath();
      const last = Math.floor(n * upTo);
      for (let i = 0; i <= last; i++) {
        const t = i / n;
        const v = fn(t) + (jitter ? noise[i & 1023] * jitter : 0);
        if (i === 0) ctx.moveTo(0, yOf(v));
        else ctx.lineTo(t * w, yOf(v));
      }
    };

    const draw = (now: number) => {
      if (!visible) return;
      const s = stateRef.current;
      const { scenario, phase, sweep, simFrom, simTo, blend } = s;
      ctx.clearRect(0, 0, w, h);

      // grid: 10 x 8 divisions
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const x = Math.round((i / 10) * w) + 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let i = 0; i <= 8; i++) {
        const y = Math.round((i / 8) * h) + 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.strokeStyle = COL.grid;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(Math.round(w / 2) + 0.5, 0);
      ctx.lineTo(Math.round(w / 2) + 0.5, h);
      ctx.moveTo(0, Math.round(h / 2) + 0.5);
      ctx.lineTo(w, Math.round(h / 2) + 0.5);
      for (let i = 0; i <= 50; i++) {
        const x = (i / 50) * w;
        ctx.moveTo(x, h / 2 - 3);
        ctx.lineTo(x, h / 2 + 3);
      }
      ctx.strokeStyle = COL.gridStrong;
      ctx.stroke();

      const searching = phase !== "measure";

      // residual: shaded gap between what the simulation said and what came back
      if (searching) {
        const n = Math.floor(w / 4);
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const t = i / n;
          if (i === 0) ctx.moveTo(0, yOf(scenario.expected(t)));
          else ctx.lineTo(t * w, yOf(scenario.expected(t)));
        }
        for (let i = n; i >= 0; i--) {
          const t = i / n;
          ctx.lineTo(t * w, yOf(scenario.measured(t)));
        }
        ctx.closePath();
        ctx.fillStyle = phase === "named" ? "rgba(255,120,90,0.10)" : "rgba(255,120,90,0.22)";
        ctx.fill();

        // expected — dashed gold
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = COL.expected;
        tracePath(scenario.expected);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // candidate simulation — blue, crossfading between the faults being tried
      if (searching && simTo) {
        const from = simFrom ?? scenario.expected;
        const b = blend;
        const fn: Wave = b >= 1 ? simTo : (t) => from(t) + (simTo(t) - from(t)) * b;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = phase === "named" ? "rgba(120,200,255,0.5)" : COL.sim;
        tracePath(fn);
        ctx.stroke();
      }

      // measured — phosphor green, soft halo then crisp line
      const upTo = phase === "measure" ? sweep : 1;
      ctx.lineWidth = 5;
      ctx.strokeStyle = "rgba(96,245,170,0.16)";
      tracePath(scenario.measured, upTo, 0.012);
      ctx.stroke();
      ctx.lineWidth = 1.8;
      ctx.strokeStyle = COL.measured;
      tracePath(scenario.measured, upTo, 0.012);
      ctx.stroke();

      // sweep dot
      if (phase === "measure" && sweep < 1) {
        const x = sweep * w;
        const y = yOf(scenario.measured(sweep));
        ctx.fillStyle = "rgba(96,245,170,0.25)";
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e8fff4";
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // cursor measurement (hover)
      if (cursor.active) {
        const t = cursor.t;
        const x = t * w;
        const vpd = voltsPerDiv(scenario.volts);
        const ym = scenario.measured(t);
        const ye = scenario.expected(t);
        ctx.setLineDash([3, 5]);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(255,255,255,0.45)";
        ctx.beginPath();
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, h);
        ctx.stroke();
        ctx.setLineDash([]);
        // dots on both traces
        ctx.fillStyle = COL.measured;
        ctx.beginPath();
        ctx.arc(x, yOf(ym), 3.5, 0, Math.PI * 2);
        ctx.fill();
        if (searching) {
          ctx.fillStyle = COL.expected;
          ctx.beginPath();
          ctx.arc(x, yOf(ye), 3, 0, Math.PI * 2);
          ctx.fill();
        }
        // readout box
        const lines = [`t  ${(t * 10).toFixed(2)} div`, `y  ${fmtV(ym * 4 * vpd)}`];
        if (searching) lines.push(`Δ  ${fmtV((ym - ye) * 4 * vpd)}`);
        ctx.font = "11px 'IBM Plex Mono', ui-monospace, monospace";
        const bw = 118;
        const bh = 14 * lines.length + 12;
        const bx = x + 12 + bw > w ? x - 12 - bw : x + 12;
        const by = Math.min(h - bh - 8, Math.max(8, yOf(ym) - bh / 2));
        ctx.fillStyle = "rgba(10,11,9,0.92)";
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
        lines.forEach((ln, i) => {
          ctx.fillStyle = i === 0 ? "rgba(255,255,255,0.6)" : i === 1 ? COL.measured : "rgb(255,150,120)";
          ctx.fillText(ln, bx + 8, by + 17 + i * 14);
        });
      }

      // slow scanline
      const sy = ((now / 4000) % 1) * h;
      ctx.fillStyle = "rgba(255,255,255,0.02)";
      ctx.fillRect(0, sy - 30, w, 60);

      raf = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting && !document.hidden;
        if (visible) start();
      },
      { threshold: 0.05 },
    );
    const onVis = () => {
      visible = !document.hidden && visible;
      if (!document.hidden) {
        visible = true;
        start();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    io.observe(canvas);
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [stateRef]);

  return <canvas ref={ref} className={`${className ?? ""} cursor-crosshair`} aria-hidden />;
};

export default ScopeCanvas;
