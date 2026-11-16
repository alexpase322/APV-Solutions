import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LogoMark } from '../../site/ui/Logo';

const AppHeader = ({ subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-900/80 backdrop-blur-xl backdrop-saturate-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3 min-w-0 rounded-xl">
          <LogoMark className="size-9 flex-shrink-0 transition-transform duration-500 ease-out-expo group-hover:-rotate-6" />
          <div className="flex flex-col min-w-0 leading-none">
            <span className="text-[19px] font-semibold tracking-[-0.03em] text-ink-50">APV</span>
            <span className="mt-1 truncate font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-sage-300">{subtitle}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden sm:block text-sm text-ink-200 truncate max-w-[220px]">{user?.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm font-medium text-ink-50 transition-colors hover:border-white/25 hover:bg-white/[0.07]"
          >
            <LogOut size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
