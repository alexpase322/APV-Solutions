import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ClockIcon, FilePdfIcon, MapPinIcon, SealCheckIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad, useInterval } from '../lib/hooks';
import { EASE_OUT_EXPO } from '../lib/motion';
import { CountUp, PulseDot, WindowFrame } from '../ui/primitives';
import { MockChip, MockLabel, RadarDial } from './MockParts';
import { useMockActivity, useSequence } from './mockHooks';

/** Seconds on the session clock when it starts ticking (04:12:37). */
const SESSION_START = 15157;
const WEEK = [
  { day: 'Mon', hours: 8 },
  { day: 'Tue', hours: 8.5 },
  { day: 'Wed', hours: 7.5 },
  { day: 'Thu', hours: 8 },
  { day: 'Fri', hours: 6.5, today: true },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 },
];
const MAX_HOURS = 10;
const SUMMARY = [
  { label: 'This week', value: 38.5, decimals: 1, suffix: 'h' },
  { label: 'Overtime', value: 2.5, decimals: 1, suffix: 'h', note: '1.5x' },
  { label: 'Payroll', value: 1540, decimals: 0, prefix: '$' },
];

const formatClock = (seconds) =>
  `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;

/** hh:mm:ss session clock that ticks every second while `active`. */
function SessionTimer({ active }) {
  const [seconds, setSeconds] = useState(SESSION_START);
  useInterval(() => setSeconds((s) => s + 1), 1000, active);
  return <span className="font-mono text-[13px] text-ink-50 nums">{formatClock(seconds)}</span>;
}

/** Illustrative Jornixs dashboard: geofenced clock-in, week totals, hours chart and a payroll-ready toast. */
export function JornixsMock() {
  const { ref, active, seen, reduce } = useMockActivity();
  const [toast, setToast] = useState(false);

  useSequence(active, async (sequence) => {
    setToast(false);
    for (;;) {
      await sequence.wait(1900);
      setToast(true);
      await sequence.wait(3900);
      setToast(false);
      await sequence.wait(1500);
    }
  });

  const showToast = reduce || toast;

  return (
    <WindowFrame
      title="jornixs.com/dashboard"
      right={
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-300">
          <PulseDot tone="gold" size="sm" />
          Live
        </span>
      }
      bodyClassName="p-0 sm:p-0"
    >
      <div
        ref={ref}
        className="relative flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 lg:[@media(max-height:900px)]:gap-3 lg:[@media(max-height:900px)]:p-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-850/80 p-4 sm:p-5 lg:[@media(max-height:900px)]:p-4">
          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-300">
                <PulseDot tone="sage" size="sm" />
                Clocked in
              </p>
              <p className="mt-2.5 flex items-baseline gap-1.5 font-semibold leading-none tracking-[-0.045em] text-ink-50 nums">
                <span className="text-[2rem] sm:text-[2.6rem]">07:58</span>
                <span className="text-sm font-medium tracking-normal text-ink-200">AM</span>
              </p>
              <div className="mt-3.5 flex flex-wrap gap-1.5">
                <MockChip icon={MapPinIcon}>On site</MockChip>
                <MockChip icon={SealCheckIcon} tone="sage">
                  Verified
                </MockChip>
              </div>
            </div>
            <div className="relative grid w-[36%] max-w-[8.5rem] shrink-0 place-items-center rounded-xl border border-white/[0.06] bg-ink-900/70 p-1.5 sm:p-2 lg:[@media(max-height:900px)]:max-w-[7rem]">
              <div aria-hidden="true" className="absolute inset-0 rounded-xl bg-grid-sm opacity-70" />
              <RadarDial spinning={active} className="relative w-full" />
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.06] pt-3.5 lg:[@media(max-height:760px)]:hidden">
            <div className="flex items-center justify-between gap-3">
              <MockLabel icon={ClockIcon}>Session</MockLabel>
              <SessionTimer active={active} />
            </div>
            <div className="mt-2.5 flex h-1.5 gap-1">
              <span className="flex-[5] rounded-full bg-sage-300/70" />
              <span className="flex-[1] rounded-full bg-[repeating-linear-gradient(135deg,rgba(234,240,245,0.28)_0_2px,transparent_2px_4px)]" />
              <span className="relative flex-[3] overflow-hidden rounded-full bg-sage-300/20">
                <span className="absolute inset-0 shimmer" />
              </span>
            </div>
            <div className="mt-1.5 flex justify-between font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-200">
              <span>Shift</span>
              <span>Lunch</span>
              <span>Now</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {SUMMARY.map((stat) => (
            <div
              key={stat.label}
              className="min-w-0 rounded-xl border border-white/[0.07] bg-ink-850/60 px-2.5 py-3 sm:px-4 sm:py-3.5 lg:[@media(max-height:900px)]:py-3"
            >
              <p className="flex items-center justify-between gap-1 font-mono text-[9.5px] uppercase tracking-[0.08em] text-ink-200 sm:text-[10px] sm:tracking-[0.16em]">
                <span className="truncate">{stat.label}</span>
                {stat.note && (
                  <span className="hidden rounded border border-gold-400/30 px-1 text-[9px] tracking-normal text-gold-300 sm:inline">
                    {stat.note}
                  </span>
                )}
              </p>
              <p className="mt-1.5 text-lg font-semibold tracking-[-0.03em] text-ink-50 sm:text-[1.6rem] sm:leading-tight">
                <CountUp value={stat.value} decimals={stat.decimals} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} />
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-ink-850/60 p-4 sm:p-5 lg:[@media(max-height:900px)]:p-4">
          <div className="flex items-center justify-between">
            <MockLabel>Weekly hours</MockLabel>
            <span className="font-mono text-[10px] text-ink-200 nums">38.5h</span>
          </div>
          <div className="mt-3 flex h-24 items-end gap-1.5 sm:h-28 sm:gap-2.5 lg:h-24 lg:[@media(max-height:900px)]:h-16">
            {WEEK.map((entry, i) => {
              const today = Boolean(entry.today);
              const empty = 100 - (entry.hours / MAX_HOURS) * 100;
              const drawn = seen || reduce;
              return (
                <div key={entry.day} className="flex h-full min-w-0 flex-1 flex-col items-center gap-2">
                  <div className="relative w-full flex-1 overflow-hidden rounded-md bg-white/[0.035]">
                    <motion.div
                      className={cn('absolute inset-0', today ? 'bg-gradient-to-t from-sage-500/80 to-sage-300' : 'bg-sage-300/40')}
                      initial={false}
                      animate={{ clipPath: `inset(${drawn ? empty : 100}% 0% 0% 0% round 6px)` }}
                      transition={reduce ? { duration: 0 } : { duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 + i * 0.07 }}
                    />
                    {today && drawn && (
                      <span
                        className="absolute inset-x-0 bottom-0 rounded-t-[6px] shimmer opacity-70"
                        style={{ top: `${empty}%` }}
                      />
                    )}
                  </div>
                  <span className={cn('font-mono text-[10px] uppercase tracking-[0.1em]', today ? 'text-sage-300' : 'text-ink-200')}>
                    <span className="sm:hidden">{entry.day[0]}</span>
                    <span className="max-sm:hidden">{entry.day}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              key="payroll-toast"
              initial={{ opacity: 0, y: 26, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 22 } }}
              exit={{ opacity: 0, y: 14, scale: 0.97, transition: { duration: 0.35, ease: EASE_OUT_EXPO } }}
              className="glass absolute inset-x-4 bottom-4 z-10 flex items-center gap-3 rounded-2xl p-3 sm:inset-x-auto sm:bottom-5 sm:right-5 sm:w-[21rem]"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-sage-300/25 bg-sage-300/10 text-sage-300">
                <FilePdfIcon weight="duotone" className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium leading-tight text-ink-50">Weekly payroll report ready</span>
                <span className="mt-1 block font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-200">PDF / Excel</span>
              </span>
              <span className="shrink-0 rounded-lg bg-sage-300 px-2.5 py-1.5 text-[11px] font-semibold text-ink-950">Export PDF</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </WindowFrame>
  );
}
