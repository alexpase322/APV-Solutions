import { memo, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { ChartLineUpIcon, CheckCircleIcon, CodeIcon, FlowArrowIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { useInterval } from '../lib/hooks';
import { SPRING_SNAPPY } from '../lib/motion';
import { IconTile, PulseDot } from '../ui/primitives';

/** How long each row stays highlighted while the index cycles on its own. */
const CYCLE_MS = 2800;

const visualClass = (on) => (on ? 'opacity-100' : 'opacity-45');

/** Three "code lines" that grow and shrink. */
const CodeLinesVisual = memo(function CodeLinesVisual({ on, play }) {
  return (
    <span className={cn('flex h-7 w-full flex-col justify-center gap-[5px] transition-opacity duration-500', visualClass(on))}>
      {[
        { w: 'w-[86%]', delay: 0 },
        { w: 'w-[58%] ml-[14%]', delay: 0.35 },
        { w: 'w-[70%] ml-[14%]', delay: 0.7 },
      ].map((line, i) => (
        <motion.span
          key={i}
          className={cn('block h-[3px] origin-left rounded-full', line.w, i === 0 ? 'bg-sage-300' : 'bg-ink-300')}
          initial={false}
          animate={play ? { scaleX: [0.15, 1, 1, 0.15] } : { scaleX: 1 }}
          transition={
            play
              ? { duration: 2.6, times: [0, 0.35, 0.8, 1], ease: 'easeInOut', repeat: Infinity, delay: line.delay }
              : { duration: 0 }
          }
        />
      ))}
    </span>
  );
});

/** A dot travelling across three workflow steps. */
const FlowVisual = memo(function FlowVisual({ on, play }) {
  return (
    <span className={cn('relative flex h-7 w-full items-center transition-opacity duration-500', visualClass(on))}>
      <span className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/15" />
      <span className="relative flex w-full items-center justify-between">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-[3px] border border-sage-300/50 bg-ink-800" />
        ))}
      </span>
      <motion.span
        className="absolute left-px top-1/2 -mt-[3px] size-1.5 rounded-full bg-sage-300 shadow-[0_0_0_3px_rgba(180,198,143,0.18)]"
        initial={false}
        animate={play ? { x: [0, 28, 28, 56], opacity: [0, 1, 1, 0] } : { x: 28, opacity: 1 }}
        transition={play ? { duration: 2, times: [0, 0.45, 0.6, 1], ease: 'easeInOut', repeat: Infinity } : { duration: 0 }}
      />
    </span>
  );
});

const BAR_HEIGHTS = [0.45, 0.7, 0.55, 0.85, 1];

/** A small bar chart that breathes. */
const BarsVisual = memo(function BarsVisual({ on, play }) {
  return (
    <span className={cn('flex h-7 w-full items-end justify-end gap-[3px] transition-opacity duration-500', visualClass(on))}>
      {BAR_HEIGHTS.map((height, i) => (
        <motion.span
          key={i}
          style={{ height: `${height * 100}%` }}
          className={cn('block w-[7px] origin-bottom rounded-[2px]', i === BAR_HEIGHTS.length - 1 ? 'bg-sage-300' : 'bg-ink-300/80')}
          initial={false}
          animate={play ? { scaleY: [1, 0.55, 1] } : { scaleY: 1 }}
          transition={
            play ? { duration: 1.8 + (i % 3) * 0.35, ease: 'easeInOut', repeat: Infinity, delay: i * 0.14 } : { duration: 0 }
          }
        />
      ))}
    </span>
  );
});

const ROWS = [
  {
    id: 'software',
    index: '01',
    title: 'Custom software',
    sub: 'React · Python · Cloud',
    status: 'Building',
    Icon: CodeIcon,
    Visual: CodeLinesVisual,
  },
  {
    id: 'automation',
    index: '02',
    title: 'Process automation',
    sub: 'n8n · Zapier · Twilio',
    status: 'Running',
    Icon: FlowArrowIcon,
    Visual: FlowVisual,
  },
  {
    id: 'bi',
    index: '03',
    title: 'BI & dashboards',
    sub: 'Power BI · Looker · Tableau',
    status: 'Syncing',
    Icon: ChartLineUpIcon,
    Visual: BarsVisual,
  },
];

/**
 * Hero visual: a glass card listing the three practices as links to their sections. It highlights
 * each row in turn (with a timer line) while in view; hovering or focusing a row pins it.
 */
