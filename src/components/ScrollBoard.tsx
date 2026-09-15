import { useEffect, useRef } from "react";

/**
 * The page's background is a board that routes itself as you scroll.
 * A fixed canvas behind everything; copper traces, pads and parts appear in
 * a fixed order as scroll progress goes 0 → 1, with a glowing routing head
 * on whatever trace is being drawn right now. Redraws only when the scroll
 * position changes, so it costs nothing while the page is still.
 */

interface Trace {
  pts: [number, number][];
  len: number; // total length
  start: number; // progress at which drawing begins
  end: number; // progress at which it is complete
  bus: number; // 0..3 parallel copies
}
interface Part {
  x: number;
  y: number;
  horiz: boolean;
  at: number; // progress at which it appears
  kind: "r" | "c" | "ic";
  w: number;
  h: number;
}

const mulberry = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const COPPER = "hsl(42 45% 58%)";
const COPPER_DIM = "hsl(42 30% 34%)";

const ScrollBoard = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0,
      h = 0,
      grid = 26;
    let traces: Trace[] = [];
    let parts: Part[] = [];
    let lastP = -1;
    let raf = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      grid = w < 640 ? 22 : 28;
      const rnd = mulberry(7);
      const cols = Math.ceil(w / grid) + 2;
      const rows = Math.ceil(h / grid) + 2;
      const count = Math.round(Math.min(110, Math.max(36, (w * h) / 14000)));
      traces = [];
      for (let i = 0; i < count; i++) {
        let x = Math.floor(rnd() * cols) * grid - grid;
        let y = Math.floor(rnd() * rows) * grid - grid;
        let horiz = rnd() < 0.5;
        const pts: [number, number][] = [[x, y]];
        const segs = 2 + Math.floor(rnd() * 4);
        for (let s = 0; s < segs; s++) {
          const n = (3 + Math.floor(rnd() * 9)) * grid;
          if (horiz) x += rnd() < 0.5 ? -n : n;
          else y += rnd() < 0.5 ? -n : n;
          pts.push([x, y]);
          // 45° jog
          const jx = (rnd() < 0.5 ? -1 : 1) * grid * (1 + Math.floor(rnd() * 2));
          const jy = (rnd() < 0.5 ? -1 : 1) * grid * (1 + Math.floor(rnd() * 2));
          x += jx;
          y += jy;
          pts.push([x, y]);
          horiz = !horiz;
        }
        let len = 0;
        for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
        // stagger: 25% of the board is routed at the top of the page; the rest fills in with scroll
        const start = i < count * 0.25 ? -1 : 0.02 + rnd() * 0.85;
        const end = start < 0 ? 0 : Math.min(1, start + 0.06 + rnd() * 0.1);
        const bus = rnd() < 0.35 ? 1 + Math.floor(rnd() * 3) : 0;
        traces.push({ pts, len, start, end, bus });
      }
      parts = [];
      const pcount = Math.round(count * 0.7);
      for (let i = 0; i < pcount; i++) {
        const kind = rnd() < 0.12 ? "ic" : rnd() < 0.5 ? "r" : "c";
        parts.push({
          x: Math.floor(rnd() * cols) * grid,
          y: Math.floor(rnd() * rows) * grid,
          horiz: rnd() < 0.5,
          at: i < pcount * 0.2 ? 0 : 0.05 + rnd() * 0.9,
          kind,
          w: kind === "ic" ? grid * (3 + Math.floor(rnd() * 4)) : grid * 0.9,
          h: kind === "ic" ? grid * (3 + Math.floor(rnd() * 3)) : grid * 0.42,
        });
      }
      lastP = -1;
    };

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const drawTrace = (t: Trace, f: number, offset: number, head: boolean) => {
      // draw up to fraction f of the polyline
      const target = t.len * f;
      let acc = 0;
      ctx.beginPath();
      ctx.moveTo(t.pts[0][0] + offset, t.pts[0][1] + offset);
      let hx = t.pts[0][0],
        hy = t.pts[0][1];
      for (let k = 1; k < t.pts.length; k++) {
        const [ax, ay] = t.pts[k - 1];
        const [bx, by] = t.pts[k];
        const seg = Math.hypot(bx - ax, by - ay);
        if (acc + seg <= target) {
          ctx.lineTo(bx + offset, by + offset);
          acc += seg;
          hx = bx;
          hy = by;
        } else {
          const r = (target - acc) / seg;
          hx = ax + (bx - ax) * r;
          hy = ay + (by - ay) * r;
          ctx.lineTo(hx + offset, hy + offset);
          break;
        }
      }
      ctx.stroke();
      if (head && f < 1) {
        // routing head
        ctx.fillStyle = "rgba(96,245,170,0.9)";
        ctx.beginPath();
        ctx.arc(hx + offset, hy + offset, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(96,245,170,0.18)";
        ctx.beginPath();
        ctx.arc(hx + offset, hy + offset, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      return [hx, hy] as const;
    };

    const draw = () => {
      raf = 0;
      const p = reduced ? 1 : progress();
      if (Math.abs(p - lastP) < 0.0008) return;
      lastP = p;
      ctx.clearRect(0, 0, w, h);
      // slow drift: the whole board slides a little with scroll
      const drift = -p * 60;
      ctx.save();
      ctx.translate(0, drift);

      // ground grid
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += grid) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h + 80);
      }
      for (let y = 0; y <= h + 80; y += grid) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      // parts
      for (const pt of parts) {
        if (p < pt.at) continue;
        const a = Math.min(1, (p - pt.at) / 0.04 + (pt.at === 0 ? 1 : 0));
        ctx.globalAlpha = 0.55 * a;
        if (pt.kind === "ic") {
          ctx.fillStyle = "rgba(255,255,255,0.03)";
          ctx.strokeStyle = "rgba(255,255,255,0.14)";
          ctx.fillRect(pt.x, pt.y, pt.w, pt.h);
          ctx.strokeRect(pt.x + 0.5, pt.y + 0.5, pt.w, pt.h);
          ctx.fillStyle = COPPER_DIM;
          for (let x = pt.x + grid * 0.5; x < pt.x + pt.w; x += grid * 0.5) {
            ctx.fillRect(x - 2, pt.y - 6, 4, 6);
            ctx.fillRect(x - 2, pt.y + pt.h, 4, 6);
          }
        } else {
          const W = pt.horiz ? pt.w : pt.h;
          const H = pt.horiz ? pt.h : pt.w;
          ctx.fillStyle = "rgba(255,255,255,0.05)";
          ctx.fillRect(pt.x - W / 2, pt.y - H / 2, W, H);
          ctx.fillStyle = COPPER_DIM;
          if (pt.horiz) {
            ctx.fillRect(pt.x - W / 2, pt.y - H / 2, 4, H);
            ctx.fillRect(pt.x + W / 2 - 4, pt.y - H / 2, 4, H);
          } else {
            ctx.fillRect(pt.x - W / 2, pt.y - H / 2, W, 4);
            ctx.fillRect(pt.x - W / 2, pt.y + H / 2 - 4, W, 4);
          }
        }
      }
      ctx.globalAlpha = 1;

      // traces
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      let headsDrawn = 0;
      for (const t of traces) {
        const f = t.start < 0 ? 1 : Math.min(1, Math.max(0, (p - t.start) / (t.end - t.start)));
        if (f <= 0) continue;
        const copies = t.bus + 1;
        for (let c = 0; c < copies; c++) {
          const off = c * 7;
          ctx.strokeStyle = f >= 1 ? COPPER_DIM : COPPER;
          ctx.globalAlpha = f >= 1 ? 0.55 : 0.85;
          ctx.lineWidth = 2;
          const head = c === 0 && headsDrawn < 6;
          const [hx, hy] = drawTrace(t, f, off, head);
          if (head && f < 1) headsDrawn++;
          // pads at the ends of finished traces
          if (f >= 1) {
            ctx.fillStyle = COPPER_DIM;
            for (const [px, py] of [t.pts[0], t.pts[t.pts.length - 1]]) {
              ctx.beginPath();
              ctx.arc(px + off, py + off, 4.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = "rgba(0,0,0,0.9)";
              ctx.beginPath();
              ctx.arc(px + off, py + off, 1.8, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = COPPER_DIM;
            }
          } else if (c === 0) {
            void hx;
            void hy;
          }
        }
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      build();
      schedule();
    };

    build();
    draw();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-70"
      style={{ maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.75))" }}
    />
  );
};

export default ScrollBoard;
