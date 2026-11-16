import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArticleIcon, CheckIcon, FingerprintIcon, LinkSimpleIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { SPRING_SNAPPY } from '../lib/motion';
import { DOC_KEYS, LANGS, LANG_NAMES, SHORT_TITLES, UI, docTitle } from './legalDocs';
import { LegalNavContext, legalSearch, legalShareUrl, useLegalNav } from './legalNav';

export function LegalNavProvider({ value, children }) {
  return <LegalNavContext.Provider value={value}>{children}</LegalNavContext.Provider>;
}

/**
 * Link to another document and/or language of the legal page. Replaces the history entry, keeps the
 * scroll position handling to `onSwitch`, and does nothing when it points at what is already open.
 */
export function LegalLink({ doc, lang, className, children, hrefLang, contentLang, 'aria-label': ariaLabel }) {
  const nav = useLegalNav();
  const { search } = useLocation();
  const current = nav.doc === doc && nav.lang === lang;

  return (
    <Link
      to={{ pathname: '/legal', search: legalSearch(search, doc, lang) }}
      replace
      preventScrollReset
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (current) event.preventDefault();
        else nav.onSwitch();
      }}
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel}
      hrefLang={hrefLang}
      lang={contentLang}
      className={className}
    >
      {children}
    </Link>
  );
}

const DOC_ICONS = { terms: ArticleIcon, privacy: FingerprintIcon };

const SWITCH =
  'relative flex items-center gap-1 rounded-full border border-white/[0.08] bg-ink-850/70 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-md';

const switchOption = (active) =>
  cn(
    'relative isolate inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300 sm:px-5',
    active ? 'text-ink-950' : 'text-ink-200 hover:text-ink-50',
  );

/** Sage pill that slides between the options of a switch. */
function ActivePill({ layoutId }) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={SPRING_SNAPPY}
      aria-hidden="true"
      className="absolute inset-0 -z-10 rounded-full bg-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-12px_rgba(148,163,120,0.7)]"
    />
  );
}

/** Terms / Privacy switch. */
export function DocSwitch({ className }) {
  const { doc: currentDoc, lang } = useLegalNav();
  const ui = UI[lang];
  return (
    <div role="group" aria-label={ui.docGroup} className={cn(SWITCH, className)}>
      {DOC_KEYS.map((doc) => {
        const active = doc === currentDoc;
        const Icon = DOC_ICONS[doc];
        return (
          <LegalLink key={doc} doc={doc} lang={lang} className={cn(switchOption(active), 'min-w-0 flex-1 sm:flex-none')}>
            {active && <ActivePill layoutId="legal-doc-pill" />}
            <Icon weight={active ? 'bold' : 'regular'} className="size-4 shrink-0" aria-hidden="true" />
            <span aria-hidden="true" className="truncate sm:hidden">
              {SHORT_TITLES[doc][lang]}
            </span>
            <span className="max-sm:sr-only">{docTitle(doc, lang)}</span>
          </LegalLink>
        );
      })}
    </div>
  );
}

/** EN / ES switch. */
export function LangSwitch({ className }) {
  const { doc, lang: currentLang } = useLegalNav();
  const ui = UI[currentLang];
  return (
    <div role="group" aria-label={ui.langGroup} className={cn(SWITCH, className)}>
      {LANGS.map((lang) => {
        const active = lang === currentLang;
        return (
          <LegalLink
            key={lang}
            doc={doc}
            lang={lang}
            hrefLang={lang}
            contentLang={lang}
            aria-label={LANG_NAMES[lang]}
            className={cn(switchOption(active), 'w-12 px-0 font-mono text-[13px] tracking-[0.08em] sm:w-14 sm:px-0')}
          >
            {active && <ActivePill layoutId="legal-lang-pill" />}
            <span aria-hidden="true" lang={lang}>
              {lang.toUpperCase()}
            </span>
          </LegalLink>
        );
      })}
    </div>
  );
}

/** Copies the document's shareable URL, with a textarea fallback for older browsers. */
export function CopyLinkButton({ className }) {
  const { doc, lang } = useLegalNav();
  const ui = UI[lang];
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status === 'idle') return;
    const timer = window.setTimeout(() => setStatus('idle'), 2400);
    return () => window.clearTimeout(timer);
  }, [status]);

  const copy = async () => {
    const url = legalShareUrl(doc, lang);
    try {
      await navigator.clipboard.writeText(url);
      setStatus('done');
    } catch {
      try {
        const field = document.createElement('textarea');
        field.value = url;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        setStatus(copied ? 'done' : 'error');
      } catch {
        setStatus('error');
      }
    }
  };

  const label = status === 'done' ? ui.copied : status === 'error' ? ui.copyFailed : ui.copyLink;

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'group inline-flex h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] pl-3.5 pr-4 text-[14px] font-medium tracking-[-0.01em] text-ink-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-[border-color,background-color,color] duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-ink-50',
          className,
        )}
      >
        <span aria-hidden="true" className="relative grid size-4 place-items-center">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={status === 'done' ? 'check' : 'link'}
              initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.4, opacity: 0, rotate: 30 }}
              transition={SPRING_SNAPPY}
              className="absolute inset-0 grid place-items-center"
            >
              {status === 'done' ? (
                <CheckIcon weight="bold" className="size-4 text-sage-300" />
              ) : (
                <LinkSimpleIcon weight="bold" className="size-4" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
        {/* All three labels share one grid cell so the button keeps the width of the longest */}
        <span className="grid">
          {[ui.copyLink, ui.copied, ui.copyFailed].map((text) => (
            <span
              key={text}
              aria-hidden={text !== label}
              className={cn('col-start-1 row-start-1 transition-opacity duration-300', text === label ? 'opacity-100' : 'invisible opacity-0')}
            >
              {text}
            </span>
          ))}
        </span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {status === 'done' ? ui.copied : status === 'error' ? ui.copyFailed : ''}
      </span>
    </>
  );
}
