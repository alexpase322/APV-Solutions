import React, { useCallback, useEffect, useState } from 'react';
import { CalendarX, Loader2, Mail, MessageSquare, Phone } from 'lucide-react';
import { ActionButton, Alert, Section, inputClass } from './ui';
import { api } from '../../lib/api';
import { LOCATIONS, formatInZone, formatTime, timeZoneLabel } from '../../lib/booking';

const STATUS = {
  confirmed: { label: 'Confirmed', cls: 'border-sage-300/30 bg-sage-300/10 text-sage-200' },
  cancelled: { label: 'Cancelled', cls: 'border-white/10 bg-white/[0.04] text-ink-200' },
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
    <li className="rounded-2xl border border-white/[0.07] bg-ink-800/60 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-40 flex-shrink-0">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-200">{formatInZone(appt.start, tz, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="nums mt-0.5 text-xl font-semibold tracking-[-0.02em] text-ink-50">{formatTime(appt.start, tz)}</p>
          <p className="text-xs text-ink-200">
            to {formatTime(appt.end, tz)} · {timeZoneLabel(tz)}
          </p>
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-ink-50">{appt.name}</p>
            <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}>
              {status.label}
              {appt.status === 'cancelled' && appt.cancelledBy ? ` by ${appt.cancelledBy === 'owner' ? 'you' : 'client'}` : ''}
            </span>
          </div>
          <p className="text-sm text-ink-100">
            {appt.title} · <loc.icon size={13} className="inline -mt-0.5" aria-hidden="true" /> {loc.label}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a href={`mailto:${appt.email}`} className="inline-flex items-center gap-1 text-ink-50 underline-offset-4 hover:text-sage-200 hover:underline break-all transition-colors">
              <Mail size={14} aria-hidden="true" /> {appt.email}
            </a>
            {appt.phone && (
              <a href={`tel:${appt.phone}`} className="inline-flex items-center gap-1 text-ink-50 underline-offset-4 hover:text-sage-200 hover:underline transition-colors">
                <Phone size={14} aria-hidden="true" /> {appt.phone}
              </a>
            )}
          </div>
          {appt.note && (
            <p className="mt-2 flex gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-ink-100 whitespace-pre-line">
              <MessageSquare size={14} className="flex-shrink-0 mt-0.5 text-ink-200" aria-hidden="true" />
              {appt.note}
            </p>
          )}
          {appt.cancelReason && <p className="text-xs text-ink-200">Reason: “{appt.cancelReason}”</p>}
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
        <div className="mt-4 space-y-2 border-t border-white/[0.08] pt-4">
          {error && <Alert>{error}</Alert>}
          <label htmlFor={`cancel-${appt.id}`} className="block text-sm font-medium text-ink-100">
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
            <button type="button" onClick={() => setConfirming(false)} className="rounded-full px-3.5 py-2 text-sm font-semibold text-ink-200 hover:bg-white/[0.05] hover:text-ink-50 transition-colors">
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
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {['upcoming', 'past'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setScope(s);
                setState((st) => ({ ...st, status: 'loading' }));
              }}
              aria-pressed={scope === s}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors ${scope === s ? 'bg-sage-300 text-ink-950' : 'text-ink-200 hover:bg-white/[0.05] hover:text-ink-50'}`}
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
          <Loader2 className="animate-spin text-sage-300" aria-hidden="true" />
        </div>
      )}
      {state.status === 'ready' && state.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-white/10 p-8 text-center text-sm text-ink-200">
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
