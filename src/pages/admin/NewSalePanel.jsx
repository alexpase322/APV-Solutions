import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Pencil, Plus, UserPlus } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, Field, Section, inputClass } from '../../components/nfc/ui';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import { cardPublicUrl } from '../../lib/nfc';
import { PRODUCTS, productById } from '../../lib/products';

/**
 * Sale form shared by the super admin and resellers.
 *
 * @param {string}   props.endpoint   POST endpoint that creates the client + card
 * @param {(card) => string} props.editPath  Where "Fill in profile now" goes
 * @param {Object<string, number>} [props.stock]  Available units per product (resellers). Omit = unlimited (APV).
 * @param {string}   [props.notesHint]
 * @param {(data) => void} [props.onCreated]
 */
const NewSalePanel = ({ endpoint, editPath, stock, notesHint, onCreated }) => {
  const firstAvailable = stock ? PRODUCTS.find((p) => (stock[p.id] || 0) > 0)?.id : 'card';
  const emptyForm = { name: '', email: '', notes: '', productType: firstAvailable || 'card', sendEmail: true };
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const outOfStock = stock && !PRODUCTS.some((p) => (stock[p.id] || 0) > 0);
  const selectedAvailable = !stock || (stock[form.productType] || 0) > 0;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api(endpoint, { method: 'POST', body: form });
      setResult(data);
      onCreated?.(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm({ ...emptyForm, productType: form.productType });
  };

  if (result) {
    const product = productById(result.card.productType);
    return (
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="text-[#94A378]" size={22} aria-hidden="true" /> {product.label} created for {result.card.owner?.name}
          </span>
        }
        description="Program the NFC chip with the link below (e.g. with the free “NFC Tools” app → Write → Add a record → URL)."
      >
        <CardLinkBox
          url={cardPublicUrl(result.card)}
          code={result.card.code}
          title={`Link to program on the ${product.label}`}
          description={`Code: ${result.card.code}. This link never changes, even if the client edits their profile.`}
        />
        <InviteLinkBox name={result.card.owner?.name} inviteUrl={result.inviteUrl} email={result.email} />
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={editPath(result.card)}
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
    <Section title="New sale" description="Creates the client's account and NFC profile, and emails them an activation link.">
      {outOfStock ? (
        <Alert kind="info">You have no units available right now. Contact APV Business Solutions to get more products.</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Alert>{error}</Alert>

          <fieldset>
            <legend className="block text-sm font-medium text-[#263646] mb-2">Product</legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRODUCTS.map((p) => {
                const available = stock ? stock[p.id] || 0 : null;
                const disabled = stock ? available <= 0 : false;
                const selected = form.productType === p.id;
                return (
                  <label
                    key={p.id}
                    className={`relative flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition-colors ${
                      disabled
                        ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : selected
                          ? 'border-[#263646] bg-[#263646]/5 text-[#263646] cursor-pointer'
                          : 'border-gray-200 text-[#263646] hover:border-gray-400 cursor-pointer'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productType"
                      value={p.id}
                      checked={selected}
                      disabled={disabled}
                      onChange={set('productType')}
                      aria-label={stock ? `${p.label}, ${available} left` : p.label}
                      className="sr-only"
                    />
                    <p.icon size={22} aria-hidden="true" />
                    <span className="text-sm font-semibold">{p.short}</span>
                    {stock && (
                      <span className={`text-xs ${disabled ? 'text-gray-400' : 'text-[#4d5a37] font-semibold'}`}>
                        {available} left
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field id="sale-name" label="Client name">
              <input id="sale-name" className={inputClass} value={form.name} onChange={set('name')} minLength={2} maxLength={80} required placeholder="Jane Doe" />
            </Field>
            <Field id="sale-email" label="Client email">
              <input id="sale-email" type="email" className={inputClass} value={form.email} onChange={set('email')} maxLength={254} required placeholder="client@email.com" />
            </Field>
          </div>
          <Field id="sale-notes" label="Notes (optional)" hint={notesHint}>
            <textarea id="sale-notes" rows={2} className={`${inputClass} resize-none`} value={form.notes} onChange={set('notes')} maxLength={1000} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-[#263646]">
            <input type="checkbox" checked={form.sendEmail} onChange={set('sendEmail')} className="w-4 h-4 accent-[#263646]" />
            Email the activation link to the client
          </label>
          <button
            type="submit"
            disabled={busy || !selectedAvailable}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] px-6 py-3 font-bold text-white hover:bg-[#94A378] disabled:opacity-60 transition-colors"
          >
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {busy ? 'Creating…' : `Create ${productById(form.productType).short.toLowerCase()}`}
          </button>
        </form>
      )}
    </Section>
  );
};

export default NewSalePanel;
