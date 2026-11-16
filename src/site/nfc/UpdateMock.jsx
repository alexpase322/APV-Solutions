import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, LinkSimpleIcon, PencilSimpleLineIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { PulseDot } from '../ui/primitives';
import { DEMO_PROFILE } from './content';
import { useMockInView, useMockTypewriter } from './hooks';

const FIELDS = [
  { label: 'Title', value: DEMO_PROFILE.role },
  { label: 'Bio', value: 'Bilingual English / Español' },
  { label: 'Link', value: 'Book a showing' },
];
const FIELD_LENGTHS = FIELDS.map((field) => field.value.length);

/** "Update anytime": profile fields get retyped and each change goes live instantly. */
export const UpdateMock = memo(function UpdateMock() {
  const { ref, active, inView } = useMockInView();
  const typing = useMockTypewriter(FIELD_LENGTHS, active, { type: 58, erase: 20, hold: 1700 });
  const field = FIELDS[typing.index];
  const typed = field.value.slice(0, typing.count);
  const holding = typing.phase === 'hold';

  return (
    <div ref={ref} aria-hidden="true" className={cn('relative flex h-[232px] flex-col justify-center px-1 sm:px-2', !inView && 'nfc-paused')}>
      <div className="glass relative rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[12px] font-semibold text-ink-50">
            <PencilSimpleLineIcon weight="duotone" className="size-4 text-sage-300" />
            Edit profile
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-gold-300">
            <PulseDot size="sm" />
            Live
          </span>
        </div>
        <span className="mt-4 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-200">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={field.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              {field.label}
            </motion.span>
          </AnimatePresence>
        </span>
        <div
          className={cn(
            'mt-1.5 flex h-10 items-center rounded-xl border bg-ink-900/70 px-3 transition-colors duration-500',
            holding ? 'border-sage-300/40' : 'border-white/10',
          )}
        >
          <span className="truncate text-[13px] text-ink-50">{typed}</span>
          <span className="ml-px h-4 w-[1.5px] shrink-0 animate-blink bg-sage-300" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-200">
          <LinkSimpleIcon weight="bold" className="size-3.5 shrink-0 text-sage-300" />
          <span className="truncate">Same card link — no reprogramming</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
        <AnimatePresence>
          {holding && (
            <motion.span
              key={`saved-${typing.index}`}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-sage-300/30 bg-ink-800 px-3 py-1.5 text-[11px] font-medium text-sage-200 shadow-[0_12px_24px_-12px_rgba(2,6,10,0.9)]"
            >
              <CheckIcon weight="bold" className="size-3" />
              Changes are live instantly
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});
