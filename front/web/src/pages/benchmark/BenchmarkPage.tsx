import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchDistinctDepartments,
  fetchDistinctSpecies,
  fetchFrequency,
  fetchMedianField,
  fetchMedianIFT,
  fetchTopFarms,
  PRACTICE_API_MAP,
} from '../../api/benchmark';
import {
  benchmarkFilterOptionsAtom,
  benchmarkFiltersAtom,
  benchmarkLoadingAtom,
  benchmarkMedianKpisAtom,
  benchmarkPracticeProfileAtom,
  benchmarkReferenceFarmsAtom,
  enrichedPracticeProfileAtom,
  PRACTICE_PROFILE_TEMPLATE,
} from '../../store/benchmarkAtoms';
import { predictedIFTAtom } from '../../store/diagnosticAtoms';
import { iftMedianValueAtom } from '../../store/referenceAtoms';
import type { BenchmarkFiltersState, PracticeProfileItem } from '../../types/benchmark';
import { BenchmarkFilters } from './BenchmarkFilters';
import { BenchmarkHeader } from './BenchmarkHeader';
import { MedianKpiRow } from './MedianKpiRow';
import { PracticeProfileCard } from './PracticeProfileCard';

export const BenchmarkPage: React.FC = () => {
  const navigate = useNavigate();

  const [filterOptions, setFilterOptions] = useAtom(benchmarkFilterOptionsAtom);
  const medianKpis = useAtomValue(benchmarkMedianKpisAtom);
  const practiceProfile = useAtomValue(enrichedPracticeProfileAtom);
  const [appliedFilters, setAppliedFilters] = useAtom(benchmarkFiltersAtom);
  const userIFT = useAtomValue(predictedIFTAtom);
  const loading = useAtomValue(benchmarkLoadingAtom);

  const setLoading = useSetAtom(benchmarkLoadingAtom);
  const setMedianKpis = useSetAtom(benchmarkMedianKpisAtom);
  const setPracticeProfile = useSetAtom(benchmarkPracticeProfileAtom);
  const setReferenceFarms = useSetAtom(benchmarkReferenceFarmsAtom);
  const setMedianIft = useSetAtom(iftMedianValueAtom);

  const loadBenchmarkData = useCallback(
    async (filters: BenchmarkFiltersState) => {
      setLoading(true);
      try {
        // 1. Fetch median IFT
        const medianRes = await fetchMedianIFT(filters);
        const medianValue = medianRes.median ?? 2.3;
        const count = medianRes.count;

        setMedianIft(medianValue);

        const formattedMedian = medianValue.toFixed(2).replace('.', ',');
        const deltaPct = (((medianValue - userIFT) / userIFT) * 100).toFixed(1);
        const deltaSign = parseFloat(deltaPct) > 0 ? '↑ +' : '↓ ';

        setMedianKpis([
          {
            id: 'ift',
            label: '📉 Médiane IFT total',
            value: formattedMedian,
            unit: 'IFT',
            variant: 'violet',
            sub: `${count} exploitations · ${filters.species}`,
            delta: `${deltaSign}${Math.abs(parseFloat(deltaPct)).toFixed(1)}% vs votre exploitation (${userIFT.toFixed(2).replace('.', ',')})`,
            deltaClass: parseFloat(deltaPct) > 0 ? 'warn' : 'good',
          },
        ]);

        // 2. Fetch top farms
        const farmsRes = await fetchTopFarms(filters);
        const sortedFarms = farmsRes.data
          .filter((f) => f.iftHistoChimiqueTot != null)
          .sort((a, b) => a.iftHistoChimiqueTot - b.iftHistoChimiqueTot)
          .slice(0, 10);

        setReferenceFarms(
          sortedFarms.map((f, i) => {
            const gap =
              medianValue > 0
                ? (((f.iftHistoChimiqueTot - medianValue) / medianValue) * 100).toFixed(0)
                : '0';
            return {
              rank: i + 1,
              name: f.domaineNom || `Exploitation ${i + 1}`,
              type: f.sdcTypeAgriculture || '',
              ift: Math.round(f.iftHistoChimiqueTot * 100) / 100,
              gap: `${parseInt(gap) <= 0 ? '' : '+'}${gap}%`,
            };
          }),
        );

        // 3. Fetch practice profile data
        const currentProfile = PRACTICE_PROFILE_TEMPLATE;
        const updatedProfile: PracticeProfileItem[] = await Promise.all(
          currentProfile.map(async (item) => {
            const apiConfig = PRACTICE_API_MAP[item.id];
            if (!apiConfig) return item; // keep mock for items not in the API

            try {
              if (apiConfig.type === 'frequency') {
                const res = await fetchFrequency(apiConfig.field, filters, apiConfig.asBoolean);
                const total = res.data.reduce((sum, r) => sum + r.count, 0);
                if (total === 0) return item;

                const frequencies = res.data
                  .filter((r) => r.value !== null)
                  .map((r, idx) => ({
                    label: String(r.value),
                    pct: Math.round((r.count / total) * 100),
                    top: idx === 0,
                  }));

                return { ...item, frequencies };
              }

              if (apiConfig.type === 'median') {
                const res = await fetchMedianField(apiConfig.field, filters);
                if (res.median === null) return item;

                const formatted =
                  res.median % 1 === 0
                    ? String(res.median)
                    : res.median.toFixed(1).replace('.', ',');

                return {
                  ...item,
                  quantitative: {
                    ...item.quantitative!,
                    value: formatted,
                  },
                };
              }
            } catch {
              return item; // fallback to mock on error
            }

            return item;
          }),
        );

        setPracticeProfile(updatedProfile);
      } catch (err) {
        console.error('Failed to load benchmark data:', err);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setMedianIft, setMedianKpis, setPracticeProfile, setReferenceFarms, userIFT],
  );

  // Fetch filter options (species + departments) from API on mount
  useEffect(() => {
    async function loadFilterOptions() {
      try {
        const [species, departments] = await Promise.all([
          fetchDistinctSpecies(),
          fetchDistinctDepartments(),
        ]);

        setFilterOptions((prev) => ({
          ...prev,
          species,
          department: departments,
        }));

        // Update default filters if current values aren't in the fetched lists
        setAppliedFilters((prev) => ({
          ...prev,
          species: species.includes(prev.species) ? prev.species : (species[0] ?? prev.species),
          department: departments.includes(prev.department)
            ? prev.department
            : (departments[0] ?? prev.department),
        }));
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadFilterOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch on mount and when filters change
  useEffect(() => {
    loadBenchmarkData(appliedFilters);
  }, [appliedFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  const departmentCode = appliedFilters.department.split(' ')[0];

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

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
          Chargement des données...
        </div>
      )}

      {/* KPIs MÉDIANE */}
      <MedianKpiRow kpis={medianKpis} />

      {/* PROFIL PRATIQUES */}
      <PracticeProfileCard
        title={"Liste des pratiques les plus performantes sur l'IFT"}
        items={practiceProfile}
      />
    </div>
  );
};
