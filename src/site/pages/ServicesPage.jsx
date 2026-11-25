import { useRef } from 'react';
import { CONTACT_PATH } from '../lib/site';
import { Button } from '../ui/Button';
import { CtaBand } from '../ui/PageBlocks';
import { Seo } from '../ui/primitives';
import { AutomationSection } from '../services/AutomationSection';
import { BiSection } from '../services/BiSection';
import { CTA, SEO, SERVICE_NAV } from '../services/content';
import { ServiceNav } from '../services/ServiceNav';
import { ServicesHero } from '../services/ServicesHero';
import { SoftwareSection } from '../services/SoftwareSection';
import { Toolbelt } from '../services/Toolbelt';

/** /services — the three practices (#software, #automation, #bi), the toolbelt and a closing CTA. */
export default function ServicesPage() {
  const softwareRef = useRef(null);
  const automationRef = useRef(null);
  const biRef = useRef(null);

  return (
    <>
      <Seo title={SEO.title} description={SEO.description} path={SEO.path} />
      <ServicesHero />
      <div className="relative">
        <ServiceNav items={SERVICE_NAV} targets={{ software: softwareRef, automation: automationRef, bi: biRef }} />
        <SoftwareSection sectionRef={softwareRef} />
        <AutomationSection sectionRef={automationRef} />
        <BiSection sectionRef={biRef} />
      </div>
      <Toolbelt />
      <CtaBand
        title={CTA.title}
        description={CTA.description}
        actions={
          <>
            <Button to={CONTACT_PATH} size="lg">
              Contact us now
            </Button>
            <Button to="/portfolio" variant="secondary" size="lg">
              See our work
            </Button>
          </>
        }
      />
    </>
  );
}
