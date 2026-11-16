import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, Mail, Pencil, Send } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { ActionButton, Alert, CopyButton, Field, ProductBadges, StatusBadge, inputClass, selectClass } from '../../components/nfc/ui';
import ProductsEditor from '../../components/nfc/ProductsEditor';
import InviteLinkBox from '../admin/InviteLinkBox';
import { api } from '../../lib/api';
import { cardPublicUrl, cardStatus, initials } from '../../lib/nfc';
import { REQUEST_TYPES } from '../../lib/requests';

/** Request form: resellers can't change a card's state themselves, they ask APV. */
const RequestChange = ({ card, onSent }) => {
  const options = Object.entries(REQUEST_TYPES).filter(([id]) => (id === 'deactivate' ? card.active : id === 'reactivate' ? !card.active : true));
  const [type, setType] = useState(options[0][0]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await api(`/api/reseller/cards/${card.id}/requests`, { method: 'POST', body: { type, message } });
      setMessage('');
      setMsg({ kind: 'success', text: 'Request sent. APV will review it and you will see the result in "My requests".' });
      onSent?.();
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
      <div>
        <p className="font-semibold text-ink-50">Request a change from APV</p>
        <p className="text-xs text-ink-200">To turn this product off, back on, or remove the client, send a request. APV applies it after review.</p>
      </div>
      {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
      <div className="grid sm:grid-cols-[220px_minmax(0,1fr)] gap-3">
        <Field id={`rq-type-${card.id}`} label="What do you need?">
          <select id={`rq-type-${card.id}`} className={`${selectClass} w-full py-2.5`} value={type} onChange={(e) => setType(e.target.value)}>
            {options.map(([id, t]) => (
              <option key={id} value={id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`rq-msg-${card.id}`} label={type === 'other' ? 'Describe your request' : 'Reason (optional)'} hint={REQUEST_TYPES[type].hint}>
          <input
            id={`rq-msg-${card.id}`}
            className={inputClass}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            required={type === 'other'}
            placeholder={type === 'deactivate' ? 'e.g. Client lost the bracelet' : ''}
          />
        </Field>
      </div>
      <ActionButton type="submit" icon={Send} busy={busy}>
        Send request
      </ActionButton>
    </form>
  );
};

const ResellerCardRow = ({ card, stock, onChanged, onRequestSent }) => {
  const [open, setOpen] = useState(false);
  const [invite, setInvite] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const url = cardPublicUrl(card);
  const name = card.profile?.fullName || card.owner?.name || 'Unnamed';
  const editable = card.owner?.status === 'invited';

  const resendInvite = async () => {
    setBusy(true);
    setError('');
    try {
      setInvite(await api(`/api/reseller/cards/${card.id}/invite`, { method: 'POST', body: { sendEmail: true } }));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="surface rounded-3xl">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden ring-1 ring-white/10"
            style={{ backgroundColor: card.profile?.accentColor || '#263646' }}
            aria-hidden="true"
          >
            {card.profile?.avatarUrl ? <img src={card.profile.avatarUrl} alt="" className="w-full h-full object-cover" /> : initials(name)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-ink-50 truncate">{name}</p>
            <p className="text-sm text-ink-200 truncate">{card.owner?.email}</p>
            <p className="mt-1 text-xs">
              <ProductBadges card={card} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-mono text-xs rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-ink-100">{card.code}</span>
          <StatusBadge status={cardStatus(card)} />
          <span className="nums inline-flex items-center gap-1 text-ink-200" title="Profile views">
            <Eye size={14} aria-hidden="true" /> {card.views}
          </span>
          <span className="text-ink-200 hidden lg:inline">{new Date(card.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton value={url} label="NFC link" className="!px-2.5" />
          {editable && (
            <Link
              to={`/reseller/cards/${card.id}`}
              aria-label={`Fill in profile of ${name}`}
              className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
            >
              <Pencil size={16} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-2 text-sm font-semibold text-ink-50 transition-colors ${
              open ? 'border-white/25 bg-white/[0.07]' : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.07]'
            }`}
          >
            More {open ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/[0.08] p-4 space-y-4">
          <Alert>{error}</Alert>
          <CardLinkBox url={url} code={card.code} title="NFC link to program" compact />
          <ProductsEditor
            card={card}
            stock={stock}
            onAdd={async (type, qty) => {
              await api(`/api/reseller/cards/${card.id}/products`, { method: 'POST', body: { type, qty } });
              onChanged?.(); // reloads the list + stock
            }}
          />

          {editable &&
            (invite ? (
              <InviteLinkBox name={card.owner?.name} inviteUrl={invite.inviteUrl} email={invite.email} />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-ink-100">The client hasn't activated their account yet.</p>
                <ActionButton icon={Mail} busy={busy} onClick={resendInvite}>
                  Send new activation link
                </ActionButton>
              </div>
            ))}

          <RequestChange card={card} onSent={onRequestSent} />
        </div>
      )}
    </li>
  );
};

export default ResellerCardRow;
