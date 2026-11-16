/**
 * SVG path through the step markers' centres, plus where each marker sits along it (0–1).
 * In a row (desktop) the segments are gentle S-curves that alternate up and down; stacked
 * (mobile) they are straight lines.
 */
export function buildProcessPath(points, width, height) {
  if (points.length < 2) return { w: width, h: height, d: '', stops: points.map(() => 0) };

  const first = points[0];
  const last = points[points.length - 1];
  const horizontal = Math.abs(last.x - first.x) > Math.abs(last.y - first.y);

  let d = `M${first.x.toFixed(1)},${first.y.toFixed(1)}`;
  const lengths = [0];
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1];
    const to = points[i];
    if (horizontal) {
      const dx = to.x - from.x;
      const bend = (i % 2 === 1 ? -1 : 1) * Math.min(34, dx * 0.12);
      d += ` C${(from.x + dx * 0.4).toFixed(1)},${(from.y + bend).toFixed(1)} ${(to.x - dx * 0.4).toFixed(1)},${(to.y + bend).toFixed(1)} ${to.x.toFixed(1)},${to.y.toFixed(1)}`;
      // rough arc length: the chord plus a little for the bend
      lengths.push(lengths[i - 1] + Math.hypot(dx, to.y - from.y) + Math.abs(bend) * 0.5);
    } else {
      d += ` L${to.x.toFixed(1)},${to.y.toFixed(1)}`;
      lengths.push(lengths[i - 1] + Math.hypot(to.x - from.x, to.y - from.y));
    }
  }

  const total = lengths[lengths.length - 1] || 1;
  return { w: width, h: height, d, stops: lengths.map((length) => length / total) };
}
