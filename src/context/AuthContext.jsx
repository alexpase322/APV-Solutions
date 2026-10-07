import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, onUnauthorized, tokenStore } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => Boolean(tokenStore.get()));

  const logout = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  /** Stores a session returned by login / activate / reset-password. */
  const setSession = useCallback(({ token, user: nextUser }) => {
    tokenStore.set(token);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (email, password) => {
      const data = await api('/api/auth/login', { method: 'POST', body: { email, password }, auth: false });
      setSession(data);
      return data.user;
    },
    [setSession]
  );

  useEffect(() => {
    onUnauthorized(logout);
    if (!tokenStore.get()) return undefined;

    const controller = new AbortController();
    api('/api/auth/me', { signal: controller.signal })
      .then((data) => setUser(data.user))
      .catch((err) => {
        if (err.name !== 'AbortError' && err.status === 401) logout();
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [logout]);

  const value = useMemo(() => ({ user, loading, login, logout, setSession }), [user, loading, login, logout, setSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export const homeFor = (user) => ({ superadmin: '/admin', reseller: '/reseller' })[user?.role] || '/dashboard';
