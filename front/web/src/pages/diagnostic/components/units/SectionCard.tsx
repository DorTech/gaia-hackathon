import React from 'react';
import { Paper, SxProps, Theme } from '@mui/material';

interface SectionCardProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

export const SectionCard: React.FC<SectionCardProps> = ({ children, sx }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 2.5,
        border: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};