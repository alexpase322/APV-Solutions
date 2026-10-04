import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import { Alert, inputClass } from '../../components/nfc/ui';
import NewSalePanel from './NewSalePanel';
import CardRow from './CardRow';
import { api } from '../../lib/api';
import useNoIndex from '../../hooks/useNoIndex';

const STATUS_FILTERS = [
  { id: '', label: 'All' },
  { id: 'invited', label: 'Pending' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Card off' },
  { id: 'disabled', label: 'Blocked' },
];

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold text-[#263646] mt-1">{value ?? '—'}</p>
  </div>
);

const AdminPage = () => {
  useNoIndex('Admin · APV Cards');
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({ search: '', status: '', page: 1 });
  const [list, setList] = useState({ status: 'loading', items: [], total: 0, pages: 1, error: '' });
  const [reloadKey, setReloadKey] = useState(0);

  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setQuery((q) => (q.search === search.trim() ? q : { ...q, search: search.trim(), page: 1 })), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    api('/api/admin/stats', { signal: controller.signal })
      .then(setStats)
      .catch(() => {});
    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ page: String(query.page), limit: '20' });
    if (query.search) params.set('search', query.search);
    if (query.status) params.set('status', query.status);

    api(`/api/admin/cards?${params}`, { signal: controller.signal })
      .then((data) => setList({ status: 'ready', ...data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setList((l) => ({ ...l, status: 'error', error: err.message }));
      });
    return () => controller.abort();
  }, [query, reloadKey]);

  const updateItem = (card) => {
    setList((l) => ({ ...l, items: l.items.map((c) => (c.id === card.id ? card : c)) }));
    refresh();
  };
  const removeItem = (id) => {
    setList((l) => ({ ...l, items: l.items.filter((c) => c.id !== id), total: l.total - 1 }));
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="SUPER ADMIN · NFC CARDS" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">NFC Cards</h1>
          <p className="text-gray-600">Register sales, get the link to program each card and manage clients.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <Stat label="Cards" value={stats?.totalCards} />
          <Stat label="Activated" value={stats?.activated} />
          <Stat label="Pending" value={stats?.invited} />
          <Stat label="Blocked" value={stats?.blocked} />
          <Stat label="Total views" value={stats?.totalViews?.toLocaleString()} />
        </div>

        <NewSalePanel onCreated={refresh} />

        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-lg font-bold text-[#263646] md:mr-auto">
              Clients <span className="text-gray-400 font-normal">({list.total})</span>
            </h2>
            <div className="relative md:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search clients"
                placeholder="Name, email or code…"
                className={`${inputClass} pl-9`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-1 bg-white border border-gray-100 rounded-xl p-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setQuery((q) => ({ ...q, status: f.id, page: 1 }))}
                  aria-pressed={query.status === f.id}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    query.status === f.id ? 'bg-[#263646] text-white' : 'text-gray-600 hover:text-[#263646]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {list.status === 'error' && <Alert>{list.error}</Alert>}
          {list.status === 'loading' && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
            </div>
          )}
          {list.status === 'ready' && list.items.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
              {query.search || query.status ? 'No clients match your filters.' : 'No cards yet. Register your first sale above.'}
            </div>
          )}
          {list.items.length > 0 && (
            <ul className="space-y-3">
              {list.items.map((card) => (
                <CardRow key={card.id} card={card} onChange={updateItem} onDeleted={removeItem} />
              ))}
            </ul>
          )}

          {list.pages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                disabled={query.page <= 1}
                aria-label="Previous page"
                className="rounded-lg border border-gray-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <span className="text-sm text-gray-600">
                Page {query.page} of {list.pages}
              </span>
              <button
                type="button"
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                disabled={query.page >= list.pages}
                aria-label="Next page"
                className="rounded-lg border border-gray-200 bg-white p-2 disabled:opacity-40"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
