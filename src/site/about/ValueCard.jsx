import { motion, useMotionValue, useTransform } from 'motion/react';
import { HeartStraightIcon, IntersectIcon, PuzzlePieceIcon, SealCheckIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { IconTile } from '../ui/primitives';
import { CollaborationVisual } from './CollaborationVisual';
import { EmpathyVisual } from './EmpathyVisual';
import { InnovationVisual } from './InnovationVisual';
import { IntegrityVisual } from './IntegrityVisual';

const VALUE_ICONS = { integrity: SealCheckIcon, innovation: PuzzlePieceIcon, empathy: HeartStraightIcon, collaboration: IntersectIcon };

function ValueVisual({ value }) {
  switch (value) {
    case 'integrity':
      return <IntegrityVisual />;
    case 'innovation':
      return <InnovationVisual />;
    case 'empathy':
      return <EmpathyVisual />;
    case 'collaboration':
      return <CollaborationVisual />;
    default:
      return null;
  }
}

/**
 * One core value: outlined index, icon, animated visual, title and copy.
 * With `progress` (the pinned horizontal scroller) the index drifts sideways in parallax, more for later cards.
 */
export function ValueCard({ value, order, progress, className }) {
  const Icon = VALUE_ICONS[value.key];
  const still = useMotionValue(0);
  const x = useTransform(progress ?? still, [0, 1], progress ? [36 + order * 8, -36 - order * 8] : [0, 0]);

  return (
    <article
      aria-labelledby={`value-${value.key}`}
      className={cn(
        'group/value surface relative flex flex-col overflow-hidden rounded-4xl p-7 transition-[border-color] duration-500 hover:border-sage-300/25 sm:p-9',
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-sm opacity-40 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_45%,#000_10%,transparent_70%)]"
      />
      <div className="relative flex items-start justify-between gap-4">
        <motion.span
          aria-hidden="true"
          style={{ x }}
          className="about-outline nums block text-[clamp(4rem,6vw,6rem)] font-semibold leading-[0.8] tracking-[-0.06em]"
        >
          {value.index}
        </motion.span>
        <IconTile size="lg">
          <Icon weight="duotone" className="size-7" />
        </IconTile>
      </div>
      <div className="relative my-5 flex min-h-[152px] flex-1 items-center justify-center">
        <ValueVisual value={value.key} />
      </div>
      <div className="relative">
        <h3 id={`value-${value.key}`} className="text-[1.75rem] font-semibold leading-none tracking-[-0.04em] text-ink-50 sm:text-3xl">
          {value.title}
        </h3>
        <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-ink-200">{value.text}</p>
      </div>
    </article>
  );
}
