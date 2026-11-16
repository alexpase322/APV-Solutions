import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/** Ref + whether the element is near the viewport; `active` is false with reduced motion. */
export function useActiveInView(margin = '80px 0px') {
  const ref = useRef(null);
  const inView = useInView(ref, { margin });
  const reduce = useReducedMotion() ?? false;
  return { ref, inView, reduce, active: inView && !reduce };
}

/** setInterval that always calls the latest callback; runs only while `enabled`. */
export function useInterval(callback, ms, enabled) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (!enabled) return undefined;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms, enabled]);
}

export function useMediaQuery(query = '(min-width: 1024px)') {
  const [matches, setMatches] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches));
  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}

/**
 * Typewriter state machine over phrase lengths: types, holds, erases (or jumps when erase === false),
 * then moves to the next phrase. With reduced motion it shows the first phrase complete.
 */
export function useTypewriter(lengths, active, { type = 55, erase = 26, hold = 1600, pause = 380 } = {}) {
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = useState({ index: 0, count: 0, phase: 'type' });

  useEffect(() => {
    if (!active || reduce) return undefined;
    const total = lengths.length;
    const target = lengths[state.index] ?? 0;
    let delay = type;
    let next = state;
    if (state.phase === 'type') {
      if (state.count < target) {
        // uneven rhythm reads as human typing
        delay = type * (state.count % 7 === 3 ? 2.4 : state.count % 3 === 0 ? 1.3 : 0.85);
        next = { ...state, count: state.count + 1 };
      } else {
        delay = hold;
        next = { ...state, phase: erase === false ? 'next' : 'erase' };
      }
    } else if (state.phase === 'erase' && state.count > 0) {
      delay = typeof erase === 'number' ? erase : 20;
      next = { ...state, count: state.count - 1 };
    } else {
      delay = pause;
      next = { index: (state.index + 1) % total, count: 0, phase: 'type' };
    }
    const id = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(id);
  }, [state, active, reduce, lengths, type, erase, hold, pause]);

  if (reduce) return { index: 0, count: lengths[0] ?? 0, phase: 'hold', done: true };
  const target = lengths[state.index] ?? 0;
  return { ...state, done: state.count >= target && state.phase !== 'erase' };
}

/** Deterministic PRNG (mulberry32) so decorative "random" data is stable between renders. */
export function seededRandom(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const round2 = (n) => Math.round(n * 100) / 100;

/** Smooth Catmull-Rom → cubic Bézier SVG path through [x, y] points. */
export function smoothPath(points) {
  if (points.length < 2) return '';
  let d = `M${round2(points[0][0])},${round2(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${round2(c1x)},${round2(c1y)} ${round2(c2x)},${round2(c2y)} ${round2(p2[0])},${round2(p2[1])}`;
  }
  return d;
}

/** smoothPath closed down to `baseline` (for area fills). */
export function areaPath(points, baseline) {
  if (points.length < 2) return '';
  const first = points[0];
  const last = points[points.length - 1];
  return `${smoothPath(points)} L${round2(last[0])},${baseline} L${round2(first[0])},${baseline} Z`;
}

export const pad = (n, width = 2) => String(n).padStart(width, '0');
