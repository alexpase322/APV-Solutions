import { APP_LINKS, NFC_ORDER_HREF } from '../lib/site';
import { Button } from '../ui/Button';
import { CtaBand } from '../ui/PageBlocks';
import { Seo } from '../ui/primitives';
import { Audience } from '../nfc/Audience';
import { NFC_CTA, NFC_SEO } from '../nfc/content';
import { Faq } from '../nfc/Faq';
import { Features } from '../nfc/Features';
import { HowItWorks } from '../nfc/HowItWorks';
import { NfcHero } from '../nfc/NfcHero';
import '../nfc/nfc.css';

/** /nfc — APV NFC digital business cards. All profile data shown in the mockups is sample data. */
export default function NfcPage() {
  return (
    <>
      <Seo title={NFC_SEO.title} description={NFC_SEO.description} path={NFC_SEO.path} />
      <NfcHero />
      <HowItWorks />
      <Features />
      <Audience />
      <Faq />
      <CtaBand
        askChip="nfc"
        eyebrow={NFC_CTA.eyebrow}
        title={NFC_CTA.title}
        description={NFC_CTA.description}
        actions={
          <>
            <Button href={NFC_ORDER_HREF} size="lg">
              Order on WhatsApp
              <span className="sr-only">{' (opens in a new tab)'}</span>
            </Button>
            <Button to={APP_LINKS.login} variant="secondary" size="lg">
              Log in
            </Button>
          </>
        }
      />
    </>
  );
}
