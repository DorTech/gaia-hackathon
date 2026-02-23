import React from 'react';
import { Box, Typography } from '@mui/material';

interface SectionProps {
  title: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, className, style, children }) => {
  return (
    <Box className={'fsec' + (className ? ` ${className}` : '')} style={style}>
      <Typography className="fsec-title" sx={{ fontSize: '.78rem', fontWeight: 800, mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
};
