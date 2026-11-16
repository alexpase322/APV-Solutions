import { useRef } from 'react';
import { useInView } from 'motion/react';
import { AsteriskIcon } from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { TextLink } from '../ui/Button';
import { Marquee } from '../ui/Marquee';
import { Container, Reveal, Section, SectionHeading } from '../ui/primitives';
import { ABOUT_PRODUCTS, PRODUCTS_HEADING, PRODUCT_RIBBON } from './content';
import { ProductCard } from './ProductCard';

/** Proprietary products: a marquee of product cards over a slow, outlined ribbon of product names. */
export function ProductsSection() {
  const ref = useRef(null);
  const nearView = useInView(ref, { margin: '200px 0px' });

  return (
    <Section ref={ref} id="products" aria-labelledby="products-title" className={cn('isolate overflow-hidden', !nearView && 'about-paused')}>
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_55%_at_50%_60%,#000_10%,transparent_75%)]" />
      </div>
      <Container>
        <SectionHeading
          id="products-title"
          layout="split"
          eyebrow={PRODUCTS_HEADING.eyebrow}
          title={PRODUCTS_HEADING.title}
          description={PRODUCTS_HEADING.description}
          actions={
            <TextLink to="/portfolio" className="min-h-11">
              See the portfolio
            </TextLink>
          }
        />
      </Container>
      <Reveal className="mt-14 sm:mt-16">
        <Marquee label="Product cards" duration={120} repeat={2} gap="1.25rem" className="py-4">
          {ABOUT_PRODUCTS.map((product) => (
            <ProductCard key={product.key} product={product} />
          ))}
        </Marquee>
      </Reveal>
      <div aria-hidden="true" inert className="mt-8 sm:mt-10">
        <Marquee reverse duration={80} pauseOnHover={false} gap="2.5rem">
          {PRODUCT_RIBBON.map((name) => (
            <span key={name} className="flex shrink-0 items-center gap-10">
              <span className="about-outline-ink whitespace-nowrap text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-none tracking-[-0.05em]">
                {name}
              </span>
              <AsteriskIcon weight="bold" className="size-6 text-sage-300/60 sm:size-8" />
            </span>
          ))}
        </Marquee>
      </div>
    </Section>
  );
}
