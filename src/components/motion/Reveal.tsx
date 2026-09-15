import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  amount?: number;
  as?: "div" | "section" | "span" | "li" | "p";
}

/** Fades + lifts its children into view once, when scrolled into the viewport. */
export const Reveal = ({ children, className, delay = 0, variants = fadeUp, amount = 0.25, as = "div" }: RevealProps) => {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
}

/** Wraps a list; each direct <RevealItem> child animates in sequence. */
export const Stagger = ({ children, className, gap = 0.08, delay = 0, amount = 0.2 }: StaggerProps) => (
  <motion.div
    className={className}
    variants={stagger(gap, delay)}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount }}
  >
    {children}
  </motion.div>
);

export const RevealItem = ({ children, className, variants = fadeUp }: { children: ReactNode; className?: string; variants?: Variants }) => (
  <motion.div className={className} variants={variants}>
    {children}
  </motion.div>
);
