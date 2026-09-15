import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";

/**
 * A graticule down the left edge of the page. The green trace draws as you
 * scroll, like a sweep across a scope screen. One fixed SVG, transforms only.
 */
const TraceRail = () => {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.4 });
  const cy = useTransform(p, [0, 1], [72, 648]);
  const readout = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(p, "change", (v) => {
    if (readout.current) readout.current.textContent = v.toFixed(2);
  });

  return (
    <div className="hidden xl:flex fixed left-5 top-0 h-screen w-10 z-[90] pointer-events-none flex-col items-center" aria-hidden>
      <svg viewBox="0 0 40 720" className="h-full w-10" preserveAspectRatio="xMidYMid meet">
        {/* graticule */}
        <line x1="20" y1="72" x2="20" y2="648" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        {Array.from({ length: 9 }, (_, i) => {
          const y = 72 + i * 72;
          const major = i % 2 === 0;
          return <line key={i} x1={major ? 12 : 16} y1={y} x2={major ? 28 : 24} y2={y} stroke="rgba(255,255,255,0.18)" strokeWidth="1" />;
        })}
        {/* the sweep */}
        <motion.line x1="20" y1="72" x2="20" y2="648" stroke="hsl(150 85% 62%)" strokeWidth="1.5" style={{ pathLength: p }} strokeLinecap="round" />
        <motion.circle cx="20" r="3" fill="hsl(150 85% 62%)" style={{ cy }} />
        <motion.circle cx="20" r="8" fill="hsl(150 85% 62%)" opacity="0.18" style={{ cy }} />
      </svg>
      <span ref={readout} className="absolute bottom-[6%] font-mono text-[10px] tabular-nums text-white/40">
        0.00
      </span>
    </div>
  );
};

export default TraceRail;
