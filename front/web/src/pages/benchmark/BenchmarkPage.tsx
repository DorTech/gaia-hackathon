import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MedianKpiRow } from './MedianKpiRow';
import {
  BENCHMARK_FILTER_OPTIONS,
  BENCHMARK_MEDIAN_KPIS,
  BENCHMARK_PRACTICE_PROFILE,
  BENCHMARK_REFERENCE_FARMS,
} from '../../data/benchmark';
import { BenchmarkFilters, type BenchmarkFiltersState } from './BenchmarkFilters';
import { BenchmarkHeader } from './BenchmarkHeader';
import { PracticeProfileCard } from './PracticeProfileCard';
import { ThresholdSummary } from './ThresholdSummary';

export const BenchmarkPage: React.FC = () => {
  const navigate = useNavigate();

  const [appliedFilters, setAppliedFilters] = useState<BenchmarkFiltersState>({
    species: 'Blé tendre',
    department: '35 — Ille-et-Vilaine',
    agricultureType: 'Tous (Bio + Conv.)',
    iftThreshold: '−30% vs médiane',
  });

  const getThresholdMultiplier = (value: string) => {
    if (value.includes('−20')) return 0.8;
    if (value.includes('−30')) return 0.7;
    if (value.includes('−40')) return 0.6;
    return 1;
  };

  const medianIft = 2.30;
  const thresholdValue = useMemo(() => {
    const multiplier = getThresholdMultiplier(appliedFilters.iftThreshold);
    return Math.round(medianIft * multiplier * 100) / 100;
  }, [appliedFilters.iftThreshold]);

  const filteredFarms = useMemo(() => {
    return BENCHMARK_REFERENCE_FARMS.filter((farm) => farm.ift <= thresholdValue);
  }, [thresholdValue]);

  const formatIft = (value: number) => value.toFixed(2).replace('.', ',');
  const departmentCode = appliedFilters.department.split(' ')[0];
  const totalReferenceFarms = BENCHMARK_REFERENCE_FARMS.length;

  return (
    <div className="page active" id="page-bench">
      <BenchmarkHeader
        departmentCode={departmentCode}
        species={appliedFilters.species}
        onGoToDiagnostic={() => navigate('/diagnostic')}
      />

      {/* FILTRES */}
      <BenchmarkFilters
        initialValues={appliedFilters}
        onApply={setAppliedFilters}
        options={BENCHMARK_FILTER_OPTIONS}
      />

      {/* SEUIL RETENU */}
      <ThresholdSummary
        thresholdLabel={formatIft(thresholdValue)}
        multiplier={getThresholdMultiplier(appliedFilters.iftThreshold).toFixed(2)}
        referenceCount={filteredFarms.length}
        totalCount={totalReferenceFarms}
      />

      {/* KPIs MÉDIANE */}
      <MedianKpiRow kpis={BENCHMARK_MEDIAN_KPIS} />

        {/* PROFIL PRATIQUES */}
        <PracticeProfileCard
          title={`🔍 Profil des pratiques — ${filteredFarms.length} fermes référence (IFT ≤ ${formatIft(thresholdValue)})`}
          tagLabel={`IFT ${appliedFilters.iftThreshold}`}
          items={BENCHMARK_PRACTICE_PROFILE}
        />


    </div>
  );
};
