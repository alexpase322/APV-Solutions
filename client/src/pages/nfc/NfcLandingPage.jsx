import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Building2,
  ChevronDown,
  Leaf,
  MessageCircle,
  Nfc,
  PenLine,
  QrCode,
  RefreshCw,
  Smartphone,
  Store,
  UserPlus,
  Users,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppBtn from '../../components/WhatsAppBtn';
import CardProfile from '../../components/nfc/CardProfile';
import useSeo from '../../hooks/useSeo';

const ORDER_HREF = `https://wa.me/18634411687?text=${encodeURIComponent("Hi! I'd like to order an APV NFC business card.")}`;

const DEMO_PROFILE = {
  fullName: 'Alex Rivera',
  jobTitle: 'Realtor',
  company: 'Tampa Bay Homes',
  bio: 'Helping families buy and sell homes across Tampa Bay. Bilingual English / Español.',
  accentColor: '#263646',
  theme: 'light',
  tags: ['Bilingual', 'First-time buyers', 'Tampa Bay'],
  phone: '+1 813 555 0100',
  whatsapp: '+1 813 555 0100',
  email: 'alex@example.com',
  website: 'https://example.com',
  socials: [
    { platform: 'instagram', label: 'See my latest homes on Instagram', url: 'https://instagram.com' },
    { platform: 'tiktok', label: 'Home tours on TikTok', url: 'https://tiktok.com' },
    { platform: 'linkedin', label: 'Connect on LinkedIn', url: 'https://linkedin.com' },
  ],
  links: [
    { label: 'Book a showing', url: 'https://example.com' },
  ],
};

const STEPS = [
  {
    icon: Briefcase,
    title: 'Get your card',
    text: 'Order your NFC card with APV. We create your account and program the card for you on the spot.',
  },
  {
    icon: PenLine,
    title: 'Build your profile',
    text: 'You receive an email to activate your account. Add your photo, contact info, social media and links.',
  },
  {
    icon: Smartphone,
    title: 'Tap & share',
    text: 'Hold your card near any phone. Your profile opens instantly and they can save your contact in one tap.',
  },
];

const FEATURES = [
  { icon: Smartphone, title: 'No app needed', text: 'Works with the built-in NFC reader of modern iPhone and Android phones.' },
  { icon: UserPlus, title: 'Save contact in one tap', text: 'Visitors download your contact card with photo, phone, email and company.' },
  { icon: RefreshCw, title: 'Update anytime', text: 'Changed jobs or phone number? Edit your profile — the card never needs reprogramming.' },
  { icon: QrCode, title: 'QR code backup', text: 'Every card comes with a QR code for phones without NFC or for your email signature.' },
  { icon: BarChart3, title: 'View analytics', text: 'See how many times your profile has been opened from your dashboard.' },
  { icon: Leaf, title: 'One card, forever', text: 'Stop reprinting paper cards. One smart card replaces hundreds of paper ones.' },
];

const AUDIENCES = [
  { icon: Building2, label: 'Realtors' },
  { icon: Users, label: 'Sales teams' },
  { icon: Store, label: 'Small business owners' },
  { icon: Briefcase, label: 'Freelancers & consultants' },
];

const FAQS = [
  {
    q: 'Does the other person need to install an app?',
    a: 'No. iPhone (XS and newer) and most Android phones read NFC natively — they just hold the phone near your card. For older phones, they can scan the QR code.',
  },
  {
    q: 'What if my information changes?',
    a: 'Log in to your dashboard and update your profile. Changes are live instantly. The card itself keeps working with the same link forever.',
  },
  {
    q: 'What can I show on my profile?',
    a: 'Your photo, cover image, name, title, company, bio, phone, WhatsApp, email, website, address, social media and up to 10 custom links (booking page, listings, menu, reviews…).',
  },
  {
    q: 'Can I order cards for my whole team?',
    a: 'Yes. Each team member gets their own card and profile. Contact us for team orders.',
  },
];

const PhoneMock = () => (
  <div className="relative mx-auto w-[290px] h-[590px] rounded-[2.75rem] border-[10px] border-[#1a2530] bg-[#F8F9FA] shadow-2xl overflow-hidden">
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1a2530] rounded-full z-10" aria-hidden="true" />
    <div className="h-full overflow-hidden pt-4">
      {/* Rendered at 80% so the link buttons fit on the phone screen, like a real device would show */}
      <div style={{ width: '125%', transform: 'scale(0.8)', transformOrigin: 'top left' }}>
        <CardProfile profile={DEMO_PROFILE} preview />
      </div>
    </div>
  </div>
);

