import { createContext, useContext } from 'react';

/** `{ doc, lang, onSwitch }` of the legal page; `onSwitch` runs before a document/language link navigates. */
export const LegalNavContext = createContext(null);

export function useLegalNav() {
  const value = useContext(LegalNavContext);
  if (!value) throw Error('useLegalNav must be used inside <LegalNavProvider>');
  return value;
}

/** Current query string with `doc` and `lang` set (other params are kept). */
export function legalSearch(search, doc, lang) {
  const params = new URLSearchParams(search);
  params.set('doc', doc);
  params.set('lang', lang);
  return `?${params.toString()}`;
}

/** Absolute, shareable URL of a document. */
export function legalShareUrl(doc, lang) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apvsolutions.tech';
  return `${origin}/legal?doc=${doc}&lang=${lang}`;
}
