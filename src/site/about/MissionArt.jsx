import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChartDonutIcon, CodeIcon, FlowArrowIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad, useActiveInView, useInterval } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SNAPPY, SPRING_SOFT } from '../lib/motion';
import { MISSION } from './content';

const PILLAR_ICONS = { automate: FlowArrowIcon, visualize: ChartDonutIcon, build: CodeIcon };
/** Pillar positions on the ring: angle in degrees and radius in % of the box. */
const PILLAR_ANGLES = [-90, 30, 150];
const PILLAR_RADIUS = 38;

/** Mission card art: the three pillars on a ring, with an arc that rotates to the current one. */
export function MissionArt() {
  const { ref, inView, active } = useActiveInView();
  const [tick, setTick] = useState(0);
  useInterval(() => setTick((n) => n + 1), 2800, active);
  const current = tick % MISSION.pillars.length;
  const pillar = MISSION.pillars[current];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative grid h-full min-h-[340px] place-items-center p-8 sm:min-h-[380px]', !inView && 'about-paused')}
    >
      <div className="absolute inset-0 bg-grid-sm opacity-60 mask-radial" />
      <div className="relative aspect-square w-full max-w-[300px]">
        <svg viewBox="-100 -100 200 200" fill="none" className="absolute inset-0 size-full">
          <circle r={76} stroke="rgba(234,240,245,0.1)" strokeDasharray="1.5 5" />
          <circle r={54} stroke="rgba(234,240,245,0.06)" />
        </svg>
        <div className="absolute inset-0 animate-spin-slow">
          <span className="absolute left-1/2 top-[25%] size-1.5 -translate-x-1/2 rounded-full bg-sage-300/70" />
        </div>
        <motion.div className="absolute inset-0" initial={false} animate={{ rotate: tick * 120 }} transition={SPRING_SOFT}>
          <svg viewBox="-100 -100 200 200" fill="none" className="size-full">
            <circle
              r={76}
              pathLength={1}
              stroke="#b4c68f"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeDasharray="0.16 0.84"
              transform="rotate(-118.8)"
            />
          </svg>
        </motion.div>

        {MISSION.pillars.map((item, i) => {
          const isCurrent = i === current;
          const Icon = PILLAR_ICONS[item.key];
          const angle = (PILLAR_ANGLES[i] * Math.PI) / 180;
          return (
            <div
              key={item.key}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${50 + PILLAR_RADIUS * Math.cos(angle)}%`, top: `${50 + PILLAR_RADIUS * Math.sin(angle)}%` }}
            >
              <motion.span
                animate={{ scale: isCurrent ? 1.1 : 1 }}
                transition={SPRING_SNAPPY}
                className={cn(
                  'grid size-12 place-items-center rounded-2xl border transition-[background-color,border-color,color] duration-500 sm:size-14',
                  isCurrent
                    ? 'border-sage-200 bg-sage-300 text-ink-950 shadow-[0_14px_30px_-12px_rgba(148,163,120,0.7)]'
                    : 'border-white/10 bg-ink-800 text-ink-200',
                )}
              >
                <Icon weight={isCurrent ? 'fill' : 'duotone'} className="size-5 sm:size-6" />
              </motion.span>
              <span
                className={cn(
                  'absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-500',
                  isCurrent ? 'text-sage-200' : 'text-ink-300',
                )}
              >
                {item.verb}
              </span>
            </div>
          );
        })}

        <div className="absolute inset-[30%] grid place-items-center text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pillar.key}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
            >
              <span className="nums block font-mono text-[10px] tracking-[0.2em] text-ink-200">
                {pad(current + 1)}
                {' / '}
                {pad(MISSION.pillars.length)}
              </span>
              <span className="mt-1.5 block text-[15px] font-semibold leading-tight tracking-[-0.02em] text-ink-50 sm:text-base">
                {pillar.phrase}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