const PhysicalCard = () => (
  <div
    className="absolute -left-4 sm:-left-16 top-[570px] w-60 h-36 rounded-2xl bg-gradient-to-br from-[#263646] via-[#2f4457] to-[#1a2530] shadow-2xl border border-white/10 p-5 flex flex-col justify-between -rotate-6"
    aria-hidden="true"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 bg-[#E4B34C] rounded-tr-lg rounded-bl-lg flex items-center justify-center">
          <BarChart3 className="text-[#263646] w-4 h-4" />
        </div>
        <span className="text-white font-bold tracking-tight">APV</span>
      </div>
      <Nfc className="text-[#E4B34C]" size={22} />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">Alex Rivera</p>
      <p className="text-[#94A378] text-[10px] tracking-widest font-bold">TAP TO CONNECT</p>
    </div>
  </div>
);

const NfcLandingPage = () => {
  useSeo({
    title: 'NFC Digital Business Cards',
    description:
      'Smart NFC business cards by APV Business Solutions. Share your contact, social media and links with one tap — no app needed. Update your profile anytime.',
    path: '/nfc',
  });

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* HERO */}
        <section className="bg-[#263646] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-[#94A378] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/3 -translate-y-1/3" aria-hidden="true" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center relative">
            <div className="text-center lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-[#E4B34C] mb-6">
                <Nfc size={16} aria-hidden="true" /> APV Digital Business Cards
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                One tap. Your whole <span className="text-[#94A378]">professional profile.</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                A smart NFC card that shares your contact info, social media and links the moment someone taps it with their phone.
                No app, no paper, always up to date.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={ORDER_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E4B34C] px-8 py-4 font-bold text-[#263646] hover:bg-white transition-colors"
                >
                  Order your card <ArrowRight size={20} aria-hidden="true" />
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
                >
                  How it works
                </a>
              </div>
              <p className="mt-6 text-sm text-gray-400">
                Already have a card?{' '}
                <Link to="/login" className="font-semibold text-white underline underline-offset-4 hover:text-[#E4B34C]">
                  Log in to edit your profile
                </Link>
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end pb-32">
              <PhoneMock />
              <PhysicalCard />
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-20 bg-white scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#94A378] font-bold tracking-wider uppercase text-xs">How it works</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#263646] mt-3">Ready in three simple steps</h2>
            </div>
            <ol className="grid md:grid-cols-3 gap-8">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative bg-[#F8F9FA] rounded-2xl p-8 border border-gray-100">
                  <span className="absolute top-6 right-6 text-5xl font-bold text-gray-200" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div className="w-14 h-14 rounded-xl bg-[#263646] text-[#E4B34C] flex items-center justify-center mb-6">
                    <s.icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-[#263646] mb-2">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[#94A378] font-bold tracking-wider uppercase text-xs">Why APV cards</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#263646] mt-3">Everything a modern professional needs</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <f.icon className="text-[#94A378] mb-4" size={28} aria-hidden="true" />
                  <h3 className="text-lg font-bold text-[#263646] mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AUDIENCE */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-[#263646] mb-10">Perfect for</h2>
            <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AUDIENCES.map((a) => (
                <li key={a.label} className="flex flex-col items-center gap-3 rounded-2xl border border-gray-100 p-6">
                  <a.icon className="text-[#263646]" size={28} aria-hidden="true" />
                  <span className="font-semibold text-[#263646]">{a.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#263646] text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-3">
              {FAQS.map((f) => (
                <details key={f.q} className="group bg-white rounded-2xl border border-gray-100 p-5 open:shadow-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#263646]">
                    {f.q}
                    <ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-gray-600 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#263646] py-16 px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Make every introduction count</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">Order your APV NFC card today and start sharing your profile with a single tap.</p>
          <a
            href={ORDER_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#E4B34C] px-8 py-4 font-bold text-[#263646] hover:bg-white transition-colors"
          >
            <MessageCircle size={20} aria-hidden="true" /> Order on WhatsApp
          </a>
        </section>
      </main>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default NfcLandingPage;
