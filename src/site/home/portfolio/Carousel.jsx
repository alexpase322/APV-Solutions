import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { cn } from '../../lib/cn';
import { motionIsCalm } from '../../layout/motionPrefs';

/**
 * Horizontal snap carousel: `header` on the left, a scroll-progress bar and prev/next buttons on the
 * right. Scrolls with arrow keys, mouse drag (without triggering clicks) and native touch.
 * With `bleed`, the track runs past the container's right gutter.
 */
export function Carousel({ children, label, className, slideClassName, header, bleed = true }) {
  const trackRef = useRef(null);
  const slides = Children.toArray(children);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const { scrollXProgress } = useScroll({ container: trackRef });
  const progress = useSpring(scrollXProgress, { stiffness: 200, damping: 30 });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 4);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    updateEdges();
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateEdges);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [updateEdges]);

  /** Scroll one slide (width + gap) left (-1) or right (1). */
  const step = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0;
    const distance = first ? first.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: direction * distance, behavior: motionIsCalm() ? 'auto' : 'smooth' });
  };

  // Mouse drag-to-scroll. Snapping is suspended while dragging so the track follows the cursor.
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });

  const onPointerDown = (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || !trackRef.current) return;
    drag.current = { active: true, startX: event.clientX, startLeft: trackRef.current.scrollLeft, moved: false };
  };

  const onPointerMove = (event) => {
    const state = drag.current;
    const track = trackRef.current;
    if (!state.active || !track) return;
    const dx = event.clientX - state.startX;
    if (!state.moved && Math.abs(dx) > 6) {
      state.moved = true;
      track.setPointerCapture(event.pointerId);
      track.style.scrollSnapType = 'none';
      track.style.cursor = 'grabbing';
    }
    if (state.moved) track.scrollLeft = state.startLeft - dx;
  };

  const endDrag = (event) => {
    const state = drag.current;
    const track = trackRef.current;
    if (!state.active || !track) return;
    state.active = false;
    if (!state.moved) return;
    track.releasePointerCapture?.(event.pointerId);
    track.style.cursor = '';
    // restoring snap can jump; pin the current offset so it settles from here
    const left = track.scrollLeft;
    track.style.scrollSnapType = '';
    track.scrollLeft = left;
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={cn('relative', className)}>
      <div className="mb-8 flex items-end justify-between gap-6">
        <div className="min-w-0 flex-1">{header}</div>
        <div className="flex shrink-0 items-center gap-4">
          <div aria-hidden="true" className="hidden h-px w-32 overflow-hidden rounded-full bg-white/10 sm:block">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-sage-300" />
          </div>
          <div className="flex gap-2">
            <CarouselButton label="Previous slide" disabled={atStart} onClick={() => step(-1)}>
              <ArrowLeftIcon weight="bold" className="size-4" />
            </CarouselButton>
            <CarouselButton label="Next slide" disabled={atEnd} onClick={() => step(1)}>
              <ArrowRightIcon weight="bold" className="size-4" />
            </CarouselButton>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            step(1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            step(-1);
          }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(event) => {
          // a drag that ends over a link must not follow it
          if (drag.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            drag.current.moved = false;
          }
        }}
        className={cn(
          'flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] focus-visible:outline-offset-8 [&::-webkit-scrollbar]:hidden',
          bleed && '-mr-5 pr-5 sm:-mr-8 sm:pr-8 lg:-mr-10 lg:pr-10',
        )}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}`}
            className={cn('shrink-0 snap-start', slideClassName)}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselButton({ label, disabled, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-ink-50 transition-[background-color,border-color,opacity,transform] duration-300 ease-out-expo hover:border-sage-300/40 hover:bg-sage-300/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
