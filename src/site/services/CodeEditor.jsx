import { memo, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { CaretRightIcon, CheckCircleIcon, GitBranchIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO } from '../lib/motion';
import { WindowFrame } from '../ui/primitives';
import { createSequence } from './hooks';

/** The snippet, as lines of `{ t: text, k: token kind }`. */
const CODE = [
  [{ t: '// scalable · secure · performant', k: 'com' }],
  [
    { t: 'const', k: 'kw' },
    { t: ' ', k: 'sp' },
    { t: 'APV_Solution', k: 'fn' },
    { t: ' = ', k: 'pun' },
    { t: 'async', k: 'kw' },
    { t: ' () ', k: 'pun' },
    { t: '=>', k: 'kw' },
    { t: ' {', k: 'pun' },
  ],
  [
    { t: '  ', k: 'sp' },
    { t: 'await', k: 'kw' },
    { t: ' ', k: 'sp' },
    { t: 'analyzeRequirements', k: 'fn' },
    { t: '();', k: 'pun' },
  ],
  [
    { t: '  ', k: 'sp' },
    { t: 'return', k: 'kw' },
    { t: ' ', k: 'sp' },
    { t: '"Success"', k: 'str' },
    { t: ';', k: 'pun' },
  ],
  [{ t: '};', k: 'pun' }],
  [],
  [
    { t: 'export default', k: 'kw' },
    { t: ' ', k: 'sp' },
    { t: 'APV_Solution', k: 'id' },
    { t: ';', k: 'pun' },
  ],
];

const TOKEN_CLASS = {
  kw: 'text-sage-300',
  fn: 'text-ink-50',
  str: 'text-gold-300',
  pun: 'text-ink-200',
  com: 'text-ink-300 italic',
  id: 'text-ink-100',
  sp: '',
};

/** CODE with each token's offset inside its line. */
const TOKENS = CODE.map((tokens) => {
  let start = 0;
  return tokens.map((token) => {
    const entry = { ...token, start };
    start += token.t.length;
    return entry;
  });
});
const LINES = CODE.map((tokens) => tokens.map((token) => token.t).join(''));
const SOURCE = LINES.join('\n');
const TOTAL = SOURCE.length;
/** Offset of each line's first character in SOURCE. */
const LINE_START = LINES.reduce((starts, _line, i) => {
  starts.push(i === 0 ? 0 : starts[i - 1] + LINES[i - 1].length + 1);
  return starts;
}, []);
/** Row height in px (Tailwind h-7), for the current-line highlight. */
const LINE_HEIGHT = 28;

/** Characters of line `i` that are visible once `typed` characters of SOURCE have been typed. */
const visibleOnLine = (typed, i) => Math.max(0, Math.min(typed - LINE_START[i], LINES[i].length));

/**
 * Editor mockup that types out the snippet, "runs" it in a terminal and fades out to loop.
 * Runs while in view; with reduced motion it shows the finished state.
 */
export function CodeEditor() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotion();
  const [typed, setTyped] = useState(() => (reduce ? TOTAL : 0));
  const [stage, setStage] = useState(() => (reduce ? 3 : 0));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (reduce) {
      setTyped(TOTAL);
      setStage(3);
      setFading(false);
      return undefined;
    }
    if (!inView) return undefined;
    const sequence = createSequence();
    (async () => {
      for (;;) {
        setFading(false);
        setStage(0);
        setTyped(0);
        await sequence.wait(550);
        for (let i = 1; i <= TOTAL; i++) {
          setTyped(i);
          const char = SOURCE[i - 1];
          // newlines pause, spaces are quick, other keys get an uneven human rhythm
          await sequence.wait(char === '\n' ? 170 : char === ' ' ? 22 : 26 + ((i * 37) % 5) * 9);
        }
        await sequence.wait(420);
        setStage(1);
        await sequence.wait(1150);
        setStage(2);
        await sequence.wait(650);
        setStage(3);
        await sequence.wait(3400);
        setFading(true);
        await sequence.wait(480);
      }
    })();
    return () => sequence.cancel();
  }, [inView, reduce]);

  const found = LINES.findIndex((text, i) => typed <= LINE_START[i] + text.length);
  const line = found === -1 ? CODE.length - 1 : found;
  const column = visibleOnLine(typed, line);

  return (
    <div ref={ref} aria-hidden="true">
      <WindowFrame
        title="apv-solution.ts"
        right={
          <span className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">
            TypeScript
          </span>
        }
        bodyClassName="p-0"
        className="shadow-[0_50px_100px_-40px_rgba(2,6,10,0.95)]"
      >
        <motion.div
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
          className="relative grid grid-cols-[auto_minmax(0,1fr)] py-5 font-mono text-[12px] leading-7 sm:text-[13.5px]"
        >
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-5 h-7 border-y border-white/[0.03] bg-white/[0.025]"
            animate={{ y: line * LINE_HEIGHT }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          />
          <div className="relative select-none pl-4 pr-4 text-right text-ink-400 sm:pl-5">
            {CODE.map((_tokens, i) => (
              <div key={i} className={cn('h-7 nums', i === line && 'text-ink-200')}>
                {i + 1}
              </div>
            ))}
          </div>
          <div className="relative min-w-0 overflow-hidden whitespace-pre pr-4">
            {TOKENS.map((tokens, i) => (
              <CodeLine key={i} tokens={tokens} visible={visibleOnLine(typed, i)} caret={i === line ? column : null} />
            ))}
          </div>
        </motion.div>
        <Terminal stage={stage} />
        <div className="flex h-8 items-center justify-between border-t border-white/[0.06] px-4 font-mono text-[10px] tracking-wide text-ink-300 sm:px-5">
          <span className="flex items-center gap-1.5">
            <GitBranchIcon weight="bold" className="size-3" />
            main
          </span>
          <span className="nums">
            Ln {line + 1}, Col {column + 1} · UTF-8
          </span>
        </div>
      </WindowFrame>
    </div>
  );
}