export function ServiceIndex() {
  const ref = useRef(null);
  const labelId = useId();
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);
  const [pinned, setPinned] = useState(null);
  const active = pinned ?? tick;
  const cycling = !reduce && inView && pinned === null;

  useInterval(() => setTick((i) => (i + 1) % ROWS.length), CYCLE_MS, cycling);

  return (
    <div ref={ref} className="relative mx-auto w-full min-w-0 max-w-[560px] lg:ml-auto lg:mr-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-[radial-gradient(circle_at_60%_40%,rgba(148,163,120,0.18),transparent_62%)]"
      />
      <div className="glass relative overflow-hidden rounded-4xl p-2.5 sm:p-4">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-grid-sm opacity-40 mask-radial" />
        <div className="relative flex items-center justify-between gap-4 px-2.5 pb-3 pt-2 sm:px-4">
          <span id={labelId} className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            Service index
          </span>
          <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            <PulseDot tone="sage" size="sm" />
            <span>3 practices</span>
          </span>
        </div>
        <nav aria-labelledby={labelId} className="relative">
          <ul className="grid grid-cols-1 gap-1">
            {ROWS.map((row, i) => (
              <li key={row.id} className="min-w-0">
                <IndexRow
                  row={row}
                  active={active === i}
                  showTimer={cycling && active === i}
                  timerKey={tick}
                  play={inView && !reduce}
                  onEnter={() => setPinned(i)}
                  onLeave={() => setPinned(null)}
                />
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/[0.06] px-2.5 pb-1 pt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-200 sm:px-4 sm:tracking-[0.18em]">
          <span className="whitespace-nowrap">Remote · US &amp; LATAM</span>
          <span className="whitespace-nowrap text-sage-300">24/7 support</span>
        </div>
      </div>
      <div aria-hidden="true" className="absolute -right-2 -top-6 hidden sm:block lg:-right-6">
        <div className="animate-float">
          <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 font-mono text-[12px] text-ink-100">
            <CheckCircleIcon weight="fill" className="size-4 text-sage-300" />
            <span>
              {'return '}
              <span className="text-gold-300">&quot;Success&quot;</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndexRow({ row, active, showTimer, timerKey, play, onEnter, onLeave }) {
  const { Icon, Visual } = row;
  return (
    <Link
      to={`#${row.id}`}
      onPointerEnter={(event) => event.pointerType === 'mouse' && onEnter()}
      onPointerLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      className="group relative isolate flex min-h-[76px] min-w-0 items-center gap-3 rounded-3xl px-2.5 py-3.5 outline-offset-2 sm:gap-4 sm:px-4"
    >
      {active && (
        <motion.span
          layoutId="svc-index-highlight"
          transition={SPRING_SNAPPY}
          aria-hidden="true"
          className="absolute inset-0 -z-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          {showTimer && (
            <motion.span
              key={timerKey}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: CYCLE_MS / 1000, ease: 'linear' }}
              className="absolute inset-x-5 bottom-0 block h-px origin-left bg-gradient-to-r from-sage-300/0 via-sage-300/70 to-sage-300/0"
            />
          )}
        </motion.span>
      )}
      <span
        aria-hidden="true"
        className={cn(
          'w-5 shrink-0 font-mono text-[11px] tracking-[0.12em] transition-colors duration-500 max-sm:hidden',
          active ? 'text-sage-300' : 'text-ink-300',
        )}
      >
        {row.index}
      </span>
      <IconTile
        size="sm"
        className={cn('transition-[background-color,border-color,color] duration-500', !active && 'border-white/[0.07] bg-white/[0.03] text-ink-200')}
      >
        <Icon weight="duotone" className="size-5" />
      </IconTile>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium tracking-[-0.01em] text-ink-50 sm:text-base">{row.title}</span>
        <span className="mt-1 block break-words font-mono text-[11px] tracking-wide text-ink-200 sm:truncate">{row.sub}</span>
      </span>
      <span aria-hidden="true" className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="block w-16">
          <Visual on={active} play={play} />
        </span>
        <span
          className={cn(
            'flex items-center gap-1 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-500 sm:gap-1.5 sm:tracking-[0.16em]',
            active ? 'text-sage-300' : 'text-ink-300',
          )}
        >
          {active ? <PulseDot tone="sage" size="sm" /> : <span className="size-1.5 shrink-0 rounded-full bg-ink-400" />}
          {row.status}
        </span>
      </span>
    </Link>
  );
}
