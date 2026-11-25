import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon } from '@phosphor-icons/react';
import { SITE } from '../lib/site';
import { Aurora, Container, Eyebrow, GridBeams, IconTile, Reveal, Section, SplitText, Stagger, StaggerItem } from '../ui/primitives';
import { Button } from '../ui/Button';
import { BrandIcon } from '../ui/TechLogo';
import { AskAIButton } from '../assistant/AskAI';
import { ContactForm } from './contact/ContactForm';
import { CopyEmailButton } from './contact/CopyEmailButton';

/** Home "Get in touch" section (#contact): contact details and channels on the left, form on the right. */
export default function ContactSection() {
  return (
    <Section id="contact" aria-labelledby="contact-title" className="isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <Aurora variant="subtle" />
        <GridBeams className="opacity-70" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-900 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-900" />
      </div>

      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal className="mb-6">
              <Eyebrow>Get in touch</Eyebrow>
            </Reveal>
            <SplitText
              as="h2"
              id="contact-title"
              text="Ready to start your *digital transformation*?"
              className="text-[clamp(2.1rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-50"
            />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-ink-200 sm:text-lg">
                Whether you need a custom dashboard, a complex automation, or a full software solution, we are here to help.
              </p>
            </Reveal>

            <Stagger as="ul" gap={0.08} className="mt-10 grid gap-3">
              <StaggerItem as="li">
                <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-ink-850/60 p-4 sm:p-5">
                  <IconTile size="sm">
                    <EnvelopeSimpleIcon weight="duotone" className="size-5" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">Email us</p>
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                      <a
                        href={`mailto:${SITE.email}`}
                        className="inline-flex min-h-[44px] min-w-0 items-center text-[14px] font-medium text-ink-50 transition-colors [overflow-wrap:anywhere] hover:text-sage-200 sm:text-base"
                      >
                        {SITE.email}
                      </a>
                      <CopyEmailButton />
                    </div>
                  </div>
                </div>
              </StaggerItem>

              <StaggerItem as="li">
                <a
                  href={SITE.phoneHref}
                  className="group/row flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-ink-850/60 p-4 transition-colors duration-300 hover:border-sage-300/25 sm:p-5"
                >
                  <IconTile size="sm">
                    <PhoneIcon weight="duotone" className="size-5" />
                  </IconTile>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">Call us</span>
                    <span className="nums mt-1.5 block text-[15px] font-medium text-ink-50 sm:text-base">{SITE.phoneDisplay}</span>
                  </span>
                  <ArrowUpRightIcon
                    weight="bold"
                    aria-hidden="true"
                    className="size-4 text-ink-200 transition-transform duration-300 group-hover/row:-translate-y-0.5 group-hover/row:translate-x-0.5 group-hover/row:text-sage-300"
                  />
                </a>
              </StaggerItem>

              <StaggerItem as="li">
                <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-ink-850/60 p-4 sm:p-5">
                  <IconTile size="sm">
                    <MapPinIcon weight="duotone" className="size-5" />
                  </IconTile>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200">Location</p>
                    <p className="mt-1.5 text-[15px] font-medium text-ink-50 sm:text-base">{SITE.location}</p>
                  </div>
                  <span className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-sage-300 sm:inline">{SITE.region}</span>
                </div>
              </StaggerItem>
            </Stagger>

            <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Button
                href={SITE.whatsappHref}
                variant="secondary"
                leading={<BrandIcon slug="whatsapp" name="WhatsApp" className="size-[18px] text-whatsapp" />}
                icon={<ArrowUpRightIcon weight="bold" className="size-4" aria-hidden="true" />}
                aria-label="Chat on WhatsApp (opens in a new tab)"
              >
                Chat on WhatsApp
              </Button>
              <AskAIButton>Ask our AI assistant</AskAIButton>
              <p className="text-sm text-ink-200">
                Prefer to read first?{' '}
                <Link
                  to="/services"
                  className="text-ink-50 underline decoration-white/20 underline-offset-4 hover:decoration-sage-300"
                >
                  See our services
                </Link>
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </Section>
  );
}
