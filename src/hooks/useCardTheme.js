import { useEffect, useState } from 'react';

const QUERY = '(prefers-color-scheme: dark)';

/**
 * Resolves a card theme ('auto' | 'light' | 'dark') to a boolean.
 * 'auto' follows the device setting and reacts live when it changes (e.g. phone switches to night mode).
 */
export default function useCardTheme(theme = 'auto') {
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(QUERY).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return undefined;
    const onChange = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return theme === 'dark' || (theme !== 'light' && systemDark);
}
