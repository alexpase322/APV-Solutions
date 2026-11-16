import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '../lib/cn';
import { Container } from '../ui/primitives';

/**
 * Layout shared by the three service sections: hairline top border, a `backdrop` pattern, a giant
 * outlined index numeral with parallax, and a copy / visual split (`reverse` swaps the sides on lg).
 * When the URL hash targets the section it takes focus so keyboard and screen-reader users land there.
 */
export function ServiceSection({ id, index, labelledBy, sectionRef, reverse = false, copy, visual, backdrop }) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const numeralY = useTransform(scrollYProgress, [0, 1], [140, -140]);
  const { hash, key } = useLocation();

  useEffect(() => {
    const section = sectionRef.current;
    if (section && hash === `#${id}`) {
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
      section.addEventListener('blur', () => section.removeAttribute('tabindex'), { once: true });
    }
  }, [hash, key, id, sectionRef]);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      className="relative isolate overflow-x-clip py-24 outline-none sm:py-28 lg:pt-36 lg:pb-40 [&_a]:scroll-mt-20 [&_button]:scroll-mt-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        {backdrop}
        <motion.span
          style={reduce ? undefined : { y: numeralY }}
          className={cn(
            'absolute top-6 select-none font-semibold leading-[0.8] tracking-[-0.08em] text-transparent nums',
            'text-[clamp(9rem,30vw,27rem)] [-webkit-text-stroke:1px_rgb(180_198_143/0.16)] mask-fade-b',
            reverse ? '-right-[2vw] lg:right-[3vw]' : '-left-[2vw] lg:left-[3vw]',
          )}
        >
          {index}
        </motion.span>
      </div>
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className={cn('relative min-w-0 lg:col-span-5', reverse && 'lg:col-start-8')}>{copy}</div>
          <div className={cn('relative min-w-0 lg:col-span-7', reverse && 'lg:col-start-1 lg:row-start-1')}>{visual}</div>
        </div>
      </Container>
    </section>
  );
}

/** Tilts its child up out of perspective, scales and fades it in as it scrolls to the viewport centre. */
export function ScrollTilt({ children, className }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.35, 1]);

  return (
    <div ref={ref} className={cn('[perspective:1600px]', className)}>
      <motion.div
        style={reduce ? undefined : { rotateX, scale, y, opacity, transformOrigin: '50% 100%' }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Soft sage glow behind a section visual. */
export function Halo({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -z-10 rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.2),transparent_65%)]',
        className,
      )}
    />
  );
}
