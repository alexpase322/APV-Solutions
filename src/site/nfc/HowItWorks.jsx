import { useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { CreditCardIcon, HandTapIcon, IdentificationCardIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { Container, IconTile, Section, SectionHeading, Tag } from '../ui/primitives';
import { NFC_STEPS } from './content';

const STEP_ICONS = [CreditCardIcon, IdentificationCardIcon, HandTapIcon];
const LAST_STEP = NFC_STEPS.length - 1;

/** Three steps whose connector fills (and whose numbers light up) as the list scrolls through the viewport. */
export function HowItWorks() {
  const listRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.78', 'end 0.6'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.5 });
  const complete = useMotionValue(1);
  const progress = reduce ? complete : smoothProgress;
  const [reached, setReached] = useState(-1);

  useMotionValueEvent(smoothProgress, 'change', (value) => {
    const next = value >= 0.985 ? 2 : value >= 0.485 ? 1 : value > 0.01 ? 0 : -1;
    setReached((current) => (current === next ? current : next));
  });

  const litUpTo = reduce ? LAST_STEP : reached;

  return (
    <Section id="how-it-works" aria-labelledby="nfc-how-title" className="isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-[38%] h-[560px] bg-grid-sm opacity-50 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_10%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="nfc-how-title"
          layout="split"
          eyebrow="How it works"
          title="Ready in *three simple steps*"
          description="We program the card, you build the profile, and from then on every tap opens it instantly."
        />
        <ol ref={listRef} className="relative mt-16 grid gap-12 sm:mt-20 lg:mt-24 lg:grid-cols-3 lg:gap-10">
          {NFC_STEPS.map((step, index) => (
            <Step key={step.index} index={index} step={step} lit={litUpTo >= index} progress={progress} />
          ))}
        </ol>
      </Container>
    </Section>
  );
}

function Step({ index, step, lit, progress }) {
  const Icon = STEP_ICONS[index];

  return (
    <li className="relative pl-[68px] lg:pl-0 lg:pt-[84px]">
      {index !== LAST_STEP && <StepConnector index={index} progress={progress} />}
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-0 top-0 grid size-11 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-700 ease-out-expo',
          lit ? 'border-sage-300/60 bg-ink-850 shadow-[0_0_0_6px_rgba(180,198,143,0.08)]' : 'border-white/10 bg-ink-850',
        )}
      >
        <span className="relative inline-flex size-2.5">
          {lit && <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulse-ring" />}
          <span className={cn('relative size-2.5 rounded-full transition-colors duration-700', lit ? 'bg-sage-300' : 'bg-ink-400')} />
        </span>
      </span>
      <p
        aria-hidden="true"
        className={cn(
          'nums font-mono text-[clamp(3.75rem,7vw,6.5rem)] font-medium leading-[0.85] tracking-[-0.08em] transition-colors duration-700 ease-out-expo',
          lit ? 'text-ink-50' : 'text-ink-600',
        )}
      >
        {step.index}
      </p>
      <div className="mt-7 flex items-center gap-4">
        <IconTile size="md">
          <Icon weight="duotone" className="size-6" />
        </IconTile>
        <h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink-50 sm:text-[1.7rem]">
          <span className="sr-only">Step {index + 1}: </span>
          {step.title}
        </h3>
      </div>
      <p className="mt-5 max-w-[40ch] text-base leading-relaxed text-ink-200 sm:text-[17px]">{step.description}</p>
      <Tag tone={lit ? 'sage' : 'neutral'} className="mt-6 transition-colors duration-700">
        {step.tag}
      </Tag>
    </li>
  );
}

/** Dashed line to the next step (vertical on mobile, horizontal on desktop) that fills with its share of the progress. */
function StepConnector({ index, progress }) {
  const segment = 1 / LAST_STEP;
  const fill = useTransform(progress, [index * segment, (index + 1) * segment], [0, 1], { clamp: true });
  const offset = useTransform(fill, (v) => `${v * 100}%`);
  const dotOpacity = useTransform(fill, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[21.5px] top-[22px] h-[calc(100%+48px)] w-px lg:left-[22px] lg:top-[21.5px] lg:h-px lg:w-[calc(100%+40px)]"
    >
      <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(234,240,245,0.14)_0_3px,transparent_3px_9px)] lg:bg-[repeating-linear-gradient(to_right,rgba(234,240,245,0.14)_0_3px,transparent_3px_9px)]" />
      <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-gradient-to-b from-sage-300 to-sage-500 lg:hidden" />
      <motion.div style={{ scaleX: fill }} className="absolute inset-0 hidden origin-left bg-gradient-to-r from-sage-300 to-sage-500 lg:block" />
      <motion.div style={{ y: offset, opacity: dotOpacity }} className="absolute inset-0 lg:hidden">
        <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-200 shadow-[0_0_0_5px_rgba(180,198,143,0.16)]" />
      </motion.div>
      <motion.div style={{ x: offset, opacity: dotOpacity }} className="absolute inset-0 hidden lg:block">
        <span className="absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-200 shadow-[0_0_0_5px_rgba(180,198,143,0.16)]" />
      </motion.div>
    </div>
  );
}
