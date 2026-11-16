import { createContext, lazy, useContext } from 'react';

export const AssistantContext = createContext(null);

/** { isOpen, open({ chip?, ask? }), close({ restoreFocus? }) } */
export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return ctx;
}

export const loadKnowledge = () => import('./knowledge');
const loadPanel = () => import('./AssistantPanel');
export const AssistantPanel = lazy(loadPanel);

let preloaded = false;
/** Fetches the panel and knowledge chunks ahead of time (on hover/focus of any "Ask AI" control). */
export function preloadAssistant() {
  if (preloaded) return;
  preloaded = true;
  loadPanel();
  loadKnowledge();
}

/** Browser language, limited to the two the assistant speaks. */
export const browserLang = () =>
  typeof navigator === 'undefined' ? 'en' : navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
