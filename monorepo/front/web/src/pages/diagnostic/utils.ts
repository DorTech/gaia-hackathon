export { getIFTColor, getGaugePct } from '../../utils/ift';

export const getPercentDiff = (value: number, reference: number): string =>
  (((value - reference) / reference) * 100).toFixed(1);
