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
    <li className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[#263646]">
            <span className={`mr-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${type.cls}`}>{type.label}</span>
            {request.clientName || 'Client'} <span className="font-mono text-xs text-gray-500">({request.cardCode})</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            From <strong className="text-[#263646]">{request.reseller?.businessName || request.reseller?.name || 'reseller'}</strong> ·{' '}
            {new Date(request.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
      {request.message && <p className="rounded-xl bg-[#F8F9FA] px-4 py-3 text-sm text-gray-700 whitespace-pre-line">{request.message}</p>}
      {error && <Alert>{error}</Alert>}

      {request.status === 'pending' ? (
        <div className="flex flex-col sm:flex-row gap-2">
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
        <p className="text-sm text-gray-600">
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
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="SUPER ADMIN · REQUESTS" />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AdminNav refreshKey={reloadKey} />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">Reseller requests</h1>
          <p className="text-gray-600">
            Resellers can't turn cards off or delete them. They ask here, and approving applies the change automatically.
          </p>
        </div>

        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setState((s) => ({ ...s, status: 'loading' }));
              }}
              aria-pressed={tab === t.id}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-[#263646] text-white' : 'text-gray-600 hover:text-[#263646]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {state.status === 'error' && <Alert>{state.error}</Alert>}
        {state.status === 'loading' && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
          </div>
        )}
        {state.status === 'ready' && state.items.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            <Inbox size={28} aria-hidden="true" />
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
