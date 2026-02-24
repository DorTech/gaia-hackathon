import { apiClient } from './client';
import type { BenchmarkFiltersState } from '../types/benchmark';
import { buildPracticeApiMap } from '../config/variables';

// ── Types for API responses ──

interface Filter {
  field: string;
  operator: string;
  value: string | number | boolean;
}

interface FrequencyRow {
  value: string | boolean | null;
  count: number;
  percentage: number;
}

interface FrequencyResponse {
  total: number;
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

  const apiValue =
    filters.agricultureType === 'Biologique seul'
      ? 'Agriculture Biologique'
      : 'Agriculture Conventionnelle';
  out.push({
    field: 'sdcTypeAgriculture',
    operator: 'eq',
    value: apiValue,
  });

  return out;
}

// ── API calls ──

export async function fetchMedianIFT(
  filters: BenchmarkFiltersState,
): Promise<{ median: number; count: number }> {
  const deptCode = filters.department.split(' ')[0];
  const { data } = await apiClient.post<{ median: number; count: number }>('/query/median_ift', {
    field: 'iftHistoChimiqueTot',
    culture: filters.species,
    department: deptCode,
    agricultureType: filters.agricultureType,
  });
  return data;
}

export async function fetchFrequency(
  field: string,
  filters: BenchmarkFiltersState,
): Promise<FrequencyResponse> {
  // Special route for nbCulturesRotation
  const deptCode = filters.department.split(' ')[0];
  const { data } = await apiClient.post<FrequencyResponse>('/query/frequency_var', {
    field: field,
    culture: filters.species,
    department: deptCode,
    agricultureType: filters.agricultureType,
  });
  return data;
}

export async function fetchMedianField(
  field: string,
  filters: BenchmarkFiltersState,
): Promise<number> {
  // Special route for nbCulturesRotation
  const deptCode = filters.department.split(' ')[0];
  const { data } = await apiClient.post<{ median: number }>('/query/median_var', {
    field: field,
    culture: filters.species,
    department: deptCode,
    agricultureType: filters.agricultureType,
  });
  return data.median ?? -1;
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

import { DEPT_NAMES } from '../config/departments';

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
  return data.data.filter((r) => r.value != null && r.value !== '').map((r) => String(r.value));
}

/** Maps practice IDs to their API config — derived from centralized variable definitions */
export const PRACTICE_API_MAP = buildPracticeApiMap();
