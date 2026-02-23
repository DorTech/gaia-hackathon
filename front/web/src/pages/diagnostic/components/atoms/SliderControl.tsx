import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

interface SliderControlProps {
  minLabel: string;
  maxLabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  minLabel,
  maxLabel,
  value,
  min,
  max,
  onChange,
}) => {
  return (
    <Box className="slider-w">
      <Box className="slider-top" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography component="span" className="cap" sx={{ fontSize: '.67rem', color: 'var(--muted)' }}>
          {minLabel}
        </Typography>
        <Typography component="span" className="slider-val" sx={{ fontSize: '.78rem', fontWeight: 800, color: 'var(--green-d)' }}>
          {value}
        </Typography>
        <Typography component="span" className="cap" sx={{ fontSize: '.67rem', color: 'var(--muted)' }}>
          {maxLabel}
        </Typography>
      </Box>
      <Slider
        className="fslider"
        min={min}
        max={max}
        value={value}
        valueLabelDisplay="auto"
        size="small"
        onChange={(_, nextValue) => onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)}
        sx={{
          mt: 0.5,
          color: 'var(--green)',
          '& .MuiSlider-thumb': {
            width: 14,
            height: 14,
          },
        }}
      />
    </Box>
  );
};
