import { atom } from 'jotai';
import type { Lever, LeverDeltas } from '../pages/simulationComponents/types';
import { itkFormAtom, predictedIFTAtom, CHIP_OPTIONS } from './diagnosticAtoms';


/**
 * Derived atom: builds lever definitions from the current ITK form state.
 * The "current" label for each lever reflects the user's actual form values.
 */
export const leversAtom = atom<Lever[]>((get) => {
  const form = get(itkFormAtom);

  return [
    {
      id: 'rot',
      name: '🌾 NB Rotation',
      type: 'Quantitatif',
      current: `${form.nbCulturesRotation} cultures · actuel`,
      options: [
        { label: '4 cultures', delta: -0.22 },
        { label: '5+ cultures', delta: -0.38, isReference: true },
      ],
    },
    {
      id: 'seq',
      name: '🔄 Séquence cultures',
      type: 'Qualitatif',
      current: `${form.sequenceCultures} · actuel`,
      options: [
        { label: 'Rotation diversifiée (4+ familles)', delta: -0.25 },
        { label: 'Rotation longue avec légumineuses', delta: -0.4, isReference: true },
      ],
    },
    {
      id: 'sol',
      name: '🚜 Travail du sol',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.soilWork[form.typeTravailDuSol]} · actuel`,
      options: [
        { label: 'TCS', delta: -0.28 },
        { label: 'Semis direct', delta: -0.45, isReference: true },
      ],
    },
    {
      id: 'desh',
      name: '⚙️ Désherbage mécanique',
      type: 'Qualitatif',
      current: `${form.nbrePassagesDesherbageMeca} passages · actuel`,
      options: [
        { label: 'Oui — partiel (2 pass.)', delta: -0.3 },
        { label: 'Oui — complet', delta: -0.52, isReference: true },
      ],
    },
    {
      id: 'macro',
      name: '🪱 Recours macroorganismes',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.yesNo[form.recoursMacroorganismes]} · actuel`,
      options: [
        { label: 'Oui', delta: -0.15, isReference: true },
      ],
    },
    {
      id: 'ferti',
      name: '🧪 Fertilisation N totale',
      type: 'Quantitatif',
      current: `${form.fertiNTot} kg N/ha · actuel`,
      options: [
        { label: '100 kg N/ha', delta: -0.2 },
        { label: '50 kg N/ha ou moins', delta: -0.35, isReference: true },
      ],
    },
    {
      id: 'agri',
      name: '🌱 Type d\'agriculture',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.agricultureType[form.sdcTypeAgriculture]} · actuel`,
      options: [
        { label: 'Agriculture biologique', delta: -0.35, isReference: true },
      ],
    },
  ];
});

export const leverDeltasAtom = atom<LeverDeltas>({});

/**
 * Derived atom: simulated IFT = predicted IFT + sum of selected deltas.
 */
export const simulatedIFTAtom = atom<number>((get) => {
  const base = get(predictedIFTAtom);
  const deltas = get(leverDeltasAtom);
  const total = Object.values(deltas).reduce((sum: number, d: number) => sum + d, 0);
  return Math.max(0.05, Math.round((base + total) * 100) / 100);
});
