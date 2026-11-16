import { useRef } from 'react';
import { useInView } from 'motion/react';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { ALL_TECH, CORE_TECH } from '../lib/site';
import { Marquee } from '../ui/Marquee';
import { TechChip } from '../ui/TechLogo';
import { Container, Reveal } from '../ui/primitives';

const EXTENDED_TECH = ALL_TECH.filter((tech) => !CORE_TECH.some((core) => core.name === tech.name));

/** Home tech band: core and extended technologies as two opposing marquees. */
export default function TechSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '100px 0px' });

  return (
    <section aria-labelledby="tech-title" className="relative isolate border-y border-white/[0.06] bg-ink-900 py-14 sm:py-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-grid-sm opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]"
      />
      <Container>
        <Reveal className="mb-9 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="tech-title" className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-200">
            <span className="mr-2.5 inline-block size-1.5 translate-y-[-2px] rounded-full bg-sage-300" aria-hidden="true" />
            Powered by modern technologies
          </h2>
          <p className="nums font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            <span className="text-ink-50">{pad(CORE_TECH.length)}</span>
            {' core'}
            <span className="mx-2 text-ink-300" aria-hidden="true">
              /
            </span>
            <span className="text-ink-50">{pad(EXTENDED_TECH.length)}</span>
            {' extended'}
          </p>
        </Reveal>
      </Container>
      <div ref={ref} className={cn('space-y-4', !inView && '[&_.animate-marquee]:[animation-play-state:paused]')}>
        <Marquee duration={46} gap="1rem" repeat={2} label="Core technologies">
          {CORE_TECH.map((tech) => (
            <TechChip key={tech.name} tech={tech} size="lg" />
          ))}
        </Marquee>
        <Marquee duration={58} reverse gap="1rem" repeat={2} label="Extended toolbelt">
          {EXTENDED_TECH.map((tech) => (
            <TechChip key={tech.name} tech={tech} size="lg" className="border-white/[0.05] bg-transparent" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
