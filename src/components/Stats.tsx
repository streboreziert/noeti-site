import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { easeOutExpo } from "@/lib/motion";

const stats = [
  { approx: true, value: "40%", label: "Faster analog bring-up" },
  { approx: true, value: "65%", label: "Faster on legacy netlists" },
  { approx: true, value: "80%", label: "First-pass fault named" },
  { approx: false, value: "3", label: "Companies live" },
];

const Stats = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="bg-background border-y border-border" ref={ref}>
      <div className="container mx-auto px-0 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.08, ease: easeOutExpo }}
              className={[
                "relative flex flex-col items-center justify-center px-5 py-12 md:py-14 lg:py-16 text-center",
                index % 2 === 1 ? "border-l border-border" : "",
                index >= 2 ? "border-t border-border lg:border-t-0" : "",
                index > 0 ? "lg:border-l lg:border-border" : "",
              ].join(" ")}
            >
              <p className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight tabular-nums text-foreground">
                {stat.approx && <span className="text-[0.55em] align-super text-muted-foreground mr-0.5">≈</span>}
                {stat.value}
              </p>
              <span className="mt-4 mb-3 block h-px w-7 bg-primary/60" aria-hidden />
              <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed max-w-[11rem]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
