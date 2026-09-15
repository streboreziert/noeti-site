import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero.jpg";
import LiveScope from "./scope/LiveScope";
import { Magnetic } from "./motion/Magnetic";
import { EASE } from "@/lib/motion";

const lines = ["The circuit exists.", "Inference starts."];

const Hero = () => {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 900], [0, 180]);
  const copyOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const scrollToBooking = () => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-ink text-white flex items-center">
      {/* Board render behind everything */}
      <motion.img
        src={heroImage}
        alt=""
        aria-hidden
        style={{ y: bgY }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 2, ease: EASE }}
        className="absolute inset-0 w-full h-[120%] object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 relative pt-28 pb-20 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Copy */}
          <motion.div style={{ opacity: copyOpacity }} className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-3 mb-7 font-mono text-[11px] uppercase tracking-[0.22em] text-white/60"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ backgroundColor: "hsl(var(--trace))", opacity: 0.7 }} />
                <span className="relative inline-flex h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(var(--trace))" }} />
              </span>
              Physical AI · trained on circuits · Riga
            </motion.div>

            <h1 className="font-serif text-[2.7rem] leading-[1.04] sm:text-6xl lg:text-[4.6rem] font-normal tracking-[-0.02em]">
              {lines.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className={`block ${i === 1 ? "text-primary" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.35 + i * 0.12, duration: 0.9, ease: EASE }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.6 }}
              className="mt-7 text-base md:text-lg font-light text-white/70 leading-relaxed max-w-md"
            >
              Physical AI we designed and trained for circuits — not for language. After fabrication: measure a signal, compare it to
              simulation, name the likely fault, and probe again until it works.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <button
                  onClick={scrollToBooking}
                  className="shine group flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 rounded-full text-sm tracking-wide hover:brightness-110 transition"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link to="/models" className="glass flex items-center gap-2 px-6 py-3.5 rounded-full text-sm tracking-wide hover:bg-white/15 transition-colors">
                  Solo · Lab · Company
                </Link>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40"
            >
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
                <ArrowDown className="h-3.5 w-3.5" />
              </motion.span>
              Live at three companies
            </motion.div>
          </motion.div>

          {/* Instrument */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
            className="lg:col-span-7"
          >
            <LiveScope />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
