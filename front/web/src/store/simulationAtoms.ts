import { atom } from 'jotai';
import type { Lever, LeverOverrides } from '../pages/simulationComponents/types';
import { agricultureTypesAtom, soilWorkTypesAtom, itkFormAtom, CHIP_API_VALUES } from './diagnosticAtoms';
import type { ITKFormState } from './diagnosticAtoms';
import { benchmarkPracticeProfileAtom } from './benchmarkAtoms';

/**
 * Derived atom: builds lever definitions from the current ITK form state.
 * The "current" label for each lever reflects the user's actual form values.
 */
export const leversAtom = atom<Lever[]>((get) => {
  const form = get(itkFormAtom);
  const agriTypes = get(agricultureTypesAtom);
  const soilWorkTypes = get(soilWorkTypesAtom);
  const profile = get(benchmarkPracticeProfileAtom);

  // Build agriculture type options from dynamic atom, excluding the current selection
  const agriOptions = agriTypes
    .map((label, idx) => ({ label, idx }))
    .filter(({ idx }) => idx !== form.sdcTypeAgriculture)
    .map(({ label, idx }) => ({
      label,
      formOverrides: { sdcTypeAgriculture: idx } as Partial<ITKFormState>,
      isReference: label === 'Agriculture biologique',
    }));

  return [
    {
      id: 'rot',
      name: 'Nombre de cultures en rotation',
      type: 'Quantitatif',
      current: `${form.nbCulturesRotation} cultures · actuel`,
      options: [],
      slider: {
        min: 1,
        max: 10,
        currentValue: form.nbCulturesRotation,
        unit: 'cultures',
        referenceValue: parseFloat((profile.find(p => p.id === 'rotation-count')?.quantitative?.value ?? '0').replace(',', '.')),
        referenceLabel: `${(profile.find(p => p.id === 'rotation-count')?.quantitative?.value ?? '0')} cultures ★`,
        formKey: 'nbCulturesRotation',
      },
    },
    {
      id: 'seq',
      name: 'Séquence des cultures',
      type: 'Qualitatif',
      current: `${form.sequenceCultures} · actuel`,
      options: (() => {
        const freqs = (profile.find(p => p.id === 'sequence-cultures')?.frequencies ?? [])
          .filter(f => f.label !== form.sequenceCultures);
        const refLabel = freqs.filter(f => f.label !== 'Autres').sort((a, b) => b.pct - a.pct)[0]?.label;
        return freqs.map(f => ({
          label: f.label,
          formOverrides: { sequenceCultures: f.label, nbCulturesRotation: f.label.split(/\s*>\s*/).length },
          isReference: f.label === refLabel,
        }));
      })(),
    },
    {
      id: 'sol',
      name: 'Type de travail du sol',
      type: 'Qualitatif',
      current: `${soilWorkTypes[form.typeTravailDuSol] ?? '—'} · actuel`,
      options: (() => {
        const freqs = profile.find(p => p.id === 'soil-work')?.frequencies ?? [];
        const refRaw = freqs.filter(f => f.label !== 'Autres').sort((a, b) => b.pct - a.pct)[0]?.label;
        const refNorm = refRaw?.replace(/_/g, ' ').toLowerCase();
        return soilWorkTypes
          .filter((_, idx) => idx !== form.typeTravailDuSol)
          .map(label => ({
            label,
            formOverrides: { typeTravailDuSol: soilWorkTypes.indexOf(label) },
            isReference: label.toLowerCase() === refNorm,
          }));
      })(),
    },
    {
      id: 'desh',
      name: 'Nombre de passages de désherbage mécanique',
      type: 'Quantitatif',
      current: `${form.nbrePassagesDesherbageMeca} passages · actuel`,
      options: [],
      slider: {
        min: 0,
        max: 6,
        currentValue: form.nbrePassagesDesherbageMeca,
        unit: 'passages',
        referenceValue: parseFloat((profile.find(p => p.id === 'weeding-passages')?.quantitative?.value ?? '0').replace(',', '.')),
        referenceLabel: `${(profile.find(p => p.id === 'weeding-passages')?.quantitative?.value ?? '0')} passages ★`,
        formKey: 'nbrePassagesDesherbageMeca',
      },
    },
    {
      id: 'macro',
      name: 'Recours aux macro-organismes',
      type: 'Qualitatif',
      current: `${CHIP_API_VALUES.recoursMacroorganismes[form.recoursMacroorganismes]} · actuel`,
      options: (() => {
        const freqs = profile.find(p => p.id === 'macroorganisms')?.frequencies ?? [];
        const refLabel = freqs.filter(f => f.label !== 'Autres').sort((a, b) => b.pct - a.pct)[0]?.label;
        return ([...CHIP_API_VALUES.recoursMacroorganismes] as string[])
          .map((label, idx) => ({ label, idx }))
          .filter(({ idx }) => idx !== form.recoursMacroorganismes)
          .map(({ label, idx }) => ({
            label,
            formOverrides: { recoursMacroorganismes: idx } as Partial<ITKFormState>,
            isReference: label === refLabel,
          }));
      })(),
    },
    {
      id: 'ferti',
      name: 'Fertilisation azotée totale',
      type: 'Quantitatif',
      current: `${form.fertiNTot} kg/ha · actuel`,
      options: [],
      slider: {
        min: 0,
        max: 300,
        currentValue: form.fertiNTot,
        unit: 'kg/ha',
        referenceValue: parseFloat((profile.find(p => p.id === 'fertilization')?.quantitative?.value ?? '0').replace(',', '.')),
        referenceLabel: `${(profile.find(p => p.id === 'fertilization')?.quantitative?.value ?? '0')} kg/ha ★`,
        formKey: 'fertiNTot',
      },
    },
    {
      id: 'agri',
      name: "Type d'agriculture",
      type: 'Qualitatif',
      current: `${agriTypes[form.sdcTypeAgriculture] ?? '—'} · actuel`,
      options: agriOptions,
    },
  ];
});

export const leverOverridesAtom = atom<LeverOverrides>({});

/**
 * Derived atom: merges the diagnostic form with all lever overrides
 * to produce the simulated form that gets sent to /ml/predict.
 */
export const simulatedFormAtom = atom<ITKFormState>((get) => {
  const baseForm = get(itkFormAtom);
  const overrides = get(leverOverridesAtom);
  const merged = { ...baseForm };
  for (const override of Object.values(overrides)) {
    Object.assign(merged, override);
  }
  return merged;
});

/**
 * Writable atom: simulated IFT updated by API response.
 */
export const simulatedIFTAtom = atom<number>(0);

/** Loading state for the simulation prediction */
export const simulatingAtom = atom<boolean>(false);
