import { memo } from 'react';
import { motion } from 'motion/react';
import { GitBranchIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { useActiveInView, useTypewriter } from '../../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../../lib/motion';
import { PulseDot } from '../../ui/primitives';
import { CODE_FILES, FILE_LENGTHS, TOKEN_CLASSES, caretAt, visibleRows } from './codeSamples';

const TYPING = { type: 34, erase: false, hold: 2600, pause: 420 };

/** The first `take` characters of a line, keeping each token's colour. */
function renderTokens(tokens, take) {
  let left = take;
  return tokens.map(([kind, text], i) => {
    if (left <= 0) return null;
    const visible = text.slice(0, left);
    left -= text.length;
    return (
      <span key={i} className={TOKEN_CLASSES[kind]}>
        {visible}
      </span>
    );
  });
}

/** Code editor that types out each sample file, then switches tabs. Runs only while on screen. */
export const CodeEditorMock = memo(function CodeEditorMock() {
  const { ref, active } = useActiveInView();
  const { index, count, phase, done } = useTypewriter(FILE_LENGTHS, active, TYPING);
  const file = CODE_FILES[index];
  const caret = caretAt(file.lines, count);
  const rows = visibleRows(file.lines, count);

  return (
    <div
      ref={ref}
      className="flex min-h-[300px] flex-1 flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-ink-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:min-h-[340px]"
    >
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-white/[0.06] px-2.5">
        {CODE_FILES.map((tab, i) => (
          <span
            key={tab.file}
            className={cn(
              'relative rounded-md px-2.5 py-1.5 font-mono text-[11px] transition-colors duration-300',
              i === index ? 'text-ink-50' : 'text-ink-300',
            )}
          >
            {i === index && (
              <motion.span
                layoutId="home-editor-tab"
                transition={SPRING_SNAPPY}
                className="absolute inset-0 rounded-md border border-white/[0.06] bg-white/[0.06]"
              />
            )}
            <span className="relative">{tab.file}</span>
          </span>
        ))}
        <span className="ml-auto hidden items-center gap-1.5 pr-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200 sm:inline-flex">
          <PulseDot tone="sage" size="sm" />
          {done ? 'Saved' : 'Editing'}
        </span>
      </div>

      <motion.div
        animate={{ opacity: phase === 'next' ? 0 : 1, y: phase === 'next' ? -6 : 0 }}
        transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
        className="flex-1 overflow-hidden py-4 font-mono text-[11px] leading-[1.95] sm:text-[13px]"
      >
        {rows.map((row, i) => {
          const current = !!row.line && i === caret.line;
          return (
            <div key={i} className={cn('flex whitespace-pre pr-4', current && 'bg-white/[0.035]')}>
              <span className={cn('w-10 shrink-0 select-none pr-4 text-right tabular-nums', current ? 'text-ink-200' : 'text-ink-400')}>
                {i + 1}
              </span>
              <span className="min-w-0 overflow-hidden">
                {row.line && renderTokens(row.line, row.take)}
                {current && <span className="ml-px inline-block h-[1.15em] w-[2px] translate-y-[0.2em] bg-sage-300 animate-blink" />}
              </span>
            </div>
          );
        })}
      </motion.div>

      <div className="flex h-9 shrink-0 items-center justify-between gap-3 border-t border-white/[0.06] px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-200">
        <span className="flex items-center gap-1.5">
          <GitBranchIcon weight="bold" className="size-3.5 text-sage-300" />
          main
        </span>
        <span className="nums truncate">
          {file.lang} · Ln {caret.line + 1}, Col {caret.col + 1}
        </span>
      </div>
    </div>
  );
});
