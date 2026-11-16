import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { useReducedMotion } from 'motion/react';
import { motionIsCalm } from './motionPrefs';

/** Moves keyboard focus to a scrolled-to section (or its data-focus-target) without scrolling again. */
function focusSection(el) {
  const targetId = el.dataset.focusTarget;
  const target = (targetId && document.getElementById(targetId)) || el;
  if (target.contains(document.activeElement)) return;
  const hadTabIndex = target.hasAttribute('tabindex');
  if (!hadTabIndex) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
  if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
}

/**
 * Scroll behaviour for the marketing site:
 * - in-page "#section" links go through the router so the hash is tracked;
 * - a hash scrolls (smoothly with Lenis) to its section once it has rendered;
 * - a new page starts at the top; clicking the current page's link scrolls back up.
 */
export default function ScrollManager() {
  const { pathname, search, hash, key } = useLocation();
  const navigate = useNavigate();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const previous = useRef(null);
  const current = useRef({ pathname, search });
  current.current = { pathname, search };
  const lenisRef = useRef(lenis);
  const reduceRef = useRef(reduce);

  useEffect(() => {
    lenisRef.current = lenis;
    reduceRef.current = reduce;
  }, [lenis, reduce]);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target?.closest?.('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.length < 2 || !href.startsWith('#') || href === '#main') return;
      if ((anchor.target && anchor.target !== '_self') || anchor.hasAttribute('download')) return;
      event.preventDefault();
      navigate({ pathname: current.current.pathname, search: current.current.search, hash: href });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);

  useEffect(() => {
    const before = previous.current;
    previous.current = { pathname, search };
    const lenisNow = lenisRef.current;
    const calm = reduceRef.current || motionIsCalm();
    const samePage = before?.pathname === pathname;

    if (!hash) {
      if (samePage && before?.search !== search) return;
      if (samePage) {
        if (lenisNow) lenisNow.scrollTo(0, calm ? { immediate: true, force: true } : { duration: 1.2, force: true });
        else window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
        return;
      }
      // Page changes are handled after the exit transition (see PageTransition); only the first load lands here
      if (before) return;
      if (lenisNow) lenisNow.scrollTo(0, { immediate: true, force: true });
      else window.scrollTo(0, 0);
      return;
    }

    let id = hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      /* keep raw id */
    }
    let cancelled = false;
    let attempts = 0;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(id);
      if (!el) {
        // The section may live in a lazily loaded page; keep looking for ~10s
        if (attempts++ < 160) window.setTimeout(tryScroll, 60);
        return;
      }
      const smooth = lenisRef.current;
      if (smooth) {
        smooth.resize();
        const instant = reduceRef.current || motionIsCalm();
        smooth.scrollTo(el, { ...(instant ? { immediate: true } : { duration: 1.4 }), force: true, onComplete: () => focusSection(el) });
      } else {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        focusSection(el);
      }
    };
    const timer = window.setTimeout(tryScroll, samePage ? 0 : 80);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [pathname, search, hash, key]);

  return null;
}
