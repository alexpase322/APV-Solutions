import React from 'react';
import { NavLink } from 'react-router-dom';
import { CalendarDays, IdCard } from 'lucide-react';

const TABS = [
  { to: '/dashboard', label: 'My card', icon: IdCard, end: true },
  { to: '/dashboard/appointments', label: 'Appointments', icon: CalendarDays },
];

/** Section tabs for the card owner's dashboard. */
const DashboardNav = () => (
  <nav aria-label="Dashboard sections" className="flex gap-1 overflow-x-auto border-b border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0">
    {TABS.map((t) => (
      <NavLink
        key={t.to}
        to={t.to}
        end={t.end}
        className={({ isActive }) =>
          `inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
            isActive ? 'border-[#263646] text-[#263646]' : 'border-transparent text-gray-500 hover:text-[#263646]'
          }`
        }
      >
        <t.icon size={16} aria-hidden="true" />
        {t.label}
      </NavLink>
    ))}
  </nav>
);

export default DashboardNav;
