import React, { useEffect, useRef } from "react";
import { Box, Grid } from "@mui/material";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  PageHeader,
  SummaryBar,
  LeversList,
} from "./simulationComponents";
import { predictedIFTAtom, agricultureTypesAtom } from "../store/diagnosticAtoms";
import { fetchDistinctAgricultureTypes } from "../api/benchmark";
import type { ITKFormState } from "../store/diagnosticAtoms";
import {
  leversAtom,
  leverOverridesAtom,
  simulatedFormAtom,
  simulatedIFTAtom,
  simulatingAtom,
} from "../store/simulationAtoms";
import { predictIFT } from "../api/predict";

export const SimulationPage: React.FC = () => {
  const baseIFT = useAtomValue(predictedIFTAtom);
  const levers = useAtomValue(leversAtom);
  const [overrides, setOverrides] = useAtom(leverOverridesAtom);
  const [simulatedIFT, setSimulatedIFT] = useAtom(simulatedIFTAtom);
  const setSimulating = useSetAtom(simulatingAtom);
  const simulating = useAtomValue(simulatingAtom);
  const simulatedForm = useAtomValue(simulatedFormAtom);
  const [agricultureTypes, setAgricultureTypes] = useAtom(agricultureTypesAtom);

  // Fetch agriculture types if not already loaded (e.g. direct navigation)
  useEffect(() => {
    if (agricultureTypes.length === 0) {
      fetchDistinctAgricultureTypes().then(setAgricultureTypes).catch(() => {});
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
        const result = await predictIFT(simulatedForm, agricultureTypes);
        setSimulatedIFT(Math.round(result * 100) / 100);
      } catch (err) {
        console.error('Simulation predict failed:', err);
      } finally {
        setSimulating(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [simulatedForm, agricultureTypes, setSimulatedIFT, setSimulating]);

  const handlePickOption = (leverId: string, formOverrides: Partial<ITKFormState> | null) => {
    setOverrides((prev) => {
      if (!formOverrides) {
        const { [leverId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [leverId]: formOverrides };
    });
  };

  const activeLeverCount = Object.keys(overrides).length;
  const displayIFT = simulatedIFT || baseIFT;
  const gained = baseIFT - displayIFT;
  const gainPct = gained > 0 ? ((gained / baseIFT) * 100).toFixed(1) : "0";

  return (
    <Box
      sx={{
        backgroundColor: "var(--bg)",
        padding: "18px 20px",
        minHeight: "100vh",
      }}
    >
      <PageHeader
        title="Simulation des leviers agronomiques"
        description="Sélectionnez les pratiques des fermes référence que vous seriez prêt à mobiliser · Recalcul RF en temps réel"
      />

      <SummaryBar
        baseIFT={baseIFT}
        simulatedIFT={displayIFT}
        gained={gained}
        gainPct={gainPct}
        activeLeverCount={activeLeverCount}
        simulating={simulating}
      />

      <Grid
        container
        spacing={2}
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "14px",
        }}
      >
        <Grid item xs={12}>
          <LeversList
            levers={levers}
            overrides={overrides}
            onPickOption={handlePickOption}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
