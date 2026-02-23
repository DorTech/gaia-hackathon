import { apiClient } from './client';
import type { BenchmarkFiltersState } from '../types/benchmark';

// ── Types for API responses ──

interface Filter {
  field: string;
  operator: string;
  value: string | number | boolean;
}

interface FrequencyRow {
  value: string | boolean | null;
  count: number;
}

interface MedianResponse {
  table: string;
  field: string;
  median: number | null;
  count: number;
}

interface FrequencyResponse {
  table: string;
  field: string;
  data: FrequencyRow[];
}

interface QueryResponse<T = Record<string, unknown>> {
  data: T[];
  total: number;
  limit: number | null;
  offset: number;
}

// ── Table & fields ──

const TABLE = 'sdc_realise_perf_magasin_can';

// ── Helpers ──

/** Build the common filters array from the UI filters state */
function buildFilters(filters: BenchmarkFiltersState): Filter[] {
  const out: Filter[] = [];

  // Species
  out.push({ field: 'especes', operator: 'eq', value: filters.species });

  // Department — extract code from "35 — Ille-et-Vilaine"
  const deptCode = filters.department.split(' ')[0];
  out.push({ field: 'departement', operator: 'eq', value: deptCode });

  // Agriculture type — "Tous (Bio + Conv.)" means no filter
  if (filters.agricultureType !== 'Tous (Bio + Conv.)') {
    const apiValue =
      filters.agricultureType === 'Biologique seul'
        ? 'Agriculture Biologique'
        : 'Agriculture Conventionnelle';
    out.push({
      field: 'sdcTypeAgriculture',
      operator: 'eq',
      value: apiValue,
    });
  }

  return out;
}

// ── API calls ──

export async function fetchMedianIFT(filters: BenchmarkFiltersState): Promise<MedianResponse> {
  const { data } = await apiClient.post<MedianResponse>('/query/median', {
    table: TABLE,
    field: 'iftHistoChimiqueTot',
    filters: buildFilters(filters),
  });
  return data;
}

export async function fetchFrequency(
  field: string,
  filters: BenchmarkFiltersState,
  asBoolean?: boolean,
): Promise<FrequencyResponse> {
  const { data } = await apiClient.post<FrequencyResponse>('/query/frequency', {
    table: TABLE,
    field,
    filters: buildFilters(filters),
    ...(asBoolean ? { asBoolean: true } : {}),
  });
  return data;
}

export async function fetchMedianField(
  field: string,
  filters: BenchmarkFiltersState,
): Promise<number> {
  // Special route for nbRotation
  if (field === 'nbRotation') {
    const deptCode = filters.department.split(' ')[0];
    const { data } = await apiClient.post<{ nbRotation: number }>('/query/median_nb_rotation', {
      culture: filters.species,
      department: deptCode,
      agricultureType: filters.agricultureType,
    });
    return data.nbRotation;
  }

  const { data } = await apiClient.post<MedianResponse>('/query/median', {
    table: TABLE,
    field,
    filters: buildFilters(filters),
  });
  return data.median ?? 0;
}

export async function fetchTopFarms(filters: BenchmarkFiltersState): Promise<
  QueryResponse<{
    domaineNom: string;
    sdcTypeAgriculture: string;
    iftHistoChimiqueTot: number;
  }>
> {
  const { data } = await apiClient.post<
    QueryResponse<{
      domaineNom: string;
      sdcTypeAgriculture: string;
      iftHistoChimiqueTot: number;
    }>
  >('/query/data', {
    table: TABLE,
    select: ['domaineNom', 'sdcTypeAgriculture', 'iftHistoChimiqueTot'],
    filters: [...buildFilters(filters), { field: 'iftHistoChimiqueTot', operator: 'isNotNull' }],
    limit: 200,
  });
  return data;
}

// ── Filter options ──

