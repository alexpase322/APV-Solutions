import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2, LogIn } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { PasswordInput } from './PasswordFields';
import { Alert, Field, inputClass } from '../../components/nfc/ui';
import { homeFor, useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) return <Navigate to={homeFor(user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(email, password);
      const from = location.state?.from;
      navigate(from && from !== '/login' ? from : homeFor(u), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Log in"
      title="Welcome back"
      subtitle="Log in to edit your digital business card."
      footer={
        <>
          Don't have a card yet?{' '}
          <Link to="/nfc" className="font-semibold text-[#94A378] hover:underline">
            Get yours
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field id="login-email" label="Email">
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <Field id="login-password" label="Password">
          <PasswordInput id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm font-medium text-[#94A378] hover:underline">
            Forgot your password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] py-3.5 font-bold text-white hover:bg-[#94A378] disabled:opacity-60 transition-colors"
        >
          {busy ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <LogIn size={18} aria-hidden="true" />}
          {busy ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
