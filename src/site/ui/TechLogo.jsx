import { cn } from '../lib/cn';
import { BRAND_ICONS } from '../lib/brandIcons';

/** Brand mark from BRAND_ICONS, or the name's initials when there is none. */
export function BrandIcon({ slug, name, className, brandColor = false }) {
  const icon = slug ? BRAND_ICONS[slug] : undefined;
  if (!icon) {
    const initials = name
      .replace(/[^A-Za-z0-9 ]/g, '')
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return (
      <span
        aria-hidden="true"
        className={cn('grid size-6 place-items-center rounded-md border border-current/30 font-mono text-[9px] font-semibold leading-none', className)}
      >
        {initials}
      </span>
    );
  }
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" className={cn('size-6', className)} fill={brandColor ? `#${icon.hex}` : 'currentColor'}>
      <path d={icon.path} />
    </svg>
  );
}

const CHIP_SIZES = {
  sm: 'h-9 gap-2 px-3 text-[13px] [&_svg]:size-4 [&>span:first-child]:size-4',
  md: 'h-12 gap-3 px-5 text-[15px] [&_svg]:size-5',
  lg: 'h-16 gap-3.5 px-6 text-lg [&_svg]:size-6',
};

/** Rounded chip with a technology's logo and name. `tech` is an entry of CORE_TECH / ALL_TECH. */
export function TechChip({ tech, className, size = 'md' }) {
  return (
    <span
      className={cn(
        'group/chip inline-flex shrink-0 items-center rounded-2xl border border-white/[0.07] bg-white/[0.025] font-medium tracking-tight text-ink-200 transition-colors duration-300 hover:border-sage-300/30 hover:text-ink-50',
        CHIP_SIZES[size],
        className,
      )}
    >
      <BrandIcon slug={tech.logo} name={tech.name} className="transition-colors" />
      <span>{tech.name}</span>
    </span>
  );
}
