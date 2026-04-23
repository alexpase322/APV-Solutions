import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppBtn from '../components/WhatsAppBtn';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  Clock,
  MapPin,
  FileSpreadsheet,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Network,
  Database,
  Workflow,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const projects = [
  {
    id: 'jornixs',
    name: 'Jornixs',
    tagline: 'Always on time. Always in control.',
    category: 'SaaS · Workforce Management',
    url: 'https://jornixs.com',
    description:
      'Time-tracking and payroll platform designed for 1099-NEC independent contractors and the businesses that employ them in the US. Replaces paper timesheets with geolocation-validated clock-ins and automated payroll reports.',
    features: [
      'Geolocation-validated clock in/out with lunch tracking',
      'Automatic weekly overtime calculation (1.5x)',
      'Timesheet approval workflow for managers',
      'Consolidated & detailed payroll reports (PDF / Excel)',
    ],
    stack: ['React', 'Tailwind', 'Node.js', 'PostgreSQL', 'Geolocation API'],
    accent: '#94A378',
  },
  {
    id: 'listing-ai',
    name: 'APV ListingAI',
    tagline: 'Publish stunning property listings in minutes, not hours.',
    category: 'AI · Real Estate',
    url: null,
    description:
      'AI-powered listing platform built for real estate agencies. Turns a few photos and basic property data into complete, polished listings for both rental and sale properties — ready to publish across portals and social media.',
    features: [
      'AI-generated property descriptions (rent & sale)',
      'Automatic highlight extraction from photos',
      'Multi-channel publishing for real estate portals',
      'Agency branding and multi-agent workspace',
    ],
    stack: ['React', 'Python', 'OpenAI API', 'FastAPI', 'PostgreSQL'],
    accent: '#E4B34C',
  },
  {
    id: 'apvnexus',
    name: 'APVNexus',
    tagline: 'A smarter CRM, powered by AI.',
    category: 'CRM · AI-Powered',
    url: 'https://apvnexus.com',
    description:
      'Modern CRM with native AI integrations designed for sales and support teams. Manages deals, contacts and tickets in one place while AI helps draft replies, score leads and summarize conversations automatically.',
    features: [
      'Deal & pipeline management',
      'Ticket and support workflows',
      'AI-assisted replies, summaries and lead scoring',
      'Contact and company 360° view',
    ],
    stack: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL', 'REST APIs'],
    accent: '#263646',
  },
];

// Mock visuals per project (no real screenshots yet — keeps visual consistency with the rest of the site)
const JornixsMock = () => (
  <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>
      <div className="text-xs text-gray-400 font-mono">jornixs.com/dashboard</div>
    </div>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-[#F8F9FA] rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#94A378] rounded-lg text-white"><Clock size={18} /></div>
          <div>
            <p className="text-sm font-bold text-[#263646]">Clocked in</p>
            <p className="text-xs text-gray-500">07:58 AM · On site</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#94A378] font-semibold">
          <MapPin size={14} /> Verified
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100 text-center">
          <p className="text-xs text-gray-400">This week</p>
          <p className="text-lg font-bold text-[#263646]">38.5h</p>
        </div>
        <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Overtime</p>
          <p className="text-lg font-bold text-[#E4B34C]">2.5h</p>
        </div>
        <div className="bg-[#F8F9FA] p-3 rounded-lg border border-gray-100 text-center">
          <p className="text-xs text-gray-400">Payroll</p>
          <p className="text-lg font-bold text-[#94A378]">$1,540</p>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-[#263646] rounded-lg text-white text-xs">
        <FileSpreadsheet size={16} className="text-[#E4B34C]" />
        <span>Weekly payroll report ready — export PDF</span>
      </div>
    </div>
  </div>
);

const ListingAIMock = () => (
  <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div className="flex items-center gap-2">
        <Wand2 size={16} className="text-[#E4B34C]" />
        <span className="text-sm font-bold text-[#263646]">APV ListingAI</span>
      </div>
      <span className="text-xs bg-[#E4B34C]/20 text-[#E4B34C] font-semibold px-2 py-1 rounded-full">Generating…</span>
    </div>
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="w-16 h-16 bg-gradient-to-br from-[#94A378]/30 to-[#E4B34C]/30 rounded-lg flex items-center justify-center">
          <ImageIcon size={24} className="text-[#94A378]" />
        </div>
        <div className="flex-1 bg-[#F8F9FA] rounded-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-400 mb-1">AI Title</p>
          <p className="text-sm font-bold text-[#263646]">Modern 3BR Condo · Ocean View · Fully Furnished</p>
        </div>
      </div>
      <div className="bg-[#F8F9FA] rounded-lg p-3 border border-gray-100">
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
          <Sparkles size={12} className="text-[#E4B34C]" /> AI Bullets
        </p>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-200 rounded w-full"></div>
          <div className="h-2 bg-gray-200 rounded w-5/6"></div>
          <div className="h-2 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {['ocean view', '3 bedroom', 'furnished', 'downtown', 'pet friendly'].map((k) => (
          <span key={k} className="text-[10px] bg-[#263646] text-white px-2 py-0.5 rounded-full">{k}</span>
        ))}
      </div>
    </div>
  </div>
);

