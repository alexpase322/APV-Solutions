import { motion } from 'motion/react';
import { CheckIcon, CursorIcon } from '@phosphor-icons/react';
import { useActiveInView } from '../lib/hooks';

const LOOP = { duration: 4.2, times: [0, 0.18, 0.46, 0.84, 1], repeat: Infinity, ease: 'easeInOut' };
const PRESS_TIMES = [0, 0.47, 0.5, 0.86, 1];
const RIPPLE_TIMES = [0, 0.46, 0.66, 0.9, 1];
const STATIC = { duration: 0 };

/** Empathy: a cursor glides onto a "Continue" button and presses it, with a ripple. Static when inactive. */
export function EmpathyVisual() {
  const { ref, active } = useActiveInView();

  return (
    <div ref={ref} aria-hidden="true" className="glass relative h-[148px] w-full max-w-[320px] overflow-hidden rounded-2xl p-4">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-full bg-sage-300/20" />
        <div className="flex-1 space-y-1.5">
          <span className="block h-1.5 w-2/3 rounded-full bg-white/[0.14]" />
          <span className="block h-1.5 w-1/3 rounded-full bg-white/[0.08]" />
        </div>
      </div>
      <span className="mt-4 block h-1.5 w-full rounded-full bg-white/[0.07]" />
      <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-white/[0.07]" />
      <div className="absolute bottom-4 right-4">
        <span className="relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-[13px] font-medium text-ink-50">
          <motion.span
            className="absolute inset-0 bg-sage-300"
            initial={false}
            animate={active ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
            transition={active ? { ...LOOP, times: PRESS_TIMES } : STATIC}
          />
          <motion.span
            className="relative inline-flex items-center gap-1.5"
            initial={false}
            animate={active ? { color: ['#eaf0f5', '#eaf0f5', '#04080c', '#04080c', '#eaf0f5'] } : { color: '#04080c' }}
            transition={active ? { ...LOOP, times: PRESS_TIMES } : STATIC}
          >
            <CheckIcon weight="bold" className="size-3.5" />
            Continue
          </motion.span>
          <motion.span
            className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-50/40"
            initial={false}
            animate={active ? { scale: [0.2, 0.2, 2.6, 2.6, 0.2], opacity: [0, 0.6, 0, 0, 0] } : { scale: 0.2, opacity: 0 }}
            transition={active ? { ...LOOP, times: RIPPLE_TIMES } : STATIC}
          />
        </span>
        <motion.span
          className="absolute left-1/2 top-1/2 text-ink-50 drop-shadow-[0_4px_8px_rgba(2,6,10,0.6)]"
          initial={false}
          animate={active ? { x: [-150, -150, 0, 0, -150], y: [-70, -70, 2, 2, -70] } : { x: 0, y: 2 }}
          transition={active ? LOOP : STATIC}
        >
          <CursorIcon weight="fill" className="size-5" />
        </motion.span>
      </div>
    </div>
  );
}
