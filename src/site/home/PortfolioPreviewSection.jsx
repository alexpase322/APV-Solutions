import { ArrowUpRightIcon, HourglassIcon } from '@phosphor-icons/react';
import { Container, PulseDot, Reveal, Section, SectionHeading, Tag } from '../ui/primitives';
import { Button, TextLink } from '../ui/Button';
import { AskAILink } from '../assistant/AskAI';
import { PRODUCTS } from '../lib/site';
import { pad } from '../lib/hooks';
import { Carousel } from './portfolio/Carousel';
import { JornixsMock, ListingAIMock, NexusMock, NfcCardMock } from './portfolio/ProductMockups';

const PRODUCT_MOCKS = { jornixs: <JornixsMock />, listingai: <ListingAIMock />, apvnexus: <NexusMock /> };

const SLIDES = [
  ...PRODUCTS.map((product) => ({
    key: product.slug,
    name: product.name,
    category: product.category,
    tagline: product.tagline,
    tags: product.stack,
    status: product.status,
    href: product.href,
    mock: PRODUCT_MOCKS[product.slug],
  })),
  {
    key: 'nfc',
    name: 'APV NFC Cards',
    category: 'NFC · Digital business cards',
    tagline: 'One tap. Your whole professional profile.',
    tags: ['No app needed', 'QR code backup', 'View analytics'],
    status: 'internal',
    to: '/nfc',
    mock: <NfcCardMock />,
  },
];

/** Home "Portfolio": carousel of shipped products, each with a small live mockup. */
export default function PortfolioPreviewSection() {
  return (
    <Section aria-labelledby="products-title" className="isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-b from-transparent via-ink-850/60 to-transparent" />
      </div>
      <Container>
        <SectionHeading
          id="products-title"
          layout="split"
          eyebrow="Portfolio"
          title="Products we've *built & shipped*"
          description="A selection of real platforms in production — from payroll SaaS to AI content tools and operations hubs."
        />
        <Reveal className="mt-14 sm:mt-16" amount={0.1}>
          <Carousel
            label="Products we've built and shipped"
            slideClassName="w-[86%] sm:w-[440px]"
            header={
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <TextLink to="/portfolio" className="min-h-11">
                  View the full portfolio
                </TextLink>
                <AskAILink chip="portfolio">Ask AI about our products</AskAILink>
                <span className="nums hidden font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200 sm:inline">
                  {pad(SLIDES.length)} products
                </span>
              </div>
            }
          >
            {SLIDES.map((slide, i) => (
              <ProductSlide key={slide.key} slide={slide} index={i} />
            ))}
          </Carousel>
        </Reveal>
      </Container>
    </Section>
  );
}

function ProductSlide({ slide, index }) {
  const titleId = `product-${slide.key}-title`;

  return (
    <article aria-labelledby={titleId} className="surface flex h-full flex-col rounded-4xl p-2.5">
      <div aria-hidden="true" className="relative h-[288px] overflow-hidden rounded-[1.6rem] border border-white/[0.06] bg-ink-950/70">
        <div className="absolute inset-0 bg-grid-sm opacity-60 mask-radial" />
        <div className="relative h-full">{slide.mock}</div>
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-6 sm:px-5 sm:pb-5">
        <div className="flex items-center justify-between gap-3">
          <Tag tone="sage">{slide.category}</Tag>
          <span className="nums shrink-0 font-mono text-[11px] tracking-[0.18em] text-ink-200">
            {pad(index + 1)} / {pad(SLIDES.length)}
          </span>
        </div>
        <h3 id={titleId} className="mt-5 text-[1.65rem] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-50">
          {slide.name}
        </h3>
        <p className="mt-2.5 text-[15px] leading-relaxed text-ink-200">{slide.tagline}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5" aria-label={slide.status === 'internal' ? 'Highlights' : 'Stack'}>
          {slide.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
          {slide.status === 'live' && slide.href && (
            <>
              <Button
                href={slide.href}
                variant="secondary"
                size="md"
                icon={<ArrowUpRightIcon weight="bold" className="size-4" aria-hidden="true" />}
                aria-label={`Visit live site: ${slide.name} (opens in a new tab)`}
              >
                Visit live site
              </Button>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-200">
                <PulseDot tone="gold" size="sm" /> Live
              </span>
            </>
          )}
          {slide.status === 'soon' && (
            <span className="flex min-h-12 items-center">
              <Tag tone="gold" className="gap-2 py-1.5 uppercase tracking-[0.14em]">
                <HourglassIcon weight="duotone" className="size-3.5" aria-hidden="true" />
                Coming soon
              </Tag>
            </span>
          )}
          {slide.status === 'internal' && slide.to && (
            <Button to={slide.to} variant="secondary" size="md">
              Explore NFC cards
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
