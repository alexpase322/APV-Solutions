import { useEffect } from 'react';

/**
 * Marks the current page as noindex (private areas and personal cards shouldn't show up in
 * search results). Restores the previous robots value when the page unmounts.
 */
export default function useNoIndex(title) {
  useEffect(() => {
    let el = document.querySelector('meta[name="robots"]');
    const created = !el;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      document.head.appendChild(el);
    }
    const previous = el.getAttribute('content');
    el.setAttribute('content', 'noindex, nofollow');
    return () => {
      if (created) el.remove();
      else if (previous) el.setAttribute('content', previous);
    };
  }, []);

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);
}
