import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, motionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLenis } from 'lenis/react';
import { cn } from '../lib/cn';
import { useMediaQuery } from '../lib/hooks';
import { scaleIn } from '../lib/motion';
import { PRODUCTS } from '../lib/site';
import { Container, Reveal, SectionHeading } from '../ui/primitives';
import { CaseFile, ProductMock } from './CaseFile';
import { SHOWCASE_COPY, panelId } from './content';
import { MockPausedContext } from './mockHooks';

/**
 * On desktop the case files stack: each panel sticks a little lower than the previous one, and as the next
 * panel slides over it, it shrinks and dims. Stacking only turns on when every panel fits the viewport.
 */
const STACK_TOP = 96;
const STACK_STEP = 24;
const STACK_BOTTOM_GAP = 16;
const SCALE_PER_PANEL = 0.05;
const DIM_PER_PANEL = 0.4;
const DIM_MAX = 0.62;
const stickyTop = (index) => STACK_TOP + index * STACK_STEP;

/** True when `enabled` and every panel fits below its sticky offset; re-measured on resize. */
function useStackLayout(panelsRef, enabled) {
  const [fits, setFits] = useState(false);

  useLayoutEffect(() => {
    if (!enabled) return undefined;
    const panels = panelsRef.current;
    const measure = () => {
      const viewport = window.innerHeight;
      const next = panels.every((panel, i) => !panel || panel.offsetHeight <= viewport - stickyTop(i) - STACK_BOTTOM_GAP);
      setFits((prev) => (prev === next ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    panels.forEach((panel) => panel && observer.observe(panel));
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [panelsRef, enabled]);

  return enabled && fits;
}

/** Grid, a soft glow and a top hairline behind a panel; the glow sits on the mock's side. */
function PanelBackdrop({ reverse }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div
        className={cn(
          'absolute inset-0 bg-grid-sm opacity-70',
          '[mask-image:radial-gradient(ellipse_90%_45%_at_50%_78%,#000_10%,transparent_75%)]',
          reverse
            ? 'lg:[mask-image:radial-gradient(ellipse_50%_70%_at_30%_50%,#000_10%,transparent_75%)]'
            : 'lg:[mask-image:radial-gradient(ellipse_50%_70%_at_70%_50%,#000_10%,transparent_75%)]',
        )}
      />
      <div
        className={cn(
          'absolute bottom-[-10%] aspect-square w-[42rem] max-w-[140%] rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.16),transparent_62%)] lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2',
          reverse ? '-left-40' : '-right-40',
        )}
      />
      <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-sage-300/35 to-transparent" />
    </div>
  );
}

/**
 * One product panel. `entries[i]` is each panel's 0→1 progress from entering the viewport to reaching its
 * sticky offset; the sum of the following panels' progress drives this one's shrink and dim.
 */
function ShowcasePanel({ product, index, total, entries, stack, panelRef }) {
  const anchorRef = useRef(null);
  const top = stickyTop(index);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: anchorRef, offset: ['start end', `start ${top}px`] });
  const entry = entries[index];

  useMotionValueEvent(scrollYProgress, 'change', (value) => entry.set(value));
  useEffect(() => {
    const id = window.requestAnimationFrame(() => entry.set(scrollYProgress.get()));
    return () => window.cancelAnimationFrame(id);
  }, [entry, scrollYProgress]);

  const covered = useTransform(entries, (values) => {
    let sum = 0;
    for (let i = index + 1; i < values.length; i++) sum += values[i];
    return sum;
  });
  const scale = useTransform(covered, (value) => 1 - value * SCALE_PER_PANEL);
  const dim = useTransform(covered, (value) => Math.min(DIM_MAX, value * DIM_PER_PANEL));
  const mockY = useTransform(entry, [0, 1], [72, 0]);
  const mockTilt = useTransform(entry, [0, 1], [9, 0]);

  // a panel that is almost fully covered pauses its mock's animations
  const [buried, setBuried] = useState(false);
  useMotionValueEvent(covered, 'change', (value) => {
    if (!stack) return;
    const next = value > 0.85;
    setBuried((prev) => (prev === next ? prev : next));
  });

  return (
    <>
      <div
        ref={anchorRef}
        id={product.slug}
        data-focus-target={panelId(product.slug)}
        className="h-0"
        style={stack ? { scrollMarginTop: `calc(${top}px - var(--header-h) - 24px)` } : undefined}
      />
      <div className={cn('relative', stack && 'sticky', index < total - 1 && (stack ? 'mb-[16vh]' : 'mb-6 sm:mb-8'))} style={stack ? { top } : undefined}>
        <MockPausedContext.Provider value={stack && buried}>
          <motion.article
            ref={panelRef}
            id={panelId(product.slug)}
            tabIndex={-1}
            aria-labelledby={`${product.slug}-title`}
            onFocus={() => {
              // keyboard focus inside a covered panel: bring it back to its sticky spot
              if (!stack || covered.get() < 0.15) return;
              const anchor = anchorRef.current;
              if (!anchor) return;
              const y = anchor.getBoundingClientRect().top + window.scrollY - top;
              if (lenis) lenis.scrollTo(y, { duration: 0.9 });
              else window.scrollTo({ top: y });
            }}
            style={stack ? { scale, transformOrigin: '50% 0%' } : undefined}
            className={cn('surface relative isolate overflow-hidden rounded-4xl sm:rounded-5xl', stack && 'will-change-transform')}
          >
            <PanelBackdrop reverse={index % 2 === 1} />
            <CaseFile
              product={product}
              index={index}
              total={total}
              mock={
                <div className="[perspective:1600px]">
                  <motion.div style={stack ? { y: mockY, rotateX: mockTilt, transformOrigin: '50% 100%' } : undefined}>
                    <Reveal variants={scaleIn} amount={0.15}>
                      <ProductMock slug={product.slug} />
                    </Reveal>
                  </motion.div>
                </div>
              }
            />
            {stack && (
              <motion.div aria-hidden="true" style={{ opacity: dim }} className="pointer-events-none absolute inset-0 z-20 bg-ink-950" />
            )}
          </motion.article>
        </MockPausedContext.Provider>
      </div>
    </>
  );
}

export function ProductShowcase() {
  const reduce = useReducedMotion() ?? false;
  const desktop = useMediaQuery('(min-width: 1024px)');
  const panelsRef = useRef([]);
  const stack = useStackLayout(panelsRef, desktop && !reduce);
  const [entries] = useState(() => PRODUCTS.map(() => motionValue(0)));

  return (
    <section aria-labelledby="showcase-title" className="relative isolate overflow-x-clip pb-20 pt-24 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_12%,#000_80%,transparent)]" />
        <div className="absolute left-1/2 top-[18%] aspect-square w-[min(1200px,150vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,82,110,0.3),transparent_60%)]" />
        <div className="absolute left-1/2 top-[62%] aspect-square w-[min(1000px,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.1),transparent_60%)]" />
      </div>
      <Container>
        <SectionHeading
          layout="split"
          eyebrow={SHOWCASE_COPY.eyebrow}
          id="showcase-title"
          title={SHOWCASE_COPY.title}
          description={SHOWCASE_COPY.description}
        />
        <div className="relative mt-14 sm:mt-16 lg:mt-20">
          {PRODUCTS.map((product, index) => (
            <ShowcasePanel
              key={product.slug}
              product={product}
              index={index}
              total={PRODUCTS.length}
              entries={entries}
              stack={stack}
              panelRef={(el) => {
                panelsRef.current[index] = el;
              }}
            />
          ))}
          {stack && <div aria-hidden="true" className="h-[14vh]" />}
        </div>
      </Container>
    </section>
  );
}
