import { useId } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { AskAILink } from '../assistant/AskAI';
import { Aurora, Container, DotField, Eyebrow, GridBeams, Orbits, Reveal, SplitText } from './primitives';

/** Top-of-page hero for inner pages: eyebrow, split h1, lead, actions and an optional visual on the right. */
export function PageHero({ eyebrow, title, description, actions, aside, footnote, background = 'dots', className, titleId, titleClassName }) {
  const reactId = useId();
  const headingId = titleId ?? `hero-${reactId.replace(/:/g, '')}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn('relative isolate overflow-hidden pb-20 pt-36 sm:pt-40 lg:min-h-[88dvh] lg:pb-28 lg:pt-44', className)}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Aurora variant="subtle" />
        {background === 'dots' ? (
          <DotField className="opacity-80 [mask-image:radial-gradient(ellipse_80%_70%_at_70%_40%,#000_35%,transparent_75%)]" />
        ) : (
          <GridBeams />
        )}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
      </div>
      <Container>
        <div className={cn('grid grid-cols-1 items-center gap-14', aside && 'lg:grid-cols-12 lg:gap-10')}>
          <div className={cn('min-w-0', aside ? 'lg:col-span-6' : 'max-w-4xl')}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.15 }}
              className="mb-7"
            >
              <Eyebrow>{eyebrow}</Eyebrow>
            </motion.div>
            <SplitText
              as="h1"
              id={headingId}
              immediate
              delay={0.25}
              text={title}
              className={cn('text-[clamp(2.6rem,6.2vw,5.5rem)] font-semibold leading-[0.97] tracking-[-0.045em] text-ink-50', titleClassName)}
            />
            {description && (
              <motion.div
                initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.55 }}
                className="mt-7 max-w-[56ch] text-lg leading-relaxed text-ink-200"
              >
                {description}
              </motion.div>
            )}
            {actions && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.7 }}
                className="mt-10 flex flex-wrap items-center gap-3"
              >
                {actions}
              </motion.div>
            )}
            {footnote && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.9 }} className="mt-6 text-sm text-ink-200">
                {footnote}
              </motion.div>
            )}
          </div>
          {aside && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.45 }}
              className="lg:col-span-6"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </Container>
    </section>
  );
}

/** Closing call-to-action card with orbits and a warm aurora. */
export function CtaBand({ eyebrow = 'Get in touch', title, description, actions, className, titleId }) {
  const reactId = useId();
  const headingId = titleId ?? `cta-${reactId.replace(/:/g, '')}`;

  return (
    <section aria-labelledby={headingId} className={cn('relative py-24 sm:py-28 lg:py-32', className)}>
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-5xl border border-white/[0.07] bg-ink-850 px-6 py-20 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:px-12 sm:py-24 lg:px-20 lg:py-28">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <Aurora variant="warm" />
            <div className="absolute inset-0 bg-grid-sm opacity-60 mask-radial" />
            <Orbits className="opacity-90 [mask-image:radial-gradient(circle_at_center,transparent_18%,#000_45%,transparent_78%)]" />
          </div>
          <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
            <Eyebrow>{eyebrow}</Eyebrow>
            <SplitText
              as="h2"
              id={headingId}
              text={title}
              className="mt-7 text-[clamp(2.2rem,5vw,4.25rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink-50"
            />
            {description && <p className="mt-6 max-w-[52ch] text-base leading-relaxed text-ink-200 sm:text-lg">{description}</p>}
            <div className="mt-10 flex flex-wrap justify-center gap-3">{actions}</div>
            <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-[15px] text-ink-200">
              <span>Quick question first?</span>
              <AskAILink>Ask our AI assistant</AskAILink>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
