import { motion } from "framer-motion";
import { Cpu, Activity, GitCompare, Wrench, Lock, MapPin } from "lucide-react";
import { Reveal, Stagger, RevealItem } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import { TiltCard } from "./motion/TiltCard";

const items = [
  {
    icon: Cpu,
    title: "Proprietary physical AI",
    body: "Our architecture, our training run, our closed weights. Trained on simulated trajectories and measured state — never on language about electronics.",
  },
  {
    icon: Activity,
    title: "State from the bench",
    body: "A live oscilloscope, a logger, or an uploaded capture. The input is V(t), I(t) in SI units — not a prompt. Bench and model see the same representation.",
  },
  {
    icon: GitCompare,
    title: "Residual inference",
    body: "Expected state from .tran / .ac / operating point, minus what you measured. The model reads ΔV, ΔI — the disagreement on a conservative netlist.",
  },
  {
    icon: Wrench,
    title: "After fabrication",
    body: "Synthesis is done. The unsolved work is the realized circuit: bring-up, diagnosis, field, returns. That is the regime this model was trained for.",
  },
  {
    icon: Lock,
    title: "Closed weights",
    body: "Physics-constrained, not a language prior. Kirchhoff still has to close. A hypothesis is a fault simulation that would regenerate the captured signal.",
  },
  {
    icon: MapPin,
    title: "Latvia",
    body: "Designed, trained, and operated from Latvia. Usage and live projects are the meters. Same closed-weight model on Solo, Lab, and Company.",
  },
];

const Architecture = () => (
  <section id="architecture" className="relative py-28 lg:py-40 bg-ink text-white overflow-hidden grain">
    <div className="absolute inset-0 bg-dots-light opacity-25" />
    <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/15 blur-[160px]" />
    <div className="container mx-auto px-6 lg:px-12 relative">
      <div className="grid lg:grid-cols-12 gap-10 mb-16 lg:mb-20 items-end">
        <div className="lg:col-span-7">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-5 block">Architecture and inference</span>
          </Reveal>
          <TextReveal as="h2" text="Physical inference for circuits that already exist." className="text-3xl md:text-5xl font-light tracking-tight" />
        </div>
        <Reveal className="lg:col-span-5" delay={0.2}>
          <p className="text-white/65 font-light leading-relaxed">
            Language models encode text. A circuit is topology, potential, current, and constraint. Noeti is a physical AI we designed
            and trained for that object — then closed the weights. Give it a measured signal and a simulated prior; it returns a fault
            hypothesis with evidence.
          </p>
        </Reveal>
      </div>

      <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" gap={0.08}>
        {items.map((it) => (
          <RevealItem key={it.title}>
            <TiltCard className="group relative h-full" max={5}>
              <motion.div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition-colors duration-500 group-hover:border-primary/40 group-hover:bg-white/[0.05]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary mb-6">
                  <it.icon className="h-4 w-4" />
                </span>
                <h3 className="text-lg tracking-tight mb-3">{it.title}</h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">{it.body}</p>
              </motion.div>
            </TiltCard>
          </RevealItem>
        ))}
      </Stagger>
    </div>
  </section>
);

export default Architecture;
