import { ArrowUpRightIcon, CheckIcon, QuotesIcon } from '@phosphor-icons/react';
import { hasBrandIcon } from '../lib/brandIcons';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { CONTACT_PATH } from '../lib/site';
import { Button, TextLink } from '../ui/Button';
import { PulseDot, Reveal, SplitText, Stagger, StaggerItem, Tag } from '../ui/primitives';
import { BrandIcon } from '../ui/TechLogo';
import { hostnameOf, stackTech } from './content';
import { JornixsMock } from './JornixsMock';
import { ListingAIMock } from './ListingAIMock';
import { NexusMock } from './NexusMock';
import { StatusBadge } from './PortfolioUI';

const MOCKS = { jornixs: JornixsMock, listingai: ListingAIMock, apvnexus: NexusMock };

/** The product's illustrative interface; decorative, so hidden from assistive tech. */
export function ProductMock({ slug }) {
  const Mock = MOCKS[slug];
  return (
    <div aria-hidden="true" className="select-none">
      <Mock />
    </div>
  );
}

function FeatureList({ items, className }) {
  return (
    <Stagger as="ul" gap={0.07} className={cn('grid gap-2.5', className)}>
      {items.map((item) => (
        <StaggerItem key={item} as="li" className="flex items-start gap-3 text-[15px] leading-snug text-ink-100">
          <span
            aria-hidden="true"
            className="mt-px grid size-5 shrink-0 place-items-center rounded-md border border-sage-300/25 bg-sage-300/[0.1] text-sage-300"
          >
            <CheckIcon weight="bold" className="size-3" />
          </span>
          <span>{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** "Visit live site" + hostname for live products; otherwise the status and a contact link. */
function ProductCta({ product }) {
  if (product.href) {
    const host = hostnameOf(product.href);
    return (
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Button
          href={product.href}
          aria-label={`Visit the ${product.name} live site (opens in a new tab)`}
          icon={
            <ArrowUpRightIcon
              weight="bold"
              aria-hidden="true"
              className="size-4 transition-transform duration-500 ease-out-expo group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
            />
          }
        >
          Visit live site
        </Button>
        {host && (
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-200">
            <PulseDot tone="gold" size="sm" />
            {host}
          </span>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <StatusBadge status={product.status} className="h-10 px-3.5 text-[12px]" />
      <TextLink to={CONTACT_PATH} className="min-h-11">
        Ask us about {product.name}
      </TextLink>
    </div>
  );
}

function CaseFileCopy({ product, index, total }) {
  return (
    <>
      <Reveal className="flex items-center justify-between gap-4">
        <Tag tone="sage">{product.category}</Tag>
        <span className="shrink-0 font-mono text-[11px] tracking-[0.2em] text-ink-200 nums">
          <span className="sr-only">{'Product '}</span>
          <span className="text-ink-50">{pad(index + 1)}</span>
          <span aria-hidden="true">{' / '}</span>
          <span className="sr-only">{' of '}</span>
          {pad(total)}
        </span>
      </Reveal>
      <SplitText
        as="h3"
        id={`${product.slug}-title`}
        text={product.name}
        className="mt-6 text-[clamp(2.5rem,4vw,3.9rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink-50 lg:[@media(max-height:900px)]:mt-4 lg:[@media(max-height:900px)]:text-[clamp(2.25rem,3.4vw,3.25rem)]"
      />
      <Reveal
        as="p"
        delay={0.08}
        className="mt-4 flex gap-3 text-xl font-medium leading-snug tracking-[-0.02em] text-sage-300 xl:text-[1.3rem] lg:[@media(max-height:900px)]:mt-3 lg:[@media(max-height:900px)]:text-lg"
      >
        <QuotesIcon aria-hidden="true" weight="fill" className="mt-1 size-5 shrink-0 text-sage-300/45" />
        <span>{product.tagline}</span>
      </Reveal>
      <Reveal
        as="p"
        delay={0.14}
        className="mt-4 text-[15px] leading-relaxed text-ink-200 sm:text-base lg:text-[15px] xl:text-base lg:[@media(max-height:900px)]:mt-3 lg:[@media(max-height:900px)]:text-[15px]"
      >
        {product.description}
      </Reveal>
      <FeatureList items={product.features} className="mt-6 lg:[@media(max-height:900px)]:mt-4 lg:[@media(max-height:900px)]:gap-2" />
      <p className="sr-only">Built with</p>
      <Stagger as="ul" gap={0.04} className="mt-6 flex flex-wrap gap-1.5 lg:[@media(max-height:900px)]:mt-4" amount={0.5}>
        {product.stack.map((name) => {
          const tech = stackTech(name);
          return (
            <StaggerItem key={name} as="li">
              <Tag className="h-7">
                {hasBrandIcon(tech.logo) && <BrandIcon slug={tech.logo} name={tech.name} className="size-3.5 text-ink-200" />}
                {name}
              </Tag>
            </StaggerItem>
          );
        })}
      </Stagger>
      <Reveal delay={0.1} className="mt-7 lg:[@media(max-height:900px)]:mt-5">
        <ProductCta product={product} />
      </Reveal>
    </>
  );
}

/** Two-column case file: copy on one side, the product mock on the other (sides alternate per product). */
export function CaseFile({ product, index, total, mock }) {
  const flipped = index % 2 === 1;
  return (
    <div
      className={cn(
        'relative z-10 grid gap-10 p-5 sm:gap-12 sm:p-8',
        'lg:min-h-[min(78vh,calc(100vh-11rem))] lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-0 lg:p-10 xl:gap-x-12 xl:p-12',
        'lg:[@media(max-height:900px)]:gap-x-10 lg:[@media(max-height:900px)]:p-8',
      )}
    >
      <div
        className={cn(
          'min-w-0 lg:col-span-6 xl:col-span-5 lg:[@media(max-height:900px)]:col-span-6',
          flipped && 'lg:col-start-7 xl:col-start-8 lg:[@media(max-height:900px)]:col-start-7',
        )}
      >
        <CaseFileCopy product={product} index={index} total={total} />
      </div>
      <div
        className={cn(
          'relative min-w-0 lg:col-span-6 xl:col-span-7 lg:[@media(max-height:900px)]:col-span-6',
          flipped && 'lg:col-start-1 lg:row-start-1',
        )}
      >
        {mock}
        <p
          aria-hidden="true"
          className={cn(
            'mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-200 lg:[@media(max-height:900px)]:mt-2',
            !flipped && 'lg:text-right',
          )}
        >
          Illustrative UI · sample data
        </p>
      </div>
    </div>
  );
}
