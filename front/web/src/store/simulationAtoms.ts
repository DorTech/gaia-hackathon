import { atom } from 'jotai';
import type { Lever, LeverOverrides } from '../pages/simulationComponents/types';
import { agricultureTypesAtom, itkFormAtom, CHIP_OPTIONS } from './diagnosticAtoms';
import type { ITKFormState } from './diagnosticAtoms';


/**
 * Derived atom: builds lever definitions from the current ITK form state.
 * The "current" label for each lever reflects the user's actual form values.
 */
export const leversAtom = atom<Lever[]>((get) => {
  const form = get(itkFormAtom);
  const agriTypes = get(agricultureTypesAtom);

  const bioIndex = agriTypes.indexOf('Agriculture biologique');

  return [
    {
      id: 'rot',
      name: '🌾 NB Rotation',
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
      name: '🔄 Séquence cultures',
      type: 'Qualitatif',
      current: `${form.sequenceCultures} · actuel`,
      options: [
        { label: 'Rotation diversifiée (4+ familles)', formOverrides: { sequenceCultures: 'Rotation diversifiée (4+ familles)' } },
        { label: 'Rotation longue avec légumineuses', formOverrides: { sequenceCultures: 'Rotation longue avec légumineuses' }, isReference: true },
      ],
    },
    {
      id: 'sol',
      name: '🚜 Travail du sol',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.soilWork[form.typeTravailDuSol]} · actuel`,
      options: [
        { label: 'TCS', formOverrides: { typeTravailDuSol: 1 } },
        { label: 'Semis direct', formOverrides: { typeTravailDuSol: 2 }, isReference: true },
      ],
    },
    {
      id: 'desh',
      name: '⚙️ Désherbage mécanique',
      type: 'Qualitatif',
      current: `${form.nbrePassagesDesherbageMeca} passages · actuel`,
      options: [
        { label: 'Oui — partiel (2 pass.)', formOverrides: { nbrePassagesDesherbageMeca: 2 } },
        { label: 'Oui — complet (6 pass.)', formOverrides: { nbrePassagesDesherbageMeca: 6 }, isReference: true },
      ],
    },
    {
      id: 'macro',
      name: '🪱 Recours macroorganismes',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.yesNo[form.recoursMacroorganismes]} · actuel`,
      options: [
        { label: 'Oui', formOverrides: { recoursMacroorganismes: 1 }, isReference: true },
      ],
    },
    {
      id: 'ferti',
      name: '🧪 Fertilisation N totale',
      type: 'Quantitatif',
      current: `${form.fertiNTot} kg N/ha · actuel`,
      options: [],
      slider: {
        min: 0,
        max: 300,
        currentValue: form.fertiNTot,
        unit: 'kg N/ha',
        referenceValue: 50,
        referenceLabel: '≤ 50 kg N/ha ★',
        formKey: 'fertiNTot',
      },
    },
    {
      id: 'agri',
      name: '🌱 Type d\'agriculture',
      type: 'Qualitatif',
      current: `${agriTypes[form.sdcTypeAgriculture] ?? '—'} · actuel`,
      options: [
        {
          label: 'Agriculture biologique',
          formOverrides: { sdcTypeAgriculture: bioIndex >= 0 ? bioIndex : 0 },
          isReference: true,
        },
      ],
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
