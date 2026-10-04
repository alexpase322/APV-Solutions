import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import useNoIndex from '../../hooks/useNoIndex';

const AuthLayout = ({ title, subtitle, children, footer, pageTitle }) => {
  useNoIndex(pageTitle ? `${pageTitle} · APV Cards` : 'APV Cards');

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-[#263646] rounded-tr-xl rounded-bl-xl flex items-center justify-center">
          <BarChart3 className="text-[#E4B34C] w-6 h-6" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-[#263646] leading-none">APV</span>
          <span className="text-[0.65rem] tracking-widest text-[#94A378] font-bold">DIGITAL CARDS</span>
        </div>
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        <h1 className="text-2xl font-bold text-[#263646]">{title}</h1>
        {subtitle && <p className="text-gray-600 mt-2 mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>

      {footer && <div className="mt-6 text-sm text-gray-600 text-center">{footer}</div>}
    </main>
  );
};

export default AuthLayout;
