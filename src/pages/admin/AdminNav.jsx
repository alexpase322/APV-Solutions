import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { CreditCard, Inbox, Store } from 'lucide-react';
import { api } from '../../lib/api';

const TABS = [
  { to: '/admin', label: 'Cards', icon: CreditCard, end: true },
  { to: '/admin/resellers', label: 'Resellers', icon: Store },
  { to: '/admin/requests', label: 'Requests', icon: Inbox, badge: 'pendingRequests' },
];

/** Section tabs for the super admin. Shows the number of pending reseller requests. */
const AdminNav = ({ refreshKey }) => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const controller = new AbortController();
    api('/api/admin/stats', { signal: controller.signal })
      .then(setCounts)
      .catch(() => {});
    return () => controller.abort();
  }, [refreshKey]);

  return (
    <nav aria-label="Admin sections" className="flex gap-1 overflow-x-auto border-b border-white/[0.08] -mx-4 px-4 sm:mx-0 sm:px-0">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              isActive ? 'border-sage-300 text-ink-50' : 'border-transparent text-ink-200 hover:text-ink-50'
            }`
          }
        >
          <t.icon size={16} aria-hidden="true" />
          {t.label}
          {t.badge && counts[t.badge] > 0 && (
            <span className="rounded-full bg-gold-400 px-2 py-0.5 text-xs font-bold text-ink-950">{counts[t.badge]}</span>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default AdminNav;
