import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { NewPasswordFields } from './PasswordFields';
import { passwordError } from '../../lib/nfc';
import { Alert } from '../../components/nfc/ui';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

const ActivatePage = () => {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [invite, setInvite] = useState({ status: token ? 'loading' : 'invalid', email: '', name: '', error: '' });
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    api('/api/auth/invite/info', { method: 'POST', body: { token }, auth: false, signal: controller.signal })
      .then((data) => setInvite({ status: 'ready', ...data, error: '' }))
      .catch((err) => {
        if (err.name !== 'AbortError') setInvite({ status: 'invalid', email: '', name: '', error: err.message });
      });
    return () => controller.abort();
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    const problem = passwordError(password, confirm);
    if (problem) return setError(problem);
    setBusy(true);
    setError('');
    try {
      const data = await api('/api/auth/activate', { method: 'POST', body: { token, password }, auth: false });
      setSession(data);
      navigate('/dashboard?welcome=1', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (invite.status === 'loading') {
    return (
      <AuthLayout pageTitle="Activate account" title="Checking your invitation…">
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-[#94A378]" size={28} aria-hidden="true" />
        </div>
      </AuthLayout>
    );
  }

  if (invite.status === 'invalid') {
    return (
      <AuthLayout
        pageTitle="Activate account"
        title="Link not valid"
        subtitle={invite.error || 'This activation link is missing or has expired.'}
        footer={
          <Link to="/login" className="font-semibold text-[#94A378] hover:underline">
            Go to log in
          </Link>
        }
      >
        <p className="text-sm text-gray-600">
          Already activated? Just log in. Otherwise use <strong>Forgot password</strong> with your email and we'll send you a
          fresh activation link, or contact APV Business Solutions.
        </p>
        <Link
          to="/forgot-password"
          className="mt-6 w-full inline-flex items-center justify-center rounded-xl bg-[#263646] py-3.5 font-bold text-white hover:bg-[#94A378] transition-colors"
        >
          Send me a new link
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      pageTitle="Activate account"
      title={`Welcome${invite.name ? `, ${invite.name.split(' ')[0]}` : ''}! 👋`}
      subtitle="Create a password to activate your APV digital card. Then you'll be able to complete your profile."
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <div className="rounded-xl bg-[#F8F9FA] px-4 py-3 text-sm">
          <span className="text-gray-500">Account: </span>
          <span className="font-semibold text-[#263646]">{invite.email}</span>
        </div>
        <NewPasswordFields password={password} confirm={confirm} setPassword={setPassword} setConfirm={setConfirm} />
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] py-3.5 font-bold text-white hover:bg-[#94A378] disabled:opacity-60 transition-colors"
        >
          {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Activating…' : 'Activate my card'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ActivatePage;
