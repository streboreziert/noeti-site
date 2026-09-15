import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getFeaturedModels } from "@/data/models";
import ModelCard from "./ModelCard";
import { Reveal } from "./motion/Reveal";
import { TextReveal } from "./motion/TextReveal";
import { EASE } from "@/lib/motion";

/** Four plans in a row; each card rises in on scroll and lifts on hover. */
const Locations = () => {
  const models = getFeaturedModels();
  return (
    <section id="locations" className="relative py-28 lg:py-36 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-end mb-14 lg:mb-16">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary mb-4 block">Access</span>
            </Reveal>
            <TextReveal as="h2" text="Four plans. One model." className="font-serif text-3xl md:text-5xl font-normal tracking-[-0.02em]" />
          </div>
          <Reveal className="lg:col-span-5" delay={0.2}>
            <p className="text-sm md:text-base text-muted-foreground font-light">
              Same physical model on every plan. Usage at 1×, 5×, and 20×; live projects at 1, 3, and 10. Enterprise puts the inference box on your
              floor.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch" style={{ perspective: 1200 }}>
          {models.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 60, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <ModelCard model={m} highlight={m.id === "pro-plus"} tilt={false} />
            </motion.div>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3" delay={0.3}>
          <Link to="/models" className="inline-flex items-center gap-2 text-sm text-primary hover:gap-4 transition-all">
            Compare the four plans
            <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Card monthly · yearly invoice from Max · PO and DPA on Enterprise</span>
        </Reveal>
      </div>
    </section>
  );
};

export default Locations;
