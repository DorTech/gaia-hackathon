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
    <Box sx={{ position: 'sticky', top: 16 }}>
      <Paper className="ift-card" elevation={0} sx={{ p: 2, borderRadius: 2, mb: 1.25 }}>
        <Typography variant="caption" className="ift-card-lbl" sx={{ color: 'var(--text2)' }}>
          IFT total prédit
        </Typography>
        <Typography
          className="ift-card-val"
          sx={{
            color: getIFTColor(predictedIFT, iftMedian),
            typography: 'h5',
            fontWeight: 800,
          }}
        >
          {predicting ? (
            <CircularProgress size={20} sx={{ color: 'var(--green)', mr: 1 }} />
          ) : null}
          {predictedIFT.toFixed(2)}
          <Typography
            component="span"
            variant="body2"
            className="ift-card-unit"
            sx={{ ml: 0.5, fontWeight: 700, opacity: predicting ? 0.5 : 1 }}
          >
            IFT
          </Typography>
        </Typography>
        <Box className="gauge-wrap" sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={getGaugePct(predictedIFT, iftMax)}
            className="gauge-trk"
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'var(--border2)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getIFTColor(predictedIFT, iftMedian),
              },
            }}
          />
          <Box className="gauge-tks" sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'var(--text3)' }}>
              0
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text3)' }}>
              Méd {iftMedian.toFixed(1).replace('.', ',')}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text3)' }}>
              {iftMax}+
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" className="ift-card-sub" sx={{ mt: 1, color: 'var(--text2)' }}>
          {predicting ? 'Calcul en cours…' : 'Prédiction via modèle ML'}
        </Typography>
      </Paper>
    </Box>
  );
};
