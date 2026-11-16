import { memo, useEffect, useRef } from 'react';
import { animate } from 'motion/react';
import { AddressBookIcon, ClipboardTextIcon } from '@phosphor-icons/react';
import { pad, useActiveInView } from '../../lib/hooks';
import { BrandIcon } from '../../ui/TechLogo';
import { PulseDot } from '../../ui/primitives';

/** Curves Form → WhatsApp and WhatsApp → CRM, in the 400×200 viewBox. */
const PATHS = ['M60 132 C 120 132, 140 68, 200 68', 'M200 68 C 260 68, 280 132, 340 132'];
/** Node positions in % of the stage. */
const NODES = [
  { label: 'Form', sub: 'New entry', x: 15, y: 66 },
  { label: 'WhatsApp', sub: 'Send message', x: 50, y: 34 },
  { label: 'CRM', sub: 'Update record', x: 85, y: 66 },
];
const LOG = ['New form entry received', 'WhatsApp message sent', 'CRM record updated'];
/** Length of the travelling highlight, as a fraction of the path. */
const COMET = 0.22;
const FIRST_RUN = 1;

const clamp01 = (n) => Math.min(1, Math.max(0, n));
/** 0→1 as `t` goes from `from` to `to`. */
const progress = (t, from, to) => clamp01((t - from) / (to - from));

/**
 * Form → WhatsApp → CRM automation: a pulse travels along each link, nodes light up as it arrives and
 * the log/run counter update. Driven imperatively (no re-renders) and only while on screen.
 */
export const WorkflowMock = memo(function WorkflowMock() {
  const { ref, active, reduce } = useActiveInView();
  const trackRefs = useRef([]);
  const cometRefs = useRef([]);
  const dotRefs = useRef([]);
  const ringRefs = useRef([]);
  const runRef = useRef(null);
  const logRef = useRef(null);
  const runCount = useRef(FIRST_RUN);

  useEffect(() => {
    if (!active) return undefined;
    const tracks = trackRefs.current;
    if (tracks.some((track) => !track)) return undefined;
    const lengths = tracks.map((track) => track.getTotalLength());
    let previous = 0;
    let step = -1;

    const moveComet = (i, p) => {
      const dot = dotRefs.current[i];
      const comet = cometRefs.current[i];
      const track = tracks[i];
      if (!dot || !comet || !track) return;
      const point = track.getPointAtLength(lengths[i] * clamp01(p));
      dot.setAttribute('transform', `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      dot.style.opacity = p > 0 && p < 1 ? '1' : '0';
      comet.style.strokeDashoffset = String(COMET - p);
      comet.style.opacity = p > 0 ? '1' : '0';
    };

    const controls = animate(0, 1, {
      duration: 3.8,
      ease: 'linear',
      repeat: Infinity,
      onUpdate: (t) => {
        if (t < previous) {
          runCount.current += 1;
          if (runRef.current) runRef.current.textContent = pad(runCount.current, 4);
        }
        previous = t;

        moveComet(0, progress(t, 0.06, 0.42) * 1.22);
        moveComet(1, progress(t, 0.5, 0.86) * 1.22);

        const rings = [
          1 - progress(t, 0.04, 0.2),
          progress(t, 0.33, 0.37) * (1 - progress(t, 0.58, 0.72)),
          progress(t, 0.77, 0.81) * (1 - progress(t, 0.95, 1)),
        ];
        rings.forEach((opacity, i) => {
          const ring = ringRefs.current[i];
          if (ring) ring.style.opacity = opacity.toFixed(3);
        });

        const next = t < 0.35 ? 0 : t < 0.79 ? 1 : 2;
        if (next !== step && logRef.current) {
          step = next;
          logRef.current.textContent = LOG[step];
        }
      },
    });
    return () => controls.stop();
  }, [active]);

  return (
    <div
      ref={ref}
      className="flex min-h-[260px] flex-1 flex-col rounded-3xl border border-white/[0.06] bg-ink-950/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-200">
        <span className="inline-flex items-center gap-2">
          <PulseDot tone="gold" size="sm" />
          <span className="text-ink-50">Running</span>
          <span className="hidden sm:inline">· Workflow active</span>
        </span>
        <span className="nums">
          {'Run '}
          {/* updated imperatively on every loop */}
          <span ref={runRef} className="text-ink-50">
            {pad(FIRST_RUN, 4)}
          </span>
        </span>
      </div>

      <div className="grid flex-1 place-items-center pb-9 pt-5">
        <div className="relative aspect-[2/1] w-full max-w-[440px]">
          <svg viewBox="0 0 400 200" className="absolute inset-0 size-full overflow-visible" fill="none">
            {PATHS.map((d, i) => (
              <g key={d}>
                <path
                  ref={(el) => {
                    trackRefs.current[i] = el;
                  }}
                  d={d}
                  stroke="rgba(234,240,245,0.16)"
                  strokeWidth={1.5}
                  strokeDasharray="3 6"
                  className="animate-dash"
                  style={{ animationPlayState: active ? 'running' : 'paused' }}
                />
                <path
                  ref={(el) => {
                    cometRefs.current[i] = el;
                  }}
                  d={d}
                  pathLength={1}
                  stroke="#b4c68f"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeDasharray={`${COMET} 3`}
                  style={{ strokeDashoffset: COMET, opacity: 0 }}
                />
                <g
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  style={{ opacity: 0 }}
                >
                  <circle r={9} fill="#b4c68f" opacity={0.18} />
                  <circle r={3.5} fill="#eaf0f5" />
                </g>
              </g>
            ))}
          </svg>
          {NODES.map((node, i) => (
            <div
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="relative grid size-12 place-items-center rounded-2xl border border-white/10 bg-ink-800 text-ink-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_30px_-14px_rgba(2,6,10,0.9)] sm:size-14">
                <span
                  ref={(el) => {
                    ringRefs.current[i] = el;
                  }}
                  className="absolute -inset-1.5 rounded-[1.15rem] border border-sage-300/60 bg-sage-300/10 shadow-[0_0_0_4px_rgba(180,198,143,0.06)]"
                  style={{ opacity: reduce ? 0.6 : 0 }}
                />
                <span className="relative text-sage-300">
                  {i === 0 && <ClipboardTextIcon weight="duotone" className="size-6" />}
                  {i === 1 && <BrandIcon slug="whatsapp" name="WhatsApp" className="size-6" />}
                  {i === 2 && <AddressBookIcon weight="duotone" className="size-6" />}
                </span>
              </div>
              <div className="absolute left-1/2 top-full mt-2.5 -translate-x-1/2 whitespace-nowrap text-center">
                <p className="text-[12px] font-medium leading-none text-ink-50">{node.label}</p>
                <p className="mt-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-ink-200">{node.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-2.5 font-mono text-[11px] text-ink-100">
        <span className="text-sage-300">&gt;</span>
        {/* updated imperatively as the pulse reaches each node */}
        <span ref={logRef}>{reduce ? 'Form → WhatsApp → CRM' : LOG[0]}</span>
      </div>
    </div>
  );
});
