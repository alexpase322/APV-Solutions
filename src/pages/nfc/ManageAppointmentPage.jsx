import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { LOCATIONS, formatDateLong, formatTime, timeZoneLabel } from '../../lib/booking';
import { initials, readableOn } from '../../lib/nfc';
import useNoIndex from '../../hooks/useNoIndex';

/** Page linked from the confirmation email: see the appointment and cancel it. */
const ManageAppointmentPage = () => {
  useNoIndex('Your appointment · APV');
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [state, setState] = useState({ status: token ? 'loading' : 'invalid', data: null, error: '' });
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    api('/api/public/appointments/manage', { method: 'POST', body: { token }, auth: false, signal: controller.signal })
      .then((data) => setState({ status: 'ready', data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState({ status: 'invalid', data: null, error: err.message });
      });
    return () => controller.abort();
  }, [token]);

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      await api('/api/public/appointments/cancel', { method: 'POST', body: { token, reason }, auth: false });
      setState((s) => ({ ...s, data: { ...s.data, appointment: { ...s.data.appointment, status: 'cancelled', cancelledBy: 'client' } } }));
      setConfirming(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const shell = (children) => (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8">{children}</div>
      <Link to="/nfc" className="mt-6 text-xs text-gray-500 hover:text-[#263646]">
        Powered by <span className="font-bold">APV</span> Business Solutions
      </Link>
    </main>
  );

  if (state.status === 'loading') {
    return shell(
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
      </div>
    );
  }

  if (state.status === 'invalid') {
    return shell(
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold text-[#263646]">Appointment not found</h1>
        <p className="text-gray-600">{state.error || 'This link is missing information.'} Please use the link from your confirmation email.</p>
      </div>
    );
  }

  const { appointment: a, card } = state.data;
  const tz = a.timezone;
  const loc = LOCATIONS[a.locationType] || LOCATIONS.other;
  const accent = /^#[0-9a-f]{6}$/i.test(card?.accentColor || '') ? card.accentColor : '#263646';
  const cancelled = a.status === 'cancelled';
  const past = new Date(a.end) < new Date();

  return shell(
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        {card?.avatarUrl ? (
          <img src={card.avatarUrl} alt="" className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: accent, color: readableOn(accent) }} aria-hidden="true">
            {initials(card?.ownerName || '')}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Appointment with</p>
          <p className="text-lg font-bold text-[#263646] truncate">{card?.ownerName || 'APV card owner'}</p>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${cancelled ? 'border-gray-200 bg-gray-50' : 'border-[#94A378]/40 bg-[#94A378]/10'}`}>
        <p className="flex items-center gap-2 text-sm font-bold text-[#263646]">
          {cancelled ? <CalendarX size={16} aria-hidden="true" /> : <CalendarCheck size={16} aria-hidden="true" />}
          {cancelled ? `Cancelled${a.cancelledBy === 'owner' ? ' by the host' : ''}` : past ? 'Completed' : 'Confirmed'}
        </p>
        <p className={`mt-2 text-lg font-bold ${cancelled ? 'text-gray-500 line-through' : 'text-[#263646]'}`}>{formatDateLong(a.start, tz)}</p>
        <p className="text-sm text-gray-600">
          {formatTime(a.start, tz)} – {formatTime(a.end, tz)} · {timeZoneLabel(tz)}
        </p>
        <p className="mt-2 text-sm text-gray-700">
          {a.title} · <loc.icon size={13} className="inline -mt-0.5" aria-hidden="true" /> {loc.label}
        </p>
        {a.locationDetails && !cancelled && <p className="text-sm text-gray-700 mt-1">{a.locationDetails}</p>}
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!cancelled && !past &&
        (confirming ? (
          <div className="space-y-2">
            <label htmlFor="cancel-reason" className="block text-sm font-medium text-[#263646]">
              Reason (optional)
            </label>
            <input
              id="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={300}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[#263646] outline-none focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cancel}
                disabled={busy}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {busy && <Loader2 size={16} className="animate-spin" aria-hidden="true" />} Yes, cancel it
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-gray-200 px-4 py-3 font-semibold text-[#263646]">
                Keep it
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="w-full rounded-xl border border-red-200 px-4 py-3 font-semibold text-red-700 hover:bg-red-50"
          >
            Cancel appointment
          </button>
        ))}

      {card?.code && (
        <Link
          to={`/c/${card.code}`}
          className="block w-full rounded-xl px-4 py-3 text-center font-semibold"
          style={{ backgroundColor: accent, color: readableOn(accent) }}
        >
          {cancelled ? 'Book another time' : `View ${card.ownerName?.split(' ')[0] || 'their'}'s card`}
        </Link>
      )}
    </div>
  );
};

export default ManageAppointmentPage;
