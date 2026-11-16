import { createContext, useContext, useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';

/** True while a showcase panel is buried under the next one in the sticky stack, so its mock can rest. */
export const MockPausedContext = createContext(false);

/**
 * Visibility state for an animated product mock: `inView` (20% visible), `seen` (has been 30% visible once),
 * `reduce` (reduced motion) and `active` (in view, motion allowed and not buried in the stack).
 */
export function useMockActivity() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 });
  const seen = useInView(ref, { amount: 0.3, once: true });
  const reduce = useReducedMotion() ?? false;
  const paused = useContext(MockPausedContext);
  return { ref, inView, seen, reduce, active: inView && !reduce && !paused };
}

/** Cancellable timers for an async animation script; `wait` never resolves once cancelled. */
function createSequence() {
  let cancelled = false;
  const timers = new Set();
  return {
    wait(ms) {
      return new Promise((resolve) => {
        if (cancelled) return;
        const id = window.setTimeout(() => {
          timers.delete(id);
          if (!cancelled) resolve();
        }, ms);
        timers.add(id);
      });
    },
    cancel() {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
    },
  };
}

/** Runs the async `script(sequence)` while `active`; going inactive cancels it, becoming active restarts it. */
export function useSequence(active, script) {
  const scriptRef = useRef(script);
  useEffect(() => {
    scriptRef.current = script;
  }, [script]);
  useEffect(() => {
    if (!active) return undefined;
    const sequence = createSequence();
    scriptRef.current(sequence);
    return () => sequence.cancel();
  }, [active]);
}
