import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { ArrowRightIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';

const BASE =
  'group/btn relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color,box-shadow] duration-300 ease-out-expo active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const VARIANTS = {
  primary:
    'bg-sage-300 text-ink-950 hover:bg-sage-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_12px_32px_-12px_rgba(148,163,120,0.6)]',
  secondary:
    'border border-white/10 bg-white/[0.04] text-ink-50 backdrop-blur-md hover:border-white/20 hover:bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
  ghost: 'text-ink-100 hover:bg-white/[0.05] hover:text-ink-50',
};

const SIZES = { sm: 'h-10 px-4 text-sm', md: 'h-12 px-6 text-[15px]', lg: 'h-14 px-7 text-base' };

const isExternal = (href) => /^https?:\/\//.test(href);

/** Arrow that slides out to the right and back in from the left on hover. */
export function ArrowSwap({ className }) {
  return (
    <span aria-hidden="true" className={cn('relative inline-flex size-4 overflow-hidden', className)}>
      <ArrowRightIcon
        weight="bold"
        className="absolute inset-0 size-4 transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-[150%]"
      />
      <ArrowRightIcon
        weight="bold"
        className="absolute inset-0 size-4 -translate-x-[150%] transition-transform duration-500 ease-out-expo group-hover/btn:translate-x-0"
      />
    </span>
  );
}

/**
 * Pill button. Renders a router <Link> with `to`, an <a> with `href` (external links open in a new tab),
 * or a <button>. Primary buttons follow the cursor slightly ("magnetic").
 */
export function Button(props) {
  const { variant = 'primary', size = 'md', icon, leading, magnetic = variant === 'primary', className, children } = props;
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 });

  const onPointerMove = (event) => {
    if (!magnetic || reduce || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((event.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  const trailing = icon === false ? null : (icon ?? (variant === 'primary' ? <ArrowSwap /> : null));
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const content = (
    <>
      {leading}
      <span>{children}</span>
      {trailing}
    </>
  );

  let element;
  if ('to' in props && props.to !== undefined) {
    element = (
      <Link to={props.to} className={classes}>
        {content}
      </Link>
    );
  } else if ('href' in props && props.href !== undefined) {
    const external = props.external ?? isExternal(props.href);
    element = (
      <a
        href={props.href}
        className={classes}
        aria-label={props['aria-label']}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  } else {
    const { variant: _v, size: _s, icon: _i, leading: _l, magnetic: _m, className: _c, children: _ch, ...rest } = props;
    element = (
      <button type="button" {...rest} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <motion.span ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} style={{ x: springX, y: springY }} className="inline-flex">
      {element}
    </motion.span>
  );
}

/** Inline sage link with an underline that draws in and the swapping arrow. */
export function TextLink({ to, href, children, className }) {
  const classes = cn('group/btn inline-flex items-center gap-2 font-medium text-sage-300 transition-colors hover:text-sage-200', className);
  const content = (
    <>
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 ease-out-expo group-hover/btn:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowSwap />
    </>
  );
  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }
  return (
    <a href={href} className={classes} {...(href && isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {content}
    </a>
  );
}
