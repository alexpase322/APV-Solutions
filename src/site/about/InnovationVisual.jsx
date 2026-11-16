import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { useActiveInView, useInterval } from '../lib/hooks';
import { SPRING_SNAPPY } from '../lib/motion';

const OPTIONS = ['AI', 'No-Code', 'Automation', 'Custom code'];
/** Bar fill per rank (first row = best fit). */
const SCORES = [1, 0.66, 0.46, 0.3];

/** Innovation: a ranked list of approaches that keeps reshuffling to surface the best fit. */
export function InnovationVisual() {
  const { ref, active } = useActiveInView();
  const [order, setOrder] = useState([0, 1, 2, 3]);
  useInterval(() => setOrder((prev) => [...prev.slice(1), prev[0]]), 2200, active);

  return (
    <div ref={ref} aria-hidden="true" className="w-full max-w-[360px]">
      <ul className="flex flex-col gap-2">
        {order.map((option, rank) => (
          <motion.li
            key={option}
            layout
            transition={SPRING_SNAPPY}
            className={cn(
              'flex h-8 items-center gap-3 rounded-xl border px-3 transition-[border-color,background-color] duration-500',
              rank === 0 ? 'border-sage-300/40 bg-sage-300/[0.09]' : 'border-white/[0.06] bg-white/[0.02]',
            )}
          >
            <span
              className={cn(
                'w-[88px] shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-500',
                rank === 0 ? 'text-sage-200' : 'text-ink-200',
              )}
            >
              {OPTIONS[option]}
            </span>
            <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.span
                className={cn('absolute inset-0 origin-left rounded-full', rank === 0 ? 'bg-sage-300' : 'bg-ink-400')}
                initial={false}
                animate={{ scaleX: SCORES[rank] }}
                transition={SPRING_SNAPPY}
              />
            </span>
            <span
              className={cn(
                'w-[54px] shrink-0 text-right font-mono text-[9px] uppercase tracking-[0.16em] text-gold-300 transition-opacity duration-300',
                rank === 0 ? 'opacity-100' : 'opacity-0',
              )}
            >
              Best fit
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
