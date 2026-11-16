import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChatTeardropDotsIcon,
  ContactlessPaymentIcon,
  FileArrowDownIcon,
  HouseIcon,
  ImageSquareIcon,
  KanbanIcon,
  MapPinIcon,
  SealCheckIcon,
  SparkleIcon,
  UserFocusIcon,
} from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../../lib/motion';
import { useActiveInView, useInterval, useTypewriter } from '../../lib/hooks';
import { PulseDot } from '../../ui/primitives';

/** Fake browser bar: traffic-light dots, a URL-ish label and an optional status on the right. */
function MockBar({ label, right }) {
  return (
    <div className="flex h-6 items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2">
        <span className="flex gap-1">
          <span className="size-1.5 rounded-full bg-ink-500" />
          <span className="size-1.5 rounded-full bg-ink-500" />
          <span className="size-1.5 rounded-full bg-sage-500/70" />
        </span>
        <span className="truncate font-mono text-[10px] tracking-wide text-ink-200">{label}</span>
      </span>
      {right}
    </div>
  );
}

/** While `active`: false for `delayMs`, then true for `visibleMs`, repeating. */
function useRecurringFlag(active, visibleMs, delayMs) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!active) return undefined;
    let showTimer = 0;
    let hideTimer = 0;
    const schedule = () => {
      showTimer = window.setTimeout(() => {
        setOn(true);
        hideTimer = window.setTimeout(() => {
          setOn(false);
          schedule();
        }, visibleMs);
      }, delayMs);
    };
    schedule();
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [active, visibleMs, delayMs]);
  return on;
}

const JORNIXS_STATS = [
  ['This week', '38.5h'],
  ['Overtime', '2.5h'],
  ['Payroll', '$1,540'],
];

/** Jornixs: verified clock-in with a weekly-hours ring and a recurring "payroll ready" toast. */
export const JornixsMock = memo(function JornixsMock() {
  const { ref, active, reduce, inView } = useActiveInView();
  const toastVisible = useRecurringFlag(active, 2800, 2400);
  const showToast = reduce || toastVisible;

  return (
    <div ref={ref} className="relative flex h-full flex-col gap-3 p-4">
      <MockBar
        label="jornixs.com/dashboard"
        right={
          <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-200">
            <PulseDot tone="gold" size="sm" /> Live
          </span>
        }
      />

      <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.025] p-3.5">
        <div className="relative size-[60px] shrink-0">
          <svg viewBox="0 0 60 60" className="size-full -rotate-90">
            <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(234,240,245,0.08)" strokeWidth="5" />
            <motion.circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#b4c68f"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: inView || reduce ? 38.5 / 40 : 0 }}
              transition={{ duration: 1.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
            />
          </svg>
          <span className="nums absolute inset-0 grid place-items-center font-mono text-[11px] font-medium text-ink-50">38.5h</span>
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-200">Clocked in</p>
          <p className="nums mt-1 text-[1.6rem] font-semibold leading-none tracking-[-0.04em] text-ink-50">07:58 AM</p>
          <p className="mt-2 flex min-w-0 items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-sage-200">
            <span className="relative grid shrink-0 place-items-center">
              <span className="absolute size-3 rounded-full bg-sage-300/40 animate-pulse-ring" />
              <MapPinIcon weight="fill" className="relative size-3.5" />
            </span>
            <span className="truncate">On site · Verified</span>
            <SealCheckIcon weight="fill" className="size-3.5 shrink-0" />
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {JORNIXS_STATS.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
            <p className="truncate font-mono text-[9px] uppercase tracking-[0.14em] text-ink-200">{label}</p>
            <p className="nums mt-1 text-[15px] font-semibold tracking-[-0.03em] text-ink-50">{value}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-auto h-11">
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 18 } }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.25 } }}
              className="glass absolute inset-0 flex items-center gap-2.5 rounded-xl px-3"
            >
              <FileArrowDownIcon weight="duotone" className="size-4 shrink-0 text-sage-300" />
              <span className="truncate text-[12px] text-ink-50">Weekly payroll report ready — export PDF</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

