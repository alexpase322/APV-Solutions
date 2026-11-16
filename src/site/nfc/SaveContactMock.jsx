import { memo, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { BuildingsIcon, CameraIcon, CheckIcon, EnvelopeSimpleIcon, PhoneIcon } from '@phosphor-icons/react';
import { EASE_IN_OUT_QUINT, EASE_OUT_EXPO } from '../lib/motion';
import { DEMO_PROFILE } from './content';
import { useMockInView, useSequence } from './hooks';

const SEND_SEQUENCE = [
  { name: 'show', ms: 1700 },
  { name: 'send', ms: 850 },
  { name: 'saved', ms: 2300 },
  { name: 'reset', ms: 700 },
];

const VCARD_FIELDS = [
  { label: 'Photo', icon: CameraIcon },
  { label: 'Phone', icon: PhoneIcon },
  { label: 'Email', icon: EnvelopeSimpleIcon },
  { label: 'Company', icon: BuildingsIcon },
];

/** "Save contact in one tap": the vCard flies into the phone and appears at the top of its contacts. */
export const SaveContactMock = memo(function SaveContactMock() {
  const { ref, active, reduce } = useMockInView();
  const phase = useSequence(SEND_SEQUENCE, active, 'saved');
  const cardRef = useRef(null);
  const phoneRef = useRef(null);
  const [distance, setDistance] = useState(180);

  // Horizontal distance from the vCard's centre to the phone's centre.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const measure = () => {
      const card = cardRef.current;
      const phone = phoneRef.current;
      if (card && phone) setDistance(phone.offsetLeft + phone.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [ref]);

  const sending = !reduce && (phase === 'send' || phase === 'saved');
  const saved = phase === 'saved';

  return (
    <div ref={ref} aria-hidden="true" className="@container relative flex h-[232px] items-center justify-between gap-3 px-1 sm:px-4">
      <div className="absolute inset-0 bg-grid-sm opacity-40 mask-radial" />

      <motion.div
        ref={cardRef}
        initial={false}
        animate={sending ? { x: distance, scale: 0.35, opacity: 0, rotate: 4 } : { x: 0, scale: 1, opacity: 1, rotate: 0 }}
        transition={
          sending
            ? { duration: 0.8, ease: EASE_IN_OUT_QUINT }
            : {
                x: { duration: 0 },
                rotate: { duration: 0 },
                opacity: { duration: 0.45, ease: EASE_OUT_EXPO },
                scale: { type: 'spring', stiffness: 220, damping: 20 },
              }
        }
        className="surface relative z-[1] min-w-0 max-w-[260px] flex-1 rounded-2xl p-3.5 @sm:p-4"
      >
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(145deg,#ccdab0,#94a378_55%,#5f6b4c)] text-[12px] font-semibold text-ink-950">
            {DEMO_PROFILE.initials}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold tracking-[-0.01em] text-ink-50">{DEMO_PROFILE.name}</span>
            <span className="block truncate text-[10.5px] text-sage-300">{DEMO_PROFILE.role}</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-1 @sm:grid-cols-2 @sm:gap-1.5">
          {VCARD_FIELDS.map((field) => (
            <span
              key={field.label}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 py-1 @sm:py-1.5"
            >
              <field.icon weight="duotone" className="size-3.5 shrink-0 text-sage-300" />
              <span className="text-[10.5px] text-ink-100">{field.label}</span>
            </span>
          ))}
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-2 @sm:mt-3 @sm:pt-2.5">
          <span className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-ink-200">contact.vcf</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-sage-300">vCard</span>
        </div>
      </motion.div>

      <div
        ref={phoneRef}
        className="relative h-[196px] w-[100px] shrink-0 rounded-[1.5rem] bg-[linear-gradient(160deg,#2b3d50,#15222f_40%,#0d1620)] p-[5px] shadow-[0_30px_50px_-26px_rgba(2,6,10,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] @sm:h-[210px] @sm:w-[124px]"
      >
        <div className="relative size-full overflow-hidden rounded-[1.2rem] bg-ink-900">
          <div className="absolute left-1/2 top-[6px] h-[12px] w-[40px] -translate-x-1/2 rounded-full bg-ink-950" />
          <p className="px-2.5 pt-7 text-[10px] font-semibold text-ink-50">Contacts</p>
          <div className="mt-2 space-y-1.5 px-2">
            <AnimatePresence initial={false}>
              {saved && (
                <motion.div
                  key="new"
                  initial={{ opacity: 0, scale: 0.7, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                  className="flex items-center gap-1.5 rounded-lg border border-sage-300/30 bg-sage-300/10 p-1.5"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-sage-300 text-[7px] font-semibold text-ink-950">
                    {DEMO_PROFILE.initials}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[8.5px] font-semibold text-ink-50">{DEMO_PROFILE.name}</span>
                  <CheckIcon weight="bold" className="size-2.5 shrink-0 text-sage-300" />
                </motion.div>
              )}
            </AnimatePresence>
            {[0, 1, 2, 3].map((i) => (
              <motion.div key={i} layout transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex items-center gap-1.5 p-1.5">
                <span className="size-5 shrink-0 rounded-full bg-white/[0.07]" />
                <span className="h-1.5 rounded-full bg-white/[0.08]" style={{ width: `${62 - i * 9}%` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
