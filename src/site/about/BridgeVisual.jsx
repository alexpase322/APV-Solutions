import { useState } from 'react';
import { motion } from 'motion/react';
import { ChartBarIcon, ChartLineUpIcon, CodeIcon, FlowArrowIcon, SparkleIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { useActiveInView, useInterval } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { PulseDot } from '../ui/primitives';
import { pct } from './utils';

// Diagram geometry, in viewBox units.
const VIEW_W = 600;
const VIEW_H = 520;
const PANEL_W = 176;
const PANEL_TOP = 170;
const PANEL_H = 180;
/** x where the arcs leave the Business panel and land on the Technology panel. */
const LEFT_X = PANEL_W;
const RIGHT_X = 424;
const CENTER_X = VIEW_W / 2;

/**
 * One arc per capability. `y` anchors both ends on the panels, `apex` is the arc's peak and
 * `fwd` / `rev` are the [duration, delay] (seconds) of the two light pulses running along it.
 */
const LANES = [
  { label: 'Custom software', icon: CodeIcon, y: 200, apex: 64, fwd: [3.4, 0], rev: [4.2, 1.7] },
  { label: 'BI', icon: ChartBarIcon, y: 236, apex: 172, fwd: [2.9, 0.9], rev: [3.6, 2.3] },
  { label: 'AI', icon: SparkleIcon, y: 284, apex: 348, fwd: [3.2, 1.5], rev: [3.9, 0.4] },
  { label: 'Automation', icon: FlowArrowIcon, y: 320, apex: 456, fwd: [3.7, 0.3], rev: [3.3, 2.7] },
];

/**
 * Cubic arc between the panels whose midpoint sits on `apex`: both control points share one y,
 * and a cubic's midpoint is (y + 3c + 3c + y) / 8, so c = (8·apex − 2·y) / 6.
 */
function arcPath(y, apex, reverse = false) {
  const c = Math.round(((8 * apex - 2 * y) / 6) * 10) / 10;
  return reverse ? `M${RIGHT_X},${y} C368,${c} 232,${c} ${LEFT_X},${y}` : `M${LEFT_X},${y} C232,${c} 368,${c} ${RIGHT_X},${y}`;
}

const pulseTiming = ([duration, delay]) => ({ '--about-dur': `${duration}s`, '--about-delay': `${delay}s` });

/** Hero visual: Business and Technology panels joined by four capability arcs that light up in turn. */
export function BridgeVisual() {
  const { ref, inView, active } = useActiveInView();
  const [tick, setTick] = useState(0);
  useInterval(() => setTick((n) => n + 1), 2600, active);
  const current = tick % LANES.length;

  return (
    <div ref={ref} aria-hidden="true" className={cn('@container relative mx-auto w-full max-w-[640px]', !inView && 'about-paused')}>
      <div className="relative aspect-[600/520] w-full">
        <div className="absolute -inset-[8%] bg-dots opacity-60 mask-radial" />
        <div className="absolute left-1/2 top-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.16),transparent_66%)]" />

        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" className="absolute inset-0 size-full overflow-visible">
          <line
            x1={CENTER_X}
            x2={CENTER_X}
            y1={18}
            y2={502}
            stroke="rgba(234,240,245,0.12)"
            strokeDasharray="2 6"
            className="animate-dash"
            style={{ animationDuration: '3.2s' }}
          />
          {LANES.map((lane, i) => {
            const isCurrent = i === current;
            return (
              <g key={lane.label}>
                <path d={arcPath(lane.y, lane.apex)} stroke="rgba(234,240,245,0.12)" strokeWidth={1.25} />
                <motion.path
                  d={arcPath(lane.y, lane.apex, i % 2 === 1)}
                  stroke="#b4c68f"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: isCurrent ? 1 : 0, opacity: isCurrent ? 0.9 : 0 }}
                  transition={{ duration: isCurrent ? 1.3 : 0.7, ease: EASE_OUT_EXPO }}
                />
                <path
                  d={arcPath(lane.y, lane.apex)}
                  pathLength={1}
                  className="about-pulse"
                  style={pulseTiming(lane.fwd)}
                  stroke="#e2ead2"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                />
                <path
                  d={arcPath(lane.y, lane.apex)}
                  pathLength={1}
                  className="about-pulse about-pulse-rev"
                  style={pulseTiming(lane.rev)}
                  stroke="#b4c68f"
                  strokeWidth={2.1}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </svg>

        <BridgePanel side="left" title="Business" sub="People · Growth" icons={[ChartLineUpIcon, UsersThreeIcon]} />
        <BridgePanel side="right" title="Technology" sub="Code · Automation" icons={[CodeIcon, FlowArrowIcon]} />

        {/* Anchor dots sit above the panels */}
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {LANES.map((lane, i) => (
            <g key={lane.label}>
              {[LEFT_X, RIGHT_X].map((x) => (
                <circle
                  key={x}
                  cx={x}
                  cy={lane.y}
                  r={3.6}
                  fill={i === current ? '#b4c68f' : '#0a1118'}
                  stroke="rgba(180,198,143,0.75)"
                  strokeWidth={1.25}
                  className="transition-[fill] duration-500"
                />
              ))}
            </g>
          ))}
        </svg>

        {LANES.map((lane, i) => {
          const isCurrent = i === current;
          const Icon = lane.icon;
          return (
            <div key={lane.label} className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: pct(lane.apex, VIEW_H) }}>
              <motion.span
                animate={{ scale: isCurrent ? 1.07 : 1 }}
                transition={SPRING_SNAPPY}
                className={cn(
                  'inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] backdrop-blur-md transition-[color,border-color,background-color] duration-500 @md:gap-2 @md:px-3 @md:py-1.5 @md:text-[11px]',
                  isCurrent ? 'border-sage-300/45 bg-ink-800/90 text-sage-200' : 'border-white/10 bg-ink-850/80 text-ink-200',
                )}
              >
                <Icon weight={isCurrent ? 'fill' : 'regular'} className="size-3 @md:size-3.5" />
                {lane.label}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BridgePanel({ side, title, sub, icons }) {
  return (
    <div
      className={cn('absolute', side === 'left' ? 'left-0' : 'right-0')}
      style={{ top: pct(PANEL_TOP, VIEW_H), height: pct(PANEL_H, VIEW_H), width: pct(PANEL_W, VIEW_W) }}
    >
      <div className="glass relative flex size-full flex-col justify-between overflow-hidden rounded-2xl p-2.5 @md:rounded-3xl @md:p-4">
        <div className="absolute inset-0 bg-grid-sm opacity-50 mask-radial" />
        <div className="relative flex items-start justify-between">
          <div className="flex gap-1.5 @md:gap-2">
            {icons.map((Icon, i) => (
              <span
                key={i}
                className="grid size-7 place-items-center rounded-lg border border-sage-300/20 bg-sage-300/[0.08] text-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] @md:size-10 @md:rounded-xl"
              >
                <Icon weight="duotone" className="size-4 @md:size-5" />
              </span>
            ))}
          </div>
          <PulseDot tone="gold" size="sm" className="mt-1 hidden @md:inline-flex" />
        </div>
        <div className="relative">
          <span className="hidden font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-200 @xl:block">{sub}</span>
          <span className="block text-[13px] font-semibold tracking-[-0.02em] text-ink-50 @md:mt-1 @md:text-lg @xl:text-xl">{title}</span>
        </div>
      </div>
    </div>
  );
}
