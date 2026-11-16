import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react';
import { useMediaQuery } from '../lib/hooks';
import { EASE_OUT_EXPO } from '../lib/motion';
import { APP_LINKS, NFC_ORDER_HREF } from '../lib/site';
import { Button } from '../ui/Button';
import { Aurora, Container, DotField, Eyebrow, SplitText } from '../ui/primitives';
import { NFC_HERO } from './content';
import { TapDemo } from './TapDemo';

/** Rise + unblur on mount after `delay` seconds. */
const heroReveal = (delay) => ({
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
});

/** Hero: headline and CTAs on the left, the looping tap demo on the right (with a light parallax on desktop). */
export function NfcHero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const parallax = useMediaQuery() && !reduce;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, (v) => (parallax ? v * 60 : 0));
  const copyOpacity = useTransform(scrollYProgress, (v) => (parallax ? 1 - Math.min(1, v * 1.3) * 0.7 : 1));
  const demoY = useTransform(scrollYProgress, (v) => (parallax ? v * -90 : 0));

  return (
    <section
      ref={ref}
      aria-labelledby="nfc-hero-title"
      className="relative isolate overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-36 lg:flex lg:min-h-[100dvh] lg:items-center lg:pb-24 lg:pt-32"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Aurora variant="subtle" />
        <DotField className="opacity-70 [mask-image:radial-gradient(ellipse_75%_70%_at_72%_45%,#000_22%,transparent_75%)]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-900/80 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent to-ink-900" />
      </div>

      <Container>
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-8 xl:gap-12">
          <motion.div style={{ y: copyY, opacity: copyOpacity }} className="min-w-0 lg:col-span-7">
            <motion.div {...heroReveal(0.1)}>
              <Eyebrow>{NFC_HERO.eyebrow}</Eyebrow>
            </motion.div>
            <SplitText
              as="h1"
              id="nfc-hero-title"
              immediate
              delay={0.22}
              text={NFC_HERO.title}
              className="mt-7 max-w-[18ch] text-[clamp(2.6rem,4.8vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink-50 lg:max-w-none"
            />
            <motion.p {...heroReveal(0.55)} className="mt-7 max-w-[54ch] text-base leading-relaxed text-ink-200 sm:text-lg">
              {NFC_HERO.description}
            </motion.p>
            <motion.div {...heroReveal(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
              <Button href={NFC_ORDER_HREF} size="lg">
                Order your card
                <span className="sr-only">{' on WhatsApp (opens in a new tab)'}</span>
              </Button>
              <Button to="#how-it-works" variant="secondary" size="lg">
                How it works
              </Button>
            </motion.div>
            <motion.p {...heroReveal(0.82)} className="mt-6 text-[15px] text-ink-200">
              Already have a card?{' '}
              <Link
                to={APP_LINKS.login}
                className="relative whitespace-nowrap font-medium text-sage-300 underline decoration-sage-300/40 underline-offset-[5px] transition-colors duration-300 after:absolute after:-inset-x-1 after:-inset-y-3 after:content-[''] hover:text-sage-200 hover:decoration-sage-200"
              >
                Log in to edit your profile
              </Link>
            </motion.p>
            <motion.ul
              {...heroReveal(0.95)}
              aria-label="Highlights"
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/[0.06] pt-6"
            >
              {NFC_HERO.proof.map((item) => (
                <li key={item} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-100">
                  <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-sage-300/10 text-sage-300">
                    <CheckIcon weight="bold" className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div style={{ y: demoY }} className="min-w-0 lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.4 }}
            >
              <TapDemo />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
