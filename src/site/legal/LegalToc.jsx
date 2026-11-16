import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useTransform } from 'motion/react';
import { CaretDownIcon, ListBulletsIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { padNum } from './legalDocs';

/** Numbered section list with a progress rail; the current section gets a sliding highlight. */
function TocList({ items, active, progress, onJump, pillId }) {
  const handleClick = (event, id) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    onJump(id);
  };

  return (
    <div className="relative">
      <span aria-hidden="true" className="absolute bottom-5 left-[19px] top-5 w-px overflow-hidden rounded-full bg-white/[0.07]">
        <motion.span style={{ scaleY: progress }} className="block size-full origin-top bg-sage-300/70" />
      </span>
      <ol className="relative">
        {items.map((item, index) => {
          const current = index === active;
          const done = index < active;
          return (
            <li key={item.id} data-toc-index={index} className="relative">
              <a
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  'group relative isolate flex min-h-11 items-start gap-3 rounded-xl py-2.5 pl-3 pr-3 text-[15px] leading-snug lg:text-[14px] tracking-[-0.01em] transition-colors duration-300',
                  current ? 'text-ink-50' : 'text-ink-200 hover:text-ink-50',
                )}
              >
                {current && (
                  <motion.span
                    layoutId={pillId}
                    transition={SPRING_SNAPPY}
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-xl border border-white/[0.08] bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                  />
                )}
                <span aria-hidden="true" className="relative mt-[3px] grid size-[15px] shrink-0 place-items-center">
                  <span
                    className={cn(
                      'block rounded-full transition-[background-color,box-shadow,transform] duration-500 ease-out-expo',
                      current
                        ? 'size-[9px] bg-sage-300 shadow-[0_0_0_4px_rgba(180,198,143,0.16)]'
                        : done
                          ? 'size-[7px] bg-sage-300/70'
                          : 'size-[7px] bg-ink-500 group-hover:bg-ink-400',
                    )}
                  />
                </span>
                {item.num && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'nums mt-px w-5 shrink-0 font-mono text-[11px] tracking-wide transition-colors duration-300',
                      current ? 'text-sage-300' : 'text-ink-200',
                    )}
                  >
                    {padNum(item.num)}
                  </span>
                )}
                <span className="min-w-0">
                  {item.num && <span className="sr-only">{item.num}. </span>}
                  {item.label}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** "42% read". */
function ReadProgress({ progress, suffix, className }) {
  const percent = useTransform(progress, (value) => `${Math.round(Math.min(1, Math.max(0, value)) * 100)}%`);
  return (
    <span aria-hidden="true" className={cn('nums font-mono text-[11px] tracking-wide text-ink-200', className)}>
      <motion.span>{percent}</motion.span>
      {suffix && <span> {suffix}</span>}
    </span>
  );
}

/** Desktop sidebar: sticky table of contents with reading progress. */
export function TocPanel({ items, active, progress, onJump, ui, footer }) {
  const scroller = useRef(null);
  const reduce = useReducedMotion();

  // Keep the current entry visible inside the panel's own scroll area
  useEffect(() => {
    const panel = scroller.current;
    const entry = panel?.querySelector(`[data-toc-index="${active}"]`);
    if (!panel || !entry) return;
    const top = entry.offsetTop;
    const bottom = top + entry.offsetHeight;
    if (top < panel.scrollTop + 16 || bottom > panel.scrollTop + panel.clientHeight - 16) {
      panel.scrollTo({ top: top - panel.clientHeight / 2 + entry.offsetHeight / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }, [active, reduce]);

  return (
    <nav aria-label={ui.onThisPage} className="surface overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-4 px-5 pt-5">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-sage-300">{ui.onThisPage}</p>
        <ReadProgress progress={progress} suffix={ui.read} />
      </div>
      <div aria-hidden="true" className="mx-5 mt-3 h-[3px] overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div style={{ scaleX: progress }} className="h-full origin-left rounded-full bg-sage-300" />
      </div>
      <motion.div
        ref={scroller}
        layoutScroll
        data-lenis-prevent
        className="relative mt-3 max-h-[calc(100dvh-21rem)] min-h-40 overflow-y-auto overscroll-contain px-2 pb-2"
      >
        <TocList items={items} active={active} progress={progress} onJump={onJump} pillId="legal-toc-pill" />
      </motion.div>
      {footer && <div className="border-t border-white/[0.06] px-5 py-4">{footer}</div>}
    </nav>
  );
}

/** Phone/tablet: sticky bar showing the current section that expands into the full list. */
export function MobileToc({ items, active, progress, onJump, ui }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const toggle = useRef(null);
  const current = items[active] ?? items[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (root.current && !root.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={root}
      onBlur={(event) => {
        if (open && !root.current?.contains(event.relatedTarget)) setOpen(false);
      }}
      className="sticky top-[84px] z-20 mb-10 sm:top-[92px] lg:hidden"
    >
      <div className="glass relative overflow-hidden rounded-2xl">
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={open ? 'legal-toc-mobile' : undefined}
          className="flex min-h-[58px] w-full items-center gap-3 px-4 text-left"
        >
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300"
          >
            <ListBulletsIcon weight="bold" className="size-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-sage-300">{ui.onThisPage}</span>
            <span className="mt-0.5 block truncate text-[15px] font-medium tracking-[-0.01em] text-ink-50">
              <span className="sr-only">{ui.currentSection}: </span>
              {current?.num && <span className="nums mr-2 font-mono text-[12px] text-ink-200">{padNum(current.num)}</span>}
              {current?.label}
            </span>
          </span>
          <ReadProgress progress={progress} />
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={SPRING_SNAPPY}
            className="grid size-8 shrink-0 place-items-center rounded-full text-ink-200"
          >
            <CaretDownIcon weight="bold" className="size-4" />
          </motion.span>
        </button>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.05]">
          <motion.span style={{ scaleX: progress }} className="block h-full origin-left bg-sage-300" />
        </span>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="legal-toc-mobile"
            layoutScroll
            data-lenis-prevent
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE_OUT_EXPO } }}
            exit={{ opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.2 } }}
            className="glass absolute inset-x-0 top-full mt-2 max-h-[min(30rem,calc(100dvh_-_15rem))] origin-top overflow-y-auto overscroll-contain rounded-2xl p-2"
          >
            <TocList
              items={items}
              active={active}
              progress={progress}
              pillId="legal-toc-pill-mobile"
              onJump={(id) => {
                setOpen(false);
                onJump(id);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
