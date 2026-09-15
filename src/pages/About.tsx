import { motion } from "framer-motion";
import { Cpu, Activity, GitCompare, Wrench, Lock, MapPin } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ParallaxBanner } from "@/components/motion/ParallaxBanner";
import { PageTransition } from "@/components/motion/PageTransition";
import { Reveal, Stagger, RevealItem } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Counter } from "@/components/motion/Counter";
import LiveScope from "@/components/scope/LiveScope";
import bannerImage from "@/assets/detail-contours.jpg";

const values = [
  { icon: Cpu, title: "Own model", description: "Circuit quantities, not language. Topology, potential, current, constraint. Weights are ours and closed." },
  { icon: Activity, title: "Pretrain", description: "Observed traces against predicted state. Residual r = y_scope − ŷ_sim, in volts and seconds." },
  { icon: GitCompare, title: "Reinforcement", description: "Reward: smaller residual, and a cause that still reproduces the waveform in sim. First run, about GPT-3 scale. Not finished." },
  { icon: Wrench, title: "On a board", description: "Signal in, cause out. Live at three companies. One inference box is enough to serve. Training is the expensive part." },
  { icon: Lock, title: "Closed weights", description: "Physics-constrained, not a language prior. A hypothesis is a fault simulation that would regenerate the captured signal." },
  { icon: MapPin, title: "Riga", description: "Designed, trained, and operated from Latvia. Priced like Latvia; the engineer-week it saves is priced like Sweden." },
];

const About = () => (
  <PageTransition className="min-h-screen overflow-x-hidden">
    <Navigation />
    <ParallaxBanner image={bannerImage} alt="Noeti — physical AI for circuits" eyebrow="About" title="Physical inference for circuits that already exist." />

    <main>
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">The inverse question</span>
            </Reveal>
            <TextReveal as="h2" text="SPICE asks: given this circuit, what voltage. We ask: given this voltage, what on the board." className="font-serif text-2xl md:text-3xl font-normal tracking-[-0.02em] mt-3 mb-8" />
            <Reveal delay={0.2}>
              <div className="space-y-6 text-muted-foreground font-light leading-relaxed">
                <p>
                  Language models encode text. A circuit is topology, potential, current, and constraint. Noeti is a physical AI we designed
                  and trained for that object — then closed the weights.
                </p>
                <p>
                  After fabrication, you give it a measured signal and a simulated prior. It reads the residual ΔV, ΔI and returns a fault
                  hypothesis with evidence: which disagreement on the schematic would produce this signal.
                </p>
                <p>
                  Several faults can draw almost the same trace. Training searches that set, against simulation, with reinforcement. A
                  customer query is one pass on one inference box.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-7" delay={0.15}>
            <LiveScope compact />
          </Reveal>
        </div>
      </section>

      <section className="py-20 lg:py-24 px-6 lg:px-12 border-y border-border bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-8" gap={0.1}>
            {[
              { v: 40, p: "≈", s: "%", l: "faster analog bring-up" },
              { v: 65, p: "≈", s: "%", l: "faster on legacy netlists" },
              { v: 80, p: "≈", s: "%", l: "first-pass fault named" },
              { v: 3, l: "companies live" },
            ].map((x) => (
              <RevealItem key={x.l}>
                <div className="text-4xl lg:text-5xl font-light tracking-tighter tabular-nums">
                  <Counter value={x.v} prefix={x.p} suffix={x.s} />
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground mt-2">{x.l}</div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">What we have trained so far</span>
            </Reveal>
            <TextReveal as="h2" text="From simulation to the bench." className="font-serif text-3xl md:text-4xl font-normal tracking-[-0.02em] mt-3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="p-8 border border-border rounded-lg bg-card hover:border-primary/40 transition-colors duration-300"
              >
                <value.icon className="h-5 w-5 text-primary mb-5" />
                <h3 className="text-lg tracking-tight mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </PageTransition>
);

export default About;
