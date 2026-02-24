import React from 'react';
import { Box, Typography } from '@mui/material';
import { SummaryStatProps } from '../types';

export const SummaryStat: React.FC<SummaryStatProps> = ({ label, value, color }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          fontSize: '0.62rem',
          fontWeight: 600,
          color: 'var(--text2)',
          marginBottom: '3px'
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: '1.45rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: color || 'var(--orange)'
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};
