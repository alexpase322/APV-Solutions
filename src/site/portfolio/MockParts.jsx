import { motion, useReducedMotion } from 'motion/react';
import { MapPinIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { CountUp } from '../ui/primitives';

/** Tiny mono caption above a mock panel, with an optional icon. */
export function MockLabel({ children, icon: Icon, className }) {
  return (
    <p className={cn('flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-200', className)}>
      {Icon && <Icon weight="bold" className="size-3 shrink-0" />}
      {children}
    </p>
  );
}

/** Small mono pill inside mocks ("On site", "Verified"). */
export function MockChip({ children, icon: Icon, tone = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-md border px-1.5 py-[3px] font-mono text-[10px] tracking-wide',
        tone === 'sage' ? 'border-sage-300/25 bg-sage-300/[0.1] text-sage-200' : 'border-white/10 bg-white/[0.04] text-ink-100',
        className,
      )}
    >
      {Icon && <Icon weight="fill" className="size-3 shrink-0" />}
      {children}
    </span>
  );
}

/** Geofence radar: rings, a rotating conic sweep, pulsing centre and a map pin. */
export function RadarDial({ spinning, className }) {
  return (
    <div aria-hidden="true" className={cn('relative aspect-square overflow-hidden rounded-full', className)}>
      <div className="absolute inset-0 rounded-full border border-sage-300/15 bg-[radial-gradient(circle,rgba(148,163,120,0.14),transparent_70%)]" />
      <div className="absolute inset-[17%] rounded-full border border-sage-300/15" />
      <div className="absolute inset-[33%] rounded-full border border-dashed border-sage-300/40" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/[0.07]" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-white/[0.07]" />
      <div
        className={cn(
          'absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,rgba(180,198,143,0.32),rgba(180,198,143,0)_24%)]',
          !spinning && '[animation-play-state:paused]',
        )}
        style={{ animationDuration: '4.8s' }}
      />
      <span className="absolute inset-[43%] rounded-full border border-sage-300/70 animate-pulse-ring" />
      <span className="absolute inset-[43%] rounded-full border border-sage-300/50 animate-pulse-ring" style={{ animationDelay: '1.2s' }} />
      <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sage-200" />
      <MapPinIcon
        weight="fill"
        className="absolute left-1/2 top-1/2 size-[24%] -translate-x-1/2 -translate-y-[94%] text-sage-300 drop-shadow-[0_6px_8px_rgba(2,6,10,0.65)]"
      />
    </div>
  );
}

/** Circular 0–100 gauge whose arc draws in when `play` turns true, with a counting number in the middle. */
export function ScoreRing({ value, play, className, numberClassName, strokeWidth = 8 }) {
  const reduce = useReducedMotion() ?? false;
  const fraction = value / 100;
  const shown = { pathLength: fraction, opacity: 1 };
  const hidden = { pathLength: 0, opacity: 0 };

  return (
    <div aria-hidden="true" className={cn('relative aspect-square', className)}>
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(234,240,245,0.07)" strokeWidth={strokeWidth} />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="rgba(234,240,245,0.12)"
          strokeWidth={strokeWidth / 3}
          strokeDasharray="1 5.6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="#b4c68f"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={reduce ? shown : hidden}
          animate={play || reduce ? shown : hidden}
          transition={
            reduce
              ? { duration: 0 }
              : { pathLength: { duration: 1.8, ease: EASE_OUT_EXPO, delay: 0.25 }, opacity: { duration: 0.2, delay: 0.25 } }
          }
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className={cn('font-semibold leading-none tracking-[-0.04em] text-ink-50', numberClassName ?? 'text-2xl')}>
          <CountUp value={value} duration={1.8} />
        </span>
      </div>
    </div>
  );
}
