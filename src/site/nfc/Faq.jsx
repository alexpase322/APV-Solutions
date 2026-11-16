import { useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { ChatCircleTextIcon, PlusIcon } from '@phosphor-icons/react';
import { AskAILink } from '../assistant/AskAI';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { SITE } from '../lib/site';
import { TextLink } from '../ui/Button';
import { Container, Reveal, Section, SectionHeading } from '../ui/primitives';
import { NFC_FAQ } from './content';
import { NfcWaves } from './NfcWaves';

const PANEL_ID = 'nfc-faq-panel';
const tabId = (index) => `nfc-faq-q-${index}`;

/** FAQ: vertical tabs + answer panel on desktop, an accordion on mobile. */
export function Faq() {
  const [active, setActive] = useState(0);

  return (
    <Section aria-labelledby="nfc-faq-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute right-[-10%] top-[10%] h-[620px] w-[620px] bg-dots opacity-50 mask-radial" />
      </div>
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-10">
          <div className="min-w-0 lg:col-span-5">
            <SectionHeading id="nfc-faq-title" eyebrow="FAQ" title="Frequently asked *questions*" />
            <FaqTabs active={active} onSelect={setActive} />
          </div>
          <div className="min-w-0 lg:col-span-7 lg:row-span-2">
            <FaqPanel active={active} />
            <FaqAccordion />
            <Reveal className="mt-10 lg:hidden">
              <FaqContact />
            </Reveal>
          </div>
          <Reveal delay={0.2} className="hidden min-w-0 lg:col-span-5 lg:block">
            <FaqContact />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function FaqContact() {
  return (
    <div className="flex items-start gap-4 border-t border-white/[0.07] pt-6">
      <span
        aria-hidden="true"
        className="grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-sage-300"
      >
        <ChatCircleTextIcon weight="duotone" className="size-5" />
      </span>
      <div>
        <p className="text-[15px] text-ink-200">Ordering for a team, or have another question?</p>
        <TextLink href={SITE.whatsappHref} className="min-h-11">
          Chat with us on WhatsApp
          <span className="sr-only">{' (opens in a new tab)'}</span>
        </TextLink>
        <div>
          <AskAILink chip="nfc">Or ask our AI assistant</AskAILink>
        </div>
      </div>
    </div>
  );
}

/** Desktop question list (ARIA tabs, arrow / Home / End keys) with a sliding active highlight. */
function FaqTabs({ active, onSelect }) {
  const tabRefs = useRef([]);

  const onKeyDown = (event, index) => {
    const last = NFC_FAQ.length - 1;
    let next = -1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = index === last ? 0 : index + 1;
    else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = index === 0 ? last : index - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next < 0) return;
    event.preventDefault();
    onSelect(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <LayoutGroup id="nfc-faq-desktop">
      <div role="tablist" aria-orientation="vertical" aria-labelledby="nfc-faq-title" className="mt-12 hidden space-y-1.5 lg:block">
        {NFC_FAQ.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={item.question}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId(index)}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={PANEL_ID}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                'group relative flex min-h-[64px] w-full items-center gap-4 rounded-2xl px-5 py-4 text-left transition-colors duration-300',
                selected ? 'text-ink-50' : 'text-ink-200 hover:bg-white/[0.025] hover:text-ink-50',
              )}
            >
              {selected && (
                <motion.span
                  aria-hidden="true"
                  layoutId="nfc-faq-active"
                  transition={SPRING_SNAPPY}
                  className="absolute inset-0 -z-10 rounded-2xl border border-white/[0.08] bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                >
                  <span className="absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-r-full bg-sage-300" />
                </motion.span>
              )}
              <span
                aria-hidden="true"
                className={cn(
                  'nums font-mono text-[11px] tracking-[0.2em] transition-colors duration-300',
                  selected ? 'text-sage-300' : 'text-ink-300',
                )}
              >
                {pad(index + 1)}
              </span>
              <span className="text-[17px] font-medium leading-snug tracking-[-0.015em]">{item.question}</span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/** Desktop answer panel for the selected tab. */
function FaqPanel({ active }) {
  const item = NFC_FAQ[active];

  return (
    <Reveal delay={0.1} className="hidden lg:block lg:sticky lg:top-28">
      <div
        id={PANEL_ID}
        role="tabpanel"
        aria-labelledby={tabId(active)}
        tabIndex={0}
        className="surface relative isolate min-h-[440px] overflow-hidden rounded-4xl p-10 xl:p-12"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 size-[380px] rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.14),transparent_65%)]" />
          <div className="absolute inset-0 bg-grid-sm opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_100%_0%,#000,transparent_70%)]" />
          <NfcWaves className="absolute bottom-8 right-8 size-28 text-white/[0.04]" strokeWidth={1.2} />
        </div>
        <div aria-hidden="true" className="flex items-center justify-between">
          <span className="nums font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300">
            Answer {pad(active + 1)} / {pad(NFC_FAQ.length)}
          </span>
          <span className="flex gap-1.5">
            {NFC_FAQ.map((faq, index) => (
              <span
                key={faq.question}
                className={cn('h-1 w-6 rounded-full transition-colors duration-500', index === active ? 'bg-sage-300' : 'bg-white/10')}
              />
            ))}
          </span>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="mt-12"
          >
            <p
              aria-hidden="true"
              className="max-w-[24ch] text-balance text-[clamp(1.75rem,2.4vw,2.25rem)] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-50"
            >
              {item.question}
            </p>
            <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-ink-100">{item.answer}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

/** Mobile accordion (one question open at a time; the first starts open). */
function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <LayoutGroup id="nfc-faq-mobile">
      <ul className="border-b border-white/[0.07] lg:hidden">
        {NFC_FAQ.map((item, index) => {
          const isOpen = open === index;
          const buttonId = `nfc-faq-m-q-${index}`;
          const answerId = `nfc-faq-m-a-${index}`;
          return (
            <motion.li
              key={item.question}
              layout="position"
              transition={{ layout: { duration: 0.45, ease: EASE_OUT_EXPO } }}
              className="border-t border-white/[0.07]"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex min-h-[64px] w-full items-center gap-4 py-5 text-left"
                >
                  <span aria-hidden="true" className="nums font-mono text-[11px] tracking-[0.2em] text-sage-300">
                    {pad(index + 1)}
                  </span>
                  <span className="flex-1 text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink-50">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color] duration-500 ease-out-expo',
                      isOpen ? 'rotate-45 border-sage-300/40 bg-sage-300/10 text-sage-300' : 'border-white/10 bg-white/[0.03] text-ink-100',
                    )}
                  >
                    <PlusIcon weight="bold" className="size-4" />
                  </span>
                </button>
              </h3>
              <div id={answerId} role={isOpen ? 'region' : undefined} aria-labelledby={isOpen ? buttonId : undefined}>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                      exit={{ opacity: 0, y: -6, transition: { duration: 0.18 } }}
                      transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                    >
                      <p className="max-w-[60ch] pb-6 pl-[42px] pr-2 text-base leading-relaxed text-ink-200">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </LayoutGroup>
  );
}
