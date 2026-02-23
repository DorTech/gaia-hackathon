import { Box, Typography } from '@mui/material';
import React from 'react';

export const DiagnosticHeader: React.FC = () => {
  return (
    <Box
      className="page-hd"
      sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start' }}
    >
      <Box>
        <Typography component="h1" sx={{ fontSize: '1.25rem', fontWeight: 800, mb: 0.5 }}>
          Mon diagnostic ITK
        </Typography>
        <Typography sx={{ fontSize: '.78rem', color: 'var(--muted)' }}>
          Renseignez votre itinéraire technique · Le modèle Random Forest prédit votre IFT en temps
          réel
        </Typography>
      </Box>
    </Box>
  );
};
