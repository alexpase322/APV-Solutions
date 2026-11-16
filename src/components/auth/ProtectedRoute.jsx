import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { homeFor, useAuth } from '../../context/AuthContext';

export const FullPageLoader = ({ label = 'Loading…' }) => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-ink-900 text-ink-50">
    <Loader2 className="animate-spin text-sage-300" size={32} aria-hidden="true" />
    <p className="text-sm text-ink-200">{label}</p>
  </div>
);

/** Renders children only for logged-in users (optionally with a specific role). */
const ProtectedRoute = ({ role, children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <FullPageLoader label="Checking your session…" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={homeFor(user)} replace />;
  return children;
};

export default ProtectedRoute;
