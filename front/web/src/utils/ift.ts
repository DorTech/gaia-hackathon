export const getIFTColor = (
  ift: number,
  refValue: number,
  medianValue: number,
): string => {
  if (ift <= refValue) return 'var(--green-d)';
  if (ift <= medianValue) return 'var(--teal)';
  return 'var(--orange)';
};

export const getGaugePct = (ift: number, maxGauge: number): number =>
  Math.min((ift / maxGauge) * 100, 100);
