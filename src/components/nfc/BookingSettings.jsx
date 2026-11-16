import React, { useEffect, useMemo, useState } from 'react';
import { CalendarOff, Loader2, Plus, Save, Trash2, X } from 'lucide-react';
import { Alert, Field, Section, inputClass, selectClass } from './ui';
import { api } from '../../lib/api';
import { LOCATIONS, WEEKDAYS, calendarDate, timeZoneLabel, timeZones } from '../../lib/booking';

const DURATIONS = [15, 20, 30, 45, 60, 90, 120, 180, 240];
const BUFFERS = [0, 5, 10, 15, 30, 60];
const NOTICE = [0, 1, 2, 4, 12, 24, 48, 72];
const WINDOW = [7, 14, 30, 60, 90, 180];

const hoursLabel = (h) => (h === 0 ? 'No minimum' : h < 24 ? `${h} hour${h > 1 ? 's' : ''}` : `${h / 24} day${h > 24 ? 's' : ''}`);

const normalize = (b) => ({
  ...b,
  weekly: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day,
    intervals: (b.weekly?.find((w) => w.day === day)?.intervals || []).map((iv) => ({ start: iv.start, end: iv.end })),
  })),
  blockedDates: [...(b.blockedDates || [])],
});

/**
 * Appointment booking settings for one card.
 * @param {string} props.endpoint  GET/PUT endpoint (e.g. /api/me/booking or /api/admin/cards/:id/booking)
 */
