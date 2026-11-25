import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CONTACT_PATH } from '../lib/site';
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO } from '../lib/motion';
import { useMediaQuery } from '../lib/hooks';
import { Aurora, Container, DotField, Eyebrow, Glow, SplitText } from '../ui/primitives';
import { Button } from '../ui/Button';
import { AskAILink } from '../assistant/AskAI';
import { HeroVisual } from './hero/HeroVisual';

/** Blur-up entrance for the hero copy, staggered by `delay`. */
const rise = (delay) => ({
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
});

/** Full-height home hero: headline + CTAs, live dashboard mockup, scroll parallax on desktop. */
export default function HeroSection() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const isDesktop = useMediaQuery();
  const parallax = isDesktop && !reduce;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, (p) => (parallax ? p * 70 : 0));
  const copyOpacity = useTransform(scrollYProgress, (p) => (parallax ? 1 - Math.min(1, p * 1.25) * 0.75 : 1));
  const mockY = useTransform(scrollYProgress, (p) => (parallax ? p * -110 : 0));
  const chipFastY = useTransform(scrollYProgress, (p) => (parallax ? p * -200 : 0));
  const chipSlowY = useTransform(scrollYProgress, (p) => (parallax ? p * -50 : 0));

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] items-center overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-36 lg:pb-28 lg:pt-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Aurora />
        <DotField className="opacity-90 [mask-image:radial-gradient(ellipse_90%_80%_at_62%_38%,#000_28%,transparent_80%)]" />
        <Glow className="right-[-12%] top-[8%] size-[760px] max-lg:hidden" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-900/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-ink-900" />
      </div>

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <motion.div style={{ y: copyY, opacity: copyOpacity }} className="lg:col-span-7 xl:col-span-6">
            <motion.div {...rise(0.1)}>
              <Eyebrow>Innovation for growth</Eyebrow>
            </motion.div>
            <SplitText
              as="h1"
              id="hero-title"
              immediate
              delay={0.22}
              text="Transform your business with *intelligent solutions*"
              className="mt-7 text-[clamp(2.6rem,5.8vw,5rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink-50"
            />
            <motion.p {...rise(0.55)} className="mt-7 max-w-[54ch] text-base leading-relaxed text-ink-200 sm:text-lg">
              We specialize in custom software, no-code automation and business intelligence dashboards — built to make your
              operation faster and smarter.
            </motion.p>
            <motion.div {...rise(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button to={CONTACT_PATH} size="lg">
                Start your project
              </Button>
              <Button to="/services" variant="secondary" size="lg">
                View our services
              </Button>
            </motion.div>
            <motion.p {...rise(0.78)} className="mt-5 flex flex-wrap items-center gap-x-2 text-[15px] text-ink-200">
              <span>Not sure where to start?</span>
              <AskAILink>Ask our AI assistant</AskAILink>
            </motion.p>
            <motion.div
              {...rise(0.85)}
              className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.06] pt-6"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">US &amp; LATAM · Remote / Global</span>
            </motion.div>
          </motion.div>

          <div className="lg:col-span-5 xl:col-span-6">
            <HeroVisual mockY={mockY} chipFastY={chipFastY} chipSlowY={chipSlowY} />
          </div>
        </div>
      </Container>

      {isDesktop && <ScrollCue />}
    </section>
  );
}

/** "Scroll" label with a light travelling down a hairline (desktop only). */
function ScrollCue() {
  const ref = useRef(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion() ?? false;
  const animateLine = inView && !reduce;
  const restY = reduce ? '50%' : '-100%';

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 1.6 }}
      className="pointer-events-none absolute inset-x-0 bottom-7"
    >
      <Container>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-200">
          <span className="relative block h-10 w-px overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent via-sage-300 to-transparent"
              initial={{ y: restY }}
              animate={animateLine ? { y: ['-100%', '200%'] } : { y: restY }}
              transition={
                animateLine ? { duration: 1.9, ease: EASE_IN_OUT_QUINT, repeat: Infinity, repeatDelay: 0.3 } : { duration: 0 }
              }
            />
          </span>
          Scroll
        </div>
      </Container>
    </motion.div>
  );
}
