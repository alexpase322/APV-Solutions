import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion';
import { Container, Eyebrow, Glow, GridBeams, PulseDot, SplitText } from '../ui/primitives';
import { DOC_KEYS, UI, docTitle, getDocMeta, getLegalDoc } from './legalDocs';
import { CopyLinkButton, DocSwitch, LangSwitch } from './LegalControls';

const rise = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE_OUT_EXPO, delay },
});

/** Title, reading stats, document/language switches and the document's meta grid. */
export function LegalHero({ prepared }) {
  const { doc, lang } = prepared;
  const ui = UI[lang];
  const meta = getDocMeta(doc, lang);

  return (
    <section aria-labelledby="legal-title" className="relative isolate overflow-hidden pb-14 pt-32 sm:pt-36 lg:pb-20 lg:pt-40">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <GridBeams className="opacity-60" />
        <Glow className="-left-48 -top-56 size-[720px] opacity-70" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
      </div>
      <Container>
        <motion.div {...rise(0.1)}>
          <Eyebrow>{ui.eyebrow}</Eyebrow>
        </motion.div>
        <div className="mt-6 max-sm:min-h-[2.15em] max-sm:text-[2.6rem] sm:mt-7">
          <SplitText
            key={`${doc}-${lang}`}
            as="h1"
            id="legal-title"
            immediate
            delay={0.12}
            gap={0.06}
            text={prepared.title}
            className="text-[clamp(2.6rem,6vw,5.5rem)] font-semibold leading-[1] tracking-[-0.045em] text-ink-50"
          />
        </div>

        <div className="mt-8 grid gap-12 lg:mt-10 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <motion.p
              {...rise(0.3)}
              className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200"
            >
              <span className="nums">{ui.sections(prepared.toc.length)}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-ink-400" />
              <span className="nums">{ui.readTime(prepared.minutes)}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-ink-400 max-sm:hidden" />
              <span className="max-sm:w-full">{prepared.subtitle}</span>
            </motion.p>

            <motion.div {...rise(0.4)} className="mt-6 flex flex-wrap items-center gap-3">
              <DocSwitch className="w-full sm:w-auto" />
              <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
                <LangSwitch className="shrink-0" />
                <CopyLinkButton className="flex-1 justify-center sm:flex-none" />
              </div>
            </motion.div>

            <motion.dl
              {...rise(0.5)}
              className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] xl:grid-cols-3"
            >
              <MetaItem label={meta.companyLabel} className="col-span-2 xl:col-span-3">
                <span className="text-ink-50">
                  <CompanyName text={meta.company} />
                </span>
              </MetaItem>
              <MetaItem label={meta.effectiveLabel}>
                <span className="nums text-ink-50">{meta.effective}</span>
                <span className="mt-1.5 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-gold-300">
                  <PulseDot tone="gold" size="sm" />
                  {ui.inEffect}
                </span>
              </MetaItem>
              <MetaItem label={meta.updatedLabel}>
                <span className="nums text-ink-50">{meta.updated}</span>
              </MetaItem>
              <MetaItem label={meta.contactLabel} className="col-span-2 xl:col-span-1">
                <a
                  href={`mailto:${meta.contact}`}
                  className="group/mail -my-2 inline-flex min-h-11 items-center gap-2 self-start [overflow-wrap:anywhere] font-medium text-sage-300 transition-colors hover:text-sage-200"
                >
                  <EnvelopeSimpleIcon weight="bold" className="size-4 shrink-0" aria-hidden="true" />
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out-expo group-hover/mail:bg-[length:100%_1px]">
                    {meta.contact}
                  </span>
                </a>
              </MetaItem>
            </motion.dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.35 }}
            className="hidden items-center justify-center lg:col-span-4 lg:flex"
          >
            <DocStack doc={doc} lang={lang} className="lg:max-xl:scale-[0.82]" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/** Keeps "(EIN: …)" on one line. */
function CompanyName({ text }) {
  return text
    .split(/(\(EIN:[^)]*\))/)
    .map((part, i) => (i % 2 === 1 ? <span key={i} className="whitespace-nowrap">{part}</span> : part));
}

function MetaItem({ label, children, className }) {
  return (
    <div className={cn('bg-ink-900/90 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5', className)}>
      <dt className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-ink-200">{label}</dt>
      <dd className="mt-2 flex flex-col text-[15px] leading-snug">{children}</dd>
    </div>
  );
}

