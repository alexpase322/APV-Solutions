import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, CreditCard } from 'lucide-react';
import CardProfile from '../../components/nfc/CardProfile';
import { api, vcardUrl } from '../../lib/api';
import useNoIndex from '../../hooks/useNoIndex';
import useCardTheme from '../../hooks/useCardTheme';
import BookingWidget from '../../components/nfc/BookingWidget';
import { luminance, readableOn } from '../../lib/nfc';

const PAGE_BG = { light: '#F8F9FA', dark: '#0b1119' };

/** Colors the phone's browser bar to match the card (restored when leaving the page). */
function useThemeColor(color) {
  useEffect(() => {
    let el = document.querySelector('meta[name="theme-color"]');
    const created = !el;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'theme-color');
      document.head.appendChild(el);
    }
    const previous = el.getAttribute('content');
    el.setAttribute('content', color);
    return () => {
      if (created) el.remove();
      else if (previous) el.setAttribute('content', previous);
    };
  }, [color]);
}

const PublicCardPage = () => {
  const { code } = useParams();
  const [state, setState] = useState({ status: 'loading', card: null, slow: false });
  // Before the card loads the theme is 'auto' (visitor's phone setting), so the loader already matches
  const dark = useCardTheme(state.card?.profile?.theme);

  useNoIndex(state.card?.profile?.fullName ? `${state.card.profile.fullName} · Digital Card` : 'Digital Card · APV');
  useThemeColor(dark ? PAGE_BG.dark : PAGE_BG.light);

  useEffect(() => {
    const controller = new AbortController();
    // The API may be waking up (free hosting cold start) — tell the visitor instead of looking broken
    const slowTimer = setTimeout(() => setState((s) => (s.status === 'loading' ? { ...s, slow: true } : s)), 3500);

    api(`/api/public/cards/${encodeURIComponent(code)}`, { signal: controller.signal, auth: false })
      .then((data) => setState({ status: 'ready', card: data.card, slow: false }))
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setState({ status: err.status === 404 ? 'notfound' : 'error', card: null, slow: false });
      })
      .finally(() => clearTimeout(slowTimer));

    return () => {
      controller.abort();
      clearTimeout(slowTimer);
    };
  }, [code]);

  /*
   * The card follows the client's theme, not the site's. <html class="apv-site"> sets light text, a dark
   * color-scheme and dark autofill colors globally, so pin what the card was designed against:
   * navy text + light controls on a light card, light text + dark controls at night, and the browser's own
   * autofill colors in the booking form.
   */
  const pageClass = `${dark ? 'dark' : ''} min-h-screen bg-[#F8F9FA] dark:bg-[#0b1119] text-[#263646] dark:text-gray-100 [color-scheme:light] dark:[color-scheme:dark] [&_:is(input,textarea):autofill]:[-webkit-text-fill-color:currentColor] [&_:is(input,textarea):autofill]:[caret-color:auto] [&_:is(input,textarea):autofill]:shadow-none`;

  // Loading / error screens are APV chrome (dark), not the client's card
  const chromeClass = 'relative isolate min-h-screen overflow-hidden bg-ink-900 text-ink-50';

  if (state.status === 'loading') {
    return (
      <main className={`${chromeClass} flex flex-col items-center justify-center gap-3 px-6 text-center`}>
        <Loader2 className="animate-spin text-sage-300" size={36} aria-hidden="true" />
        <p className="text-sm text-ink-200">
          {state.slow ? 'Opening card… this can take a few seconds.' : 'Opening card…'}
        </p>
      </main>
    );
  }

  if (state.status !== 'ready') {
    return (
      <main className={`${chromeClass} flex flex-col items-center justify-center px-6 text-center`}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-grid opacity-50 mask-radial" />
        <div className="w-16 h-16 rounded-2xl border border-gold-400/25 bg-gold-400/[0.08] text-gold-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center mb-6">
          <CreditCard size={30} aria-hidden="true" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] mb-2 text-ink-50">
          {state.status === 'notfound' ? 'Card not available' : 'Something went wrong'}
        </h1>
        <p className="max-w-sm mb-8 text-ink-200">
          {state.status === 'notfound'
            ? 'This card does not exist or has been deactivated.'
            : 'We could not load this card. Please check your connection and try again.'}
        </p>
        <Link
          to="/nfc"
          className="rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-sage-300 transition-colors hover:border-white/25 hover:bg-white/[0.07] hover:text-sage-200"
        >
          Get your own APV digital card
        </Link>
      </main>
    );
  }

  const { card } = state;
  const shareUrl = `${window.location.origin}/c/${card.code}`;
  // Same rule as the card's main button: a very dark accent is inverted at night so it stays visible
  const rawAccent = /^#[0-9a-f]{6}$/i.test(card.profile?.accentColor || '') ? card.profile.accentColor : '#263646';
  const accent = dark && luminance(rawAccent) < 0.08 ? '#F3F4F6' : rawAccent;

  return (
    <main className={`${pageClass} sm:py-10`}>
      <CardProfile profile={card.profile} vcardHref={vcardUrl(card.code)} shareUrl={shareUrl}>
        {card.booking && <BookingWidget code={card.code} booking={card.booking} accent={accent} onAccent={readableOn(accent)} />}
      </CardProfile>

      {!card.ready && (
        <p className="max-w-md mx-auto px-6 mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          This profile is still being set up — check back soon for full details.
        </p>
      )}

      <footer className="max-w-md mx-auto px-6 py-8 text-center">
        <Link
          to="/nfc"
          className="text-xs text-gray-500 hover:text-[#263646] dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          Powered by <span className="font-bold">APV</span> Business Solutions · Get your card
        </Link>
      </footer>
    </main>
  );
};

export default PublicCardPage;
