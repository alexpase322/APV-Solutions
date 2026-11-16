import { CheckIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { STATS, VALUES } from '../lib/site';
import { TextLink } from '../ui/Button';
import { Container, Eyebrow, Glow, Reveal, Section, SplitText, Stagger, StaggerItem } from '../ui/primitives';
import { StatCard } from './who-we-are/StatCard';

/** Home "Who we are": positioning, the four values and the animated stat tiles. */
export default function WhoWeAreSection() {
  return (
    <Section aria-labelledby="about-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <Glow className="right-[-10%] top-1/2 size-[680px] -translate-y-1/2" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_45%_50%_at_75%_50%,#000_15%,transparent_75%)]" />
      </div>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6 xl:col-span-5">
            <Reveal className="mb-6">
              <Eyebrow>Who we are</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              id="about-title"
              text="More than just developers, we are your *strategic partners*"
              className="text-[clamp(2.1rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-200 sm:text-lg">
                At APV Business Solutions, we understand that technology is not just about writing code — it&apos;s about solving real
                business problems.
              </p>
            </Reveal>
            <Stagger as="ul" gap={0.09} className="mt-10 border-t border-white/[0.07]">
              {VALUES.map((value, i) => (
                <StaggerItem key={value} as="li" className="group/pillar flex items-center gap-4 border-b border-white/[0.07] py-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-sage-300/25 bg-sage-300/[0.08] text-sage-300 transition-colors duration-300 group-hover/pillar:bg-sage-300 group-hover/pillar:text-ink-950">
                    <CheckIcon weight="bold" className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-[17px] font-medium tracking-[-0.02em] text-ink-50">{value}</span>
                  <span className="nums ml-auto font-mono text-[11px] tracking-[0.18em] text-ink-200">{pad(i + 1)}</span>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.1} className="mt-7">
              <TextLink to="/#team" className="min-h-11">
                Meet the team
              </TextLink>
            </Reveal>
          </div>
          <div className="lg:col-span-6 xl:col-span-7">
            <Stagger as="ul" gap={0.1} className="grid grid-cols-2 gap-3 sm:gap-4 lg:pb-10">
              {STATS.map((stat, i) => (
                <StaggerItem key={stat.label} as="li" className={cn(i % 2 === 1 && 'lg:translate-y-10')}>
                  <StatCard index={i} value={stat.value} suffix={stat.suffix} label={stat.label} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </Container>
    </Section>
  );
}
