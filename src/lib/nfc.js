import {
  FaFacebookF,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaPinterestP,
  FaSnapchat,
  FaSpotify,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';

const INSTAGRAM_GRADIENT = 'linear-gradient(45deg, #F58529 0%, #DD2A7B 45%, #8134AF 75%, #515BD4 100%)';
const TIKTOK_GRADIENT = 'linear-gradient(90deg, #25F4EE 0%, #FE2C55 100%)';

/**
 * Social platforms with their official logo and brand colors.
 * - `background` / `color`: logo badge background and logo color.
 * - `border`: pill border (color or gradient); defaults to `background`. `borderDark` overrides it in dark mode
 *   (black brands would vanish on a dark card).
 * - `tint`: color used for the hover wash and glow.
 * - `domains`: lets custom links pick up the right logo automatically.
 */
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: FaInstagram, background: INSTAGRAM_GRADIENT, tint: '#DD2A7B', domains: ['instagram.com', 'instagr.am'], placeholder: 'instagram.com/your.user' },
  { id: 'facebook', label: 'Facebook', icon: FaFacebookF, background: '#1877F2', domains: ['facebook.com', 'fb.com', 'fb.me'], placeholder: 'facebook.com/your.page' },
  { id: 'tiktok', label: 'TikTok', icon: FaTiktok, background: '#000000', border: TIKTOK_GRADIENT, tint: '#FE2C55', domains: ['tiktok.com'], placeholder: 'tiktok.com/@your.user' },
  { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedinIn, background: '#0A66C2', domains: ['linkedin.com', 'lnkd.in'], placeholder: 'linkedin.com/in/your-name' },
  { id: 'youtube', label: 'YouTube', icon: FaYoutube, background: '#FF0000', domains: ['youtube.com', 'youtu.be'], placeholder: 'youtube.com/@your-channel' },
  { id: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, background: '#25D366', domains: ['wa.me', 'whatsapp.com'], placeholder: 'wa.me/18635550100 or a group/catalog link' },
  { id: 'x', label: 'X (Twitter)', icon: FaXTwitter, background: '#000000', borderDark: '#E5E7EB', tintDark: '#FFFFFF', domains: ['x.com', 'twitter.com'], placeholder: 'x.com/your_user' },
  { id: 'threads', label: 'Threads', icon: FaThreads, background: '#000000', borderDark: '#E5E7EB', tintDark: '#FFFFFF', domains: ['threads.net', 'threads.com'], placeholder: 'threads.net/@your.user' },
  { id: 'telegram', label: 'Telegram', icon: FaTelegram, background: '#26A5E4', domains: ['t.me', 'telegram.me', 'telegram.org'], placeholder: 't.me/your_user' },
  { id: 'spotify', label: 'Spotify', icon: FaSpotify, background: '#1DB954', domains: ['spotify.com'], placeholder: 'open.spotify.com/…' },
  { id: 'pinterest', label: 'Pinterest', icon: FaPinterestP, background: '#E60023', domains: ['pinterest.com', 'pin.it'], placeholder: 'pinterest.com/your.user' },
  { id: 'snapchat', label: 'Snapchat', icon: FaSnapchat, background: '#FFFC00', color: '#111111', border: '#F2D600', tint: '#F2D600', domains: ['snapchat.com'], placeholder: 'snapchat.com/add/your.user' },
  { id: 'github', label: 'GitHub', icon: FaGithub, background: '#181717', borderDark: '#E5E7EB', tintDark: '#FFFFFF', domains: ['github.com'], placeholder: 'github.com/your-user' },
  { id: 'other', label: 'Website / other', icon: FaGlobe, background: null, domains: [], placeholder: 'https://…' },
];

const asImage = (c) => (c.includes('gradient(') ? c : `linear-gradient(${c}, ${c})`);

/** Card surface colors used by the pills (kept in sync with CardProfile's light/dark surfaces). */
export const CARD_SURFACE = { light: '#ffffff', dark: '#1a2331' };

/**
 * CSS variables for a `.link-pill` (border, hover wash, glow).
 * - linkStyle 'accent' (default): everything follows the card color chosen in the panel.
 * - linkStyle 'brand': each network's own colors (Instagram gradient, TikTok cyan→pink…).
 * The accent is lightened in dark mode so dark colors stay visible on the night background.
 */
