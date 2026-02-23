import { atom } from 'jotai';

export interface ITKFormState {
  rotation: number;
  coverCrops: number;
  soilType: number;
  mechanicalWeeding: number;
  weededPassages: number;
  chemiIFT: number;
  biocontrolIFT: number;
  resistantVariety: number;
  biocontrolUse: number;
  nitrogenTotal: number;
  phosphate: number;
  potassium: number;
  grossMargin: number;
  workTime: number;
  uth: number;
  fuel: number;
  water: number;
}

export const ITK_FORM_DEFAULTS: ITKFormState = {
  rotation: 3,
  coverCrops: 1,
  soilType: 0,
  mechanicalWeeding: 0,
  weededPassages: 0,
  chemiIFT: 2.40,
  biocontrolIFT: 0.05,
  resistantVariety: 2,
  biocontrolUse: 0,
  nitrogenTotal: 185,
  phosphate: 60,
  potassium: 70,
  grossMargin: 1292,
  workTime: 19.9,
  uth: 2.0,
  fuel: 94,
  water: 0,
};

export const itkFormAtom = atom<ITKFormState>(ITK_FORM_DEFAULTS);

/**
 * Derived atom: predicted IFT computed from the form.
 * Recalculates automatically when itkFormAtom changes.
 */
export const predictedIFTAtom = atom<number>((get) => {
  const form = get(itkFormAtom);
  let ift = 0.85;
  ift += Math.max(0, (3 - form.rotation) * 0.075);
  ift += [0.22, 0.10, 0][form.soilType] ?? 0.22;
  ift -= Math.min(form.weededPassages, 4) * 0.07;
  ift -= [0, 0.15, 0.30][form.mechanicalWeeding] ?? 0;
  ift += form.chemiIFT;
  ift += form.biocontrolIFT;
  ift += form.resistantVariety * 0.10;
  ift -= [0, 0.12, 0.26][form.biocontrolUse] ?? 0;
  // 142 is an RF model coefficient for nitrogen reference
  ift += Math.max(0, (form.nitrogenTotal - 142) * 0.0035);
  return Math.max(0.15, Math.round(ift * 100) / 100);
});

export const CHIP_OPTIONS = {
  coverCrops: ['Absent', 'Partiel', 'Systématique'] as const,
  soilType: ['Labour', 'TCS', 'Semis direct'] as const,
  mechanicalWeeding: ['Non', 'Oui — partiel', 'Oui — complet'] as const,
  resistantVariety: ['Très résistante', 'Résistance partielle', 'Standard'] as const,
  biocontrolUse: ['Aucun', 'Partiel', 'Systématique'] as const,
} as const;

export const FIELD_REFERENCES: Record<string, string> = {
  rotation: 'Réf : 4,8 cultures',
  coverCrops: 'Réf : Systématique',
  soilType: 'Réf : SD (59%)',
  mechanicalWeeding: 'Réf : Oui (82%)',
  weededPassages: 'Réf : 3,2',
  biocontrolIFT: 'Réf : 0,35',
  resistantVariety: 'Réf : Très résistante',
  biocontrolUse: 'Réf : Oui (68%)',
  nitrogenTotal: 'Réf : 142',
  grossMargin: 'Réf : 1 240',
  workTime: 'Réf : 18,4',
  fuel: 'Réf : 68',
};
