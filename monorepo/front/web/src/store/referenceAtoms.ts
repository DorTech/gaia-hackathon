import { atom } from 'jotai';

/** IFT median value (departmental median) */
export const iftMedianValueAtom = atom<number>(0);

/** Max gauge scale for the IFT gauge */
export const iftMaxGaugeAtom = atom<number>(4);
