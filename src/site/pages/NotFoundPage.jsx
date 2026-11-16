import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { HouseIcon, IdentificationCardIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { APP_LINKS, CONTACT_PATH } from '../lib/site';
import { Aurora, Container, Eyebrow, GridBeams, PulseDot, Seo, SplitText } from '../ui/primitives';
import { Button, TextLink } from '../ui/Button';
import useNoIndex from '../../hooks/useNoIndex';

const GLYPHS = '0123456789#%&*+=/<>[]{}$@§';
const randomGlyph = () => GLYPHS[Math.floor(Math.random() * 26)];
const settledState = (text) => ({ chars: text.split(''), settled: text.split('').map(() => true) });

/**
 * Text that "decodes": each character cycles through random glyphs and settles one by one.
 * Plays once on mount; `replay()` runs a quicker pass. Static with reduced motion.
 */
function useScramble(text, { delay = 250, cycle = 650, step = 300, tick = 55 } = {}) {
  const reduce = useReducedMotion();
  const [state, setState] = useState(() =>
    reduce
      ? settledState(text)
      : { chars: text.split('').map((_, i) => GLYPHS[(i * 7 + 3) % 26]), settled: text.split('').map(() => false) },
  );
  const frame = useRef(0);
  const running = useRef(false);

  /** `settleAt[i]`: ms after start when character i settles. */
  const run = useCallback(
    (settleAt) => {
      if (reduce || running.current) return;
      running.current = true;
      const end = settleAt[settleAt.length - 1];
      const start = performance.now();
      let lastTick = -Infinity;
      const loop = (now) => {
        const elapsed = now - start;
        if (elapsed >= end) {
          setState(settledState(text));
          running.current = false;
          return;
        }
        if (now - lastTick >= tick) {
          lastTick = now;
          setState({
            chars: text.split('').map((char, i) => (elapsed >= settleAt[i] ? char : randomGlyph())),
            settled: settleAt.map((at) => elapsed >= at),
          });
        }
        frame.current = requestAnimationFrame(loop);
      };
      frame.current = requestAnimationFrame(loop);
    },
    [reduce, text, tick],
  );

  useEffect(() => {
    if (reduce) return;
    run(text.split('').map((_, i) => delay + cycle + i * step));
    return () => {
      cancelAnimationFrame(frame.current);
      running.current = false;
    };
  }, [reduce, text, delay, cycle, step, run]);

  const replay = useCallback(() => {
    run(text.split('').map((_, i) => 320 + i * 190));
  }, [run, text]);

  return { ...(reduce ? settledState(text) : state), replay };
}

const CORNERS = [
  'left-4 top-4 border-l border-t',
  'right-4 top-4 border-r border-t',
  'bottom-4 left-4 border-b border-l',
  'bottom-4 right-4 border-b border-r',
];

/** Blueprint-style panel with a scrambling, slightly off-grid "404". Hover replays it. */
function OffGridPanel({ className }) {
  const { chars, settled, replay } = useScramble('404');
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className={cn('relative mx-auto w-full max-w-[640px] select-none', className)}>
      <div className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(148,163,120,0.16),transparent)]" />
      <div
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') replay();
        }}
        className="glass @container relative aspect-[4/3] overflow-hidden rounded-4xl"
      >
        <div className="absolute inset-0 bg-grid-sm opacity-80 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_78%)]" />
        {CORNERS.map((corner) => (
          <span key={corner} className={cn('absolute size-4 border-sage-300/50', corner)} />
        ))}
        <span className="absolute left-9 top-[18px] font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200 sm:text-[11px]">
          Route · not found
        </span>
        <span className="absolute right-9 top-[18px] inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gold-300 sm:text-[11px]">
          <PulseDot tone="gold" size="sm" />
          Err 404
        </span>
        <span className="nums absolute bottom-[18px] left-9 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200 sm:text-[11px]">
          x 404 · y 404
        </span>
        <span className="absolute bottom-[18px] right-9 font-mono max-sm:hidden text-[10px] uppercase tracking-[0.2em] text-ink-200 sm:text-[11px]">
          apvsolutions.tech
        </span>

        {/* Where the page should have been… */}
        <div className="absolute left-[13%] top-[27%] h-[46%] w-[74%] rounded-2xl border border-dashed border-sage-300/35 bg-sage-300/[0.025]">
          <span className="absolute -top-[22px] left-0 font-mono text-[10px] uppercase tracking-[0.2em] text-sage-300/80 sm:text-[11px]">
            page.slot
          </span>
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 bg-sage-300/40" />
          <span className="absolute left-1/2 top-1/2 h-6 w-px -translate-y-1/2 bg-sage-300/40" />
          <span className="nums absolute -bottom-[22px] right-0 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200 sm:text-[11px]">
            Δ +5% −7% · −4°
          </span>
        </div>

        {/* …and where it drifted to */}
        <div className="absolute inset-0 grid place-items-center" style={{ transform: 'translate(5%, -7%) rotate(-4deg)' }}>
          <div className="animate-float-slow">
            <p className="nums flex text-[33cqw] font-semibold leading-none tracking-[-0.06em] drop-shadow-[0_24px_40px_rgba(2,6,10,0.65)]">
              {chars.map((char, i) => (
                <motion.span
                  key={`${i}-${settled[i] ? 'on' : 'off'}`}
                  initial={settled[i] && !reduce ? { scale: 1.14, opacity: 0.4, filter: 'blur(6px)' } : false}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                  transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                  className={cn(
                    'inline-block w-[0.6em] text-center',
                    settled[i] ? (i === 1 ? 'text-sage-300' : 'text-ink-50') : 'text-sage-300/55',
                  )}
                >
                  {char}
                </motion.span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const MORE_PAGES = [
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'NFC Cards', to: '/nfc' },
  { label: 'About Us', to: '/about' },
  { label: 'Legal', to: '/legal' },
];

const rise = (delay) => ({
  initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
});

export default function NotFoundPage() {
  const location = useLocation();
  // While the page animates out, keep showing the address that wasn't found
  const [missingPath] = useState(location.pathname);
  const [lastLocation, setLastLocation] = useState(location);
  const stillHere = location.pathname === missingPath;
  if (stillHere && lastLocation !== location) setLastLocation(location);
  const { pathname, search } = stillHere ? location : lastLocation;
  const requested = `${pathname}${search}`;

  useNoIndex();

  return (
    <>
      <Seo
        title="Page not found | APV Business Solutions"
        description="The page you were looking for doesn't exist or has moved. Head back to APV Business Solutions' home, services or contact page."
        path={pathname}
      />
      <section
        aria-labelledby="nf-title"
        className="relative isolate overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-36 lg:flex lg:min-h-[92dvh] lg:items-center lg:pb-28 lg:pt-36"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Aurora variant="subtle" />
          <GridBeams />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-900" />
        </div>
        <Container>
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 lg:col-span-6">
              <motion.div {...rise(0.1)}>
                <Eyebrow>Error 404</Eyebrow>
              </motion.div>
              <SplitText
                as="h1"
                id="nf-title"
                immediate
                delay={0.2}
                text="This page drifted *off the grid*"
                className="mt-7 text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink-50"
              />
              <motion.p {...rise(0.5)} className="mt-7 max-w-[52ch] text-base leading-relaxed text-ink-200 sm:text-lg">
                The link you followed may be broken, or the page may have moved. Everything else is right where you left it, so
                pick a starting point below.
              </motion.p>
              <motion.p
                {...rise(0.6)}
                className="mt-6 flex max-w-full items-center gap-2.5 overflow-hidden rounded-xl border border-white/[0.08] bg-ink-850/70 px-3.5 py-2.5 font-mono text-[12.5px] backdrop-blur-md sm:w-fit"
              >
                <span aria-hidden="true" className="shrink-0 text-ink-200">
                  GET
                </span>
                <span className="sr-only">Requested address: </span>
                <code className="min-w-0 truncate text-ink-50">{requested}</code>
                <span
                  aria-hidden="true"
                  className="shrink-0 rounded-md border border-gold-400/30 bg-gold-400/[0.08] px-1.5 py-0.5 text-[11px] text-gold-300"
                >
                  404
                </span>
              </motion.p>

              <motion.div {...rise(0.7)} className="mt-10 flex flex-wrap items-center gap-3">
                <Button to="/" size="lg" leading={<HouseIcon weight="bold" className="size-[18px]" aria-hidden="true" />}>
                  Home
                </Button>
                <Button to="/services" size="lg" variant="secondary">
                  Services
                </Button>
                <Button to={CONTACT_PATH} size="lg" variant="secondary">
                  Contact
                </Button>
              </motion.div>

              <motion.nav {...rise(0.8)} aria-label="More pages" className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span aria-hidden="true" className="mr-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
                  Or jump to
                </span>
                <ul className="flex flex-wrap items-center gap-1 text-[15px]">
                  {MORE_PAGES.map((page) => (
                    <li key={page.to}>
                      <Link
                        to={page.to}
                        className="inline-flex min-h-11 items-center rounded-full px-3 text-ink-100 transition-colors duration-300 hover:bg-white/[0.05] hover:text-ink-50"
                      >
                        {page.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.nav>

              <motion.div {...rise(0.9)} className="mt-8 flex items-start gap-4 border-t border-white/[0.07] pt-7">
                <span
                  aria-hidden="true"
                  className="grid size-11 shrink-0 place-items-center rounded-2xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300"
                >
                  <IdentificationCardIcon weight="duotone" className="size-5" />
                </span>
                <p className="text-[15px] leading-relaxed text-ink-200">
                  Looking for your NFC profile or dashboard?
                  <br />
                  <TextLink href={APP_LINKS.login} className="min-h-11">
                    Log in
                  </TextLink>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.2 }}
              className="min-w-0 lg:col-span-6"
            >
              <OffGridPanel />
            </motion.div>
          </div>
        </Container>
      </section>
    </>
  );
}
