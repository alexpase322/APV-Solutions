import { cn } from '../lib/cn';
import { ALL_TECH, CAPABILITIES } from '../lib/site';
import { Marquee } from '../ui/Marquee';
import { Container, Reveal, SectionHeading } from '../ui/primitives';
import { TechChip } from '../ui/TechLogo';
import { TOOLBELT } from './content';

const HALF = Math.ceil(ALL_TECH.length / 2);
const FIRST_ROW = ALL_TECH.slice(0, HALF);
const SECOND_ROW = ALL_TECH.slice(HALF);

/** Capabilities ticker plus two opposing marquees of every tool we use. */
export function Toolbelt() {
  return (
    <section aria-labelledby="toolbelt-title" className="relative isolate overflow-x-clip py-24 sm:py-28 lg:pt-32 lg:pb-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        <div className="absolute left-1/2 top-[55%] aspect-square w-[min(1100px,140vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,82,110,0.28),transparent_62%)]" />
      </div>
      <Container>
        <SectionHeading layout="split" eyebrow={TOOLBELT.eyebrow} id="toolbelt-title" title={TOOLBELT.title} description={TOOLBELT.description} />
      </Container>
      <Reveal className="mt-16 sm:mt-20" amount={0.1}>
        <Marquee duration={80} gap="2.75rem" label="Capabilities" className="py-2">
          <ul role="list" className="contents">
            {CAPABILITIES.map((capability, i) => (
              <li
                key={capability}
                className={cn(
                  'flex items-center gap-11 whitespace-nowrap text-[clamp(1.9rem,4.6vw,3.6rem)] font-semibold leading-[1.1] tracking-[-0.045em]',
                  i % 2 ? 'text-transparent [-webkit-text-stroke:1px_rgb(234_240_245/0.55)]' : 'text-ink-50',
                )}
              >
                {capability}
                <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45 rounded-[2px] bg-sage-300/70" />
              </li>
            ))}
          </ul>
        </Marquee>
      </Reveal>
      <Reveal className="mt-12 grid gap-3 sm:mt-14 sm:gap-4" amount={0.1} delay={0.1}>
        <Marquee duration={92} repeat={2} gap="0.75rem" label="Toolbelt, first row">
          <ToolRow tools={FIRST_ROW} />
        </Marquee>
        <Marquee duration={104} repeat={2} gap="0.75rem" reverse label="Toolbelt, second row">
          <ToolRow tools={SECOND_ROW} />
        </Marquee>
      </Reveal>
      <Container className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
          <span>
            <span className="text-sage-300 nums">{ALL_TECH.length}</span> tools in the belt
          </span>
          <span className="max-sm:hidden">Frontend · Backend · Cloud · Automation · BI</span>
        </div>
      </Container>
    </section>
  );
}

function ToolRow({ tools }) {
  return (
    <ul role="list" className="contents">
      {tools.map((tech) => (
        <li key={tech.name} className="flex">
          <TechChip tech={tech} size="lg" className="bg-ink-850/80" />
        </li>
      ))}
    </ul>
  );
}