const FRONT = { x: 0, y: 34, rotate: -3, scale: 1, opacity: 1 };
const BACK = { x: 78, y: 0, rotate: 5, scale: 0.9, opacity: 0.5 };
/** Widths (%) of the placeholder text lines on each card; 0 is a paragraph gap. */
const CARD_LINES = {
  terms: [92, 100, 86, 64, 0, 96, 100, 78, 0, 88, 52],
  privacy: [100, 90, 96, 58, 0, 84, 100, 94, 70, 0, 66],
};

/** Two stacked document cards; the open one slides to the front. */
function DocStack({ doc: currentDoc, lang, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const ui = UI[lang];

  return (
    <div ref={ref} aria-hidden="true" className={cn('relative h-[360px] w-[360px] shrink-0 select-none', className)}>
      <div className="absolute inset-0 animate-float-slow">
        {DOC_KEYS.map((doc) => {
          const front = doc === currentDoc;
          const { toc } = getLegalDoc(doc, lang);
          return (
            <motion.div
              key={doc}
              initial={false}
              animate={front ? FRONT : BACK}
              transition={SPRING_SOFT}
              style={{ zIndex: front ? 2 : 1 }}
              className="surface absolute left-0 top-0 h-[300px] w-[270px] overflow-hidden rounded-3xl p-5 will-change-transform"
            >
              <div className="absolute inset-0 bg-grid-sm opacity-40 mask-fade-b" />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-sage-300">
                  § {doc === 'terms' ? 'TOS' : 'Privacy'} · {lang}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">
                  <PulseDot tone="gold" size="sm" />
                  {ui.inEffect}
                </span>
              </div>
              <p className="relative mt-6 text-[1.35rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink-50">{docTitle(doc, lang)}</p>
              <div className="relative mt-5 space-y-2">
                {CARD_LINES[doc].map((width, i) =>
                  width === 0 ? (
                    <div key={i} className="h-2" />
                  ) : (
                    <div
                      key={i}
                      style={{ width: `${width}%` }}
                      className={cn('h-1.5 rounded-full', i === 0 ? 'bg-sage-300/35' : 'bg-white/[0.08]', front && i === 5 && 'shimmer')}
                    />
                  ),
                )}
              </div>
              <div className="absolute inset-x-5 bottom-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">
                <span className="nums">{ui.sections(toc.length)}</span>
                <span className="nums">{getDocMeta(doc, lang).effective}</span>
              </div>
              {front && !reduce && inView && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-sage-300/[0.07] to-transparent"
                  initial={{ y: -64 }}
                  animate={{ y: 300 }}
                  transition={{ duration: 4.2, ease: 'linear', repeat: Infinity, repeatDelay: 1.4 }}
                />
              )}
            </motion.div>
          );
        })}
        <Seal className="absolute bottom-0 right-4 z-[3]" spinning={inView && !reduce} />
      </div>
    </div>
  );
}

const SEAL_TEXT_LENGTH = 2 * Math.PI * 40;

/** Round "§" seal with the company name running around it. */
function Seal({ className, spinning }) {
  return (
    <div className={cn('glass grid size-[112px] place-items-center rounded-full', className)}>
      <svg viewBox="-56 -56 112 112" className={cn('absolute inset-0 size-full', spinning && 'animate-spin-slower')}>
        <defs>
          <path id="legal-seal-path" d="M 0,-40 a 40,40 0 1,1 0,80 a 40,40 0 1,1 0,-80" />
        </defs>
        <circle r={48} fill="none" stroke="rgba(180,198,143,0.22)" strokeDasharray="1 5" />
        <text className="fill-sage-300/80 font-mono" style={{ fontSize: 8.4, letterSpacing: 0 }}>
          <textPath href="#legal-seal-path" textLength={SEAL_TEXT_LENGTH - 2} lengthAdjust="spacing">
            {'APV BUSINESS SOLUTIONS LLC · FLORIDA · '}
          </textPath>
        </text>
      </svg>
      <span className="relative grid size-12 place-items-center rounded-full border border-sage-300/30 bg-sage-300/[0.08] font-mono text-lg font-semibold text-sage-300">
        §
      </span>
    </div>
  );
}
