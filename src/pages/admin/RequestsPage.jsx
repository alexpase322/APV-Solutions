import React, { useCallback, useEffect, useState } from 'react';
import { Check, Inbox, Loader2, X } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import { ActionButton, Alert, inputClass } from '../../components/nfc/ui';
import AdminNav from './AdminNav';
import { api } from '../../lib/api';
import { REQUEST_TYPES } from '../../lib/requests';
import useNoIndex from '../../hooks/useNoIndex';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

// Dark-theme badge tones (the `cls` in lib/requests.js is tuned for light backgrounds).
const RequestItem = ({ request, onResolved }) => {
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const type = REQUEST_TYPES[request.type];

  const resolve = async (decision) => {
    if (decision === 'approve' && request.type === 'delete' && !window.confirm(`Delete ${request.clientName || request.cardCode}? This can't be undone.`)) return;
    setBusy(decision);
    setError('');
    try {
      await api(`/api/admin/requests/${request.id}/resolve`, { method: 'POST', body: { decision, adminNote: note } });
      onResolved();
    } catch (err) {
      setError(err.message);
      setBusy('');
    }
  };

  return (
    <li className="surface rounded-3xl p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-ink-50">
            <span className={`mr-2 inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${type.cls}`}>{type.label}</span>
            {request.clientName || 'Client'} <span className="font-mono text-xs text-ink-200">({request.cardCode})</span>
          </p>
          <p className="text-sm text-ink-200 mt-1">
            From <strong className="font-semibold text-ink-50">{request.reseller?.businessName || request.reseller?.name || 'reseller'}</strong> ·{' '}
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      {request.message && (
        <p className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-ink-100 whitespace-pre-line">{request.message}</p>
      )}
      {error && <Alert>{error}</Alert>}

      {request.status === 'pending' ? (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <input
            aria-label="Note for the reseller (optional)"
            className={inputClass}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={500}
            placeholder="Note for the reseller (optional)"
          />
          <div className="flex gap-2 flex-shrink-0">
            <ActionButton icon={Check} busy={busy === 'approve'} disabled={!!busy} onClick={() => resolve('approve')}>
              {request.type === 'other' ? 'Mark done' : 'Approve & apply'}
            </ActionButton>
            <ActionButton icon={X} danger busy={busy === 'reject'} disabled={!!busy} onClick={() => resolve('reject')}>
              Reject
            </ActionButton>
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-100">
          {request.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(request.resolvedAt).toLocaleString()}
          {request.adminNote ? ` — “${request.adminNote}”` : ''}
        </p>
      )}
    </li>
  );
};

const RequestsPage = () => {
  useNoIndex('Requests · Admin');
  const [tab, setTab] = useState('pending');
  const [state, setState] = useState({ status: 'loading', items: [], error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    api(`/api/admin/requests?status=${tab}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', items: data.items, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', items: [], error: err.message });
      });
    return () => controller.abort();
  }, [tab, reloadKey]);

  return (
    <div className="min-h-screen bg-ink-900">
      <AppHeader subtitle="SUPER ADMIN · REQUESTS" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AdminNav refreshKey={reloadKey} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-ink-50">Reseller requests</h1>
          <p className="mt-1 text-ink-100">
            Resellers can't turn cards off or delete them. They ask here, and approving applies the change automatically.
          </p>
        </div>

        <div className="flex gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setState((s) => ({ ...s, status: 'loading' }));
              }}
              aria-pressed={tab === t.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-sage-300 text-ink-950' : 'text-ink-200 hover:bg-white/[0.05] hover:text-ink-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {state.status === 'error' && <Alert>{state.error}</Alert>}
        {state.status === 'loading' && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-sage-300" aria-hidden="true" />
          </div>
        )}
        {state.status === 'ready' && state.items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-ink-200">
            <Inbox size={28} className="text-sage-300" aria-hidden="true" />
            {tab === 'pending' ? 'No pending requests. All caught up!' : `No ${tab} requests.`}
          </div>
        )}
        {state.status === 'ready' && state.items.length > 0 && (
          <ul className="space-y-3">
            {state.items.map((r) => (
              <RequestItem key={r.id} request={r} onResolved={refresh} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default RequestsPage;
