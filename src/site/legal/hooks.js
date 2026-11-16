import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useLenis } from 'lenis/react';

const DESKTOP = '(min-width: 1024px)';
const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP).matches;
/** A section becomes current once its heading passes this line (px from the top of the viewport). */
const spyLine = () => Math.max(180, window.innerHeight * 0.3);

/**
 * Index of the section (`h2[id]` inside `containerRef`) currently being read. Resets to 0 when `key`
 * (the open document) changes, and marks the current heading with `data-active` for its accent rule.
 */
export function useScrollSpy(containerRef, key) {
  const [state, setState] = useState({ key, index: 0 });
  if (state.key !== key) setState({ key, index: 0 });
  const active = state.key === key ? state.index : 0;

  const headings = useRef([]);
  const frame = useRef(0);
  const { scrollY } = useScroll();

  const measure = useCallback(() => {
    const list = headings.current;
    if (!list.length) return;
    const line = spyLine();
    let index = 0;
    for (let i = 0; i < list.length && list[i].getBoundingClientRect().top - line <= 0; i++) index = i;
    setState((prev) => (prev.index === index ? prev : { key: prev.key, index }));
  }, []);

  const schedule = useCallback(() => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(measure);
  }, [measure]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    headings.current = container ? Array.from(container.querySelectorAll('h2[id]')) : [];
    schedule();
  }, [containerRef, key, schedule]);

  useMotionValueEvent(scrollY, 'change', schedule);

  useEffect(() => {
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame.current);
    };
  }, [schedule]);

  useEffect(() => {
    headings.current.forEach((heading, i) => heading.toggleAttribute('data-active', i === active));
  }, [active, key]);

  return active;
}

/** Smoothed 0→1 progress through the article. */
export function useReadingProgress(ref) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 160px', 'end end'] });
  return useSpring(scrollYProgress, { stiffness: 170, damping: 32, restDelta: 0.0005 });
}

/** Scrolls to a heading by id (through Lenis when it runs) and moves focus to it. */
export function useJumpToHeading() {
  const lenis = useLenis();
  const reduce = useReducedMotion();
  return useCallback(
    (id) => {
      const target = document.getElementById(id);
      if (!target) return;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(target, reduce ? { immediate: true, force: true } : { duration: 1.15, force: true });
      } else {
        target.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
      }
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    },
    [lenis, reduce],
  );
}

/**
 * Scroll position when switching document or language: a reader already inside the article lands at
 * the top of the new article (which gets focus); someone still in the hero stays put. Any other
 * navigation to the page starts at the top, unless the URL has a hash.
 * Returns the `onSwitch` callback to run right before a switch navigates.
 */
export function useSwitchScroll(bodyRef, locationKey, hash) {
  const lenis = useLenis();
  const intent = useRef(null);
  const lastKey = useRef(locationKey);

  const articleTop = useCallback(() => {
    const body = bodyRef.current;
    if (!body) return 0;
    const offset = isDesktop() ? 112 : 88;
    return Math.max(0, body.getBoundingClientRect().top + window.scrollY - offset);
  }, [bodyRef]);

  const onSwitch = useCallback(() => {
    intent.current = window.scrollY > articleTop() + 2 ? 'article' : 'keep';
  }, [articleTop]);

  useLayoutEffect(() => {
    if (lastKey.current === locationKey) return;
    lastKey.current = locationKey;
    const mode = intent.current;
    intent.current = null;
    if (hash || mode === 'keep') return;
    const top = mode === 'article' ? articleTop() : 0;
    if (lenis) lenis.scrollTo(top, { immediate: true, force: true });
    else window.scrollTo(0, top);
    if (mode === 'article') bodyRef.current?.querySelector('article')?.focus({ preventScroll: true });
  }, [locationKey, hash, lenis, articleTop, bodyRef]);

  return onSwitch;
}
