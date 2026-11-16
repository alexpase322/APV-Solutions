import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/cn';
import { useMockInView, useSequence } from './hooks';
import { NfcCard } from './NfcCard';
import { NfcWaves } from './NfcWaves';

const STACK_SEQUENCE = [
  { name: 'stacked', ms: 1500 },
  { name: 'falling', ms: 1900 },
  { name: 'clean', ms: 2300 },
  { name: 'restack', ms: 1100 },
];

/** Paper cards stacked over the NFC card: resting tilt/offset and how far each one swings as it falls. */
const PAPER_CARDS = [
  { rotate: -7, x: -6, fall: -22 },
  { rotate: 5, x: 8, fall: 18 },
  { rotate: -3, x: -2, fall: -14 },
  { rotate: 8, x: 10, fall: 24 },
  { rotate: -5, x: 4, fall: -20 },
];
const CARD_SCALE = 0.62;

function paperMotion(phase, card, index, fromTop) {
  if (phase === 'falling') {
    return {
      animate: { y: 190, x: card.x + card.fall * 2, rotate: card.rotate + card.fall, opacity: 0 },
      transition: { duration: 0.75, ease: [0.55, 0, 0.85, 0.35], delay: fromTop * 0.22 },
    };
  }
  if (phase === 'clean') {
    return { animate: { y: -70, x: card.x, rotate: card.rotate, opacity: 0 }, transition: { duration: 0 } };
  }
  return {
    animate: { y: -index * 2, x: card.x, rotate: card.rotate, opacity: 1 },
    transition: { type: 'spring', stiffness: 260, damping: 22, delay: index * 0.1 },
  };
}

/** "One card, forever": a stack of paper cards falls away, leaving the single NFC card. */
export const ForeverMock = memo(function ForeverMock() {
  const { ref, active, inView } = useMockInView();
  const phase = useSequence(STACK_SEQUENCE, active, 'clean');
  const topIndex = PAPER_CARDS.length - 1;

  return (
    <div ref={ref} aria-hidden="true" className={cn('relative grid h-[232px] place-items-center overflow-hidden', !inView && 'nfc-paused')}>
      <div className="absolute inset-0 bg-dots opacity-50 mask-radial" />
      <div className="relative" style={{ width: 300 * CARD_SCALE, height: 189 * CARD_SCALE }}>
        <div className="absolute left-0 top-0 origin-top-left" style={{ transform: `scale(${CARD_SCALE})`, width: 300, height: 189 }}>
          <NfcCard />
        </div>
        {PAPER_CARDS.map((card, index) => {
          const { animate, transition } = paperMotion(phase, card, index, topIndex - index);
          return (
            <motion.div
              key={index}
              initial={false}
              animate={animate}
              transition={transition}
              className="absolute inset-0 rounded-[10px] bg-[linear-gradient(160deg,#eef1f3,#d5dce2)] p-3 shadow-[0_14px_24px_-14px_rgba(2,6,10,0.8)]"
            >
              <span className="block h-2 w-14 rounded-full bg-ink-400/50" />
              <span className="mt-1.5 block h-1.5 w-20 rounded-full bg-ink-300/40" />
              <span className="absolute bottom-3 left-3 block h-1.5 w-16 rounded-full bg-ink-300/40" />
              <span className="absolute bottom-3 right-3 block size-4 rounded-sm bg-ink-400/40" />
            </motion.div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
        <AnimatePresence>
          {phase === 'clean' && (
            <motion.span
              key="one"
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-sage-300/30 bg-ink-800 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-sage-200"
            >
              <NfcWaves className="size-3.5" strokeWidth={2.2} />
              One smart card
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
