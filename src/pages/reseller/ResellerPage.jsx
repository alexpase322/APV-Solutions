import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, PartyPopper, Search } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import { Alert, Pagination, Section, inputClass, selectClass } from '../../components/nfc/ui';
import NewSalePanel from '../admin/NewSalePanel';
import ResellerCardRow from './ResellerCardRow';
import { api } from '../../lib/api';
import { PRODUCTS, productById } from '../../lib/products';
import { REQUEST_STATUS, REQUEST_TYPES } from '../../lib/requests';
import useNoIndex from '../../hooks/useNoIndex';

const Stat = ({ label, value }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold text-[#263646] mt-1">{value ?? '—'}</p>
  </div>
);

const MyRequests = ({ reloadKey }) => {
  const [items, setItems] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    api('/api/reseller/requests', { signal: controller.signal })
      .then((data) => setItems(data.items))
      .catch(() => {});
    return () => controller.abort();
  }, [reloadKey]);

  if (!items || items.length === 0) return null;
  return (
    <Section title="My requests" description="Changes you asked APV to make.">
      <ul className="divide-y divide-gray-100">
        {items.map((r) => (
          <li key={r.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#263646]">
                {REQUEST_TYPES[r.type]?.label} · {r.clientName || r.cardCode}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleString()}
                {r.adminNote ? ` · APV: “${r.adminNote}”` : ''}
              </p>
            </div>
            <span className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${REQUEST_STATUS[r.status].cls}`}>
              {REQUEST_STATUS[r.status].label}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
};

const ResellerPage = () => {
  useNoIndex('Reseller panel · APV');
  const [params, setParams] = useSearchParams();
  const welcome = params.get('welcome') === '1';
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState({ search: '', product: '', page: 1 });
  const [list, setList] = useState({ status: 'loading', items: [], total: 0, pages: 1, error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const t = setTimeout(() => setQuery((q) => (q.search === search.trim() ? q : { ...q, search: search.trim(), page: 1 })), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    api('/api/reseller/summary', { signal: controller.signal })
      .then(setSummary)
      .catch(() => {});
    return () => controller.abort();
  }, [reloadKey]);

  useEffect(() => {
    const controller = new AbortController();
    const qs = new URLSearchParams({ page: String(query.page), limit: '20' });
    if (query.search) qs.set('search', query.search);
    if (query.product) qs.set('product', query.product);
    api(`/api/reseller/cards?${qs}`, { signal: controller.signal })
      .then((data) => setList({ status: 'ready', ...data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setList((l) => ({ ...l, status: 'error', error: err.message }));
      });
    return () => controller.abort();
  }, [query, reloadKey]);

  const stock = summary ? Object.fromEntries(summary.inventory.map((i) => [i.productType, i.available])) : null;
  const ownedProducts = summary ? summary.inventory.filter((i) => i.purchased > 0) : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="RESELLER PANEL" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {welcome && (
          <div className="flex items-start gap-3 rounded-2xl border border-[#94A378]/40 bg-[#94A378]/10 p-4 text-[#263646]">
            <PartyPopper size={22} className="text-[#94A378] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-bold">Your reseller account is active!</p>
              <p className="text-sm text-gray-700">
                For each product you sell, create the client below and program the NFC chip with the link you get.
              </p>
            </div>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="text-sm font-semibold text-[#263646] hover:underline">
              Got it
            </button>
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">
            {summary?.reseller.businessName || summary?.reseller.name || 'Reseller panel'}
          </h1>
          <p className="text-gray-600">Your stock and the clients you've registered. Only you can see them.</p>
        </div>

        {/* Stock */}
        <section aria-label="Your stock" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(ownedProducts.length ? ownedProducts : summary?.inventory.slice(0, 2) || []).map((i) => {
            const product = productById(i.productType);
            return (
              <div key={i.productType} className="bg-white rounded-2xl border border-gray-100 p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <product.icon size={14} aria-hidden="true" /> {product.label}
                </p>
                <p className={`text-3xl font-bold mt-1 ${i.available > 0 ? 'text-[#263646]' : 'text-gray-400'}`}>{i.available}</p>
                <p className="text-xs text-gray-500">available · {i.used} of {i.purchased} used</p>
              </div>
            );
          })}
        </section>

        <div className="grid grid-cols-3 gap-3">
          <Stat label="Clients" value={summary?.clients.total} />
          <Stat label="Activated" value={summary?.clients.active} />
          <Stat label="Profile views" value={summary?.clients.views?.toLocaleString()} />
        </div>

        {summary ? (
          <NewSalePanel
            endpoint="/api/reseller/cards"
            editPath={(card) => `/reseller/cards/${card.id}`}
            stock={stock}
            notesHint="Only visible to you and APV — e.g. payment, design."
            onCreated={refresh}
          />
        ) : (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
          </div>
        )}

        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-lg font-bold text-[#263646] md:mr-auto">
              My clients <span className="text-gray-400 font-normal">({list.total})</span>
            </h2>
            <div className="relative md:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search my clients"
                placeholder="Name, email or code…"
                className={`${inputClass} pl-9`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              aria-label="Product"
              className={selectClass}
              value={query.product}
              onChange={(e) => setQuery((q) => ({ ...q, product: e.target.value, page: 1 }))}
            >
              <option value="">All products</option>
              {PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {list.status === 'error' && <Alert>{list.error}</Alert>}
          {list.status === 'loading' && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
            </div>
          )}
          {list.status === 'ready' && list.items.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center text-gray-500">
              {query.search || query.product ? 'No clients match your filters.' : 'No clients yet. Create your first one above.'}
            </div>
          )}
          {list.items.length > 0 && (
            <ul className="space-y-3">
              {list.items.map((card) => (
                <ResellerCardRow key={card.id} card={card} stock={stock} onChanged={refresh} onRequestSent={refresh} />
              ))}
            </ul>
          )}
          <Pagination page={query.page} pages={list.pages} onChange={(p) => setQuery((q) => ({ ...q, page: p }))} />
        </section>

        <MyRequests reloadKey={reloadKey} />
      </main>
    </div>
  );
};

export default ResellerPage;
