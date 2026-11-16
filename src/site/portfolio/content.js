/** Copy and derived data for the Portfolio page. Products themselves live in PRODUCTS (lib/site.js). */
import { PRODUCTS } from '../lib/site';

export const PORTFOLIO_SEO = {
  title: 'Portfolio — Jornixs, APV ListingAI & APVNexus | APV Business Solutions',
  description:
    'Real platforms built by APV Business Solutions: Jornixs time-tracking and payroll SaaS, APV ListingAI for real estate listings, and APVNexus, an AI-powered CRM.',
  path: '/portfolio',
};

export const HERO_COPY = {
  eyebrow: 'Our portfolio',
  title: "Products we've *built & shipped*",
  description: 'A selection of real platforms in production — from payroll SaaS to AI content tools and operations hubs.',
};

export const SHOWCASE_COPY = {
  eyebrow: 'Case files',
  title: 'Three products, *up close*',
  description: 'What each platform does, who it is built for, what it runs on — and an illustrative look at each interface.',
};

export const STACK_COPY = {
  eyebrow: 'Under the hood',
  title: 'One stack, *three products*',
  description:
    'React on every interface, PostgreSQL under every product, Node.js or Python services behind them, and the OpenAI API wherever AI is part of the job.',
};

export const CTA_COPY = {
  eyebrow: 'Your idea next',
  title: 'Have a product *in mind*?',
  description: "We turn ideas into production-grade platforms. Let's talk about yours.",
};

export const LIVE_COUNT = PRODUCTS.filter((product) => product.status === 'live').length;
export const SOON_COUNT = PRODUCTS.length - LIVE_COUNT;

/** "https://www.jornixs.com/" → "jornixs.com"; undefined when there is no valid URL. */
export function hostnameOf(href) {
  if (!href) return undefined;
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return undefined;
  }
}

/** Stack names (as written in PRODUCTS) → BRAND_ICONS slugs. */
const STACK_LOGOS = {
  React: 'react',
  Tailwind: 'tailwindcss',
  'Node.js': 'nodedotjs',
  PostgreSQL: 'postgresql',
  Python: 'python',
  FastAPI: 'fastapi',
};

const productsUsing = (tech) => PRODUCTS.filter((product) => product.stack.includes(tech));

/** A stack name as a tech entry for TechChip / BrandIcon. */
export const stackTech = (name) => ({ name, logo: STACK_LOGOS[name] });

/** Every technology across the products, most shared first (ties keep first-seen order). */
export const STACK = Array.from(new Set(PRODUCTS.flatMap((product) => product.stack)))
  .map((name, order) => ({ name, order, count: productsUsing(name).length }))
  .sort((a, b) => b.count - a.count || a.order - b.order)
  .map(({ name }) => stackTech(name));

/** Technologies used by every product. */
export const SHARED_STACK = STACK.filter((tech) => productsUsing(tech.name).length === PRODUCTS.length);

/** id of a product's showcase <article>. */
export const panelId = (slug) => `${slug}-panel`;

/** Click handler for "#slug" links: moves focus to the product's panel (the scroll itself is the router's). */
export function focusPanelOnClick(slug) {
  return (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    document.getElementById(panelId(slug))?.focus({ preventScroll: true });
  };
}
