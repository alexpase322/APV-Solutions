import { useRef } from 'react';
import { ArrowRightIcon, EnvelopeSimpleIcon, TranslateIcon } from '@phosphor-icons/react';
import { Container, Reveal } from '../ui/primitives';
import { LANG_NAMES, UI, docTitle, getDocMeta, getLegalDoc, otherDoc, otherLang } from './legalDocs';
import { useJumpToHeading, useReadingProgress, useScrollSpy } from './hooks';
import { LegalLink } from './LegalControls';
import { LegalProse } from './LegalProse';
import { MobileToc, TocPanel } from './LegalToc';

/** Sidebar table of contents + the document, followed by the contact and "continue reading" cards. */
export function LegalBody({ prepared, bodyRef }) {
  const { doc, lang, toc } = prepared;
  const ui = UI[lang];
  const key = `${doc}-${lang}`;
  const articleRef = useRef(null);
  const active = useScrollSpy(articleRef, key);
  const progress = useReadingProgress(articleRef);
  const jump = useJumpToHeading();

  return (
    <div className="relative pb-24 sm:pb-28 lg:pb-36">
      <Container>
        <div ref={bodyRef} className="grid gap-x-12 lg:grid-cols-12">
          <aside className="hidden lg:col-span-4 lg:block">
            <div className="sticky top-28">
              <TocPanel
                items={toc}
                active={active}
                progress={progress}
                onJump={jump}
                ui={ui}
                footer={<AlsoAvailable doc={doc} lang={lang} />}
              />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-8 xl:pl-6">
            <MobileToc items={toc} active={active} progress={progress} onJump={jump} ui={ui} />
            <article ref={articleRef} lang={lang} aria-labelledby="legal-title" tabIndex={-1} className="outline-none">
              <LegalProse key={key} blocks={prepared.blocks} />
            </article>
            <NextSteps doc={doc} lang={lang} />
          </div>
        </div>
      </Container>
    </div>
  );
}

const ALSO_LINK =
  'group/also flex min-h-11 items-center justify-between gap-3 rounded-xl px-1 text-[14px] text-ink-100 transition-colors hover:text-ink-50';

/** Sidebar footer: the other document, and this one in the other language. */
function AlsoAvailable({ doc, lang }) {
  const ui = UI[lang];
  const nextDoc = otherDoc(doc);
  const nextLang = otherLang(lang);
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">{ui.alsoAvailable}</p>
      <ul className="mt-2 grid">
        <li>
          <LegalLink doc={nextDoc} lang={lang} className={ALSO_LINK}>
            <span>{docTitle(nextDoc, lang)}</span>
            <ArrowRightIcon
              weight="bold"
              aria-hidden="true"
              className="size-4 text-sage-300 transition-transform duration-500 ease-out-expo group-hover/also:translate-x-1"
            />
          </LegalLink>
        </li>
        <li>
          <LegalLink doc={doc} lang={nextLang} hrefLang={nextLang} className={ALSO_LINK}>
            <span lang={nextLang}>
              {docTitle(doc, nextLang)} · {LANG_NAMES[nextLang]}
            </span>
            <TranslateIcon weight="bold" aria-hidden="true" className="size-4 text-sage-300" />
          </LegalLink>
        </li>
      </ul>
    </div>
  );
}

/** Legal contact card and a link card to the other document. */
function NextSteps({ doc, lang }) {
  const ui = UI[lang];
  const nextDoc = otherDoc(doc);
  const next = getLegalDoc(nextDoc, lang);
  const { contact } = getDocMeta(doc, lang);

  return (
    <Reveal className="mt-20 grid max-w-[72ch] gap-4 text-[17px] sm:grid-cols-5">
      <div className="surface relative overflow-hidden rounded-3xl p-6 sm:col-span-3 sm:p-7">
        <div aria-hidden="true" className="absolute inset-0 bg-grid-sm opacity-50 mask-radial" />
        <div className="relative">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-2xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300"
          >
            <EnvelopeSimpleIcon weight="duotone" className="size-5" />
          </span>
          <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">{ui.legalContact}</p>
          <p className="mt-3 text-[clamp(1.35rem,2.4vw,1.65rem)] font-semibold leading-tight tracking-[-0.03em] text-ink-50">
            {ui.questions}{' '}
            <a
              href={`mailto:${contact}`}
              className="[overflow-wrap:anywhere] text-sage-300 underline decoration-sage-300/40 decoration-1 underline-offset-[6px] transition-colors hover:text-sage-200 hover:decoration-sage-200"
            >
              {contact}
            </a>
          </p>
        </div>
      </div>

      <LegalLink
        doc={nextDoc}
        lang={lang}
        className="group/next surface relative flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl p-6 transition-[border-color] duration-500 hover:border-sage-300/30 sm:col-span-2 sm:p-7"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300">{ui.continueReading}</span>
        <span>
          <span className="block text-xl font-semibold leading-tight tracking-[-0.03em] text-ink-50">{docTitle(nextDoc, lang)}</span>
          <span className="mt-2 flex items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-200">
            <span className="nums">{ui.sections(next.toc.length)}</span>
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-sage-300 transition-[transform,background-color] duration-500 ease-out-expo group-hover/next:translate-x-1 group-hover/next:bg-sage-300/10"
            >
              <ArrowRightIcon weight="bold" className="size-4" />
            </span>
          </span>
        </span>
      </LegalLink>
    </Reveal>
  );
}
