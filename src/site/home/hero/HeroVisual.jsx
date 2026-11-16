import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowsClockwiseIcon, CheckCircleIcon, FileArrowDownIcon, FlowArrowIcon, StarIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { useActiveInView } from '../../lib/hooks';
import { DashboardMockup } from './DashboardMockup';

/**
 * Decorative right column of the hero: the dashboard mockup with two floating chips.
 * The three motion values come from the hero's scroll parallax.
 */
export function HeroVisual({ mockY, chipFastY, chipSlowY }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.4 }}
      className="relative mx-auto w-full max-w-[560px] pb-12 pt-12 lg:max-w-none lg:py-6"
    >
      <motion.div style={{ y: mockY }} className="relative">
        <div className="absolute inset-x-6 -bottom-4 top-6 -z-10 rounded-3xl border border-white/[0.05] bg-ink-800/60 lg:inset-x-10 lg:-bottom-6" />
        <DashboardMockup />
      </motion.div>
      <motion.div style={{ y: chipSlowY }} className="absolute bottom-0 left-3 sm:left-6 lg:-bottom-6 lg:-left-8 xl:-left-10">
        <div className="animate-float [animation-delay:-3s]">
          <TrustedChip />
        </div>
      </motion.div>
      <motion.div style={{ y: chipFastY }} className="absolute right-3 top-0 sm:right-6 lg:-right-4 lg:-top-4 xl:-right-8">
        <div className="animate-float-slow">
          <ActivityToast />
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Five gold stars that pop in one after another. */
function Stars({ className, delay = 0 }) {
  return (
    <span className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: 5 }, (_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 14, delay: delay + i * 0.07 }}
        >
          <StarIcon weight="fill" className="size-3.5 text-gold-400" />
        </motion.span>
      ))}
    </span>
  );
}

function TrustedChip() {
  return (
    <div className="glass flex items-center gap-3 rounded-2xl py-3 pl-3 pr-4">
      <span className="grid size-9 place-items-center rounded-xl border border-sage-300/20 bg-sage-300/10 text-sage-300">
        <CheckCircleIcon weight="duotone" className="size-[18px]" />
      </span>
      <div>
        <Stars delay={1.6} />
        <p className="mt-1 text-[13px] font-medium leading-none text-ink-50">Trusted partner</p>
      </div>
    </div>
  );
}

const ACTIVITY = [
  { icon: FlowArrowIcon, title: 'Workflow completed', meta: 'Form → WhatsApp → CRM' },
  { icon: FileArrowDownIcon, title: 'Report exported', meta: 'Dashboard · PDF' },
  { icon: ArrowsClockwiseIcon, title: 'Lead synced', meta: 'CRM · just now' },
];

/**
 * Notification that pops in, stays 2.5s, leaves, then returns with the next activity.
 * With reduced motion the first one simply stays visible.
 */
function ActivityToast() {
  const { ref, active, reduce } = useActiveInView();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    let showTimer = 0;
    let hideTimer = 0;
    const cycle = (first) => {
      showTimer = window.setTimeout(
        () => {
          if (!first) setIndex((i) => (i + 1) % ACTIVITY.length);
          setVisible(true);
          hideTimer = window.setTimeout(() => {
            setVisible(false);
            cycle(false);
          }, 2500);
        },
        first ? 1400 : 1500,
      );
    };
    cycle(true);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active]);

  const shown = reduce || visible;
  const item = ACTIVITY[index];
  const Icon = item.icon;

  return (
    <div ref={ref} className="relative h-16 w-[236px] sm:w-[256px]">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.6, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 460, damping: 15, mass: 0.8 } }}
            exit={{ opacity: 0, scale: 0.94, y: -8, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
            className="glass absolute inset-0 flex origin-bottom-right items-center gap-3 rounded-2xl px-3.5"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-sage-300/20 bg-sage-300/10 text-sage-300">
              <Icon weight="duotone" className="size-[18px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-ink-50">{item.title}</p>
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink-200">{item.meta}</p>
            </div>
            <CheckCircleIcon weight="fill" className="ml-auto size-4 shrink-0 text-sage-300" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
