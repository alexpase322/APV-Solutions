import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useActiveInView } from '../lib/hooks';

/** In-view state for a demo mockup: starts a little before it scrolls in. */
export function useMockInView() {
  return useActiveInView('120px 0px');
}

/**
 * Steps through `steps` ({ name, ms }) in a loop while `active`, returning the current step name.
 * With reduced motion it stays on `fallback`.
 */
export function useSequence(steps, active, fallback) {
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active || reduce) return undefined;
    const id = window.setTimeout(() => setIndex((current) => (current + 1) % steps.length), steps[index].ms);
    return () => window.clearTimeout(id);
  }, [index, active, reduce, steps]);

  return reduce ? fallback : steps[index].name;
}

/** Scale (capped at `max`) that fits a fixed `width` design into the ref'd element's width. */
export function useFitScale(width, max = 1) {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const available = el.clientWidth;
      if (available > 0) setScale(Math.min(max, available / width));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width, max]);

  return { ref, scale };
}

/**
 * Typewriter over phrase lengths: types, holds (phase 'hold'), erases, pauses, then moves to the next phrase.
 * With reduced motion it shows the first phrase complete, in the 'hold' phase.
 */
export function useMockTypewriter(lengths, active, { type = 60, erase = 22, hold = 1900, pause = 420 } = {}) {
  const reduce = useReducedMotion() ?? false;
  const [state, setState] = useState({ index: 0, count: 0, phase: 'type' });

  useEffect(() => {
    if (!active || reduce) return undefined;
    const target = lengths[state.index] ?? 0;
    let delay = type;
    let next = state;
    if (state.phase === 'type') {
      if (state.count < target) {
        // uneven rhythm reads as human typing
        delay = type * (state.count % 7 === 3 ? 2.2 : state.count % 3 === 0 ? 1.3 : 0.8);
        next = { ...state, count: state.count + 1 };
      } else {
        next = { ...state, phase: 'hold' };
      }
    } else if (state.phase === 'hold') {
      delay = hold;
      next = { ...state, phase: 'erase' };
    } else if (state.count > 0) {
      delay = erase;
      next = { ...state, count: state.count - 1 };
    } else {
      delay = pause;
      next = { index: (state.index + 1) % lengths.length, count: 0, phase: 'type' };
    }
    const id = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(id);
  }, [state, active, reduce, lengths, type, erase, hold, pause]);

  return reduce ? { index: 0, count: lengths[0] ?? 0, phase: 'hold' } : state;
}

/** Wraps `value` into the range [min, max). */
export function wrap(min, max, value) {
  const range = max - min;
  return range === 0 ? min : ((((value - min) % range) + range) % range) + min;
}
