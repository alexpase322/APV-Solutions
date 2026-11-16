/** Approved copy for the About page. Words wrapped in *asterisks* are tinted sage by SplitText. */

export const ABOUT_SEO = {
  title: 'About Us — Strategic Technology Partners | APV Business Solutions',
  description:
    'We started APV Business Solutions with a simple mission: to make enterprise-level digital transformation accessible, understandable, and profitable for businesses of all sizes.',
  path: '/about',
};

export const HERO = {
  eyebrow: 'Our story',
  title: 'Bridging the gap between *business & technology*',
  description:
    'We started APV Business Solutions with a simple mission: to make enterprise-level digital transformation accessible, understandable, and profitable for businesses of all sizes.',
  footnote: 'Remote / Global services · US & LATAM',
};

export const MISSION = {
  label: 'Our mission',
  statement: 'To empower organizations by automating the mundane, visualizing the complex, and building the future.',
  belief: "We believe that software shouldn't just exist; it should solve problems and drive tangible growth.",
  accentWords: ['automating', 'visualizing', 'building'],
  pillars: [
    { key: 'automate', verb: 'Automate', phrase: 'Automate the mundane' },
    { key: 'visualize', verb: 'Visualize', phrase: 'Visualize the complex' },
    { key: 'build', verb: 'Build', phrase: 'Build the future' },
  ],
};

export const VISION = {
  label: 'Our vision',
  lead: 'To be the leading strategic partner for businesses in LATAM and the US looking to modernize their operations without losing their human touch.',
  close: 'We envision a world where technology works for people, not the other way around.',
};

export const VALUES_HEADING = {
  eyebrow: 'Core values',
  title: 'The principles that guide *every line of code* we write.',
};

export const VALUES = [
  {
    key: 'integrity',
    index: '01',
    title: 'Integrity',
    text: 'Transparent communication. No hidden fees, no tech jargon designed to confuse.',
  },
  {
    key: 'innovation',
    index: '02',
    title: 'Innovation',
    text: "We don't just follow trends; we find the best tools (AI, No-Code) to solve your specific needs.",
  },
  {
    key: 'empathy',
    index: '03',
    title: 'Empathy',
    text: 'We build for humans. User experience (UX) is at the heart of our development process.',
  },
  {
    key: 'collaboration',
    index: '04',
    title: 'Collaboration',
    text: 'We are not just vendors; we are an extension of your team.',
  },
];

export const PRODUCTS_HEADING = {
  eyebrow: 'Ecosystem',
  title: 'Proprietary *products*',
  description:
    'Platforms we design and build ourselves — from payroll SaaS and an AI-powered CRM to AI listing tools and smart NFC cards.',
};

/**
 * Product cards. `link.href` opens an external site in a new tab, `link.to` is an internal route;
 * `status.tone` is 'live' (pulsing dot), 'soon' (gold tag) or 'neutral'.
 */
export const ABOUT_PRODUCTS = [
  {
    key: 'jornixs',
    name: 'Jornixs',
    category: 'SaaS · Workforce management',
    line: 'Always on time. Always in control.',
    status: { label: 'Live', tone: 'live' },
    link: { href: 'https://jornixs.com/', label: 'jornixs.com' },
  },
  {
    key: 'nexus-crm',
    name: 'APV Nexus CRM',
    category: 'CRM · AI-powered',
    line: 'A smarter CRM, powered by AI.',
    status: { label: 'Live', tone: 'live' },
    link: { href: 'https://apvnexus.com/', label: 'apvnexus.com' },
  },
  {
    key: 'nexus-inmigracion',
    name: 'APV Nexus Inmigración',
    category: 'APV Nexus family',
    line: 'A proprietary platform from the APV Nexus product family.',
    status: { label: 'Proprietary', tone: 'neutral' },
  },
  {
    key: 'listingai',
    name: 'APV ListingAI',
    aka: 'Also branded APV Realtor Tampa',
    category: 'AI · Real estate',
    line: 'Publish stunning property listings in minutes, not hours.',
    status: { label: 'Coming soon', tone: 'soon' },
    link: { to: '/portfolio', label: 'See it in our portfolio' },
  },
  {
    key: 'nfc',
    name: 'APV NFC Cards',
    category: 'Digital business cards',
    line: 'One tap. Your whole professional profile.',
    status: { label: 'Available', tone: 'live' },
    link: { to: '/nfc', label: 'Explore NFC cards' },
  },
];

/** Names in the big outlined ribbon under the product cards. */
export const PRODUCT_RIBBON = ['Jornixs', 'APV Nexus CRM', 'APV Nexus Inmigración', 'APV ListingAI', 'APV Realtor Tampa', 'APV NFC Cards'];

export const TEAM_HEADING = {
  eyebrow: 'The minds behind APV',
  title: 'Meet the *team*',
  description: 'A founder-led team pairing hands-on engineering with financial, administrative and Power BI expertise.',
};

export const CTA = {
  eyebrow: 'Now booking',
  title: 'Ready to *work with us*?',
  description: 'We are currently accepting new projects for the upcoming quarter.',
};
