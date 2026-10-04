import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AppHeader = ({ subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 bg-[#263646] rounded-tr-xl rounded-bl-xl flex items-center justify-center flex-shrink-0">
            <BarChart3 className="text-[#E4B34C] w-5 h-5" aria-hidden="true" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-lg tracking-tight text-[#263646] leading-none">APV</span>
            <span className="text-[0.6rem] tracking-widest text-[#94A378] font-bold truncate">{subtitle}</span>
          </div>
        </Link>

        <div className="flex items-center gap-3 min-w-0">
          <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[220px]">{user?.email}</span>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-[#263646] hover:border-[#263646] transition-colors"
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
