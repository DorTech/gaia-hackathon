import { atom } from 'jotai';
import type { Lever, LeverOverrides } from '../pages/simulationComponents/types';
import { agricultureTypesAtom, itkFormAtom, CHIP_OPTIONS } from './diagnosticAtoms';
import type { ITKFormState } from './diagnosticAtoms';
import { benchmarkPracticeProfileAtom } from './benchmarkAtoms';

/**
 * Derived atom: builds lever definitions from the current ITK form state.
 * The "current" label for each lever reflects the user's actual form values.
 */
export const leversAtom = atom<Lever[]>((get) => {
  const form = get(itkFormAtom);
  const agriTypes = get(agricultureTypesAtom);
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
        max: 8,
        currentValue: form.nbCulturesRotation,
        unit: 'cultures',
        referenceValue: 5,
        referenceLabel: '5+ cultures ★',
        formKey: 'nbCulturesRotation',
      },
    },
    {
      id: 'seq',
      name: 'Séquence des cultures',
      type: 'Qualitatif',
      current: `${form.sequenceCultures} · actuel`,
      options: (profile.find(p => p.id === 'sequence-cultures')?.frequencies ?? [])
        .filter(f => f.label !== form.sequenceCultures)
        .map(f => ({
          label: f.label,
          formOverrides: { sequenceCultures: f.label },
        })),
    },
    {
      id: 'sol',
      name: 'Type de travail du sol',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.soilWork[form.typeTravailDuSol]} · actuel`,
      options: (profile.find(p => p.id === 'soil-work')?.frequencies ?? [])
        .filter(f => (CHIP_OPTIONS.soilWork as readonly string[]).indexOf(f.label) !== form.typeTravailDuSol)
        .map(f => ({
          label: f.label,
          formOverrides: { typeTravailDuSol: (CHIP_OPTIONS.soilWork as readonly string[]).indexOf(f.label) },
        })),
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
        referenceValue: 4,
        referenceLabel: '4+ passages ★',
        formKey: 'nbrePassagesDesherbageMeca',
      },
    },
    {
      id: 'macro',
      name: 'Recours aux macro-organismes',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.yesNo[form.recoursMacroorganismes]} · actuel`,
      options: (profile.find(p => p.id === 'macroorganisms')?.frequencies ?? [])
        .filter(f => f.label !== CHIP_OPTIONS.yesNo[form.recoursMacroorganismes])
        .map(f => ({
          label: f.label,
          formOverrides: { recoursMacroorganismes: (CHIP_OPTIONS.yesNo as readonly string[]).indexOf(f.label) },
        })),
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
        referenceValue: 50,
        referenceLabel: '≤ 50 kg/ha ★',
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
