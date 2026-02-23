export interface BenchmarkFarm {
  rank: number;
  name: string;
  type: string;
  ift: number;
  gap: string;
}

export interface MedianKpi {
  id: string;
  label: string;
  value: string;
  unit: string;
  variant: 'green' | 'teal' | 'violet';
  sub: string;
  delta: string;
  deltaClass: 'warn' | 'good';
}

export interface BenchmarkFilterOptions {
  species: string[];
  department: string[];
  agricultureType: string[];
  iftThreshold: string[];
}

export interface PracticeFrequencyRow {
  label: string;
  pct: number;
  top?: boolean;
}

export interface PracticeQuantBar {
  label: string;
  width: number;
  color: string;
}

export interface PracticeProfileItem {
  id: string;
  name: string;
  variable: string;
  type: 'Qualitatif' | 'Quantitatif';
  mode: 'quali' | 'quanti';
  frequencies?: PracticeFrequencyRow[];
  note?: {
    label: string;
    value: string;
    suffix?: string;
  };
  quantitative?: {
    value: string;
    unit: string;
    myValue?: string;
  };
}

export interface BenchmarkFiltersState {
  species: string;
  department: string;
  agricultureType: string;
  iftThreshold: string;
}
