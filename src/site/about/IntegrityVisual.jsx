import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { useActiveInView, useInterval } from '../lib/hooks';

const PHRASES = ['Transparent communication', 'No hidden fees', 'No tech jargon'];
const GLYPHS = '#%&*+<>/\\=?{}[]01';

/** Resolves `text` out of random glyphs, left to right, while `active`; returns `text` as-is otherwise. */
function useScramble(text, active) {
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!active) return undefined;
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame * 0.9);
      let next = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        next += i < revealed || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(next);
      if (revealed >= text.length) window.clearInterval(id);
    }, 42);
    return () => window.clearInterval(id);
  }, [text, active]);

  return active ? output : text;
}

/** Integrity: plain-language phrases "decoded" one after another in a terminal line. */
export function IntegrityVisual() {
  const { ref, inView, active } = useActiveInView();
  const [current, setCurrent] = useState(0);
  useInterval(() => setCurrent((n) => (n + 1) % PHRASES.length), 3000, active);
  const text = useScramble(PHRASES[current], active);

  return (
    <div ref={ref} aria-hidden="true" className={cn('glass @container w-full max-w-[360px] rounded-2xl p-4 sm:p-5', !inView && 'about-paused')}>
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300">
        <span>plain_language.txt</span>
        <span className="text-sage-300/80">decoded</span>
      </div>
      <div className="mt-4 flex h-7 items-center overflow-hidden whitespace-nowrap font-mono text-[12px] text-sage-100 @min-[14rem]:text-[13px] @min-[16rem]:text-[15px]">
        <span className="text-sage-300">{'> '}</span>
        <span>{text}</span>
        <span className="ml-0.5 inline-block h-4 w-[7px] bg-sage-300 animate-blink" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-1.5">
        {PHRASES.map((phrase, i) => (
          <span key={phrase} className="h-1 overflow-hidden rounded-full bg-white/[0.08]">
            <motion.span
              className="block h-full origin-left rounded-full bg-sage-300"
              initial={false}
              animate={{ scaleX: i <= current ? 1 : 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
