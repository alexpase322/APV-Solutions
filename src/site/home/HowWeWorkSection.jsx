import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { CheckIcon, CodeIcon, HeadsetIcon, MagnifyingGlassIcon, PenNibIcon } from '@phosphor-icons/react';
import { Container, Reveal, Section, SectionHeading, Stagger, StaggerItem } from '../ui/primitives';
import { BrandIcon } from '../ui/TechLogo';
import { AskAILink } from '../assistant/AskAI';
import { buildProcessPath } from './how-we-work/processPath';

const STEPS = [
  {
    index: '01',
    title: 'Analyze',
    description: 'We identify the bottlenecks in your daily operations and map how work really flows today.',
    icon: MagnifyingGlassIcon,
  },
  { index: '02', title: 'Design', description: 'A scalable architecture, with user experience at the heart of the process.', icon: PenNibIcon },
  {
    index: '03',
    title: 'Build & integrate',
    description: 'Custom code in React & Python, or no-code n8n workflows that connect your APIs without complex coding.',
    icon: CodeIcon,
    tools: [
      { name: 'React', logo: 'react' },
      { name: 'Python', logo: 'python' },
      { name: 'n8n', logo: 'n8n' },
    ],
  },
  { index: '04', title: 'Support', description: "24/7 support & maintenance once you're live, as your operation keeps growing.", icon: HeadsetIcon },
];

/** "How we work": four steps joined by a path that draws itself as the section scrolls by. */
export default function HowWeWorkSection() {
  const trackRef = useRef(null);
  const markerRefs = useRef([]);
  const [path, setPath] = useState(null);
  const reduce = useReducedMotion();

  // Measure the markers and rebuild the connecting path whenever the layout changes.
  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const box = track.getBoundingClientRect();
      const points = markerRefs.current
        .filter((marker) => !!marker)
        .map((marker) => {
          const rect = marker.getBoundingClientRect();
          return { x: rect.left - box.left + rect.width / 2, y: rect.top - box.top + rect.height / 2 };
        });
      setPath(buildProcessPath(points, box.width, box.height));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 0.82', 'end 0.45'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.6 });
  const complete = useMotionValue(1);
  const progress = reduce ? complete : smoothProgress;

  return (
    <Section aria-labelledby="process-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-1/3 h-[520px] bg-grid-sm opacity-50 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_50%,#000_10%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="process-title"
          layout="split"
          eyebrow="How we work"
          title="Four steps from *bottleneck to production*"
          description="Analyze, design, build, support — from the first workflow review to 24/7 support & maintenance."
        />

        <div ref={trackRef} className="relative mt-16 sm:mt-20">
          {path && path.d && (
            <svg
              aria-hidden="true"
              width={path.w}
              height={path.h}
              viewBox={`0 0 ${path.w} ${path.h}`}
              className="pointer-events-none absolute left-0 top-0 overflow-visible"
              fill="none"
            >
              <path d={path.d} stroke="rgba(234,240,245,0.1)" strokeWidth={1.5} strokeDasharray="2 7" strokeLinecap="round" />
              <motion.path d={path.d} stroke="#b4c68f" strokeWidth={2} strokeLinecap="round" style={{ pathLength: progress }} />
            </svg>
          )}

          <Stagger as="ol" gap={0.1} amount={0.15} className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative grid grid-cols-[48px_1fr] gap-x-5 lg:block">
                <StepMarker
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  icon={step.icon}
                  progress={progress}
                  at={path?.stops[i] ?? i / (STEPS.length - 1)}
                />
                <StaggerItem className="lg:mt-9">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300">Step {step.index}</span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-ink-50">{step.title}</h3>
                  <p className="mt-3 max-w-[38ch] text-[15px] leading-relaxed text-ink-200 sm:text-base">{step.description}</p>
                  {step.tools && (
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
                      {step.tools.map((tool) => (
                        <li
                          key={tool.name}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 text-[13px] text-ink-100"
                        >
                          <BrandIcon slug={tool.logo} name={tool.name} className="size-3.5" />
                          {tool.name}
                        </li>
                      ))}
                      <li className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-100">
                        APIs
                      </li>
                    </ul>
                  )}
                </StaggerItem>
              </li>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-14 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-ink-200 sm:mt-16">
          <span>Wondering how long your project would take?</span>
          <AskAILink chip="timeline">Ask our AI assistant</AskAILink>
        </Reveal>
      </Container>
    </Section>
  );
}

/**
 * Round step icon that fills with sage as the path reaches it (`at`, 0–1 along the path),
 * then gets a gold check once the path has moved past.
 */
function StepMarker({ ref, icon: Icon, progress, at }) {
  const lit = useTransform(progress, (value) => Math.min(1, Math.max(0, (value - at + 0.035) / 0.05)));
  const haloScale = useTransform(lit, [0, 1], [0.7, 1]);
  const done = useTransform(progress, (value) => +(value - at > 0.12 || (at >= 0.99 && value >= 0.995)));

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="relative z-[1] grid size-12 place-items-center rounded-full border border-white/10 bg-ink-850 text-ink-200 shadow-[0_0_0_6px_var(--color-ink-900)]"
    >
      <motion.span
        style={{ opacity: lit, scale: haloScale }}
        className="absolute -inset-1.5 rounded-full border border-sage-300/40 bg-sage-300/[0.06]"
      />
      <motion.span style={{ opacity: lit }} className="absolute inset-0 rounded-full bg-sage-300" />
      <Icon weight="duotone" className="relative size-5" />
      <motion.span style={{ opacity: lit }} className="absolute inset-0 grid place-items-center text-ink-950">
        <Icon weight="duotone" className="size-5" />
      </motion.span>
      <motion.span
        style={{ opacity: done }}
        className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border-2 border-ink-900 bg-gold-400 text-ink-950"
      >
        <CheckIcon weight="bold" className="size-2.5" />
      </motion.span>
    </span>
  );
}
