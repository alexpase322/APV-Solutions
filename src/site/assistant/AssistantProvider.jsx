import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SparkleIcon, XIcon } from '@phosphor-icons/react';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { AssistantContext, AssistantPanel, browserLang, loadKnowledge, preloadAssistant } from './assistantStore';

/**
 * Owns the conversation (messages, language, typing indicator) and renders the floating launcher
 * plus the lazily loaded panel. Answers come from the offline knowledge base after a short,
 * length-based "typing" delay.
 */
export function AssistantProvider({ children }) {
  const calm = !!useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLangState] = useState(browserLang);
  const [messages, setMessages] = useState([]);
  const [chips, setChips] = useState(null);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');

  const langRef = useRef(lang);
  const calmRef = useRef(calm);
  const openRef = useRef(false);
  const startedRef = useRef(false);
  const nextId = useRef(1);
  const pending = useRef(0);
  const lastReplyAt = useRef(0);
  const timers = useRef(new Set());
  const returnFocus = useRef(null);
  const launcherRef = useRef(null);
  const panelRef = useRef(null);
  const focusComposer = useRef(null);

  useEffect(() => {
    langRef.current = lang;
    calmRef.current = calm;
  }, [lang, calm]);

  // Warm the chunks a few seconds after load so the first open is instant
  useEffect(() => {
    const id = window.setTimeout(preloadAssistant, 3000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const pendingTimers = timers.current;
    return () => pendingTimers.forEach((id) => window.clearTimeout(id));
  }, []);

  const push = useCallback((message) => {
    const id = nextId.current++;
    startedRef.current = true;
    setMessages((list) => [...list, { ...message, id }]);
  }, []);

  const setLang = useCallback((next) => {
    langRef.current = next;
    setLangState(next);
  }, []);

  const send = useCallback(
    async (text, intent) => {
      const message = text.trim().slice(0, 400);
      if (!message) return;
      const kb = await loadKnowledge();
      const detected = intent ? null : kb.detectLang(message);
      const replyLang = detected ?? langRef.current;
      if (detected && detected !== langRef.current) setLang(detected);
      const { reply, followups } = kb.answer(intent ?? kb.classify(message), replyLang);

      push({ role: 'user', text: message, lang: replyLang });
      setChips([]);
      pending.current += 1;
      setTyping(true);

      // Longer answers "type" a little longer; replies queue so they never overlap
      const length = reply.text.join(' ').length + (reply.bullets?.join(' ').length ?? 0);
      const delay = calmRef.current ? 150 : Math.min(1600, 520 + length * 2);
      const now = performance.now();
      const at = Math.max(now, lastReplyAt.current) + delay;
      lastReplyAt.current = at;

      const id = window.setTimeout(() => {
        timers.current.delete(id);
        push({ role: 'bot', reply, lang: replyLang });
        setChips(followups);
        pending.current = Math.max(0, pending.current - 1);
        if (pending.current === 0) setTyping(false);
      }, at - now);
      timers.current.add(id);
    },
    [push, setLang],
  );

  const sendChip = useCallback(
    async (chipId) => {
      const chip = (await loadKnowledge()).CHIPS[chipId];
      send(chip.label[langRef.current], chip.intent);
    },
    [send],
  );

  const open = useCallback(
    (options) => {
      const wasOpen = openRef.current;
      if (!wasOpen) {
        const active = document.activeElement;
        returnFocus.current = active instanceof HTMLElement && active !== document.body ? active : null;
      }
      openRef.current = true;
      setIsOpen(true);
      if (!startedRef.current) push({ role: 'welcome', lang: langRef.current });
      if (options?.chip) sendChip(options.chip);
      else if (options?.ask) send(options.ask);
      if (wasOpen) focusComposer.current?.();
    },
    [push, send, sendChip],
  );

  const close = useCallback((options) => {
    const active = document.activeElement;
    const focusWasInside = !active || active === document.body || active === launcherRef.current || !!panelRef.current?.contains(active);
    openRef.current = false;
    setIsOpen(false);
    if (options?.restoreFocus === false || !focusWasInside) return;
    const target = returnFocus.current?.isConnected ? returnFocus.current : launcherRef.current;
    window.setTimeout(() => target?.focus({ preventScroll: true }), 0);
  }, []);

  const registerComposer = useCallback((fn) => {
    focusComposer.current = fn;
  }, []);

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <AssistantContext.Provider value={value}>
      {children}
      <AssistantLauncher ref={launcherRef} isOpen={isOpen} calm={calm} onToggle={() => (isOpen ? close() : open())} />
      <AnimatePresence>
        {isOpen && (
          <Suspense key="panel" fallback={null}>
            <AssistantPanel
              panelRef={panelRef}
              registerComposer={registerComposer}
              lang={lang}
              setLang={setLang}
              messages={messages}
              chips={chips}
              typing={typing}
              draft={draft}
              setDraft={setDraft}
              calm={calm}
              onSend={(text) => void send(text)}
              onChip={(chipId) => void sendChip(chipId)}
              onClose={close}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </AssistantContext.Provider>
  );
}

/** Floating round button (bottom-right) that opens/closes the assistant. */
function AssistantLauncher({ isOpen, calm, onToggle, ref }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 1.2 }}
      className="fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7"
    >
      <motion.button
        ref={ref}
        type="button"
        onClick={onToggle}
        onPointerEnter={preloadAssistant}
        onFocus={preloadAssistant}
        aria-expanded={isOpen}
        aria-controls="apv-assistant"
        aria-haspopup="dialog"
        aria-label={isOpen ? 'Close the APV AI assistant' : 'Open the APV AI assistant'}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        transition={SPRING_SNAPPY}
        className="group relative grid size-14 place-items-center rounded-full bg-[linear-gradient(140deg,var(--color-sage-100),var(--color-sage-300)_45%,var(--color-sage-600))] text-ink-950 shadow-[0_18px_40px_-14px_rgba(148,163,120,0.75),inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_6px_rgba(42,48,34,0.35)]"
      >
        {!isOpen && !calm && <span aria-hidden="true" className="absolute inset-0 rounded-full bg-sage-300 opacity-0 animate-pulse-ring" />}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={isOpen ? 'x' : 'spark'}
            aria-hidden="true"
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={SPRING_SNAPPY}
            className="relative grid place-items-center"
          >
            {isOpen ? <XIcon weight="bold" className="size-6" /> : <SparkleIcon weight="fill" className="size-7" />}
          </motion.span>
        </AnimatePresence>
        {!isOpen && (
          <span aria-hidden="true" className="absolute right-0.5 top-0.5 grid size-3.5 place-items-center rounded-full border-2 border-ink-900 bg-whatsapp">
            {!calm && <span className="absolute inset-0 rounded-full bg-whatsapp opacity-0 animate-pulse-ring" />}
          </span>
        )}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-xl border border-white/10 bg-ink-800/95 px-3 py-2 text-sm font-medium text-ink-50 opacity-0 shadow-xl backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 md:block"
        >
          {isOpen ? 'Close assistant' : 'Ask APV AI'}
        </span>
      </motion.button>
    </motion.div>
  );
}
