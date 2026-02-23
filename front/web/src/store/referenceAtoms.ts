import { atom } from 'jotai';

/** IFT reference value (best-practice target) */
export const iftReferenceValueAtom = atom<number>(1.61);

/** IFT median value (departmental median) */
export const iftMedianValueAtom = atom<number>(2.30);

/** Max gauge scale for the IFT gauge */
export const iftMaxGaugeAtom = atom<number>(4);
