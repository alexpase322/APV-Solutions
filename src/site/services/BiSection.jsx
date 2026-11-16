import { ChartPieSliceIcon, PulseIcon, TrendUpIcon } from '@phosphor-icons/react';
import { AskAILink } from '../assistant/AskAI';
import { cn } from '../lib/cn';
import { CONTACT_PATH } from '../lib/site';
import { TextLink } from '../ui/Button';
import { Eyebrow, IconTile, Reveal, SplitText, Stagger, StaggerItem, Tag } from '../ui/primitives';
import { BI } from './content';
import { KpiDashboard } from './KpiDashboard';
import { Halo, ScrollTilt, ServiceSection } from './ServiceSection';
import { MONO_LABEL, SERVICE_BODY, SERVICE_TITLE } from './styles';

const CAPABILITY_ICONS = [PulseIcon, ChartPieSliceIcon, TrendUpIcon];

export function BiSection({ sectionRef }) {
  const titleId = `${BI.id}-title`;
  return (
    <ServiceSection
      id={BI.id}
      index={BI.index}
      labelledBy={titleId}
      sectionRef={sectionRef}
      backdrop={
        <div className="absolute inset-y-0 right-0 w-full bg-grid opacity-70 [mask-image:radial-gradient(ellipse_50%_60%_at_70%_50%,#000_15%,transparent_72%)] lg:w-2/3" />
      }
      copy={<BiCopy titleId={titleId} />}
      visual={
        <div className="relative lg:pl-6">
          <Halo className="-inset-x-10 -inset-y-16" />
          <ScrollTilt>
            <KpiDashboard />
          </ScrollTilt>
        </div>
      }
    />
  );
}

function BiCopy({ titleId }) {
  return (
    <>
      <Reveal className="mb-6">
        <Eyebrow index={BI.index}>{BI.eyebrow}</Eyebrow>
      </Reveal>
      <SplitText as="h2" id={titleId} text={BI.title} className={SERVICE_TITLE} />
      <Reveal as="p" delay={0.1} className={cn(SERVICE_BODY, 'mt-6')}>
        {BI.body}
      </Reveal>
      <Stagger as="ul" gap={0.08} className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
        {BI.capabilities.map((capability, i) => {
          const Icon = CAPABILITY_ICONS[i];
          return (
            <StaggerItem key={capability} as="li" className="flex items-center gap-4 py-4">
              <IconTile size="sm">
                <Icon weight="duotone" className="size-5" />
              </IconTile>
              <span className="text-base font-medium tracking-[-0.01em] text-ink-50">{capability}</span>
            </StaggerItem>
          );
        })}
      </Stagger>
      <div className="mt-9">
        <h3 className={cn(MONO_LABEL, 'mb-4 font-normal')}>Tools we use</h3>
        <Stagger as="ul" gap={0.06} className="flex flex-wrap gap-2">
          {BI.tools.map((tool) => (
            <StaggerItem key={tool} as="li">
              <Tag className="px-3 py-1.5 text-[12px]">
                <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-sage-300" />
                {tool}
              </Tag>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-1" delay={0.05}>
        <TextLink to={CONTACT_PATH} className="min-h-11">
          Talk to our Power BI specialist
        </TextLink>
        <AskAILink chip="bi">Ask AI about dashboards</AskAILink>
      </Reveal>
    </>
  );
}
