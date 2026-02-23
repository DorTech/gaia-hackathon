import { atom } from 'jotai';
import type {
  BenchmarkFilterOptions,
  BenchmarkFarm,
  MedianKpi,
  PracticeProfileItem,
  BenchmarkFiltersState,
} from '../types/benchmark';
import { itkFormAtom, CHIP_OPTIONS } from './diagnosticAtoms';

export const benchmarkLoadingAtom = atom<boolean>(false);

/** Raw species list from the backend (may contain comma-separated values) */
export const rawSpeciesListAtom = atom<string[]>([]);

/** Flattened species list — splits comma-separated values and removes duplicates */
export const flattenedSpeciesListAtom = atom<string[]>((get) => {
  const rawSpecies = get(rawSpeciesListAtom);
  const speciesSet = new Set<string>();

  rawSpecies.forEach((item) => {
    // Split by comma and trim each value
    const parts = item.split(',').map((s) => s.trim());
    parts.forEach((part) => {
      if (part && part.length > 0) {
        speciesSet.add(part);
      }
    });
  });

  // Return sorted array for consistent display
  return Array.from(speciesSet).sort();
});

export const benchmarkFilterOptionsAtom = atom<BenchmarkFilterOptions>({
  species: [],
  department: [],
  agricultureType: ['JE VIENS PAS DU BACK', 'Tous (Bio + Conv.)', 'Conventionnel seul', 'Biologique seul'],
  iftThreshold: ['−20% vs médiane', '−30% vs médiane', '−40% vs médiane'],
});

export const benchmarkReferenceFarmsAtom = atom<BenchmarkFarm[]>([
  { rank: 1, name: 'GAEC Kervran', type: 'Bio · 89 ha · SD', ift: 0.82, gap: '−64%' },
  { rank: 2, name: 'EARL Tanguy', type: 'Conv. · 124 ha', ift: 0.98, gap: '−57%' },
  { rank: 3, name: 'SAS Morvan', type: 'Conv. · 67 ha · TCS', ift: 1.10, gap: '−52%' },
  { rank: 4, name: 'SCEA Le Goff', type: 'Conv. · 210 ha', ift: 1.22, gap: '−47%' },
  { rank: 5, name: 'GAEC Quéfélec', type: 'Bio · 155 ha · SD', ift: 1.28, gap: '−44%' },
  { rank: 6, name: 'EARL Jouan', type: 'Conv. · 98 ha', ift: 1.35, gap: '−41%' },
  { rank: 7, name: 'SAS Penglaou', type: 'Conv. · 78 ha', ift: 1.41, gap: '−39%' },
  { rank: 8, name: 'EARL Beaudouin', type: 'Conv. · 190 ha', ift: 1.48, gap: '−36%' },
]);

export const benchmarkMedianKpisAtom = atom<MedianKpi[]>([
  {
    id: 'ift',
    label: '📉 Médiane IFT total',
    value: '2,30',
    unit: 'IFT',
    variant: 'violet',
    sub: '312 exploitations · Blé tendre',
    delta: '↑ +21,7% vs votre exploitation (2,80)',
    deltaClass: 'warn',
  },
]);

/** Fixed template — structure never changes, API fills in frequencies/values */
export const PRACTICE_PROFILE_TEMPLATE: PracticeProfileItem[] = [
  {
    id: 'soil-work',
    name: 'Travail du sol',
    variable: 'type_de_travail_du_sol',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [],
  },
  {
    id: 'mechanical-weeding',
    name: 'Désherbage mécanique',
    variable: 'utili_desherbage_meca',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [],
  },
  {
    id: 'rotation-count',
    name: 'NB Rotation',
    variable: 'nb_rotation',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: { value: '—', unit: 'cultures', myValue: '—' },
  },
  {
    id: 'biocontrol',
    name: 'Recours Biocontrôle',
    variable: 'recours_biocontrole',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [],
  },
  {
    id: 'nitrogen',
    name: 'Fertilisation N',
    variable: 'ferti_n_tot',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: { value: '—', unit: 'kgN/ha', myValue: '—' },
  },
  {
    id: 'resistant-variety',
    name: 'Variété résistante',
    variable: 'variete_resistante',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [],
  },
  {
    id: 'winter-cover',
    name: 'Couverts hivernaux',
    variable: 'couvert_hivernaux',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [],
  },
  {
    id: 'fuel-consumption',
    name: 'Consommation carburant',
    variable: 'conso_carburant',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: { value: '—', unit: 'L/ha', myValue: '—' },
  },
];

