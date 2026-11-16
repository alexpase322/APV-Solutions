import { memo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CalendarCheckIcon,
  CaretRightIcon,
  CheckIcon,
  EnvelopeSimpleIcon,
  GlobeIcon,
  LinkedinLogoIcon,
  PhoneIcon,
  UserPlusIcon,
} from '@phosphor-icons/react';
import { cn } from '../lib/cn';
import { EASE_OUT_EXPO, SPRING_SNAPPY } from '../lib/motion';
import { BrandIcon } from '../ui/TechLogo';
import { DEMO_PROFILE } from './content';
import { PhoneStatusBar } from './Phone';

/** Screen fade; children stagger in on open and out (in reverse) on close. */
const SCREEN = {
  hidden: { opacity: 0, transition: { opacity: { duration: 0.3 }, staggerChildren: 0.02, staggerDirection: -1, when: 'afterChildren' } },
  show: { opacity: 1, transition: { opacity: { duration: 0.35 }, staggerChildren: 0.065, delayChildren: 0.08 } },
};

const ITEM = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)', transition: { duration: 0.25, ease: 'easeIn' } },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_OUT_EXPO }, transitionEnd: { filter: 'none' } },
};

const COVER = {
  hidden: { opacity: 0, scale: 1.08, transition: { duration: 0.3 } },
  show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
};

const AVATAR = {
  hidden: { opacity: 0, scale: 0.6, transition: { duration: 0.2 } },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 18 } },
};

const QUICK_ACTIONS = [
  { label: 'Call', icon: PhoneIcon },
  { label: 'WhatsApp', logo: 'whatsapp' },
  { label: 'Email', icon: EnvelopeSimpleIcon },
  { label: 'Website', icon: GlobeIcon },
];

function LinkIcon({ kind }) {
  if (kind === 'instagram') return <BrandIcon slug="instagram" name="Instagram" className="size-[13px]" />;
  if (kind === 'tiktok') return <BrandIcon slug="tiktok" name="TikTok" className="size-[13px]" />;
  if (kind === 'linkedin') return <LinkedinLogoIcon weight="fill" className="size-[14px]" />;
  return <CalendarCheckIcon weight="duotone" className="size-[14px]" />;
}

/** The demo person's digital profile as it opens on the phone after a tap. */
export const ProfileScreen = memo(function ProfileScreen({ open, saved }) {
  const profile = DEMO_PROFILE;

  return (
    <motion.div className="absolute inset-0 bg-ink-900" initial={false} animate={open ? 'show' : 'hidden'} variants={SCREEN}>
      <PhoneStatusBar />
      <motion.div
        variants={COVER}
        className="absolute inset-x-[10px] top-[44px] h-[88px] origin-top overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#5f6b4c_0%,#263646_55%,#15222f_100%)]"
      >
        <div className="absolute inset-0 bg-grid-sm opacity-60" />
        <svg viewBox="0 0 232 88" className="absolute inset-0 size-full" aria-hidden="true">
          <path d="M0 70 L30 52 L52 60 L84 34 L118 56 L150 30 L184 50 L232 26 L232 88 L0 88 Z" fill="rgba(7,12,18,0.35)" />
          <path d="M0 78 L40 64 L76 72 L112 54 L150 70 L196 52 L232 62 L232 88 L0 88 Z" fill="rgba(7,12,18,0.45)" />
        </svg>
        <span className="absolute right-3 top-3 h-[18px] w-[18px] rounded-full bg-gold-300/80 shadow-[0_0_0_6px_rgba(240,204,126,0.12)]" />
      </motion.div>

      <div className="absolute inset-x-0 top-[100px] px-[18px]">
        <motion.div
          variants={AVATAR}
          className="grid size-[64px] place-items-center rounded-full bg-[linear-gradient(145deg,#ccdab0,#94a378_55%,#5f6b4c)] text-[20px] font-semibold tracking-[-0.03em] text-ink-950 ring-[4px] ring-ink-900"
        >
          {profile.initials}
        </motion.div>
        <motion.div variants={ITEM} className="mt-2.5">
          <p className="text-[17px] font-semibold leading-tight tracking-[-0.03em] text-ink-50">{profile.name}</p>
          <p className="mt-0.5 text-[11px] font-medium text-sage-300">{profile.role}</p>
        </motion.div>
        <motion.p variants={ITEM} className="mt-2 text-[10.5px] leading-[1.45] text-ink-200">
          {profile.bio}
        </motion.p>
        <motion.div variants={ITEM} className="mt-2.5 flex flex-wrap gap-1">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-[2px] font-mono text-[8.5px] tracking-wide text-ink-100"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.div variants={ITEM} className="mt-3">
          <motion.div
            animate={saved ? { scale: [1, 0.95, 1] } : { scale: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            className={cn(
              'relative flex h-[36px] items-center justify-center gap-1.5 overflow-hidden rounded-[12px] text-[11.5px] font-semibold tracking-[-0.01em] transition-colors duration-500',
              saved ? 'bg-sage-200 text-ink-950' : 'bg-sage-300 text-ink-950',
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {saved ? (
                <motion.span
                  key="saved"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={SPRING_SNAPPY}
                  className="flex items-center gap-1.5"
                >
                  <CheckIcon weight="bold" className="size-[13px]" />
                  Saved to contacts
                </motion.span>
              ) : (
                <motion.span
                  key="save"
                  initial={{ y: 14, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -14, opacity: 0 }}
                  transition={SPRING_SNAPPY}
                  className="flex items-center gap-1.5"
                >
                  <UserPlusIcon weight="bold" className="size-[13px]" />
                  Save contact
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div variants={ITEM} className="mt-2 grid grid-cols-4 gap-1.5">
          {QUICK_ACTIONS.map((action) => (
            <div
              key={action.label}
              className="flex h-[46px] flex-col items-center justify-center gap-1 rounded-[12px] border border-white/[0.06] bg-white/[0.04] text-sage-200"
            >
              {action.logo ? (
                <BrandIcon slug={action.logo} name="WhatsApp" className="size-[14px]" />
              ) : (
                action.icon && <action.icon weight="duotone" className="size-[15px]" />
              )}
              <span className="text-[8.5px] font-medium text-ink-100">{action.label}</span>
            </div>
          ))}
        </motion.div>

        <div className="mt-3 space-y-1.5">
          {profile.links.map((link) => (
            <motion.div
              key={link.label}
              variants={ITEM}
              className="flex h-[32px] items-center gap-2 rounded-[11px] border border-white/[0.06] bg-white/[0.03] px-2.5 text-ink-100"
            >
              <span className="grid size-[20px] shrink-0 place-items-center rounded-[6px] bg-white/[0.06] text-ink-50">
                <LinkIcon kind={link.kind} />
              </span>
              <span className="min-w-0 flex-1 truncate text-[10px] font-medium">{link.label}</span>
              <CaretRightIcon weight="bold" className="size-[10px] shrink-0 text-ink-200" />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[38px] bg-gradient-to-b from-transparent to-ink-900" />
      <span className="absolute bottom-[8px] left-1/2 h-[4px] w-[96px] -translate-x-1/2 rounded-full bg-ink-100/70" />
    </motion.div>
  );
});
