import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from 'motion/react';
import { CheckCircleIcon, CheckIcon, ClipboardTextIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { EASE_OUT_EXPO, SPRING_SOFT } from '../lib/motion';
import { PulseDot, WindowFrame } from '../ui/primitives';
import { BrandIcon } from '../ui/TechLogo';
import { createSequence } from './hooks';

/** How long the pulse takes to travel one connector, and its easing. */
const TRAVEL_MS = 1150;
const TRAVEL_EASE = [0.65, 0, 0.35, 1];

const NODES = [
  { app: 'form', kicker: 'Trigger · Form', label: 'New form entry', pos: 'left-0 top-2' },
  { app: 'whatsapp', kicker: 'Action · Twilio', label: 'Send WhatsApp', pos: 'right-0 top-[128px]' },
  { app: 'crm', kicker: 'Action · HubSpot', label: 'Update CRM', pos: 'left-0 top-[248px]' },
];

const LOG_TEXT = {
  form: 'New form entry received',
  whatsapp: 'WhatsApp message sent',
  crm: 'CRM contact updated',
};

/** Log clock: the first run starts at 09:41:12, each run is 47s later and steps are a few seconds apart. */
const CLOCK_START = 34872;
const STEP_OFFSET = [0, 3, 5];

function logTime(run, step) {
  const seconds = CLOCK_START + run * 47 + STEP_OFFSET[step];
  return [Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60].map((n) => pad(n)).join(':');
}

function logEntry(id, run, step) {
  const app = NODES[step].app;
  return { id, time: logTime(run, step), app, text: LOG_TEXT[app] };
}

const IDLE = ['idle', 'idle', 'idle'];
const ALL_DONE = ['done', 'done', 'done'];
/** What the log shows with reduced motion: one complete run. */
const STATIC_LOG = [0, 1, 2].map((step) => logEntry(step, 0, step));

/** Bezier from the bottom-centre of one node box to the top-centre of the next. */
function connector(from, to) {
  const x1 = from.x + from.w / 2;
  const y1 = from.y + from.h;
  const x2 = to.x + to.w / 2;
  const y2 = to.y;
  const midY = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${midY} ${x2} ${midY} ${x2} ${y2}`;
}

/**
 * n8n-style workflow mockup: a form trigger fires, a pulse travels to "Send WhatsApp" and then to
 * "Update CRM", the execution log fills in and a toast confirms the sync. Loops while in view;
 * with reduced motion it shows one finished run.
 */
export function WorkflowDemo() {
  const ref = useRef(null);
  const canvasRef = useRef(null);
  const nodeRefs = useRef([]);
  const pathRefs = useRef([]);
  const pulseRef = useRef(null);
  const runRef = useRef(0);
  const nextIdRef = useRef(STATIC_LOG.length);
  const inView = useInView(ref, { amount: 0.3 });
  const reduce = useReducedMotion();
  const [paths, setPaths] = useState(null);
  const [states, setStates] = useState(() => (reduce ? ALL_DONE : IDLE));
  const [drawn, setDrawn] = useState(() => (reduce ? [true, true] : [false, false]));
  const [log, setLog] = useState(() => (reduce ? STATIC_LOG : []));
  const [toast, setToast] = useState(false);

  // Connectors follow the node boxes, which move with the layout.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const measure = () => {
      const nodes = nodeRefs.current;
      if (nodes.length < 3 || nodes.some((node) => !node)) return;
      const [first, second, third] = nodes.map((node) => ({
        x: node.offsetLeft,
        y: node.offsetTop,
        w: node.offsetWidth,
        h: node.offsetHeight,
      }));
      const next = { w: canvas.clientWidth, h: canvas.clientHeight, d: [connector(first, second), connector(second, third)] };
      setPaths((prev) => (prev && prev.w === next.w && prev.h === next.h && prev.d[0] === next.d[0] ? prev : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  const measured = paths !== null;

  useEffect(() => {
    if (reduce) {
      setStates(ALL_DONE);
      setDrawn([true, true]);
      setLog(STATIC_LOG);
      setToast(false);
      return undefined;
    }
    if (!inView || !measured) return undefined;
    const sequence = createSequence();
    const pulse = pulseRef.current;

    /** Moves the pulse along connector `index`; resolves when it arrives. */
    const travel = (index) =>
      new Promise((resolve) => {
        const path = pathRefs.current[index];
        if (!path || !pulse) {
          resolve();
          return;
        }
        const length = path.getTotalLength();
        pulse.style.opacity = '1';
        const controls = animate(0, 1, {
          duration: TRAVEL_MS / 1000,
          ease: TRAVEL_EASE,
          onUpdate: (t) => {
            const point = path.getPointAtLength(t * length);
            pulse.setAttribute('transform', `translate(${point.x} ${point.y})`);
          },
          onComplete: () => {
            pulse.style.opacity = '0';
            if (!sequence.cancelled) resolve();
          },
        });
        sequence.track(() => controls.stop());
      });

    const pushLog = (step) => {
      const entry = logEntry(nextIdRef.current++, runRef.current, step);
      setLog((prev) => [...prev, entry].slice(-4));
    };

    (async () => {
      for (;;) {
        setStates(IDLE);
        setDrawn([false, false]);
        await sequence.wait(700);
        setStates(['active', 'idle', 'idle']);
        await sequence.wait(850);
        setStates(['done', 'idle', 'idle']);
        pushLog(0);
        await sequence.wait(300);
        setDrawn([true, false]);
        await travel(0);
        setStates(['done', 'active', 'idle']);
        await sequence.wait(800);
        setStates(['done', 'done', 'idle']);
        pushLog(1);
        await sequence.wait(300);
        setDrawn([true, true]);
        await travel(1);
        setStates(['done', 'done', 'active']);
        await sequence.wait(800);
        setStates(ALL_DONE);
        pushLog(2);
        setToast(true);
        await sequence.wait(2600);
        setToast(false);
        await sequence.wait(900);
        runRef.current += 1;
      }
    })();

    return () => {
      sequence.cancel();
      if (pulse) pulse.style.opacity = '0';
      setStates(IDLE);
      setDrawn([false, false]);
      setToast(false);
    };
  }, [inView, reduce, measured]);

  const recent = log.slice(-3);

  return (
    <div ref={ref} aria-hidden="true" className="relative">
      <WindowFrame
        title="workflow · lead-intake"
        right={
          <>
            <PulseDot tone="gold" size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gold-300">Running</span>
          </>
        }
        bodyClassName="p-4 sm:p-6"
        className="shadow-[0_50px_100px_-40px_rgba(2,6,10,0.95)]"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-sage-300">
            <PulseDot tone="sage" size="sm" />
            Workflow active
          </span>
          <span className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] tracking-wide text-ink-200">
            <BrandIcon slug="n8n" name="n8n" className="size-3.5" />
            n8n
          </span>
        </div>
        <div ref={canvasRef} className="relative h-[320px]">
          <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-dots opacity-70 mask-radial" />
          {paths && (
            <svg className="absolute inset-0 size-full overflow-visible" viewBox={`0 0 ${paths.w} ${paths.h}`} fill="none">
              {paths.d.map((d, i) => (
                <g key={i}>
                  <path
                    ref={(el) => {
                      pathRefs.current[i] = el;
                    }}
                    d={d}
                    stroke="rgb(234 240 245 / 0.14)"
                    strokeWidth={1.5}
                    strokeDasharray="3 5"
                    strokeLinecap="round"
                    className="animate-dash"
                    style={{ animationPlayState: inView ? 'running' : 'paused' }}
                  />
                  <motion.path
                    d={d}
                    stroke="#b4c68f"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    initial={false}
                    animate={drawn[i] ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
                    transition={
                      drawn[i]
                        ? { pathLength: { duration: TRAVEL_MS / 1000, ease: TRAVEL_EASE }, opacity: { duration: 0.2 } }
                        : { duration: 0.45, ease: EASE_OUT_EXPO }
                    }
                  />
                </g>
              ))}
              <g ref={pulseRef} style={{ opacity: 0 }}>
                <circle r={11} fill="rgb(180 198 143 / 0.14)" />
                <circle r={5} fill="#b4c68f" />
                <circle r={1.75} fill="#eaf0f5" />
              </g>
            </svg>
          )}
          {NODES.map((node, i) => (
            <div
              key={node.app}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              className={cn('absolute w-[66%] sm:w-[48%]', node.pos)}
            >
              <WorkflowNode state={states[i]} kicker={node.kicker} label={node.label} icon={<AppIcon app={node.app} />} />
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-white/[0.06] bg-ink-950/40">
          <div className="flex items-center justify-between border-b border-white/[0.05] px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-300 sm:px-4">
            <span>Execution log</span>
            <span>Auto-scroll</span>
          </div>
          <div className="relative h-[96px] overflow-hidden px-3.5 sm:px-4">
            {log.length === 0 && (
              <div className="flex h-8 items-center gap-3 pt-1">
                <span className="font-mono text-[11px] text-ink-300">Waiting for trigger</span>
                <span className="h-2 w-24 rounded-full shimmer" />
              </div>
            )}
            <ul className="absolute inset-x-3.5 bottom-0 flex flex-col sm:inset-x-4">
              <AnimatePresence initial={false} mode="popLayout">
                {recent.map((entry) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                    className="grid h-8 grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-2.5 font-mono text-[11px] sm:gap-3 sm:text-[12px]"
                  >
                    <span className="text-ink-300 nums">{entry.time}</span>
                    <span className="grid size-5 place-items-center rounded-md border border-white/[0.08] bg-white/[0.03] text-ink-200">
                      <AppIcon app={entry.app} small />
                    </span>
                    <span className="truncate text-ink-100">{entry.text}</span>
                    <CheckIcon weight="bold" className="size-3.5 text-sage-300" />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </div>
      </WindowFrame>
      <div className="pointer-events-none absolute -bottom-6 right-6 hidden sm:block lg:-right-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96, transition: { duration: 0.3, ease: EASE_OUT_EXPO } }}
              transition={{ type: 'spring', stiffness: 460, damping: 19 }}
              className="glass flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span className="grid size-8 place-items-center rounded-xl bg-sage-300/[0.12] text-sage-300">
                <CheckCircleIcon weight="fill" className="size-4.5" />
              </span>
              <span>
                <span className="block text-[13px] font-medium text-ink-50">Lead synced to CRM</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-300">3 steps · just now</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** A workflow step card: idle, active (pulsing ring) or done (badge). */
function WorkflowNode({ state, kicker, label, icon }) {
  return (
    <motion.div
      animate={{ scale: state === 'active' ? 1.035 : 1 }}
      transition={SPRING_SOFT}
      className={cn(
        'relative flex items-center gap-3 rounded-2xl border bg-ink-850 p-3 shadow-[0_18px_40px_-20px_rgba(2,6,10,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-500',
        state === 'idle' ? 'border-white/[0.08]' : 'border-sage-300/40',
      )}
    >
      {state === 'active' && (
        <motion.span
          className="pointer-events-none absolute -inset-px rounded-2xl border border-sage-300/70"
          initial={{ opacity: 0.9, scale: 1 }}
          animate={{ opacity: 0, scale: 1.12 }}
          transition={{ duration: 1.1, ease: 'easeOut', repeat: Infinity }}
        />
      )}
      <span
        className={cn(
          'grid size-10 shrink-0 place-items-center rounded-xl border transition-colors duration-500',
          state === 'idle' ? 'border-white/[0.08] bg-white/[0.03] text-ink-200' : 'border-sage-300/25 bg-sage-300/[0.1] text-sage-300',
        )}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-mono text-[9.5px] uppercase tracking-[0.1em] text-ink-300">{kicker}</span>
        <span className="mt-0.5 block truncate text-[13px] font-medium text-ink-50 sm:text-sm">{label}</span>
      </span>
      <AnimatePresence>
        {state === 'done' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', stiffness: 520, damping: 20 }}
            className="absolute -right-2 -top-2.5 flex items-center gap-1 rounded-full border border-sage-300/30 bg-ink-900 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-sage-300"
          >
            <CheckIcon weight="bold" className="size-2.5" />
            done
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AppIcon({ app, small = false }) {
  if (app === 'form') return <ClipboardTextIcon weight="duotone" className={small ? 'size-3' : 'size-5'} />;
  const brandClass = small ? 'size-3' : 'size-[18px]';
  if (app === 'whatsapp') return <BrandIcon slug="whatsapp" name="WhatsApp" className={brandClass} />;
  return <BrandIcon slug="hubspot" name="HubSpot" className={brandClass} />;
}
