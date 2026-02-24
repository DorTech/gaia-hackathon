import { atom } from 'jotai';
import type { DiagnosticVariables } from '../api/rotation';

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
  typeTravailDuSol: 2,
  departement: 31,
  sdcTypeAgriculture: 0,
  fertiNTot: 150,
};

export const itkFormAtom = atom<ITKFormState>(ITK_FORM_DEFAULTS);

/** Tracks which form keys were prefilled by the LLM (vs default/placeholder) */
export const prefilledKeysAtom = atom<Set<keyof ITKFormState>>(new Set<keyof ITKFormState>());

/**
 * Maps LLM-extracted diagnostic variables to ITKFormState partial updates.
 * Returns the partial form state and the set of keys that were filled.
 */
export function mapDiagnosticVariablesToForm(
  vars: DiagnosticVariables,
  agricultureTypes: string[],
): { partial: Partial<ITKFormState>; filledKeys: Set<keyof ITKFormState> } {
  const partial: Partial<ITKFormState> = {};
  const filledKeys = new Set<keyof ITKFormState>();

  if (vars.departement != null) {
    partial.departement = vars.departement;
    filledKeys.add('departement');
  }

  if (vars.sdc_type_agriculture != null && agricultureTypes.length > 0) {
    const idx = agricultureTypes.findIndex(
      (t) => t.toLowerCase() === vars.sdc_type_agriculture!.toLowerCase(),
    );
    if (idx >= 0) {
      partial.sdcTypeAgriculture = idx;
      filledKeys.add('sdcTypeAgriculture');
    }
  }

  if (vars.nb_cultures_rotation != null) {
    partial.nbCulturesRotation = vars.nb_cultures_rotation;
    filledKeys.add('nbCulturesRotation');
  }

  if (vars.sequence_cultures != null) {
    partial.sequenceCultures = vars.sequence_cultures;
    filledKeys.add('sequenceCultures');
  }

  if (vars.recours_macroorganismes != null) {
    const chipMap: Record<string, number> = { Non: 0, Oui: 1 };
    const val = chipMap[vars.recours_macroorganismes];
    if (val !== undefined) {
      partial.recoursMacroorganismes = val;
      filledKeys.add('recoursMacroorganismes');
    }
  }

  if (vars.nbre_de_passages_desherbage_meca != null) {
    partial.nbrePassagesDesherbageMeca = vars.nbre_de_passages_desherbage_meca;
    filledKeys.add('nbrePassagesDesherbageMeca');
  }

  if (vars.type_de_travail_du_sol != null) {
    const soilMap: Record<string, number> = {
      Aucun: 0,
      Labour: 1,
      TCS: 2,
      'Semis direct': 3,
    };
    const val = soilMap[vars.type_de_travail_du_sol];
    if (val !== undefined) {
      partial.typeTravailDuSol = val;
      filledKeys.add('typeTravailDuSol');
    }
  }

  if (vars.ferti_n_tot != null) {
    partial.fertiNTot = vars.ferti_n_tot;
    filledKeys.add('fertiNTot');
  }

  return { partial, filledKeys };
}

/** Writable atom updated by API calls to /predict */
export const predictedIFTAtom = atom<number>(2.5);

/** Loading state for the prediction API */
export const predictingAtom = atom<boolean>(false);

export const CHIP_OPTIONS = {
  soilWork: ['Aucun', 'Labour', 'TCS', 'Semis direct'] as const,
  yesNo: ['Non', 'Oui'] as const,
} as const;

/** API string values for chip indices */
export const CHIP_API_VALUES = {
  typeTravailDuSol: ['Aucun', 'Labour', 'TCS', 'Semis direct'] as const,
  recoursMacroorganismes: ['Non', 'Oui'] as const,
} as const;

/** Agriculture types fetched from backend — writable atom populated on app load */
export const agricultureTypesAtom = atom<string[]>([]);

/** Prompt used to generate itinerary, kept across route changes */
export const itinerairePromptAtom = atom<string>('');

/** Last generated itinerary payload, kept across route changes */
export const itineraireRotationDataAtom = atom<RotationDataState>(null);
