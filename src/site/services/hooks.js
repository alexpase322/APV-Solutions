import { useLayoutEffect, useState } from 'react';

/**
 * Cancellable timeline for looping demo animations written as async loops.
 * `wait(ms)` resolves after `ms` (and never resolves once cancelled, which ends the loop);
 * `track(stop)` registers a stop function (e.g. a motion `animate` control) to call on cancel.
 */
export function createSequence() {
  let cancelled = false;
  const timers = new Set();
  const stops = new Set();
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
    track(stop) {
      stops.add(stop);
    },
    cancel() {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      timers.clear();
      stops.forEach((stop) => stop());
      stops.clear();
    },
    get cancelled() {
      return cancelled;
    },
  };
}

/** Client width/height of `ref`'s element, kept in sync with a ResizeObserver. */
export function useElementSize(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