export const benchmarkPracticeProfileAtom = atom<PracticeProfileItem[]>([
  {
    id: 'soil-work',
    name: 'Travail du sol',
    variable: 'type_de_travail_du_sol',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Semis direct', pct: 59, top: true },
      { label: 'TCS', pct: 32 },
      { label: 'Labour', pct: 9 },
    ],
  },
  {
    id: 'mechanical-weeding',
    name: 'Désherbage mécanique',
    variable: 'utili_desherbage_meca',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Oui — systématique', pct: 82, top: true },
      { label: 'Non', pct: 18 },
    ],
  },
  {
    id: 'rotation-count',
    name: 'NB Rotation',
    variable: 'nb_rotation',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '4,8',
      unit: 'cultures',
      myValue: '3',
    },
  },
  {
    id: 'biocontrol',
    name: 'Recours Biocontrôle',
    variable: 'recours_biocontrole',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Oui — complet', pct: 68, top: true },
      { label: 'Partiel', pct: 27 },
      { label: 'Aucun', pct: 5 },
    ],
  },
  {
    id: 'nitrogen',
    name: 'Fertilisation N',
    variable: 'ferti_n_tot',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '142',
      unit: 'kgN/ha',
      myValue: '185',
    },
  },
  {
    id: 'resistant-variety',
    name: 'Variété résistante',
    variable: 'variete_resistante',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Très résistante', pct: 73, top: true },
      { label: 'Résistance partielle', pct: 18 },
      { label: 'Standard', pct: 9 },
    ],
  },
  {
    id: 'winter-cover',
    name: 'Couverts hivernaux',
    variable: 'couvert_hivernaux',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Systématique', pct: 86, top: true },
      { label: 'Partiel', pct: 11 },
      { label: 'Absent', pct: 3 },
    ],
  },
  {
    id: 'fuel-consumption',
    name: 'Consommation carburant',
    variable: 'conso_carburant',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '68',
      unit: 'L/ha',
      myValue: '92',
    },
  },
]);

export const benchmarkFiltersAtom = atom<BenchmarkFiltersState>({
  species: '',
  department: '',
  agricultureType: '',
  iftThreshold: '',
});

/**
 * Derived atom: enriches practice profile with the user's actual ITK form values.
 * "myValue" for quantitative items and current choice for qualitative items
 * come from itkFormAtom so benchmark and diagnostic always stay in sync.
 */
export const enrichedPracticeProfileAtom = atom<PracticeProfileItem[]>((get) => {
  const profile = get(benchmarkPracticeProfileAtom);
  const form = get(itkFormAtom);

  return profile.map((item) => {
    switch (item.id) {
      // Quantitative — inject myValue from diagnostic form
      case 'rotation-count':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.rotation) }
            : item.quantitative,
        };
      case 'nitrogen':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.fertilization) }
            : item.quantitative,
        };

      // Qualitative — attach user's current choice as a note
      case 'soil-work':
        return {
          ...item,
          note: { label: 'Mon choix :', value: CHIP_OPTIONS.soilWork[form.soilWork] },
        };
      case 'mechanical-weeding':
        return {
          ...item,
          note: { label: 'Mon choix :', value: form.hasWeeding === 1 ? 'Oui' : 'Non' },
        };
      case 'biocontrol':
        return {
          ...item,
          note: { label: 'Mon choix :', value: form.biologicalControl === 1 ? 'Oui' : 'Non' },
        };

      default:
        return item;
    }
  });
});
