/** Copy and sample data for the NFC cards landing page (/nfc). */

export const NFC_SEO = {
  title: 'NFC Digital Business Cards | APV Business Solutions',
  description:
    'APV digital business cards: a smart NFC card that shares your contact info, social media and links with one tap. No app needed, QR code backup included, and a profile you can update anytime.',
  path: '/nfc',
};

export const NFC_HERO = {
  eyebrow: 'APV Digital Business Cards',
  title: 'One tap. *Your whole professional profile.*',
  description:
    'A smart NFC card that shares your contact info, social media and links the moment someone taps it with their phone. No app, no paper, always up to date.',
  proof: ['No app', 'No paper', 'Always up to date'],
};

/** Fictional person shown in every mockup (always labelled as sample / demo data). */
export const DEMO_PROFILE = {
  name: 'Alex Rivera',
  initials: 'AR',
  role: 'Realtor · Tampa Bay Homes',
  bio: 'Helping families buy and sell homes across Tampa Bay. Bilingual English / Español.',
  tags: ['Bilingual', 'First-time buyers', 'Tampa Bay'],
  links: [
    { label: 'See my latest homes on Instagram', kind: 'instagram' },
    { label: 'Home tours on TikTok', kind: 'tiktok' },
    { label: 'Connect on LinkedIn', kind: 'linkedin' },
    { label: 'Book a showing', kind: 'booking' },
  ],
};

export const NFC_STEPS = [
  {
    index: '01',
    title: 'Get your card',
    description: 'Order your NFC card with APV. We create your account and program the card for you on the spot.',
    tag: 'Programmed by APV',
  },
  {
    index: '02',
    title: 'Build your profile',
    description: 'You receive an email to activate your account. Add your photo, contact info, social media and links.',
    tag: 'Activation email',
  },
  {
    index: '03',
    title: 'Tap & share',
    description: 'Hold your card near any phone. Your profile opens instantly and they can save your contact in one tap.',
    tag: 'Opens instantly',
  },
];

/** Feature bento copy, keyed like the tiles in Features.jsx. */
export const NFC_FEATURES = {
  noApp: { title: 'No app needed', description: 'Works with the built-in NFC reader of modern iPhone and Android phones.' },
  saveContact: {
    title: 'Save contact in one tap',
    description: 'Visitors download your contact card with photo, phone, email and company.',
  },
  update: {
    title: 'Update anytime',
    description: 'Changed jobs or phone number? Edit your profile — the card never needs reprogramming.',
  },
  qr: { title: 'QR code backup', description: 'Every card comes with a QR code for phones without NFC or for your email signature.' },
  analytics: { title: 'View analytics', description: 'See how many times your profile has been opened from your dashboard.' },
  forever: { title: 'One card, forever', description: 'Stop reprinting paper cards. One smart card replaces hundreds of paper ones.' },
};

export const NFC_FAQ = [
  {
    question: 'Does the other person need to install an app?',
    answer:
      'No. iPhone (XS and newer) and most Android phones read NFC natively — they just hold the phone near your card. For older phones, they can scan the QR code.',
  },
  {
    question: 'What if my information changes?',
    answer: 'Log in to your dashboard and update your profile. Changes are live instantly. The card itself keeps working with the same link forever.',
  },
  {
    question: 'What can I show on my profile?',
    answer:
      'Your photo, cover image, name, title, company, bio, phone, WhatsApp, email, website, address, social media and up to 10 custom links (booking page, listings, menu, reviews…).',
  },
  {
    question: 'Can I order cards for my whole team?',
    answer: 'Yes. Each team member gets their own card and profile. Contact us for team orders.',
  },
];

export const NFC_CTA = {
  eyebrow: 'Order today',
  title: 'Make every *introduction count*',
  description: 'Order your APV NFC card today and start sharing your profile with a single tap.',
};
