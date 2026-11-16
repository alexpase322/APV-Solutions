import { Link } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ArrowUpIcon, EnvelopeSimpleIcon, MapPinIcon, PauseIcon, PhoneIcon, PlayIcon } from '@phosphor-icons/react';
import { CONTACT_PATH, FOOTER_SERVICES, NAV_LINKS, SITE, SOCIALS } from '../lib/site';
import { Container, PulseDot } from '../ui/primitives';
import { Logo } from '../ui/Logo';
import { BrandIcon } from '../ui/TechLogo';
import { motionIsCalm, useMotionPrefs } from './motionPrefs';

const LINK = 'text-[15px] text-ink-100 transition-colors hover:text-sage-300';
const HEADING = 'font-mono text-[11px] uppercase tracking-[0.2em] text-ink-200';

export default function Footer() {
  const lenis = useLenis();
  const { paused, setPaused } = useMotionPrefs();

  const backToTop = () => {
    const calm = motionIsCalm();
    if (lenis) lenis.scrollTo(0, calm ? { immediate: true } : { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-ink-950">
      <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,transparent,#000_40%,#000)]" />
      <div
        aria-hidden="true"
        className="absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(148,163,120,0.12),transparent)]"
      />
      <Container className="relative">
        <div className="grid gap-14 pb-14 pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-200">{SITE.tagline}</p>
            <ul className="mt-8 grid gap-3 text-[15px]">
              <li>
                <a href={`mailto:${SITE.email}`} className="group inline-flex items-center gap-3 text-ink-100 transition-colors hover:text-sage-300">
                  <EnvelopeSimpleIcon className="size-[18px] text-sage-300" aria-hidden="true" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a href={SITE.phoneHref} className="group inline-flex items-center gap-3 text-ink-100 transition-colors hover:text-sage-300">
                  <PhoneIcon className="size-[18px] text-sage-300" aria-hidden="true" />
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li className="inline-flex items-center gap-3 text-ink-200">
                <MapPinIcon className="size-[18px] text-sage-300" aria-hidden="true" />
                {SITE.location} · {SITE.region}
              </li>
            </ul>
            <ul className="mt-8 flex gap-2" aria-label="Social media">
              {SOCIALS.map((social) => (
                <li key={social.key}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`APV on ${social.label}`}
                    className="grid size-11 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-ink-200 transition-[color,border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-sage-300/40 hover:bg-sage-300/10 hover:text-sage-300"
                  >
                    <BrandIcon slug={social.key} name={social.label} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className={HEADING}>Quick links</h2>
              <ul className="mt-5 grid gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to={CONTACT_PATH} className={LINK}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className={HEADING}>Services</h2>
              <ul className="mt-5 grid gap-3">
                {FOOTER_SERVICES.map((service) => (
                  <li key={service}>
                    <Link to="/services" className={LINK}>
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <h2 className={HEADING}>Status</h2>
              <p className="mt-5 inline-flex items-center gap-2.5 text-[15px] text-ink-100">
                <PulseDot tone="gold" /> Accepting new projects
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-200">
                Serving businesses across the {SITE.region} from {SITE.hq}.
              </p>
              <button
                type="button"
                onClick={backToTop}
                className="mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-ink-100 transition-colors hover:border-sage-300/40 hover:text-sage-300"
              >
                <ArrowUpIcon weight="bold" className="size-4" aria-hidden="true" /> Back to top
              </button>
            </div>
          </nav>
        </div>

        <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
          <p className="translate-y-[18%] text-center text-[clamp(5rem,24vw,22rem)] font-semibold leading-[0.8] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1px_rgba(234,240,245,0.09)] [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]">
            APV
          </p>
        </div>

        <div className="relative flex flex-col gap-4 border-t border-white/[0.06] py-7 pr-20 text-sm text-ink-200 sm:flex-row sm:items-center sm:justify-between sm:pr-24">
          <p>
            © {SITE.year} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/legal" className="transition-colors hover:text-sage-300">
              Legal · Terms & Privacy
            </Link>
            <button
              type="button"
              aria-pressed={paused}
              onClick={() => setPaused(!paused)}
              className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-sage-300"
            >
              {paused ? <PlayIcon weight="fill" className="size-3.5" aria-hidden="true" /> : <PauseIcon weight="fill" className="size-3.5" aria-hidden="true" />}
              Pause animations
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
