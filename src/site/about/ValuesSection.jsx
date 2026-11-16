import { useReducedMotion } from 'motion/react';
import { useMediaQuery } from '../lib/hooks';
import { Container, Glow, SectionHeading, Stagger, StaggerItem } from '../ui/primitives';
import { VALUES, VALUES_HEADING } from './content';
import { ValueCard } from './ValueCard';
import { ValuesScroller } from './ValuesScroller';

/** Core values: the pinned horizontal scroller on large, tall screens; a plain 2-column grid otherwise or with reduced motion. */
export function ValuesSection() {
  const roomy = useMediaQuery('(min-width: 1024px) and (min-height: 680px)');
  const reduce = useReducedMotion() ?? false;
  return roomy && !reduce ? <ValuesScroller /> : <ValuesGrid />;
}

function ValuesGrid() {
  return (
    <section id="values" aria-labelledby="values-title" className="relative isolate py-24 sm:py-28">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Glow className="-right-[20%] top-[10%] size-[520px]" />
      </div>
      <Container>
        <SectionHeading id="values-title" eyebrow={VALUES_HEADING.eyebrow} title={VALUES_HEADING.title} />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-2" gap={0.1}>
          {VALUES.map((value, i) => (
            <StaggerItem key={value.key}>
              <ValueCard value={value} order={i} className="h-full" />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
