import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import AppHeader from '../../components/nfc/AppHeader';
import CardEditor from '../../components/nfc/CardEditor';
import CardLinkBox from '../../components/nfc/CardLinkBox';
import { Alert, ProductBadge, StatusBadge } from '../../components/nfc/ui';
import { api, uploadImage } from '../../lib/api';
import { cardPublicUrl, cardStatus } from '../../lib/nfc';
import useNoIndex from '../../hooks/useNoIndex';

/** Lets a reseller fill in their client's profile — only until the client activates their account. */
const ResellerCardEditPage = () => {
  const { id } = useParams();
  const [state, setState] = useState({ status: 'loading', card: null, error: '' });
  useNoIndex('Client profile · Reseller');

  useEffect(() => {
    const controller = new AbortController();
    api(`/api/reseller/cards/${id}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', card: data.card, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'error', card: null, error: err.message });
      });
    return () => controller.abort();
  }, [id]);

  const save = async (profile) => {
    const data = await api(`/api/reseller/cards/${id}/profile`, { method: 'PUT', body: { profile } });
    setState((s) => ({ ...s, card: data.card }));
    return data.card.profile;
  };
  const upload = async (file, kind) => (await uploadImage(`/api/reseller/cards/${id}/upload`, file, kind)).url;

  const { card } = state;
  const editable = card?.owner?.status === 'invited';

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <AppHeader subtitle="RESELLER PANEL" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link to="/reseller" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#263646] hover:text-[#94A378]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to my clients
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
              <h1 className="text-2xl sm:text-3xl font-bold text-[#263646]">{card.profile.fullName || 'Unnamed client'}</h1>
              <StatusBadge status={cardStatus(card)} />
              <span className="text-xs">
                <ProductBadge type={card.productType} />
              </span>
            </div>
            <CardLinkBox url={cardPublicUrl(card)} code={card.code} title="NFC link to program" compact />
            {editable ? (
              <>
                <Alert kind="info">
                  You can set up this profile until the client activates their account. After that, only they can edit it.
                </Alert>
                <CardEditor profile={card.profile} onSave={save} onUpload={upload} />
              </>
            ) : (
              <Alert kind="info">This client already activated their account, so only they can edit their profile.</Alert>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ResellerCardEditPage;
