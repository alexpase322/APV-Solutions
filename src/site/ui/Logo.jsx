import { Link } from 'react-router-dom';
import { cn } from '../lib/cn';

/** APV mark: navy rounded square with the gold bar chart. */
export function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 286 289" aria-hidden="true" className={cn('size-9', className)}>
      <g transform="translate(0,289) scale(0.1,-0.1)">
        <path
          fill="#263646"
          stroke="rgba(234,240,245,0.22)"
          strokeWidth="14"
          d="M313 1703 c3 -916 -1 -862 78 -1014 76 -147 206 -258 369 -314 l85 -30 823 -3 823 -3 -3 823 c-4 808 -4 824 -25 886 -25 74 -81 179 -126 234 -46 58 -145 133 -221 169 -141 66 -90 63 -989 66 l-818 4 4 -818z"
        />
        <path
          fill="#E4B34C"
          d="M950 1960 c19 -19 20 -33 20 -478 0 -343 3 -461 12 -470 9 -9 125 -12 459 -12 263 0 458 -4 473 -10 34 -13 44 -54 20 -81 -17 -19 -29 -19 -494 -17 l-477 3 -37 29 c-67 50 -66 44 -66 556 0 447 1 461 20 480 11 11 27 20 35 20 8 0 24 -9 35 -20z m544 -106 c14 -14 16 -58 14 -371 -3 -322 -5 -357 -20 -367 -11 -7 -26 -7 -45 0 l-28 9 -3 354 c-2 319 -1 356 14 373 21 22 47 23 68 2z m272 -218 c18 -13 19 -30 22 -243 2 -245 -2 -275 -47 -281 -12 -2 -31 4 -42 14 -18 16 -19 33 -19 252 0 205 2 238 17 254 19 22 42 23 69 4z m-546 -276 c17 -17 20 -33 20 -119 0 -108 -10 -131 -55 -131 -40 0 -55 35 -55 127 0 106 12 134 63 142 4 0 16 -8 27 -19z"
        />
      </g>
    </svg>
  );
}

/** Mark + wordmark linking home. `compact` shows only the mark. */
export function Logo({ className, compact = false, to = '/' }) {
  return (
    <Link to={to} aria-label="APV Business Solutions — home" className={cn('group inline-flex items-center gap-3 rounded-xl', className)}>
      <LogoMark className="size-9 transition-transform duration-500 ease-out-expo group-hover:-rotate-6 group-hover:scale-105" />
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[19px] font-semibold tracking-[-0.03em] text-ink-50">APV</span>
          <span className="mt-1 font-mono text-[8.5px] font-medium uppercase tracking-[0.24em] text-sage-300">Business Solutions</span>
        </span>
      )}
    </Link>
  );
}
