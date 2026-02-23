import React from 'react';
import { useAtomValue } from 'jotai';
import { Box, Button, LinearProgress, Paper, Typography } from '@mui/material';
import {
  iftReferenceValueAtom,
  iftMedianValueAtom,
  iftMaxGaugeAtom,
} from '../../../../store/referenceAtoms';
import { getIFTColor, getGaugePct } from '../../../../utils/ift';
import type { ITKFormState } from '../../../../store/diagnosticAtoms';

interface PredictionSidebarProps {
  predictedIFT: number;
  form: ITKFormState;
}

export const PredictionSidebar: React.FC<PredictionSidebarProps> = ({
  predictedIFT,
  form,
}) => {
  const iftRef = useAtomValue(iftReferenceValueAtom);
  const iftMedian = useAtomValue(iftMedianValueAtom);
  const iftMax = useAtomValue(iftMaxGaugeAtom);

  const vmed = (((predictedIFT - iftMedian) / iftMedian) * 100).toFixed(1);
  const vref = (((predictedIFT - iftRef) / iftRef) * 100).toFixed(1);

  return (
    <Box>
      <Paper className="ift-card" elevation={0} sx={{ p: 1.5, borderRadius: 2, mb: 1.25 }}>
        <Typography className="ift-card-lbl" sx={{ fontSize: '.7rem', color: 'var(--muted)' }}>
          IFT total prédit · Modèle RF
        </Typography>
        <Typography
          className="ift-card-val"
          sx={{ color: getIFTColor(predictedIFT, iftRef, iftMedian), fontSize: '1.55rem', fontWeight: 900 }}
        >
          {predictedIFT.toFixed(2)}
          <Box component="span" className="ift-card-unit" sx={{ ml: 0.5, fontSize: '.78rem', fontWeight: 700 }}>
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
                backgroundColor: getIFTColor(predictedIFT, iftRef, iftMedian),
              },
            }}
          />
          <Box className="gauge-tks" sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5, fontSize: '.62rem', color: 'var(--muted)' }}>
            <span>0</span>
            <span>Réf {iftRef.toFixed(2).replace('.', ',')}</span>
            <span>Méd {iftMedian.toFixed(1).replace('.', ',')}</span>
            <span>{iftMax}+</span>
          </Box>
        </Box>
        <Typography className="ift-card-sub" sx={{ mt: 1, fontSize: '.68rem', color: 'var(--muted)' }}>
          Prédiction basée sur les variables ITK saisies
        </Typography>
      </Paper>

      <Paper className="card" elevation={0} sx={{ p: 1.5, borderRadius: 2, mb: 1.25 }}>
        <Typography className="card-title" sx={{ mb: 1.25, fontSize: '.78rem', fontWeight: 800 }}>📉 Décomposition</Typography>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">Rotation</span><span className="v v-teal">{form.rotation}</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">Fertilisation</span><span className="v v-warn">{form.fertilization} kg/ha</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">Travail du sol</span><span className="v">{['Labour', 'TCS', 'Semis direct'][form.soilWork] ?? 'Labour'}</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">Désherbage</span><span className="v">{form.hasWeeding === 1 ? `Oui (${form.weedingPassages} passages)` : 'Non'}</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}>
          <span className="k">vs médiane ({iftMedian.toFixed(2).replace('.', ',')})</span>
          <span className="v" style={{ color: parseFloat(vmed) > 0 ? 'var(--orange)' : 'var(--green-d)' }}>{parseFloat(vmed) > 0 ? '+' : ''}{vmed}%</span>
        </Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">vs référence ({iftRef.toFixed(2).replace('.', ',')})</span><span className="v v-bad">{parseFloat(vref) > 0 ? '+' : ''}{vref}%</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between' }}><span className="k">Potentiel estimé</span><span className="v v-good">−40 à −45%</span></Box>
      </Paper>

      <Paper className="card card-bg-green" elevation={0} sx={{ p: 1.5, borderRadius: 2 }}>
        <Typography className="card-title" sx={{ marginBottom: '10px', fontSize: '.78rem', fontWeight: 800 }}>
          🌍 Indicateurs complémentaires
        </Typography>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">👥 Nombre UTH</span><span className="v v-warn">{form.uth}</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.6 }}><span className="k">🧫 Recours biologiques</span><span className="v" style={{ color: 'var(--violet)' }}>{form.biologicalControl === 1 ? 'Oui' : 'Non'}</span></Box>
        <Box className="cr" sx={{ display: 'flex', justifyContent: 'space-between' }}><span className="k">🪱 Recours macroorganismes</span><span className="v v-warn">{form.macroorganisms === 1 ? 'Oui' : 'Non'}</span></Box>
      </Paper>

      <Button
        className="btn btn-green"
        variant="contained"
        color="success"
        style={{
          width: '100%',
          padding: '9px',
          marginTop: '10px',
          fontSize: '.78rem',
          justifyContent: 'center',
        }}
      >
        ⚡ Simuler les leviers →
      </Button>
    </Box>
  );
};
