import { memo, useState } from 'react';
import { seededRandom, useInterval } from '../lib/hooks';
import { useMockInView } from './hooks';
import { NfcWaves } from './NfcWaves';

const QR_SIZE = 21;

/**
 * A plausible-looking (decorative, not scannable) 21 × 21 QR code: three finder patterns, timing lines and
 * seeded random modules. Each module gets a reveal delay so the code builds from the centre outwards.
 */
const QR_MODULES = (() => {
  const random = seededRandom(1586);
  const inFinderZone = (x, y) => (x < 8 && y < 8) || (x >= 13 && y < 8) || (x < 8 && y >= 13);
  const isFinderModule = (x, y) => {
    const fx = x >= 13 ? x - 14 : x;
    const fy = y >= 13 ? y - 14 : y;
    if (fx < 0 || fy < 0 || fx > 6 || fy > 6) return false;
    return fx === 0 || fy === 0 || fx === 6 || fy === 6 || (fx >= 2 && fx <= 4 && fy >= 2 && fy <= 4);
  };

  const modules = [];
  for (let y = 0; y < QR_SIZE; y++) {
    for (let x = 0; x < QR_SIZE; x++) {
      const filled = inFinderZone(x, y) ? isFinderModule(x, y) : x === 6 || y === 6 ? (x + y) % 2 === 0 : random() > 0.5;
      if (!filled) continue;
      modules.push({ x, y, order: Math.hypot(x - 10, y - 10) + random() * 6 });
    }
  }
  const sorted = [...modules].sort((a, b) => a.order - b.order);
  return sorted.map((module, i) => ({ x: module.x, y: module.y, delay: Math.round((i / sorted.length) * 900) }));
})();

/** "QR code backup": the code assembles, gets scanned, clears and assembles again. */
export const QrMock = memo(function QrMock() {
  const { ref, active } = useMockInView();
  const [shown, setShown] = useState(true);
  const [wasActive, setWasActive] = useState(active);
  useInterval(() => setShown((current) => !current), shown ? 3600 : 1300, active);

  // Start fully drawn again whenever the mockup becomes inactive.
  if (active !== wasActive) {
    setWasActive(active);
    if (!active) setShown(true);
  }

  return (
    <div ref={ref} aria-hidden="true" className="relative grid h-[232px] place-items-center">
      <div className="relative rounded-[1.35rem] bg-ink-100 p-3 shadow-[0_30px_50px_-28px_rgba(2,6,10,0.9),inset_0_1px_0_rgba(255,255,255,0.5)]">
        <svg viewBox={`0 0 ${QR_SIZE} ${QR_SIZE}`} className="nfc-qr size-[148px]" data-on={!active || shown} shapeRendering="crispEdges">
          {QR_MODULES.map((module) => (
            <rect
              key={`${module.x}-${module.y}`}
              className="nfc-qr-px"
              x={module.x + 0.06}
              y={module.y + 0.06}
              width={0.88}
              height={0.88}
              rx={0.18}
              fill="#0a1118"
              style={{ '--nfc-d': `${module.delay}ms` }}
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg bg-ink-100 ring-4 ring-ink-100">
          <span className="grid size-full place-items-center rounded-md bg-ink-900 text-sage-300">
            <NfcWaves className="size-5" strokeWidth={2.2} />
          </span>
        </div>
        {active && (
          <div className="pointer-events-none absolute inset-3 overflow-hidden rounded-lg">
            <div className="nfc-scan h-[10%] w-full bg-gradient-to-b from-transparent via-sage-500/40 to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
});
