import { atom } from 'jotai';

export interface ITKFormState {
  rotation: number;
  fertilization: number;
  soilWork: number;
  hasWeeding: number;
  weedingPassages: number;
  uth: number;
  biologicalControl: number;
  macroorganisms: number;
}

export const ITK_FORM_DEFAULTS: ITKFormState = {
  rotation: 3,
  fertilization: 160,
  soilWork: 1,
  hasWeeding: 0,
  weedingPassages: 2,
  uth: 2,
  biologicalControl: 0,
  macroorganisms: 0,
};

export const itkFormAtom = atom<ITKFormState>(ITK_FORM_DEFAULTS);

/**
 * Derived atom: predicted IFT computed from the form.
 * Recalculates automatically when itkFormAtom changes.
 */
export const predictedIFTAtom = atom<number>((get) => {
  const form = get(itkFormAtom);
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
});

export const CHIP_OPTIONS = {
  soilWork: ['Labour', 'TCS', 'Semis direct'] as const,
  yesNo: ['Non', 'Oui'] as const,
} as const;

export const FIELD_REFERENCES: Record<string, string> = {
  rotation: 'Réf : 4,8 cultures',
  fertilization: 'Réf : 140 kg/ha',
  soilWork: 'Réf : TCS',
  hasWeeding: 'Réf : Oui',
  weedingPassages: 'Réf : 2 à 3',
  uth: 'Réf : 2',
  biologicalControl: 'Réf : Oui',
  macroorganisms: 'Réf : Oui',
};
