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
    <Link to="/login" className="font-semibold text-sage-300 underline-offset-4 hover:text-sage-200 hover:underline transition-colors">
      Back to log in
    </Link>
  );

  if (sent) {
    return (
      <AuthLayout pageTitle="Reset password" title="Check your email" footer={back}>
        <div className="flex flex-col items-center text-center gap-4 py-2">
          <div className="size-14 rounded-2xl border border-sage-300/20 bg-sage-300/[0.08] text-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] flex items-center justify-center">
            <MailCheck size={28} aria-hidden="true" />
          </div>
          <p className="leading-relaxed text-ink-100">
            If <strong className="font-semibold text-ink-50 break-all">{email}</strong> is registered, you'll receive a link in a few minutes.
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sage-300 py-3.5 font-semibold text-ink-950 hover:bg-sage-200 disabled:opacity-60 disabled:hover:bg-sage-300 transition-colors"
        >
          {busy && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {busy ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
