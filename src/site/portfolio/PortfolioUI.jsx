import { HourglassMediumIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { CONTACT_PATH } from '../lib/site';
import { Button } from '../ui/Button';
import { PulseDot, Tag } from '../ui/primitives';

/** "Live" with a pulsing gold dot, or a gold "Coming soon" tag. */
export function StatusBadge({ status, className }) {
  if (status === 'live') {
    return (
      <span className={cn('inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-gold-300', className)}>
        <PulseDot tone="gold" size="sm" />
        Live
      </span>
    );
  }
  return (
    <Tag tone="gold" className={cn('shrink-0 whitespace-nowrap', className)}>
      <HourglassMediumIcon aria-hidden="true" weight="duotone" className="size-3.5" />
      Coming soon
    </Tag>
  );
}

/** "Start a project" + "See services", used by the hero and the closing CTA. */
export function ProjectActions() {
  return (
    <>
      <Button to={CONTACT_PATH} size="lg">
        Start a project
      </Button>
      <Button to="/services" variant="secondary" size="lg">
        See services
      </Button>
    </>
  );
}
