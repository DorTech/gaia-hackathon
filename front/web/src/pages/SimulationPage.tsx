import React, { useState } from "react";
import { Box, Grid } from "@mui/material";
import {
  PageHeader,
  SummaryBar,
  LeversList,
  Lever,
  LeverDeltas,
} from "./simulationComponents";

// ============ COMPOSANT PRINCIPAL ============

export const SimulationPage: React.FC = () => {
  const baseIFT = 2.8;
  const [deltas, setDeltas] = useState<LeverDeltas>({});

  const levers: Lever[] = [
    {
      id: "rot",
      name: "🌾 NB Rotation",
      type: "Quantitatif",
      current: "3 cultures · actuel",
      options: [
        { label: "4 cultures", delta: -0.22 },
        { label: "5+ cultures", delta: -0.38, isReference: true },
      ],
    },
    {
      id: "sol",
      name: "🚜 Travail du sol",
      type: "Qualitatif",
      current: "Labour · actuel",
      options: [
        { label: "TCS", delta: -0.28 },
        { label: "Semis direct", delta: -0.45, isReference: true },
      ],
    },
    {
      id: "desh",
      name: "⚙️ Désherbage mécanique",
      type: "Qualitatif",
      current: "Non · actuel",
      options: [
        { label: "Oui — partiel (2 pass.)", delta: -0.3 },
        { label: "Oui — complet", delta: -0.52, isReference: true },
      ],
    },
    {
      id: "var",
      name: "🧬 Variété résistante",
      type: "Qualitatif",
      current: "Standard · actuel",
      options: [
        { label: "Résistance partielle", delta: -0.18 },
        { label: "Très résistante", delta: -0.35, isReference: true },
      ],
    },
    {
      id: "bio",
      name: "🌿 Recours Biocontrôle",
      type: "Qualitatif",
      current: "Aucun · actuel",
      options: [
        { label: "Partiel", delta: -0.2 },
        { label: "Systématique", delta: -0.42, isReference: true },
      ],
    },
    {
      id: "couv",
      name: "🌱 Couverts hivernaux",
      type: "Qualitatif",
      current: "Partiel · actuel",
      options: [{ label: "Systématique", delta: -0.14, isReference: true }],
    },
    {
      id: "n",
      name: "🧪 Fertilisation N",
      type: "Quantitatif",
      current: "185 kgN/ha · actuel",
      options: [
        { label: "160 kgN/ha", delta: -0.1 },
        { label: "142 kgN/ha", delta: -0.18, isReference: true },
      ],
    },
  ];

  const handlePickOption = (leverId: string, delta: number) => {
    setDeltas((prev) => ({
      ...prev,
      [leverId]: delta,
    }));
  };

  const calculateSimulatedIFT = () => {
    let ift = baseIFT;
    Object.values(deltas).forEach((delta) => {
      ift += delta;
    });
    return Math.max(0.05, Math.round(ift * 100) / 100);
  };

  const simulatedIFT = calculateSimulatedIFT();
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
