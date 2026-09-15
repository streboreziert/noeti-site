import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { TextReveal } from "./TextReveal";

interface ParallaxBannerProps {
  image: string;
  alt: string;
  eyebrow?: string;
  title?: string;
  children?: ReactNode;
  height?: string;
}

/** Full-bleed dark banner with parallax image, grain and an optional title. */
export const ParallaxBanner = ({ image, alt, eyebrow, title, children, height = "h-[56vh] min-h-[380px]" }: ParallaxBannerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden bg-ink grain ${height}`}>
      <motion.img
        src={image}
        alt={alt}
        style={{ y, scale }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 w-full h-[120%] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div className="absolute inset-0 bg-dots-light opacity-40" />
      <motion.div style={{ opacity }} className="absolute inset-x-0 bottom-0 pb-14 md:pb-20 px-6 lg:px-12 text-white">
        <div className="container mx-auto">
          {eyebrow && (
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block text-[11px] uppercase tracking-[0.2em] text-glow mb-4"
            >
              {eyebrow}
            </motion.span>
          )}
          {title && <TextReveal as="h1" text={title} delay={0.35} className="text-4xl md:text-6xl font-light tracking-tight max-w-3xl" />}
          {children}
        </div>
      </motion.div>
    </div>
  );
};