export const pillStyle = (platform, { accent, dark, linkStyle = 'accent' }) => {
  const surface = dark ? CARD_SURFACE.dark : CARD_SURFACE.light;
  const accentOnSurface = dark ? `color-mix(in srgb, ${accent} 55%, #ffffff)` : accent;
  const solidBg = platform.background && !platform.background.includes('gradient(') ? platform.background : null;

  const brand = linkStyle === 'brand';
  const border = brand ? (dark && platform.borderDark) || platform.border || platform.background || accentOnSurface : accentOnSurface;
  const tint = brand ? (dark && platform.tintDark) || platform.tint || solidBg || accentOnSurface : accentOnSurface;

  return {
    '--pill-base': surface,
    '--pill-hover': `color-mix(in srgb, ${tint} ${dark ? 16 : 9}%, ${surface})`,
    '--pill-border': asImage(border),
    '--pill-glow': `color-mix(in srgb, ${tint} ${dark ? 40 : 55}%, transparent)`,
  };
};

export const platformById = (id) => SOCIAL_PLATFORMS.find((p) => p.id === id) || SOCIAL_PLATFORMS.at(-1);

/** Generic "link" platform used for custom links whose domain isn't a known network. */
export const GENERIC_LINK = { id: 'link', label: 'Link', icon: FaLink, background: null, domains: [] };

/** Detects the platform from a URL (e.g. a YouTube video in "custom links" gets the YouTube logo). */
export const platformFromUrl = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, '');
    return (
      SOCIAL_PLATFORMS.find((p) => p.domains.some((d) => host === d || host.endsWith(`.${d}`))) || GENERIC_LINK
    );
  } catch {
    return GENERIC_LINK;
  }
};

export const ACCENT_PRESETS = ['#263646', '#94A378', '#E4B34C', '#1F4E79', '#7A2E3A', '#2F6B5E', '#5B3F8C', '#111827'];

export const EMPTY_PROFILE = {
  fullName: '',
  jobTitle: '',
  company: '',
  bio: '',
  avatarUrl: '',
  coverUrl: '',
  accentColor: '#263646',
  theme: 'auto',
  linkStyle: 'accent',
  tags: [],
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  address: '',
  socials: [],
  links: [],
};

/** Only http(s) links are rendered as hrefs — defense in depth on top of server validation. */
export const safeHref = (url) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
};

export const digitsOnly = (v = '') => v.replace(/[^\d+]/g, '');
export const whatsappHref = (v) => {
  const d = v.replace(/\D/g, '');
  return d ? `https://wa.me/${d}` : null;
};

/** Picks white or near-black text for readable contrast on the given background color. */
/** WCAG relative luminance (0 = black, 1 = white) of a #rrggbb color. */
export const luminance = (hex = '#263646') => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!m) return 0;
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const readableOn = (hex = '#263646') => (luminance(hex) > 0.45 ? '#111827' : '#ffffff');

export const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || 'APV';

/**
 * Public card URL — the one programmed into the NFC chip.
 * Uses the canonical URL computed by the API (PUBLIC_APP_URL), so every seller programs the same
 * link no matter which domain (www / non-www / preview) they opened the panel from.
 */
export const cardPublicUrl = (card) => card?.url || `${window.location.origin}/c/${card?.code}`;

/** Combined card state shown in the admin panel. */
export const cardStatus = (card) => {
  if (card.owner?.status === 'disabled') return 'disabled';
  if (!card.active) return 'inactive';
  return card.owner?.status || 'inactive';
};

export const inviteWhatsappHref = (name, inviteUrl) =>
  `https://wa.me/?text=${encodeURIComponent(
    `Hola ${name?.split(' ')[0] || ''} 👋 Tu tarjeta digital APV está lista. Activa tu cuenta y completa tu perfil aquí: ${inviteUrl}`
  )}`;

export const passwordError = (password, confirm) => {
  if (password.length < 8) return 'Password must be at least 8 characters.';
  if (password !== confirm) return 'Passwords do not match.';
  return '';
};
