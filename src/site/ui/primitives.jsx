import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, VIEWPORT, fadeUp, stagger } from '../lib/motion';
import useSeo from '../../hooks/useSeo';

/** Page-width wrapper with the site's side gutters. */
export function Container({ className, children, as: Tag = 'div' }) {
  return <Tag className={cn('mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-10', className)}>{children}</Tag>;
}

/** Vertical rhythm for a page section. */
export function Section({ id, className, children, as: Tag = 'section', ref, ...aria }) {
  return (
    <Tag ref={ref} id={id} className={cn('relative py-24 sm:py-28 lg:pt-32 lg:pb-36', className)} {...aria}>
      {children}
    </Tag>
  );
}

/** Small pulsing status dot. */
export function PulseDot({ tone = 'gold', size = 'md', className }) {
  const bg = tone === 'gold' ? 'bg-gold-400' : 'bg-sage-300';
  const dim = size === 'sm' ? 'size-1.5' : 'size-2';
  return (
    <span aria-hidden="true" className={cn('relative inline-flex shrink-0', dim, className)}>
      <span className={cn('absolute inset-0 rounded-full animate-pulse-ring', bg)} />
      <span className={cn('relative rounded-full', dim, bg)} />
    </span>
  );
}

/** Mono, uppercase section label with a pulsing dot and optional index ("01 /"). */
export function Eyebrow({ children, index, className, dot = true, id }) {
  return (
    <span
      id={id}
      className={cn('inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-sage-300', className)}
    >
      {dot && <PulseDot tone="sage" size="sm" />}
      {index && <span className="text-ink-200">{index} /</span>}
      <span>{children}</span>
    </span>
  );
}

const TAG_TONES = {
  neutral: 'border-white/10 bg-white/[0.03] text-ink-100',
  sage: 'border-sage-300/25 bg-sage-300/[0.08] text-sage-200',
  gold: 'border-gold-400/30 bg-gold-400/[0.08] text-gold-300',
};

/** Mono chip for stacks, statuses and labels. */
export function Tag({ children, className, tone = 'neutral' }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] tracking-wide', TAG_TONES[tone], className)}
    >
      {children}
    </span>
  );
}

const TILE_SIZES = { sm: 'size-10 rounded-xl', md: 'size-12 rounded-2xl', lg: 'size-14 rounded-2xl' };

/** Tinted square that frames an icon. */
export function IconTile({ children, className, size = 'md' }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative grid shrink-0 place-items-center border border-sage-300/20 bg-sage-300/[0.08] text-sage-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        TILE_SIZES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** App-window chrome (traffic lights + title bar) around a mockup. */
export function WindowFrame({ title, children, className, bodyClassName, right, style }) {
  return (
    <div style={style} className={cn('surface relative overflow-hidden rounded-3xl', className)}>
      <div className="flex h-11 items-center gap-3 border-b border-white/[0.06] px-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-ink-500" />
          <span className="size-2.5 rounded-full bg-ink-500" />
          <span className="size-2.5 rounded-full bg-sage-500/70" />
        </div>
        {title && <span className="truncate font-mono text-[11px] tracking-wide text-ink-200">{title}</span>}
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </div>
      <div className={cn('relative p-5 sm:p-6', bodyClassName)}>{children}</div>
    </div>
  );
}

/** Canvas of softly waving dots that bulge away from the cursor. Pauses off-screen and with reduced motion. */
export function DotField({ className, spacing = 26, interactive = true, intensity = 1 }) {
  const canvasRef = useRef(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let visible = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const start = performance.now();

    const gap = () => (width < 640 ? spacing * 1.25 : spacing);

    const draw = (now) => {
      const t = reduce ? 0 : now - start;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      const step = gap();
      const cols = Math.ceil(width / step) + 1;
      const rows = Math.ceil(height / step) + 1;
      const offX = (width - (cols - 1) * step) / 2;
      const offY = (height - (rows - 1) * step) / 2;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = offX + col * step;
          const y = offY + row * step;
          const wave = Math.sin(x * 0.0075 + t * 0.00055) * Math.cos(y * 0.0105 + t * 0.00042);
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = dist < 190 ? 1 - dist / 190 : 0;
          const lift = wave * 4 + near * 6;
          const px = x + (dist > 0 ? (dx / dist) * near * 10 : 0);
          const py = y - lift + (dist > 0 ? (dy / dist) * near * 10 : 0);
          const alpha = Math.min(1, (0.1 + (wave + 1) * 0.085 + near * 0.75) * intensity);
          const radius = 0.9 + (wave + 1) * 0.25 + near * 1.6;
          const tint = Math.min(1, near * 1.4 + Math.max(0, wave - 0.55) * 0.9);
          const r = 93 + 87 * tint;
          const g = 113 + 85 * tint;
          const b = 134 + 9 * tint;
          ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    };
    const loop = (now) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };
    const play = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const onPointerMove = (event) => {
      if (!interactive || reduce || event.pointerType === 'touch') return;
      const rect = canvas.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      if (pointer.x < -1000) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
    };
    const onPointerLeave = () => {
      pointer.tx = -9999;
      pointer.ty = -9999;
    };
    const onVisibility = () => (document.hidden ? stop() : play());

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersection = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else stop();
      },
      { rootMargin: '100px' },
    );
    intersection.observe(canvas);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    document.addEventListener('visibilitychange', onVisibility);
    resize();
    play();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce, spacing, interactive, intensity]);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn('pointer-events-none absolute inset-0 size-full', className)} />;
}

