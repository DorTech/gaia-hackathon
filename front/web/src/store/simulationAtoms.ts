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
      current: `${form.rotation} cultures · actuel`,
      options: [
        { label: '4 cultures', delta: -0.22 },
        { label: '5+ cultures', delta: -0.38, isReference: true },
      ],
    },
    {
      id: 'sol',
      name: '🚜 Travail du sol',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.soilWork[form.soilWork]} · actuel`,
      options: [
        { label: 'TCS', delta: -0.28 },
        { label: 'Semis direct', delta: -0.45, isReference: true },
      ],
    },
    {
      id: 'desh',
      name: '⚙️ Désherbage mécanique',
      type: 'Qualitatif',
      current: `${form.hasWeeding === 1 ? `Oui (${form.weedingPassages} pass.)` : 'Non'} · actuel`,
      options: [
        { label: 'Oui — partiel (2 pass.)', delta: -0.3 },
        { label: 'Oui — complet', delta: -0.52, isReference: true },
      ],
    },
    {
      id: 'bio',
      name: '🌿 Recours moyens biologiques',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.yesNo[form.biologicalControl]} · actuel`,
      options: [
        { label: 'Oui', delta: -0.18, isReference: true },
      ],
    },
    {
      id: 'macro',
      name: '🪱 Recours macroorganismes',
      type: 'Qualitatif',
      current: `${CHIP_OPTIONS.yesNo[form.macroorganisms]} · actuel`,
      options: [
        { label: 'Oui', delta: -0.15, isReference: true },
      ],
    },
    {
      id: 'n',
      name: '🧪 Fertilisation',
      type: 'Quantitatif',
      current: `${form.fertilization} kg/ha · actuel`,
      options: [
        { label: '160 kg/ha', delta: -0.1 },
        { label: '140 kg/ha', delta: -0.18, isReference: true },
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
