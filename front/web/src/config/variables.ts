import type { ITKFormState } from '../store/diagnosticAtoms';
import type { PracticeProfileItem } from '../types/benchmark';

/**
 * Single source of truth for diagnostic / benchmark variables.
 * Matches the 7 features expected by the ML /predict endpoint.
 */

export interface SliderConfig {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
}

export interface ChipConfig {
  options: readonly string[];
}

export interface InputConfig {
  type: 'text' | 'number';
  placeholder?: string;
  min?: number;
  max?: number;
}

export interface VariableConfig {
  id: string;
  formKey: keyof ITKFormState;
  label: string;
  reference: string;
  dbVariable: string;
  type: 'Qualitatif' | 'Quantitatif';
  unit?: string;
  slider?: SliderConfig;
  chips?: ChipConfig;
  input?: InputConfig;
  benchmarkApi?: {
    type: 'frequency' | 'median';
    field: string;
    asBoolean?: boolean;
  };
}

export const DIAGNOSTIC_VARIABLES: VariableConfig[] = [
  {
    id: 'rotation-count',
    formKey: 'nbCulturesRotation',
    label: 'NB cultures rotation',
    reference: 'Réf : 4,8 cultures',
    dbVariable: 'nb_cultures_rotation',
    type: 'Quantitatif',
    unit: 'cultures',
    slider: { min: 1, max: 8, minLabel: '1 culture', maxLabel: '8+' },
    benchmarkApi: { type: 'median', field: 'nbCulturesRotation' },
  },
  {
    id: 'sequence-cultures',
    formKey: 'sequenceCultures',
    label: 'Séquence cultures',
    reference: 'Ex : Blé > Maïs > Colza',
    dbVariable: 'sequence_cultures',
    type: 'Qualitatif',
    input: { type: 'text', placeholder: 'Blé tendre > Maïs > Colza' },
  },
  {
    id: 'macroorganisms',
    formKey: 'recoursMacroorganismes',
    label: 'Recours macroorganismes',
    reference: 'Réf : Oui',
    dbVariable: 'recours_macroorganismes',
    type: 'Qualitatif',
    chips: { options: ['Non', 'Oui'] },
  },
  {
    id: 'weeding-passages',
    formKey: 'nbrePassagesDesherbageMeca',
    label: 'Passages désherbage méca.',
    reference: 'Réf : 2 à 3',
    dbVariable: 'nbre_de_passages_desherbage_meca',
    type: 'Quantitatif',
    unit: 'passages',
    slider: { min: 0, max: 6, minLabel: '0', maxLabel: '6' },
  },
  {
    id: 'soil-work',
    formKey: 'typeTravailDuSol',
    label: 'Travail du sol',
    reference: 'Réf : TCS',
    dbVariable: 'type_de_travail_du_sol',
    type: 'Qualitatif',
    chips: { options: ['Labour', 'TCS', 'Semis direct'] },
    benchmarkApi: { type: 'frequency', field: 'typeDeTravailDuSol' },
  },
  {
    id: 'departement',
    formKey: 'departement',
    label: 'Département',
    reference: 'Code INSEE',
    dbVariable: 'departement',
    type: 'Quantitatif',
    input: { type: 'number', placeholder: '31', min: 1, max: 976 },
  },
  {
    id: 'agriculture-type',
    formKey: 'sdcTypeAgriculture',
    label: "Type d'agriculture",
    reference: 'Réf : Conventionnelle',
    dbVariable: 'sdc_type_agriculture',
    type: 'Qualitatif',
    chips: { options: ['Conventionnelle', 'Biologique', 'Conversion bio'] },
  },
];

/** Build the PRACTICE_PROFILE_TEMPLATE from the centralized config */
export function buildPracticeProfileTemplate(): PracticeProfileItem[] {
  return DIAGNOSTIC_VARIABLES.map((v) => {
    const base = {
      id: v.id,
      name: v.label,
      variable: v.dbVariable,
      type: v.type,
    };

    if (v.type === 'Quantitatif') {
      return {
        ...base,
        mode: 'quanti' as const,
        quantitative: { value: '—', unit: v.unit ?? '', myValue: '—' },
      };
    }

    return { ...base, mode: 'quali' as const, frequencies: [] };
  });
}

/** Build the PRACTICE_API_MAP from the centralized config */
export function buildPracticeApiMap(): Record<
  string,
  { type: 'frequency'; field: string; asBoolean?: boolean } | { type: 'median'; field: string }
> {
  const map: Record<
    string,
    { type: 'frequency'; field: string; asBoolean?: boolean } | { type: 'median'; field: string }
  > = {};

  for (const v of DIAGNOSTIC_VARIABLES) {
    if (v.benchmarkApi) {
      map[v.id] = v.benchmarkApi;
    }
  }

  return map;
}
