import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// text-[clamp(...)] arbitrary sizes must not be dropped as conflicting with text-* colors
const twMerge = extendTailwindMerge({
  override: { conflictingClassGroups: { 'font-size': [] } },
});

/** Joins class names and resolves Tailwind conflicts (last one wins). */
export const cn = (...inputs) => twMerge(clsx(inputs));
