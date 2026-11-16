import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { Container, Eyebrow, Glow, Reveal, SplitText } from '../ui/primitives';
import { VALUES, VALUES_HEADING } from './content';
import { ValueCard } from './ValueCard';

/**
 * Desktop values: a 300vh section with a sticky viewport; vertical scroll slides the heading and the
 * value cards horizontally, with a step counter and progress bar along the bottom.
 */
export function ValuesScroller() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  /** How far (px) the track has to travel so its last card reaches the right edge. */
  const maxShift = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(() => -scrollYProgress.get() * maxShift.get());
  const [current, setCurrent] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setCurrent(Math.min(VALUES.length - 1, Math.max(0, Math.floor(latest * VALUES.length))));
  });

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return undefined;
    const measure = () => maxShift.set(Math.max(0, track.scrollWidth - viewport.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [maxShift]);

  return (
    <section ref={sectionRef} id="values" aria-labelledby="values-title" className="relative h-[300vh]">
      <div
        ref={viewportRef}
        className="sticky top-0 isolate flex h-[100dvh] flex-col justify-center overflow-clip pt-[var(--header-h)]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <Glow className="left-[30%] top-1/2 size-[760px] -translate-y-1/2 opacity-60" />
          <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_10%,transparent_75%)]" />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max items-stretch gap-6 pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] pr-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))] will-change-transform"
        >
          <div className="flex w-[clamp(340px,30vw,460px)] shrink-0 flex-col justify-center pr-6">
            <Reveal className="mb-6">
              <Eyebrow>{VALUES_HEADING.eyebrow}</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              id="values-title"
              text={VALUES_HEADING.title}
              className="text-[clamp(2.1rem,3.4vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50"
            />
            <Reveal delay={0.15} className="mt-10 inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
              <span aria-hidden="true" className="grid size-8 place-items-center rounded-full border border-white/10">
                <ArrowRightIcon weight="bold" className="size-3.5 text-sage-300" />
              </span>
              <span aria-hidden="true">Keep scrolling</span>
            </Reveal>
          </div>
          {VALUES.map((value, i) => (
            <ValueCard
              key={value.key}
              value={value}
              progress={scrollYProgress}
              order={i}
              className="min-h-[min(560px,calc(100dvh-var(--header-h)-10rem))] w-[clamp(380px,34vw,500px)] shrink-0"
            />
          ))}
        </motion.div>

        <Container className="absolute inset-x-0 bottom-8">
          <div aria-hidden="true" className="flex items-center gap-6 pr-16 2xl:pr-0">
            <ol className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.18em]">
              {VALUES.map((value, i) => (
                <li
                  key={value.key}
                  className={cn('flex items-center gap-2 transition-colors duration-500', i === current ? 'text-sage-200' : 'text-ink-300')}
                >
                  <span className="nums">{value.index}</span>
                  <span className="hidden xl:inline">{value.title}</span>
                </li>
              ))}
            </ol>
            <div className="relative h-px flex-1 overflow-hidden bg-white/10">
              <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-sage-300" />
            </div>
            <span className="nums font-mono text-[11px] tracking-[0.18em] text-ink-200">
              {pad(current + 1)}
              {' / '}
              {pad(VALUES.length)}
            </span>
          </div>
        </Container>
      </div>
    </section>
  );
}
