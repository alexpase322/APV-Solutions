import { cn } from '../lib/cn';
import { STATS, TEAM } from '../lib/site';
import { TiltCard } from './Cards';
import { CountUp, Stagger, StaggerItem } from './primitives';

/** Co-founder cards (photo, or an animated initials placeholder). */
export function TeamGrid({ className }) {
  return (
    <Stagger className={cn('grid gap-6 md:grid-cols-2 lg:gap-8', className)} gap={0.12}>
      {TEAM.map((member, i) => (
        <StaggerItem key={member.name}>
          <TeamCard member={member} index={i} />
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function TeamCard({ member, index }) {
  return (
    <TiltCard max={6} className="rounded-4xl">
      <article className="group surface relative overflow-hidden rounded-4xl p-3">
        <div className="relative aspect-[5/4] overflow-hidden rounded-[1.6rem] sm:aspect-[4/3]">
          {member.photo ? (
            <div className="absolute inset-0 bg-gradient-to-b from-sage-200 via-sage-500 to-ink-700">
              <img
                src={member.photo}
                alt={`Portrait of ${member.name}`}
                width={591}
                height={591}
                loading="lazy"
                decoding="async"
                className="size-full object-cover object-[50%_22%] mix-blend-multiply grayscale contrast-[1.08] transition-[filter,transform] duration-700 ease-out-expo group-hover:scale-[1.03] group-hover:grayscale-[35%]"
              />
            </div>
          ) : (
            <InitialsPortrait initials={member.initials} />
          )}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-900/85 to-transparent" />
          <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-ink-900/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-50 backdrop-blur">
            0{index + 1} / Co-Founder
          </span>
        </div>
        <div className="px-4 pb-5 pt-6 sm:px-5">
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-ink-50">{member.name}</h3>
          <p className="mt-2 max-w-[46ch] text-[15px] leading-relaxed text-sage-300">{member.role}</p>
        </div>
      </article>
    </TiltCard>
  );
}

function InitialsPortrait({ initials }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-ink-800">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-sm opacity-70" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-square w-[140%] -translate-x-1/2 -translate-y-1/2 animate-[spin_14s_linear_infinite] rounded-full opacity-60"
        style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(180,198,143,0.35) 60deg, transparent 120deg, transparent 360deg)' }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <span className="relative font-mono text-[clamp(4rem,12vw,7.5rem)] font-semibold tracking-[-0.06em] text-ink-50">
          <span className="text-sage-300">&lt;</span>
          {initials}
          <span className="text-sage-300">/&gt;</span>
        </span>
      </div>
    </div>
  );
}

/** Counting stats row (`inline`, divided) or as separate `cards`. */
export function StatsGrid({ className, variant = 'inline' }) {
  return (
    <Stagger
      as="ul"
      gap={0.08}
      className={cn(
        'grid grid-cols-2 lg:grid-cols-4',
        variant === 'inline'
          ? 'divide-white/[0.07] border-y border-white/[0.07] max-lg:[&>li:nth-child(-n+2)]:border-b max-lg:[&>li:nth-child(-n+2)]:border-white/[0.07] lg:divide-x [&>li:nth-child(odd)]:max-lg:border-r [&>li:nth-child(odd)]:max-lg:border-white/[0.07]'
          : 'gap-4',
        className,
      )}
    >
      {STATS.map((stat) => (
        <StaggerItem key={stat.label} as="li" className={cn('flex flex-col justify-between gap-6 p-6 sm:p-8', variant === 'cards' && 'surface rounded-3xl')}>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">{stat.label}</span>
          <CountUp
            value={stat.value}
            suffix={stat.suffix}
            className="text-[clamp(2.75rem,5vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink-50"
          />
        </StaggerItem>
      ))}
    </Stagger>
  );
}
