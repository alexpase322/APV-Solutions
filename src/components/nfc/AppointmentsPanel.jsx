import React, { useState } from 'react';
import { CalendarDays, List } from 'lucide-react';
import AppointmentsCalendar from './AppointmentsCalendar';
import AppointmentsList from './AppointmentsList';

const VIEWS = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'list', label: 'List', icon: List },
];
const STORAGE_KEY = 'apv_appointments_view';

const savedView = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'list' ? 'list' : 'calendar';
  } catch {
    return 'calendar';
  }
};

/** Appointments of a card as a month calendar (default) or an upcoming/past list. Same props as AppointmentsList. */
const AppointmentsPanel = (props) => {
  const [view, setView] = useState(savedView);

  const choose = (id) => {
    setView(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* storage blocked */
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1" role="group" aria-label="Appointments view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => choose(v.id)}
              aria-pressed={view === v.id}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                view === v.id ? 'bg-sage-300 text-ink-950' : 'text-ink-200 hover:bg-white/[0.05] hover:text-ink-50'
              }`}
            >
              <v.icon size={15} aria-hidden="true" /> {v.label}
            </button>
          ))}
        </div>
      </div>
      {view === 'calendar' ? <AppointmentsCalendar {...props} /> : <AppointmentsList {...props} />}
    </div>
  );
};

export default AppointmentsPanel;
