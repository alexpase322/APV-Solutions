import { memo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { useInterval } from '../lib/hooks';
import { useMockInView } from './hooks';
import { NfcWaves } from './NfcWaves';

/** "No app needed": a phone's built-in reader picks up the card and shows the system "Open profile" banner. */
export const NoAppMock = memo(function NoAppMock() {
  const { ref, active, inView } = useMockInView();
  const [bannerShown, setBannerShown] = useState(true);
  useInterval(() => setBannerShown((shown) => !shown), 2600, active);
  const showBanner = !active || bannerShown;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative grid min-h-[420px] w-full flex-1 place-items-center overflow-hidden', !inView && 'nfc-paused')}
    >
      <div className="absolute inset-0 bg-dots opacity-60 mask-radial" />
      <div className="relative mt-20">
        {/* Field arcs above the phone */}
        <div className="absolute -top-[86px] left-1/2 h-[110px] w-[220px] -translate-x-1/2">
          {[0, 1, 2].map((i) => (
            <motion.svg
              key={i}
              viewBox="0 0 220 110"
              className="absolute inset-0 size-full origin-bottom"
              initial={{ opacity: 0.5, scale: 0.6 }}
              animate={active ? { opacity: [0, 0.9, 0], scale: [0.45, 1, 1.12] } : { opacity: 0.5, scale: 0.4 + i * 0.3 }}
              transition={active ? { duration: 2.4, repeat: Infinity, ease: 'easeOut', delay: i * 0.8 } : { duration: 0 }}
            >
              <path d="M30 104 A80 80 0 0 1 190 104" fill="none" stroke="#b4c68f" strokeWidth={2} strokeLinecap="round" />
            </motion.svg>
          ))}
        </div>

        <div className="relative h-[300px] w-[150px] rounded-[1.9rem] bg-[linear-gradient(160deg,#2b3d50,#15222f_40%,#0d1620)] p-[6px] shadow-[0_40px_60px_-30px_rgba(2,6,10,0.95),inset_0_1px_0_rgba(255,255,255,0.12)]">
          <div className="relative size-full overflow-hidden rounded-[1.55rem] bg-[radial-gradient(120%_70%_at_50%_0%,#1d2d3d,#0a1118_60%,#04080c)]">
            <div className="absolute left-1/2 top-[7px] h-[15px] w-[50px] -translate-x-1/2 rounded-full bg-ink-950" />
            <AnimatePresence>
              {showBanner && (
                <motion.div
                  key="banner"
                  initial={{ opacity: 0, y: -22, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  className="glass absolute inset-x-[7px] top-[28px] rounded-[14px] px-2.5 py-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="grid size-[18px] place-items-center rounded-[5px] bg-sage-300 text-ink-950">
                      <NfcWaves className="size-[12px]" strokeWidth={2.4} />
                    </span>
                    <span className="font-mono text-[7px] uppercase tracking-[0.16em] text-ink-200">NFC tag</span>
                  </div>
                  <p className="mt-1.5 text-[10px] font-semibold leading-tight text-ink-50">Open profile</p>
                  <p className="mt-0.5 truncate font-mono text-[7.5px] text-ink-200">apvsolutions.tech/c/…</p>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-[54px] flex flex-col items-center">
              <span className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-sage-300">
                <NfcWaves className="size-6" animated={active} />
              </span>
              <span className="mt-2 font-mono text-[7px] uppercase tracking-[0.2em] text-ink-200">Built-in reader</span>
            </div>
            <span className="absolute bottom-[6px] left-1/2 h-[3px] w-[52px] -translate-x-1/2 rounded-full bg-ink-100/60" />
          </div>
        </div>

        {/* Compatibility chips */}
        <div className="absolute -left-[104px] top-[118px] hidden animate-float sm:block">
          <span className="glass inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-[10px] text-ink-50">
            <CheckIcon weight="bold" className="size-3 text-sage-300" />
            iPhone XS+
          </span>
        </div>
        <div className="absolute -right-[112px] top-[196px] hidden animate-float-slow [animation-delay:-4s] sm:block">
          <span className="glass inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 font-mono text-[10px] text-ink-50">
            <CheckIcon weight="bold" className="size-3 text-sage-300" />
            Most Android
          </span>
        </div>
      </div>
    </div>
  );
});
