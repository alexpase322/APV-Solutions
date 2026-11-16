import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChatCircleTextIcon, FireIcon, HandshakeIcon, MapPinIcon, SealCheckIcon } from '@phosphor-icons/react';
import { pad, useMediaQuery } from '../lib/hooks';
import { PRODUCTS } from '../lib/site';
import { PageHero } from '../ui/PageBlocks';
import { PulseDot } from '../ui/primitives';
import { HERO_COPY, LIVE_COUNT, SOON_COUNT, focusPanelOnClick } from './content';
import { CityArt, OceanArt, RoomArt, ScanSweep } from './ListingArt';
import { MockChip, RadarDial, ScoreRing } from './MockParts';
import { ProjectActions, StatusBadge } from './PortfolioUI';

const MotionLink = motion.create(Link);

/** Deck position per product (0 = left, 1 = centre/front, 2 = right) and its stacking, float phase and poses. */
const DECK_ORDER = { listingai: 0, jornixs: 1, apvnexus: 2 };
const DECK_Z = { 0: 10, 1: 30, 2: 20 };
const FLOAT_DELAY = { 0: '-2.4s', 1: '0s', 2: '-4.6s' };
const POSE_REST = {
  0: { x: '-27%', y: 26, rotate: -9, scale: 0.94 },
  1: { x: '0%', y: -8, rotate: -1.5, scale: 1 },
  2: { x: '27%', y: 26, rotate: 9, scale: 0.94 },
};
const POSE_SPREAD = {
  0: { x: '-50%', y: 40, rotate: -14, scale: 0.96 },
  1: { x: '0%', y: -24, rotate: 0, scale: 1.035 },
  2: { x: '50%', y: 40, rotate: 14, scale: 0.96 },
};
const POSE_SPREAD_COMPACT = {
  0: { x: '-34%', y: 34, rotate: -12, scale: 0.95 },
  1: { x: '0%', y: -18, rotate: 0, scale: 1.02 },
  2: { x: '34%', y: 34, rotate: 12, scale: 0.95 },
};
const DECK_SPRING = { type: 'spring', stiffness: 170, damping: 19, mass: 0.9 };

const NEXUS_ITEMS = [
  { icon: HandshakeIcon, label: 'Deal', meta: '$12,400' },
  { icon: ChatCircleTextIcon, label: 'Ticket', meta: '#284' },
  { icon: FireIcon, label: 'Lead', meta: 'Hot (92)' },
];

