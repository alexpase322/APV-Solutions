import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, ExternalLink, ImageOff, Loader2, X } from 'lucide-react';

const EXTENSIONS = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg' };

/** "Pay with QR" + image/png → "pay-with-qr.png" */
const fileName = (title, type) => {
  const base = (title || '')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
  return `${base || 'image'}.${EXTENSIONS[type] || 'png'}`;
};

const downloadBlob = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Full-screen viewer for an image attached to a card button (e.g. the QR code of a payment app).
 * The image always sits on white so QR codes keep their quiet zone, whatever the card's theme.
 * "Save image" opens the phone's share sheet (save to photos / send to the payment app) or downloads it.
 *
 * @param {string} props.src      Image URL
 * @param {string} props.title    Button label, shown as the heading
 * @param {() => void} props.onClose
 */
const ImageLightbox = ({ src, title, onClose }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  // Fetched up front: the share sheet must open straight from the tap, with no await in between
  const [blob, setBlob] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch(src)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error('Image request failed'))))
      .then((data) => alive && setBlob(data))
      .catch(() => {
        /* cross-origin image without CORS: "Save image" falls back to opening it in a new tab */
      });
    return () => {
      alive = false;
    };
  }, [src]);

  // Modal behaviour: focus inside, Escape closes, page behind doesn't scroll, focus returns on close
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const items = [...dialogRef.current.querySelectorAll('button, a[href]')];
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [onClose]);

  const save = async () => {
    const name = fileName(title, blob.type);
    const file = new File([blob], name, { type: blob.type });
    const onPhone = window.matchMedia('(pointer: coarse)').matches;
    if (onPhone && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return; // the visitor closed the share sheet
      }
    }
    downloadBlob(blob, name);
  };

  const actionClass =
    'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-[#263646] shadow-lg transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black/85 px-4 py-16 backdrop-blur-sm transition-opacity duration-200 starting:opacity-0 [color-scheme:dark]"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X size={20} aria-hidden="true" />
      </button>

      <h2 className="max-w-md text-center text-lg font-semibold text-white">{title}</h2>

      <div className="max-w-full rounded-2xl bg-white p-3 shadow-2xl transition-transform duration-200 starting:scale-95">
        {status === 'loading' && (
          <div className="grid h-56 w-56 place-items-center" role="status" aria-label="Loading image">
            <Loader2 size={28} className="animate-spin text-gray-400" aria-hidden="true" />
          </div>
        )}
        {status === 'error' && (
          <div className="grid h-56 w-56 place-items-center px-4 text-center text-sm text-gray-600" role="alert">
            <span className="flex flex-col items-center gap-2">
              <ImageOff size={28} className="text-gray-400" aria-hidden="true" />
              This image couldn&apos;t be loaded.
            </span>
          </div>
        )}
        <img
          src={src}
          alt={title}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
          className={status === 'ready' ? 'block max-h-[62vh] max-w-full rounded-lg object-contain' : 'hidden'}
        />
      </div>

      {status === 'ready' &&
        (blob ? (
          <button type="button" onClick={save} className={actionClass}>
            <Download size={18} aria-hidden="true" />
            Save image
          </button>
        ) : (
          <a href={src} target="_blank" rel="noopener noreferrer" className={actionClass}>
            <ExternalLink size={18} aria-hidden="true" />
            Open image
          </a>
        ))}
    </div>,
    document.body,
  );
};

export default ImageLightbox;
