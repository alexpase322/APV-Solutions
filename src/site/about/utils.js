/** `value` as a percentage of `total` (2 decimals), for placing HTML over an SVG viewBox. */
export const pct = (value, total) => `${Math.round((value / total) * 10000) / 100}%`;
