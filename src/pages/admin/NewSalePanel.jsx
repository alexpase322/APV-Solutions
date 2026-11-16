import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Minus, Pencil, Plus, UserPlus } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, Field, Section, inputClass } from '../../components/nfc/ui';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import { cardPublicUrl } from '../../lib/nfc';
import { PRODUCTS, productById, productsLabel, productsOf } from '../../lib/products';

const MAX_PER_PRODUCT = 20;

/**
 * Sale form shared by the super admin and resellers. A client can buy a bundle (e.g. 1 card + 1 bracelet):
 * every product is programmed with the same NFC link.
 *
 * @param {string}   props.endpoint   POST endpoint that creates the client + card
 * @param {(card) => string} props.editPath  Where "Fill in profile now" goes
 * @param {Object<string, number>} [props.stock]  Available units per product (resellers). Omit = unlimited (APV).
 * @param {string}   [props.notesHint]
 * @param {(data) => void} [props.onCreated]
 */
const NewSalePanel = ({ endpoint, editPath, stock, notesHint, onCreated }) => {
  const limitOf = (id) => (stock ? Math.min(MAX_PER_PRODUCT, stock[id] || 0) : MAX_PER_PRODUCT);
  const firstAvailable = PRODUCTS.find((p) => limitOf(p.id) > 0)?.id;
  const initialQty = () => (firstAvailable ? { [firstAvailable]: 1 } : {});

  const emptyForm = { name: '', email: '', notes: '', sendEmail: true };
  const [form, setForm] = useState(emptyForm);
  const [qty, setQty] = useState(initialQty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const change = (id, delta) =>
    setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(limitOf(id), (q[id] || 0) + delta)) }));

  const products = PRODUCTS.filter((p) => (qty[p.id] || 0) > 0).map((p) => ({ type: p.id, qty: qty[p.id] }));
  // Stock can drop after a sale: never send more than what's available now
  const overStock = products.some((p) => p.qty > limitOf(p.type));
  const outOfStock = stock && !firstAvailable;

  const submit = async (e) => {
    e.preventDefault();
    if (!products.length) return setError('Choose at least one product.');
    setBusy(true);
    setError('');
    try {
      const data = await api(endpoint, { method: 'POST', body: { ...form, products } });
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
    setForm(emptyForm);
    setQty(initialQty());
  };

  if (result) {
    const sold = productsOf(result.card);
    const label = productsLabel(sold);
    return (
      <Section
        title={
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="text-sage-300" size={22} aria-hidden="true" /> {label} for {result.card.owner?.name}
          </span>
        }
        description={
          sold.length > 1 || sold[0].qty > 1
            ? `Program this same link on every product: ${label}. Use the free “NFC Tools” app → Write → Add a record → URL.`
            : 'Program the NFC chip with the link below (e.g. with the free “NFC Tools” app → Write → Add a record → URL).'
        }
      >
        <CardLinkBox
          url={cardPublicUrl(result.card)}
          code={result.card.code}
          title={sold.length > 1 || sold[0].qty > 1 ? 'Link to program on all products' : `Link to program on the ${productById(sold[0].type).label}`}
          description={`Code: ${result.card.code}. This link never changes, even if the client edits their profile.`}
        />
        <InviteLinkBox name={result.card.owner?.name} inviteUrl={result.inviteUrl} email={result.email} />
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to={editPath(result.card)}
            className="inline-flex items-center gap-2 rounded-full bg-sage-300 px-5 py-3 font-semibold text-ink-950 hover:bg-sage-200 transition-colors"
          >
            <Pencil size={16} aria-hidden="true" /> Fill in profile now
          </Link>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            <Plus size={16} aria-hidden="true" /> New sale
          </button>
        </div>
      </Section>
    );
  }

  return (
    <Section title="New sale" description="Creates the client's account and one NFC link for everything they bought, and emails them an activation link.">
      {outOfStock ? (
        <Alert kind="info">You have no units available right now. Contact APV Business Solutions to get more products.</Alert>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <Alert>{error}</Alert>

          <fieldset>
            <legend className="block text-sm font-medium text-ink-100 mb-1">Products</legend>
            <p className="text-xs text-ink-200 mb-2">Selling a bundle? Add each product — they will all use the same link.</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {PRODUCTS.map((p) => {
                const limit = limitOf(p.id);
                const n = qty[p.id] || 0;
                const disabled = limit <= 0;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl border p-3 transition-colors ${
                      disabled
                        ? 'border-dashed border-white/[0.08] bg-transparent text-ink-200'
                        : n > 0
                          ? 'border-sage-300/50 bg-sage-300/[0.08] text-ink-50'
                          : 'border-white/10 bg-white/[0.02] text-ink-50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <p.icon size={20} aria-hidden="true" className={disabled ? 'text-ink-300' : n > 0 ? 'text-sage-300' : 'text-ink-100'} />
                      <span className="text-sm font-semibold">{p.short}</span>
                    </div>
                    {stock && (
                      <p className={`nums text-xs mt-0.5 ${disabled ? 'text-ink-200' : 'text-sage-200 font-semibold'}`}>
                        {stock[p.id] || 0} in stock
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between rounded-full border border-white/10 bg-ink-900/60 p-0.5" role="group" aria-label={`${p.label} quantity`}>
                      <button
                        type="button"
                        onClick={() => change(p.id, -1)}
                        disabled={n <= 0}
                        aria-label={`One less ${p.label}`}
                        className="rounded-full p-2 text-ink-50 transition-colors hover:bg-white/[0.07] disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Minus size={14} aria-hidden="true" />
                      </button>
                      <span className={`text-base font-semibold tabular-nums ${disabled ? 'text-ink-200' : 'text-ink-50'}`} aria-live="polite">
                        {n}
                      </span>
                      <button
                        type="button"
                        onClick={() => change(p.id, 1)}
                        disabled={disabled || n >= limit}
                        aria-label={`One more ${p.label}`}
                        className="rounded-full p-2 text-ink-50 transition-colors hover:bg-white/[0.07] disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Plus size={14} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
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
          <label className="flex items-center gap-2 text-sm text-ink-100">
            <input type="checkbox" checked={form.sendEmail} onChange={set('sendEmail')} className="w-4 h-4 accent-sage-300" />
            Email the activation link to the client
          </label>
          <button
            type="submit"
            disabled={busy || !products.length || overStock}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-300 px-6 py-3 font-semibold text-ink-950 hover:bg-sage-200 disabled:opacity-60 disabled:hover:bg-sage-300 transition-colors"
          >
            {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {busy ? 'Creating…' : products.length ? `Create client · ${productsLabel(products)}` : 'Choose a product'}
          </button>
        </form>
      )}
    </Section>
  );
};

export default NewSalePanel;
