import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import wave from "@/assets/detail-wave.jpg";
import { Magnetic } from "./motion/Magnetic";
import { TextReveal } from "./motion/TextReveal";
import { Reveal } from "./motion/Reveal";

const CTABand = () => (
  <section className="relative overflow-hidden bg-ink text-white grain">
    <motion.img
      src={wave}
      alt=""
      aria-hidden
      initial={{ scale: 1.1, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 0.7 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6 }}
      className="absolute inset-0 w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
    <div className="container mx-auto px-6 lg:px-12 py-28 lg:py-36 relative">
      <div className="max-w-2xl">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-5 block">Riga · pre-seed · live at three companies</span>
        </Reveal>
        <TextReveal as="h2" text="The part came back from the factory and the waveform is still wrong." className="text-4xl md:text-6xl font-light tracking-tight mb-8" />
        <Reveal delay={0.25}>
          <p className="text-white/65 font-light leading-relaxed mb-10 max-w-lg">
            Send the trace. The model works backwards from the signal to the board — a net, a part, a kind of fault — and sends you to the
            next probe.
          </p>
          <div className="flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="#booking"
                className="shine group inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm tracking-wide hover:brightness-110 transition"
              >
                Subscribe
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link to="/contact" className="glass inline-flex items-center px-6 py-3.5 rounded-full text-sm tracking-wide hover:bg-white/15 transition-colors">
                Talk to us
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default CTABand;
