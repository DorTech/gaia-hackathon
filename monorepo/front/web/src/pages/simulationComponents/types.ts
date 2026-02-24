import type { ITKFormState } from '../../store/diagnosticAtoms';

export type LeverOverrides = Record<string, Partial<ITKFormState>>;

export interface LeverSliderConfig {
  min: number;
  max: number;
  currentValue: number;
  unit: string;
  referenceValue: number;
  referenceLabel: string;
  /** Which form field this slider controls */
  formKey: keyof ITKFormState;
}

export interface LeverOption {
  label: string;
  formOverrides: Partial<ITKFormState>;
  isReference?: boolean;
}

export interface Lever {
  id: string;
  name: string;
  type: 'Quantitatif' | 'Qualitatif';
  current: string;
  options: LeverOption[];
  slider?: LeverSliderConfig;
}

export interface PageHeaderProps {
  title: string;
  description: string;
}

export interface BadgeTypeProps {
  type: 'Quantitatif' | 'Qualitatif';
}

export interface LeverOptionProps {
  label: string;
  isCurrent?: boolean;
  onClick?: () => void;
}

export interface SummaryStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export interface SummaryRefItemProps {
  label: string;
  value: string;
  color?: string;
}

export interface LeverImpactProps {
  delta?: number;
}

export interface LeverCardProps {
  lever: Lever;
  activeOverrides?: Partial<ITKFormState>;
  onPickOption: (leverId: string, overrides: Partial<ITKFormState> | null) => void;
}

export interface SummaryBarProps {
  baseIFT: number;
  simulatedIFT: number;
  gained: number;
  gainPct: string;
  activeLeverCount: number;
  simulating?: boolean;
}

export interface InfoBoxProps {
  className?: string;
}

export interface LeversListProps {
  levers: Lever[];
  overrides: LeverOverrides;
  onPickOption: (leverId: string, overrides: Partial<ITKFormState> | null) => void;
}
