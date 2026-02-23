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
    comparison: string;
    bars: PracticeQuantBar[];
  };
}

export const BENCHMARK_FILTER_OPTIONS: BenchmarkFilterOptions = {
  species: ['Blé tendre', 'Maïs grain', 'Colza', "Orge d'hiver", 'Tournesol'],
  department: [
    '35 — Ille-et-Vilaine',
    '29 — Finistère',
    "22 — Côtes-d'Armor",
    '56 — Morbihan',
  ],
  agricultureType: ['Tous (Bio + Conv.)', 'Conventionnel seul', 'Biologique seul'],
  iftThreshold: ['−20% vs médiane', '−30% vs médiane', '−40% vs médiane'],
};

export const BENCHMARK_REFERENCE_FARMS: BenchmarkFarm[] = [
  { rank: 1, name: 'GAEC Kervran', type: 'Bio · 89 ha · SD', ift: 0.82, gap: '−64%' },
  { rank: 2, name: 'EARL Tanguy', type: 'Conv. · 124 ha', ift: 0.98, gap: '−57%' },
  { rank: 3, name: 'SAS Morvan', type: 'Conv. · 67 ha · TCS', ift: 1.10, gap: '−52%' },
  { rank: 4, name: 'SCEA Le Goff', type: 'Conv. · 210 ha', ift: 1.22, gap: '−47%' },
  { rank: 5, name: 'GAEC Quéfélec', type: 'Bio · 155 ha · SD', ift: 1.28, gap: '−44%' },
  { rank: 6, name: 'EARL Jouan', type: 'Conv. · 98 ha', ift: 1.35, gap: '−41%' },
  { rank: 7, name: 'SAS Penglaou', type: 'Conv. · 78 ha', ift: 1.41, gap: '−39%' },
  { rank: 8, name: 'EARL Beaudouin', type: 'Conv. · 190 ha', ift: 1.48, gap: '−36%' },
];

export const BENCHMARK_MEDIAN_KPIS: MedianKpi[] = [
  {
    id: 'ift',
    label: '📉 Médiane IFT total — Dép. 35',
    value: '2,30',
    unit: 'IFT',
    variant: 'green',
    sub: '312 exploitations · Blé tendre · Campagne 2023',
    delta: '↑ +21,7% vs votre exploitation (2,80)',
    deltaClass: 'warn',
  },
  {
    id: 'work',
    label: '⏱ Médiane temps de travail — Dép. 35',
    value: '18,4',
    unit: 'h/ha',
    variant: 'teal',
    sub: 'Travail total (manuel + mécanisé)',
    delta: '↓ −7,5% vs votre exploitation (19,9 h/ha)',
    deltaClass: 'good',
  },
  {
    id: 'margin',
    label: '€ Médiane marge brute — Dép. 35',
    value: '1 240',
    unit: '€/ha',
    variant: 'violet',
    sub: 'Marge brute réelle hors autoconsommation',
    delta: '↓ −4,0% vs votre exploitation (1 292 €/ha)',
    deltaClass: 'good',
  },
];

export const BENCHMARK_PRACTICE_PROFILE: PracticeProfileItem[] = [
  {
    id: 'soil-work',
    name: 'Travail du sol',
    variable: 'type_de_travail_du_sol',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Semis direct', pct: 59, top: true },
      { label: 'TCS', pct: 32 },
      { label: 'Labour', pct: 9 },
    ],
  },
  {
    id: 'mechanical-weeding',
    name: 'Désherbage mécanique',
    variable: 'utili_desherbage_meca',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Oui — systématique', pct: 82, top: true },
      { label: 'Non', pct: 18 },
    ],
    note: {
      label: 'Médiane passages :',
      value: '3,2',
      suffix: 'vs 0,4 (ensemble)',
    },
  },
  {
    id: 'rotation-count',
    name: 'NB Rotation',
    variable: 'nb_rotation',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '4,8',
      unit: 'cultures',
      comparison: 'vs 3,1 — ensemble département',
      bars: [
        { label: 'Ensemble', width: 62, color: 'var(--text3)' },
        { label: 'Référence', width: 96, color: 'var(--green)' },
      ],
    },
  },
  {
    id: 'biocontrol',
    name: 'Recours Biocontrôle',
    variable: 'recours_biocontrole',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Oui — complet', pct: 68, top: true },
      { label: 'Partiel', pct: 27 },
      { label: 'Aucun', pct: 5 },
    ],
  },
  {
    id: 'nitrogen',
    name: 'Fertilisation N',
    variable: 'ferti_n_tot',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '142',
      unit: 'kgN/ha',
      comparison: 'vs 185 kgN/ha — ensemble',
      bars: [
        { label: 'Ensemble', width: 100, color: 'var(--text3)' },
        { label: 'Référence', width: 77, color: 'var(--green)' },
      ],
    },
  },
  {
    id: 'resistant-variety',
    name: 'Variété résistante',
    variable: 'variete_resistante',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Très résistante', pct: 73, top: true },
      { label: 'Résistance partielle', pct: 18 },
      { label: 'Standard', pct: 9 },
    ],
  },
  {
    id: 'winter-cover',
    name: 'Couverts hivernaux',
    variable: 'couvert_hivernaux',
    type: 'Qualitatif',
    mode: 'quali',
    frequencies: [
      { label: 'Systématique', pct: 86, top: true },
      { label: 'Partiel', pct: 11 },
      { label: 'Absent', pct: 3 },
    ],
  },
  {
    id: 'fuel-consumption',
    name: 'Consommation carburant',
    variable: 'conso_carburant',
    type: 'Quantitatif',
    mode: 'quanti',
    quantitative: {
      value: '68',
      unit: 'L/ha',
      comparison: 'vs 94 L/ha — ensemble département',
      bars: [
        { label: 'Ensemble', width: 100, color: 'var(--text3)' },
        { label: 'Référence', width: 72, color: 'var(--green)' },
      ],
    },
  },
];
