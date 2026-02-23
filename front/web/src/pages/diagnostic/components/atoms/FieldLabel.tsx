import React from 'react';
import { Box, Typography } from '@mui/material';

interface FieldLabelProps {
  label: string;
  reference?: string;
}

export const FieldLabel: React.FC<FieldLabelProps> = ({ label, reference }) => {
  return (
    <Box className="flbl" sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
      <Typography component="span" sx={{ fontSize: '.73rem', fontWeight: 700, color: 'var(--txt)' }}>
        {label}
      </Typography>
      {reference ? (
        <Typography component="span" className="fref" sx={{ fontSize: '.65rem', color: 'var(--muted)' }}>
          {reference}
        </Typography>
      ) : null}
    </Box>
  );
};
