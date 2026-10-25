import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, CalendarCheck, CalendarDays, CalendarPlus, ChevronDown, Clock, Loader2, Mail, X } from 'lucide-react';
import { api } from '../../lib/api';
import {
  LOCATIONS,
  calendarDate,
  formatDateLong,
  formatTime,
  googleCalendarUrl,
  timeZoneLabel,
  visitorTimeZone,
} from '../../lib/booking';

const PAGE_DAYS = 14;

const fieldClass =
  'w-full px-4 py-2.5 rounded-xl border bg-white text-[#263646] placeholder:text-gray-400 outline-none transition-all border-gray-200 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 dark:bg-white/5 dark:border-white/15 dark:text-gray-100 dark:placeholder:text-gray-500';

/**
 * Appointment booking on the public card: pick a day → a time → your details → confirmed.
 *
 * @param {string} props.code     Card code
 * @param {object} props.booking  Public booking info from the API (title, duration, timezone, locationType…)
 * @param {string} props.accent   Card accent color (#rrggbb)
 * @param {string} props.onAccent Readable text color on the accent
 */
const BookingWidget = ({ code, booking, accent, onAccent }) => {
  const tz = booking.timezone;
  const localTz = visitorTimeZone();
  const showLocal = localTz && localTz !== tz;
  const location = LOCATIONS[booking.locationType] || LOCATIONS.other;

  const [open, setOpen] = useState(false);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false); // no more days to load
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', note: '', website: '' });
  const [sending, setSending] = useState(false);
  const [booked, setBooked] = useState(null);

  const load = useCallback(
    async (from, { replace = false } = {}) => {
      setLoading(true);
      setError('');
      try {
        const qs = new URLSearchParams({ days: String(PAGE_DAYS), ...(from ? { from } : {}) });
        const data = await api(`/api/public/cards/${encodeURIComponent(code)}/availability?${qs}`, { auth: false });
        setDays((prev) => {
          const next = replace ? data.days : [...prev, ...data.days.filter((d) => !prev.some((p) => p.date === d.date))];
          return next;
        });
        if (data.days.length < PAGE_DAYS) setDone(true);
        return data.days;
      } catch (err) {
        setError(err.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [code]
  );

  // First open: load the first two weeks and preselect the first day with free times
  useEffect(() => {
    if (!open || days.length || loading) return;
    load(undefined, { replace: true }).then((loaded) => {
      const first = loaded.find((d) => d.slots.length);
      if (first) setDate(first.date);
    });
  }, [open, days.length, loading, load]);

  const nextFrom = () => {
    const last = days.at(-1)?.date;
    if (!last) return undefined;
    const d = new Date(`${last}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const selectedDay = days.find((d) => d.date === date);
  const anySlots = days.some((d) => d.slots.length);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError('');
    try {
      const data = await api(`/api/public/cards/${encodeURIComponent(code)}/appointments`, {
        method: 'POST',
        auth: false,
        body: { start: slot.start, ...form },
      });
      setBooked({ ...data, email: form.email });
    } catch (err) {
      setError(err.message);
      if (err.status === 409) {
        // Someone took it: refresh this day's times
        setSlot(null);
        const fresh = await load(date, { replace: true });
        if (!fresh.find((d) => d.date === date)?.slots.length) setDate(fresh.find((d) => d.slots.length)?.date || null);
      }
    } finally {
      setSending(false);
    }
  };

  const accentButton = { backgroundColor: accent, color: onAccent };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors hover:bg-black/[0.02] dark:hover:bg-white/5"
        style={{ borderColor: accent }}
      >
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={accentButton} aria-hidden="true">
          <CalendarDays size={20} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold text-[#263646] dark:text-white">Book an appointment</span>
          <span className="block text-xs text-gray-600 dark:text-gray-300 truncate">
            {booking.title} · {booking.duration} min · {location.label}
          </span>
        </span>
        <ChevronDown size={18} className="text-gray-400 flex-shrink-0" aria-hidden="true" />
      </button>
    );
  }

  return (
    <section aria-label="Book an appointment" className="mt-4 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-gray-100 dark:border-white/10">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={accentButton} aria-hidden="true">
          <CalendarDays size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-[#263646] dark:text-white">{booking.title}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-300 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} aria-hidden="true" /> {booking.duration} min
            </span>
            <span className="inline-flex items-center gap-1">
              <location.icon size={12} aria-hidden="true" /> {location.label}
            </span>
          </p>
          {booking.description && !booked && <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line">{booking.description}</p>}
        </div>
        {!booked && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close booking"
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#263646] hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200">
            {error}
          </p>
        )}

        {/* ---- Confirmed ---- */}
        {booked ? (
          <div className="text-center space-y-3 py-2" role="status">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={accentButton}>
              <CalendarCheck size={28} aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-[#263646] dark:text-white">You're booked!</p>
              <p className="font-semibold text-[#263646] dark:text-gray-100 mt-1">{formatDateLong(booked.appointment.start, tz)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatTime(booked.appointment.start, tz)} – {formatTime(booked.appointment.end, tz)} · {timeZoneLabel(tz)}
              </p>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {booked.emailSent ? (
                <>
                  We sent the confirmation to <strong className="text-[#263646] dark:text-white">{booked.email}</strong>.
                </>
              ) : (
                'Save these details — the confirmation email could not be sent right now.'
              )}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Questions? Write to{' '}
              <a href={`mailto:${booked.contactEmail}`} className="font-semibold underline underline-offset-2 text-[#263646] dark:text-white">
                {booked.contactEmail}
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
              <a
                href={googleCalendarUrl({
                  title: `${booked.appointment.title} — ${booked.ownerName}`,
                  start: booked.appointment.start,
                  end: booked.appointment.end,
                  details: `Contact: ${booked.contactEmail}\nManage: ${booked.manageUrl}`,
                  location: booked.appointment.locationDetails || LOCATIONS[booked.appointment.locationType]?.label || '',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                style={accentButton}
              >
                <CalendarPlus size={16} aria-hidden="true" /> Add to Google Calendar
              </a>
              <a
                href={booked.manageUrl}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#263646] dark:border-white/15 dark:text-gray-100"
              >
                View or cancel
              </a>
            </div>
          </div>
        ) : slot ? (
          /* ---- Details form ---- */
          <form onSubmit={submit} className="space-y-3">
            <button
              type="button"
              onClick={() => setSlot(null)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#263646] dark:text-gray-100 hover:underline"
            >
              <ArrowLeft size={15} aria-hidden="true" /> Change time
            </button>
            <div className="rounded-xl bg-[#F8F9FA] px-4 py-3 dark:bg-white/5">
              <p className="font-semibold text-[#263646] dark:text-white">{formatDateLong(slot.start, tz)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatTime(slot.start, tz)} · {timeZoneLabel(tz)}
                {showLocal && ` (${formatTime(slot.start, localTz)} your time)`}
              </p>
            </div>
            <div>
              <label htmlFor={`bk-name-${code}`} className="block text-sm font-medium text-[#263646] dark:text-gray-100 mb-1">
                Your name
              </label>
              <input id={`bk-name-${code}`} className={fieldClass} value={form.name} onChange={set('name')} required minLength={2} maxLength={80} autoComplete="name" />
            </div>
            <div>
              <label htmlFor={`bk-email-${code}`} className="block text-sm font-medium text-[#263646] dark:text-gray-100 mb-1">
                Email
              </label>
              <input id={`bk-email-${code}`} type="email" className={fieldClass} value={form.email} onChange={set('email')} required maxLength={254} autoComplete="email" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The confirmation will be sent here.</p>
            </div>
            <div>
              <label htmlFor={`bk-phone-${code}`} className="block text-sm font-medium text-[#263646] dark:text-gray-100 mb-1">
                Phone <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
              </label>
              <input id={`bk-phone-${code}`} type="tel" className={fieldClass} value={form.phone} onChange={set('phone')} maxLength={30} autoComplete="tel" />
            </div>
            <div>
              <label htmlFor={`bk-note-${code}`} className="block text-sm font-medium text-[#263646] dark:text-gray-100 mb-1">
                Anything to share? <span className="font-normal text-gray-500 dark:text-gray-400">(optional)</span>
              </label>
              <textarea id={`bk-note-${code}`} rows={3} className={`${fieldClass} resize-none`} value={form.note} onChange={set('note')} maxLength={500} />
            </div>
            {/* Honeypot for bots — hidden from people and screen readers */}
            <div aria-hidden="true" className="hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </label>
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold disabled:opacity-60 transition-transform active:scale-[0.99]"
              style={accentButton}
            >
              {sending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <CalendarCheck size={18} aria-hidden="true" />}
              {sending ? 'Booking…' : 'Confirm appointment'}
            </button>
          </form>
        ) : (
          /* ---- Pick day + time ---- */
          <>
            {loading && !days.length ? (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin text-[#94A378]" aria-hidden="true" />
              </div>
            ) : !anySlots && done ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 text-center py-4">No times available right now. Please check back later.</p>
            ) : (
              <>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Choose a day</p>
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="listbox" aria-label="Days">
                    {days.map((d) => {
                      const selected = d.date === date;
                      const available = d.slots.length > 0;
                      return (
                        <button
                          key={d.date}
                          type="button"
                          role="option"
                          aria-selected={selected}
                          disabled={!available}
                          onClick={() => setDate(d.date)}
                          className={`flex-shrink-0 w-14 rounded-xl border py-2 text-center transition-colors disabled:opacity-35 disabled:cursor-not-allowed ${
                            selected ? '' : 'border-gray-200 text-[#263646] hover:border-gray-400 dark:border-white/15 dark:text-gray-100'
                          }`}
                          style={selected ? { ...accentButton, borderColor: accent } : undefined}
                        >
                          <span className="block text-[11px] font-semibold uppercase">{calendarDate(d.date, { weekday: 'short' })}</span>
                          <span className="block text-lg font-bold leading-tight">{calendarDate(d.date, { day: 'numeric' })}</span>
                          <span className="block text-[10px]">{calendarDate(d.date, { month: 'short' })}</span>
                        </button>
                      );
                    })}
                    {!done && (
                      <button
                        type="button"
                        onClick={() => load(nextFrom())}
                        disabled={loading}
                        className="flex-shrink-0 rounded-xl border border-dashed border-gray-300 px-3 text-xs font-semibold text-gray-600 dark:border-white/20 dark:text-gray-300"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : 'More days'}
                      </button>
                    )}
                  </div>
                </div>

                {selectedDay && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      {calendarDate(selectedDay.date, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDay.slots.map((s) => (
                        <button
                          key={s.start}
                          type="button"
                          onClick={() => setSlot(s)}
                          className="rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-[#263646] hover:border-current transition-colors dark:border-white/15 dark:text-gray-100"
                        >
                          {formatTime(s.start, tz)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Times in {timeZoneLabel(tz)}
                  {showLocal ? ` · you are in ${timeZoneLabel(localTz)}` : ''}.
                </p>
              </>
            )}
          </>
        )}
      </div>

      {booked?.emailSent && (
        <p className="border-t border-gray-100 dark:border-white/10 px-4 py-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <Mail size={12} aria-hidden="true" /> Check your inbox (and spam folder) for the confirmation.
        </p>
      )}
    </section>
  );
};

export default BookingWidget;
