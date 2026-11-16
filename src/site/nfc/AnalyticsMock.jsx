import { memo, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { cn } from '../lib/cn';
import { areaPath, seededRandom, smoothPath, useInterval } from '../lib/hooks';
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO } from '../lib/motion';
import { PulseDot } from '../ui/primitives';
import { useMockInView } from './hooks';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const CHART_WIDTH = 600;
const CHART_HEIGHT = 150;

/** Three seeded "profile opens" weeks, as [x, y] points in chart coordinates. */
const WEEKS = [11, 27, 43].map((seed) => {
  const random = seededRandom(seed);
  let level = 0.3 + random() * 0.2;
  return DAYS.map((_, i) => {
    level = Math.min(0.92, Math.max(0.12, level + (random() - 0.38) * 0.34));
    return [(i / (DAYS.length - 1)) * CHART_WIDTH, CHART_HEIGHT - level * CHART_HEIGHT * 0.86 - 8];
  });
});

/** "View analytics": a sparkline of profile opens that redraws with a new week every few seconds. */
export const AnalyticsMock = memo(function AnalyticsMock() {
  const { ref, active, inView, reduce } = useMockInView();
  const [week, setWeek] = useState(0);
  // Latches true the first time the chart comes near the viewport, so it only draws in once it can be seen.
  const seen = useInView(ref, { margin: '120px 0px', once: true });
  useInterval(() => setWeek((current) => (current + 1) % WEEKS.length), 4600, active);

  const points = WEEKS[week];
  const last = points[points.length - 1];

  return (
    <div ref={ref} aria-hidden="true" className={cn('relative flex h-[232px] flex-col px-1 sm:px-2', !inView && 'nfc-paused')}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-ink-50">Profile opens</span>
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-200">
            Last 7 days
          </span>
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-300">
          <PulseDot size="sm" />
          Dashboard
        </span>
      </div>

      <div className="relative mt-4 flex-1">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-px w-full bg-white/[0.05]" />
          ))}
        </div>
        <AnimatePresence mode="wait" initial={!reduce}>
          {(seen || reduce) && (
            <motion.div
              key={week}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.35 } }}
            >
              <motion.div
                className="absolute -inset-x-1 -inset-y-2"
                initial={{ clipPath: 'inset(0% 100% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                transition={{ duration: 1.6, ease: EASE_IN_OUT_QUINT }}
              >
                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  preserveAspectRatio="none"
                  className="absolute inset-x-1 inset-y-2 h-[calc(100%-1rem)] w-[calc(100%-0.5rem)] overflow-visible"
                >
                  <defs>
                    <linearGradient id="nfc-spark-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#b4c68f" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#b4c68f" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    d={areaPath(points, CHART_HEIGHT)}
                    fill="url(#nfc-spark-fill)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT_EXPO }}
                  />
                  <path
                    d={smoothPath(points)}
                    fill="none"
                    stroke="#b4c68f"
                    strokeWidth={2.25}
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </motion.div>
              <motion.span
                className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink-800 bg-sage-300 shadow-[0_0_0_5px_rgba(180,198,143,0.18)]"
                style={{ left: '100%', top: `${(last[1] / CHART_HEIGHT) * 100}%` }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 1.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-ink-200">
        {DAYS.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </div>
  );
});
