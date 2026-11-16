import { useMemo, useRef, useState } from 'react';
import { useLocation, useMatch } from 'react-router-dom';
import { Seo } from '../ui/primitives';
import { SEO, getLegalDoc, normalizeDoc, normalizeLang } from '../legal/legalDocs';
import { useSwitchScroll } from '../legal/hooks';
import { LegalNavProvider } from '../legal/LegalControls';
import { LegalHero } from '../legal/LegalHero';
import { LegalBody } from '../legal/LegalBody';

/**
 * Terms of Service and Privacy Policy, in English and Spanish (`/legal?doc=terms|privacy&lang=en|es`).
 * The documents come from `src/lib/legal.js`.
 */
export default function LegalPage() {
  const location = useLocation();
  const onLegal = useMatch('/legal') !== null;
  // While the page animates out after leaving /legal, keep showing the last legal URL
  const [lastLocation, setLastLocation] = useState(location);
  if (onLegal && lastLocation !== location) setLastLocation(location);
  const current = onLegal ? location : lastLocation;

  const params = useMemo(() => new URLSearchParams(current.search), [current.search]);
  const doc = normalizeDoc(params.get('doc'));
  const lang = normalizeLang(params.get('lang'));
  const prepared = getLegalDoc(doc, lang);
  const seo = SEO[doc][lang];

  const bodyRef = useRef(null);
  const onSwitch = useSwitchScroll(bodyRef, current.key, current.hash);
  const nav = useMemo(() => ({ doc, lang, onSwitch }), [doc, lang, onSwitch]);

  return (
    <LegalNavProvider value={nav}>
      <Seo title={seo.title} description={seo.description} path={`/legal?doc=${doc}&lang=${lang}`} />
      <div lang={lang}>
        <LegalHero prepared={prepared} />
        <LegalBody prepared={prepared} bodyRef={bodyRef} />
      </div>
    </LegalNavProvider>
  );
}
