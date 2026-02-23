import React from 'react';
import { Box, Typography } from '@mui/material';

interface ThresholdSummaryProps {
  thresholdLabel: string;
  multiplier: string;
  referenceCount: number;
  totalCount: number;
}

export const ThresholdSummary: React.FC<ThresholdSummaryProps> = ({
  thresholdLabel,
  multiplier,
  referenceCount,
  totalCount,
}) => {
  return (
    <Box
      sx={{
        background: 'var(--teal-l)',
        border: '1px solid #A8D8D8',
        borderRadius: '8px',
        padding: '9px 13px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        fontSize: '.73rem',
      }}
    >
      <Box component="span" sx={{ fontSize: '1rem' }}>🎯</Box>
      <Typography component="div">
        Seuil retenu : <b>IFT ≤ {thresholdLabel}</b> (médiane 2,30 × {multiplier}) ·
        <b style={{ color: '#1F9595' }}>{referenceCount} fermes référence</b> identifiées sur {totalCount} ·
        <Box component="span" sx={{ color: 'var(--text2)' }}>
          Ces fermes constituent votre feuille de route
        </Box>
      </Typography>
    </Box>
  );
};
