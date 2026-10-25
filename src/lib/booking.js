import { MapPin, Phone, Video, CalendarClock } from 'lucide-react';

/** Appointment location types (keep in sync with APV-back → models/Card.js bookingSchema). */
export const LOCATIONS = {
  in_person: { label: 'In person', icon: MapPin },
  phone: { label: 'Phone call', icon: Phone },
  video: { label: 'Video call', icon: Video },
  other: { label: 'Other', icon: CalendarClock },
};

export const WEEKDAYS = [
  { day: 1, short: 'Mon', long: 'Monday' },
  { day: 2, short: 'Tue', long: 'Tuesday' },
  { day: 3, short: 'Wed', long: 'Wednesday' },
  { day: 4, short: 'Thu', long: 'Thursday' },
  { day: 5, short: 'Fri', long: 'Friday' },
  { day: 6, short: 'Sat', long: 'Saturday' },
  { day: 0, short: 'Sun', long: 'Sunday' },
];

const LOCALE = 'en-US';

/** Formats an ISO instant in a given IANA time zone. */
export const formatInZone = (iso, timeZone, options) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone, ...options }).format(new Date(iso));

export const formatTime = (iso, timeZone) => formatInZone(iso, timeZone, { hour: 'numeric', minute: '2-digit' });

export const formatDateLong = (iso, timeZone) =>
  formatInZone(iso, timeZone, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

/** 'YYYY-MM-DD' calendar date → parts, without time-zone shifting. */
export const calendarDate = (ymd, options) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: 'UTC', ...options }).format(new Date(`${ymd}T12:00:00Z`));

/** "Eastern Time" style name of a time zone (falls back to the IANA id). */
export const timeZoneLabel = (timeZone) => {
  for (const style of ['longGeneric', 'long']) {
    try {
      const part = new Intl.DateTimeFormat(LOCALE, { timeZone, timeZoneName: style })
        .formatToParts(new Date())
        .find((p) => p.type === 'timeZoneName');
      if (part?.value) return part.value;
    } catch {
      /* unsupported style */
    }
  }
  return timeZone;
};

export const visitorTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return null;
  }
};

const FALLBACK_ZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Puerto_Rico',
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Caracas',
  'America/Santiago',
  'America/Argentina/Buenos_Aires',
  'America/Sao_Paulo',
  'Europe/Madrid',
  'Europe/London',
  'UTC',
];

export const timeZones = () => {
  try {
    const all = Intl.supportedValuesOf('timeZone');
    return all.length ? all : FALLBACK_ZONES;
  } catch {
    return FALLBACK_ZONES;
  }
};

/** Google Calendar "add event" link for a booked appointment. */
export const googleCalendarUrl = ({ title, start, end, details, location }) => {
  const fmt = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({ action: 'TEMPLATE', text: title, dates: `${fmt(start)}/${fmt(end)}`, details, location });
  return `https://calendar.google.com/calendar/render?${params}`;
};
