import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, CircleNotchIcon, ListBulletsIcon, ScanIcon, ShareNetworkIcon, TextAaIcon, TextAlignLeftIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { WindowFrame } from '../ui/primitives';
import { CityArt, OceanArt, RoomArt } from './ListingArt';
import { MockLabel } from './MockParts';
import { useMockActivity, useSequence } from './mockHooks';

const AI_TITLE = 'Modern 3BR Condo · Ocean View · Fully Furnished';
const AI_BULLETS = ['ocean view', '3 bedroom', 'furnished', 'downtown', 'pet friendly'];
/** Listing photos and where the AI "finds" each highlight on them. */
const PHOTOS = [
  { Art: OceanArt, label: 'ocean view', box: 'left-[12%] top-[30%] h-[34%] w-[70%]', className: 'row-span-2' },
  { Art: RoomArt, label: 'furnished', box: 'left-[6%] top-[42%] h-[40%] w-[56%]' },
  { Art: CityArt, label: 'downtown', box: 'left-[14%] top-[30%] h-[56%] w-[72%]' },
];
const BULLET_SPRING = { type: 'spring', stiffness: 520, damping: 17, mass: 0.8 };

/** Illustrative ListingAI generator: scans photos for highlights, types a title, pops in bullets, then loops. */
export function ListingAIMock() {
  const { ref, active, reduce } = useMockActivity();
  const [scanKey, setScanKey] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [found, setFound] = useState(0);
  const [typed, setTyped] = useState(0);
  const [bulletCount, setBulletCount] = useState(0);
  const [fading, setFading] = useState(false);

  useSequence(active, async (sequence) => {
    for (;;) {
      setFading(false);
      setScanning(false);
      setFound(0);
      setTyped(0);
      setBulletCount(0);
      await sequence.wait(650);
      setScanKey((key) => key + 1);
      setScanning(true);
      await sequence.wait(560);
      setFound(1);
      await sequence.wait(620);
      setFound(2);
      await sequence.wait(320);
      setFound(3);
      await sequence.wait(520);
      setScanning(false);
      for (let count = 1; count <= AI_TITLE.length; count++) {
        await sequence.wait(count % 11 === 0 ? 95 : 34);
        setTyped(count);
      }
      await sequence.wait(420);
      for (let count = 1; count <= AI_BULLETS.length; count++) {
        await sequence.wait(300);
        setBulletCount(count);
      }
      await sequence.wait(3600);
      setFading(true);
      await sequence.wait(480);
    }
  });

  const boxes = reduce ? PHOTOS.length : found;
  const chars = reduce ? AI_TITLE.length : typed;
  const bullets = reduce ? AI_BULLETS.length : bulletCount;
  const typing = !reduce && chars > 0 && chars < AI_TITLE.length;

  return (
    <WindowFrame
      title="APV ListingAI"
      right={
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-300">
          <CircleNotchIcon weight="bold" className="size-3.5 animate-spin" />
          Generating…
        </span>
      }
      bodyClassName="p-4 sm:p-5 lg:[@media(max-height:900px)]:p-4"
    >
      <div ref={ref}>
        <div className="flex items-center justify-between">
          <MockLabel icon={ScanIcon}>Photo highlights</MockLabel>
          <span className="font-mono text-[10px] text-ink-200 nums">
            {boxes}/{PHOTOS.length}
          </span>
        </div>
        <div className="relative mt-2.5 grid h-36 grid-cols-[1.4fr_1fr] grid-rows-2 gap-2 sm:h-48 sm:gap-2.5 lg:[@media(max-height:900px)]:h-36">
          {PHOTOS.map((photo, i) => (
            <div key={photo.label} className={cn('relative overflow-hidden rounded-xl border border-white/[0.06]', photo.className)}>
              <photo.Art />
              <motion.div
                className={cn('absolute', photo.box)}
                initial={false}
                animate={boxes > i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.14 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 22 }}
              >
                <span className="absolute inset-0 rounded-[3px] bg-sage-300/[0.08]" />
                <span className="absolute left-0 top-0 size-2.5 rounded-tl-[3px] border-l-2 border-t-2 border-sage-300" />
                <span className="absolute right-0 top-0 size-2.5 rounded-tr-[3px] border-r-2 border-t-2 border-sage-300" />
                <span className="absolute bottom-0 left-0 size-2.5 rounded-bl-[3px] border-b-2 border-l-2 border-sage-300" />
                <span className="absolute bottom-0 right-0 size-2.5 rounded-br-[3px] border-b-2 border-r-2 border-sage-300" />
                <span className="absolute -top-[18px] left-0 whitespace-nowrap rounded-[4px] bg-sage-300 px-1.5 py-px font-mono text-[9px] font-medium text-ink-950">
                  {photo.label}
                </span>
              </motion.div>
            </div>
          ))}
          <AnimatePresence>
            {scanning && (
              <motion.div
                key={scanKey}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl"
                exit={{ opacity: 0, transition: { duration: 0.35 } }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: '-100%' }}
                  animate={{ x: '0%' }}
                  transition={{ duration: 1.85, ease: [0.45, 0, 0.55, 1] }}
                >
                  <div className="absolute inset-y-0 right-0 w-2/5 bg-gradient-to-r from-transparent to-sage-300/25" />
                  <div className="absolute inset-y-0 right-0 w-px bg-sage-200" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4 sm:mt-5">
          <MockLabel icon={TextAaIcon}>AI title</MockLabel>
          <motion.p
            initial={false}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
            className="relative mt-2 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-ink-50 sm:text-lg"
          >
            <span className="invisible">{AI_TITLE}</span>
            <span className="absolute inset-0">
              {AI_TITLE.slice(0, chars)}
              {typing && <span className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-sage-300 animate-blink" />}
            </span>
          </motion.p>
        </div>

        <div className="mt-4 lg:[@media(max-height:760px)]:hidden">
          <div className="flex items-center justify-between gap-3">
            <MockLabel icon={TextAlignLeftIcon}>Description</MockLabel>
            <span className="flex rounded-md border border-white/[0.08] p-0.5 font-mono text-[9.5px] uppercase tracking-[0.12em]">
              <span className="rounded-[4px] bg-white/[0.08] px-1.5 py-0.5 text-ink-50">Sale</span>
              <span className="px-1.5 py-0.5 text-ink-200">Rent</span>
            </span>
          </div>
          <div className="mt-2.5 space-y-2">
            <div className="h-2 w-full rounded-full shimmer" />
            <div className="h-2 w-[92%] rounded-full shimmer" />
            <div className="h-2 w-[64%] rounded-full shimmer" />
          </div>
        </div>

        <div className="mt-4">
          <MockLabel icon={ListBulletsIcon}>AI bullets</MockLabel>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {AI_BULLETS.map((bullet, i) => {
              const shown = i < bullets && !fading;
              return (
                <motion.li
                  key={bullet}
                  initial={false}
                  animate={shown ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.6, y: 6 }}
                  transition={reduce ? { duration: 0 } : BULLET_SPRING}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sage-300/25 bg-sage-300/[0.08] px-2 py-1 font-mono text-[11px] text-sage-200"
                >
                  <CheckIcon weight="bold" className="size-3" />
                  {bullet}
                </motion.li>
              );
            })}
          </ul>
        </div>

        <div className="mt-5 hidden items-center gap-2 border-t border-white/[0.06] pt-4 sm:flex lg:[@media(max-height:900px)]:hidden">
          <MockLabel icon={ShareNetworkIcon}>Publish to</MockLabel>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-ink-100">Portals</span>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-ink-100">Social media</span>
          <span
            className={cn(
              'ml-auto rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-colors duration-500',
              bullets === AI_BULLETS.length && !fading ? 'bg-sage-300 text-ink-950' : 'bg-white/[0.06] text-ink-200',
            )}
          >
            Publish
          </span>
        </div>
      </div>
    </WindowFrame>
  );
}