const NexusMock = () => (
  <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
      <div className="flex items-center gap-2">
        <Network size={16} className="text-[#94A378]" />
        <span className="text-sm font-bold text-[#263646]">APVNexus · CRM</span>
      </div>
      <span className="text-xs bg-[#E4B34C]/20 text-[#E4B34C] font-semibold px-2 py-1 rounded-full flex items-center gap-1">
        <Sparkles size={10} /> AI on
      </span>
    </div>
    <div className="grid grid-cols-4 gap-2 mb-4">
      {['Deals', 'Tickets', 'Contacts', 'AI'].map((t, i) => (
        <div key={t} className={`text-center text-xs font-bold p-2 rounded-lg ${i === 0 ? 'bg-[#263646] text-[#E4B34C]' : 'bg-[#F8F9FA] text-[#263646]'}`}>
          {t}
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-[#F8F9FA] p-2.5 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#94A378] rounded-full animate-pulse"></div>
          <span className="text-xs text-[#263646] font-medium">Deal moved to Negotiation · $12,400</span>
        </div>
        <ArrowRight size={12} className="text-gray-400" />
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] p-2.5 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Sparkles size={12} className="text-[#E4B34C]" />
          <span className="text-xs text-[#263646] font-medium">AI drafted reply for ticket #284</span>
        </div>
        <ArrowRight size={12} className="text-gray-400" />
      </div>
      <div className="flex items-center justify-between bg-[#F8F9FA] p-2.5 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#263646] rounded-full"></div>
          <span className="text-xs text-[#263646] font-medium">New lead scored · Hot (92)</span>
        </div>
        <ArrowRight size={12} className="text-gray-400" />
      </div>
    </div>
  </div>
);

const mockMap = {
  jornixs: <JornixsMock />,
  'listing-ai': <ListingAIMock />,
  apvnexus: <NexusMock />,
};

const iconMap = {
  jornixs: <Clock size={28} />,
  'listing-ai': <Wand2 size={28} />,
  apvnexus: <Network size={28} />,
};

const PortfolioPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="pt-20 bg-white min-h-screen">
        {/* HEADER */}
        <div className="bg-[#263646] text-white py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#94A378] rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E4B34C] rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 translate-y-1/2"></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-[#E4B34C] font-bold tracking-widest uppercase text-sm mb-4 block">Our Portfolio</span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Products We've <span className="text-[#94A378]">Built & Shipped</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              A selection of real platforms in production — from payroll SaaS to AI content tools and operations hubs.
            </p>
          </div>
        </div>

        {/* PROJECTS */}
        {projects.map((project, idx) => {
          const reverse = idx % 2 === 1;
          const bg = idx % 2 === 1 ? 'bg-[#F8F9FA]' : 'bg-white';
          return (
            <section key={project.id} className={`py-20 ${bg}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
                  {/* TEXT */}
                  <div className="w-full lg:w-1/2">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#94A378]">{project.category}</span>
                    <div className="flex items-center gap-3 mt-2 mb-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-white"
                        style={{ backgroundColor: project.accent }}
                      >
                        {iconMap[project.id]}
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-[#263646]">{project.name}</h2>
                    </div>
                    <p className="italic text-[#94A378] font-medium mb-4">"{project.tagline}"</p>
                    <p className="text-gray-600 mb-6 leading-relaxed text-lg">{project.description}</p>

                    <ul className="space-y-3 mb-6">
                      {project.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-gray-700">
                          <CheckCircle2 size={18} className="text-[#94A378] mt-1 flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.stack.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-semibold bg-[#263646] text-white px-3 py-1 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {project.url ? (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#263646] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#94A378] transition-colors shadow-lg"
                      >
                        Visit Live Site <ExternalLink size={16} />
                      </a>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-gray-200 text-gray-500 px-6 py-3 rounded-lg font-bold">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  {/* VISUAL */}
                  <div className="w-full lg:w-1/2 relative">
                    <div
                      className="absolute inset-0 rounded-full blur-3xl opacity-20"
                      style={{ backgroundColor: project.accent }}
                    ></div>
                    <div className="relative">{mockMap[project.id]}</div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <section className="bg-[#263646] py-16 text-center px-4">
          <h2 className="text-3xl text-white font-bold mb-4">Have a product in mind?</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            We turn ideas into production-grade platforms. Let's talk about yours.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/#contact"
              className="bg-[#E4B34C] text-[#263646] px-8 py-3 rounded-lg font-bold hover:bg-white transition-colors"
            >
              Start a Project
            </Link>
            <Link
              to="/services"
              className="bg-transparent text-white border border-white/30 px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors"
            >
              See Services
            </Link>
          </div>
        </section>
      </div>
      <Footer />
      <WhatsAppBtn />
    </>
  );
};

export default PortfolioPage;
