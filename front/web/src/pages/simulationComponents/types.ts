export interface LeverDeltas {
  [key: string]: number;
}

export interface Lever {
  id: string;
  name: string;
  type: 'Quantitatif' | 'Qualitatif';
  current: string;
  options: Array<{ label: string; delta: number; isReference?: boolean }>;
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
  delta?: number;
  onPickOption: (leverId: string, delta: number) => void;
}

export interface SummaryBarProps {
  baseIFT: number;
  simulatedIFT: number;
  gained: number;
  gainPct: string;
  activeLeverCount: number;
}

export interface InfoBoxProps {
  className?: string;
}

export interface LeversListProps {
  levers: Lever[];
  deltas: LeverDeltas;
  onPickOption: (leverId: string, delta: number) => void;
}
