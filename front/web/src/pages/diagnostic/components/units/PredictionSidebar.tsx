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
  const iftColor = getIFTColor(predictedIFT, iftMedian);

  return (
    <Box sx={{ position: 'sticky', top: 16 }}>
      <Paper
        className="ift-card"
        elevation={0}
        sx={{
          p: 2,
          borderRadius: 2,
          mb: 1.25,
          transition: 'box-shadow 220ms ease, transform 220ms ease',
          transform: predicting ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        <Typography
          variant="caption"
          className="ift-card-lbl"
          sx={{ color: 'var(--text2)', transition: 'opacity 180ms ease', opacity: predicting ? 0.9 : 1 }}
        >
          IFT total prédit
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '24px auto 24px',
            alignItems: 'center',
            minHeight: 34,
            columnGap: 1,
          }}
        >
          <Box sx={{ width: 24, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress
              size={18}
              sx={{
                color: 'var(--green)',
                opacity: predicting ? 1 : 0,
                transition: 'opacity 180ms ease',
              }}
            />
          </Box>
          <Typography
            className="ift-card-val"
            sx={{
              color: iftColor,
              typography: 'h5',
              fontWeight: 800,
              transition: 'color 220ms ease, transform 220ms ease, opacity 180ms ease',
              textAlign: 'center',
              transform: predicting ? 'scale(0.99)' : 'scale(1)',
              opacity: predicting ? 0.92 : 1,
            }}
          >
            {predictedIFT.toFixed(2)}
            <Typography
              component="span"
              variant="body2"
              className="ift-card-unit"
              sx={{
                ml: 0.5,
                fontWeight: 700,
                opacity: predicting ? 0.65 : 1,
                transition: 'opacity 180ms ease',
              }}
            >
              IFT
            </Typography>
          </Typography>
          <Box sx={{ width: 24 }} />
        </Box>
        <Box className="gauge-wrap" sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={getGaugePct(predictedIFT, iftMax)}
            className="gauge-trk"
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'var(--border2)',
              transition: 'opacity 180ms ease',
              opacity: predicting ? 0.9 : 1,
              '& .MuiLinearProgress-bar': {
                backgroundColor: iftColor,
                transition: 'transform 260ms ease, background-color 220ms ease',
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
        <Typography
          variant="caption"
          className="ift-card-sub"
          sx={{ mt: 1, color: 'var(--text2)', transition: 'opacity 180ms ease', opacity: predicting ? 0.9 : 1 }}
        >
          {predicting ? 'Calcul en cours…' : 'Prédiction via modèle ML'}
        </Typography>
      </Paper>
    </Box>
  );
};
