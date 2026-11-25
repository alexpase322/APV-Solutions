import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useIsPresent, useMotionValueEvent, useScroll } from 'motion/react';
import { useLenis } from 'lenis/react';
import { ArrowUpRightIcon, EnvelopeSimpleIcon, PhoneIcon, SignInIcon, SparkleIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { APP_LINKS, CONTACT_PATH, NAV_LINKS, SITE } from '../lib/site';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { preloadAssistant, useAssistant } from '../assistant/assistantStore';
import { setChatSuppressed } from '../assistant/chat';

/** Floating header: transparent at the top, frosted glass once the page scrolls. */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 24;
    if (next !== scrolled) setScrolled(next);
  });

  // Close the menu on navigation (adjusting state during render, keyed on the location)
  const [menuLocation, setMenuLocation] = useState(location);
  if (menuLocation !== location) {
    setMenuLocation(location);
    if (menuOpen) setMenuOpen(false);
  }

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (mql.matches) setMenuOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Open menu: lock scroll, hide the chat bubble, make the page inert, Escape closes
  useEffect(() => {
    if (!menuOpen) return undefined;
    lenis?.stop();
    setChatSuppressed('menu', true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const background = [document.getElementById('main'), document.querySelector('footer')].filter(Boolean);
    background.forEach((el) => el.setAttribute('inert', ''));
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.querySelector('[aria-controls="mobile-menu"]')?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      lenis?.start();
      setChatSuppressed('menu', false);
      document.body.style.overflow = previousOverflow;
      background.forEach((el) => el.removeAttribute('inert'));
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen, lenis]);

  return (
    <>
      <a
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
        className="sr-only left-4 top-4 z-[90] rounded-full bg-sage-300 px-5 py-3 font-medium text-ink-950 focus:not-sr-only focus:fixed"
      >
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
        <div className="mx-auto w-full max-w-[1320px] px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.1 }}
            className={cn(
              'flex h-16 items-center justify-between gap-4 rounded-2xl border pl-4 pr-2.5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out-expo sm:pl-5',
              scrolled || menuOpen
                ? 'border-white/[0.08] bg-ink-850/75 shadow-[0_20px_50px_-20px_rgba(2,6,10,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl backdrop-saturate-150'
                : 'border-transparent bg-transparent',
            )}
          >
            <Logo className="shrink-0" />
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'relative block whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300',
                          isActive ? 'text-ink-50' : 'text-ink-200 hover:text-ink-50',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.span
                              layoutId="nav-active"
                              transition={SPRING_SNAPPY}
                              className="absolute inset-0 -z-10 rounded-full border border-white/[0.08] bg-white/[0.06]"
                            />
                          )}
                          {link.label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex shrink-0 items-center gap-1.5">
              <NavAskAI onOpen={() => setMenuOpen(false)} />
              <Link
                to={APP_LINKS.login}
                className="hidden h-10 items-center gap-2 rounded-full px-4 text-[14px] font-medium text-ink-200 transition-colors hover:text-ink-50 md:inline-flex"
              >
                <SignInIcon weight="bold" className="size-4" aria-hidden="true" />
                Log in
              </Link>
              <div className="hidden sm:block">
                <Button to={CONTACT_PATH} size="sm" magnetic>
                  Get Started
                </Button>
              </div>
              <MenuToggle open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
            </div>
          </motion.div>
        </div>
      </header>
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </>
  );
}

function NavAskAI({ onOpen }) {
  const { open } = useAssistant();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-label="Ask AI — APV assistant"
      onPointerEnter={preloadAssistant}
      onFocus={preloadAssistant}
      onClick={() => {
        onOpen?.();
        open();
      }}
      className="group/ai inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-full border border-sage-300/25 bg-sage-300/[0.08] text-[14px] font-medium text-sage-200 transition-colors hover:border-sage-300/50 hover:bg-sage-300/15 lg:hidden xl:inline-flex xl:h-10 xl:w-auto xl:px-4"
    >
      <SparkleIcon weight="fill" className="size-4 transition-transform duration-500 ease-out-expo group-hover/ai:rotate-90" aria-hidden="true" />
      <span className="hidden xl:inline" aria-hidden="true">
        Ask AI
      </span>
    </button>
  );
}

function MenuToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? 'Close menu' : 'Open menu'}
      className="relative grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] lg:hidden"
    >
      <span className="relative block h-3 w-5" aria-hidden="true">
        <motion.span
          animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
          transition={SPRING_SNAPPY}
          className="absolute left-0 top-0 h-[1.5px] w-5 rounded-full bg-ink-50"
        />
        <motion.span
          animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
          transition={SPRING_SNAPPY}
          className="absolute bottom-0 left-0 h-[1.5px] w-5 rounded-full bg-ink-50"
        />
      </span>
    </button>
  );
}

function MobileMenu({ onClose }) {
  const assistant = useAssistant();
  const ref = useRef(null);
  const isPresent = useIsPresent();

  // Focus the first link and keep Tab cycling between the toggle button and the menu
  useEffect(() => {
    if (!isPresent) return undefined;
    ref.current?.querySelector('a,button')?.focus();
    const onKeyDown = (event) => {
      if (event.key !== 'Tab' || !ref.current) return;
      const toggle = document.querySelector('[aria-controls="mobile-menu"]');
      const items = [...(toggle ? [toggle] : []), ...ref.current.querySelectorAll('a,button')];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPresent]);

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-label="Site menu"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      className="fixed inset-0 z-[45] lg:hidden"
    >
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)' }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="absolute inset-0 bg-ink-900/[0.97] backdrop-blur-2xl"
      >
        <div className="absolute inset-0 bg-grid opacity-40 mask-radial" aria-hidden="true" />
      </motion.div>
      <div ref={ref} className="relative flex h-full flex-col overflow-y-auto px-6 pb-10 pt-28" data-lenis-prevent>
        <nav aria-label="Mobile">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <motion.li
                key={link.to}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
                transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.12 + i * 0.05 }}
                className="border-b border-white/[0.06]"
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between py-4 text-[2rem] font-semibold tracking-[-0.04em] transition-colors',
                      isActive ? 'text-sage-300' : 'text-ink-50',
                    )
                  }
                >
                  {link.label}
                  <span className="font-mono text-xs text-ink-200">0{i + 1}</span>
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.42 }}
          className="mt-10 flex flex-col gap-3"
        >
          <Link to={CONTACT_PATH} onClick={onClose} className="flex h-14 items-center justify-center gap-2 rounded-full bg-sage-300 font-medium text-ink-950">
            Get Started <ArrowUpRightIcon weight="bold" className="size-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => {
              onClose();
              assistant.open();
            }}
            className="flex h-14 items-center justify-center gap-2 rounded-full border border-sage-300/30 bg-sage-300/[0.08] font-medium text-sage-200"
          >
            <SparkleIcon weight="fill" className="size-4" aria-hidden="true" /> Ask our AI assistant
          </button>
          <Link
            to={APP_LINKS.login}
            onClick={onClose}
            className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/10 font-medium text-ink-50"
          >
            <SignInIcon weight="bold" className="size-4" aria-hidden="true" /> Log in
          </Link>
          <div className="mt-6 grid gap-3 text-sm text-ink-200">
            <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-3 py-1">
              <EnvelopeSimpleIcon className="size-4 text-sage-300" aria-hidden="true" /> {SITE.email}
            </a>
            <a href={SITE.phoneHref} className="inline-flex items-center gap-3 py-1">
              <PhoneIcon className="size-4 text-sage-300" aria-hidden="true" /> {SITE.phoneDisplay}
            </a>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