/** One code line showing its first `visible` characters, with the caret when it is the current line. */
function CodeLine({ tokens, visible, caret }) {
  return (
    <div className="flex h-7 items-center">
      <span>
        {tokens.map((token, i) => {
          const shown = visible - token.start;
          if (shown <= 0) return null;
          return (
            <span key={i} className={TOKEN_CLASS[token.k]}>
              {token.t.slice(0, shown)}
            </span>
          );
        })}
      </span>
      {caret !== null && <span className="ml-px inline-block h-[1.15em] w-[2px] rounded-full bg-sage-300 animate-blink" />}
    </div>
  );
}

/** Terminal pane. `stage`: 0 idle, 1 command started, 2 requirements analysed, 3 returned. */
const Terminal = memo(function Terminal({ stage }) {
  return (
    <div className="border-t border-white/[0.06] bg-ink-950/50 px-4 py-3.5 font-mono text-[11.5px] leading-6 sm:px-5 sm:text-[12.5px]">
      <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-ink-300">
        <span>Terminal</span>
        <span className="flex items-center gap-1.5">
          <span
            className={cn(
              'size-1.5 rounded-full transition-colors duration-300',
              stage === 3 ? 'bg-sage-300' : stage > 0 ? 'bg-gold-400' : 'bg-ink-400',
            )}
          />
          {stage === 3 ? 'Exit 0' : stage > 0 ? 'Running' : 'Idle'}
        </span>
      </div>
      <TerminalLine show={stage >= 1}>
        <span className="text-ink-300">$</span>
        <span className="text-ink-100">node apv-solution.ts</span>
      </TerminalLine>
      <TerminalLine show={stage >= 1}>
        <CaretRightIcon weight="bold" className="size-3 text-ink-300" />
        <span className="text-ink-100">analyzeRequirements</span>
        <span className="text-ink-300">...</span>
        {stage >= 2 ? (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="text-sage-300"
          >
            done
          </motion.span>
        ) : (
          <span className="h-2 w-14 rounded-full shimmer" />
        )}
      </TerminalLine>
      <TerminalLine show={stage >= 3}>
        <CheckCircleIcon weight="fill" className="size-3.5 text-sage-300" />
        <span className="text-sage-300">return</span>
        <span className="text-gold-300">&quot;Success&quot;</span>
      </TerminalLine>
    </div>
  );
});

function TerminalLine({ show, children }) {
  return (
    <div className="h-6">
      <AnimatePresence initial={false}>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className="flex h-6 items-center gap-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
