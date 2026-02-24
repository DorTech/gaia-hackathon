import { Box, Grid } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useRef } from 'react';
import { fetchDistinctAgricultureTypes, fetchDistinctSoilWorkTypes } from '../api/benchmark';
import { predictIFT } from '../api/predict';
import type { ITKFormState } from '../store/diagnosticAtoms';
import { agricultureTypesAtom, soilWorkTypesAtom, predictedIFTAtom } from '../store/diagnosticAtoms';
import {
  leverOverridesAtom,
  leversAtom,
  simulatedFormAtom,
  simulatedIFTAtom,
  simulatingAtom,
} from '../store/simulationAtoms';
import { LeversList, PageHeader, SummarySidebar } from './simulationComponents';

export const SimulationPage: React.FC = () => {
  const baseIFT = useAtomValue(predictedIFTAtom) ?? 0;
  const levers = useAtomValue(leversAtom);
  const [overrides, setOverrides] = useAtom(leverOverridesAtom);
  const [simulatedIFT, setSimulatedIFT] = useAtom(simulatedIFTAtom);
  const setSimulating = useSetAtom(simulatingAtom);
  const simulating = useAtomValue(simulatingAtom);
  const simulatedForm = useAtomValue(simulatedFormAtom);
  const [agricultureTypes, setAgricultureTypes] = useAtom(agricultureTypesAtom);
  const [soilWorkTypes, setSoilWorkTypes] = useAtom(soilWorkTypesAtom);

  // Fetch agriculture types and soil work types if not already loaded (e.g. direct navigation)
  useEffect(() => {
    if (agricultureTypes.length === 0) {
      fetchDistinctAgricultureTypes()
        .then(setAgricultureTypes)
        .catch(() => {});
    }
    if (soilWorkTypes.length === 0) {
      fetchDistinctSoilWorkTypes()
        .then(setSoilWorkTypes)
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Initialize simulatedIFT with baseIFT on first render
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      setSimulatedIFT(baseIFT);
      initialized.current = true;
    }
  }, [baseIFT, setSimulatedIFT]);

  // Debounced API call when simulated form changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setSimulating(true);
      try {
        const result = await predictIFT(simulatedForm, agricultureTypes, soilWorkTypes);
        setSimulatedIFT(Math.round(result * 100) / 100);
      } catch (err) {
        console.error('Simulation predict failed:', err);
      } finally {
        setSimulating(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [simulatedForm, agricultureTypes, soilWorkTypes, setSimulatedIFT, setSimulating]);

  const handlePickOption = (leverId: string, formOverrides: Partial<ITKFormState> | null) => {
    setOverrides((prev) => {
      if (!formOverrides) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [leverId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [leverId]: formOverrides };
    });
  };

  const activeLeverCount = Object.keys(overrides).length;
  const displayIFT = simulatedIFT || baseIFT;
  const gained = baseIFT - displayIFT;
  const gainPct = gained > 0 ? ((gained / baseIFT) * 100).toFixed(1) : '0';

  return (
    <Box
      sx={{
        backgroundColor: 'var(--bg)',
        padding: '18px 20px',
        minHeight: '100vh',
      }}
    >
      <PageHeader
        title="Simulation des leviers agronomiques"
        description="Sélectionnez les pratiques des fermes que vous seriez prêt à mobiliser · Recalcul de l'IFT en temps réel"
      />

      <Grid container spacing={2}>
        {/* Left column - Levers List */}
        <Grid item xs={12} md={9}>
          <LeversList levers={levers} overrides={overrides} onPickOption={handlePickOption} />
        </Grid>

        {/* Right column - Summary Card */}
        <Grid item xs={12} md={3}>
          <SummarySidebar
            baseIFT={baseIFT}
            simulatedIFT={displayIFT}
            gained={gained}
            gainPct={gainPct}
            activeLeverCount={activeLeverCount}
            simulating={simulating}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
