import { useEffect } from 'react';

const SITE_URL = 'https://apvsolutions.tech';
const DEFAULT_IMAGE = `${SITE_URL}/logo.svg`;

/**
 * Sets <title>, meta description, canonical, Open Graph and Twitter tags per route.
 * Lightweight alternative to react-helmet for a small SPA.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Page title (will be appended with brand if includeBrand=true)
 * @param {string} opts.description - Meta description (~155 chars max)
 * @param {string} [opts.path]      - Path of the current route, e.g. "/services"
 * @param {string} [opts.image]     - Absolute URL for OG/Twitter image
 * @param {boolean} [opts.includeBrand=true]
 */
export default function useSeo({ title, description, path = '', image = DEFAULT_IMAGE, includeBrand = true }) {
  useEffect(() => {
    const fullTitle = includeBrand ? `${title} | APV Business Solutions` : title;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;

    setMeta('name', 'description', description);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
    setMeta('name', 'twitter:url', url);

    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);

    setLink('canonical', url);
  }, [title, description, path, image, includeBrand]);
}

function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
