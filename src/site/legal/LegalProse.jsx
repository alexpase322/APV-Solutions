import { Fragment, memo } from 'react';
import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '../lib/motion';
import { SITE_URL, splitLabel, tokenize } from './legalDocs';

/** Typography for the document body (headings, lists, links, code and callouts). */
const PROSE =
  'max-w-[72ch] text-[17px] leading-[1.75] text-ink-100 [&_h2]:relative [&_h2]:mt-20 [&_h2]:border-t [&_h2]:border-white/[0.08] [&_h2]:pt-10 [&_h2]:scroll-mt-16 lg:[&_h2]:scroll-mt-6 [&_a]:scroll-mt-20 lg:[&_a]:scroll-mt-0 [&_h2]:text-[clamp(1.5rem,2.5vw,2rem)] [&_h2]:font-semibold [&_h2]:leading-[1.12] [&_h2]:tracking-[-0.035em] [&_h2]:text-ink-50 [&_h2]:before:absolute [&_h2]:before:-top-px [&_h2]:before:left-0 [&_h2]:before:h-px [&_h2]:before:w-28 [&_h2]:before:origin-left [&_h2]:before:scale-x-[0.35] [&_h2]:before:bg-sage-300 [&_h2]:before:transition-transform [&_h2]:before:duration-700 [&_h2]:before:ease-out-expo [&_h2[data-active]]:before:scale-x-100 [&>h2:first-child]:mt-0 [&_h3]:mt-12 [&_h2+h3]:mt-8 [&_h3]:flex [&_h3]:items-baseline [&_h3]:gap-3 [&_h3]:scroll-mt-16 lg:[&_h3]:scroll-mt-6 [&_h3]:text-[1.2rem] sm:[&_h3]:text-[1.3rem] [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:tracking-[-0.02em] [&_h3]:text-ink-50 [&_h3]:before:size-1.5 [&_h3]:before:shrink-0 [&_h3]:before:-translate-y-[0.2em] [&_h3]:before:rounded-[2px] [&_h3]:before:bg-sage-300 [&_p]:mt-5 [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:text-ink-100 [&_h2+p]:mt-6 [&_ul]:mt-5 [&_ul]:list-[square] [&_ul]:space-y-3 [&_ul]:pl-6 [&_li]:pl-1.5 [&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-ink-100 [&_li]:marker:text-sage-300/80 [&_strong]:font-semibold [&_strong]:text-ink-50 [&_a]:font-medium [&_a]:text-sage-300 [&_a]:underline [&_a]:decoration-sage-300/40 [&_a]:decoration-1 [&_a]:underline-offset-4 [&_a]:[overflow-wrap:anywhere] [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-sage-200 [&_a:hover]:decoration-sage-200 [&_code]:rounded-md [&_code]:border [&_code]:border-white/10 [&_code]:bg-white/[0.05] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.84em] [&_code]:text-sage-200 [&_.legal-callout]:mt-8 [&_.legal-callout]:rounded-2xl [&_.legal-callout]:border [&_.legal-callout]:border-sage-300/25 [&_.legal-callout]:bg-sage-300/[0.06] [&_.legal-callout]:px-5 [&_.legal-callout]:py-4 sm:[&_.legal-callout]:px-6 sm:[&_.legal-callout]:py-5 [&_.legal-callout]:text-ink-50 [&_.legal-callout]:shadow-[inset_3px_0_0_0_var(--color-sage-300)] [&_.legal-callout_strong]:text-sage-200 [&_.legal-callout+ul]:mt-5';

/** A line of text with its emails, URLs, the site's domain and scope names turned into links / code. */
function Inline({ text }) {
  return tokenize(text).map((token, i) => {
    switch (token.type) {
      case 'email':
        return (
          <a key={i} href={`mailto:${token.value}`}>
            {token.value}
          </a>
        );
      case 'url':
        return (
          <a key={i} href={token.value} target="_blank" rel="noopener noreferrer">
            {token.value}
          </a>
        );
      case 'site':
        return (
          <a key={i} href={SITE_URL}>
            {token.value}
          </a>
        );
      case 'code':
        return <code key={i}>{token.value}</code>;
      default:
        return <Fragment key={i}>{token.value}</Fragment>;
    }
  });
}

/** Inline text whose leading "Label:" is set in bold. */
function Labelled({ text }) {
  const { label, rest } = splitLabel(text);
  return (
    <>
      {label && (
        <>
          <strong>{label}</strong>{' '}
        </>
      )}
      <Inline text={rest} />
    </>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'h2':
      return <h2 id={block.id}>{block.text}</h2>;
    case 'h3':
      return <h3 id={block.id}>{block.text}</h3>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}>
              <Labelled text={item} />
            </li>
          ))}
        </ul>
      );
    case 'lines':
      return (
        <p>
          {block.lines.map((line, i) => (
            <Fragment key={i}>
              {i > 0 && <br />}
              <Inline text={line} />
            </Fragment>
          ))}
        </p>
      );
    default:
      return block.callout ? (
        <p className="legal-callout">
          <Labelled text={block.text} />
        </p>
      ) : (
        <p>
          <Inline text={block.text} />
        </p>
      );
  }
}

/**
 * The document body, fading in. Key it by document so it replays on a switch. Memoised so scroll-spy
 * updates don't re-render it (the spy marks the current `h2` with `data-active` directly).
 */
export const LegalProse = memo(function LegalProse({ blocks }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: EASE_OUT_EXPO }}
      className={PROSE}
    >
      {blocks.map((block, i) => (
        <Block key={block.id ?? i} block={block} />
      ))}
    </motion.div>
  );
});
