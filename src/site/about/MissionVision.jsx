import { GlobeHemisphereWestIcon, StrategyIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { SpotlightCard } from '../ui/Cards';
import { Container, IconTile, Reveal, Section, Tag } from '../ui/primitives';
import { MISSION, VISION } from './content';
import { MissionArt } from './MissionArt';
import { VisionArt } from './VisionArt';

/** Mission and vision as two offset spotlight cards, each with its own animated art. */
export function MissionVision() {
  return (
    <Section id="mission-vision" aria-labelledby="mission-vision-title" className="pt-8 sm:pt-10 lg:pt-12">
      <Container>
        <h2 id="mission-vision-title" className="sr-only">
          Mission and vision
        </h2>
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-11">
            <PurposeCard
              id="mission-title"
              index="01"
              kicker="Purpose"
              titleLead="Our"
              titleAccent="mission"
              icon={<StrategyIcon weight="duotone" className="size-7" />}
              art={<MissionArt />}
              tags={MISSION.pillars.map((pillar) => pillar.verb)}
            >
              <p className="text-lg font-medium leading-snug tracking-[-0.015em] text-ink-50 sm:text-xl">{MISSION.belief}</p>
            </PurposeCard>
          </Reveal>
          <Reveal className="lg:col-span-11 lg:col-start-2">
            <PurposeCard
              id="vision-title"
              index="02"
              kicker="Direction"
              titleLead="Our"
              titleAccent="vision"
              icon={<GlobeHemisphereWestIcon weight="duotone" className="size-7" />}
              art={<VisionArt />}
              tags={['US', 'LATAM']}
              mirrored
            >
              <p className="text-base leading-relaxed text-ink-200 sm:text-lg">{VISION.lead}</p>
              <p className="mt-4 text-lg font-medium leading-snug tracking-[-0.015em] text-ink-50 sm:text-xl">{VISION.close}</p>
            </PurposeCard>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function PurposeCard({ id, index, kicker, titleLead, titleAccent, icon, art, tags, mirrored = false, children }) {
  return (
    <SpotlightCard as="article" aria-labelledby={id} className="overflow-hidden">
      <div className="grid md:grid-cols-12">
        <div className="relative flex flex-col p-7 sm:p-10 md:col-span-7 lg:p-14">
          <div className="flex items-center justify-between gap-4">
            <IconTile size="lg">{icon}</IconTile>
            <span className="nums font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
              {index}
              {' / '}
              {kicker}
            </span>
          </div>
          <h3 id={id} className="mt-10 text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1] tracking-[-0.04em] text-ink-50 sm:mt-14">
            {titleLead} <span className="text-sage-300">{titleAccent}</span>
          </h3>
          <div className="mt-6 max-w-[54ch]">{children}</div>
          <div className="mt-auto flex flex-wrap gap-2 pt-10">
            {tags.map((tag) => (
              <Tag key={tag} tone="sage">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        <div
          className={cn(
            'relative border-t border-white/[0.06] md:col-span-5 md:border-t-0',
            mirrored ? 'md:order-first md:border-r' : 'md:border-l',
          )}
        >
          {art}
        </div>
      </div>
    </SpotlightCard>
  );
}
