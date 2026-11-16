import { BatteryFullIcon, CellSignalFullIcon, WifiHighIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { NfcWaves } from './NfcWaves';

/** Phone hardware (270 × 560): bezel, side buttons, dynamic island and a glass reflection over the screen. */
export function PhoneFrame({ children, className, style }) {
  return (
    <div
      style={{ width: 270, height: 560, ...style }}
      className={cn(
        'relative rounded-[2.5rem] bg-[linear-gradient(160deg,#2b3d50_0%,#15222f_35%,#0d1620_70%,#1d2d3d_100%)] p-[9px] shadow-[0_60px_90px_-40px_rgba(2,6,10,0.95),0_30px_50px_-30px_rgba(2,6,10,0.9),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_0_0_1px_rgba(255,255,255,0.05)]',
        className,
      )}
    >
      <span className="absolute -left-[3px] top-[118px] h-[30px] w-[3px] rounded-l-sm bg-ink-500" />
      <span className="absolute -left-[3px] top-[164px] h-[52px] w-[3px] rounded-l-sm bg-ink-500" />
      <span className="absolute -right-[3px] top-[150px] h-[74px] w-[3px] rounded-r-sm bg-ink-500" />
      <div className="relative size-full overflow-hidden rounded-[31px] bg-ink-950 ring-1 ring-ink-950/70">
        {children}
        <div className="absolute left-1/2 top-[11px] z-20 flex h-[26px] w-[90px] -translate-x-1/2 items-center justify-end rounded-full bg-ink-950 pr-2.5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
          <span className="size-[7px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3a4e63,#070c12)]" />
        </div>
        <div className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(125deg,rgba(255,255,255,0.06)_0%,transparent_32%,transparent_70%,rgba(255,255,255,0.03)_100%)]" />
      </div>
    </div>
  );
}

/** Status bar with the "Demo" badge and signal / wifi / battery icons. */
export function PhoneStatusBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-[46px] items-center justify-between px-[22px] pt-0.5">
      <span className="rounded-[5px] border border-gold-400/40 bg-gold-400/10 px-1.5 py-[1px] font-mono text-[7.5px] font-semibold uppercase tracking-[0.18em] text-gold-300">
        Demo
      </span>
      <span className="flex items-center gap-1 text-ink-100">
        <CellSignalFullIcon weight="fill" className="size-[11px]" />
        <WifiHighIcon weight="bold" className="size-[11px]" />
        <BatteryFullIcon weight="fill" className="size-[14px]" />
      </span>
    </div>
  );
}

/** Idle screen waiting for a card; `reading` lights up the reader while the card is tapped. */
export function ReaderScreen({ reading, animate }) {
  return (
    <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,#1d2d3d_0%,#0a1118_55%,#04080c_100%)]">
      <PhoneStatusBar />
      <div className="absolute inset-x-0 top-[150px] flex flex-col items-center text-center">
        <div className="relative grid size-[92px] place-items-center">
          {animate &&
            [0, 1, 2].map((i) => (
              <span
                key={i}
                className="nfc-field-ring absolute inset-0 rounded-full border border-sage-300/40"
                style={{ animationDelay: `${i * 1.6}s` }}
              />
            ))}
          <span
            className={cn(
              'relative grid size-[64px] place-items-center rounded-full border transition-[background-color,border-color,color] duration-500 ease-out-expo',
              reading ? 'border-sage-300/60 bg-sage-300/15 text-sage-200' : 'border-white/10 bg-white/[0.04] text-ink-100',
            )}
          >
            <NfcWaves className="size-[30px]" animated={animate && reading} />
          </span>
        </div>
        <p className="mt-7 text-[13px] font-medium tracking-[-0.01em] text-ink-50">{reading ? 'Reading card…' : 'Hold near an APV card'}</p>
        <p className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.22em] text-ink-200">NFC ready</p>
      </div>
      <div className="absolute inset-x-0 bottom-[34px] flex justify-center">
        <span className="h-[34px] w-[34px] rounded-full border border-white/10 bg-white/[0.04]" />
      </div>
      <span className="absolute bottom-[8px] left-1/2 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-ink-100/70" />
    </div>
  );
}
