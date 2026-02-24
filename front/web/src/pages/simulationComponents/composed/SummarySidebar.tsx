import { Box, Card, Stack, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { iftMedianValueAtom } from '../../../store/referenceAtoms';
import { getIFTColor } from '../../../utils/ift';
import { SummaryBarProps } from '../types';

export const SummarySidebar: React.FC<SummaryBarProps> = ({
  baseIFT,
  simulatedIFT,
  gained,
  gainPct,
  activeLeverCount,
  simulating,
}) => {
  const iftMedian = useAtomValue(iftMedianValueAtom);

  return (
    <Card
      sx={{
        backgroundColor: 'white',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '16px',
        position: 'sticky',
        top: '84px',
        height: 'fit-content',
      }}
    >
      <Typography
        sx={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'var(--text1)',
          marginBottom: '16px',
          textAlign: 'center',
        }}
      >
        Résumé de simulation
      </Typography>

      <Stack spacing={2}>
        {/* IFT Actuel */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            IFT actuel
          </Typography>
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--orange)',
            }}
          >
            {baseIFT.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid var(--border)' }} />

        {/* IFT Simulé */}
        <Box
          sx={{ textAlign: 'center', opacity: simulating ? 0.5 : 1, transition: 'opacity 0.2s' }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            IFT simulé
          </Typography>
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: getIFTColor(simulatedIFT, iftMedian),
            }}
          >
            {simulatedIFT.toFixed(2)}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid var(--border)' }} />

        {/* Amélioration */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Amélioration
          </Typography>
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: gained > 0 ? 'var(--green-d)' : 'var(--text3)',
            }}
          >
            {gained > 0 ? `−${gainPct}%` : '—'}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid var(--border)' }} />

        {/* Médiane Dép. */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Médiane
          </Typography>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--text2)',
            }}
          >
            {iftMedian.toFixed(2).replace('.', ',')}
          </Typography>
        </Box>

        <Box sx={{ borderBottom: '1px solid var(--border)' }} />

        {/* Leviers actifs */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Leviers actifs
          </Typography>
          <Typography
            sx={{
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--teal)',
            }}
          >
            {activeLeverCount}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
};
