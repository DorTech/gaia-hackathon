import React from 'react';
import { Box, Typography } from '@mui/material';
import { PageHeaderProps } from '../types';

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <Box sx={{ marginBottom: '16px' }}>
      <Typography
        variant="h5"
        sx={{
          fontSize: '1.1rem',
          fontWeight: 800,
          color: 'var(--text)',
          letterSpacing: '-0.02em',
          marginBottom: '2px'
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.72rem',
          color: 'var(--text2)',
          fontWeight: 400
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};
