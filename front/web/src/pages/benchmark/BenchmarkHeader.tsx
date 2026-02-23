import { Box, Typography } from '@mui/material';
import React from 'react';

interface BenchmarkHeaderProps {
  departmentCode: string;
  species: string;
}

export const BenchmarkHeader: React.FC<BenchmarkHeaderProps> = ({ departmentCode, species }) => {
  return (
    <Box className="page-hd">
      <Box>
        <Typography component="h1">
          Benchmark — Dép. {departmentCode} · {species}
        </Typography>
        <Typography component="p">
          Identification des fermes les plus performantes sur l&apos;IFT
        </Typography>
      </Box>
    </Box>
  );
};
