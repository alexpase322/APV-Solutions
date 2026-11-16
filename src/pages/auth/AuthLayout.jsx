import React from 'react';
import { Link } from 'react-router-dom';
import useNoIndex from '../../hooks/useNoIndex';
import { LogoMark } from '../../site/ui/Logo';
import { Aurora } from '../../site/ui/primitives';

const AuthLayout = ({ title, subtitle, children, footer, pageTitle }) => {
  useNoIndex(pageTitle ? `${pageTitle} · APV Cards` : 'APV Cards');

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-ink-900 flex flex-col items-center justify-center px-4 py-12">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Aurora variant="subtle" />
        <div className="absolute inset-0 bg-grid opacity-60 mask-radial" />
      </div>

      <Link to="/" className="group flex items-center gap-3 mb-8 rounded-xl">
        <LogoMark className="size-10 transition-transform duration-500 ease-out-expo group-hover:-rotate-6" />
        <div className="flex flex-col leading-none">
          <span className="text-xl font-semibold tracking-[-0.03em] text-ink-50">APV</span>
          <span className="mt-1 font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-sage-300">Digital cards</span>
        </div>
      </Link>

      <div className="w-full max-w-md surface rounded-4xl p-8 backdrop-blur">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-ink-50">{title}</h1>
        {subtitle && <p className="text-ink-200 mt-2 mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-ink-200 text-center">{footer}</div>}
    </main>
  );
};

export default AuthLayout;