const BookingSettings = ({ endpoint }) => {
  const [booking, setBooking] = useState(null);
  const [saved, setSaved] = useState('');
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [blockDate, setBlockDate] = useState('');
  const zones = useMemo(() => timeZones(), []);

  useEffect(() => {
    const controller = new AbortController();
    api(endpoint, { signal: controller.signal })
      .then((data) => {
        const b = normalize(data.booking);
        setBooking(b);
        setSaved(JSON.stringify(b));
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoadError(err.message);
      });
    return () => controller.abort();
  }, [endpoint]);

  if (loadError) return <Alert>{loadError}</Alert>;
  if (!booking) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-sage-300" aria-hidden="true" />
      </div>
    );
  }

  const dirty = JSON.stringify(booking) !== saved;
  const set = (key, value) => setBooking((b) => ({ ...b, [key]: value }));
  const setDay = (day, intervals) =>
    setBooking((b) => ({ ...b, weekly: b.weekly.map((w) => (w.day === day ? { ...w, intervals } : w)) }));
  const dayOf = (day) => booking.weekly.find((w) => w.day === day);

  const toggleDay = (day) => {
    const current = dayOf(day).intervals;
    setDay(day, current.length ? [] : [{ start: '09:00', end: '17:00' }]);
  };
  const updateInterval = (day, i, key, value) =>
    setDay(day, dayOf(day).intervals.map((iv, j) => (j === i ? { ...iv, [key]: value } : iv)));
  const addInterval = (day) => {
    const ivs = dayOf(day).intervals;
    const last = ivs.at(-1);
    setDay(day, [...ivs, last ? { start: last.end < '22:00' ? last.end : '18:00', end: last.end < '22:00' ? '23:00' : '19:00' } : { start: '09:00', end: '17:00' }]);
  };
  const removeInterval = (day, i) => setDay(day, dayOf(day).intervals.filter((_, j) => j !== i));

  const addBlocked = () => {
    if (!blockDate || booking.blockedDates.includes(blockDate)) return;
    set('blockedDates', [...booking.blockedDates, blockDate].sort());
    setBlockDate('');
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const data = await api(endpoint, { method: 'PUT', body: { booking } });
      const b = normalize(data.booking);
      setBooking(b);
      setSaved(JSON.stringify(b));
      setMsg({
        kind: 'success',
        text: b.enabled ? 'Saved. Visitors can now book from your card.' : 'Saved. Bookings are turned off on your card.',
      });
    } catch (err) {
      setMsg({ kind: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={save} className="space-y-6">
      <Section
        title="Appointment booking"
        description="Let people who tap your card book a time with you. You and they get an email for every booking."
        action={
          <label className="inline-flex items-center gap-3 cursor-pointer select-none">
            <span className="text-sm font-semibold text-ink-50">{booking.enabled ? 'On' : 'Off'}</span>
            <input
              type="checkbox"
              role="switch"
              aria-checked={booking.enabled}
              aria-label="Accept bookings"
              checked={booking.enabled}
              onChange={(e) => set('enabled', e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-7 w-12 rounded-full bg-ink-600 inset-ring inset-ring-white/10 transition-colors peer-checked:bg-sage-300 peer-checked:inset-ring-sage-200/40 peer-focus-visible:ring-2 peer-focus-visible:ring-sage-300/70 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-ink-800 after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:bg-ink-100 after:shadow-[0_1px_3px_rgba(2,6,10,0.6)] after:transition-all peer-checked:after:translate-x-5 peer-checked:after:bg-ink-950"
            />
          </label>
        }
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="bk-title" label="Appointment name">
            <input id="bk-title" className={inputClass} value={booking.title} onChange={(e) => set('title', e.target.value)} maxLength={80} required placeholder="Free consultation" />
          </Field>
          <Field id="bk-duration" label="Duration">
            <select id="bk-duration" className={`${selectClass} w-full py-2.5`} value={booking.duration} onChange={(e) => set('duration', Number(e.target.value))}>
              {[...new Set([...DURATIONS, booking.duration])].sort((a, b) => a - b).map((m) => (
                <option key={m} value={m}>
                  {m < 60 ? `${m} minutes` : `${m / 60} hour${m > 60 ? 's' : ''}${m % 60 ? ` ${m % 60} min` : ''}`}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field id="bk-desc" label="Description (optional)" hint={`${booking.description.length}/500 · Shown to visitors before they book.`}>
          <textarea id="bk-desc" rows={2} className={`${inputClass} resize-none`} value={booking.description} onChange={(e) => set('description', e.target.value)} maxLength={500} placeholder="What the meeting is about, what to prepare…" />
        </Field>

        <fieldset>
          <legend className="block text-sm font-medium text-ink-100 mb-2">Where</legend>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LOCATIONS).map(([id, l]) => (
              <label
                key={id}
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold cursor-pointer transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-sage-300 ${
                  booking.locationType === id ? 'border-sage-300 bg-sage-300 text-ink-950' : 'border-white/10 bg-white/[0.03] text-ink-100 hover:border-white/25 hover:text-ink-50'
                }`}
              >
                <input type="radio" name="bk-location" value={id} checked={booking.locationType === id} onChange={() => set('locationType', id)} className="sr-only" />
                <l.icon size={16} aria-hidden="true" /> {l.label}
              </label>
            ))}
          </div>
        </fieldset>
        <Field id="bk-loc" label="Location details (optional)" hint="Only sent in the confirmation email — e.g. address, phone number or video link.">
          <input id="bk-loc" className={inputClass} value={booking.locationDetails} onChange={(e) => set('locationDetails', e.target.value)} maxLength={300} placeholder={booking.locationType === 'in_person' ? '123 Main St, Tampa, FL' : booking.locationType === 'phone' ? 'I will call you at the number you leave' : 'Google Meet / Zoom link'} />
        </Field>
      </Section>

      <Section title="Weekly availability" description="Times people can book, in your time zone.">
        <Field id="bk-tz" label="Time zone" hint={timeZoneLabel(booking.timezone)}>
          <select id="bk-tz" className={`${selectClass} w-full py-2.5`} value={booking.timezone} onChange={(e) => set('timezone', e.target.value)}>
            {(zones.includes(booking.timezone) ? zones : [booking.timezone, ...zones]).map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </Field>

        <ul className="divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          {WEEKDAYS.map((w) => {
            const { intervals } = dayOf(w.day);
            const on = intervals.length > 0;
            return (
              <li key={w.day} className="flex flex-col sm:flex-row sm:items-start gap-3 p-3">
                <label className="flex items-center gap-2 sm:w-36 sm:pt-2 cursor-pointer">
                  <input type="checkbox" checked={on} onChange={() => toggleDay(w.day)} className="w-4 h-4 accent-sage-300" />
                  <span className={`text-sm font-semibold ${on ? 'text-ink-50' : 'text-ink-200'}`}>{w.long}</span>
                </label>
                <div className="flex-1 space-y-2">
                  {!on && <p className="text-sm text-ink-200 sm:pt-2">Unavailable</p>}
                  {intervals.map((iv, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <input
                        type="time"
                        aria-label={`${w.long} from`}
                        value={iv.start}
                        onChange={(e) => updateInterval(w.day, i, 'start', e.target.value)}
                        className={`${inputClass} !w-auto !px-2.5 !py-2 text-sm sm:!px-4 sm:text-base`}
                        required
                      />
                      <span className="flex-shrink-0 text-ink-200 text-sm">to</span>
                      <input
                        type="time"
                        aria-label={`${w.long} until`}
                        value={iv.end}
                        onChange={(e) => updateInterval(w.day, i, 'end', e.target.value)}
                        className={`${inputClass} !w-auto !px-2.5 !py-2 text-sm sm:!px-4 sm:text-base`}
                        required
                      />
                      <button type="button" onClick={() => removeInterval(w.day, i)} aria-label={`Remove ${w.long} ${iv.start}–${iv.end}`} className="flex-shrink-0 p-1.5 sm:p-2 rounded-full text-ink-200 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  {on && intervals.length < 4 && (
                    <button type="button" onClick={() => addInterval(w.day)} className="inline-flex items-center gap-1 text-sm font-semibold text-sage-200 underline-offset-4 hover:text-sage-100 hover:underline transition-colors">
                      <Plus size={14} aria-hidden="true" /> Add hours
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="Rules" description="Control how and when people can book.">
        <div className="grid sm:grid-cols-3 gap-4">
          <Field id="bk-buffer" label="Break between appointments">
            <select id="bk-buffer" className={`${selectClass} w-full py-2.5`} value={booking.buffer} onChange={(e) => set('buffer', Number(e.target.value))}>
              {[...new Set([...BUFFERS, booking.buffer])].sort((a, b) => a - b).map((m) => (
                <option key={m} value={m}>
                  {m === 0 ? 'No break' : `${m} minutes`}
                </option>
              ))}
            </select>
          </Field>
          <Field id="bk-notice" label="Minimum notice">
            <select id="bk-notice" className={`${selectClass} w-full py-2.5`} value={booking.minNoticeHours} onChange={(e) => set('minNoticeHours', Number(e.target.value))}>
              {[...new Set([...NOTICE, booking.minNoticeHours])].sort((a, b) => a - b).map((h) => (
                <option key={h} value={h}>
                  {hoursLabel(h)}
                </option>
              ))}
            </select>
          </Field>
          <Field id="bk-window" label="Book up to">
            <select id="bk-window" className={`${selectClass} w-full py-2.5`} value={booking.maxDaysAhead} onChange={(e) => set('maxDaysAhead', Number(e.target.value))}>
              {[...new Set([...WINDOW, booking.maxDaysAhead])].sort((a, b) => a - b).map((d) => (
                <option key={d} value={d}>
                  {d} days ahead
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div>
          <p className="text-sm font-medium text-ink-100 mb-2">Days off</p>
          <div className="flex flex-wrap items-center gap-2">
            <input type="date" aria-label="Day off" min={today} value={blockDate} onChange={(e) => setBlockDate(e.target.value)} className={`${inputClass} !w-auto !py-2`} />
            <button
              type="button"
              onClick={addBlocked}
              disabled={!blockDate}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] disabled:opacity-50 disabled:hover:border-white/10 disabled:hover:bg-white/[0.03] transition-colors"
            >
              <CalendarOff size={15} aria-hidden="true" /> Block day
            </button>
          </div>
          {booking.blockedDates.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {booking.blockedDates.map((d) => (
                <li key={d} className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] pl-3 pr-1 py-1 text-sm text-ink-50">
                  {calendarDate(d, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                  <button
                    type="button"
                    onClick={() => set('blockedDates', booking.blockedDates.filter((x) => x !== d))}
                    aria-label={`Unblock ${d}`}
                    className="rounded-full p-0.5 text-ink-200 hover:bg-white/10 hover:text-ink-50 transition-colors"
                  >
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-4 sm:mx-0 bg-ink-850/90 backdrop-blur-xl backdrop-saturate-150 border-t sm:border border-white/[0.08] sm:rounded-2xl sm:shadow-[0_30px_60px_-30px_rgba(2,6,10,0.8)] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3 z-20">
        <div className="flex-1 min-w-0">
          {msg ? <Alert kind={msg.kind}>{msg.text}</Alert> : <p className="text-sm text-ink-200">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>}
        </div>
        <button
          type="submit"
          disabled={saving || !dirty}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sage-300 px-6 py-3 font-semibold text-ink-950 hover:bg-sage-200 disabled:opacity-50 disabled:hover:bg-sage-300 transition-colors"
        >
          {saving ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Save size={18} aria-hidden="true" />}
          {saving ? 'Saving…' : 'Save booking settings'}
        </button>
      </div>
    </form>
  );
};

export default BookingSettings;
