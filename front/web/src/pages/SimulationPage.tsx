import React from "react";
import { Box, Grid } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";
import {
  PageHeader,
  SummaryBar,
  LeversList,
} from "./simulationComponents";
import { predictedIFTAtom } from "../store/diagnosticAtoms";
import { leversAtom, leverDeltasAtom, simulatedIFTAtom } from "../store/simulationAtoms";

export const SimulationPage: React.FC = () => {
  const baseIFT = useAtomValue(predictedIFTAtom);
  const levers = useAtomValue(leversAtom);
  const [deltas, setDeltas] = useAtom(leverDeltasAtom);
  const simulatedIFT = useAtomValue(simulatedIFTAtom);

  const handlePickOption = (leverId: string, delta: number) => {
    setDeltas((prev) => ({
      ...prev,
      [leverId]: delta,
    }));
  };

  const activeLeverCount = Object.values(deltas).filter((d) => d !== 0).length;
  const gained = baseIFT - simulatedIFT;
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
        simulatedIFT={simulatedIFT}
        gained={gained}
        gainPct={gainPct}
        activeLeverCount={activeLeverCount}
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
            deltas={deltas}
            onPickOption={handlePickOption}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
