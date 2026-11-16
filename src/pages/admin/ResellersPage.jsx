import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronRight, Loader2, Plus, Store, UserPlus } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import { Alert, Field, Section, StatusBadge, inputClass } from '../../components/nfc/ui';
import AdminNav from './AdminNav';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import useNoIndex from '../../hooks/useNoIndex';

const EMPTY = { name: '', businessName: '', email: '', phone: '', notes: '', sendEmail: true };

const NewResellerForm = ({ onCreated }) => {
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/admin/resellers', { method: 'POST', body: form });
      setResult(data);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="text-sage-300" size={22} aria-hidden="true" /> Reseller {result.reseller.name} registered
          </span>
        }
        description="Next: register the products you sold them, so they can start creating clients."
      >
        <InviteLinkBox kind="reseller" name={result.reseller.name} inviteUrl={result.inviteUrl} email={result.email} />
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/admin/resellers/${result.reseller.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-sage-300 px-5 py-3 font-semibold text-ink-950 hover:bg-sage-200 transition-colors"
          >
            <Plus size={16} aria-hidden="true" /> Add products to their stock
          </Link>
          <button
            type="button"
            onClick={() => {
              setResult(null);
              setForm(EMPTY);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            Register another
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section title="New reseller" description="They'll get an email to activate their reseller panel.">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="r-name" label="Contact name">
            <input id="r-name" className={inputClass} value={form.name} onChange={set('name')} minLength={2} maxLength={80} required />
          </Field>
          <Field id="r-business" label="Business name (optional)">
            <input id="r-business" className={inputClass} value={form.businessName} onChange={set('businessName')} maxLength={120} />
          </Field>
          <Field id="r-email" label="Email">
            <input id="r-email" type="email" className={inputClass} value={form.email} onChange={set('email')} maxLength={254} required />
          </Field>
          <Field id="r-phone" label="Phone (optional)">
            <input id="r-phone" type="tel" className={inputClass} value={form.phone} onChange={set('phone')} maxLength={30} />
          </Field>
        </div>
        <Field id="r-notes" label="Internal notes (optional)" hint="Only visible to APV — never shown to the reseller.">
          <textarea id="r-notes" rows={2} className={`${inputClass} resize-none`} value={form.notes} onChange={set('notes')} maxLength={1000} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-ink-100">
          <input type="checkbox" checked={form.sendEmail} onChange={set('sendEmail')} className="w-4 h-4 accent-sage-300" />
          Email the activation link to the reseller
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-sage-300 px-6 py-3 font-semibold text-ink-950 hover:bg-sage-200 disabled:opacity-60 disabled:hover:bg-sage-300 transition-colors"
        >
          {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
          {busy ? 'Registering…' : 'Register reseller'}
        </button>
      </form>
    </Section>
  );
};

const ResellersPage = () => {
  useNoIndex('Resellers · Admin');
  const [state, setState] = useState({ status: 'loading', items: [], error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    api('/api/admin/resellers', { signal: controller.signal })
      .then((data) => setState({ status: 'ready', items: data.items, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', items: [], error: err.message });
      });
    return () => controller.abort();
  }, [reloadKey]);

  return (
    <div className="min-h-screen bg-ink-900">
      <AppHeader subtitle="SUPER ADMIN · RESELLERS" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AdminNav refreshKey={reloadKey} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-ink-50">Resellers</h1>
          <p className="mt-1 text-ink-100">People who buy NFC products from APV and resell them. They only see their own stock and clients.</p>
        </div>

        <NewResellerForm onCreated={refresh} />

        <section className="space-y-3">
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink-50">
            All resellers <span className="nums text-ink-200 font-normal">({state.items.length})</span>
          </h2>
          {state.status === 'error' && <Alert>{state.error}</Alert>}
          {state.status === 'loading' && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-sage-300" aria-hidden="true" />
            </div>
          )}
          {state.status === 'ready' && state.items.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-ink-200">
              No resellers yet. Register the first one above.
            </div>
          )}
          <ul className="space-y-3">
            {state.items.map((r) => (
              <li key={r.id}>
                <Link
                  to={`/admin/resellers/${r.id}`}
                  className="surface group flex flex-col md:flex-row md:items-center gap-3 rounded-3xl p-4 hover:border-white/20 hover:bg-ink-750 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl border border-gold-400/25 bg-gold-400/[0.08] text-gold-300 flex items-center justify-center flex-shrink-0">
                      <Store size={20} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-ink-50 truncate">{r.businessName || r.name}</p>
                      <p className="text-sm text-ink-200 truncate">
                        {r.businessName ? `${r.name} · ` : ''}
                        {r.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <StatusBadge status={r.status} />
                    <span className="nums text-ink-100">
                      <strong className="font-semibold text-ink-50">{r.stock.available}</strong> available / {r.stock.purchased} bought
                    </span>
                    <span className="nums text-ink-100">
                      <strong className="font-semibold text-ink-50">{r.clients}</strong> clients
                    </span>
                    <ChevronRight size={18} className="text-ink-200 group-hover:text-ink-50 group-hover:translate-x-0.5 transition" aria-hidden="true" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default ResellersPage;
