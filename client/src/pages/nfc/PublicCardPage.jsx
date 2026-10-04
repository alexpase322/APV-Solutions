import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader2, CreditCard } from 'lucide-react';
import CardProfile from '../../components/nfc/CardProfile';
import { api, vcardUrl } from '../../lib/api';
import useNoIndex from '../../hooks/useNoIndex';
import useCardTheme from '../../hooks/useCardTheme';

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

  const pageClass = `${dark ? 'dark' : ''} min-h-screen bg-[#F8F9FA] dark:bg-[#0b1119]`;

  if (state.status === 'loading') {
    return (
      <main className={`${pageClass} flex flex-col items-center justify-center gap-3 px-6 text-center`}>
        <Loader2 className="animate-spin text-[#94A378]" size={36} aria-hidden="true" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {state.slow ? 'Opening card… this can take a few seconds.' : 'Opening card…'}
        </p>
      </main>
    );
  }

  if (state.status !== 'ready') {
    return (
      <main className={`${pageClass} flex flex-col items-center justify-center px-6 text-center`}>
        <div className="w-16 h-16 rounded-2xl bg-[#263646] text-[#E4B34C] flex items-center justify-center mb-6 dark:ring-1 dark:ring-white/15">
          <CreditCard size={30} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-[#263646] dark:text-white">
          {state.status === 'notfound' ? 'Card not available' : 'Something went wrong'}
        </h1>
        <p className="max-w-sm mb-8 text-gray-600 dark:text-gray-300">
          {state.status === 'notfound'
            ? 'This card does not exist or has been deactivated.'
            : 'We could not load this card. Please check your connection and try again.'}
        </p>
        <Link to="/nfc" className="text-[#94A378] font-semibold hover:underline">
          Get your own APV digital card
        </Link>
      </main>
    );
  }

  const { card } = state;
  const shareUrl = `${window.location.origin}/c/${card.code}`;

  return (
    <main className={`${pageClass} sm:py-10`}>
      <CardProfile profile={card.profile} vcardHref={vcardUrl(card.code)} shareUrl={shareUrl} />

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
