import React, { useState } from 'react';
import { Check, ChevronRight, Globe, Mail, MapPin, MessageCircle, Phone, Share2, UserPlus } from 'lucide-react';
import {
  CARD_SURFACE,
  digitsOnly,
  initials,
  luminance,
  pillStyle,
  platformById,
  platformFromUrl,
  readableOn,
  safeHref,
  whatsappHref,
} from '../../lib/nfc';
import useCardTheme from '../../hooks/useCardTheme';

/** Pill-shaped link: brand logo badge on the left, custom text, brand-colored border. */
const LinkPill = ({ href, platform, label, accent, onAccent, dark, linkStyle }) => {
  const Icon = platform.icon;
  // Generic links / "other" use the card's accent color instead of a brand color
  const badgeStyle = platform.background
    ? { background: platform.background, color: platform.color || '#ffffff' }
    : { background: accent, color: onAccent };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-pill group flex items-center gap-4 rounded-full p-1.5 pr-5 shadow-sm active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#94A378]"
      style={pillStyle(platform, { accent, dark, linkStyle })}
    >
      <span
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 dark:ring-1 dark:ring-white/15"
        style={badgeStyle}
        aria-hidden="true"
      >
        <Icon size={22} />
      </span>
      <span className="flex-1 min-w-0 truncate font-semibold text-[#263646] dark:text-gray-100">{label}</span>
      <ChevronRight
        size={18}
        className="flex-shrink-0 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
};

const ActionButton = ({ href, icon, label, external }) => {
  const Icon = icon;
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex flex-col items-center gap-1.5 rounded-2xl border py-3 transition-colors bg-[#F8F9FA] border-gray-100 text-[#263646] hover:border-gray-300 hover:bg-white dark:bg-white/5 dark:border-white/10 dark:text-gray-100 dark:hover:bg-white/10 dark:hover:border-white/20"
    >
      <Icon size={20} aria-hidden="true" />
      <span className="text-xs font-semibold">{label}</span>
    </a>
  );
};

/**
 * Presentational digital business card. Resolves its own light/dark theme from `profile.theme`.
 *
 * @param {object} props.profile  Card profile data
 * @param {string} [props.vcardHref] Download link for "Save contact" (omit in previews)
 * @param {string} [props.shareUrl]  Public URL used by the Share button
 * @param {boolean} [props.preview]  Renders non-interactive (editor preview)
 */
