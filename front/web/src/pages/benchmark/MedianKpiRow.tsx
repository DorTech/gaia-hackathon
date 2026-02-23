import React from 'react';
import { Box, Typography } from '@mui/material';
import type { MedianKpi } from '../../data/benchmark';

interface MedianKpiRowProps {
  kpis: MedianKpi[];
}

export const MedianKpiRow: React.FC<MedianKpiRowProps> = ({ kpis }) => {
  return (
    <Box className="kpi-row">
      {kpis.map((kpi) => (
        <Box key={kpi.id} className={`kpi ${kpi.variant}`}>
          <Typography className="kpi-label" component="div">
            {kpi.label}
          </Typography>
          <Box className={`kpi-val ${kpi.variant}`}>
            {kpi.value}
            <Box
              component="span"
              sx={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text3)' }}
            >
              {'   ' + kpi.unit}
            </Box>
          </Box>
          <Typography className="kpi-sub" component="div" paddingTop={'5px'} paddingBottom={'5px'}>
            {kpi.sub}
          </Typography>
          <Typography className={`kpi-delta ${kpi.deltaClass}`} component="div">
            {kpi.delta}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
