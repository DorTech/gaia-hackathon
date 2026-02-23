import React from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

interface DiagnosticHeaderProps {
  onReset: () => void;
}

export const DiagnosticHeader: React.FC<DiagnosticHeaderProps> = ({ onReset }) => {
  return (
    <Box className="page-hd" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}>
      <Box>
        <Typography component="h1" sx={{ fontSize: '1.25rem', fontWeight: 800, mb: 0.5 }}>
          Mon diagnostic ITK
        </Typography>
        <Typography sx={{ fontSize: '.78rem', color: 'var(--muted)' }}>
          Renseignez votre itinéraire technique · Le modèle Random Forest prédit votre IFT en temps réel
        </Typography>
      </Box>
      <Stack className="page-hd-right" direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack className="steps" direction="row" spacing={0.8} alignItems="center">
          <Chip className="step done" label="✓ Benchmark" size="small" color="success" variant="outlined" />
          <Typography className="step-sep" component="span" sx={{ color: 'var(--muted)' }}>›</Typography>
          <Chip className="step active" label="2 Mon ITK" size="small" color="success" />
          <Typography className="step-sep" component="span" sx={{ color: 'var(--muted)' }}>›</Typography>
          <Chip className="step" label="3 Simulation" size="small" variant="outlined" />
        </Stack>
        <Button className="btn btn-outline" variant="outlined" size="small" onClick={onReset}>
          ↺ Reset
        </Button>
        <Button className="btn btn-green" variant="contained" color="success" size="small">
          Simuler →
        </Button>
      </Stack>
    </Box>
  );
};
