import { memo, useId, useState } from 'react';
import { motion } from 'motion/react';
import { CodeIcon, LightningIcon, TrendUpIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../../lib/motion';
import { areaPath, seededRandom, smoothPath, useActiveInView, useInterval, useTypewriter } from '../../lib/hooks';
import { CountUp, PulseDot, WindowFrame } from '../../ui/primitives';

/** "APV_Dashboard_v2.0" window in the hero: revenue chart plus two live mini cards. */
export function DashboardMockup() {
  return (
    <WindowFrame
      title="APV_Dashboard_v2.0"
      right={
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200">
          <PulseDot tone="gold" size="sm" />
          Live
        </span>
      }
      bodyClassName="p-3 sm:p-4"
      className="shadow-[0_50px_120px_-40px_rgba(2,6,10,0.95)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1 font-mono text-[10px] uppercase tracking-[0.14em]">
          <span className="rounded-md bg-white/[0.07] px-2 py-1 text-ink-50">Overview</span>
          <span className="px-2 py-1 text-ink-200">Flows</span>
          <span className="hidden px-2 py-1 text-ink-200 sm:inline">Reports</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">This month</span>
      </div>
      <div className="grid gap-3">
        <RevenueCard />
        <div className="grid grid-cols-2 gap-3">
          <AutomationCard />
          <CustomDevCard />
        </div>
      </div>
    </WindowFrame>
  );
}

// Revenue chart geometry (SVG viewBox units)
const CHART_W = 320;
const CHART_H = 110;
const REVENUE = [30, 27, 36, 33, 44, 40, 52, 49, 61, 57, 70, 67, 81];
const POINTS = REVENUE.map((value, i) => [6 + (i * 302) / (REVENUE.length - 1), 102 - (value / 100) * 90]);
const LINE_PATH = smoothPath(POINTS);
const AREA_PATH = areaPath(POINTS, CHART_H);
const LAST_POINT = POINTS[POINTS.length - 1];

function RevenueCard() {
  const gradientId = useId();
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ink-900/55 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200">Monthly revenue growth</p>
          <p className="mt-2.5 text-[2.35rem] font-semibold leading-none tracking-[-0.05em] text-ink-50 sm:text-5xl">
            <CountUp value={24.5} prefix="+" suffix="%" decimals={1} duration={2.2} />
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-md border border-sage-300/25 bg-sage-300/[0.08] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-sage-200">
          <TrendUpIcon weight="bold" className="size-3" />
          Growth
        </span>
      </div>

      <div className="relative mt-4 aspect-[320/110] w-full">
        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b4c68f" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#b4c68f" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[24, 52, 80].map((y) => (
            <line key={y} x1="0" x2={CHART_W} y1={y} y2={y} stroke="rgba(234,240,245,0.07)" strokeDasharray="2 5" />
          ))}
          <motion.path
            d={AREA_PATH}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.5 }}
          />
          <motion.path
            d={LINE_PATH}
            fill="none"
            stroke="#b4c68f"
            strokeWidth={2.25}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.2, ease: EASE_OUT_EXPO, delay: 0.85 }}
          />
        </svg>
        <motion.span
          className="absolute grid size-3 -translate-x-1/2 -translate-y-1/2 place-items-center"
          style={{ left: `${(LAST_POINT[0] / CHART_W) * 100}%`, top: `${(LAST_POINT[1] / CHART_H) * 100}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, delay: 2.4 }}
        >
          <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulse-ring" />
          <span className="relative size-2.5 rounded-full border-2 border-ink-900 bg-sage-300" />
        </motion.span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">
          <span>Monthly target</span>
          <span className="text-sage-300">On track</span>
        </div>
        <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-sage-600 via-sage-400 to-sage-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 0.78 }}
            transition={{ duration: 1.9, ease: EASE_OUT_EXPO, delay: 1.1 }}
          >
            <div className="absolute inset-0 rounded-full shimmer opacity-70" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Stable pseudo-random bar heights; the visible window of 12 bars scrolls through them.
const BAR_HEIGHTS = (() => {
  const random = seededRandom(2024);
  return Array.from({ length: 36 }, (_, i) => 0.28 + random() * 0.5 + Math.sin(i / 3) * 0.12);
})();
const VISIBLE_BARS = 12;

const AutomationCard = memo(function AutomationCard() {
  const { ref, active } = useActiveInView();
  const [offset, setOffset] = useState(0);
  useInterval(() => setOffset((o) => (o + 1) % BAR_HEIGHTS.length), 1100, active);

  return (
    <div ref={ref} className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-white/[0.06] bg-ink-900/55 p-3.5 sm:p-4">
      <CardLabel icon={LightningIcon} label="Automation" />
      <div>
        <p className="nums text-xl font-semibold leading-none tracking-[-0.04em] text-ink-50 sm:text-2xl">20 hrs</p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">saved / week</p>
      </div>
      <div className="flex h-9 items-end gap-[3px]">
        {Array.from({ length: VISIBLE_BARS }, (_, i) => {
          const height = BAR_HEIGHTS[(i + offset) % BAR_HEIGHTS.length];
          const isLatest = i === VISIBLE_BARS - 1;
          return (
            <span key={i} className="relative h-full flex-1">
              <motion.span
                className={cn('absolute inset-x-0 bottom-0 h-full origin-bottom rounded-[2px]', isLatest ? 'bg-sage-200' : 'bg-sage-300/45')}
                initial={false}
                animate={{ scaleY: Math.min(1, height) }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
});

const SNIPPETS = ["build('React')", 'import pandas', 'await deploy()'];
const SNIPPET_LENGTHS = SNIPPETS.map((snippet) => snippet.length);

const CustomDevCard = memo(function CustomDevCard() {
  const { ref, active } = useActiveInView();
  const { index, count } = useTypewriter(SNIPPET_LENGTHS, active, { type: 75, erase: 32, hold: 1500 });
  const typed = SNIPPETS[index].slice(0, count);

  return (
    <div ref={ref} className="flex min-w-0 flex-col justify-between gap-4 rounded-2xl border border-white/[0.06] bg-ink-900/55 p-3.5 sm:p-4">
      <CardLabel icon={CodeIcon} label="Custom Dev" />
      <p className="text-[15px] font-semibold leading-tight tracking-[-0.03em] text-ink-50 sm:text-lg">React &amp; Python</p>
      <div className="flex h-9 items-center overflow-hidden whitespace-nowrap rounded-lg border border-white/[0.06] bg-ink-950/70 px-2.5 font-mono text-[10.5px] text-ink-100 sm:text-[11px]">
        <span className="mr-1.5 text-sage-300">&gt;</span>
        <span className="truncate">{typed}</span>
        <span className="ml-px inline-block h-3.5 w-[6px] shrink-0 bg-sage-300 animate-blink" />
      </div>
    </div>
  );
});

function CardLabel({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-sage-300/20 bg-sage-300/10 text-sage-300">
        <Icon weight="duotone" className="size-4" />
      </span>
      <span className="truncate text-[13px] font-medium text-ink-50">{label}</span>
    </div>
  );
}
