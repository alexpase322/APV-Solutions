import { memo } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { LogoMark } from '../ui/Logo';
import { DEMO_PROFILE } from './content';
import { NfcWaves } from './NfcWaves';

const FOIL = 'conic-gradient(from 90deg at 50% 50%, #b4c68f, #f0cc7e, #c5d0db, #8fb3c4, #ccdab0, #e4b34c, #b4c68f)';

/** Guilloche-style wavy lines printed across the card. */
const GUILLOCHE = Array.from({ length: 9 }, (_, row) => {
  const y = 18 + row * 19;
  const amplitude = 7 + (row % 3) * 3;
  let d = `M-10,${y}`;
  for (let i = 0; i < 17; i++) {
    const x = -10 + i * 20;
    const peak = i % 2 === 0 ? y - amplitude : y + amplitude;
    d += ` Q${x + 10},${peak} ${x + 20},${y}`;
  }
  return d;
});

/**
 * The APV NFC card (300 × 189) with holographic foil and chip. Pass a `sheenX` motion value
 * to sweep a light reflection across it.
 */
export const NfcCard = memo(function NfcCard({ sheenX, className, name = DEMO_PROFILE.name }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[16px] shadow-[0_40px_70px_-28px_rgba(2,6,10,0.95),0_18px_30px_-18px_rgba(2,6,10,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]',
        className,
      )}
      style={{ width: 300, height: 189 }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#1d2d3d_0%,#111c28_38%,#0a1118_70%,#070c12_100%)]" />
      <svg viewBox="0 0 300 189" className="absolute inset-0 size-full opacity-[0.16]" aria-hidden="true">
        {GUILLOCHE.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#c5d0db" strokeWidth={0.5} />
        ))}
      </svg>
      <div className="nfc-foil-band absolute inset-0 overflow-hidden opacity-[0.32] mix-blend-color-dodge">
        <div className="nfc-foil-spin absolute -inset-[60%]" style={{ background: FOIL }} />
      </div>
      {sheenX && (
        <motion.div
          aria-hidden="true"
          style={{ x: sheenX }}
          className="absolute -inset-y-4 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.13)_47%,rgba(240,204,126,0.12)_50%,rgba(255,255,255,0.1)_53%,transparent_62%)]"
        />
      )}
      <div className="absolute inset-0 rounded-[16px] ring-1 ring-inset ring-white/[0.09]" />
      <div className="absolute inset-0 flex flex-col justify-between p-[18px]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-[30px]" />
            <span className="flex flex-col leading-none">
              <span className="text-[16px] font-semibold tracking-[-0.03em] text-ink-50">APV</span>
              <span className="mt-[3px] font-mono text-[6.5px] font-medium uppercase tracking-[0.26em] text-sage-300">Business Solutions</span>
            </span>
          </div>
          <NfcWaves className="size-[26px] text-sage-200" strokeWidth={1.7} />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[19px] font-semibold leading-none tracking-[-0.03em] text-ink-50">{name}</p>
            <p className="mt-2.5 font-mono text-[8.5px] font-medium uppercase tracking-[0.3em] text-sage-300">Tap to connect</p>
          </div>
          <div className="relative h-[26px] w-[38px] overflow-hidden rounded-[6px] ring-1 ring-inset ring-white/25">
            <div className="nfc-foil-spin-fast absolute -inset-[80%] opacity-90" style={{ background: FOIL }} />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(120deg,rgba(255,255,255,0.18)_0_1px,transparent_1px_4px)]" />
          </div>
        </div>
      </div>
    </div>
  );
});
