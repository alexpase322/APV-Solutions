import { Fragment, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';

/**
 * Infinite horizontal (or vertical) scroller. Children are rendered twice so the loop is seamless;
 * pauses on hover, off-screen and while a child has keyboard focus. With reduced motion it becomes a
 * plain scrollable strip.
 */
export function Marquee({
  children,
  duration = 40,
  reverse = false,
  vertical = false,
  pauseOnHover = true,
  fade = true,
  gap = '1rem',
  className,
  label,
  repeat = 1,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '120px' });
  const reduce = useReducedMotion();

  const track = cn(
    'flex shrink-0 will-change-transform motion-reduce:animate-none',
    vertical ? 'flex-col animate-marquee-y' : 'w-max animate-marquee',
    reverse && '[animation-direction:reverse]',
    pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
    'group-focus-within/marquee:animate-none',
    'group-data-[offscreen=true]/marquee:[animation-play-state:paused]',
  );
  const group = cn('flex shrink-0 gap-[var(--gap)]', vertical ? 'flex-col pb-[var(--gap)]' : 'items-stretch pr-[var(--gap)]');
  const extra =
    repeat > 1 ? (
      <div aria-hidden="true" inert className="contents motion-reduce:hidden">
        {Array.from({ length: repeat - 1 }, (_, i) => (
          <Fragment key={i}>{children}</Fragment>
        ))}
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      role={label ? 'region' : undefined}
      aria-label={label}
      data-offscreen={inView ? undefined : 'true'}
      tabIndex={reduce && label ? 0 : undefined}
      onFocusCapture={(event) => {
        const target = event.target;
        if (target !== event.currentTarget) window.setTimeout(() => target.scrollIntoView({ block: 'nearest', inline: 'nearest' }), 0);
      }}
      style={{ '--marquee-duration': `${duration}s`, '--gap': gap }}
      className={cn(
        'group/marquee relative flex min-w-0 max-w-full',
        vertical
          ? 'flex-col overflow-clip focus-within:overflow-y-auto focus-within:[scrollbar-width:none] motion-reduce:overflow-y-auto'
          : 'overflow-clip [contain:inline-size] focus-within:overflow-x-auto focus-within:[scrollbar-width:none] motion-reduce:overflow-x-auto',
        fade && (vertical ? 'mask-fade-y' : 'mask-fade-x'),
        className,
      )}
    >
      <div className={track}>
        <div className={group}>
          {children}
          {extra}
        </div>
        <div className={cn(group, 'motion-reduce:hidden')} aria-hidden="true" inert>
          {children}
          {extra}
        </div>
      </div>
    </div>
  );
}
