import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import { LEGAL_DOCS, LABELS } from '../lib/legal';
import useSeo from '../hooks/useSeo';

const VALID_DOCS = ['terms', 'privacy'];
const VALID_LANGS = ['en', 'es'];

const LegalPage = () => {
  const [params, setParams] = useSearchParams();

  const rawDoc = params.get('doc');
  const rawLang = params.get('lang');
  const doc = VALID_DOCS.includes(rawDoc) ? rawDoc : 'terms';
  const lang = VALID_LANGS.includes(rawLang) ? rawLang : 'en';

  const data = LEGAL_DOCS[doc][lang];
  const t = LABELS[lang];

  useSeo({
    title: `${data.title} — APV Business Solutions`,
    description:
      lang === 'es'
        ? 'Términos de Servicio y Política de Privacidad de APV Business Solutions LLC. Información legal sobre el uso de nuestros servicios e integraciones con TikTok, Instagram y Facebook.'
        : 'Terms of Service and Privacy Policy for APV Business Solutions LLC. Legal information about our services and integrations with TikTok, Instagram and Facebook.',
    path: `/legal?doc=${doc}&lang=${lang}`,
    includeBrand: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [doc, lang]);

  const setDoc = (d) => setParams({ doc: d, lang });
  const setLang = (l) => setParams({ doc, lang: l });

  const renderParagraph = (text, idx) => {
    const isBullet = text.trim().startsWith('•');
    return (
      <p
        key={idx}
        className={`text-gray-700 leading-relaxed ${isBullet ? 'pl-4 mb-2' : 'mb-3'}`}
      >
        {text}
      </p>
    );
  };

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-white min-h-screen">
        {/* HEADER */}
        <div className="bg-[#263646] text-white py-16 px-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#94A378] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E4B34C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <span className="text-[#E4B34C] font-bold tracking-widest uppercase text-xs mb-3 block">
              {lang === 'es' ? 'Información Legal' : 'Legal Information'}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">{data.title}</h1>
            <p className="text-gray-300 text-lg">{data.subtitle}</p>
          </div>
        </div>

        {/* TOGGLES */}
        <div className="bg-[#F8F9FA] border-b border-gray-200 sticky top-20 z-30">
          <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:inline">
                {t.document}:
              </span>
              <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setDoc('terms')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    doc === 'terms'
                      ? 'bg-[#263646] text-white'
                      : 'text-gray-600 hover:text-[#263646]'
                  }`}
                >
                  {t.terms}
                </button>
                <button
                  onClick={() => setDoc('privacy')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    doc === 'privacy'
                      ? 'bg-[#263646] text-white'
                      : 'text-gray-600 hover:text-[#263646]'
                  }`}
                >
                  {t.privacy}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:inline">
                {t.language}:
              </span>
              <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    lang === 'en'
                      ? 'bg-[#94A378] text-white'
                      : 'text-gray-600 hover:text-[#263646]'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('es')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    lang === 'es'
                      ? 'bg-[#94A378] text-white'
                      : 'text-gray-600 hover:text-[#263646]'
                  }`}
                >
                  ES
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10 p-5 bg-[#F8F9FA] rounded-xl border border-gray-100 text-sm">
            <div>
              <span className="font-semibold text-[#263646]">{t.effectiveDate}: </span>
              <span className="text-gray-600">{data.meta.effectiveDate}</span>
            </div>
            <div>
              <span className="font-semibold text-[#263646]">{t.lastUpdated}: </span>
              <span className="text-gray-600">{data.meta.lastUpdated}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-[#263646]">{t.company}: </span>
              <span className="text-gray-600">{data.meta.company}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="font-semibold text-[#263646]">{t.contact}: </span>
              <a
                href={`mailto:${data.meta.contact}`}
                className="text-[#94A378] hover:underline"
              >
                {data.meta.contact}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {data.sections.map((section, idx) => {
              const HeadingTag = section.level === 1 ? 'h2' : 'h3';
              const headingClass =
                section.level === 1
                  ? 'text-xl md:text-2xl font-bold text-[#263646] mt-8 mb-4 pb-2 border-b border-gray-100'
                  : 'text-lg font-semibold text-[#94A378] mt-5 mb-2';
              return (
                <section key={idx}>
                  <HeadingTag className={headingClass}>{section.title}</HeadingTag>
                  {section.paragraphs.map(renderParagraph)}
                </section>
              );
            })}
          </div>
        </article>
      </div>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default LegalPage;
