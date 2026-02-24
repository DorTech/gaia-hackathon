import type { ITKFormState } from '../store/diagnosticAtoms';
import type { PracticeProfileItem } from '../types/benchmark';
import { DEPT_NAMES } from './departments';

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

export interface SelectConfig {
  options: Record<string, string>;
  placeholder?: string;
}

export interface VariableConfig {
  id: string;
  formKey: keyof ITKFormState;
  label: string;
  dbVariable: string;
  type: 'Qualitatif' | 'Quantitatif';
  unit?: string;
  slider?: SliderConfig;
  chips?: ChipConfig;
  input?: InputConfig;
  select?: SelectConfig;
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
    dbVariable: 'nb_cultures_rotation',
    type: 'Quantitatif',
    unit: 'cultures',
    slider: { min: 1, max: 8, minLabel: '1 culture', maxLabel: '8+' },
    benchmarkApi: { type: 'median', field: 'nbRotation' },
  },
  {
    id: 'sequence-cultures',
    formKey: 'sequenceCultures',
    label: 'Séquence cultures',
    dbVariable: 'sequence_cultures',
    type: 'Qualitatif',
    input: { type: 'text', placeholder: 'Blé tendre > Maïs > Colza' },
    benchmarkApi: { type: 'frequency', field: 'sequenceCultures' },
  },
  {
    id: 'macroorganisms',
    formKey: 'recoursMacroorganismes',
    label: 'Recours macroorganismes',
    dbVariable: 'recours_macroorganismes',
    type: 'Qualitatif',
    chips: { options: ['Non', 'Oui'] },
    benchmarkApi: { type: 'frequency', field: 'macroorganismes', asBoolean: true },
  },
  {
    id: 'weeding-passages',
    formKey: 'nbrePassagesDesherbageMeca',
    label: 'Passages désherbage méca.',
    dbVariable: 'nbre_de_passages_desherbage_meca',
    type: 'Quantitatif',
    unit: 'passages',
    slider: { min: 0, max: 6, minLabel: '0', maxLabel: '6' },
    benchmarkApi: { type: 'median', field: 'nbWeedingPasses' },
  },
  {
    id: 'soil-work',
    formKey: 'typeTravailDuSol',
    label: 'Travail du sol',
    dbVariable: 'type_de_travail_du_sol',
    type: 'Qualitatif',
    chips: { options: ['Labour', 'TCS', 'Semis direct'] },
    benchmarkApi: { type: 'frequency', field: 'soilWork' },
  },
  {
    id: 'departement',
    formKey: 'departement',
    label: 'Département',
    dbVariable: 'departement',
    type: 'Quantitatif',
    select: { options: DEPT_NAMES, placeholder: 'Choisir un département' },
  },
  {
    id: 'fertilization',
    formKey: 'fertiNTot',
    label: 'Fertilisation N totale',
    dbVariable: 'ferti_n_tot',
    type: 'Quantitatif',
    unit: 'kg N/ha',
    slider: { min: 0, max: 300, minLabel: '0', maxLabel: '300' },
    benchmarkApi: { type: 'median', field: 'fertilisation' },
  },
  {
    id: 'agriculture-type',
    formKey: 'sdcTypeAgriculture',
    label: "Type d'agriculture",
    dbVariable: 'sdc_type_agriculture',
    type: 'Qualitatif',
    chips: { options: ['Conventionnelle', 'Biologique', 'Conversion bio'] },
    benchmarkApi: { type: 'frequency', field: 'agricultureType' },
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