/** Miniature preview at the top of each deck card. */
function DeckCardArt({ slug }) {
  if (slug === 'jornixs') {
    return (
      <>
        <div className="absolute inset-0 bg-grid-sm opacity-70" />
        <RadarDial spinning className="absolute -right-[16%] top-1/2 w-[74%] -translate-y-1/2" />
        <div className="absolute left-3.5 top-3.5">
          <p className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-sage-300">
            <PulseDot tone="sage" size="sm" />
            Clocked in
          </p>
          <p className="mt-1.5 font-semibold leading-none tracking-[-0.045em] text-ink-50 nums">
            <span className="text-[1.5rem] xl:text-[1.8rem]">07:58</span>
            <span className="ml-1 text-[11px] font-medium tracking-normal text-ink-200">AM</span>
          </p>
        </div>
        <div className="absolute bottom-3 left-3.5 flex gap-1">
          <MockChip icon={MapPinIcon}>On site</MockChip>
          <MockChip icon={SealCheckIcon} tone="sage" className="max-sm:hidden">
            Verified
          </MockChip>
        </div>
      </>
    );
  }

  if (slug === 'listingai') {
    return (
      <>
        <div className="absolute inset-2 grid grid-cols-[1.35fr_1fr] grid-rows-2 gap-1.5">
          <div className="relative row-span-2 overflow-hidden rounded-[0.7rem]">
            <OceanArt />
          </div>
          <div className="relative overflow-hidden rounded-[0.7rem]">
            <RoomArt />
          </div>
          <div className="relative overflow-hidden rounded-[0.7rem]">
            <CityArt />
          </div>
        </div>
        <ScanSweep className="absolute inset-2 rounded-[0.7rem]" />
        <span className="glass absolute bottom-3 left-3 rounded-md px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-sage-200">
          Generating…
        </span>
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-0 bg-grid-sm opacity-60" />
      <ScoreRing
        value={92}
        play
        strokeWidth={10}
        className="absolute left-3 top-1/2 w-[36%] -translate-y-1/2"
        numberClassName="text-[1.3rem] xl:text-[1.6rem]"
      />
      <div className="absolute bottom-3 left-[45%] right-3 top-3 flex flex-col justify-center gap-1.5">
        {NEXUS_ITEMS.map(({ icon: Icon, label, meta }) => (
          <div key={label} className="flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-ink-850/90 px-1.5 py-1">
            <Icon weight="duotone" className="size-3 shrink-0 text-sage-300" />
            <span className="truncate font-mono text-[9px] text-ink-200 max-sm:hidden">{label}</span>
            <span className="ml-auto whitespace-nowrap font-mono text-[9px] text-sage-200 nums">{meta}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function DeckCard({ product, index }) {
  return (
    <div className="surface w-[13rem] rounded-[1.75rem] p-2.5 transition-[border-color] duration-500 group-hover:border-sage-300/30 sm:w-[15rem] xl:w-[17rem]">
      <div
        aria-hidden="true"
        className="relative h-[8rem] overflow-hidden rounded-[1.25rem] border border-white/[0.06] bg-ink-900 sm:h-[9rem] xl:h-[10.5rem]"
      >
        <DeckCardArt slug={product.slug} />
      </div>
      <div aria-hidden="true" className="px-2 pb-2 pt-4">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] tracking-[0.2em] text-ink-200 nums">{pad(index + 1)}</span>
          <StatusBadge status={product.status} />
        </div>
        <p className="mt-2.5 text-xl font-semibold tracking-[-0.035em] text-ink-50 xl:text-[1.4rem]">{product.name}</p>
        <p className="mt-1 font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-ink-200">{product.category}</p>
      </div>
    </div>
  );
}

/** Fanned deck of product cards; spreads out on hover / keyboard focus, each card jumps to its case file. */
function HeroDeck() {
  const wide = useMediaQuery('(min-width: 640px)');
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [settled, setSettled] = useState(false);
  const spread = hovered || focused;

  // after the entrance, pose changes spring immediately (no stagger delay)
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className="relative mx-auto grid h-[23rem] w-full max-w-[36rem] place-items-center sm:h-[27rem] xl:h-[31rem]"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 aspect-square w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.2),transparent_62%)]" />
        <svg
          viewBox="-100 -100 200 200"
          className="absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 animate-spin-slower"
        >
          <circle r="96" fill="none" stroke="rgba(234,240,245,0.09)" strokeDasharray="1.5 6" />
          <circle cx="96" cy="0" r="2" fill="#b4c68f" />
          <circle cx="-68" cy="68" r="1.4" fill="#e4b34c" />
        </svg>
      </div>
      {PRODUCTS.map((product, index) => {
        const order = DECK_ORDER[product.slug];
        const pose = (spread ? (wide ? POSE_SPREAD : POSE_SPREAD_COMPACT) : POSE_REST)[order];
        return (
          <div
            key={product.slug}
            className="col-start-1 row-start-1 animate-float"
            style={{ zIndex: DECK_Z[order], animationDelay: FLOAT_DELAY[order] }}
          >
            <MotionLink
              to={`#${product.slug}`}
              onClick={focusPanelOnClick(product.slug)}
              aria-label={`${product.name}, ${product.category.replace(/ · /g, ', ')}. ${product.status === 'live' ? 'Live' : 'Coming soon'}. Jump to the case file.`}
              className="group block rounded-[1.75rem]"
              initial={{ x: '0%', y: 40, rotate: 0, scale: 0.9, opacity: 0 }}
              animate={{ ...pose, opacity: 1 }}
              transition={settled ? DECK_SPRING : { ...DECK_SPRING, delay: 0.6 + order * 0.09 }}
            >
              <DeckCard product={product} index={index} />
            </MotionLink>
          </div>
        );
      })}
    </div>
  );
}

export function PortfolioHero() {
  return (
    <PageHero
      background="dots"
      eyebrow={HERO_COPY.eyebrow}
      title={HERO_COPY.title}
      description={HERO_COPY.description}
      actions={<ProjectActions />}
      footnote={
        <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
          <span className="inline-flex items-center gap-2">
            <PulseDot tone="gold" size="sm" />
            <span>
              <span className="text-ink-50 nums">{LIVE_COUNT}</span> live platforms
            </span>
          </span>
          <span aria-hidden="true" className="h-3 w-px bg-white/15" />
          <span>
            <span className="text-ink-50 nums">{SOON_COUNT}</span> coming soon
          </span>
        </span>
      }
      aside={<HeroDeck />}
    />
  );
}
