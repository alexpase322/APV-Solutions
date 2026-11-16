import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { Container } from '../ui/primitives';

/**
 * Sticky pill bar that jumps between the service sections. Each item shows how far its section
 * has been read; the item whose section crosses the middle of the viewport is marked current.
 * `items` are SERVICE_NAV entries; `targets` maps each item id to its section's ref.
 */
export function ServiceNav({ items, targets }) {
  const [activeId, setActiveId] = useState(null);
  const progress = useRef({});

  const report = useCallback(
    (id, value) => {
      progress.current[id] = value;
      const current = items.find((item) => {
        const p = progress.current[item.id] ?? 0;
        return p > 0 && p < 1;
      });
      setActiveId(current ? current.id : null);
    },
    [items],
  );

  return (
    <div className="pointer-events-none sticky top-[88px] z-30 h-0 sm:top-24">
      <Container>
        <motion.nav
          aria-label="Jump to a service"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.9 }}
          className="pointer-events-auto mx-auto w-fit max-w-full"
        >
          <ul className="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <ServiceNavItem key={item.id} item={item} target={targets[item.id]} active={activeId === item.id} report={report} />
            ))}
          </ul>
        </motion.nav>
      </Container>
    </div>
  );
}

function ServiceNavItem({ item, target, active, report }) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 50%', 'end 50%'] });
  useMotionValueEvent(scrollYProgress, 'change', (value) => report(item.id, value));
  const fill = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });

  return (
    <li className="shrink-0">
      <Link
        to={`#${item.id}`}
        aria-current={active ? 'location' : undefined}
        className={cn(
          'relative isolate flex h-11 items-center gap-2.5 rounded-full px-4 text-[14px] font-medium tracking-[-0.01em] transition-colors duration-300 sm:px-5',
          active ? 'text-ink-50' : 'text-ink-200 hover:text-ink-50',
        )}
      >
        {active && (
          <motion.span
            layoutId="svc-nav-active"
            transition={SPRING_SNAPPY}
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-full border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
          />
        )}
        <span
          aria-hidden="true"
          className={cn(
            'font-mono text-[11px] tracking-[0.12em] transition-colors duration-300 max-sm:hidden',
            active ? 'text-sage-300' : 'text-ink-300',
          )}
        >
          {item.index}
        </span>
        <span className="whitespace-nowrap sm:hidden">{item.short}</span>
        <span className="whitespace-nowrap max-sm:hidden">{item.label}</span>
        <span aria-hidden="true" className="absolute inset-x-4 bottom-[7px] h-px overflow-hidden rounded-full bg-white/[0.06] sm:inset-x-5">
          <motion.span
            style={{ scaleX: fill }}
            className={cn('block h-full origin-left transition-colors duration-300', active ? 'bg-sage-300' : 'bg-white/25')}
          />
        </span>
      </Link>
    </li>
  );
}
