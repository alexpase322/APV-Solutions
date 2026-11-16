import { memo, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { cn } from '../../lib/cn';
import { pad, seededRandom, useActiveInView, useInterval } from '../../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SOFT } from '../../lib/motion';
import { CountUp } from '../../ui/primitives';

/** Stat tile with a counting number and a small animated visual picked by `index` (0–3). */
export function StatCard({ index, value, suffix, label }) {
  const { ref, active } = useActiveInView();
  const shown = useInView(ref, { once: true, amount: 0.5 });

  let visual = null;
  if (index === 0) visual = <ProgressRing shown={shown} active={active} />;
  if (index === 1) visual = <DotMatrix shown={shown} active={active} />;
  if (index === 2) visual = <GrowthBars shown={shown} active={active} />;
  if (index === 3) visual = <ClockDial active={active} />;

  return (
    <div
      ref={ref}
      className="surface group/stat relative flex h-full min-h-[208px] flex-col justify-between gap-7 overflow-hidden rounded-3xl p-5 sm:min-h-[248px] sm:p-7"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[radial-gradient(circle,rgba(180,198,143,0.1),transparent_70%)]"
      />
      <div className="flex items-start justify-between gap-3">
        <div aria-hidden="true" className="flex h-14 items-center">
          {visual}
        </div>
        <span className="nums font-mono text-[11px] tracking-[0.18em] text-ink-200">{pad(index + 1)}</span>
      </div>
      <div>
        <CountUp
          value={value}
          suffix={suffix}
          className="block text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-none tracking-[-0.05em] text-ink-50"
        />
        <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-ink-200">{label}</p>
      </div>
    </div>
  );
}

/** 100% commitment: a ring that closes, with a dot orbiting it. */
const ProgressRing = memo(function ProgressRing({ shown, active }) {
  return (
    <div className="relative size-14">
      <svg viewBox="0 0 56 56" className="size-full -rotate-90">
        <circle cx="28" cy="28" r="23" fill="none" stroke="rgba(234,240,245,0.08)" strokeWidth="4" />
        <motion.circle
          cx="28"
          cy="28"
          r="23"
          fill="none"
          stroke="#b4c68f"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: shown ? 1 : 0 }}
          transition={{ duration: 1.8, ease: EASE_OUT_EXPO, delay: 0.2 }}
        />
      </svg>
      <div
        className="absolute inset-0 animate-spin-slow"
        style={{ animationDuration: '5s', animationPlayState: active ? 'running' : 'paused' }}
      >
        <span className="absolute left-1/2 top-[2px] size-[7px] -translate-x-1/2 rounded-full border border-ink-900 bg-ink-50" />
      </div>
    </div>
  );
});

const DOTS = 50;
/** Stable sequence of dots to highlight, one after another. */
const HIGHLIGHTS = (() => {
  const random = seededRandom(50);
  return Array.from({ length: 24 }, () => Math.floor(random() * DOTS));
})();

/** 50+ clients: a 10×5 dot grid where one "client" lights up gold at a time. */
const DotMatrix = memo(function DotMatrix({ shown, active }) {
  const [step, setStep] = useState(-1);
  useInterval(() => setStep((n) => (n + 1) % HIGHLIGHTS.length), 700, active && shown);
  const lit = step >= 0 ? HIGHLIGHTS[step] : -1;

  return (
    <div className="grid grid-cols-10 gap-[3px]">
      {Array.from({ length: DOTS }, (_, i) => (
        <motion.span
          key={i}
          className={cn('size-[5px] rounded-full transition-colors duration-500', i === lit ? 'bg-gold-400' : 'bg-sage-300')}
          initial={{ opacity: 0.12, scale: 0.6 }}
          animate={shown ? { opacity: i === lit ? 1 : 0.85, scale: i === lit ? 1.5 : 1 } : { opacity: 0.12, scale: 0.6 }}
          transition={
            shown && step < 0 ? { delay: 0.2 + i * 0.018, duration: 0.4, ease: EASE_OUT_EXPO } : { type: 'spring', stiffness: 400, damping: 18 }
          }
        />
      ))}
    </div>
  );
});

/** 10x efficiency: ten rising bars that gently breathe. */
const GrowthBars = memo(function GrowthBars({ shown, active }) {
  return (
    <div className="flex h-12 w-[84px] items-end gap-[3px]">
      {Array.from({ length: 10 }, (_, i) => (
        <motion.span
          key={i}
          className="relative h-full flex-1 origin-bottom"
          initial={{ scaleY: 0.06 }}
          animate={{ scaleY: shown ? (i + 1) / 10 : 0.06 }}
          transition={{ ...SPRING_SOFT, delay: 0.15 + i * 0.06 }}
        >
          <motion.span
            className={cn('absolute inset-0 origin-bottom rounded-[2px]', i === 9 ? 'bg-sage-200' : 'bg-sage-300/50')}
            animate={active ? { scaleY: [1, 0.84, 1] } : { scaleY: 1 }}
            transition={active ? { duration: 2.6, ease: 'easeInOut', repeat: Infinity, delay: 1 + i * 0.12 } : { duration: 0.3 }}
          />
        </motion.span>
      ))}
    </div>
  );
});

/** Clock-face ticks: 24, with a longer, brighter one every 6. */
const TICKS = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  const outer = 23.5;
  const major = i % 6 === 0;
  const inner = major ? 18.5 : 21;
  return {
    x1: Math.sin(angle) * outer,
    y1: -Math.cos(angle) * outer,
    x2: Math.sin(angle) * inner,
    y2: -Math.cos(angle) * inner,
    major,
  };
});

/** 24/7 support: a clock whose hands keep turning. */
function ClockDial({ active }) {
  const playState = { animationPlayState: active ? 'running' : 'paused' };
  return (
    <div className="relative size-14 rounded-full border border-white/10 bg-ink-900/60">
      <svg viewBox="-28 -28 56 56" className="absolute inset-0 size-full">
        {TICKS.map((tick, i) => (
          <line
            key={i}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            stroke={tick.major ? 'rgba(234,240,245,0.5)' : 'rgba(234,240,245,0.16)'}
            strokeWidth={tick.major ? 1.5 : 1}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute inset-0 animate-spin-slow" style={{ ...playState, animationDuration: '60s' }}>
        <span className="absolute left-1/2 top-[15px] h-[13px] w-[2px] -translate-x-1/2 rounded-full bg-ink-100" />
      </div>
      <div className="absolute inset-0 animate-spin-slow" style={{ ...playState, animationDuration: '6s' }}>
        <span className="absolute left-1/2 top-[8px] h-[20px] w-[1.5px] -translate-x-1/2 rounded-full bg-sage-300" />
      </div>
      <span className="absolute left-1/2 top-1/2 size-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-ink-900 bg-sage-300" />
    </div>
  );
}
