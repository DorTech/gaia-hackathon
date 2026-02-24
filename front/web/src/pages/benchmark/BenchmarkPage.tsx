import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback, useEffect } from 'react';
import {
  fetchDistinctAgricultureTypes,
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
  flattenedSpeciesListAtom,
  rawSpeciesListAtom,
  PRACTICE_PROFILE_TEMPLATE,
} from '../../store/benchmarkAtoms';
import { agricultureTypesAtom, itkFormAtom, predictedIFTAtom } from '../../store/diagnosticAtoms';
import { DEPT_NAMES } from '../../config/departments';
import { iftMedianValueAtom } from '../../store/referenceAtoms';
import type { BenchmarkFiltersState, PracticeProfileItem } from '../../types/benchmark';
import { BenchmarkFilters } from './BenchmarkFilters';
import { BenchmarkHeader } from './BenchmarkHeader';
import { MedianKpiRow } from './MedianKpiRow';
import { PracticeProfileCard } from './PracticeProfileCard';

export const BenchmarkPage: React.FC = () => {
  const [filterOptions, setFilterOptions] = useAtom(benchmarkFilterOptionsAtom);
  const flattenedSpecies = useAtomValue(flattenedSpeciesListAtom);
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
  const setRawSpecies = useSetAtom(rawSpeciesListAtom);
  const diagnosticForm = useAtomValue(itkFormAtom);
  const agricultureTypes = useAtomValue(agricultureTypesAtom);

  const loadBenchmarkData = useCallback(
    async (filters: BenchmarkFiltersState) => {
      setLoading(true);
      try {
        // 1. Fetch median IFT
        const medianRes = await fetchMedianIFT(filters);
        const count = medianRes.count;

        if (medianRes.median != null && count > 0) {
          const medianValue = medianRes.median;
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
        } else {
          setMedianKpis([
            {
              id: 'ift',
              label: '📉 Médiane IFT total',
              value: '—',
              unit: '',
              variant: 'violet',
              sub: `Aucune exploitation trouvée · ${filters.species}`,
              delta: '',
              deltaClass: 'good',
            },
          ]);
        }

        const medianValue = medianRes.median ?? 0;

        // 2. Fetch farms
        const farmsRes = await fetchTopFarms(filters);
        const sortedFarms = farmsRes.data
          .filter((f) => f.iftHistoChimiqueTot != null)
          .sort((a, b) => a.iftHistoChimiqueTot - b.iftHistoChimiqueTot);

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
        const baseProfile = PRACTICE_PROFILE_TEMPLATE;
        const updatedProfile: PracticeProfileItem[] = await Promise.all(
          baseProfile.map(async (profile) => {
            const apiConfig = PRACTICE_API_MAP[profile.id];
            if (!apiConfig) return profile; // keep mock for items not in the API

            try {
              if (apiConfig.type === 'frequency') {
                const res = await fetchFrequency(apiConfig.field, filters);
                const total = res.data.reduce((sum, r) => sum + r.count, 0);
                if (total === 0) return profile;

                const frequencies = res.data
                  .filter((r) => r.value !== null)
                  .map((r, idx) => ({
                    label: typeof r.value === 'boolean' ? (r.value ? 'Oui' : 'Non') : String(r.value),
                    pct: Math.round((r.count / total) * 100),
                    top: idx === 0,
                  }));

                return { ...profile, frequencies };
              }

              if (apiConfig.type === 'median') {
                const res = await fetchMedianField(apiConfig.field, filters);
                if (res === null) return profile;

                const formatted = res % 1 === 0 ? String(res) : res.toFixed(1).replace('.', ',');

                return {
                  ...profile,
                  quantitative: {
                    ...profile.quantitative!,
                    value: formatted,
                  },
                };
              }
            } catch {
              return profile; // fallback to mock on error
            }

            return profile;
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
        const [species, departments, agricultureTypes] = await Promise.all([
          fetchDistinctSpecies(),
          fetchDistinctDepartments(),
          fetchDistinctAgricultureTypes(),
        ]);

        setRawSpecies(species);

        setFilterOptions((prev) => ({
          ...prev,
          species,
          department: departments,
          agricultureType: agricultureTypes,
        }));

        // Prefill from diagnostic form values, or keep existing if already set
        const deptCode = String(diagnosticForm.departement);
        const deptName = DEPT_NAMES[deptCode];
        const deptFormatted = deptName ? `${deptCode} — ${deptName}` : deptCode;
        const matchedDept = departments.find((d) => d === deptFormatted) ?? '';

        const diagAgriType =
          ['Conventionnelle', 'Biologique', 'Conversion bio'][diagnosticForm.sdcTypeAgriculture] ??
          '';
        const matchedAgriType =
          agricultureTypes.find((t) => t.toLowerCase().includes(diagAgriType.toLowerCase())) ?? '';

        setAppliedFilters(
          (prev: { species: string; department: string; agricultureType: string }) => ({
            ...prev,
            species: prev.species && species.includes(prev.species) ? prev.species : '',
            department:
              prev.department && departments.includes(prev.department)
                ? prev.department
                : matchedDept,
            agricultureType:
              prev.agricultureType && agricultureTypes.includes(prev.agricultureType)
                ? prev.agricultureType
                : matchedAgriType,
          }),
        );
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    }
    loadFilterOptions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // One-way sync: diagnostic form → benchmark filters for department & agriculture type
  useEffect(() => {
    const deptCode = String(diagnosticForm.departement);
    const deptName = DEPT_NAMES[deptCode];
    const deptFormatted = deptName ? `${deptCode} — ${deptName}` : deptCode;
    const matchedDept = filterOptions.department.find((d) => d === deptFormatted) ?? deptFormatted;

    const diagAgriType = agricultureTypes[diagnosticForm.sdcTypeAgriculture] ?? '';
    const matchedAgriType =
      filterOptions.agricultureType.find((t) =>
        t.toLowerCase().includes(diagAgriType.toLowerCase()),
      ) ?? '';

    setAppliedFilters((prev) => ({
      ...prev,
      department: matchedDept,
      agricultureType: matchedAgriType,
    }));
  }, [
    diagnosticForm.departement,
    diagnosticForm.sdcTypeAgriculture,
    agricultureTypes,
    filterOptions,
  ]);

  const handleApplyFilters = useCallback(
    (filters: BenchmarkFiltersState) => {
      setAppliedFilters(filters);
      loadBenchmarkData(filters);
    },
    [setAppliedFilters, loadBenchmarkData],
  );

  const departmentCode = appliedFilters.department.split(' ')[0];
  const hasAllFilters =
    appliedFilters.species && appliedFilters.department && appliedFilters.agricultureType;
  return (
    <div className="page active" id="page-bench">
      <BenchmarkHeader departmentCode={departmentCode} species={appliedFilters.species} />

      {/* FILTRES */}
      <BenchmarkFilters
        initialValues={appliedFilters}
        onApply={handleApplyFilters}
        options={{
          ...filterOptions,
          species: flattenedSpecies,
        }}
      />

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text2)' }}>
          Chargement des données...
        </div>
      )}

      {!hasAllFilters && !loading && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: 'var(--text3)',
            fontSize: '1.1rem',
          }}
        >
          Veuillez sélectionner tous les filtres et cliquer sur &quot;Appliquer&quot; pour voir les
          résultats
        </div>
      )}

      {hasAllFilters && !loading && (
        <>
          {/* KPIs MÉDIANE */}
          <MedianKpiRow kpis={medianKpis} />

          {/* PROFIL PRATIQUES */}
          <PracticeProfileCard
            title={"Liste des pratiques les plus performantes sur l'IFT"}
            items={practiceProfile.filter(
              (item) => item.id !== 'agriculture-type' && item.id !== 'departement',
            )}
          />
        </>
      )}
    </div>
  );
};
