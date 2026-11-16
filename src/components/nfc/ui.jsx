import React, { useState } from 'react';
import { Check, Copy, Loader2 } from 'lucide-react';
import { productById, productsOf } from '../../lib/products';

export const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-white/10 bg-ink-900/60 text-ink-50 placeholder:text-ink-300 focus:border-sage-300/60 focus:ring-2 focus:ring-sage-300/20 outline-none transition-all';

export const Field = ({ id, label, hint, children }) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="block text-sm font-medium text-ink-100">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-ink-200">{hint}</p>}
  </div>
);

export const Section = ({ title, description, children, action }) => (
  <section className="surface rounded-3xl p-5 sm:p-6">
    <div className="flex items-start justify-between gap-4 mb-5">
      <div>
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink-50">{title}</h2>
        {description && <p className="text-sm text-ink-200 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

export const Alert = ({ kind = 'error', children }) => {
  if (!children) return null;
  const styles = {
    error: 'bg-red-500/10 border-red-400/30 text-red-200',
    success: 'bg-sage-300/10 border-sage-300/30 text-sage-100',
    info: 'bg-gold-400/10 border-gold-400/30 text-ink-50',
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
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
        copied ? 'bg-sage-200 text-ink-950' : 'bg-sage-300 text-ink-950 hover:bg-sage-200'
      } ${className}`}
    >
      {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
      {copied ? 'Copied' : label}
    </button>
  );
};

const STATUS = {
  invited: { label: 'Pending activation', cls: 'border-gold-400/30 bg-gold-400/10 text-gold-300' },
  active: { label: 'Active', cls: 'border-sage-300/30 bg-sage-300/10 text-sage-200' },
  disabled: { label: 'Blocked', cls: 'border-red-400/30 bg-red-500/10 text-red-300' },
  inactive: { label: 'Card off', cls: 'border-white/10 bg-white/[0.04] text-ink-200' },
};

export const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.inactive;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${s.cls}`}>{s.label}</span>;
};

export const ActionButton = ({ onClick, icon, children, danger, busy, disabled, type = 'button' }) => {
  const Icon = icon;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={busy || disabled}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-50 ${
        danger
          ? 'border-red-400/30 text-red-300 hover:border-red-400/60 hover:bg-red-500/10'
          : 'border-white/10 bg-white/[0.03] text-ink-50 hover:border-white/25 hover:bg-white/[0.07]'
      }`}
    >
      {busy ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <Icon size={15} aria-hidden="true" />}
      {children}
    </button>
  );
};

/** Small pill with the product icon + name (card, bracelet…), with the quantity when > 1. */
export const ProductBadge = ({ type, qty = 1 }) => {
  const product = productById(type);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 font-semibold text-ink-100">
      <product.icon size={12} aria-hidden="true" />
      {qty > 1 ? `${qty}× ` : ''}
      {product.short}
    </span>
  );
};

/** All the products of a client (they share the same NFC link). */
export const ProductBadges = ({ card }) => (
  <span className="inline-flex flex-wrap items-center gap-1" title="Products programmed with this link">
    {productsOf(card).map((p) => (
      <ProductBadge key={p.type} type={p.type} qty={p.qty} />
    ))}
  </span>
);

export const Pagination = ({ page, pages, onChange }) => {
  if (pages <= 1) return null;
  const btn = 'rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-ink-50 transition-colors hover:border-white/25 disabled:opacity-40';
  return (
    <div className="flex items-center justify-center gap-3">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} className={btn}>
        Previous
      </button>
      <span className="text-sm text-ink-200">
        Page {page} of {pages}
      </span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pages} className={btn}>
        Next
      </button>
    </div>
  );
};

export const selectClass =
  'rounded-xl border border-white/10 bg-ink-900/60 px-3 py-2 text-sm text-ink-50 focus:border-sage-300/60 focus:ring-2 focus:ring-sage-300/20 outline-none';
