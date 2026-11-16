import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Ban, Loader2, Mail, PackagePlus, Save, Trash2, Unlock, Users } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import { ActionButton, Alert, Field, Section, StatusBadge, inputClass, selectClass } from '../../components/nfc/ui';
import AdminNav from './AdminNav';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import { PRODUCTS, productById } from '../../lib/products';
import useNoIndex from '../../hooks/useNoIndex';

const money = (n) => (n == null ? '—' : `$${Number(n).toFixed(2)}`);

const InfoSection = ({ reseller, clients, onSaved, onDeleted }) => {
  const [form, setForm] = useState({
    name: reseller.name,
    businessName: reseller.businessName || '',
    phone: reseller.phone || '',
    notes: reseller.adminNotes || '',
  });
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState(null);
  const [invite, setInvite] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const run = async (key, fn) => {
    setBusy(key);
    setMsg(null);
    try {
      await fn();
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy('');
    }
  };

  const patch = (body, okText) =>
    run(Object.keys(body)[0], async () => {
      const data = await api(`/api/admin/resellers/${reseller.id}`, { method: 'PATCH', body });
      onSaved(data.reseller);
      setMsg({ kind: 'success', text: okText });
    });

  const remove = () => {
    if (!window.confirm(`Delete reseller ${reseller.name}? This removes their account, stock history and requests.`)) return;
    run('delete', async () => {
      await api(`/api/admin/resellers/${reseller.id}`, { method: 'DELETE' });
      onDeleted();
    });
  };

  return (
    <Section title="Reseller details">
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          patch(form, 'Details saved.');
        }}
        className="space-y-4"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="d-name" label="Contact name">
            <input id="d-name" className={inputClass} value={form.name} onChange={set('name')} minLength={2} maxLength={80} required />
          </Field>
          <Field id="d-business" label="Business name">
            <input id="d-business" className={inputClass} value={form.businessName} onChange={set('businessName')} maxLength={120} />
          </Field>
          <Field id="d-email" label="Email (login)">
            <input id="d-email" className={`${inputClass} !bg-white/[0.02] !text-ink-200`} value={reseller.email} readOnly />
          </Field>
          <Field id="d-phone" label="Phone">
            <input id="d-phone" type="tel" className={inputClass} value={form.phone} onChange={set('phone')} maxLength={30} />
          </Field>
        </div>
        <Field id="d-notes" label="Internal notes" hint="Only visible to APV.">
          <textarea id="d-notes" rows={2} className={`${inputClass} resize-none`} value={form.notes} onChange={set('notes')} maxLength={1000} />
        </Field>
        <ActionButton type="submit" icon={Save} busy={busy === 'name'}>
          Save details
        </ActionButton>
      </form>

      {reseller.status === 'invited' &&
        (invite ? (
          <InviteLinkBox kind="reseller" name={reseller.name} inviteUrl={invite.inviteUrl} email={invite.email} />
        ) : (
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/[0.08]">
            <p className="text-sm text-ink-100">This reseller hasn't activated their account yet.</p>
            <ActionButton
              icon={Mail}
              busy={busy === 'invite'}
              onClick={() =>
                run('invite', async () => setInvite(await api(`/api/admin/resellers/${reseller.id}/invite`, { method: 'POST', body: { sendEmail: true } })))
              }
            >
              Send new activation link
            </ActionButton>
          </div>
        ))}

      <div className="flex flex-wrap gap-2 pt-4 border-t border-white/[0.08]">
        <Link
          to={`/admin?reseller=${reseller.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
        >
          <Users size={15} aria-hidden="true" /> View their {clients} clients
        </Link>
        {reseller.status === 'disabled' ? (
          <ActionButton icon={Unlock} busy={busy === 'blocked'} onClick={() => patch({ blocked: false }, 'Reseller unblocked.')}>
            Unblock reseller
          </ActionButton>
        ) : (
          <ActionButton icon={Ban} busy={busy === 'blocked'} onClick={() => patch({ blocked: true }, "Reseller blocked. Their clients' cards keep working.")}>
            Block reseller
          </ActionButton>
        )}
        {clients === 0 && (
          <ActionButton icon={Trash2} danger busy={busy === 'delete'} onClick={remove}>
            Delete
          </ActionButton>
        )}
      </div>
    </Section>
  );
};

const StockForm = ({ resellerId, onAdded }) => {
  const [form, setForm] = useState({ productType: 'bracelet', quantity: '', unitPrice: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const quantity = Number.parseInt(form.quantity, 10);
    if (!quantity) return setMsg({ kind: 'error', text: 'Enter a quantity (use a negative number to correct).' });
    setBusy(true);
    setMsg(null);
    try {
      const body = {
        productType: form.productType,
        quantity,
        note: form.note,
        ...(form.unitPrice !== '' ? { unitPrice: Number(form.unitPrice) } : {}),
      };
      const data = await api(`/api/admin/resellers/${resellerId}/stock`, { method: 'POST', body });
      onAdded(data);
      setForm((f) => ({ ...f, quantity: '', unitPrice: '', note: '' }));
      setMsg({
        kind: 'success',
        text: `${quantity > 0 ? 'Added' : 'Removed'} ${Math.abs(quantity)} × ${productById(form.productType).label}.`,
      });
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <p className="font-semibold text-ink-50">Register products sold to this reseller</p>
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Field id="s-product" label="Product">
          <select id="s-product" className={`${selectClass} w-full py-2.5`} value={form.productType} onChange={set('productType')}>
            {PRODUCTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="s-qty" label="Quantity">
          <input id="s-qty" type="number" step="1" min="-10000" max="10000" className={inputClass} value={form.quantity} onChange={set('quantity')} required placeholder="20" />
        </Field>
        <Field id="s-price" label="Unit price (optional)">
          <input id="s-price" type="number" step="0.01" min="0" className={inputClass} value={form.unitPrice} onChange={set('unitPrice')} placeholder="8.50" />
        </Field>
        <Field id="s-note" label="Note (optional)">
          <input id="s-note" className={inputClass} value={form.note} onChange={set('note')} maxLength={300} placeholder="Invoice #, payment…" />
        </Field>
      </div>
      <p className="text-xs text-ink-200">Use a negative quantity to correct a mistake or register returned units.</p>
      <ActionButton type="submit" icon={PackagePlus} busy={busy}>
        Add to stock
      </ActionButton>
    </form>
  );
};

const ResellerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ status: 'loading', data: null, error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);
  useNoIndex(state.data ? `${state.data.reseller.businessName || state.data.reseller.name} · Resellers` : 'Reseller · Admin');

  useEffect(() => {
    const controller = new AbortController();
    api(`/api/admin/resellers/${id}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', data: null, error: err.message });
      });
    return () => controller.abort();
  }, [id, reloadKey]);

  const d = state.data;

  return (
    <div className="min-h-screen bg-ink-900">
      <AppHeader subtitle="SUPER ADMIN · RESELLERS" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AdminNav refreshKey={reloadKey} />
        <Link to="/admin/resellers" className="group inline-flex items-center gap-1.5 rounded-full text-sm font-semibold text-ink-50 hover:text-sage-300 transition-colors">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" aria-hidden="true" /> All resellers
        </Link>

        {state.status === 'loading' && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-sage-300" aria-hidden="true" />
          </div>
        )}
        {state.status === 'error' && <Alert>{state.error}</Alert>}

        {d && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-ink-50">{d.reseller.businessName || d.reseller.name}</h1>
              <StatusBadge status={d.reseller.status} />
            </div>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 items-start">
              <InfoSection
                key={d.reseller.updatedAt}
                reseller={d.reseller}
                clients={d.clients.total}
                onSaved={refresh}
                onDeleted={() => navigate('/admin/resellers', { replace: true })}
              />

              <Section title="Stock" description="Units bought from APV, used for clients, and still available.">
                <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                  <table className="nums w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.03] text-left font-mono text-[11px] uppercase tracking-[0.14em] text-ink-200">
                        <th className="px-3 py-2.5 font-medium">Product</th>
                        <th className="px-3 py-2.5 font-medium text-right">Bought</th>
                        <th className="px-3 py-2.5 font-medium text-right">Used</th>
                        <th className="px-3 py-2.5 font-medium text-right">Available</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.inventory.map((row) => {
                        const product = productById(row.productType);
                        return (
                          <tr key={row.productType} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]">
                            <td className="px-3 py-2.5">
                              <span className="inline-flex items-center gap-2 font-medium text-ink-50">
                                <product.icon size={16} className="text-ink-200" aria-hidden="true" /> {product.label}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-right text-ink-100">{row.purchased}</td>
                            <td className="px-3 py-2.5 text-right text-ink-100">{row.used}</td>
                            <td className={`px-3 py-2.5 text-right font-bold ${row.available > 0 ? 'text-sage-200' : 'text-ink-200'}`}>{row.available}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <StockForm resellerId={d.reseller.id} onAdded={refresh} />
              </Section>
            </div>

            <Section title="Stock history" description="Every delivery or correction registered for this reseller.">
              {d.entries.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-center text-sm text-ink-200">No products registered yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
                  <table className="nums w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.03] text-left font-mono text-[11px] uppercase tracking-[0.14em] text-ink-200">
                        <th className="px-3 py-2.5 font-medium">Date</th>
                        <th className="px-3 py-2.5 font-medium">Product</th>
                        <th className="px-3 py-2.5 font-medium text-right">Qty</th>
                        <th className="px-3 py-2.5 font-medium text-right whitespace-nowrap">Unit price</th>
                        <th className="px-3 py-2.5 font-medium text-right">Total</th>
                        <th className="px-3 py-2.5 font-medium pl-4">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.entries.map((e) => (
                        <tr key={e.id} className="border-t border-white/[0.06] transition-colors hover:bg-white/[0.02]">
                          <td className="px-3 py-2.5 whitespace-nowrap text-ink-100">{new Date(e.createdAt).toLocaleDateString()}</td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-ink-50">{productById(e.productType).label}</td>
                          <td className={`px-3 py-2.5 text-right font-bold ${e.quantity > 0 ? 'text-sage-200' : 'text-red-300'}`}>
                            {e.quantity > 0 ? `+${e.quantity}` : e.quantity}
                          </td>
                          <td className="px-3 py-2.5 text-right text-ink-100">{money(e.unitPrice)}</td>
                          <td className="px-3 py-2.5 text-right text-ink-100">{e.unitPrice == null ? '—' : money(e.unitPrice * e.quantity)}</td>
                          <td className="px-3 py-2.5 pl-4 text-ink-100">{e.note || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Section>
          </>
        )}
      </main>
    </div>
  );
};

export default ResellerDetailPage;