/** Three slowly drifting colour blobs (sage, steel blue, gold). */
export function Aurora({ className, variant = 'default' }) {
  const strength = variant === 'subtle' ? 0.6 : 1;
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="absolute -top-[30%] left-[5%] aspect-square w-[70vmax] rounded-full animate-aurora-1 will-change-transform"
        style={{ background: `radial-gradient(circle at center, rgba(148,163,120,${0.22 * strength}), transparent 62%)` }}
      />
      <div
        className="absolute -right-[15%] top-[5%] aspect-square w-[60vmax] rounded-full animate-aurora-2 will-change-transform"
        style={{ background: `radial-gradient(circle at center, rgba(52,82,110,${0.55 * strength}), transparent 64%)` }}
      />
      <div
        className="absolute -bottom-[35%] left-[30%] aspect-square w-[50vmax] rounded-full animate-aurora-3 will-change-transform"
        style={{
          background: `radial-gradient(circle at center, rgba(228,179,76,${(variant === 'warm' ? 0.12 : 0.06) * strength}), transparent 60%)`,
        }}
      />
    </div>
  );
}

const BEAMS_X = [
  { top: 128, delay: 0, dur: 7 },
  { top: 320, delay: 2.6, dur: 9 },
  { top: 512, delay: 5.1, dur: 8 },
];
const BEAMS_Y = [
  { left: '22%', delay: 1.2, dur: 10 },
  { left: '64%', delay: 4.4, dur: 12 },
  { left: '86%', delay: 7.5, dur: 9 },
];

