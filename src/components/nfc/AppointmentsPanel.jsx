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
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1" role="group" aria-label="Appointments view">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => choose(v.id)}
              aria-pressed={view === v.id}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                view === v.id ? 'bg-[#263646] text-white' : 'text-gray-600 hover:text-[#263646]'
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
