/** Portrait render sizes. Data exists only for these three, so widths snap to a bucket. */
export type AsciiSize = 400 | 280 | 220;

export function calculateSize(width: number): AsciiSize {
  if (width <= 480) return 220;
  if (width <= 768) return 280;
  return 400;
}
