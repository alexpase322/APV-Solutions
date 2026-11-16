import { Link } from 'react-router-dom';
import { ArrowDownIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { pad } from '../lib/hooks';
import { PRODUCTS } from '../lib/site';
import { Container, Stagger, StaggerItem } from '../ui/primitives';
import { focusPanelOnClick } from './content';
import { StatusBadge } from './PortfolioUI';

/** Glass bar overlapping the hero's bottom edge: one jump link per product case file. */
export function ProductIndex() {
  return (
    <div className="relative z-10 -mt-4 sm:-mt-6 lg:-mt-10">
      <Container>
        <nav aria-label="Product index" className="glass relative overflow-hidden rounded-3xl">
          <div
            aria-hidden="true"
            className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sage-300/40 to-transparent"
          />
          <Stagger
            as="ol"
            gap={0.08}
            amount={0.4}
            className="grid divide-y divide-white/[0.06] md:grid-cols-3 md:divide-x md:divide-y-0"
          >
            {PRODUCTS.map((product, index) => (
              <StaggerItem key={product.slug} as="li">
                <Link
                  to={`#${product.slug}`}
                  onClick={focusPanelOnClick(product.slug)}
                  className={cn(
                    'group relative grid min-h-[4.75rem] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 px-5 py-4 transition-colors duration-300 hover:bg-white/[0.03] focus-visible:-outline-offset-2 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-y-0 md:py-5',
                    index === 0 && 'rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none',
                    index === PRODUCTS.length - 1 && 'rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-span-2 row-start-1 self-start pt-1 font-mono text-[11px] tracking-[0.2em] text-ink-200 nums md:row-span-1 md:self-center md:pt-0"
                  >
                    {pad(index + 1)}
                  </span>
                  <span className="col-start-2 row-start-1 text-[17px] font-semibold tracking-[-0.02em] text-ink-50 md:col-start-1 md:row-start-2 md:mt-3">
                    {product.name}
                  </span>
                  <span className="col-start-2 row-start-2 mt-1 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-ink-200 md:col-start-1 md:row-start-3">
                    {product.category}
                  </span>
                  <StatusBadge
                    status={product.status}
                    className="col-start-3 row-span-2 row-start-1 md:col-start-2 md:row-span-1 md:justify-self-end"
                  />
                  <span
                    aria-hidden="true"
                    className="relative hidden size-9 shrink-0 place-items-center self-end justify-self-end overflow-hidden rounded-full border border-white/10 text-ink-100 transition-colors duration-300 group-hover:border-sage-300/40 group-hover:text-sage-300 md:col-start-2 md:row-span-2 md:row-start-2 md:grid"
                  >
                    <ArrowDownIcon
                      weight="bold"
                      className="absolute size-4 transition-transform duration-500 ease-out-expo group-hover:translate-y-[160%]"
                    />
                    <ArrowDownIcon
                      weight="bold"
                      className="absolute size-4 -translate-y-[160%] transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-sage-300/70 transition-transform duration-500 ease-out-expo group-hover:scale-x-100 sm:inset-x-6"
                  />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </nav>
      </Container>
    </div>
  );
}
