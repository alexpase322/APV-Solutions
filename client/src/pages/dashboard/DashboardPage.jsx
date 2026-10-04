import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, KeyRound, Loader2, PartyPopper } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import CardEditor from '../../components/nfc/CardEditor';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, Field, Section } from '../../components/nfc/ui';
import { PasswordInput } from '../auth/PasswordFields';
import { api, uploadImage } from '../../lib/api';
import { cardPublicUrl } from '../../lib/nfc';
import { useAuth } from '../../context/AuthContext';
import useNoIndex from '../../hooks/useNoIndex';

const ChangePassword = () => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (next.length < 8) return setMsg({ kind: 'error', text: 'New password must be at least 8 characters.' });
    setBusy(true);
    setMsg(null);
    try {
      await api('/api/auth/password', { method: 'PUT', body: { currentPassword: current, newPassword: next } });
      setCurrent('');
      setNext('');
      setMsg({ kind: 'success', text: 'Password updated.' });
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section title="Account security" description="Change the password you use to log in.">
      <form onSubmit={submit} className="space-y-4">
        {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="current-password" label="Current password">
            <PasswordInput id="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
          </Field>
          <Field id="next-password" label="New password" hint="At least 8 characters.">
            <PasswordInput id="next-password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" minLength={8} required />
          </Field>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 font-semibold text-[#263646] hover:border-[#263646] disabled:opacity-60 transition-colors"
        >
          {busy ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <KeyRound size={16} aria-hidden="true" />}
          Update password
        </button>
      </form>
    </Section>
  );
};

const DashboardPage = () => {
  useNoIndex('My Card · APV');
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState({ status: 'loading', card: null, error: '' });
  const welcome = params.get('welcome') === '1';

  useEffect(() => {
    const controller = new AbortController();
    api('/api/me/card', { signal: controller.signal })
      .then((data) => setState({ status: 'ready', card: data.card, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', card: null, error: err.message });
      });
    return () => controller.abort();
  }, []);

  const save = async (profile) => {
    const data = await api('/api/me/card', { method: 'PUT', body: { profile } });
    setState((s) => ({ ...s, card: data.card }));
    return data.card.profile;
  };

  const upload = async (file, kind) => (await uploadImage('/api/me/upload', file, kind)).url;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="MY DIGITAL CARD" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {welcome && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#94A378]/40 bg-[#94A378]/10 p-4 text-[#263646]">
            <PartyPopper size={22} className="text-[#94A378] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-bold">Your account is active!</p>
              <p className="text-sm text-gray-700">Complete your profile below and hit “Save changes”. Your NFC card updates instantly — no need to reprogram it.</p>
            </div>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm font-semibold text-[#263646] hover:underline">
              Got it
            </button>
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p className="text-gray-600">This is what people see when they tap your card.</p>
        </div>

        {state.status === 'loading' && (
          <div className="flex items-center gap-3 text-gray-500 py-12 justify-center">
            <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" /> Loading your card…
          </div>
        )}

        {state.status === 'error' && <Alert>{state.error}</Alert>}

        {state.status === 'ready' && (
          <>
            <div className="grid lg:grid-cols-[minmax(0,1fr)_260px] gap-4">
              <CardLinkBox
                url={cardPublicUrl(state.card)}
                code={state.card.code}
                title="Your card link"
                description="This link is stored in your NFC card. Share it or use the QR code anywhere."
              />
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <BarChart3 size={16} className="text-[#94A378]" aria-hidden="true" /> Profile views
                </div>
                <p className="text-4xl font-bold text-[#263646] mt-1">{state.card.views.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {state.card.lastViewedAt ? `Last view ${new Date(state.card.lastViewedAt).toLocaleString()}` : 'No views yet'}
                </p>
              </div>
            </div>

            {!state.card.active && (
              <Alert kind="info">Your card is currently turned off, so visitors can't see it. Contact APV Business Solutions to reactivate it.</Alert>
            )}

            <CardEditor profile={state.card.profile} onSave={save} onUpload={upload} />
            <ChangePassword />
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
