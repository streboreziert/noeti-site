import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageTransition } from "@/lib/motion";

export const PageTransition = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div className={className} initial="initial" animate="animate" exit="exit" variants={pageTransition}>
    {children}
  </motion.div>
);
