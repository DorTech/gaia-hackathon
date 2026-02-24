import { atom } from 'jotai';

export interface ITKFormState {
  nbCulturesRotation: number;
  sequenceCultures: string;
  recoursMacroorganismes: number;
  nbrePassagesDesherbageMeca: number;
  typeTravailDuSol: number;
  departement: number;
  sdcTypeAgriculture: number;
  fertiNTot: number;
}

export type RotationDataState = Record<string, unknown> | null;

export const ITK_FORM_DEFAULTS: ITKFormState = {
  nbCulturesRotation: 3,
  sequenceCultures: 'Blé tendre > Maïs > Colza',
  recoursMacroorganismes: 0,
  nbrePassagesDesherbageMeca: 2,
  typeTravailDuSol: 1,
  departement: 31,
  sdcTypeAgriculture: 0,
  fertiNTot: 150,
};

export const itkFormAtom = atom<ITKFormState>(ITK_FORM_DEFAULTS);

/** Writable atom updated by API calls to /predict */
export const predictedIFTAtom = atom<number>(2.5);

/** Loading state for the prediction API */
export const predictingAtom = atom<boolean>(false);

export const CHIP_OPTIONS = {
  soilWork: ['Labour', 'TCS', 'Semis direct'] as const,
  yesNo: ['Non', 'Oui'] as const,
} as const;

/** API string values for chip indices */
export const CHIP_API_VALUES = {
  typeTravailDuSol: ['Labour', 'TCS', 'Semis direct'] as const,
  recoursMacroorganismes: ['Non', 'Oui'] as const,
} as const;

/** Agriculture types fetched from backend — writable atom populated on app load */
export const agricultureTypesAtom = atom<string[]>([]);

/** Prompt used to generate itinerary, kept across route changes */
export const itinerairePromptAtom = atom<string>('');

/** Last generated itinerary payload, kept across route changes */
export const itineraireRotationDataAtom = atom<RotationDataState>(null);
