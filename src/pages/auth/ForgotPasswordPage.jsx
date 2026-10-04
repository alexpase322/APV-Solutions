import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Alert, Field, inputClass } from '../../components/nfc/ui';
import { api } from '../../lib/api';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/api/auth/forgot-password', { method: 'POST', body: { email }, auth: false });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const back = (
    <Link to="/login" className="font-semibold text-[#94A378] hover:underline">
      Back to log in
    </Link>
  );

  if (sent) {
    return (
      <AuthLayout pageTitle="Reset password" title="Check your email" footer={back}>
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="w-14 h-14 rounded-full bg-[#94A378]/15 text-[#94A378] flex items-center justify-center">
            <MailCheck size={28} aria-hidden="true" />
          </div>
          <p className="text-gray-600">
            If <strong className="text-[#263646]">{email}</strong> is registered, you'll receive a link in a few minutes.
            Remember to check your spam folder.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      pageTitle="Reset password"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a link to set a new one."
      footer={back}
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field id="forgot-email" label="Email">
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#263646] py-3.5 font-bold text-white hover:bg-[#94A378] disabled:opacity-60 transition-colors"
        >
          {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
