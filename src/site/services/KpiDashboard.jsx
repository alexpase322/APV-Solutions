import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { TrendUpIcon, UsersIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { areaPath, smoothPath, useInterval } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion';
import { CountUp, PulseDot, WindowFrame } from '../ui/primitives';
import { useElementSize } from './hooks';

/** Sample monthly revenue index (Jan → Dec). */
const REVENUE = [38, 44, 41, 52, 49, 58, 63, 60, 71, 76, 84, 92];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** Months the chart tooltip steps through (Mar, Jun, Sep, Dec). */
const TOOLTIP_MONTHS = [2, 5, 8, 11];
const ACTIVITY = [42, 58, 50, 66, 61, 74, 70, 82, 77, 88, 84, 96];

const CHART_HEIGHT = 132;
const CHART_PAD = { x: 8, top: 18, bottom: 10 };
const TOOLTIP_WIDTH = 104;

const CARD = 'rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4';
const CARD_LABEL = 'font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200';

/**
 * BI dashboard mockup with sample KPIs. Bars, ring and line draw in the first time it is seen;
 * the tooltip and activity bars keep moving while it stays in view (never with reduced motion).
 */
export function KpiDashboard() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [drawn, setDrawn] = useState(false);
  // latch: the charts draw in the first time the dashboard is seen (right away with reduced motion)
  if ((inView || reduce) && !drawn) setDrawn(true);

  const play = inView && !reduce;

  return (
    <div ref={ref} aria-hidden="true">
      <WindowFrame
        title="kpi-overview · sample data"
        right={
          <>
            <PulseDot tone="gold" size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">Live</span>
          </>
        }
        bodyClassName="p-4 sm:p-6"
        className="shadow-[0_50px_100px_-40px_rgba(2,6,10,0.95)]"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1 font-mono text-[10px] uppercase tracking-[0.14em]">
            <span className="rounded-lg bg-white/[0.07] px-2.5 py-1 text-ink-50">Overview</span>
            <span className="px-2.5 py-1 text-ink-300">Sales</span>
            <span className="px-2.5 py-1 text-ink-300 max-[380px]:hidden">Ops</span>
          </div>
          <span className="rounded-lg border border-white/[0.06] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">
            12 months
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className={CARD}>
            <div className="flex items-start justify-between gap-2">
              <span className={CARD_LABEL}>Revenue growth</span>
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-sage-300/[0.12] text-sage-300">
                <TrendUpIcon weight="bold" className="size-3.5" />
              </span>
            </div>
            <CountUp
              value={85}
              prefix="+"
              suffix="%"
              className="mt-3 block text-[clamp(1.6rem,3.2vw,2.1rem)] font-semibold leading-none tracking-[-0.04em] text-ink-50"
            />
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full origin-left rounded-full bg-sage-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: drawn ? 0.85 : 0 }}
                transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
              />
            </div>
          </div>
          <div className={CARD}>
            <div className="flex items-start justify-between gap-2">
              <span className={CARD_LABEL}>Active users</span>
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-white/[0.05] text-ink-100">
                <UsersIcon weight="bold" className="size-3.5" />
              </span>
            </div>
            <CountUp
              value={1240}
              className="mt-3 block text-[clamp(1.6rem,3.2vw,2.1rem)] font-semibold leading-none tracking-[-0.04em] text-ink-50"
            />
            <span className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-300">
              <PulseDot tone="gold" size="sm" />
              Live
            </span>
          </div>
          <div className={cn(CARD, 'col-span-2 pb-3')}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className={CARD_LABEL}>Revenue trend</span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-300">
                <span className="h-px w-4 bg-sage-300" />
                Revenue
              </span>
            </div>
            <RevenueChart drawn={drawn} play={play} />
          </div>
          <div className={cn(CARD, 'flex flex-col')}>
            <span className={CARD_LABEL}>Efficiency</span>
            <div className="relative mx-auto mt-3 size-[88px] sm:size-24">
              <svg viewBox="0 0 96 96" className="size-full -rotate-90">
                <circle cx="48" cy="48" r="38" fill="none" stroke="rgb(234 240 245 / 0.07)" strokeWidth="8" />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="38"
                  fill="none"
                  stroke="#b4c68f"
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={drawn ? { pathLength: 0.85, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                  transition={{ duration: 1.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <CountUp value={85} suffix="%" className="text-xl font-semibold tracking-[-0.04em] text-ink-50" />
              </div>
            </div>
          </div>
          <div className={cn(CARD, 'flex flex-col')}>
            <span className={CARD_LABEL}>Activity</span>
            <ActivityBars play={play} />
          </div>
        </div>
      </WindowFrame>
    </div>
  );
}

/** Responsive line + area chart of REVENUE with a tooltip that hops between quarters. */
const RevenueChart = memo(function RevenueChart({ drawn, play }) {
  const boxRef = useRef(null);
  const { width } = useElementSize(boxRef);
  const [stop, setStop] = useState(TOOLTIP_MONTHS.length - 1);
  const [tooltip, setTooltip] = useState(false);

  // the tooltip appears once the line has finished drawing
  useEffect(() => {
    if (!drawn) return undefined;
    const id = window.setTimeout(() => setTooltip(true), 1700);
    return () => window.clearTimeout(id);
  }, [drawn]);

  useInterval(() => setStop((i) => (i + 1) % TOOLTIP_MONTHS.length), 2300, play && tooltip);

  const min = Math.min(...REVENUE);
  const max = Math.max(...REVENUE);
  const plotHeight = CHART_HEIGHT - CHART_PAD.top - CHART_PAD.bottom;
  const points =
    width > 0
      ? REVENUE.map((value, i) => [
          CHART_PAD.x + (i * (width - CHART_PAD.x * 2)) / (REVENUE.length - 1),
          CHART_HEIGHT - CHART_PAD.bottom - ((value - min) / (max - min)) * plotHeight,
        ])
      : [];
  const line = points.length ? smoothPath(points) : '';
  const area = points.length ? areaPath(points, CHART_HEIGHT) : '';
  const last = points[points.length - 1];

  const month = TOOLTIP_MONTHS[stop];
  const isLast = month === REVENUE.length - 1;
  const point = points[month];
  const tipX = point ? Math.min(Math.max(point[0] - TOOLTIP_WIDTH / 2, 0), width - TOOLTIP_WIDTH) : 0;
  // above the point, or below it when there is no room
  const tipY = point ? (point[1] - 56 >= 0 ? point[1] - 56 : point[1] + 14) : 0;

  return (
    <div>
      <div ref={boxRef} className="relative w-full" style={{ height: CHART_HEIGHT }}>
        {width > 0 && (
          <svg className="absolute inset-0 size-full" viewBox={`0 0 ${width} ${CHART_HEIGHT}`} fill="none">
            <defs>
              <linearGradient id="svc-bi-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b4c68f" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#b4c68f" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75].map((f) => (
              <line
                key={f}
                x1={0}
                x2={width}
                y1={CHART_PAD.top + f * plotHeight}
                y2={CHART_PAD.top + f * plotHeight}
                stroke="rgb(234 240 245 / 0.06)"
                strokeDasharray="2 4"
              />
            ))}
            <motion.path
              d={area}
              fill="url(#svc-bi-area)"
              initial={{ opacity: 0 }}
              animate={{ opacity: drawn ? 1 : 0 }}
              transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 1 }}
            />
            <motion.path
              d={line}
              stroke="#b4c68f"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: drawn ? 1 : 0 }}
              transition={{ duration: 1.9, ease: EASE_OUT_EXPO }}
            />
            {last && <circle cx={last[0]} cy={last[1]} r={3} fill="#e4b34c" />}
          </svg>
        )}
        {point && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: tooltip ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-sage-300/0 via-sage-300/45 to-sage-300/0"
              initial={false}
              animate={{ x: point[0] }}
              transition={SPRING_SOFT}
            />
            <motion.div
              className="absolute left-0 top-0 -ml-[5px] -mt-[5px] size-2.5 rounded-full bg-sage-300 shadow-[0_0_0_4px_rgba(180,198,143,0.2)]"
              initial={false}
              animate={{ x: point[0], y: point[1] }}
              transition={SPRING_SOFT}
            />
            <motion.div
              className="glass absolute left-0 top-0 rounded-xl px-3 py-2"
              style={{ width: TOOLTIP_WIDTH }}
              initial={false}
              animate={{ x: tipX, y: tipY }}
              transition={SPRING_SOFT}
            >
              <span className="block font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-300">{MONTHS[month]}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={month}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className={cn('mt-0.5 block whitespace-nowrap text-[12px] font-medium', isLast ? 'text-sage-300' : 'text-ink-50')}
                >
                  {isLast ? '+85% growth' : 'Revenue'}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </div>
      <div className="mt-2 flex justify-between px-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-300">
        {['Jan', 'Apr', 'Jul', 'Oct', 'Dec'].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
});

/** Small bar chart; the last three bars are highlighted. */
const ActivityBars = memo(function ActivityBars({ play }) {
  return (
    <div className="mt-3 flex h-[88px] flex-1 items-end gap-[3px] sm:h-24 sm:gap-1">
      {ACTIVITY.map((height, i) => (
        <motion.span
          key={i}
          style={{ height: `${height}%` }}
          className={cn('block flex-1 origin-bottom rounded-[3px]', i >= ACTIVITY.length - 3 ? 'bg-sage-300/80' : 'bg-white/[0.12]')}
          initial={false}
          animate={play ? { scaleY: [1, 0.7, 1] } : { scaleY: 1 }}
          transition={play ? { duration: 2.2 + (i % 4) * 0.35, ease: 'easeInOut', repeat: Infinity, delay: i * 0.09 } : { duration: 0 }}
        />
      ))}
    </div>
  );
});
