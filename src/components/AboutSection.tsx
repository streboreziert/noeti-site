import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Cpu, Activity, Compass, Shield, Radio, Map, ArrowRight } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

const values = [
  {
    icon: Cpu,
    title: "Proprietary physical AI",
    description:
      "Our architecture, our training run, our closed weights. Trained on simulated trajectories and measured state — never on language about electronics.",
  },
  {
    icon: Radio,
    title: "State from the bench",
    description:
      "A live oscilloscope, a logger, or an uploaded capture. The input is V(t), I(t) in SI units — not a prompt. Bench and model see the same representation.",
  },
  {
    icon: Activity,
    title: "Residual inference",
    description:
      "Expected state from .tran / .ac / operating point, minus what you measured. The model reads ΔV, ΔI — the disagreement on a conservative netlist.",
  },
  {
    icon: Shield,
    title: "After fabrication",
    description:
      "Synthesis is done. The unsolved work is the realized circuit: bring-up, diagnosis, field, returns. That is the regime this model was trained for.",
  },
  {
    icon: Compass,
    title: "Closed weights",
    description:
      "Physics-constrained, not a language prior. Kirchhoff still has to close. A hypothesis is a fault simulation that would regenerate the captured signal.",
  },
  {
    icon: Map,
    title: "Latvia",
    description:
      "Designed, trained, and operated from Latvia. Usage and live projects are the meters. Same closed-weight model on Solo, Lab, and Company.",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section id="about" className="py-32 lg:py-40 bg-background" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">About</span>
          <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground tracking-tight">
            Physical inference for circuits that already exist.
          </h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mb-5">
            Language models encode text. A circuit is topology, potential, current, and constraint.
            Noeti is a physical AI we designed and trained for that object — then closed the weights.
            After fabrication, you give it a measured signal and a simulated prior. It reads the residual
            ΔV, ΔI and returns a fault hypothesis with evidence: which disagreement would produce this signal.
          </p>
          <p className="text-sm text-muted-foreground font-light leading-relaxed">
            Live at three companies. First-pass fault named ≈80% of the time.
            Analog bring-up falls ≈40%; on legacy netlists, ≈65%.
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 mt-8 text-xs uppercase tracking-wider text-foreground hover:text-primary transition-colors duration-500"
          >
            Architecture and inference
            <ArrowRight className="h-3 w-3" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 22 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.12 + index * 0.08, ease: easeOutExpo }}
            >
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.55, ease: easeOutExpo }}
                className="p-8 h-full border border-border rounded-lg bg-card shadow-soft hover:shadow-xl hover:shadow-primary/5 transition-shadow duration-700"
              >
                <value.icon className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-lg font-light tracking-tight mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{value.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
