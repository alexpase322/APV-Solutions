import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import CardEditor from '../../components/nfc/CardEditor';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, ProductBadges, StatusBadge } from '../../components/nfc/ui';
import { api, uploadImage } from '../../lib/api';
import { cardPublicUrl, cardStatus } from '../../lib/nfc';
import useNoIndex from '../../hooks/useNoIndex';

const AdminCardEditPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', card: null, error: '' });
  useNoIndex(state.card ? `Edit ${state.card.profile.fullName || state.card.code} · Admin` : 'Edit card · Admin');

  useEffect(() => {
    const controller = new AbortController();
    api(`/api/admin/cards/${id}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', card: data.card, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', card: null, error: err.message });
      });
    return () => controller.abort();
  }, [id]);

  const save = async (profile) => {
    const data = await api(`/api/admin/cards/${id}/profile`, { method: 'PUT', body: { profile } });
    setState((s) => ({ ...s, card: data.card }));
    return data.card.profile;
  };

  const upload = async (file, kind) => (await uploadImage(`/api/admin/cards/${id}/upload`, file, kind)).url;

  const { card } = state;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="SUPER ADMIN · NFC CARDS" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263646] hover:text-[#94A378]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to all cards
        </Link>

        {state.status === 'loading' && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
          </div>
        )}
        {state.status === 'error' && <Alert>{state.error}</Alert>}

        {card && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">{card.profile.fullName || 'Unnamed card'}</h1>
              <StatusBadge status={cardStatus(card)} />
              <span className="text-xs">
                <ProductBadges card={card} />
              </span>
              <span className="text-sm text-gray-500">{card.owner?.email}</span>
            </div>
            <Alert kind="info">You're editing this client's public profile as an admin. They'll see the same changes when they log in.</Alert>
            <CardLinkBox url={cardPublicUrl(card)} code={card.code} title="NFC link" compact />
            <CardEditor profile={card.profile} onSave={save} onUpload={upload} />
          </>
        )}
      </main>
    </div>
  );
};

export default AdminCardEditPage;
