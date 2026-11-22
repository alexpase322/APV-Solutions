/** Content shared across the marketing site. */

export const SITE = {
  name: 'APV Business Solutions',
  legalName: 'APV Business Solutions LLC',
  short: 'APV',
  tagline: 'Empowering businesses through custom software, intelligent automation, and data-driven insights.',
  email: 'info@apvsolutions.tech',
  legalEmail: 'info@apvsolutions.tech',
  phoneDisplay: '+1 (863) 441-1687',
  phoneHref: 'tel:+18634411687',
  whatsappHref: 'https://wa.me/18634411687',
  location: 'Remote / Global Services',
  region: 'US & LATAM',
  hq: 'Tampa, Florida',
  year: new Date().getFullYear(),
};

export const NFC_ORDER_HREF =
  "https://wa.me/18634411687?text=Hi!%20I'd%20like%20to%20order%20an%20APV%20NFC%20business%20card.";

export const APP_LINKS = { login: '/login' };

export const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'NFC Cards', to: '/nfc' },
  { label: 'About Us', to: '/about' },
];

export const CONTACT_PATH = '/#contact';

export const SOCIALS = [
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/APVBusinessSolutions' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/apv.business.solutions/' },
  { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@apv.businesshub' },
  { key: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/18634411687' },
];

export const FOOTER_SERVICES = ['Custom Development', 'Process Automation', 'Business Intelligence', 'Consulting'];

export const PRACTICES = [
  {
    id: 'software',
    index: '01',
    title: 'Custom Software Development',
    short: 'Custom Software',
    description:
      'We build scalable, robust, and secure web and mobile applications tailored specifically to your business needs using modern technologies like React and Python.',
    bullets: ['Web & Mobile Apps', 'API Integration', 'Legacy System Modernization'],
  },
  {
    id: 'automation',
    index: '02',
    title: 'No-Code Process Automation',
    short: 'Automation',
    description:
      'Eliminate repetitive tasks and human error. We design automated workflows that connect your favorite tools, saving you hundreds of hours per month.',
    bullets: ['Workflow Optimization', 'CRM Automation', 'Chatbot Implementation'],
  },
  {
    id: 'bi',
    index: '03',
    title: 'BI & Data Dashboards',
    short: 'Business Intelligence',
    description:
      'Turn your data into actionable insights. We create interactive dashboards that give you real-time visibility into your KPIs and business performance.',
    bullets: ['Real-time Reporting', 'Data Visualization', 'Predictive Analytics'],
  },
];

export const CAPABILITIES = [
  'Web & Mobile Apps',
  'API Integration',
  'Legacy System Modernization',
  'Workflow Optimization',
  'CRM Automation',
  'Chatbot Implementation',
  'Real-time Reporting',
  'Data Visualization',
  'Predictive Analytics',
  'Cloud Native on AWS & Google Cloud',
  'Java SpringBoot & Python backends',
  'React & Tailwind frontends',
  'WhatsApp automations',
  'Power BI dashboards',
  'AI-assisted CRMs',
  'NFC digital business cards',
];

export const STATS = [
  { value: 100, suffix: '%', label: 'Project Commitment' },
  { value: 50, suffix: '+', label: 'Happy Clients' },
  { value: 10, suffix: 'x', label: 'Efficiency Boost' },
  { value: 24, suffix: '/7', label: 'Support & Maintenance' },
];

export const VALUES = ['Client-Centric Approach', 'Scalable Architecture', 'Data-Driven Decisions', 'Agile Methodology'];

/** `logo` is a key of BRAND_ICONS; techs without one render initials. */
export const CORE_TECH = [
  { name: 'React', logo: 'react' },
  { name: 'TailwindCSS', logo: 'tailwindcss' },
  { name: 'Python', logo: 'python' },
  { name: 'Node.js', logo: 'nodedotjs' },
  { name: 'n8n', logo: 'n8n' },
  { name: 'Java', logo: 'openjdk' },
  { name: 'Angular', logo: 'angular' },
  { name: 'Power BI' },
  { name: 'Glide', logo: 'glide' },
];

export const ALL_TECH = [
  ...CORE_TECH,
  { name: 'Spring Boot', logo: 'springboot' },
  { name: 'FastAPI', logo: 'fastapi' },
  { name: 'PostgreSQL', logo: 'postgresql' },
  { name: 'Google Cloud', logo: 'googlecloud' },
  { name: 'AWS' },
  { name: 'Zapier', logo: 'zapier' },
  { name: 'HubSpot', logo: 'hubspot' },
  { name: 'Twilio' },
  { name: 'OpenAI API' },
  { name: 'Looker Studio', logo: 'looker' },
  { name: 'Tableau' },
];

export const PRODUCTS = [
  {
    slug: 'jornixs',
    name: 'Jornixs',
    category: 'SaaS · Workforce Management',
    tagline: 'Always on time. Always in control.',
    description:
      'Time-tracking and payroll platform designed for 1099-NEC independent contractors and the businesses that employ them in the US. Replaces paper timesheets with geolocation-validated clock-ins and automated payroll reports.',
    features: [
      'Geolocation-validated clock in/out with lunch tracking',
      'Automatic weekly overtime calculation (1.5x)',
      'Timesheet approval workflow for managers',
      'Consolidated & detailed payroll reports (PDF / Excel)',
    ],
    stack: ['React', 'Tailwind', 'Node.js', 'PostgreSQL', 'Geolocation API'],
    href: 'https://jornixs.com/',
    status: 'live',
  },
  {
    slug: 'listingai',
    name: 'APV ListingAI',
    category: 'AI · Real Estate',
    tagline: 'Publish stunning property listings in minutes, not hours.',
    description:
      'AI-powered listing platform built for real estate agencies. Turns a few photos and basic property data into complete, polished listings for both rental and sale properties — ready to publish across portals and social media.',
    features: [
      'AI-generated property descriptions (rent & sale)',
      'Automatic highlight extraction from photos',
      'Multi-channel publishing for real estate portals',
      'Agency branding and multi-agent workspace',
    ],
    stack: ['React', 'Python', 'OpenAI API', 'FastAPI', 'PostgreSQL'],
    status: 'soon',
  },
  {
    slug: 'apvnexus',
    name: 'APVNexus',
    category: 'CRM · AI-Powered',
    tagline: 'A smarter CRM, powered by AI.',
    description:
      'Modern CRM with native AI integrations designed for sales and support teams. Manages deals, contacts and tickets in one place while AI helps draft replies, score leads and summarize conversations automatically.',
    features: [
      'Deal & pipeline management',
      'Ticket and support workflows',
      'AI-assisted replies, summaries and lead scoring',
      'Contact and company 360° view',
    ],
    stack: ['React', 'Node.js', 'OpenAI API', 'PostgreSQL', 'REST APIs'],
    href: 'https://apvnexus.com/',
    status: 'live',
  },
];

export const TEAM = [
  { name: 'Alexander Pastrana Serrato', role: 'Co-Founder & Lead Developer', initials: 'APS' },
  {
    name: 'Alexander Pastrana Villamil',
    role: 'Co-Founder & Chief Financial & Administrative Officer (CFAO) — Power BI Specialist',
    initials: 'APV',
    photo: '/team/alexander-pastrana-villamil.jpeg',
  },
];

export const NFC_AUDIENCES = ['Realtors', 'Sales teams', 'Small business owners', 'Freelancers & consultants'];
