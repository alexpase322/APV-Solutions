import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO } from '../lib/motion';
import { TiltCard } from '../ui/Cards';
import { Tag } from '../ui/primitives';
import { DEMO_PROFILE } from './content';
import { useFitScale, useMockInView, useSequence } from './hooks';
import { NfcCard } from './NfcCard';
import { PhoneFrame, ReaderScreen } from './Phone';
import { ProfileScreen } from './ProfileScreen';

/** The scene is designed at 480 × 640 and scaled down to fit its column. */
const STAGE_WIDTH = 480;
const STAGE_HEIGHT = 640;
const PHONE_POSITION = { left: 200, top: 50 };
/** Where the card touches the phone (centre of the field rings and tap ripples). */
const TAP_POINT = { x: 335, y: 196 };
const CARD_POSITION = { left: 16, top: 416 };
const CARD_REST = { x: 0, y: 0, rotate: -9, scale: 1 };
const CARD_TAP = { x: 170, y: -300, rotate: -2, scale: 0.92 };

const TAP_SEQUENCE = [
  { name: 'idle', ms: 1500 },
  { name: 'approach', ms: 1000 },
  { name: 'tap', ms: 760 },
  { name: 'open', ms: 1150 },
  { name: 'saved', ms: 2300 },
  { name: 'hold', ms: 1400 },
  { name: 'reset', ms: 800 },
];
const PROFILE_OPEN_PHASES = ['open', 'saved', 'hold'];

/** Looping hero demo: the card flies to the phone, the profile opens and the contact gets saved. */
export function TapDemo() {
  const { ref, active, inView } = useMockInView();
  const phase = useSequence(TAP_SEQUENCE, active, 'hold');
  const { ref: stageRef, scale } = useFitScale(STAGE_WIDTH);
  const profileOpen = PROFILE_OPEN_PHASES.includes(phase);
  const cardLifted = phase === 'approach' || phase === 'tap';
  const contactSaved = phase === 'saved' || phase === 'hold';

  const pointerX = useMotionValue(0.5);
  const smoothPointerX = useSpring(pointerX, { stiffness: 110, damping: 20, mass: 0.6 });
  const sheenX = useTransform(smoothPointerX, [0, 1], ['-32%', '22%']);

  return (
    <figure ref={ref} className="relative mx-auto w-full max-w-[470px] lg:mr-0">
      <figcaption className="mb-3 flex flex-wrap items-center justify-end gap-x-3 gap-y-2 pr-1 sm:pr-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">Sample data</span>
        <Tag tone="gold">Demo profile · {DEMO_PROFILE.name}</Tag>
      </figcaption>
      <div
        ref={stageRef}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch') return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointerX.set(Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)));
        }}
        onPointerLeave={() => pointerX.set(0.5)}
        className="relative aspect-[480/640] w-full"
      >
        <div
          aria-hidden="true"
          className={cn('absolute left-0 top-0 origin-top-left', !inView && 'nfc-paused')}
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `scale(${scale})` }}
        >
          {/* NFC field around the tap point */}
          <div className="pointer-events-none absolute" style={{ left: TAP_POINT.x, top: TAP_POINT.y, width: 0, height: 0 }}>
            {[150, 235, 330].map((radius) => (
              <span
                key={radius}
                className="absolute rounded-full border border-white/[0.05]"
                style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }}
              />
            ))}
            {active &&
              [0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="nfc-field-ring absolute rounded-full border border-sage-300/25"
                  style={{ width: 660, height: 660, left: -330, top: -330, animationDelay: `${i * 1.6}s` }}
                />
              ))}
            <span
              className="absolute rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.2),transparent_65%)]"
              style={{ width: 520, height: 520, left: -260, top: -260 }}
            />
          </div>

          {/* Phone */}
          <div className="absolute" style={{ left: PHONE_POSITION.left, top: PHONE_POSITION.top }}>
            <div className="animate-float [animation-delay:-2s]">
              <PhoneFrame>
                <ReaderScreen reading={phase === 'tap'} animate={active} />
                <AnimatePresence>
                  {phase === 'tap' && (
                    <motion.div
                      key="flash"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-[radial-gradient(80%_45%_at_50%_26%,rgba(180,198,143,0.28),transparent_70%)]"
                    />
                  )}
                </AnimatePresence>
                <ProfileScreen open={profileOpen} saved={contactSaved} />
              </PhoneFrame>
            </div>
          </div>

          {/* Tap ripples */}
          <div className="pointer-events-none absolute" style={{ left: TAP_POINT.x, top: TAP_POINT.y }}>
            <AnimatePresence>
              {(phase === 'tap' || phase === 'open') &&
                [0, 1, 2].map((i) => (
                  <motion.span
                    key={`ripple-${i}`}
                    initial={{ scale: 0.25, opacity: 0.95 }}
                    animate={{ scale: 2.7, opacity: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 1.35, ease: EASE_OUT_EXPO, delay: i * 0.17 }}
                    className="absolute -left-[70px] -top-[70px] size-[140px] rounded-full border-2 border-sage-300/80"
                  />
                ))}
            </AnimatePresence>
          </div>

          {/* Card */}
          <div className="absolute" style={{ left: CARD_POSITION.left, top: CARD_POSITION.top }}>
            <motion.div
              initial={false}
              animate={cardLifted ? CARD_TAP : CARD_REST}
              transition={cardLifted ? { duration: 0.95, ease: EASE_IN_OUT_QUINT } : { type: 'spring', stiffness: 80, damping: 15, mass: 1 }}
              style={{ transformOrigin: '50% 50%' }}
            >
              <div className="animate-float-slow">
                <TiltCard max={14} className="rounded-[16px]">
                  <NfcCard sheenX={sheenX} />
                </TiltCard>
              </div>
            </motion.div>
          </div>

          {/* "Contact saved" toast */}
          <AnimatePresence>
            {phase === 'saved' && (
              <motion.div
                key="toast"
                initial={{ opacity: 0, scale: 0.6, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: -8, transition: { duration: 0.28 } }}
                transition={{ type: 'spring', stiffness: 420, damping: 17 }}
                className="glass absolute left-[64px] top-[118px] z-10 flex origin-right items-center gap-2.5 rounded-2xl py-2.5 pl-2.5 pr-4"
              >
                <span className="grid size-8 place-items-center rounded-full bg-sage-300 text-ink-950">
                  <CheckIcon weight="bold" className="size-4" />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold tracking-[-0.01em] text-ink-50">Contact saved</span>
                  <span className="mt-0.5 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-200">{DEMO_PROFILE.name} · vCard</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
