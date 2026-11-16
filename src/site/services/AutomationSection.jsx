import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { AskAILink } from '../assistant/AskAI';
import { cn } from '../lib/cn';
import { TextLink } from '../ui/Button';
import { Eyebrow, Reveal, SplitText, Stagger, StaggerItem } from '../ui/primitives';
import { TechChip } from '../ui/TechLogo';
import { AUTOMATION, findTech } from './content';
import { Halo, ScrollTilt, ServiceSection } from './ServiceSection';
import { MONO_LABEL, SERVICE_BODY, SERVICE_TITLE } from './styles';
import { WorkflowDemo } from './WorkflowDemo';

const AUTOMATION_TOOLS = AUTOMATION.tools.map((name) => findTech(name));

export function AutomationSection({ sectionRef }) {
  const titleId = `${AUTOMATION.id}-title`;
  return (
    <ServiceSection
      id={AUTOMATION.id}
      index={AUTOMATION.index}
      labelledBy={titleId}
      sectionRef={sectionRef}
      reverse
      backdrop={
        <div className="absolute inset-0 bg-dots opacity-70 [mask-image:radial-gradient(ellipse_50%_55%_at_30%_55%,#000_15%,transparent_72%)]" />
      }
      copy={<AutomationCopy titleId={titleId} />}
      visual={
        <div className="relative lg:pr-6">
          <Halo className="-inset-x-12 -inset-y-16" />
          <ScrollTilt>
            <WorkflowDemo />
          </ScrollTilt>
        </div>
      }
    />
  );
}

function AutomationCopy({ titleId }) {
  return (
    <>
      <Reveal className="mb-6">
        <Eyebrow index={AUTOMATION.index}>{AUTOMATION.eyebrow}</Eyebrow>
      </Reveal>
      <SplitText as="h2" id={titleId} text={AUTOMATION.title} className={SERVICE_TITLE} />
      <Reveal as="p" delay={0.1} className={cn(SERVICE_BODY, 'mt-6')}>
        {AUTOMATION.body}
      </Reveal>
      <ProcessSteps />
      <Reveal className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-1" delay={0.05}>
        <TextLink to={AUTOMATION.link.to} className="min-h-11">
          {AUTOMATION.link.label}
        </TextLink>
        <AskAILink chip="automation">Ask AI about automation</AskAILink>
      </Reveal>
      <div className="mt-10 border-t border-white/[0.06] pt-8">
        <p className={cn(MONO_LABEL, 'mb-5')}>Tools we automate with</p>
        <Stagger as="ul" gap={0.06} className="flex flex-wrap gap-2.5">
          {AUTOMATION_TOOLS.map((tech) => (
            <StaggerItem key={tech.name} as="li">
              <TechChip tech={tech} size="sm" />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </>
  );
}

/** Numbered steps joined by a rail that fills as the list scrolls through the viewport. */
function ProcessSteps() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 55%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  const { steps } = AUTOMATION;

  return (
    <ol ref={ref} className="relative mt-10 grid gap-7">
      {steps.map((step, i) => (
        <Reveal key={step.n} as="li" delay={i * 0.1} className="relative flex gap-5">
          {i < steps.length - 1 && (
            <span aria-hidden="true" className="absolute -bottom-7 left-[21.5px] top-11 w-px bg-white/[0.08]">
              <motion.span
                style={reduce ? undefined : { scaleY: fill }}
                className="absolute inset-0 origin-top bg-gradient-to-b from-sage-300 to-sage-300/40"
              />
            </span>
          )}
          <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-sage-300/30 bg-ink-900 font-mono text-sm font-medium text-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <span className="sr-only">{'Step '}</span>
            {step.n}
          </span>
          <div className="pt-1.5">
            <h3 className="text-lg font-semibold tracking-[-0.02em] text-ink-50">{step.title}</h3>
            <p className="mt-1.5 max-w-[46ch] text-[15px] leading-relaxed text-ink-200 sm:text-base">{step.text}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
