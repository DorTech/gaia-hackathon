export const getIFTColor = (
  ift: number,
  medianValue: number,
): string => {
  if (ift <= medianValue) return 'var(--teal)';
  return 'var(--orange)';
};

export const getGaugePct = (ift: number, maxGauge: number): number =>
  Math.min((ift / maxGauge) * 100, 100);
