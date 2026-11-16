import { Link } from 'react-router-dom';
import { ArrowRightIcon, ArrowUpRightIcon, ClockIcon, GlobeHemisphereWestIcon, HouseLineIcon, IdentificationCardIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { IconTile, PulseDot, Tag } from '../ui/primitives';

const PRODUCT_ICONS = {
  jornixs: ClockIcon,
  'nexus-crm': UsersThreeIcon,
  'nexus-inmigracion': GlobeHemisphereWestIcon,
  listingai: HouseLineIcon,
  nfc: IdentificationCardIcon,
};

const CARD_CLASS =
  'group/card surface relative flex h-[320px] w-[290px] shrink-0 flex-col overflow-hidden rounded-4xl p-6 transition-[translate,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-sage-300/30 sm:h-[340px] sm:w-[380px] sm:p-7';

/** Proprietary product card: an external link (new tab), an internal route, or a plain article when it has no link. */
export function ProductCard({ product }) {
  const Icon = PRODUCT_ICONS[product.key];
  const { link } = product;
  const external = !!link?.href;

  const content = (
    <>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-sm opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_85%_10%,#000_10%,transparent_70%)]" />
        <Icon
          weight="thin"
          className="absolute -right-8 -top-8 size-44 text-white/[0.04] transition-transform duration-700 ease-out-expo group-hover/card:-rotate-6 group-hover/card:scale-105"
        />
      </div>
      <div className="relative flex items-center justify-between gap-3">
        <IconTile size="sm">
          <Icon weight="duotone" className="size-5" />
        </IconTile>
        <ProductStatus status={product.status} />
      </div>
      <div className="relative mt-auto">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-200">{product.category}</span>
        <h3 className="mt-3 text-[1.75rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50 sm:text-[2.1rem]">{product.name}</h3>
        {product.aka && <p className="mt-2 text-[15px] text-sage-300">{product.aka}</p>}
        <p className="mt-3 text-[15px] leading-relaxed text-ink-200">{product.line}</p>
      </div>
      <div className="relative mt-6 flex min-h-6 items-center justify-between border-t border-white/[0.06] pt-4 text-sm">
        {link ? (
          <span className="inline-flex items-center gap-2 font-medium text-sage-300 transition-colors group-hover/card:text-sage-200">
            {link.label}
            {external ? (
              <ArrowUpRightIcon
                weight="bold"
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-out-expo group-hover/card:-translate-y-0.5 group-hover/card:translate-x-0.5"
              />
            ) : (
              <ArrowRightIcon
                weight="bold"
                aria-hidden="true"
                className="size-4 transition-transform duration-500 ease-out-expo group-hover/card:translate-x-1"
              />
            )}
          </span>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-200">Built by APV</span>
        )}
        {external && <span className="sr-only">(opens in a new tab)</span>}
      </div>
    </>
  );

  if (link?.href) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={CARD_CLASS}>
        {content}
      </a>
    );
  }
  if (link?.to) {
    return (
      <Link to={link.to} className={CARD_CLASS}>
        {content}
      </Link>
    );
  }
  return <article className={CARD_CLASS}>{content}</article>;
}

function ProductStatus({ status }) {
  if (status.tone === 'live') {
    return (
      <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-100">
        <PulseDot tone="gold" size="sm" />
        {status.label}
      </span>
    );
  }
  return (
    <Tag tone={status.tone === 'soon' ? 'gold' : 'neutral'} className="shrink-0">
      {status.label}
    </Tag>
  );
}
