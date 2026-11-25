import { createContext, useContext } from 'react';
import { loadChat } from './chat';

export const AssistantContext = createContext(null);

/** { open() } — opens the live chat. */
export function useAssistant() {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error('useAssistant must be used inside <AssistantProvider>');
  return ctx;
}

/** Starts loading the chat widget ahead of time (on hover/focus of any "Ask AI" control). */
export function preloadAssistant() {
  loadChat().catch(() => {
    /* blocked or offline: opening the chat falls back to the contact form */
  });
}
