import { ChartLineUpIcon, CheckIcon, CodeIcon, FlowArrowIcon } from '@phosphor-icons/react';
import { AskAIButton } from '../assistant/AskAI';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { PRACTICES } from '../lib/site';
import { TextLink } from '../ui/Button';
import { SpotlightCard } from '../ui/Cards';
import { Container, IconTile, Reveal, Section, SectionHeading } from '../ui/primitives';
import { CapabilitiesCard } from './expertise/CapabilitiesCard';
import { CodeEditorMock } from './expertise/CodeEditorMock';
import { RevenueChartMock } from './expertise/RevenueChartMock';
import { WorkflowMock } from './expertise/WorkflowMock';

const practice = (id) => PRACTICES.find((item) => item.id === id);

/** Home "Our expertise": one card per practice with a live mockup, plus the capabilities card. */
export default function ExpertiseSection() {
  return (
    <Section id="services" aria-labelledby="services-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[720px] bg-grid opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_30%_0%,#000_20%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="services-title"
          layout="split"
          eyebrow="Our expertise"
          title="Comprehensive solutions for *modern businesses*"
          description="We combine technical expertise with strategic thinking to deliver solutions that drive real growth."
          actions={<AskAIButton>Not sure which fits? Ask AI</AskAIButton>}
        />
        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-12 lg:gap-6">
          <Reveal className="lg:col-span-7">
            <ServiceCard service={practice('software')} icon={CodeIcon} mock={<CodeEditorMock />} tall />
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.08}>
            <ServiceCard service={practice('automation')} icon={FlowArrowIcon} mock={<WorkflowMock />} />
          </Reveal>
          <Reveal className="lg:col-span-5">
            <ServiceCard service={practice('bi')} icon={ChartLineUpIcon} mock={<RevenueChartMock />} />
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.08}>
            <CapabilitiesCard />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function ServiceCard({ service, icon: Icon, mock, tall = false }) {
  const titleId = `service-${service.id}-title`;
  return (
    <SpotlightCard as="article" aria-labelledby={titleId} className="flex h-full flex-col p-2.5 sm:p-3">
      <div aria-hidden="true" className={cn('flex flex-1 flex-col', tall && 'lg:min-h-[400px]')}>
        {mock}
      </div>
      <div className="px-3.5 pb-4 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <div className="flex items-center justify-between gap-4">
          <IconTile size="sm">
            <Icon weight="duotone" className="size-5" />
          </IconTile>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">
            {service.index} / {pad(PRACTICES.length)}
          </span>
        </div>
        <h3 id={titleId} className="mt-6 text-2xl font-semibold leading-[1.1] tracking-[-0.035em] text-ink-50 sm:text-[1.75rem]">
          {service.title}
        </h3>
        <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-ink-200 sm:text-base">{service.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {service.bullets.map((bullet) => (
            <li
              key={bullet}
              className="inline-flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[13px] font-medium text-ink-100"
            >
              <CheckIcon weight="bold" className="size-3.5 text-sage-300" aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
        <TextLink to={`/services#${service.id}`} className="mt-6 min-h-11">
          Learn more
          <span className="sr-only">
            {' about '}
            {service.title}
          </span>
        </TextLink>
      </div>
    </SpotlightCard>
  );
}
