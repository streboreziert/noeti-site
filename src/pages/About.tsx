import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Activity, Compass, Shield, Radio, Map } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Stats from "@/components/Stats";
import bannerImage from "@/assets/detail-lake-2.jpg";
import { easeOutExpo, bannerTransition } from "@/lib/motion";

const method = [
  {
    step: "01",
    title: "Object",
    body: "A netlist is topology, potential, current, and constraint. Those quantities — not a description of a schematic — are the state the model was trained to occupy.",
  },
  {
    step: "02",
    title: "Training",
    body: "We designed the architecture and ran the training. Simulated trajectories and instrument-grade state. Closed weights. The prior is physical — not a next-word model of electronics.",
  },
  {
    step: "03",
    title: "Inference",
    body: "After fabrication, inference takes a measured trajectory and a simulated prior (.tran / .ac / operating point). The residual ΔV, ΔI is the object. Candidate faults are rolled forward until one regenerates the captured signal.",
  },
];

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

const About = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />

      <div className="relative w-full h-[50vh] overflow-hidden">
        <motion.img
          src={bannerImage}
          alt="Noeti — physical AI trained on circuits"
          style={{ y }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={bannerTransition}
          className="absolute inset-0 w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease: easeOutExpo }}
            className="px-6 md:px-12 lg:px-16 pb-10 text-white"
          >
            <span className="text-[11px] uppercase tracking-wider text-white/70">About</span>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight mt-2 max-w-xl">
              Physical inference for circuits that already exist.
            </h1>
          </motion.div>
        </div>
      </div>

      <main>
        <section className="py-24 lg:py-32 px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: easeOutExpo }}
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Thesis</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2 mb-8">
                Language encodes text. Circuits conserve charge.
              </h2>

              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  A netlist is a conservative dynamical system: Kirchhoff still has to close. Turning the schematic
                  into a sentence throws away the state the bench still has to satisfy — potential, current, constraint.
                  A language model is the wrong object for diagnosis after fabrication.
                </p>
                <p>
                  Noeti is a physical AI we designed and trained — architecture, run, and closed weights — on
                  simulated trajectories and measured state. After fabrication, inference takes a measured trajectory
                  and a simulated prior from .tran, .ac, or operating point.
                </p>
                <p>
                  The residual ΔV, ΔI is what the model reads. Candidate faults are rolled forward in simulation.
                  It returns the hypothesis whose predicted residual regenerates the capture: net, part, next probe
                  — evidence, not a paragraph.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Stats />

        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-secondary/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: easeOutExpo }}
              className="mb-16"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Method</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2 mb-4">
                Object. Training. Inference.
              </h2>
              <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-2xl">
                The work is after fabrication: bring-up, diagnosis, field, returns — a closed-weight model
                over a realized netlist. Time saved on analog and legacy work is how a lab feels it.
                First-pass fault named is how the numbers read.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-8">
              {method.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: index * 0.1, ease: easeOutExpo }}
                  className="grid grid-cols-[auto_1fr] gap-6 items-start border-t border-border pt-8"
                >
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground pt-1">{item.step}</span>
                  <div>
                    <h3 className="text-lg font-light tracking-tight mb-2 text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-secondary/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: easeOutExpo }}
              className="text-center mb-16"
            >
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">What we stand for</span>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight mt-2">Closed weights. Physics in the loop.</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.75, delay: index * 0.08, ease: easeOutExpo }}
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
      </main>

      <Footer />
    </div>
  );
};

export default About;
