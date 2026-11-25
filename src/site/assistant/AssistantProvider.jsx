import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_PATH } from '../lib/site';
import { AssistantContext, preloadAssistant } from './assistantStore';
import { openChat, setChatActive } from './chat';

/** How long after the page shows up the chat widget starts loading on its own. */
const AUTOLOAD_DELAY_MS = 2500;

/**
 * Live chat for the marketing site. Shows the chat bubble while the site is mounted and gives
 * every "Ask our AI assistant" control a way to open it. If the widget can't load (content blocker,
 * no connection) those controls take the visitor to the contact form instead.
 */
export function AssistantProvider({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    setChatActive(true);
    const timer = window.setTimeout(preloadAssistant, AUTOLOAD_DELAY_MS);
    return () => {
      window.clearTimeout(timer);
      setChatActive(false);
    };
  }, []);

  const open = useCallback(() => {
    openChat().catch(() => navigate(CONTACT_PATH));
  }, [navigate]);

  const value = useMemo(() => ({ open }), [open]);

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}
