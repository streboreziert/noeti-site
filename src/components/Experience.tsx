import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Radio, RefreshCw, Search } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

const features = [
  {
    icon: Radio,
    step: "01",
    title: "Measure the circuit",
    description:
      "Connect a scope or logger, or upload a capture — waveform, screenshot, or CSV. The measurement stays in volts, amps, and seconds. That trajectory is what the model reads.",
  },
  {
    icon: Activity,
    step: "02",
    title: "Compare should to is",
    description:
      "From the netlist, the model computes the expected state — .tran, .ac, operating point — and sets it next to what you measured. The residual ΔV, ΔI is the disagreement, in physical units.",
  },
  {
    icon: Search,
    step: "03",
    title: "Name the likely fault",
    description:
      "Candidate faults are simulated forward. The model asks which disagreement on the schematic would produce this signal, and returns the likely cause: net, part, and why this residual matches.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Probe again until it works",
    description:
      "The next probe is the next measurement. Capture, compare, prove. The loop closes when the residual collapses and the realized circuit does what the simulation said it should.",
  },
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <section id="experience" className="py-32 lg:py-40 bg-secondary/30" ref={ref}>
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: easeOutExpo }}
          className="text-center mb-20"
        >
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground mb-4 block">After fabrication</span>
          <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground tracking-tight">
            Measure. Compare. Prove. Repeat.
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Bring a signal from the bench — a live scope, or an image of the capture.
            The model compares what should be to what is, simulates the faults that
            would produce that residual, and sends you back to the next probe until the circuit works.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.step}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.1 + index * 0.12, ease: easeOutExpo }}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.008 }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                  className="relative overflow-hidden bg-card/80 backdrop-blur-md border border-border rounded-lg p-6 md:p-7 group hover:bg-black/70 hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
                >
                  <div className="relative z-10 flex items-start gap-5">
                    <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 group-hover:bg-white/20 transition-colors duration-700">
                      <Icon className="h-5 w-5 text-primary group-hover:text-white transition-colors duration-700" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground group-hover:text-white/60 mb-1 transition-colors duration-700">
                        {feature.step}
                      </span>
                      <h3 className="text-sm font-normal mb-1 text-foreground group-hover:text-white tracking-tight transition-colors duration-700">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground group-hover:text-white/90 leading-relaxed font-light transition-colors duration-700">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
