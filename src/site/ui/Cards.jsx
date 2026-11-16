import { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { cn } from '../lib/cn';

/** Surface card whose border and background light up around the cursor. */
export function SpotlightCard({ as: Tag = 'div', className, children, style, ...rest }) {
  return (
    <Tag
      onPointerMove={(event) => {
        const el = event.currentTarget;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        el.style.setProperty('--my', `${event.clientY - rect.top}px`);
        el.style.setProperty('--spot', '1');
      }}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty('--spot', '0');
      }}
      style={style}
      className={cn('spotlight surface rounded-4xl', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Tilts toward the cursor in 3D (up to `max` degrees) with an optional glare. Mouse/pen only. */
export function TiltCard({ children, className, max = 10, glare = true, perspective = 1100 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 140, damping: 18, mass: 0.7 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glareX = useTransform(px, [0, 1], ['0%', '100%']);
  const glareY = useTransform(py, [0, 1], ['0%', '100%']);
  const glareBackground = useMotionTemplate`radial-gradient(520px circle at ${glareX} ${glareY}, rgba(255,255,255,0.14), transparent 45%)`;

  return (
    <div style={{ perspective }} className="[transform-style:preserve-3d]">
      <motion.div
        ref={ref}
        onPointerMove={(event) => {
          if (reduce || event.pointerType === 'touch' || !ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          px.set((event.clientX - rect.left) / rect.width);
          py.set((event.clientY - rect.top) / rect.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={cn('relative will-change-transform', className)}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ background: glareBackground }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          />
        )}
      </motion.div>
    </div>
  );
}
