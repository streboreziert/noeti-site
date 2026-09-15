import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";
import heroImage from "@/assets/hero.jpg";
import forestImage from "@/assets/spot-forest.jpg";
import lakeImage from "@/assets/spot-lake.jpg";
import meadowImage from "@/assets/spot-meadow.jpg";

const slides = [
  { image: heroImage, alt: "Physical AI trained on circuits" },
  { image: forestImage, alt: "Solo — one engineer" },
  { image: lakeImage, alt: "Lab — a small bench" },
  { image: meadowImage, alt: "Company — a hardware team" },
];

const SLIDE_DURATION = 6200;

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + 100 / (SLIDE_DURATION / 50);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [nextSlide]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.85, ease: easeOutExpo }}
          className="absolute inset-0"
        >
          <motion.img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].alt}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 8.2, ease: "linear" }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-20 left-6 md:left-12 lg:left-16 z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: easeOutExpo }}
          className="mb-4"
        >
          <Cpu className="w-6 h-6 text-white stroke-[1.5]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.85, ease: easeOutExpo }}
          className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight max-w-lg text-left flex flex-col"
        >
          <span>The circuit exists.</span>
          <span>Inference starts.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.75, ease: easeOutExpo }}
          className="mt-4 max-w-md text-sm font-light text-white/85 leading-relaxed"
        >
          Physical AI we designed and trained for circuits — not for language.
          After fabrication: measure a signal, compare it to simulation, name the likely fault, and probe again until it works.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7, ease: easeOutExpo }}
          onClick={() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-6 flex items-center gap-3 bg-white text-neutral-900 px-6 py-3 rounded-full text-sm tracking-wide hover:bg-white/90 transition-colors duration-700"
        >
          Subscribe
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <div className="absolute bottom-8 left-6 md:left-12 lg:left-16 right-6 md:right-12 lg:right-16 z-10 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="flex-1 h-[2px] bg-white/30 overflow-hidden cursor-pointer"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: index === currentSlide ? `${progress}%` : index < currentSlide ? "100%" : "0%",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;
