import { atom } from 'jotai';
import type {
  BenchmarkFilterOptions,
  BenchmarkFarm,
  MedianKpi,
  PracticeProfileItem,
  BenchmarkFiltersState,
} from '../types/benchmark';
import { buildPracticeProfileTemplate } from '../config/variables';
import { agricultureTypesAtom, soilWorkTypesAtom, itkFormAtom, CHIP_API_VALUES } from './diagnosticAtoms';

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
  agricultureType: [],
});

export const benchmarkReferenceFarmsAtom = atom<BenchmarkFarm[]>([]);

/** Starts empty — populated by API calls in BenchmarkPage */
export const benchmarkMedianKpisAtom = atom<MedianKpi[]>([]);

/** Template derived from the centralized variable config */
export const PRACTICE_PROFILE_TEMPLATE: PracticeProfileItem[] = buildPracticeProfileTemplate();

/** Starts empty — populated by API calls in BenchmarkPage */
export const benchmarkPracticeProfileAtom = atom<PracticeProfileItem[]>([]);

export const benchmarkFiltersAtom = atom<BenchmarkFiltersState>({
  species: '',
  department: '',
  agricultureType: '',
});

/**
 * Derived atom: enriches practice profile with the user's actual ITK form values.
 * "myValue" for quantitative items and current choice for qualitative items
 * come from itkFormAtom so benchmark and diagnostic always stay in sync.
 */
export const enrichedPracticeProfileAtom = atom<PracticeProfileItem[]>((get) => {
  const profile = get(benchmarkPracticeProfileAtom);
  const form = get(itkFormAtom);
  const agriTypes = get(agricultureTypesAtom);
  const soilWorkTypes = get(soilWorkTypesAtom);

  return profile.map((item) => {
    switch (item.id) {
      // Quantitative — inject myValue from diagnostic form
      case 'rotation-count':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.nbCulturesRotation) }
            : item.quantitative,
        };
      case 'weeding-passages':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.nbrePassagesDesherbageMeca) }
            : item.quantitative,
        };
      case 'departement':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.departement) }
            : item.quantitative,
        };
      case 'fertilization':
        return {
          ...item,
          quantitative: item.quantitative
            ? { ...item.quantitative, myValue: String(form.fertiNTot) }
            : item.quantitative,
        };

      // Qualitative — attach user's current choice as a note
      case 'soil-work':
        return {
          ...item,
          note: { value: soilWorkTypes[form.typeTravailDuSol] ?? '—' },
        };
      case 'macroorganisms':
        return {
          ...item,
          note: { value: CHIP_API_VALUES.recoursMacroorganismes[form.recoursMacroorganismes] },
        };
      case 'agriculture-type':
        return {
          ...item,
          note: { value: agriTypes[form.sdcTypeAgriculture] ?? '—' },
        };
      case 'sequence-cultures':
        return {
          ...item,
          note: { value: form.sequenceCultures },
        };

      default:
        return item;
    }
  });
});
