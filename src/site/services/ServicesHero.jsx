import { ArrowDownIcon, GlobeHemisphereWestIcon } from '@phosphor-icons/react';
import { CONTACT_PATH } from '../lib/site';
import { Button } from '../ui/Button';
import { PageHero } from '../ui/PageBlocks';
import { HERO } from './content';
import { ServiceIndex } from './ServiceIndex';

const TITLE_CLASS = 'text-[clamp(2.5rem,7.4vw,4rem)] lg:text-[clamp(2.75rem,4.6vw,4.4rem)]';

export function ServicesHero() {
  return (
    <PageHero
      background="grid"
      eyebrow={HERO.eyebrow}
      title={HERO.title}
      titleClassName={TITLE_CLASS}
      description={HERO.description}
      actions={
        <>
          <Button to={CONTACT_PATH} size="lg">
            Start your project
          </Button>
          <Button to="#software" variant="secondary" size="lg" icon={<ArrowDownIcon weight="bold" aria-hidden="true" className="size-4" />}>
            Explore the services
          </Button>
        </>
      }
      footnote={
        <span className="flex flex-col gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] sm:flex-row sm:items-center sm:gap-2">
          <span className="flex items-center gap-2">
            <GlobeHemisphereWestIcon weight="duotone" aria-hidden="true" className="size-4 shrink-0 text-sage-300" />
            <span className="whitespace-nowrap">Remote / Global services</span>
          </span>
          <span className="whitespace-nowrap pl-6 sm:pl-0">
            <span aria-hidden="true" className="max-sm:hidden">
              {'· '}
            </span>
            US &amp; LATAM
          </span>
        </span>
      }
      aside={<ServiceIndex />}
    />
  );
}
