import { useCallback, useEffect, useId, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useIsPresent } from 'motion/react';
import { useLenis } from 'lenis/react';
import { ArrowUpRightIcon, PaperPlaneRightIcon, XIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { LogoMark } from '../ui/Logo';
import { CHIPS, DEFAULT_CHIPS, WELCOME } from './knowledge';

const COPY = {
  en: {
    title: 'APV Assistant',
    status: 'Online · automated',
    log: 'Conversation with the APV assistant',
    you: 'You:',
    bot: 'APV assistant:',
    placeholder: 'Ask about services, pricing, NFC…',
    input: 'Message',
    send: 'Send message',
    close: 'Close assistant',
    lang: 'Assistant language',
    suggestions: 'Suggested questions',
    note: 'Automated assistant · your messages stay in this browser',
    newTab: '(opens in a new tab)',
  },
  es: {
    title: 'Asistente APV',
    status: 'En línea · automático',
    log: 'Conversación con el asistente de APV',
    you: 'Tú:',
    bot: 'Asistente de APV:',
    placeholder: 'Pregunta por servicios, precios, NFC…',
    input: 'Mensaje',
    send: 'Enviar mensaje',
    close: 'Cerrar asistente',
    lang: 'Idioma del asistente',
    suggestions: 'Preguntas sugeridas',
    note: 'Asistente automático · tus mensajes no salen de este navegador',
    newTab: '(se abre en una pestaña nueva)',
  },
};

/** Same breakpoint as the `chat-float` variant: floating card instead of full screen. */
const FLOAT_QUERY = '(min-width: 40rem) and (min-height: 36rem)';

function useFloating() {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(FLOAT_QUERY);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(FLOAT_QUERY).matches,
    () => true,
  );
}

