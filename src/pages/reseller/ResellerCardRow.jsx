import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Eye, Mail, Pencil, Send } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { ActionButton, Alert, CopyButton, Field, ProductBadge, StatusBadge, inputClass, selectClass } from '../../components/nfc/ui';
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
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-100 bg-[#F8F9FA] p-4">
      <div>
        <p className="font-semibold text-[#263646]">Request a change from APV</p>
        <p className="text-xs text-gray-500">To turn this product off, back on, or remove the client, send a request. APV applies it after review.</p>
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

const ResellerCardRow = ({ card, onRequestSent }) => {
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
    <li className="bg-white rounded-2xl border border-gray-100">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden"
            style={{ backgroundColor: card.profile?.accentColor || '#263646' }}
            aria-hidden="true"
          >
            {card.profile?.avatarUrl ? <img src={card.profile.avatarUrl} alt="" className="w-full h-full object-cover" /> : initials(name)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#263646] truncate">{name}</p>
            <p className="text-sm text-gray-500 truncate">{card.owner?.email}</p>
            <p className="mt-1 text-xs">
              <ProductBadge type={card.productType} />
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-mono text-xs bg-[#F8F9FA] border border-gray-100 rounded px-2 py-1 text-[#263646]">{card.code}</span>
          <StatusBadge status={cardStatus(card)} />
          <span className="inline-flex items-center gap-1 text-gray-500" title="Profile views">
            <Eye size={14} aria-hidden="true" /> {card.views}
          </span>
          <span className="text-gray-500 hidden lg:inline">{new Date(card.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton value={url} label="NFC link" className="!px-2.5" />
          {editable && (
            <Link
              to={`/reseller/cards/${card.id}`}
              aria-label={`Fill in profile of ${name}`}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-[#263646] hover:border-[#263646] transition-colors"
            >
              <Pencil size={16} aria-hidden="true" />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#263646] hover:border-[#263646] transition-colors"
          >
            More {open ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <Alert>{error}</Alert>
          <CardLinkBox url={url} code={card.code} title="NFC link to program" compact />

          {editable &&
            (invite ? (
              <InviteLinkBox name={card.owner?.name} inviteUrl={invite.inviteUrl} email={invite.email} />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-gray-600">The client hasn't activated their account yet.</p>
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
