import React, { useCallback, useEffect, useState } from 'react';
import { CalendarX, Loader2, Mail, MessageSquare, Phone } from 'lucide-react';
import { ActionButton, Alert, Section, inputClass } from './ui';
import { api } from '../../lib/api';
import { LOCATIONS, formatInZone, formatTime, timeZoneLabel } from '../../lib/booking';

const STATUS = {
  confirmed: { label: 'Confirmed', cls: 'bg-[#94A378]/15 text-[#4d5a37]' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-200 text-gray-700' },
};

export const AppointmentItem =({ appt, canCancel, cancelPath, onChanged }) => {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const tz = appt.timezone;
  const loc = LOCATIONS[appt.locationType] || LOCATIONS.other;
  const status = STATUS[appt.status];

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      await api(cancelPath(appt), { method: 'POST', body: { reason } });
      onChanged();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <li className="rounded-2xl border border-gray-100 bg-white p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-40 flex-shrink-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{formatInZone(appt.start, tz, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="text-xl font-bold text-[#263646]">{formatTime(appt.start, tz)}</p>
          <p className="text-xs text-gray-500">
            to {formatTime(appt.end, tz)} · {timeZoneLabel(tz)}
          </p>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-[#263646]">{appt.name}</p>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}>
              {status.label}
              {appt.status === 'cancelled' && appt.cancelledBy ? ` by ${appt.cancelledBy === 'owner' ? 'you' : 'client'}` : ''}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {appt.title} · <loc.icon size={13} className="inline -mt-0.5" aria-hidden="true" /> {loc.label}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href={`mailto:${appt.email}`} className="inline-flex items-center gap-1 text-[#263646] hover:underline break-all">
              <Mail size={14} aria-hidden="true" /> {appt.email}
            </a>
            {appt.phone && (
              <a href={`tel:${appt.phone}`} className="inline-flex items-center gap-1 text-[#263646] hover:underline">
                <Phone size={14} aria-hidden="true" /> {appt.phone}
              </a>
            )}
          </div>
          {appt.note && (
            <p className="mt-2 flex gap-2 rounded-xl bg-[#F8F9FA] px-3 py-2 text-sm text-gray-700 whitespace-pre-line">
              <MessageSquare size={14} className="flex-shrink-0 mt-0.5 text-gray-500" aria-hidden="true" />
              {appt.note}
            </p>
          )}
          {appt.cancelReason && <p className="text-xs text-gray-500">Reason: “{appt.cancelReason}”</p>}
        </div>
        {canCancel && appt.status === 'confirmed' && !confirming && (
          <div className="sm:self-start">
            <ActionButton icon={CalendarX} danger onClick={() => setConfirming(true)}>
              Cancel
            </ActionButton>
          </div>
        )}
      </div>
      {confirming && (
        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
          {error && <Alert>{error}</Alert>}
          <label htmlFor={`cancel-${appt.id}`} className="block text-sm font-medium text-[#263646]">
            Message for {appt.name} (optional)
          </label>
          <input
            id={`cancel-${appt.id}`}
            className={inputClass}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            maxLength={300}
            placeholder="Sorry, something came up. Please book another time."
          />
          <div className="flex flex-wrap gap-2">
            <ActionButton icon={CalendarX} danger busy={busy} onClick={cancel}>
              Cancel and notify {appt.name.split(' ')[0]}
            </ActionButton>
            <button type="button" onClick={() => setConfirming(false)} className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 hover:text-[#263646]">
              Keep it
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

/**
 * Upcoming / past appointments of a card.
 * @param {string} props.endpoint   GET list endpoint (e.g. /api/me/appointments)
 * @param {(appt) => string} [props.cancelPath] POST cancel endpoint; omit for read-only lists
 */
const AppointmentsList = ({ endpoint, cancelPath, title = 'Appointments' }) => {
  const [scope, setScope] = useState('upcoming');
  const [state, setState] = useState({ status: 'loading', items: [], upcomingConfirmed: 0, error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    api(`${endpoint}?scope=${scope}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', ...data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState((s) => ({ ...s, status: 'error', error: err.message }));
      });
    return () => controller.abort();
  }, [endpoint, scope, reloadKey]);

  return (
    <Section
      title={title}
      description={scope === 'upcoming' ? `${state.upcomingConfirmed} upcoming confirmed` : 'Most recent first'}
      action={
        <div className="flex gap-1 bg-[#F8F9FA] border border-gray-100 rounded-xl p-1">
          {['upcoming', 'past'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setScope(s);
                setState((st) => ({ ...st, status: 'loading' }));
              }}
              aria-pressed={scope === s}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${scope === s ? 'bg-[#263646] text-white' : 'text-gray-600 hover:text-[#263646]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      }
    >
      {state.status === 'error' && <Alert>{state.error}</Alert>}
      {state.status === 'loading' && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
        </div>
      )}
      {state.status === 'ready' && state.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          {scope === 'upcoming' ? 'No upcoming appointments yet.' : 'No past appointments.'}
        </p>
      )}
      {state.status === 'ready' && state.items.length > 0 && (
        <ul className="space-y-3">
          {state.items.map((a) => (
            <AppointmentItem key={a.id} appt={a} canCancel={!!cancelPath && scope === 'upcoming'} cancelPath={cancelPath} onChanged={refresh} />
          ))}
        </ul>
      )}
    </Section>
  );
};

export default AppointmentsList;