const hasFinePointer = () => window.matchMedia('(pointer: fine)').matches;

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Modal chat panel: full screen on phones, floating card on larger screens. */
export default function AssistantPanel({
  panelRef,
  registerComposer,
  lang,
  setLang,
  messages,
  chips,
  typing,
  draft,
  setDraft,
  calm,
  onSend,
  onChip,
  onClose,
}) {
  const t = COPY[lang];
  const lenis = useLenis();
  const isPresent = useIsPresent();
  const floating = useFloating();
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const closeRef = useRef(null);
  const inputId = useId();
  const suggestions = chips ?? DEFAULT_CHIPS;

  // On touch devices keep focus off the input so the keyboard doesn't jump up
  const focusComposer = useCallback(() => {
    if (hasFinePointer()) inputRef.current?.focus({ preventScroll: true });
    else panelRef.current?.focus({ preventScroll: true });
  }, [panelRef]);

  useEffect(() => {
    registerComposer(focusComposer);
    return () => registerComposer(null);
  }, [registerComposer, focusComposer]);

  useEffect(() => {
    (hasFinePointer() ? inputRef.current : closeRef.current)?.focus({ preventScroll: true });
  }, []);

  // Full-screen mode: stop the page (and Lenis) from scrolling underneath
  useEffect(() => {
    if (!isPresent || floating) return undefined;
    const root = document.documentElement;
    lenis?.stop();
    root.classList.add('apv-chat-lock');
    return () => {
      root.classList.remove('apv-chat-lock');
      lenis?.start();
    };
  }, [lenis, isPresent, floating]);

  useEffect(() => {
    if (!isPresent) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing) return;
      const active = document.activeElement;
      if (!active || active === document.body || panelRef.current?.contains(active) || active.getAttribute('aria-controls') === 'apv-assistant') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPresent, onClose, panelRef]);

  // New bot replies scroll to their top (so long answers are read from the start); everything else to the bottom
  const scrolledOnce = useRef(false);
  const seenCount = useRef(0);
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const behavior = !scrolledOnce.current || calm ? 'auto' : 'smooth';
    const last = messages[messages.length - 1];
    const grew = messages.length > seenCount.current;
    seenCount.current = messages.length;
    if (scrolledOnce.current && grew && last?.role === 'bot') {
      const el = log.querySelector(`[data-msg="${last.id}"]`);
      if (el) {
        log.scrollTo({ top: Math.max(0, el.offsetTop - 12), behavior });
        scrolledOnce.current = true;
        return;
      }
    }
    log.scrollTo({ top: log.scrollHeight, behavior });
    scrolledOnce.current = true;
  }, [messages, typing, calm]);

  // Keep Tab inside the dialog
  const trapFocus = (event) => {
    if (event.key !== 'Tab' || !panelRef.current) return;
    const items = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === panelRef.current)) {
      event.preventDefault();
      first.focus();
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft('');
    focusComposer();
  };

  const showSuggestions = suggestions.length > 0 && !typing && !draft.trim();

  return (
    <motion.div
      ref={panelRef}
      id="apv-assistant"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apv-assistant-title"
      tabIndex={-1}
      lang={lang}
      onKeyDown={trapFocus}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 30 } }}
      exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
      className={cn(
        'fixed inset-0 z-[65] flex origin-bottom-right flex-col overflow-hidden bg-ink-900 outline-none',
        'chat-float:inset-auto chat-float:bottom-[6.25rem] chat-float:right-7 chat-float:h-[min(640px,calc(100dvh-12rem))] chat-float:w-[380px] chat-float:rounded-[1.75rem]',
        'chat-float:border chat-float:border-white/10 chat-float:bg-ink-850/80 chat-float:backdrop-blur-2xl chat-float:backdrop-saturate-150',
        'chat-float:shadow-[0_40px_80px_-24px_rgba(2,6,10,0.85),inset_0_1px_0_rgba(255,255,255,0.07)]',
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(180,198,143,0.18),transparent)]"
      />

      <div className="relative flex shrink-0 items-center gap-3 border-b border-white/[0.07] px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-ink-800">
          <LogoMark className="size-6" />
          <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-ink-850 bg-whatsapp" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="apv-assistant-title" className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink-50">
            {t.title}
          </h2>
          <p className="truncate text-xs text-ink-200">{t.status}</p>
        </div>
        <div role="group" aria-label={t.lang} className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5">
          {['en', 'es'].map((code) => (
            <button
              key={code}
              type="button"
              aria-pressed={lang === code}
              lang={code}
              onClick={() => setLang(code)}
              className={cn(
                'grid h-10 min-w-10 place-items-center rounded-full px-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                lang === code ? 'bg-sage-300 text-ink-950' : 'text-ink-200 hover:text-ink-50',
              )}
            >
              {code}
            </button>
          ))}
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={() => onClose()}
          aria-label={t.close}
          className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink-100 transition-colors hover:border-white/20 hover:text-ink-50"
        >
          <XIcon weight="bold" className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label={t.log}
        data-lenis-prevent
        className="relative min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {messages.map((message, i) =>
          message.role === 'user' ? (
            <UserMessage key={message.id} id={message.id} text={message.text} lang={message.lang} />
          ) : (
            <BotMessage
              key={message.id}
              id={message.id}
              lang={message.lang}
              reply={message.role === 'welcome' ? WELCOME[message.lang] : message.reply}
              showAvatar={i === 0 || messages[i - 1].role === 'user'}
              onClose={onClose}
            />
          ),
        )}
        {typing && <TypingIndicator calm={calm} />}
      </div>

      {showSuggestions && (
        <div
          role="group"
          aria-label={t.suggestions}
          data-lenis-prevent
          className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {suggestions.map((chipId, i) => (
            <motion.button
              key={`${chipId}-${lang}`}
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT_EXPO, delay: i * 0.05 }}
              onClick={() => {
                focusComposer();
                onChip(chipId);
              }}
              className="min-h-11 shrink-0 whitespace-nowrap rounded-full border border-sage-300/30 bg-sage-300/[0.07] px-4 text-[13px] font-medium text-sage-200 transition-colors hover:border-sage-300/60 hover:bg-sage-300/15"
            >
              {CHIPS[chipId].label[lang]}
            </motion.button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="relative shrink-0 border-t border-white/[0.07] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-ink-900/70 pl-4 pr-1.5 transition-colors focus-within:border-sage-300/60">
          <label htmlFor={inputId} className="sr-only">
            {t.input}
          </label>
          <input
            ref={inputRef}
            id={inputId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t.placeholder}
            maxLength={400}
            autoComplete="off"
            enterKeyHint="send"
            className="h-12 min-w-0 flex-1 bg-transparent text-base text-ink-50 outline-none placeholder:text-ink-200"
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            aria-label={t.send}
            onMouseDown={(event) => event.preventDefault()}
            className="grid size-11 shrink-0 place-items-center rounded-xl bg-[linear-gradient(140deg,var(--color-sage-200),var(--color-sage-400))] text-ink-950 transition-[opacity,transform] active:scale-95 disabled:opacity-35"
          >
            <PaperPlaneRightIcon weight="fill" className="size-[18px]" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-2 px-1 text-center text-xs text-ink-200">{t.note}</p>
      </form>
    </motion.div>
  );
}

function BotAvatar({ hidden }) {
  return (
    <span aria-hidden="true" className={cn('grid size-7 shrink-0 place-items-center rounded-lg border border-white/10 bg-ink-800', hidden && 'invisible')}>
      <LogoMark className="size-4" />
    </span>
  );
}

function UserMessage({ id, text, lang }) {
  return (
    <motion.div
      data-msg={id}
      lang={lang}
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
      className="flex justify-end"
    >
      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-md bg-[linear-gradient(135deg,var(--color-sage-200),var(--color-sage-400))] px-3.5 py-2.5 text-[15px] leading-snug text-ink-950 shadow-[0_10px_24px_-14px_rgba(148,163,120,0.7)]">
        <span className="sr-only">{COPY[lang].you} </span>
        {text}
      </p>
    </motion.div>
  );
}

function BotMessage({ id, lang, reply, showAvatar, onClose }) {
  return (
    <motion.div
      data-msg={id}
      lang={lang}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
      className="flex items-start gap-2.5"
    >
      <BotAvatar hidden={!showAvatar} />
      <div className="min-w-0 max-w-[85%] rounded-2xl rounded-tl-md border border-white/[0.06] bg-ink-800/90 px-3.5 py-3 text-[15px] leading-relaxed text-ink-100">
        <span className="sr-only">{COPY[lang].bot} </span>
        {reply.text.map((paragraph, i) => (
          <p key={i} className={i > 0 ? 'mt-2' : undefined}>
            {paragraph}
          </p>
        ))}
        {reply.bullets && (
          <ul className="mt-2.5 space-y-1.5">
            {reply.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 text-[14.5px] leading-snug text-ink-100">
                <span aria-hidden="true" className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-sage-300" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
        {reply.actions?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {reply.actions.map((action) => (
              <ReplyAction key={action.label} action={action} newTab={COPY[lang].newTab} onClose={onClose} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/** Button inside a reply: in-site route, external link (new tab) or mailto/tel/WhatsApp. */
function ReplyAction({ action, newTab, onClose }) {
  const { pathname } = useLocation();
  const className = cn(
    'inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium leading-tight transition-colors',
    action.primary
      ? 'bg-sage-300 text-ink-950 hover:bg-sage-200'
      : 'border border-white/10 bg-white/[0.04] text-ink-50 hover:border-white/20 hover:bg-white/[0.08]',
  );

  if (action.to) {
    const to = action.to;
    return (
      <Link
        to={to}
        className={className}
        onClick={() => {
          onClose({ restoreFocus: false });
          // Same page without a hash: no navigation happens, so move focus to the content manually
          const [path, hash] = to.split('#');
          if (!hash && (path.split('?')[0] || '/') === pathname) {
            window.setTimeout(() => document.getElementById('main')?.focus({ preventScroll: true }), 0);
          }
        }}
      >
        {action.label}
      </Link>
    );
  }

  const external = /^https?:\/\//.test(action.href ?? '');
  const internal = action.href?.startsWith('/') ?? false;
  return (
    <a
      href={action.href}
      className={className}
      onClick={internal ? () => onClose({ restoreFocus: false }) : undefined}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {action.label}
      {external && (
        <>
          <ArrowUpRightIcon weight="bold" className="size-3.5" aria-hidden="true" />
          <span className="sr-only"> {newTab}</span>
        </>
      )}
    </a>
  );
}

function TypingIndicator({ calm }) {
  return (
    <div className="flex items-start gap-2.5" aria-hidden="true">
      <BotAvatar />
      <div className="flex h-11 items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/[0.06] bg-ink-800/90 px-4">
        {[0, 1, 2].map((i) =>
          calm ? (
            <span key={i} className="size-1.5 rounded-full bg-ink-100 opacity-70" />
          ) : (
            <motion.span
              key={i}
              className="size-1.5 rounded-full bg-ink-100"
              animate={{ y: [0, -4, 0], opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
            />
          ),
        )}
      </div>
    </div>
  );
}
