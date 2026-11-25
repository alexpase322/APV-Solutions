import { CONTACT_PATH } from '../lib/site';
import { Button } from '../ui/Button';
import { CtaBand } from '../ui/PageBlocks';
import { Seo } from '../ui/primitives';
import { AboutHero } from '../about/AboutHero';
import { MissionStatement } from '../about/MissionStatement';
import { MissionVision } from '../about/MissionVision';
import { ValuesSection } from '../about/ValuesSection';
import { ProductsSection } from '../about/ProductsSection';
import { TeamSection } from '../about/TeamSection';
import { ABOUT_SEO, CTA } from '../about/content';
import '../about/about.css';

export default function AboutPage() {
  return (
    <>
      <Seo title={ABOUT_SEO.title} description={ABOUT_SEO.description} path={ABOUT_SEO.path} />
      <AboutHero />
      <MissionStatement />
      <MissionVision />
      <ValuesSection />
      <ProductsSection />
      <TeamSection />
      <CtaBand
        eyebrow={CTA.eyebrow}
        title={CTA.title}
        description={CTA.description}
        actions={
          <>
            <Button to={CONTACT_PATH} size="lg">
              Get in touch
            </Button>
            <Button to="/services" variant="secondary" size="lg">
              View services
            </Button>
          </>
        }
      />
    </>
  );
}
