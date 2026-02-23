import type { ITKFormState } from './types';

export const calculatePredictedIFT = (form: ITKFormState): number => {
  let ift = 2.6;
  ift -= Math.max(0, form.rotation - 1) * 0.08;
  ift += [0.18, 0.08, 0][form.soilWork] ?? 0.18;
  ift += Math.max(0, (form.fertilization - 140) * 0.003);
  ift -= Math.max(0, (140 - form.fertilization) * 0.001);
  if (form.hasWeeding === 1) {
    ift -= Math.min(form.weedingPassages, 6) * 0.09;
  }
  if (form.biologicalControl === 1) {
    ift -= 0.18;
  }
  if (form.macroorganisms === 1) {
    ift -= 0.15;
  }
  ift -= Math.min(form.uth, 4) * 0.03;
  return Math.max(0.15, Math.round(ift * 100) / 100);
};

export const getIFTColor = (ift: number): string => {
  if (ift <= 1.61) return 'var(--green-d)';
  if (ift <= 2.3) return 'var(--teal)';
  return 'var(--orange)';
};

export const getGaugePct = (ift: number): number => Math.min((ift / 4) * 100, 100);

export const getPercentDiff = (value: number, reference: number): string =>
  (((value - reference) / reference) * 100).toFixed(1);
