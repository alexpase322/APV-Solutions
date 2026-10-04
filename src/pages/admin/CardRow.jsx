import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, ChevronDown, ChevronUp, Eye, Loader2, Mail, Pencil, Power, Save, Trash2, Unlock } from 'lucide-react';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, CopyButton, StatusBadge, inputClass } from '../../components/nfc/ui';
import InviteLinkBox from './InviteLinkBox';
import { api } from '../../lib/api';
import { cardPublicUrl, cardStatus, initials } from '../../lib/nfc';

const ActionButton = ({ onClick, icon, children, danger, busy, disabled }) => {
  const Icon = icon;
  return (
  <button
    type="button"
    onClick={onClick}
    disabled={busy || disabled}
    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
      danger ? 'border-red-200 text-red-700 hover:bg-red-50' : 'border-gray-200 text-[#263646] hover:border-[#263646]'
    }`}
  >
    {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Icon size={15} aria-hidden="true" />}
    {children}
  </button>
  );
};

const CardRow = ({ card, onChange, onDeleted }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [invite, setInvite] = useState(null);
  const [notes, setNotes] = useState(card.notes || '');

  const url = cardPublicUrl(card);
  const status = cardStatus(card);
  const name = card.profile?.fullName || card.owner?.name || 'Unnamed';

  const run = async (key, fn) => {
    setBusy(key);
    setError('');
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy('');
    }
  };

  const patch = (body) =>
    run(Object.keys(body)[0], async () => {
      const data = await api(`/api/admin/cards/${card.id}`, { method: 'PATCH', body });
      onChange(data.card);
    });

  const resendInvite = () =>
    run('invite', async () => {
      setInvite(await api(`/api/admin/cards/${card.id}/invite`, { method: 'POST', body: { sendEmail: true } }));
    });

  const remove = () => {
    if (!window.confirm(`Delete the card of ${name}? Their account and profile will be permanently removed and the NFC link will stop working.`)) return;
    run('delete', async () => {
      await api(`/api/admin/cards/${card.id}`, { method: 'DELETE' });
      onDeleted(card.id);
    });
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
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="font-mono text-xs bg-[#F8F9FA] border border-gray-100 rounded px-2 py-1 text-[#263646]">{card.code}</span>
          <StatusBadge status={status} />
          <span className="inline-flex items-center gap-1 text-gray-500" title="Profile views">
            <Eye size={14} aria-hidden="true" /> {card.views}
          </span>
          <span className="text-gray-500 hidden lg:inline">{new Date(card.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton value={url} label="NFC link" className="!px-2.5" />
          <Link
            to={`/admin/cards/${card.id}`}
            aria-label={`Edit profile of ${name}`}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-[#263646] hover:border-[#263646] transition-colors"
          >
            <Pencil size={16} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-[#263646] hover:border-[#263646] transition-colors"
          >
            Manage {open ? <ChevronUp size={15} aria-hidden="true" /> : <ChevronDown size={15} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          <Alert>{error}</Alert>
          <CardLinkBox url={url} code={card.code} title="NFC link" compact />

          {card.owner?.status === 'invited' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">The client hasn't activated their account yet.</p>
              {invite ? (
                <InviteLinkBox name={card.owner?.name} inviteUrl={invite.inviteUrl} email={invite.email} />
              ) : (
                <ActionButton onClick={resendInvite} icon={Mail} busy={busy === 'invite'}>
                  Send new activation link
                </ActionButton>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor={`notes-${card.id}`} className="text-sm font-medium text-[#263646]">
              Internal notes
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                id={`notes-${card.id}`}
                rows={2}
                className={`${inputClass} resize-none`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={1000}
              />
              <ActionButton onClick={() => patch({ notes })} icon={Save} busy={busy === 'notes'} disabled={notes === (card.notes || '')}>
                Save
              </ActionButton>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            <ActionButton onClick={() => patch({ active: !card.active })} icon={Power} busy={busy === 'active'}>
              {card.active ? 'Turn card off' : 'Turn card on'}
            </ActionButton>
            {card.owner?.status === 'disabled' ? (
              <ActionButton onClick={() => patch({ blocked: false })} icon={Unlock} busy={busy === 'blocked'}>
                Unblock client
              </ActionButton>
            ) : (
              <ActionButton onClick={() => patch({ blocked: true })} icon={Ban} busy={busy === 'blocked'}>
                Block client
              </ActionButton>
            )}
            <ActionButton onClick={remove} icon={Trash2} danger busy={busy === 'delete'}>
              Delete
            </ActionButton>
          </div>
          {card.owner?.lastLoginAt && (
            <p className="text-xs text-gray-500">Last login: {new Date(card.owner.lastLoginAt).toLocaleString()}</p>
          )}
        </div>
      )}
    </li>
  );
};

export default CardRow;