/** Faded grid with light beams travelling along its lines. */
export function GridBeams({ className, beams = true }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div className="absolute inset-0 bg-grid mask-radial" />
      {beams && (
        <div className="absolute inset-0 mask-radial">
          {BEAMS_X.map((beam) => (
            <span
              key={beam.top}
              className="absolute left-0 h-px w-[22vw] animate-beam-x bg-gradient-to-r from-transparent via-sage-300/70 to-transparent opacity-0"
              style={{ top: beam.top, animationDelay: `${beam.delay}s`, animationDuration: `${beam.dur}s` }}
            />
          ))}
          {BEAMS_Y.map((beam) => (
            <span
              key={beam.left}
              className="absolute top-0 h-[26vh] w-px animate-beam-y bg-gradient-to-b from-transparent via-sage-300/60 to-transparent opacity-0"
              style={{ left: beam.left, animationDelay: `${beam.delay}s`, animationDuration: `${beam.dur}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const ORBITS = [
  { r: 120, spin: 'animate-spin-slow', dash: '2 10' },
  { r: 210, spin: 'animate-spin-slower', dash: '1 14' },
  { r: 310, spin: 'animate-spin-slow', dash: '' },
  { r: 420, spin: 'animate-spin-slower', dash: '3 18' },
];

/** Concentric rotating rings with small satellites. */
export function Orbits({ className }) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 grid place-items-center overflow-hidden', className)}>
      <div className="relative aspect-square w-[900px] max-w-none">
        {ORBITS.map((orbit, i) => (
          <svg key={orbit.r} viewBox="-450 -450 900 900" className={cn('absolute inset-0 size-full', orbit.spin, i % 2 && '[animation-direction:reverse]')}>
            <circle r={orbit.r} fill="none" stroke="rgba(234,240,245,0.09)" strokeWidth="1" strokeDasharray={orbit.dash || undefined} />
            <circle cx={orbit.r} cy={0} r={i === 1 ? 3.5 : 2.5} fill={i === 1 ? '#E4B34C' : '#B4C68F'} />
            {i === 2 && <circle cx={-orbit.r} cy={0} r={2} fill="#B4C68F" opacity="0.6" />}
          </svg>
        ))}
      </div>
    </div>
  );
}

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

/** Film-grain overlay for the whole viewport. */
export function Grain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70] opacity-[0.045] mix-blend-overlay"
      style={{ backgroundImage: NOISE }}
    />
  );
}

/** Soft sage radial glow; position and size it with className. */
export function Glow({ className }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgba(148,163,120,0.22),transparent_65%)]', className)}
    />
  );
}

/** Per-page title, description and canonical URL. */
export function Seo({ title, description, path }) {
  useSeo({ title, description, path, includeBrand: false });
  return null;
}

/** Plays `variants` (fadeUp by default) once when scrolled into view. */
export function Reveal({ as = 'div', children, className, delay = 0, variants = fadeUp, amount = VIEWPORT.amount, id }) {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ ...VIEWPORT, amount }}
      variants={variants}
      custom={delay}
    >
      {children}
    </Tag>
  );
}

/** Staggers its <StaggerItem> children into view. */
export function Stagger({ as = 'div', children, className, gap = 0.07, delay = 0, amount = 0.2 }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ ...VIEWPORT, amount }} variants={stagger(gap, delay)}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = 'div', children, className, variants = fadeUp }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
}

/**
 * Headline whose words rise from a mask one by one. Wrap words in *asterisks* to tint them sage.
 * Screen readers get the plain sentence.
 */
export function SplitText({ text, as: Tag = 'h2', className, delay = 0, gap = 0.055, id, immediate = false }) {
  const plain = text.replace(/\*/g, '');
  const words = [];
  let accent = false;
  let inWord = false;
  for (const part of text.split(/(\*)/)) {
    if (part === '*') {
      accent = !accent;
      continue;
    }
    if (!part) continue;
    part.split(/(\s+)/).forEach((chunk) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        inWord = false;
      } else {
        if (inWord && words.length > 0) words[words.length - 1].push({ t: chunk, accent });
        else words.push([{ t: chunk, accent }]);
        inWord = true;
      }
    });
  }

  const container = { hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } };
  const word = {
    hidden: { y: '110%', rotate: 2 },
    show: { y: '0%', rotate: 0, transition: { duration: 0.95, ease: EASE_OUT_EXPO } },
  };
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.4 } };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{plain}</span>
      <motion.span aria-hidden="true" className="block" initial="hidden" variants={container} {...trigger}>
        {words.map((pieces, i) => (
          <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span variants={word} className="inline-block origin-bottom-left">
              {pieces.map((piece, j) => (
                <span key={j} className={piece.accent ? 'text-sage-300' : undefined}>
                  {piece.t}
                </span>
              ))}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Counts up to `value` the first time it scrolls into view. */
export function CountUp({ value, prefix = '', suffix = '', decimals = 0, duration = 1.8, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const format = (n) =>
    `${prefix}${n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return undefined;
    if (reduce) {
      el.textContent = format(value);
      return undefined;
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE_OUT_EXPO,
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    return () => controls.stop();
    // format only depends on the props listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, value, reduce]);

  return (
    <span className={cn('nums', className)}>
      <span className="sr-only">{format(value)}</span>
      <span ref={ref} aria-hidden="true">
        {format(reduce ? value : 0)}
      </span>
    </span>
  );
}

const TITLE_SIZES = {
  h1: 'text-[clamp(2.6rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink-50',
  h2: 'text-[clamp(2.1rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50',
};

/** Eyebrow + split headline + lead paragraph + actions, stacked or split into two columns. */
export function SectionHeading({ eyebrow, index, title, description, as = 'h2', id, align = 'left', layout = 'stack', className, actions }) {
  const titleClass = as === 'h1' ? TITLE_SIZES.h1 : TITLE_SIZES.h2;

  if (layout === 'split') {
    return (
      <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12', className)}>
        <div className="lg:col-span-7">
          {eyebrow && (
            <Reveal className="mb-6">
              <Eyebrow index={index}>{eyebrow}</Eyebrow>
            </Reveal>
          )}
          <SplitText as={as} id={id} text={title} className={titleClass} />
        </div>
        {(description || actions) && (
          <Reveal className="lg:col-span-5 lg:pb-2" delay={0.15}>
            {description && <div className="max-w-[52ch] text-base leading-relaxed text-ink-200 sm:text-lg">{description}</div>}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
          </Reveal>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {eyebrow && (
        <Reveal className="mb-6">
          <Eyebrow index={index}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <SplitText as={as} id={id} text={title} className={cn(titleClass, 'max-w-4xl')} />
      {description && (
        <Reveal
          delay={0.12}
          className={cn('mt-6 max-w-[60ch] text-base leading-relaxed text-ink-200 sm:text-lg', align === 'center' && 'mx-auto')}
        >
          {description}
        </Reveal>
      )}
      {actions && (
        <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-3">
          {actions}
        </Reveal>
      )}
    </div>
  );
}
