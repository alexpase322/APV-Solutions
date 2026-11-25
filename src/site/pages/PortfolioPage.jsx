import { CtaBand } from '../ui/PageBlocks';
import { Seo } from '../ui/primitives';
import { CTA_COPY, PORTFOLIO_SEO } from '../portfolio/content';
import { PortfolioHero } from '../portfolio/PortfolioHero';
import { ProductIndex } from '../portfolio/ProductIndex';
import { ProductShowcase } from '../portfolio/ProductShowcase';
import { StackSection } from '../portfolio/StackSection';
import { ProjectActions } from '../portfolio/PortfolioUI';

/** /portfolio — the products we've built: hero deck, index, stacked case files, shared stack, CTA. */
export default function PortfolioPage() {
  return (
    <>
      <Seo title={PORTFOLIO_SEO.title} description={PORTFOLIO_SEO.description} path={PORTFOLIO_SEO.path} />
      <PortfolioHero />
      <ProductIndex />
      <ProductShowcase />
      <StackSection />
      <CtaBand
        eyebrow={CTA_COPY.eyebrow}
        title={CTA_COPY.title}
        description={CTA_COPY.description}
        actions={<ProjectActions />}
      />
    </>
  );
}
