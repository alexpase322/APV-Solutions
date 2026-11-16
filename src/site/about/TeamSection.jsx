import { SITE } from '../lib/site';
import { Container, Reveal, Section, SectionHeading } from '../ui/primitives';
import { StatsGrid, TeamGrid } from '../ui/TeamGrid';
import { TEAM_HEADING } from './content';

export function TeamSection() {
  return (
    <Section id="team" aria-labelledby="team-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[600px] w-full max-w-[1100px] -translate-x-1/2 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_15%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="team-title"
          layout="split"
          eyebrow={TEAM_HEADING.eyebrow}
          title={TEAM_HEADING.title}
          description={TEAM_HEADING.description}
        />
        <TeamGrid className="mt-14 sm:mt-16" />
        <div className="mt-20 sm:mt-24">
          <Reveal className="mb-6 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            <span>By the numbers</span>
            <span className="hidden sm:inline">
              {SITE.name}
              {' · '}
              {SITE.region}
            </span>
          </Reveal>
          <StatsGrid variant="inline" />
        </div>
      </Container>
    </Section>
  );
}
