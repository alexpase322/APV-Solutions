import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[#263646] placeholder:text-gray-400 focus:border-[#94A378] focus:ring-2 focus:ring-[#94A378]/20 outline-none transition-all';

export const Field = ({ id, label, hint, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-[#263646]">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

export const Section = ({ title, description, children, action }) => (
  <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-bold text-[#263646]">{title}</h2>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

export const Alert = ({ kind = 'error', children }) => {
  if (!children) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-[#E4B34C]/10 border-[#E4B34C]/40 text-[#263646]',
  };
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`rounded-xl border px-4 py-3 text-sm ${styles[kind]}`}>
      {children}
    </div>
  );
};

export const CopyButton = ({ value, label = 'Copy', className = '' }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback for browsers without clipboard permission
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
        copied ? 'bg-green-600 text-white' : 'bg-[#263646] text-white hover:bg-[#94A378]'
      } ${className}`}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  );
};

const STATUS = {
  invited: { label: 'Pending activation', cls: 'bg-[#E4B34C]/15 text-[#8a6412]' },
  active: { label: 'Active', cls: 'bg-[#94A378]/15 text-[#4d5a37]' },
  disabled: { label: 'Blocked', cls: 'bg-red-100 text-red-700' },
  inactive: { label: 'Card off', cls: 'bg-gray-200 text-gray-600' },
};

export const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.inactive;
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${s.cls}`}>{s.label}</span>;
};
