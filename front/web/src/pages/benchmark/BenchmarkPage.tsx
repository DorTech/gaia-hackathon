import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { MedianKpiRow } from './MedianKpiRow';
import { BenchmarkFilters } from './BenchmarkFilters';
import { BenchmarkHeader } from './BenchmarkHeader';
import { PracticeProfileCard } from './PracticeProfileCard';
import {
  benchmarkFilterOptionsAtom,
  benchmarkReferenceFarmsAtom,
  benchmarkMedianKpisAtom,
  benchmarkPracticeProfileAtom,
  benchmarkFiltersAtom,
} from '../../store/benchmarkAtoms';
import { iftMedianValueAtom } from '../../store/referenceAtoms';

export const BenchmarkPage: React.FC = () => {
  const navigate = useNavigate();

  const filterOptions = useAtomValue(benchmarkFilterOptionsAtom);
  const referenceFarms = useAtomValue(benchmarkReferenceFarmsAtom);
  const medianKpis = useAtomValue(benchmarkMedianKpisAtom);
  const practiceProfile = useAtomValue(benchmarkPracticeProfileAtom);
  const [appliedFilters, setAppliedFilters] = useAtom(benchmarkFiltersAtom);
  const medianIft = useAtomValue(iftMedianValueAtom);

  const getThresholdMultiplier = (value: string) => {
    if (value.includes('−20')) return 0.8;
    if (value.includes('−30')) return 0.7;
    if (value.includes('−40')) return 0.6;
    return 1;
  };

  const thresholdValue = useMemo(() => {
    const multiplier = getThresholdMultiplier(appliedFilters.iftThreshold);
    return Math.round(medianIft * multiplier * 100) / 100;
  }, [appliedFilters.iftThreshold, medianIft]);

  const filteredFarms = useMemo(() => {
    return referenceFarms.filter((farm) => farm.ift <= thresholdValue);
  }, [thresholdValue, referenceFarms]);

  const formatIft = (value: number) => value.toFixed(2).replace('.', ',');
  const departmentCode = appliedFilters.department.split(' ')[0];
  const totalReferenceFarms = referenceFarms.length;

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
        options={filterOptions}
      />

      {/* KPIs MÉDIANE */}
      <MedianKpiRow kpis={medianKpis} />

      {/* PROFIL PRATIQUES */}
      <PracticeProfileCard
        title={"Liste des pratiques les plus performantes sur l'IFT"}
        tagLabel={`IFT ${appliedFilters.iftThreshold}`}
        items={practiceProfile}
      />
    </div>
  );
};
