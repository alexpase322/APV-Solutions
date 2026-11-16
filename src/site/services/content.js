import { ALL_TECH } from '../lib/site';

/** Copy for the /services page. Wrap words in *asterisks* to tint them sage in headlines. */

export const SEO = {
  title: 'Services — Custom Software, No-Code Automation & BI Dashboards | APV Business Solutions',
  description:
    'Custom web and mobile software, no-code process automation with n8n and Zapier, and interactive BI dashboards — designed and built by APV Business Solutions for businesses in the US and LATAM.',
  path: '/services',
};

export const HERO = {
  eyebrow: 'Our services',
  title: 'End-to-end digital solutions designed to *scale with your business*',
  description:
    'Three practices, one team: custom web and mobile software, no-code process automation, and BI dashboards that turn your data into decisions — for growing businesses across the US and LATAM.',
};

/** Entries of the sticky "jump to a service" bar; ids are the section anchors. */
export const SERVICE_NAV = [
  { id: 'software', index: '01', label: 'Custom software', short: 'Software' },
  { id: 'automation', index: '02', label: 'No-code automation', short: 'Automation' },
  { id: 'bi', index: '03', label: 'BI & data intelligence', short: 'BI & data' },
];

export const SOFTWARE = {
  id: 'software',
  index: '01',
  eyebrow: 'Custom software',
  title: 'Custom software *development*',
  body: 'Off-the-shelf software rarely fits perfectly. We engineer custom web and mobile applications tailored exactly to your operational workflows. We focus on scalability, security, and performance.',
  features: [
    { title: 'Backend robustness', text: 'Java SpringBoot & Python architectures.' },
    { title: 'Cloud native', text: 'AWS & Google Cloud integration.' },
  ],
  checklist: ['React & Tailwind frontend', 'API development & integration', 'Legacy system migration'],
};

export const AUTOMATION = {
  id: 'automation',
  index: '02',
  eyebrow: 'Process automation',
  title: 'No-code & process *automation*',
  body: 'Stop wasting talent on repetitive tasks. We build intelligent bots and workflows that connect your apps (CRM, Email, Sheets) automatically. We use tools like n8n and Zapier to deploy solutions in days, not months.',
  steps: [
    { n: '1', title: 'Workflow analysis', text: 'We identify bottlenecks in your daily operations.' },
    { n: '2', title: 'Integration', text: 'Connecting APIs without complex coding (Twilio, HubSpot, etc).' },
  ],
  link: { label: 'See automation examples', to: '/portfolio' },
  tools: ['n8n', 'Zapier', 'HubSpot', 'Twilio'],
};

export const BI = {
  id: 'bi',
  index: '03',
  eyebrow: 'Business intelligence',
  title: 'BI & data *intelligence*',
  body: 'Data is your most valuable asset, but only if you can understand it. We design interactive dashboards that centralize your KPIs, allowing you to make decisions based on real-time facts, not guesses.',
  tools: ['Power BI', 'Looker Studio', 'Tableau', 'Custom React Charts'],
  capabilities: ['Real-time reporting', 'Data visualization', 'Predictive analytics'],
};

export const TOOLBELT = {
  eyebrow: 'Toolbelt',
  title: 'The toolbelt behind *the work*',
  description: 'Frameworks, clouds, automation platforms and BI tools we use to design, build and connect your systems.',
};

export const CTA = {
  title: 'Need a *custom solution*?',
  description: 'Whether you need a custom dashboard, a complex automation, or a full software solution, we are here to help.',
};

/** The ALL_TECH entry for `name` (logo included), or a bare `{ name }` when it isn't listed. */
export const findTech = (name) => ALL_TECH.find((tech) => tech.name === name) ?? { name };
