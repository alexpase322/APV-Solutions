import { motion } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react';
import { useActiveInView } from '../lib/hooks';

const LOOP = { duration: 5, times: [0, 0.36, 0.76, 1], repeat: Infinity, ease: 'easeInOut' };
const STATIC = { duration: 0 };

/** Collaboration: "Your team" and "APV" circles slide together into one team. Static when inactive. */
export function CollaborationVisual() {
  const { ref, active } = useActiveInView();

  return (
    <div ref={ref} aria-hidden="true" className="relative grid h-[148px] w-full max-w-[320px] place-items-center">
      <motion.span
        className="grid size-[104px] place-items-center rounded-full border border-white/15 bg-white/[0.03] [grid-area:1/1]"
        initial={false}
        animate={active ? { x: [-64, -30, -30, -64] } : { x: -30 }}
        transition={active ? LOOP : STATIC}
      >
        <span className="-translate-x-4 text-center font-mono text-[10px] uppercase leading-tight tracking-[0.16em] text-ink-200">
          Your
          <br />
          team
        </span>
      </motion.span>
      <motion.span
        className="grid size-[104px] place-items-center rounded-full border border-sage-300/40 bg-sage-300/[0.1] [grid-area:1/1]"
        initial={false}
        animate={active ? { x: [64, 30, 30, 64] } : { x: 30 }}
        transition={active ? LOOP : STATIC}
      >
        <span className="translate-x-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-200">APV</span>
      </motion.span>
      <motion.span
        className="z-10 grid size-7 place-items-center rounded-full bg-sage-300 text-ink-950 [grid-area:1/1]"
        initial={false}
        animate={active ? { scale: [0.4, 1, 1, 0.4], opacity: [0, 1, 1, 0] } : { scale: 1, opacity: 1 }}
        transition={active ? LOOP : STATIC}
      >
        <CheckIcon weight="bold" className="size-3.5" />
      </motion.span>
      <motion.span
        className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-sage-300"
        initial={false}
        animate={active ? { opacity: [0, 1, 1, 0] } : { opacity: 1 }}
        transition={active ? LOOP : STATIC}
      >
        One team
      </motion.span>
    </div>
  );
}
