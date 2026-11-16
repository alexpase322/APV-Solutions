import { Fragment, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { cn } from '../lib/cn';
import { Container, Eyebrow, Glow, Reveal } from '../ui/primitives';
import { MISSION } from './content';

const DIM = '#5d7186';
const LIT = '#eaf0f5';
const ACCENT = '#b4c68f';

const WORDS = MISSION.statement.split(' ');
const ACCENT_WORDS = new Set(MISSION.accentWords);
const isAccent = (word) => ACCENT_WORDS.has(word.replace(/[^\p{L}]/gu, '').toLowerCase());

/** The mission statement, lit word by word as it scrolls through the viewport. */
export function MissionStatement() {
  const textRef = useRef(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: textRef, offset: ['start 0.85', 'end 0.5'] });
  const count = WORDS.length;

  return (
    <section id="mission" aria-labelledby="mission-scrub-label" className="relative isolate overflow-hidden py-28 sm:py-36 lg:py-44">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <Glow className="-left-[12%] top-1/2 size-[640px] -translate-y-1/2 opacity-70" />
        <div className="absolute inset-0 bg-dots opacity-40 [mask-image:radial-gradient(ellipse_50%_60%_at_28%_50%,#000_10%,transparent_75%)]" />
      </div>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="flex items-center gap-5 lg:col-span-3 lg:flex-col lg:items-start lg:gap-8 lg:pt-4">
            <Eyebrow id="mission-scrub-label">{MISSION.label}</Eyebrow>
            <div aria-hidden="true" className="relative h-px flex-1 overflow-hidden bg-white/10 lg:h-44 lg:w-px lg:flex-none">
              <motion.div style={{ scaleX: reduce ? 1 : scrollYProgress }} className="absolute inset-0 origin-left bg-sage-300 lg:hidden" />
              <motion.div style={{ scaleY: reduce ? 1 : scrollYProgress }} className="absolute inset-0 hidden origin-top bg-sage-300 lg:block" />
            </div>
          </div>
          <div ref={textRef} className="lg:col-span-9">
            <p className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-50">
              <span className="sr-only">{MISSION.statement}</span>
              <span aria-hidden="true">
                {WORDS.map((word, i) => (
                  <Fragment key={i}>
                    {reduce ? (
                      <span className={cn(isAccent(word) && 'text-sage-300')}>{word}</span>
                    ) : (
                      <ScrubWord progress={scrollYProgress} range={[i / count, (i + 1) / count]} accent={isAccent(word)}>
                        {word}
                      </ScrubWord>
                    )}
                    {i < count - 1 ? ' ' : null}
                  </Fragment>
                ))}
              </span>
            </p>
            <Reveal className="mt-10 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200 sm:mt-12">
              <span aria-hidden="true" className="h-px w-10 bg-sage-300/60" />
              APV Business Solutions
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** One word that fades from dim to lit (or sage) while `progress` crosses its `range`. */
function ScrubWord({ progress, range, accent, children }) {
  const color = useTransform(progress, range, [DIM, accent ? ACCENT : LIT]);
  return <motion.span style={{ color }}>{children}</motion.span>;
}
