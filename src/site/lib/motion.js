/** Shared motion tokens for the marketing site (motion/react). */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];
export const EASE_IN_OUT_QUINT = [0.83, 0, 0.17, 1];

export const SPRING_SOFT = { type: 'spring', stiffness: 100, damping: 20, mass: 1 };
export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 32 };

export const DURATION = { fast: 0.2, base: 0.45, slow: 0.8, reveal: 0.9 };

const revealTransition = (delay) =>
  delay ? { duration: DURATION.reveal, ease: EASE_OUT_EXPO, delay } : { duration: DURATION.reveal, ease: EASE_OUT_EXPO };

/** Rise + unblur. Pass the delay through `custom`. */
export const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: (delay) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: revealTransition(delay),
    transitionEnd: { filter: 'none' },
  }),
};

/** Grow + unblur. Pass the delay through `custom`. */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94, filter: 'blur(6px)' },
  show: (delay) => ({
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: revealTransition(delay),
    transitionEnd: { filter: 'none' },
  }),
};

export const stagger = (gap = 0.07, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Default whileInView viewport: play once, a bit before the element is fully visible. */
export const VIEWPORT = { once: true, amount: 0.25, margin: '0px 0px -8% 0px' };
