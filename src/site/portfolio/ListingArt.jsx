import { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';

/** Flat SVG "listing photos" for the APV ListingAI visuals (160×120, cover-cropped). */

const ART_CLASS = 'absolute inset-0 size-full';

/** Unique, selector-safe id prefix for gradients inside one SVG instance. */
const svgId = (reactId, prefix) => `${prefix}-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

export function OceanArt({ className }) {
  const id = svgId(useId(), 'ocean');
  return (
    <svg aria-hidden="true" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={cn(ART_CLASS, className)}>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15222f" />
          <stop offset="1" stopColor="#5d7186" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a4e63" />
          <stop offset="1" stopColor="#0a1118" />
        </linearGradient>
      </defs>
      <rect width="160" height="64" fill={`url(#${id}-sky)`} />
      <circle cx="112" cy="50" r="24" fill="#eaf0f5" opacity="0.06" />
      <circle cx="112" cy="50" r="12" fill="#eaf0f5" opacity="0.55" />
      <rect y="64" width="160" height="56" fill={`url(#${id}-sea)`} />
      <path d="M0 64H160" stroke="#c5d0db" strokeOpacity="0.45" strokeWidth="0.6" />
      <path d="M98 70h28M103 76h18M108 82h8" stroke="#eaf0f5" strokeOpacity="0.3" strokeWidth="1.1" strokeLinecap="round" />
      <path
        d="M12 78q8-2.5 16 0t16 0M44 88q8-2.5 16 0t16 0M6 98q8-2.5 16 0t16 0"
        fill="none"
        stroke="#8c9dae"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <rect y="100" width="160" height="2.4" fill="#070c12" opacity="0.9" />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={i * 14 + 4} y="100" width="1.6" height="20" fill="#070c12" opacity="0.9" />
      ))}
      <rect y="113" width="160" height="7" fill="#04080c" opacity="0.75" />
    </svg>
  );
}

export function RoomArt({ className }) {
  const id = svgId(useId(), 'room');
  return (
    <svg aria-hidden="true" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={cn(ART_CLASS, className)}>
      <defs>
        <linearGradient id={`${id}-win`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c9dae" stopOpacity="0.75" />
          <stop offset="1" stopColor="#263646" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill="#15222f" />
      <rect y="86" width="160" height="34" fill="#0d1620" />
      <rect x="98" y="14" width="46" height="54" rx="2" fill={`url(#${id}-win)`} stroke="#3a4e63" />
      <path d="M121 14v54M98 41h46" stroke="#3a4e63" />
      <rect x="28" y="24" width="28" height="19" rx="1.5" fill="none" stroke="#5d7186" strokeOpacity="0.8" />
      <path d="M33 38l7-7 5 5 4-3 4 5" fill="none" stroke="#5d7186" strokeOpacity="0.7" />
      <ellipse cx="58" cy="104" rx="48" ry="6" fill="#1d2d3d" />
      <rect x="14" y="60" width="72" height="26" rx="6" fill="#5f6b4c" />
      <rect x="10" y="73" width="80" height="18" rx="5" fill="#7a8962" />
      <rect x="20" y="64" width="22" height="12" rx="3" fill="#94a378" opacity="0.85" />
      <rect x="46" y="64" width="22" height="12" rx="3" fill="#94a378" opacity="0.6" />
      <path d="M140 88V60" stroke="#8c9dae" strokeWidth="1.2" />
      <path d="M131 60h18l-4-10h-10z" fill="#c5d0db" opacity="0.7" />
      <ellipse cx="140" cy="62" rx="14" ry="5" fill="#eaf0f5" opacity="0.06" />
    </svg>
  );
}

const BUILDINGS = [
  { x: 4, w: 22, h: 58 },
  { x: 28, w: 16, h: 84 },
  { x: 46, w: 26, h: 66 },
  { x: 74, w: 18, h: 98 },
  { x: 94, w: 24, h: 72 },
  { x: 120, w: 14, h: 54 },
  { x: 136, w: 20, h: 78 },
];

/** A grid of windows per building; a deterministic quarter of them are lit. */
const WINDOWS = BUILDINGS.flatMap((building, b) => {
  const cols = Math.max(1, Math.floor((building.w - 4) / 5));
  const rows = Math.floor((building.h - 8) / 7);
  const windows = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      windows.push({
        x: building.x + 3 + col * 5,
        y: 120 - building.h + 6 + row * 7,
        lit: (row * 7 + col * 3 + b * 5) % 4 === 0,
      });
    }
  }
  return windows;
});

export function CityArt({ className }) {
  const id = svgId(useId(), 'city');
  return (
    <svg aria-hidden="true" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={cn(ART_CLASS, className)}>
      <defs>
        <linearGradient id={`${id}-dusk`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d1620" />
          <stop offset="1" stopColor="#3a4e63" />
        </linearGradient>
      </defs>
      <rect width="160" height="120" fill={`url(#${id}-dusk)`} />
      <circle cx="30" cy="22" r="1" fill="#eaf0f5" opacity="0.5" />
      <circle cx="70" cy="14" r="0.8" fill="#eaf0f5" opacity="0.4" />
      <circle cx="128" cy="26" r="1" fill="#eaf0f5" opacity="0.45" />
      {BUILDINGS.map((building, i) => (
        <rect key={i} x={building.x} y={120 - building.h} width={building.w} height={building.h} fill={i % 2 ? '#0a1118' : '#111c28'} />
      ))}
      {WINDOWS.map((win, i) => (
        <rect key={i} x={win.x} y={win.y} width="2" height="2.6" fill={win.lit ? '#b4c68f' : '#3a4e63'} opacity={win.lit ? 0.7 : 0.35} />
      ))}
    </svg>
  );
}

/** Looping light sweep across the photos while visible (none with reduced motion). */
export function ScanSweep({ className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion() ?? false;
  return (
    <div ref={ref} aria-hidden="true" className={cn('pointer-events-none overflow-hidden', className)}>
      {!reduce && (
        <motion.div
          className="absolute inset-0"
          initial={{ x: '-100%' }}
          animate={inView ? { x: ['-100%', '100%'] } : { x: '-100%' }}
          transition={inView ? { duration: 2.4, ease: [0.45, 0, 0.55, 1], repeat: Infinity, repeatDelay: 1.1 } : { duration: 0 }}
        >
          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-sage-300/25" />
          <div className="absolute inset-y-0 right-0 w-px bg-sage-200/90" />
        </motion.div>
      )}
    </div>
  );
}
