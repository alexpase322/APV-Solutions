import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { StackIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { pad } from '../../lib/hooks';
import { EASE_OUT_EXPO } from '../../lib/motion';
import { TextLink } from '../../ui/Button';
import { SpotlightCard } from '../../ui/Cards';
import { Marquee } from '../../ui/Marquee';
import { IconTile } from '../../ui/primitives';
import { CAPABILITY_LIST, PRACTICE_BREAKDOWN } from './capabilities';

const ROWS = [CAPABILITY_LIST.slice(0, 6), CAPABILITY_LIST.slice(6, 11), CAPABILITY_LIST.slice(11)];
const PRACTICE_COLORS = ['bg-sage-300', 'bg-sage-500', 'bg-sage-700', 'bg-ink-300'];
const practiceColor = (i) => PRACTICE_COLORS[i % PRACTICE_COLORS.length];

/** "Everything we ship" card: capability count, a split bar by practice and three capability marquees. */
export function CapabilitiesCard() {
  const marqueesRef = useRef(null);
  const barRef = useRef(null);
  const marqueesInView = useInView(marqueesRef, { margin: '100px 0px' });
  const barInView = useInView(barRef, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  return (
    <SpotlightCard as="article" aria-labelledby="stream-title" className="flex h-full flex-col overflow-hidden py-7 sm:py-9">
      <div className="flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-9">
        <div>
          <div className="flex items-center gap-4">
            <IconTile size="sm">
              <StackIcon weight="duotone" className="size-5" />
            </IconTile>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">{CAPABILITY_LIST.length} capabilities</span>
          </div>
          <h3 id="stream-title" className="mt-6 text-2xl font-semibold leading-[1.1] tracking-[-0.035em] text-ink-50 sm:text-[1.75rem]">
            Everything we ship
          </h3>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-ink-200 sm:text-base">
            One team across the stack — apps and APIs, automations, dashboards, AI-assisted CRMs and NFC business cards.
          </p>
        </div>
        <TextLink to="/services" className="min-h-11 shrink-0 sm:-mb-2">
          Explore all services
        </TextLink>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-9">
        <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
          <span>By practice</span>
          <span className="nums">
            {pad(CAPABILITY_LIST.length)} / {pad(PRACTICE_BREAKDOWN.length)} practices
          </span>
        </div>
        <div ref={barRef} aria-hidden="true" className="mt-3 flex h-2.5 gap-1">
          {PRACTICE_BREAKDOWN.map((item, i) => (
            <motion.span
              key={item.practice}
              className={cn('h-full origin-left rounded-full', practiceColor(i))}
              style={{ flexGrow: item.count, flexBasis: 0 }}
              initial={!reduce && { scaleX: 0 }}
              animate={barInView || reduce ? { scaleX: 1 } : undefined}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.1 + i * 0.12 }}
            />
          ))}
        </div>
        <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 min-[420px]:grid-cols-2">
          {PRACTICE_BREAKDOWN.map((item, i) => (
            <li key={item.practice} className="flex items-center gap-3 border-t border-white/[0.06] pt-3">
              <span aria-hidden="true" className={cn('size-2.5 shrink-0 rounded-[3px]', practiceColor(i))} />
              <span className="min-w-0 flex-1 truncate text-[15px] text-ink-100">{item.practice}</span>
              <span className="nums font-mono text-[13px] text-ink-200">
                {pad(item.count)}
                <span className="sr-only">{' capabilities'}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div ref={marqueesRef} className={cn('flex flex-col gap-3', !marqueesInView && '[&_.animate-marquee]:[animation-play-state:paused]')}>
        <Marquee duration={48} gap="0.75rem" label="Capabilities, part one">
          {ROWS[0].map((cap) => (
            <CapabilityChip key={cap.name} cap={cap} />
          ))}
        </Marquee>
        <Marquee duration={58} reverse gap="0.75rem" label="Capabilities, part two">
          {ROWS[1].map((cap) => (
            <CapabilityChip key={cap.name} cap={cap} />
          ))}
        </Marquee>
        <Marquee duration={52} gap="0.75rem" repeat={2} label="Capabilities, part three">
          {ROWS[2].map((cap) => (
            <CapabilityChip key={cap.name} cap={cap} />
          ))}
        </Marquee>
      </div>
    </SpotlightCard>
  );
}

function CapabilityChip({ cap, className }) {
  const Icon = cap.icon;
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl border border-white/[0.06] bg-ink-850/80 py-3 pl-3 pr-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300">
        <Icon weight="duotone" className="size-5" />
      </span>
      <span>
        <span className="block text-[14px] font-medium leading-snug text-ink-50">{cap.name}</span>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">{cap.practice}</span>
      </span>
    </div>
  );
}
