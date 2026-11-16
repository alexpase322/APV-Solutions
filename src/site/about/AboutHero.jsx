import { CONTACT_PATH } from '../lib/site';
import { Button } from '../ui/Button';
import { PageHero } from '../ui/PageBlocks';
import { PulseDot } from '../ui/primitives';
import { BridgeVisual } from './BridgeVisual';
import { HERO } from './content';

export function AboutHero() {
  return (
    <PageHero
      background="grid"
      eyebrow={HERO.eyebrow}
      title={HERO.title}
      description={<p>{HERO.description}</p>}
      actions={
        <>
          <Button to={CONTACT_PATH} size="lg">
            Get in touch
          </Button>
          <Button to="/portfolio" variant="secondary" size="lg">
            Our work
          </Button>
        </>
      }
      footnote={
        <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em]">
          <PulseDot tone="gold" size="sm" />
          {HERO.footnote}
        </span>
      }
      aside={<BridgeVisual />}
    />
  );
}
