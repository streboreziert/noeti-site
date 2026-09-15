/** Shared easing for page and section transitions. */
export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export const bannerTransition = {
  duration: 1.7,
  ease: easeOutExpo,
};
