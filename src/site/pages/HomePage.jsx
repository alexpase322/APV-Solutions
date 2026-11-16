import { Seo } from '../ui/primitives';
import HeroSection from '../home/HeroSection';
import TechSection from '../home/TechSection';
import ExpertiseSection from '../home/ExpertiseSection';
import WhoWeAreSection from '../home/WhoWeAreSection';
import PortfolioPreviewSection from '../home/PortfolioPreviewSection';
import HowWeWorkSection from '../home/HowWeWorkSection';
import TeamSection from '../home/TeamSection';
import ContactSection from '../home/ContactSection';

export default function HomePage() {
  return (
    <>
      <Seo
        title="Custom Software, Automation & BI for Growing Businesses | APV Business Solutions"
        description="APV Business Solutions designs and ships custom software, no-code automations and Power BI dashboards that drive measurable growth for SMBs in the US and LATAM."
        path="/"
      />
      <HeroSection />
      <TechSection />
      <ExpertiseSection />
      <WhoWeAreSection />
      <PortfolioPreviewSection />
      <HowWeWorkSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
