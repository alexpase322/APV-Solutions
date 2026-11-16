import { motion } from 'motion/react';
import { cn } from '../lib/cn';

const WAVES = ['M6.5 9.6a3.4 3.4 0 0 1 0 4.8', 'M9.6 7a7 7 0 0 1 0 10', 'M12.7 4.4a10.6 10.6 0 0 1 0 15.2', 'M15.8 1.8a14.2 14.2 0 0 1 0 20.4'];

/** Contactless "waves" glyph. `animated` makes the arcs pulse outwards one after another. */
export function NfcWaves({ className, strokeWidth = 1.8, stroke = 'currentColor', animated = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('size-6', className)}>
      {WAVES.map((d, i) =>
        animated ? (
          <motion.path
            key={d}
            d={d}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.16 }}
          />
        ) : (
          <path key={d} d={d} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
        ),
      )}
    </svg>
  );
}
