import React from 'react';
import { Box, Typography } from '@mui/material';

interface FieldLabelProps {
  label: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ label }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text)' }}>
        {label}
      </Typography>
    </Box>
  );
};
