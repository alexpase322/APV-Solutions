/**
 * Legal page content. The documents themselves (wording, sections, dates) come from `src/lib/legal.js`,
 * the single source of truth; this file only adds the redesign's UI copy and turns each document into
 * renderable blocks (headings with ids, paragraphs, bullet lists, callouts and inline links).
 */
import { LABELS, LEGAL_DOCS } from '../../lib/legal';

export const DOC_KEYS = ['terms', 'privacy'];
export const LANGS = ['en', 'es'];

/** Anything that isn't "privacy" shows the Terms. */
export const normalizeDoc = (value) => (value?.trim().toLowerCase() === 'privacy' ? 'privacy' : 'terms');
/** "es", "es-CO"… show Spanish; anything else English. */
export const normalizeLang = (value) => (value?.trim().toLowerCase().startsWith('es') ? 'es' : 'en');

export const otherDoc = (doc) => (doc === 'terms' ? 'privacy' : 'terms');
export const otherLang = (lang) => (lang === 'en' ? 'es' : 'en');

/** "4" → "04"; "4.2" stays as is. */
export const padNum = (num) => (/^\d$/.test(num) ? `0${num}` : num);

/** Full document title ("Terms of Service", "Política de Privacidad"…). */
export const docTitle = (doc, lang) => LEGAL_DOCS[doc][lang].title;

/** Short titles for the document switch on phones. */
export const SHORT_TITLES = {
  terms: { en: 'Terms', es: 'Términos' },
  privacy: { en: 'Privacy', es: 'Privacidad' },
};

export const LANG_NAMES = { en: 'English', es: 'Español' };

/** Labels and values of the hero's meta grid (company, dates, contact). */
export function getDocMeta(doc, lang) {
  const { meta } = LEGAL_DOCS[doc][lang];
  const labels = LABELS[lang];
  return {
    companyLabel: labels.company,
    company: meta.company,
    effectiveLabel: labels.effectiveDate,
    effective: meta.effectiveDate,
    updatedLabel: labels.lastUpdated,
    updated: meta.lastUpdated,
    contactLabel: labels.contact,
    contact: meta.contact,
  };
}

export const UI = {
  en: {
    eyebrow: 'Legal',
    docGroup: 'Document',
    langGroup: 'Language',
    sections: (count) => `${count} sections`,
    readTime: (minutes) => `${minutes} min read`,
    inEffect: 'In effect',
    onThisPage: 'On this page',
    read: 'read',
    currentSection: 'Current section',
    copyLink: 'Copy link',
    copied: 'Link copied',
    copyFailed: 'Could not copy',
    alsoAvailable: 'Also available',
    continueReading: 'Continue reading',
    questions: 'Questions?',
    legalContact: 'Legal & privacy contact',
    emailUs: 'Email us',
  },
  es: {
    eyebrow: 'Legal',
    docGroup: 'Documento',
    langGroup: 'Idioma',
    sections: (count) => `${count} secciones`,
    readTime: (minutes) => `${minutes} min de lectura`,
    inEffect: 'Vigente',
    onThisPage: 'En esta página',
    read: 'leído',
    currentSection: 'Sección actual',
    copyLink: 'Copiar enlace',
    copied: 'Enlace copiado',
    copyFailed: 'No se pudo copiar',
    alsoAvailable: 'También disponible',
    continueReading: 'Seguir leyendo',
    questions: '¿Preguntas?',
    legalContact: 'Contacto legal y de privacidad',
    emailUs: 'Escríbanos',
  },
};

export const SEO = {
  terms: {
    en: {
      title: 'Terms of Service — APV Business Solutions',
      description:
        'Terms of Service for APV Business Solutions LLC (Tampa, Florida): the rules for using our websites, software, proprietary products and social media publishing integrations.',
    },
    es: {
      title: 'Términos de Servicio — APV Business Solutions',
      description:
        'Términos de Servicio de APV Business Solutions LLC (Tampa, Florida): las condiciones para usar nuestros sitios web, software, productos propios e integraciones de publicación en redes sociales.',
    },
  },
  privacy: {
    en: {
      title: 'Privacy Policy — APV Business Solutions',
      description:
        'Privacy Policy for APV Business Solutions LLC: what information we collect, how we use, share and protect it, how our TikTok, Instagram and Facebook integrations work, and your rights.',
    },
    es: {
      title: 'Política de Privacidad — APV Business Solutions',
      description:
        'Política de Privacidad de APV Business Solutions LLC: qué información recopilamos, cómo la usamos, compartimos y protegemos, cómo funcionan las integraciones con TikTok, Instagram y Facebook, y sus derechos.',
    },
  },
};

/* ------------------------------------------------------------------ */
/* Turning the structured documents into blocks                        */
/* ------------------------------------------------------------------ */

/** Paragraphs that start with one of these are shown as highlighted callouts. */
const CALLOUT_STARTS = [
  'Important — TikTok Integration:',
  'Importante — Integración con TikTok:',
  'TikTok Integration:',
  'Integración con TikTok:',
  'We do not sell your personal information',
  'No vendemos su información personal',
];

