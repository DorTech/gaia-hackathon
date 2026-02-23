import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface BenchmarkHeaderProps {
  departmentCode: string;
  species: string;
  onGoToDiagnostic: () => void;
}

export const BenchmarkHeader: React.FC<BenchmarkHeaderProps> = ({
  departmentCode,
  species,
  onGoToDiagnostic,
}) => {
  return (
    <Box className="page-hd">
      <Box>
        <Typography component="h1">Benchmark régional — Dép. {departmentCode} · {species}</Typography>
        <Typography component="p">
          Identification des fermes les plus performantes sur l'IFT · Campagne 2023–2024
        </Typography>
      </Box>
      <Box className="page-hd-right">
        <Button className="btn btn-outline" onClick={onGoToDiagnostic}>Mon ITK →</Button>
      </Box>
    </Box>
  );
};
