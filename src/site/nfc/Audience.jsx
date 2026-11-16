import { useEffect, useLayoutEffect, useRef } from 'react';
import {
  cancelFrame,
  frame,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { BriefcaseIcon, HandshakeIcon, HouseLineIcon, StorefrontIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { NFC_AUDIENCES } from '../lib/site';
import { Container, Eyebrow, Reveal, SplitText, Stagger, StaggerItem } from '../ui/primitives';
import { wrap } from './hooks';
import { NfcWaves } from './NfcWaves';

const AUDIENCE_ICONS = {
  Realtors: HouseLineIcon,
  'Sales teams': HandshakeIcon,
  'Small business owners': StorefrontIcon,
  'Freelancers & consultants': BriefcaseIcon,
};

/** "Who it's for": heading, two counter-scrolling marquee rows of audiences, and the audience list. */
export function Audience() {
  return (
    <section aria-labelledby="nfc-audience-title" className="relative isolate overflow-hidden py-24 sm:py-28 lg:py-32">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(148,163,120,0.09),transparent_70%)]" />
      </div>

      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal className="mb-6">
              <Eyebrow>Who it&apos;s for</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              id="nfc-audience-title"
              text="Perfect for *people who meet people*"
              className="text-[clamp(2.1rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50"
            />
          </div>
          <Reveal delay={0.12} className="lg:col-span-5 lg:pb-2">
            <p className="max-w-[48ch] text-base leading-relaxed text-ink-200 sm:text-lg">
              If your work starts with an introduction, one tap shares your contact info, social media and links — no app, no paper.
            </p>
          </Reveal>
        </div>
      </Container>

      <div aria-hidden="true" className="mt-14 select-none sm:mt-16 mask-fade-x">
        <AudienceMarquee direction={1} />
        <AudienceMarquee direction={-1} outlined speed={38} />
      </div>

      <Container>
        <Stagger
          as="ul"
          gap={0.08}
          className="mt-14 grid grid-cols-1 border-y border-white/[0.07] sm:mt-16 sm:grid-cols-2 lg:grid-cols-4"
        >
          {NFC_AUDIENCES.map((audience, i) => {
            const Icon = AUDIENCE_ICONS[audience];
            return (
              <StaggerItem
                key={audience}
                as="li"
                className={cn(
                  'flex min-h-[88px] items-center gap-4 py-6 sm:px-6 lg:py-8',
                  i > 0 && 'border-t border-white/[0.07] sm:border-t-0',
                  i % 2 === 1 && 'sm:border-l sm:border-white/[0.07]',
                  i >= 2 && 'sm:border-t sm:border-white/[0.07] lg:border-t-0',
                  i > 0 && 'lg:border-l lg:border-white/[0.07]',
                  i === 0 && 'sm:pl-0',
                  i === 2 && 'sm:pl-0 lg:pl-6',
                )}
              >
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300"
                >
                  <Icon weight="duotone" className="size-[22px]" />
                </span>
                <span className="text-lg font-medium tracking-[-0.02em] text-ink-50">{audience}</span>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}

/**
 * Endless row of audience names. Drifts at `speed` px/s in `direction` (1 = left, -1 = right) and speeds up
 * with the page's scroll velocity. Runs only while on screen and not with reduced motion.
 */
function AudienceMarquee({ direction, outlined = false, speed = 46 }) {
  const rootRef = useRef(null);
  const copyRef = useRef(null);
  const copyWidth = useRef(0);
  const inView = useInView(rootRef, { margin: '80px 0px' });
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 300 });
  const boost = useTransform(smoothVelocity, (v) => Math.min(Math.abs(v) / 900, 2.2));
  const offset = useMotionValue(0);
  // Wrap by one copy's width so the two copies loop seamlessly.
  const x = useTransform(offset, (v) => (copyWidth.current ? wrap(-copyWidth.current, 0, v) : 0));

  useLayoutEffect(() => {
    const el = copyRef.current;
    if (!el) return undefined;
    const measure = () => {
      copyWidth.current = el.offsetWidth;
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) return undefined;
    const step = ({ delta }) => {
      if (!copyWidth.current) return;
      const seconds = Math.min(delta, 64) / 1000;
      offset.set(offset.get() + direction * -1 * speed * (1 + boost.get()) * seconds);
    };
    frame.update(step, true);
    return () => cancelFrame(step);
  }, [reduce, inView, direction, speed, offset, boost]);

  return (
    <div ref={rootRef} className="flex overflow-hidden py-1">
      <motion.div style={{ x }} className="flex w-max will-change-transform">
        <AudienceCopy copyRef={copyRef} outlined={outlined} />
        <AudienceCopy outlined={outlined} />
      </motion.div>
    </div>
  );
}

function AudienceCopy({ copyRef, outlined }) {
  return (
    <div ref={copyRef} className="flex shrink-0 items-center">
      {NFC_AUDIENCES.map((audience) => (
        <span key={audience} className="flex shrink-0 items-center">
          <span
            className={cn(
              'whitespace-nowrap px-[0.32em] text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1.08] tracking-[-0.045em]',
              outlined ? 'nfc-outline' : 'text-ink-50',
            )}
          >
            {audience}
          </span>
          <span aria-hidden="true" className="mx-[0.15em] grid shrink-0 place-items-center text-sage-300">
            <NfcWaves className="size-[clamp(1.6rem,4vw,3.4rem)]" strokeWidth={2} />
          </span>
        </span>
      ))}
    </div>
  );
}