/** First line of the postal-style contact block that closes each document (its lines are joined with <br>). */
const ADDRESS_START = 'APV Business Solutions LLC';

/** The site's own domain is linked wherever a document mentions it. */
export const SITE_URL = 'https://apvsolutions.tech';

/** "Label: text" at the start of a bullet or callout; the label is set in bold. */
const LEAD_LABEL = /^([^:]{1,60}:)\s+([\s\S]*)$/;

/** Emails, URLs, the site's own domain and API scope names, in that order of precedence. */
const INLINE = /([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|(https?:\/\/\S*[^\s.,;:)])|(\bapvsolutions\.tech\b)|(\buser\.info\.basic\b)/g;

const HEADING_NUMBER = /^(\d+(?:\.\d+)*)\.?\s+(.+)$/;

/** Splits "Label: rest" into its bold label and the rest; `label` is null when there is none. */
export function splitLabel(text) {
  const match = text.match(LEAD_LABEL);
  return match ? { label: match[1], rest: match[2] } : { label: null, rest: text };
}

/**
 * Splits a line into text and link/code tokens:
 * `{ type: 'text' | 'email' | 'url' | 'site' | 'code', value }`.
 */
export function tokenize(text) {
  const tokens = [];
  let last = 0;
  for (const match of text.matchAll(INLINE)) {
    if (match.index > last) tokens.push({ type: 'text', value: text.slice(last, match.index) });
    const [value, email, url, site] = match;
    tokens.push({ type: email ? 'email' : url ? 'url' : site ? 'site' : 'code', value });
    last = match.index + value.length;
  }
  if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
  return tokens;
}

/**
 * Blocks: `{ type: 'h2' | 'h3', text }`, `{ type: 'p', text, callout }`, `{ type: 'ul', items: [text] }`
 * and `{ type: 'lines', lines: [text] }` (the closing contact block).
 */
function toBlocks(sections) {
  const blocks = [];
  sections.forEach((section, index) => {
    blocks.push({ type: section.level === 1 ? 'h2' : 'h3', text: section.title });
    const isLast = index === sections.length - 1;
    let list = null;
    let address = null;
    for (const raw of section.paragraphs) {
      const text = raw.trim();
      if (address) {
        address.lines.push(text);
        continue;
      }
      if (text.startsWith('•')) {
        if (!list) {
          list = { type: 'ul', items: [] };
          blocks.push(list);
        }
        list.items.push(text.replace(/^•\s*/, ''));
        continue;
      }
      list = null;
      if (isLast && text === ADDRESS_START) {
        address = { type: 'lines', lines: [text] };
        blocks.push(address);
        continue;
      }
      blocks.push({ type: 'p', text, callout: CALLOUT_STARTS.some((start) => text.startsWith(start)) });
    }
  });
  return blocks;
}

/** URL-safe slug without accents, capped at 72 characters. */
function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 72)
    .replace(/-+$/g, '');
}

/** The pieces of text of a block, split where the rendered markup puts a tag boundary. */
function textPieces(block) {
  const inline = (text, labelled) => {
    const { label, rest } = labelled ? splitLabel(text) : { label: null, rest: text };
    return [...(label ? [label] : []), ...tokenize(rest).map((token) => token.value)];
  };
  switch (block.type) {
    case 'ul':
      return block.items.flatMap((item) => inline(item, true));
    case 'lines':
      return block.lines.flatMap((line) => inline(line, false));
    case 'p':
      return inline(block.text, block.callout);
    default:
      return [block.text];
  }
}

function prepare(doc, lang) {
  const source = LEGAL_DOCS[doc][lang];
  const blocks = toBlocks(source.sections);
  const used = new Set();
  const headings = [];

  for (const block of blocks) {
    if (block.type !== 'h2' && block.type !== 'h3') continue;
    const text = block.text.replace(/\s+/g, ' ').trim();
    const base = `${doc}-${slugify(text) || `section-${headings.length + 1}`}`;
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    block.id = id;
    const match = text.match(HEADING_NUMBER);
    headings.push({ id, level: block.type === 'h2' ? 2 : 3, text, num: match ? match[1] : '', label: match ? match[2] : text });
  }

  const words = blocks.flatMap(textPieces).join(' ').split(/\s+/).filter(Boolean).length;
  return {
    doc,
    lang,
    title: source.title,
    subtitle: source.subtitle,
    blocks,
    headings,
    toc: headings.filter((heading) => heading.level === 2),
    words,
    minutes: Math.max(1, Math.round(words / 230)),
  };
}

const cache = new Map();

/** The document `doc` in `lang`, ready to render (memoised). */
export function getLegalDoc(doc, lang) {
  const key = `${doc}-${lang}`;
  let prepared = cache.get(key);
  if (!prepared) {
    prepared = prepare(doc, lang);
    cache.set(key, prepared);
  }
  return prepared;
}