const DEPT_NAMES: Record<string, string> = {
  '01': 'Ain',
  '02': 'Aisne',
  '03': 'Allier',
  '04': 'Alpes-de-Haute-Provence',
  '05': 'Hautes-Alpes',
  '06': 'Alpes-Maritimes',
  '07': 'Ardèche',
  '08': 'Ardennes',
  '09': 'Ariège',
  '10': 'Aube',
  '11': 'Aude',
  '12': 'Aveyron',
  '13': 'Bouches-du-Rhône',
  '14': 'Calvados',
  '15': 'Cantal',
  '16': 'Charente',
  '17': 'Charente-Maritime',
  '18': 'Cher',
  '19': 'Corrèze',
  '21': "Côte-d'Or",
  '22': "Côtes-d'Armor",
  '23': 'Creuse',
  '24': 'Dordogne',
  '25': 'Doubs',
  '26': 'Drôme',
  '27': 'Eure',
  '28': 'Eure-et-Loir',
  '29': 'Finistère',
  '30': 'Gard',
  '31': 'Haute-Garonne',
  '32': 'Gers',
  '33': 'Gironde',
  '34': 'Hérault',
  '35': 'Ille-et-Vilaine',
  '36': 'Indre',
  '37': 'Indre-et-Loire',
  '38': 'Isère',
  '39': 'Jura',
  '40': 'Landes',
  '41': 'Loir-et-Cher',
  '42': 'Loire',
  '43': 'Haute-Loire',
  '44': 'Loire-Atlantique',
  '45': 'Loiret',
  '46': 'Lot',
  '47': 'Lot-et-Garonne',
  '48': 'Lozère',
  '49': 'Maine-et-Loire',
  '50': 'Manche',
  '51': 'Marne',
  '52': 'Haute-Marne',
  '53': 'Mayenne',
  '54': 'Meurthe-et-Moselle',
  '55': 'Meuse',
  '56': 'Morbihan',
  '57': 'Moselle',
  '58': 'Nièvre',
  '59': 'Nord',
  '60': 'Oise',
  '61': 'Orne',
  '62': 'Pas-de-Calais',
  '63': 'Puy-de-Dôme',
  '64': 'Pyrénées-Atlantiques',
  '65': 'Hautes-Pyrénées',
  '66': 'Pyrénées-Orientales',
  '67': 'Bas-Rhin',
  '68': 'Haut-Rhin',
  '69': 'Rhône',
  '70': 'Haute-Saône',
  '71': 'Saône-et-Loire',
  '72': 'Sarthe',
  '73': 'Savoie',
  '74': 'Haute-Savoie',
  '75': 'Paris',
  '76': 'Seine-Maritime',
  '77': 'Seine-et-Marne',
  '78': 'Yvelines',
  '79': 'Deux-Sèvres',
  '80': 'Somme',
  '81': 'Tarn',
  '82': 'Tarn-et-Garonne',
  '83': 'Var',
  '84': 'Vaucluse',
  '85': 'Vendée',
  '86': 'Vienne',
  '87': 'Haute-Vienne',
  '88': 'Vosges',
  '89': 'Yonne',
  '90': 'Territoire de Belfort',
  '91': 'Essonne',
  '92': 'Hauts-de-Seine',
  '93': 'Seine-Saint-Denis',
  '94': 'Val-de-Marne',
  '95': "Val-d'Oise",
  '2A': 'Corse-du-Sud',
  '2B': 'Haute-Corse',
  '971': 'Guadeloupe',
  '972': 'Martinique',
  '973': 'Guyane',
  '974': 'La Réunion',
  '976': 'Mayotte',
};

function formatDept(code: string): string {
  const name = DEPT_NAMES[code];
  return name ? `${code} — ${name}` : code;
}

/** Fetch distinct species from the database */
export async function fetchDistinctSpecies(): Promise<string[]> {
  const { data } = await apiClient.post<FrequencyResponse>('/query/frequency', {
    table: TABLE,
    field: 'especes',
  });
  return data.data.filter((r) => r.value != null && r.value !== '').map((r) => String(r.value));
}

/** Fetch distinct departments from the database, formatted as "CODE — Nom" */
export async function fetchDistinctDepartments(): Promise<string[]> {
  const { data } = await apiClient.post<FrequencyResponse>('/query/frequency', {
    table: TABLE,
    field: 'departement',
  });
  return data.data
    .filter((r) => r.value != null && r.value !== '')
    .map((r) => formatDept(String(r.value)))
    .sort();
}

export async function fetchDistinctAgricultureTypes(): Promise<string[]> {
  const { data } = await apiClient.post<FrequencyResponse>('/query/frequency', {
    table: 'sdc',
    field: 'typeAgriculture',
  });
  return data.data
    .filter((r) => r.value != null && r.value !== '')
    .map((r) => String(r.value))
    .concat('Tous (Bio + Conv.)'); // Add combined option
}

// ── Practice profile helpers ──

/** Maps practice IDs to their API config */
export const PRACTICE_API_MAP: Record<
  string,
  { type: 'frequency'; field: string; asBoolean?: boolean } | { type: 'median'; field: string }
> = {
  'soil-work': { type: 'frequency', field: 'typeDeTravailDuSol' },
  'mechanical-weeding': {
    type: 'frequency',
    field: 'utiliDesherbageMeca',
    asBoolean: true,
  },
  biocontrol: {
    type: 'frequency',
    field: 'recoursAuxMoyensBiologiques',
    asBoolean: true,
  },
  'rotation-count': { type: 'median', field: 'nbRotation' },
  nitrogen: { type: 'median', field: 'fertiNTot' },
  'resistant-variety': { type: 'frequency', field: 'varieteResistante' },
  'winter-cover': { type: 'frequency', field: 'couvertHivernaux' },
  'fuel-consumption': { type: 'median', field: 'consoCarburant' },
};
