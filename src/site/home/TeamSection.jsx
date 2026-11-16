import { TeamGrid } from '../ui/TeamGrid';
import { Container, Section, SectionHeading } from '../ui/primitives';

/** Home "Meet our team" (`#team`): split heading and the co-founder cards. */
export default function TeamSection() {
  return (
    <Section id="team" aria-labelledby="team-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-1/2 top-0 h-[560px] w-full max-w-[1100px] -translate-x-1/2 bg-dots opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_15%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="team-title"
          layout="split"
          eyebrow="The minds behind APV"
          title="Meet our *team*"
          description="A founder-led team: hands-on engineering paired with financial, administrative and Power BI expertise."
        />
        <TeamGrid className="mt-14 sm:mt-16" />
      </Container>
    </Section>
  );
}
