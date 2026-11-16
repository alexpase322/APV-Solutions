import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { SPRING_SNAPPY } from '../../lib/motion';
import { SITE } from '../../lib/site';

/** Clipboard API with a hidden-textarea fallback (older browsers, insecure contexts). */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    document.body.removeChild(textarea);
    return copied;
  }
}

/** "Copy" pill next to the email address; confirms for 2s and announces it to screen readers. */
export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = async () => {
    if (!(await copyToClipboard(SITE.email))) return;
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={cn(
          'relative inline-flex h-11 min-w-[92px] shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color] duration-300 active:scale-[0.97]',
          copied
            ? 'border-sage-300/40 bg-sage-300/15 text-sage-200'
            : 'border-white/10 bg-white/[0.04] text-ink-50 hover:border-white/20 hover:bg-white/[0.08]',
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={copied ? 'done' : 'copy'}
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={SPRING_SNAPPY}
            className="grid place-items-center"
            aria-hidden="true"
          >
            {copied ? <CheckIcon weight="bold" className="size-4" /> : <CopyIcon weight="regular" className="size-4" />}
          </motion.span>
        </AnimatePresence>
        <span>{copied ? 'Copied' : 'Copy'}</span>
        <span className="sr-only">{' email address'}</span>
      </button>
      <span aria-live="polite" role="status" className="sr-only">
        {copied ? 'Email address copied to the clipboard' : ''}
      </span>
    </>
  );
}
