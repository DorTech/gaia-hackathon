import { Box, CircularProgress, LinearProgress, Paper, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import React from 'react';
import { predictingAtom } from '../../../../store/diagnosticAtoms';
import { iftMaxGaugeAtom, iftMedianValueAtom } from '../../../../store/referenceAtoms';
import { getGaugePct, getIFTColor } from '../../../../utils/ift';

interface PredictionSidebarProps {
  predictedIFT: number;
}

export const PredictionSidebar: React.FC<PredictionSidebarProps> = ({ predictedIFT }) => {
  const iftMedian = useAtomValue(iftMedianValueAtom);
  const iftMax = useAtomValue(iftMaxGaugeAtom);
  const predicting = useAtomValue(predictingAtom);

  return (
    <Box>
      <Paper className="ift-card" elevation={0} sx={{ p: 1.5, borderRadius: 2, mb: 1.25 }}>
        <Typography className="ift-card-lbl" sx={{ fontSize: '.7rem', color: 'var(--muted)' }}>
          IFT total prédit
        </Typography>
        <Typography
          className="ift-card-val"
          sx={{
            color: getIFTColor(predictedIFT, iftMedian),
            fontSize: '1.55rem',
            fontWeight: 900,
          }}
        >
          {predicting ? (
            <CircularProgress size={20} sx={{ color: 'var(--green)', mr: 1 }} />
          ) : null}
          {predictedIFT.toFixed(2)}
          <Box
            component="span"
            className="ift-card-unit"
            sx={{ ml: 0.5, fontSize: '.78rem', fontWeight: 700, opacity: predicting ? 0.5 : 1 }}
          >
            IFT
          </Box>
        </Typography>
        <Box className="gauge-wrap" sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={getGaugePct(predictedIFT, iftMax)}
            className="gauge-trk"
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'var(--line)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getIFTColor(predictedIFT, iftMedian),
              },
            }}
          />
          <Box
            className="gauge-tks"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 0.5,
              fontSize: '.62rem',
              color: 'var(--muted)',
            }}
          >
            <span>0</span>
            <span>Méd {iftMedian.toFixed(1).replace('.', ',')}</span>
            <span>{iftMax}+</span>
          </Box>
        </Box>
        <Typography
          className="ift-card-sub"
          sx={{ mt: 1, fontSize: '.68rem', color: 'var(--muted)' }}
        >
          {predicting ? 'Calcul en cours…' : 'Prédiction via modèle ML'}
        </Typography>
      </Paper>
    </Box>
  );
};
