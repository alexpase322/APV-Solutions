import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { NewPasswordFields } from './PasswordFields';
import { passwordError } from '../../lib/nfc';
import { Alert } from '../../components/nfc/ui';
import { api } from '../../lib/api';
import { homeFor, useAuth } from '../../context/AuthContext';

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(token ? '' : 'This reset link is missing its token. Request a new one.');

  const submit = async (e) => {
    e.preventDefault();
    const problem = passwordError(password, confirm);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/auth/reset-password', { method: 'POST', body: { token, password }, auth: false });
      setSession(data);
      navigate(homeFor(data.user), { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="New password"
      title="Choose a new password"
      footer={
        <Link to="/forgot-password" className="font-semibold text-sage-300 underline-offset-4 hover:text-sage-200 hover:underline transition-colors">
          Request a new link
        </Link>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <NewPasswordFields password={password} confirm={confirm} setPassword={setPassword} setConfirm={setConfirm} />
        <button
          type="submit"
          disabled={busy || !token}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sage-300 py-3.5 font-semibold text-ink-950 hover:bg-sage-200 disabled:opacity-60 disabled:hover:bg-sage-300 transition-colors"
        >
          {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Saving…' : 'Save new password'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
