import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getFeaturedModels } from "@/data/models";
import { useIsMobile } from "@/hooks/use-mobile";
import ModelCard from "./ModelCard";
import { Reveal } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import { EASE } from "@/lib/motion";

/** Three models fanned out like cards on a table; straighten on hover. */
const Locations = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<number | null>(null);
  const models = getFeaturedModels();

  const fan = [
    { rotate: -6, x: -330, y: 24 },
    { rotate: 0, x: 0, y: 0 },
    { rotate: 6, x: 330, y: 24 },
  ];

  return (
    <section id="locations" className="relative py-28 lg:py-40 bg-background overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-16 lg:mb-20">
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">Access</span>
          </Reveal>
          <TextReveal as="h2" text="Three plans. One model." className="text-3xl md:text-5xl font-light tracking-tight mb-5" />
          <Reveal delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto font-light">
              Same physical model on every plan. Usage at 1×, 5×, and 20×. Live projects at 1, 3, and 10.
            </p>
          </Reveal>
        </div>

        {isMobile ? (
          <div className="flex flex-col gap-6">
            {models.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.08}>
                <ModelCard model={m} highlight={m.id === "lab"} tilt={false} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="relative flex justify-center items-start h-[620px]">
            {models.map((m, index) => {
              const isHovered = hovered === index;
              const f = fan[index];
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 80, rotate: 0, x: 0 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          x: f.x,
                          y: isHovered ? f.y - 24 : f.y,
                          rotate: isHovered ? 0 : f.rotate,
                          scale: isHovered ? 1.04 : 1,
                        }
                      : {}
                  }
                  transition={{ duration: 0.7, delay: isInView && hovered === null ? index * 0.12 : 0, ease: EASE }}
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  className="absolute w-[340px]"
                  style={{ zIndex: isHovered ? 50 : 10 - Math.abs(index - 1) }}
                >
                  <ModelCard model={m} highlight={m.id === "lab"} />
                </motion.div>
              );
            })}
          </div>
        )}

        <Reveal className="text-center mt-14" delay={0.3}>
          <Link to="/models" className="inline-flex items-center gap-2 text-sm text-primary hover:gap-4 transition-all">
            See all three plans
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default Locations;