const LISTING_TITLE = 'Modern 3BR Condo · Ocean View · Fully Furnished';
const LISTING_TITLE_LENGTHS = [LISTING_TITLE.length];
const LISTING_BULLETS = ['ocean view', '3 bedroom', 'furnished', 'downtown', 'pet friendly'];
const LISTING_PHOTOS = [HouseIcon, ImageSquareIcon, ImageSquareIcon];

/** ListingAI: photos scan, the AI title types itself out, then keyword bullets pop in. */
export const ListingAIMock = memo(function ListingAIMock() {
  const { ref, active } = useActiveInView();
  const { count, phase, done } = useTypewriter(LISTING_TITLE_LENGTHS, active, { type: 44, erase: false, hold: 3800, pause: 650 });
  const generating = !done;

  return (
    <div ref={ref} className="relative flex h-full flex-col gap-3 p-4">
      <MockBar
        label="listingai · new listing"
        right={
          <span className={cn('font-mono text-[9.5px] uppercase tracking-[0.16em]', generating ? 'text-ink-200' : 'text-sage-300')}>
            {generating ? 'Generating…' : 'Ready to publish'}
          </span>
        }
      />

      <motion.div animate={{ opacity: phase === 'next' ? 0 : 1 }} transition={{ duration: 0.4 }} className="flex flex-1 flex-col gap-3">
        <div className="grid grid-cols-3 gap-2">
          {LISTING_PHOTOS.map((Photo, i) => (
            <div
              key={i}
              className="relative grid h-10 place-items-center overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-br from-ink-600 via-ink-700 to-ink-850 sm:h-12"
            >
              <Photo weight="duotone" className="size-5 text-ink-200" />
              {generating && active && (
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sage-300/35 to-transparent"
                  initial={{ x: '-120%' }}
                  animate={{ x: '320%' }}
                  transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity, delay: i * 0.25 }}
                />
              )}
            </div>
          ))}
        </div>

        <div>
          <p className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-200">
            <SparkleIcon weight="fill" className="size-3 text-sage-300" /> AI title
          </p>
          <p className="mt-1.5 min-h-[2.7em] text-[14px] font-medium leading-[1.35] tracking-[-0.01em] text-ink-50">
            {LISTING_TITLE.slice(0, count)}
            {generating && <span className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-sage-300 animate-blink" />}
          </p>
        </div>

        <div>
          <p className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-ink-200">AI bullets</p>
          <ul className="mt-1.5 flex min-h-[54px] flex-wrap content-start gap-1 sm:gap-1.5">
            {LISTING_BULLETS.map((bullet, i) => (
              <motion.li
                key={bullet}
                initial={false}
                animate={done ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 4 }}
                transition={done ? { ...SPRING_SNAPPY, delay: i * 0.09 } : { duration: 0.2 }}
                className="rounded-md border border-sage-300/25 bg-sage-300/[0.08] px-1.5 py-1 font-mono text-[10px] text-sage-200 sm:px-2 sm:text-[10.5px]"
              >
                {bullet}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
});

const NEXUS_TABS = ['Deals', 'Tickets', 'Contacts', 'AI'];
const NEXUS_FEED = [
  { id: 'deal', icon: KanbanIcon, title: 'Deal moved to Negotiation', meta: '$12,400', tab: 0 },
  { id: 'ticket', icon: ChatTeardropDotsIcon, title: 'AI drafted reply for ticket #284', tab: 3 },
  { id: 'lead', icon: UserFocusIcon, title: 'New lead scored', meta: 'Hot (92)', tab: 2 },
];

/** APVNexus: an activity feed that rotates, with the tab of the newest item highlighted. */
export const NexusMock = memo(function NexusMock() {
  const { ref, active } = useActiveInView();
  const [feed, setFeed] = useState(NEXUS_FEED);
  useInterval(() => setFeed((items) => [items[items.length - 1], ...items.slice(0, -1)]), 2600, active);
  const activeTab = feed[0].tab;

  return (
    <div ref={ref} className="relative flex h-full flex-col gap-3 p-4">
      <MockBar
        label="APVNexus · CRM"
        right={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sage-300/25 bg-sage-300/[0.08] py-0.5 pl-1 pr-2 font-mono text-[9.5px] uppercase tracking-[0.14em] text-sage-200">
            <span className="size-2.5 rounded-full bg-sage-300" /> AI on
          </span>
        }
      />

      <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
        {NEXUS_TABS.map((tab, i) => (
          <span
            key={tab}
            className={cn(
              'relative flex-1 rounded-md py-1 text-center font-mono text-[10px] uppercase tracking-[0.1em] transition-colors duration-300',
              i === activeTab ? 'text-ink-50' : 'text-ink-300',
            )}
          >
            {i === activeTab && <motion.span layoutId="home-nexus-tab" transition={SPRING_SNAPPY} className="absolute inset-0 rounded-md bg-white/[0.08]" />}
            <span className="relative">{tab}</span>
          </span>
        ))}
      </div>

      <ul className="flex flex-col gap-2">
        {feed.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.id}
              layout="position"
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className={cn(
                'flex h-[50px] items-center gap-3 rounded-xl border px-3 transition-colors duration-500',
                i === 0 ? 'border-sage-300/25 bg-sage-300/[0.06]' : 'border-white/[0.06] bg-white/[0.02]',
              )}
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-lg transition-colors duration-500',
                  i === 0 ? 'bg-sage-300 text-ink-950' : 'bg-white/[0.05] text-ink-200',
                )}
              >
                <Icon weight="duotone" className="size-4" />
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink-50">{item.title}</span>
              {item.meta && <span className="nums shrink-0 font-mono text-[10.5px] text-sage-200">{item.meta}</span>}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
});

/** NFC card: a demo business card tilting in 3D over expanding tap rings. */
export const NfcCardMock = memo(function NfcCardMock() {
  const { ref, active } = useActiveInView();

  return (
    <div ref={ref} className="relative flex h-full flex-col p-4">
      <MockBar
        label="apvsolutions.tech/nfc"
        right={
          <span className="rounded-md border border-gold-400/30 bg-gold-400/[0.08] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-gold-300">
            Demo profile
          </span>
        }
      />

      <div className="relative grid flex-1 place-items-center [perspective:900px]">
        {[0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            className="absolute left-1/2 top-1/2 size-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sage-300/30"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={active ? { opacity: [0, 0.7, 0], scale: [0.55, 1.25] } : { opacity: 0, scale: 0.5 }}
            transition={active ? { duration: 3, ease: 'easeOut', repeat: Infinity, delay: ring } : { duration: 0.3 }}
          />
        ))}
        <motion.div
          animate={active ? { rotateY: [-10, 10], rotateX: [6, -4] } : { rotateY: -6, rotateX: 4 }}
          transition={active ? { duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' } : { duration: 0.4 }}
          className="relative aspect-[1.586/1] w-[min(240px,82%)] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-600 via-ink-750 to-ink-900 p-4 shadow-[0_30px_60px_-24px_rgba(2,6,10,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] [transform-style:preserve-3d]"
        >
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,rgba(255,255,255,0.09)_45%,transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="text-lg font-semibold tracking-[-0.04em] text-ink-50">
                APV<span className="text-sage-300">.</span>
              </span>
              <ContactlessPaymentIcon weight="regular" className="size-6 text-sage-300" />
            </div>
            <div>
              <p className="text-[15px] font-semibold tracking-[-0.02em] text-ink-50">Alex Rivera</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.28em] text-ink-200">Tap to connect</p>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center font-mono text-[9.5px] uppercase tracking-[0.16em] text-ink-200">Sample card · demo data</p>
    </div>
  );
});
