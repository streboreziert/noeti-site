import { motion, useScroll, useSpring } from "framer-motion";

/** Thin bar at the very top that tracks page scroll. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[200] bg-primary"
      style={{ scaleX }}
    />
  );
};
