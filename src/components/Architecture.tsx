import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cpu, Activity, GitCompare, Wrench, Lock, MapPin } from "lucide-react";
import { Reveal } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import Chip from "./Chip";
import { EASE } from "@/lib/motion";

const items = [
  { icon: Cpu, title: "Proprietary physical AI", body: "Our architecture, our training run, our closed weights. Never trained on language about electronics." },
  { icon: Activity, title: "State from the bench", body: "V(t), I(t) in SI units, from a live scope, a logger, or an uploaded capture. Not a prompt." },
  { icon: GitCompare, title: "Residual inference", body: "Expected state from .tran / .ac / operating point, minus what you measured. It reads ΔV, ΔI." },
  { icon: Wrench, title: "After fabrication", body: "Bring-up, diagnosis, field, returns. The regime this model was trained for." },
  { icon: Lock, title: "Closed weights", body: "Physics-constrained. A hypothesis is a fault simulation that regenerates the captured signal." },
  { icon: MapPin, title: "Riga", body: "Designed, trained, and operated from Latvia. One inference box serves every plan." },
];

// Card anchors on a 1000 × 640 stage (desktop). Left column feeds in from the right edge of the card, right column from the left.
const W = 1000;
const H = 640;
const CARD_W = 290;
const slots = [
  { x: 0, y: 40 },
  { x: 0, y: 260 },
  { x: 0, y: 480 },
  { x: W - CARD_W, y: 40 },
  { x: W - CARD_W, y: 260 },
  { x: W - CARD_W, y: 480 },
];
const CX = W / 2;
const CY = H / 2;
const CARD_H = 112;

const linkPath = (i: number) => {
  const s = slots[i];
  const left = i < 3;
  const sx = left ? s.x + CARD_W : s.x;
  const sy = s.y + CARD_H / 2;
  const ex = left ? CX - 70 : CX + 70;
  const ey = CY + (sy - CY) * 0.12;
  const c1x = sx + (left ? 120 : -120);
  const c2x = ex + (left ? -90 : 90);
  return `M${sx} ${sy} C ${c1x} ${sy}, ${c2x} ${ey}, ${ex} ${ey}`;
};

/** Honeyb-style hub: the model hovers in the middle, the six facts feed into it. */
const Architecture = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.15 });
  return (
  <section id="architecture" className="relative py-28 lg:py-36 bg-ink/85 text-white overflow-hidden border-t border-white/10">
    <div className="container mx-auto px-6 lg:px-12 relative">
      <div className="grid lg:grid-cols-12 gap-10 mb-14 lg:mb-10 items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-5 block">Architecture and inference</span>
          </Reveal>
          <TextReveal as="h2" text="Physical inference for circuits that already exist." className="font-serif text-3xl md:text-5xl font-normal tracking-[-0.02em]" />
        </div>
        <Reveal className="lg:col-span-5" delay={0.2}>
          <p className="text-white/65 font-light leading-relaxed">
            Language models encode text. A circuit is topology, potential, current, and constraint. Noeti is a physical AI we designed
            and trained for that object, then closed the weights.
          </p>
        </Reveal>
      </div>

      {/* Desktop stage */}
      <div ref={stageRef} className="hidden lg:block relative mx-auto max-w-[1000px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-hidden>
          {items.map((_, i) => (
            <g key={i}>
              <motion.path
                d={linkPath(i)}
                fill="none"
                stroke="rgba(255,255,255,0.14)"
                strokeWidth="1.5"
                strokeDasharray="5 7"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.1, delay: 0.3 + i * 0.1, ease: EASE }}
              />
              {/* a packet of measured state flowing into the model — only animated while on screen */}
              {inView && (
                <>
                  <circle r="3.5" fill="hsl(150 85% 62%)">
                    <animateMotion dur={`${3.2 + (i % 3) * 0.6}s`} begin={`${i * 0.55}s`} repeatCount="indefinite" path={linkPath(i)} />
                  </circle>
                  <circle r="8" fill="hsl(150 85% 62%)" opacity="0.18">
                    <animateMotion dur={`${3.2 + (i % 3) * 0.6}s`} begin={`${i * 0.55}s`} repeatCount="indefinite" path={linkPath(i)} />
                  </circle>
                </>
              )}
            </g>
          ))}
        </svg>

        {/* the model */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Chip size={176} />
        </div>

        {items.map((it, i) => {
          const s = slots[i];
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: EASE }}
              className="absolute rounded-lg border border-white/12 bg-[hsl(50_8%_9%)] hover:border-primary/50 transition-colors duration-300"
              style={{ left: `${(s.x / W) * 100}%`, top: `${(s.y / H) * 100}%`, width: `${(CARD_W / W) * 100}%`, minHeight: `${(CARD_H / H) * 100}%` }}
            >
              <div className="p-5 flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <it.icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[15px] leading-snug">{it.title}</div>
                  <p className="text-[13px] text-white/55 font-light leading-relaxed mt-1">{it.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Phones and tablets: chip on top, cards in a grid */}
      <div className="lg:hidden">
        <div className="flex justify-center py-10">
          <Chip size={140} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.05}>
              <div className="h-full rounded-lg border border-white/12 bg-[hsl(50_8%_9%)] p-5 flex gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <it.icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[15px] leading-snug">{it.title}</div>
                  <p className="text-[13px] text-white/55 font-light leading-relaxed mt-1">{it.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
  );
};

export default Architecture;
