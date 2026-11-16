import { Component, Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { UNSAFE_LocationContext as LocationContext, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useIsPresent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { ReactLenis, useLenis } from 'lenis/react';
import { EASE_OUT_EXPO } from '../lib/motion';
import { AssistantProvider } from '../assistant/AssistantProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollManager from './ScrollManager';
import { MotionPrefsContext, readMotionPaused, saveMotionPaused } from './motionPrefs';

/**
 * Shell for the public marketing pages: smooth scrolling, header, animated page transitions,
 * footer and the AI assistant. The private app (dashboard, admin…) is rendered outside it.
 */
export default function SiteLayout() {
  const [paused, setPausedState] = useState(readMotionPaused);
  const setPaused = useCallback((next) => {
    setPausedState(next);
    saveMotionPaused(next);
  }, []);
  const prefs = useMemo(() => ({ paused, setPaused }), [paused, setPaused]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('apv-motion-paused', paused);
    return () => root.classList.remove('apv-motion-paused');
  }, [paused]);

  return (
    <MotionConfig reducedMotion={paused ? 'always' : 'user'}>
      <MotionPrefsContext.Provider value={prefs}>
        <SmoothScroll disabled={paused}>
          <AssistantProvider>
            <ScrollManager />
            <ScrollProgress />
            <Navbar />
            <PageTransition />
            <Footer />
            <RouteAnnouncer />
          </AssistantProvider>
        </SmoothScroll>
      </MotionPrefsContext.Provider>
    </MotionConfig>
  );
}

/** Lenis smooth wheel scrolling, skipped entirely with reduced motion. */
function SmoothScroll({ children, disabled = false }) {
  const reduce = useReducedMotion();
  if (reduce) return children;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: !disabled, allowNestedScroll: true }}>
      {children}
    </ReactLenis>
  );
}

/** Thin gradient bar at the very top that tracks scroll progress. */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-sage-500 via-sage-300 to-gold-400"
    />
  );
}

/** Fades the old page out and the new one in; scrolls to the top in between (unless there is a hash). */
function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const lenis = useLenis();

  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        if (window.location.hash) return;
        if (lenis) {
          lenis.resize();
          lenis.scrollTo(0, { immediate: true, force: true });
        } else {
          window.scrollTo(0, 0);
        }
      }}
    >
      <motion.main
        key={location.pathname}
        id="main"
        tabIndex={-1}
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE_OUT_EXPO }, transitionEnd: { filter: 'none' } }}
        exit={{ opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: 0.28, ease: [0.7, 0, 0.84, 0] } }}
        className="relative min-h-[100dvh] outline-none"
      >
        <FocusMainOnNavigate />
        <FrozenLocation>
          <PageErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
          </PageErrorBoundary>
        </FrozenLocation>
      </motion.main>
    </AnimatePresence>
  );
}

/** Keeps the leaving page rendering its own route while it animates out. */
function FrozenLocation({ children }) {
  const context = useContext(LocationContext);
  const isPresent = useIsPresent();
  const frozen = useRef(context);
  // Read/write during render on purpose: the snapshot must update only while present
  // eslint-disable-next-line react-hooks/refs
  if (isPresent) frozen.current = context;
  // eslint-disable-next-line react-hooks/refs
  return <LocationContext.Provider value={frozen.current}>{children}</LocationContext.Provider>;
}

let firstPage = true;
/** After client-side navigation, move focus to <main> so screen readers start at the new content. */
function FocusMainOnNavigate() {
  useEffect(() => {
    if (firstPage) {
      firstPage = false;
      return;
    }
    if (!window.location.hash) document.getElementById('main')?.focus({ preventScroll: true });
  }, []);
  return null;
}

/** Announces the new page title to screen readers after navigation. */
function RouteAnnouncer() {
  const { pathname } = useLocation();
  const last = useRef(pathname);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (last.current === pathname) return undefined;
    last.current = pathname;
    const before = document.title;
    let ticks = 0;
    // Pages set their title in an effect; wait for it to change (max ~4s)
    const id = window.setInterval(() => {
      ticks += 1;
      if (document.title !== before || ticks >= 40) {
        window.clearInterval(id);
        setMessage(document.title);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [pathname]);

  return (
    <p aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </p>
  );
}

function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="mx-auto max-w-[1320px] px-5 pt-40 sm:px-8 lg:px-10">
      <div className="h-3 w-40 rounded-full shimmer" />
      <div className="mt-8 h-14 w-full max-w-3xl rounded-2xl shimmer" />
      <div className="mt-4 h-14 w-2/3 max-w-2xl rounded-2xl shimmer" />
      <div className="mt-10 h-5 w-full max-w-xl rounded-full shimmer" />
      <div className="mt-3 h-5 w-1/2 max-w-md rounded-full shimmer" />
    </div>
  );
}

const CHUNK_ERROR = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i;

/** A new deploy can remove old chunks: reload once per page before showing the error screen. */
function reloadOnceForChunkError() {
  try {
    const key = `apv-chunk-reload:${window.location.pathname}`;
    if (sessionStorage.getItem(key)) return false;
    sessionStorage.setItem(key, '1');
    return true;
  } catch {
    return false;
  }
}

class PageErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    if (CHUNK_ERROR.test(error.message) && reloadOnceForChunkError()) window.location.reload();
  }

  render() {
    return this.state.error ? <PageError /> : this.props.children;
  }
}

export function PageError() {
  return (
    <section aria-labelledby="page-error-title" className="mx-auto max-w-[1320px] px-5 pb-28 pt-40 sm:px-8 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300">Something went wrong</p>
      <h1 id="page-error-title" className="mt-6 max-w-2xl text-[clamp(2.2rem,5vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50">
        This page didn&apos;t load.
      </h1>
      <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-200">
        It may be a connection hiccup or a new version of the site. Reload to try again, or head back home.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex h-12 items-center rounded-full bg-sage-300 px-6 text-[15px] font-medium text-ink-950 transition-colors hover:bg-sage-200"
        >
          Reload page
        </button>
        <a
          href="/"
          className="inline-flex h-12 items-center rounded-full border border-white/10 bg-white/[0.04] px-6 text-[15px] font-medium text-ink-50 transition-colors hover:bg-white/[0.08]"
        >
          Go to Home
        </a>
      </div>
    </section>
  );
}
