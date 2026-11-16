import { memo, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/cn';
import { seededRandom, smoothPath, useActiveInView, useInterval } from '../../lib/hooks';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { PulseDot } from '../../ui/primitives';

const WEEKS = 8;
const CHART_HEIGHT = 150;
const GRID_LINES = [0.25, 0.5, 0.75];

/** Six stable, mostly rising weekly series (0–1) the chart cycles through. */
const SERIES = (() => {
  const random = seededRandom(77);
  return Array.from({ length: 6 }, (_, set) =>
    Array.from({ length: WEEKS }, (_, week) =>
      Math.min(0.95, Math.max(0.2, 0.3 + week * 0.075 + (random() - 0.5) * 0.3 + (set % 2) * 0.03)),
    ),
  );
})();

/** Three-week moving average, lifted a little above the bars. */
const trend = (values) =>
  values.map((_, i) => {
    const nearby = values.slice(Math.max(0, i - 1), i + 2);
    return Math.min(0.98, nearby.reduce((sum, v) => sum + v, 0) / nearby.length + 0.07);
  });

/** Trend line in the 100×100 viewBox, through the centre of each bar. */
const trendPath = (values) => smoothPath(trend(values).map((v, i) => [((i + 0.5) / WEEKS) * 100, 100 - v * 100]));

/** Weekly revenue bars with a trend line; morphs to a new series every few seconds while on screen. */
export const RevenueChartMock = memo(function RevenueChartMock() {
  const { ref, active } = useActiveInView();
  const [seriesIndex, setSeriesIndex] = useState(0);
  useInterval(() => setSeriesIndex((n) => (n + 1) % SERIES.length), 3200, active);
  const bars = SERIES[seriesIndex];
  const points = trend(bars);

  return (
    <div
      ref={ref}
      className="flex min-h-[260px] flex-1 flex-col rounded-3xl border border-white/[0.06] bg-ink-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">Revenue growth</p>
          <p className="nums mt-1.5 text-3xl font-semibold leading-none tracking-[-0.05em] text-ink-50">+85%</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-100">
          <PulseDot tone="gold" size="sm" />
          <span className="nums text-ink-50">1,240</span>
          {' active users'}
        </span>
      </div>

      <div className="relative mt-auto pt-6">
        <div className="relative" style={{ height: CHART_HEIGHT }}>
          {GRID_LINES.map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className="absolute inset-x-0 border-t border-dashed border-white/[0.06]"
              style={{ bottom: `${level * 100}%` }}
            />
          ))}
          <div className="absolute inset-0 flex items-end gap-1.5 sm:gap-2">
            {bars.map((value, i) => (
              <span key={i} className="relative h-full flex-1">
                <motion.span
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-full origin-bottom rounded-t-md',
                    i === WEEKS - 1 ? 'bg-gradient-to-t from-sage-600/50 to-sage-300' : 'bg-gradient-to-t from-sage-800/30 to-sage-400/55',
                  )}
                  initial={{ scaleY: 0.05 }}
                  animate={{ scaleY: value }}
                  transition={{ type: 'spring', stiffness: 90, damping: 18, delay: i * 0.04 }}
                />
              </span>
            ))}
          </div>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 size-full overflow-visible"
            fill="none"
          >
            <motion.path
              initial={false}
              animate={{ d: trendPath(bars) }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
              stroke="#eaf0f5"
              strokeOpacity={0.75}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>
          {points.map((value, i) => (
            <motion.span
              key={i}
              className="absolute bottom-0 size-2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-ink-900 bg-ink-50"
              style={{ left: `${((i + 0.5) / WEEKS) * 100}%` }}
              initial={false}
              animate={{ y: -value * CHART_HEIGHT }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-300">
          {Array.from({ length: WEEKS }, (_, i) => (
            <span key={i} className="flex-1 text-center">
              W{i + 1}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
