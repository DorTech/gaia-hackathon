import { Box, Card, Stack, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { iftMedianValueAtom } from '../../../store/referenceAtoms';
import { getIFTColor } from '../../../utils/ift';
import { SummaryBarProps } from '../types';

export const SummaryBar: React.FC<SummaryBarProps> = ({
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
        padding: '12px 16px',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}
    >
      {/* IFT Actuel */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: '3px',
          }}
        >
          IFT actuel
        </Typography>
        <Typography
          sx={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--orange)',
          }}
        >
          {baseIFT.toFixed(2)}
        </Typography>
      </Box>
      <Typography sx={{ fontSize: '1.2rem', color: 'var(--text3)' }}>→</Typography>

      <Box sx={{ textAlign: 'center', opacity: simulating ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <Typography
          sx={{
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: '3px',
          }}
        >
          IFT simulé
        </Typography>
        <Typography
          sx={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: getIFTColor(simulatedIFT, iftMedian),
          }}
        >
          {simulatedIFT.toFixed(2)}
        </Typography>
      </Box>

      <Typography sx={{ fontSize: '1.2rem', color: 'var(--text3)' }}>·</Typography>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--text2)',
            marginBottom: '3px',
          }}
        >
          Amélioration
        </Typography>
        <Typography
          sx={{
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: gained > 0 ? 'var(--green-d)' : 'var(--text3)',
          }}
        >
          {gained > 0 ? `−${gainPct}%` : '—'}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '1px',
          backgroundColor: 'var(--border)',
          alignSelf: 'stretch',
          margin: '0 8px',
        }}
      />

      <Stack direction="row" spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.62rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '3px',
            }}
          >
            Médiane Dép. 35
          </Typography>
          <Typography
            sx={{
              fontSize: '1.45rem',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: 'var(--text2)',
            }}
          >
            {iftMedian.toFixed(2).replace('.', ',')}
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: '0.62rem',
              fontWeight: 600,
              color: 'var(--text2)',
              marginBottom: '3px',
            }}
          >
            Leviers actifs
          </Typography>
          <Typography
            sx={{
              fontSize: '1.45rem',
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
