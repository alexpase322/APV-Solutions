import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { useActiveInView } from '../lib/hooks';
import { EASE_OUT_EXPO } from '../lib/motion';
import { pct } from './utils';

const VIEW_W = 400;
const VIEW_H = 300;
const US = { x: 122, y: 96 };
const LATAM = { x: 284, y: 226 };
const ROUTE = `M${US.x},${US.y} C200,22 338,104 ${LATAM.x},${LATAM.y}`;

/** Vision card art: a route between the US and LATAM with a glowing traveller. */
export function VisionArt() {
  const { ref, inView } = useActiveInView();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn('relative grid h-full min-h-[340px] place-items-center p-6 sm:min-h-[380px] sm:p-8', !inView && 'about-paused')}
    >
      <div className="absolute inset-0 bg-dots opacity-70 mask-radial" />
      <div className="relative aspect-[4/3] w-full max-w-[440px]">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} fill="none" className="absolute inset-0 size-full overflow-visible">
          {[50, 110, 170, 230].map((y) => (
            <line key={y} x1={20} x2={380} y1={y} y2={y} stroke="rgba(234,240,245,0.05)" strokeDasharray="1 7" />
          ))}
          <path
            d={ROUTE}
            stroke="rgba(234,240,245,0.18)"
            strokeWidth={1.25}
            strokeDasharray="2 6"
            className="animate-dash"
            style={{ animationDuration: '2.4s' }}
          />
          <motion.path
            d={ROUTE}
            stroke="#b4c68f"
            strokeOpacity={0.55}
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1.8, ease: EASE_OUT_EXPO }}
          />
          <path
            d={ROUTE}
            pathLength={1}
            className="about-travel"
            style={{ '--about-dur': '4.4s' }}
            stroke="rgba(180,198,143,0.22)"
            strokeWidth={16}
            strokeLinecap="round"
          />
          <path d={ROUTE} pathLength={1} className="about-travel" style={{ '--about-dur': '4.4s' }} stroke="#e2ead2" strokeWidth={7} strokeLinecap="round" />
        </svg>
        <MapPin x={US.x} y={US.y} label="US" sub="Tampa, FL" placement="top" />
        <MapPin x={LATAM.x} y={LATAM.y} label="LATAM" sub="Remote" placement="left" />
      </div>
    </div>
  );
}

function MapPin({ x, y, label, sub, placement }) {
  return (
    <div className="absolute" style={{ left: pct(x, VIEW_W), top: pct(y, VIEW_H) }}>
      <span className="absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulse-ring" />
        <span className="absolute inset-0 rounded-full border-2 border-ink-900 bg-sage-300" />
      </span>
      <span
        className={cn(
          'glass absolute flex flex-col whitespace-nowrap rounded-xl px-3 py-2',
          placement === 'top' ? 'bottom-4 left-0 -translate-x-1/2' : 'right-4 top-0 -translate-y-1/2 text-right',
        )}
      >
        <span className="text-[15px] font-semibold leading-none tracking-[-0.02em] text-ink-50">{label}</span>
        <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-200">{sub}</span>
      </span>
    </div>
  );
}
