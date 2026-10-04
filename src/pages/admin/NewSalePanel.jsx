import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Pencil, Plus, UserPlus } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, Field, Section, inputClass } from '../../components/nfc/ui';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import { cardPublicUrl } from '../../lib/nfc';

const NewSalePanel = ({ onCreated }) => {
  const [form, setForm] = useState({ name: '', email: '', notes: '', sendEmail: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/admin/cards', { method: 'POST', body: form });
      setResult(data);
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm({ name: '', email: '', notes: '', sendEmail: true });
  };

  if (result) {
    return (
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="text-[#94A378]" size={22} aria-hidden="true" /> Card created for {result.card.owner?.name}
          </span>
        }
        description="Program the NFC chip with the link below (e.g. with the free “NFC Tools” app → Write → Add a record → URL)."
      >
        <CardLinkBox
          url={cardPublicUrl(result.card)}
          code={result.card.code}
          title="Link to program on the NFC card"
          description={`Card code: ${result.card.code}. This link never changes, even if the client edits their profile.`}
        />
        <InviteLinkBox name={result.card.owner?.name} inviteUrl={result.inviteUrl} email={result.email} />
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={`/admin/cards/${result.card.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-[#263646] px-5 py-3 font-semibold text-white hover:bg-[#94A378] transition-colors"
          >
            <Pencil size={16} aria-hidden="true" /> Fill in profile now
          </Link>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-[#263646] hover:border-[#263646] transition-colors"
          >
            <Plus size={16} aria-hidden="true" /> New sale
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section title="New sale" description="Creates the client's account and card, and emails them an activation link.">
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="sale-name" label="Client name">
            <input id="sale-name" className={inputClass} value={form.name} onChange={set('name')} minLength={2} maxLength={80} required placeholder="Jane Doe" />
          </Field>
          <Field id="sale-email" label="Client email">
            <input id="sale-email" type="email" className={inputClass} value={form.email} onChange={set('email')} maxLength={254} required placeholder="client@email.com" />
          </Field>
        </div>
        <Field id="sale-notes" label="Internal notes (optional)" hint="Only visible to admins — e.g. card design, payment method, seller.">
          <textarea id="sale-notes" rows={2} className={`${inputClass} resize-none`} value={form.notes} onChange={set('notes')} maxLength={1000} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-[#263646]">
          <input type="checkbox" checked={form.sendEmail} onChange={set('sendEmail')} className="w-4 h-4 accent-[#263646]" />
          Email the activation link to the client
        </label>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] px-6 py-3 font-bold text-white hover:bg-[#94A378] disabled:opacity-60 transition-colors"
        >
          {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
          {busy ? 'Creating…' : 'Create card'}
        </button>
      </form>
    </Section>
  );
};

export default NewSalePanel;
