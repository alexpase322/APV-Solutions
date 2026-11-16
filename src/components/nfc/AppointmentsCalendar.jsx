import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Alert, Section } from './ui';
import { AppointmentItem } from './AppointmentsList';
import { api } from '../../lib/api';
import { WEEKDAYS, calendarDate, formatTime, timeZoneLabel, visitorTimeZone } from '../../lib/booking';

/* Calendar dates are 'YYYY-MM-DD' strings; arithmetic runs on UTC noon so no time zone can shift them. */
const toDate = (ymd) => new Date(`${ymd}T12:00:00Z`);
const toYmd = (date) => date.toISOString().slice(0, 10);
const addDays = (ymd, n) => {
  const d = toDate(ymd);
  d.setUTCDate(d.getUTCDate() + n);
  return toYmd(d);
};
const addMonths = (ym, n) => {
  const d = toDate(`${ym}-01`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return toYmd(d).slice(0, 7);
};

/** Calendar date of an instant in a time zone. */
const ymdInZone = (iso, timeZone) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

/** Monday-first weeks covering the whole month. */
const monthGrid = (ym) => {
  const first = `${ym}-01`;
  const from = addDays(first, -((toDate(first).getUTCDay() + 6) % 7));
  const last = addDays(`${addMonths(ym, 1)}-01`, -1);
  const to = addDays(last, 6 - ((toDate(last).getUTCDay() + 6) % 7));
  const days = [];
  for (let d = from; d <= to; d = addDays(d, 1)) days.push(d);
  return { from, to, days };
};

const MAX_CHIPS = 3;

const chipClass = (appt) =>
  appt.status === 'cancelled' ? 'bg-white/[0.05] text-ink-200 line-through' : 'bg-sage-300/15 text-sage-100';

const LegendDot = ({ cls, children }) => (
  <span className="inline-flex items-center gap-1.5">
    <span className={`h-3 w-3 rounded ${cls}`} aria-hidden="true" />
    {children}
  </span>
);

/**
 * Month view of a card's appointments, in the card's booking time zone.
 * @param {string} props.endpoint   GET list endpoint (accepts ?from=&to=)
 * @param {(appt) => string} [props.cancelPath] POST cancel endpoint; omit for a read-only calendar
 */
const AppointmentsCalendar = ({ endpoint, cancelPath, title = 'Appointments' }) => {
  const [month, setMonth] = useState(() => ymdInZone(new Date(), visitorTimeZone() || 'UTC').slice(0, 7));
  const [selected, setSelected] = useState(() => ymdInZone(new Date(), visitorTimeZone() || 'UTC'));
  const [state, setState] = useState({ status: 'loading', items: [], upcomingConfirmed: 0, timezone: null, availability: null, error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const refresh = useCallback(() => setReloadKey((k) => k + 1), []);
  const grid = useMemo(() => monthGrid(month), [month]);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, status: 'loading' }));
    api(`${endpoint}?from=${grid.from}&to=${grid.to}`, { signal: controller.signal })
      .then((data) => setState({ status: 'ready', ...data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setState((s) => ({ ...s, status: 'error', error: err.message }));
      });
    return () => controller.abort();
  }, [endpoint, grid, reloadKey]);

  const tz = state.timezone || visitorTimeZone() || 'UTC';
  const today = ymdInZone(new Date(), tz);
  const byDay = useMemo(() => {
    const map = {};
    for (const a of state.items) (map[ymdInZone(a.start, tz)] ||= []).push(a);
    return map;
  }, [state.items, tz]);

  const availability = state.availability;
  const blocked = useMemo(() => new Set(availability?.blockedDates || []), [availability]);
  const closedReason = (ymd) => {
    if (!availability?.enabled) return '';
    if (blocked.has(ymd)) return 'Day off';
    return availability.openDays.includes(toDate(ymd).getUTCDay()) ? '' : 'Closed';
  };

  const inMonth = state.items.filter((a) => ymdInZone(a.start, tz).startsWith(month));
  const confirmedThisMonth = inMonth.filter((a) => a.status === 'confirmed').length;
  const cancelledThisMonth = inMonth.length - confirmedThisMonth;

  const goTo = (ym) => {
    setMonth(ym);
    setSelected(today.startsWith(ym) ? today : `${ym}-01`);
  };

  const selectedItems = byDay[selected] || [];
  const now = Date.now();

  return (
    <Section
      title={title}
      description={`${state.upcomingConfirmed} upcoming confirmed · times in ${timeZoneLabel(tz)}`}
      action={
        <div className="flex items-center gap-1">
          {state.status === 'loading' && <Loader2 size={16} className="animate-spin text-sage-300 mr-1" aria-label="Loading" />}
          <button
            type="button"
            onClick={() => goTo(today.slice(0, 7))}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm font-semibold text-ink-50 hover:border-white/25 hover:bg-white/[0.07] transition-colors"
          >
            Today
          </button>
          <button type="button" onClick={() => goTo(addMonths(month, -1))} aria-label="Previous month" className="rounded-full p-2 text-ink-100 hover:bg-white/[0.06] hover:text-ink-50 transition-colors">
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => goTo(addMonths(month, 1))} aria-label="Next month" className="rounded-full p-2 text-ink-100 hover:bg-white/[0.06] hover:text-ink-50 transition-colors">
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      }
    >
      {state.status === 'error' && <Alert>{state.error}</Alert>}

      <div className="flex flex-wrap items-end justify-between gap-3">
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-ink-50" aria-live="polite">
          {calendarDate(`${month}-01`, { month: 'long', year: 'numeric' })}
        </h3>
        <p className="text-sm text-ink-200">
          <span className="nums font-semibold text-sage-200">{confirmedThisMonth}</span> confirmed
          {cancelledThisMonth > 0 && (
            <>
              {' · '}
              <span className="nums font-semibold text-ink-100">{cancelledThisMonth}</span> cancelled
            </>
          )}{' '}
          this month
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.08]">
        <div className="grid grid-cols-7 bg-white/[0.03] border-b border-white/[0.08]">
          {WEEKDAYS.map((w) => (
            <div key={w.day} className="py-2 text-center font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-ink-200">
              <span className="sm:hidden">{w.short.slice(0, 1)}</span>
              <span className="hidden sm:inline">{w.short}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-px bg-white/[0.07]">
          {grid.days.map((ymd) => {
            const items = byDay[ymd] || [];
            const outside = !ymd.startsWith(month);
            const isToday = ymd === today;
            const isSelected = ymd === selected;
            const closed = closedReason(ymd);
            const confirmed = items.filter((a) => a.status === 'confirmed').length;
            const label = `${calendarDate(ymd, { weekday: 'long', month: 'long', day: 'numeric' })}: ${
              items.length ? `${confirmed} confirmed${items.length > confirmed ? `, ${items.length - confirmed} cancelled` : ''}` : 'no appointments'
            }${closed ? ` (${closed.toLowerCase()})` : ''}`;
            return (
              <button
                key={ymd}
                type="button"
                onClick={() => {
                  setSelected(ymd);
                  if (outside) setMonth(ymd.slice(0, 7));
                }}
                aria-pressed={isSelected}
                aria-label={label}
                className={`relative flex min-h-16 sm:min-h-28 flex-col items-stretch gap-1 p-1 sm:p-1.5 text-left transition-colors focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sage-300 ${
                  closed
                    ? 'bg-[repeating-linear-gradient(135deg,var(--color-ink-800)_0_6px,var(--color-ink-750)_6px_12px)]'
                    : 'bg-ink-800 hover:bg-ink-750'
                } ${isSelected ? 'ring-2 ring-inset ring-sage-300' : ''}`}
              >
                <span className="flex items-center justify-between gap-1">
                  <span
                    className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs sm:text-sm font-semibold ${
                      isToday ? 'bg-sage-300 text-ink-950' : outside ? 'text-ink-300' : ymd < today ? 'text-ink-200' : 'text-ink-50'
                    }`}
                  >
                    {Number(ymd.slice(8))}
                  </span>
                  {closed && !outside && <span className="hidden sm:inline font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-ink-200">{closed}</span>}
                </span>

                {/* Phones: one dot per appointment */}
                {items.length > 0 && (
                  <span className="flex flex-wrap gap-0.5 px-0.5 sm:hidden" aria-hidden="true">
                    {items.slice(0, 4).map((a) => (
                      <span key={a.id} className={`h-1.5 w-1.5 rounded-full ${a.status === 'cancelled' ? 'bg-ink-300' : 'bg-sage-300'}`} />
                    ))}
                  </span>
                )}

                {/* Larger screens: time + name chips */}
                <span className={`hidden sm:flex flex-col gap-0.5 ${outside ? 'opacity-50' : ''}`} aria-hidden="true">
                  {items.slice(0, MAX_CHIPS).map((a) => (
                    <span key={a.id} className={`truncate rounded-md px-1.5 py-0.5 text-[11px] leading-4 font-medium ${chipClass(a)}`}>
                      <span className="font-semibold">{formatTime(a.start, tz)}</span> {a.name}
                    </span>
                  ))}
                  {items.length > MAX_CHIPS && <span className="px-1.5 text-[11px] font-semibold text-ink-200">+{items.length - MAX_CHIPS} more</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-200">
        <LegendDot cls="bg-sage-300/40">Confirmed</LegendDot>
        <LegendDot cls="bg-white/10">Cancelled</LegendDot>
        {availability?.enabled && <LegendDot cls="bg-[repeating-linear-gradient(135deg,var(--color-ink-800)_0_3px,var(--color-ink-600)_3px_6px)] border border-white/15">Closed / day off</LegendDot>}
        <LegendDot cls="bg-sage-300 rounded-full">Today</LegendDot>
      </div>

      <div className="border-t border-white/[0.08] pt-4 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-semibold text-ink-50">{calendarDate(selected, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
          <span className="text-sm text-ink-200">
            {selectedItems.length === 1 ? '1 appointment' : `${selectedItems.length} appointments`}
            {closedReason(selected) ? ` · ${closedReason(selected)}` : ''}
          </span>
        </div>
        {selectedItems.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-sm text-ink-200">
            {state.status === 'loading' ? 'Loading…' : 'Nothing booked on this day.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {selectedItems.map((a) => (
              <AppointmentItem key={a.id} appt={a} canCancel={!!cancelPath && new Date(a.end).getTime() > now} cancelPath={cancelPath} onChanged={refresh} />
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
};

export default AppointmentsCalendar;
