import type { ITKFormState } from './types';

export const INITIAL_ITK_FORM: ITKFormState = {
  rotation: 3,
  fertilization: 160,
  soilWork: 1,
  hasWeeding: 0,
  weedingPassages: 2,
  uth: 2,
  biologicalControl: 0,
  macroorganisms: 0,
};

export const CHIP_OPTIONS = {
  soilWork: ['Labour', 'TCS', 'Semis direct'],
  yesNo: ['Non', 'Oui'],
};