const CardProfile = ({ profile, vcardHref, shareUrl, preview = false }) => {
  const [copied, setCopied] = useState(false);
  const p = profile || {};
  const dark = useCardTheme(p.theme);
  const accent = /^#[0-9a-f]{6}$/i.test(p.accentColor || '') ? p.accentColor : '#263646';
  const onAccent = readableOn(accent);
  // Accent used for small details on the card surface; lightened at night so dark accents stay visible
  const surface = dark ? CARD_SURFACE.dark : CARD_SURFACE.light;
  const accentText = dark ? `color-mix(in srgb, ${accent} 55%, #ffffff)` : accent;
  // Main button: a very dark accent would disappear on the night background, so invert it to a light button
  const ctaBg = dark && luminance(accent) < 0.08 ? '#F3F4F6' : accent;
  const ctaFg = readableOn(ctaBg);

  const avatar = safeHref(p.avatarUrl);
  const cover = safeHref(p.coverUrl);
  const website = safeHref(p.website);
  const wa = p.whatsapp ? whatsappHref(p.whatsapp) : null;
  const tags = (p.tags || []).filter(Boolean);

  const actions = [
    p.phone && { href: `tel:${digitsOnly(p.phone)}`, icon: Phone, label: 'Call' },
    wa && { href: wa, icon: MessageCircle, label: 'WhatsApp', external: true },
    p.email && { href: `mailto:${p.email}`, icon: Mail, label: 'Email' },
    website && { href: website, icon: Globe, label: 'Website', external: true },
  ].filter(Boolean);

  // Socials first, then custom links. Custom links get a brand logo when the URL is from a known network.
  const pills = [
    ...(p.socials || []).map((s, i) => {
      const platform = platformById(s.platform);
      return { key: `s-${i}`, href: safeHref(s.url), platform, label: s.label?.trim() || platform.label };
    }),
    ...(p.links || []).map((l, i) => ({
      key: `l-${i}`,
      href: safeHref(l.url),
      platform: platformFromUrl(l.url),
      label: l.label,
    })),
  ].filter((item) => item.href);

  const share = async () => {
    if (!shareUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: p.fullName || 'Digital card', url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled the share sheet */
    }
  };

  const subtitle = [p.jobTitle, p.company].filter(Boolean).join(' · ');

  return (
    <div
      className={`${dark ? 'dark' : ''} w-full max-w-md mx-auto sm:rounded-3xl sm:shadow-xl overflow-hidden ${preview ? 'pointer-events-none select-none' : ''}`}
      style={{ backgroundColor: dark ? '#151d29' : '#ffffff', colorScheme: dark ? 'dark' : 'light' }}
    >
      {/* Cover */}
      <div
        className="h-36 relative"
        style={
          cover
            ? { backgroundImage: `url("${cover}")`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 55%, #94A378 140%)` }
        }
      >
        {shareUrl && !preview && (
          <button
            type="button"
            onClick={share}
            aria-label={copied ? 'Link copied' : 'Share this card'}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        )}
      </div>

      <div className="px-6 pb-8">
        {/* relative + z-10: the cover is positioned, so without its own layer the avatar paints underneath it */}
        <div className="relative z-10 -mt-14 mb-4 w-fit">
          {avatar ? (
            <img
              src={avatar}
              alt={p.fullName || 'Profile photo'}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-white dark:ring-[#151d29] shadow-md bg-gray-100"
            />
          ) : (
            <div
              className="w-28 h-28 rounded-full ring-4 ring-white dark:ring-[#151d29] shadow-md flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: accent, color: onAccent }}
              aria-hidden="true"
            >
              {initials(p.fullName)}
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold leading-tight text-[#263646] dark:text-white">{p.fullName || 'Your Name'}</h1>
        {subtitle && <p className="mt-1 text-gray-600 dark:text-gray-300">{subtitle}</p>}
        {p.bio && <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-300">{p.bio}</p>}

        {/* Tags under the bio */}
        {tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tags">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border px-3 py-1 text-xs font-semibold text-[#263646] dark:text-gray-100"
                style={{
                  backgroundColor: `color-mix(in srgb, ${accentText} ${dark ? 18 : 10}%, ${surface})`,
                  borderColor: `color-mix(in srgb, ${accentText} ${dark ? 45 : 35}%, transparent)`,
                }}
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* Save contact */}
        {vcardHref || preview ? (
          <a
            href={preview ? undefined : vcardHref}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold shadow-lg transition-transform active:scale-[0.98]"
            style={{ backgroundColor: ctaBg, color: ctaFg }}
          >
            <UserPlus size={20} aria-hidden="true" />
            Save Contact
          </a>
        ) : null}

        {/* Quick actions */}
        {actions.length > 0 && (
          <div className={`mt-4 grid gap-3 ${actions.length >= 4 ? 'grid-cols-4' : actions.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {actions.map((a) => (
              <ActionButton key={a.label} {...a} />
            ))}
          </div>
        )}

        {/* Social media + custom links as pills */}
        {pills.length > 0 && (
          <div className="mt-6 space-y-3">
            {pills.map((item) => (
              <LinkPill key={item.key} {...item} accent={accent} onAccent={onAccent} dark={dark} linkStyle={p.linkStyle} />
            ))}
          </div>
        )}

        {/* Address */}
        {p.address && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-start gap-3 text-sm text-gray-600 hover:text-[#263646] dark:text-gray-300 dark:hover:text-white"
          >
            <MapPin size={18} className="flex-shrink-0 mt-0.5" style={{ color: accentText }} aria-hidden="true" />
            <span>{p.address}</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default CardProfile;
