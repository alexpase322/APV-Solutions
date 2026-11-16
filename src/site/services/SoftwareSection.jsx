import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { CheckIcon, CloudArrowUpIcon, TreeStructureIcon } from '@phosphor-icons/react';
import { AskAILink } from '../assistant/AskAI';
import { cn } from '../lib/cn';
import { CONTACT_PATH } from '../lib/site';
import { TextLink } from '../ui/Button';
import { SpotlightCard } from '../ui/Cards';
import { Eyebrow, IconTile, Reveal, SplitText, Stagger, StaggerItem } from '../ui/primitives';
import { TechChip } from '../ui/TechLogo';
import { CodeEditor } from './CodeEditor';
import { SOFTWARE, findTech } from './content';
import { Halo, ScrollTilt, ServiceSection } from './ServiceSection';
import { MONO_LABEL, SERVICE_BODY, SERVICE_TITLE } from './styles';

const FEATURE_ICONS = [TreeStructureIcon, CloudArrowUpIcon];

/** Tech chips floating around the editor (lg+), each with its own parallax depth and float phase. */
const FLOATING_TECH = [
  { tech: findTech('Spring Boot'), className: '-left-4 top-[9%] xl:-left-12', depth: 70, delay: 0 },
  { tech: findTech('Google Cloud'), className: '-right-3 -top-5 xl:-right-8', depth: 110, delay: 1.4 },
  { tech: findTech('AWS'), className: '-right-4 top-[38%] xl:-right-9', depth: 45, delay: 2.6 },
  { tech: findTech('Python'), className: '-left-6 top-[52%] xl:-left-14', depth: 95, delay: 0.8 },
  { tech: findTech('React'), className: 'left-[12%] -bottom-7', depth: 60, delay: 2 },
  { tech: findTech('TailwindCSS'), className: 'right-[10%] -bottom-9', depth: 120, delay: 3.2 },
];

export function SoftwareSection({ sectionRef }) {
  const titleId = `${SOFTWARE.id}-title`;
  return (
    <ServiceSection
      id={SOFTWARE.id}
      index={SOFTWARE.index}
      labelledBy={titleId}
      sectionRef={sectionRef}
      backdrop={
        <div className="absolute inset-y-0 right-0 w-full bg-grid-sm opacity-60 [mask-image:radial-gradient(ellipse_55%_60%_at_72%_50%,#000_20%,transparent_75%)] lg:w-2/3" />
      }
      copy={<SoftwareCopy titleId={titleId} />}
      visual={<SoftwareVisual />}
    />
  );
}

function SoftwareCopy({ titleId }) {
  return (
    <>
      <Reveal className="mb-6">
        <Eyebrow index={SOFTWARE.index}>{SOFTWARE.eyebrow}</Eyebrow>
      </Reveal>
      <SplitText as="h2" id={titleId} text={SOFTWARE.title} className={SERVICE_TITLE} />
      <Reveal as="p" delay={0.1} className={cn(SERVICE_BODY, 'mt-6')}>
        {SOFTWARE.body}
      </Reveal>
      <Stagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2" gap={0.1}>
        {SOFTWARE.features.map((feature, i) => {
          const Icon = FEATURE_ICONS[i];
          return (
            <StaggerItem key={feature.title}>
              <SpotlightCard as="article" className="h-full rounded-3xl p-5 sm:p-6">
                <IconTile size="sm">
                  <Icon weight="duotone" className="size-5" />
                </IconTile>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-ink-50">{feature.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink-200">{feature.text}</p>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>
      <div className="mt-9 border-t border-white/[0.06] pt-8">
        <p className={cn(MONO_LABEL, 'mb-5')}>Also in scope</p>
        <Checklist items={SOFTWARE.checklist} />
      </div>
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-1" delay={0.1}>
        <TextLink to={CONTACT_PATH} className="min-h-11">
          Start a software project
        </TextLink>
        <AskAILink chip="software">Ask AI about custom software</AskAILink>
      </Reveal>
    </>
  );
}

function Checklist({ items }) {
  return (
    <Stagger as="ul" gap={0.08} className="grid gap-3">
      {items.map((item) => (
        <StaggerItem key={item} as="li" className="flex items-center gap-3 text-[15px] text-ink-100 sm:text-base">
          <span
            aria-hidden="true"
            className="grid size-6 shrink-0 place-items-center rounded-lg border border-sage-300/25 bg-sage-300/[0.1] text-sage-300"
          >
            <CheckIcon weight="bold" className="size-3.5" />
          </span>
          {item}
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function SoftwareVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return (
    <div ref={ref} className="relative lg:pl-6">
      <Halo className="-inset-x-10 -inset-y-16" />
      <ScrollTilt>
        <CodeEditor />
      </ScrollTilt>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        {FLOATING_TECH.map((chip) => (
          <FloatingTech key={chip.tech.name} {...chip} progress={scrollYProgress} />
        ))}
      </div>
    </div>
  );
}

function FloatingTech({ tech, className, depth, delay, progress }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [depth, -depth]);
  return (
    <motion.div style={reduce ? undefined : { y }} className={cn('absolute', className)}>
      <div className="animate-float" style={{ animationDelay: `${delay}s` }}>
        <div className="glass rounded-2xl">
          <TechChip size="sm" tech={tech} className="border-transparent bg-transparent text-ink-100" />
        </div>
      </div>
    </motion.div>
  );
}
