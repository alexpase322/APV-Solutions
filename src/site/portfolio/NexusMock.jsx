import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatCircleTextIcon, ChatTeardropTextIcon, FireIcon, GaugeIcon, HandshakeIcon, PulseIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { useInterval } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { PulseDot, WindowFrame } from '../ui/primitives';
import { MockLabel, ScoreRing } from './MockParts';
import { useMockActivity } from './mockHooks';

const TABS = ['Deals', 'Tickets', 'Contacts', 'AI'];
const ACTIVITY = [
  { id: 'deal', kind: 'Deal', icon: HandshakeIcon, text: 'Deal moved to Negotiation', meta: '$12,400' },
  { id: 'ticket', kind: 'Ticket', icon: ChatCircleTextIcon, text: 'AI drafted reply for ticket #284' },
  { id: 'lead', kind: 'Lead', icon: FireIcon, text: 'New lead scored', meta: 'Hot (92)' },
];
const TICK_MS = 2600;
const LAYOUT_SPRING = { layout: { type: 'spring', stiffness: 260, damping: 30 } };

/** Illustrative APVNexus CRM: cycling tabs, a rotating activity feed, lead score and an AI-drafted reply. */
export function NexusMock() {
  const { ref, active, seen, reduce } = useMockActivity();
  const [tick, setTick] = useState(0);
  useInterval(() => setTick((t) => t + 1), TICK_MS, active);

  const activeTab = TABS[tick % TABS.length];
  const offset = tick % ACTIVITY.length;
  // newest event first: rotate the feed one step per tick
  const feed = ACTIVITY.map((_, i) => ACTIVITY[(i - offset + ACTIVITY.length) % ACTIVITY.length]);

  return (
    <WindowFrame
      title="APVNexus · CRM"
      right={
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-300">
          <span aria-hidden="true" className="flex h-3.5 w-6 items-center rounded-full bg-sage-300/85 px-[3px]">
            <span className="ml-auto size-2 rounded-full bg-ink-950" />
          </span>
          AI on
        </span>
      }
      bodyClassName="p-4 sm:p-5 lg:[@media(max-height:900px)]:p-4"
    >
      <div ref={ref} className="space-y-3 sm:space-y-4 lg:[@media(max-height:900px)]:space-y-3">
        <div className="grid grid-cols-4 gap-1 rounded-xl border border-white/[0.07] bg-ink-850/80 p-1">
          {TABS.map((tab) => {
            const selected = tab === activeTab;
            return (
              <div
                key={tab}
                className="relative isolate flex h-9 items-center justify-center gap-1.5 rounded-lg text-[12px] font-medium sm:text-[13px]"
              >
                {selected && (
                  <motion.span
                    layoutId="portfolio-nexus-tab"
                    transition={reduce ? { duration: 0 } : SPRING_SNAPPY}
                    className="absolute inset-0 -z-10 rounded-lg bg-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
                  />
                )}
                {tab === 'AI' && (
                  <span className={cn('size-1.5 rounded-full transition-colors duration-300', selected ? 'bg-ink-950' : 'bg-sage-300')} />
                )}
                <span className={cn('transition-colors duration-300', selected ? 'text-ink-950' : 'text-ink-200')}>{tab}</span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-5 sm:gap-4 lg:[@media(max-height:900px)]:gap-3">
          <div className="sm:col-span-3">
            <div className="flex items-center justify-between">
              <MockLabel icon={PulseIcon}>Activity</MockLabel>
              <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">
                <PulseDot tone="sage" size="sm" />
                Live
              </span>
            </div>
            <ul className="mt-2.5 space-y-2">
              {feed.map((event, i) => {
                const latest = i === 0;
                const Icon = event.icon;
                return (
                  <motion.li
                    key={event.id}
                    layout={!reduce}
                    transition={LAYOUT_SPRING}
                    className={cn(
                      'relative flex items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 transition-colors duration-500',
                      latest ? 'border-sage-300/25 bg-sage-300/[0.07]' : 'border-white/[0.06] bg-ink-850/60',
                    )}
                  >
                    {latest && !reduce && (
                      <motion.span
                        key={`sheen-${tick}`}
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-sage-300/[0.14] to-transparent"
                        initial={{ x: '-100%' }}
                        animate={{ x: '220%' }}
                        transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.15 }}
                      />
                    )}
                    <span
                      className={cn(
                        'grid size-9 shrink-0 place-items-center rounded-lg border transition-colors duration-500',
                        latest ? 'border-sage-300/30 bg-sage-300/15 text-sage-300' : 'border-white/[0.07] bg-white/[0.03] text-ink-200',
                      )}
                    >
                      <Icon weight="duotone" className="size-[18px]" />
                    </span>
                    <span className="relative min-w-0 flex-1">
                      <span className="block text-[13px] font-medium leading-snug text-ink-50">
                        {event.text}
                        {event.meta && (
                          <>
                            <span className="text-ink-200"> · </span>
                            <span className="text-sage-200 nums">{event.meta}</span>
                          </>
                        )}
                      </span>
                      <span className="mt-0.5 block font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-200">
                        {event.kind}
                        {latest ? ' · just now' : ''}
                      </span>
                    </span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-1 sm:gap-4 lg:[@media(max-height:900px)]:gap-3">
            <div className="flex flex-col items-center rounded-2xl border border-white/[0.07] bg-ink-850/60 p-3.5 sm:p-4 lg:[@media(max-height:900px)]:p-3.5">
              <MockLabel icon={GaugeIcon} className="self-start">
                Lead score
              </MockLabel>
              <ScoreRing
                value={92}
                play={seen}
                strokeWidth={9}
                className="mt-3 w-[5.25rem] sm:w-[6.5rem] lg:[@media(max-height:900px)]:mt-2 lg:[@media(max-height:900px)]:w-[5.5rem]"
                numberClassName="text-[1.6rem] sm:text-[2rem] lg:[@media(max-height:900px)]:text-[1.7rem]"
              />
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-gold-400/30 bg-gold-400/[0.08] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-gold-300">
                <PulseDot tone="gold" size="sm" />
                Hot
              </span>
            </div>
            <div className="flex flex-col rounded-2xl border border-white/[0.07] bg-ink-850/60 p-3.5 sm:p-4 lg:[@media(max-height:900px)]:p-3.5">
              <div className="flex items-center justify-between gap-2">
                <MockLabel icon={ChatTeardropTextIcon}>AI draft</MockLabel>
                <span className="font-mono text-[10px] text-ink-200 nums">#284</span>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded-full shimmer" />
                <div className="h-1.5 w-[86%] rounded-full shimmer" />
                <div className="h-1.5 w-[58%] rounded-full shimmer" />
              </div>
              <div className="mt-auto flex gap-1.5 pt-3.5">
                <span className="rounded-md bg-sage-300 px-2 py-1 text-[10.5px] font-semibold text-ink-950">Send</span>
                <span className="rounded-md border border-white/10 px-2 py-1 text-[10.5px] text-ink-100">Edit</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
