import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

interface SliderControlProps {
  minLabel: string;
  maxLabel: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export const SliderControl: React.FC<SliderControlProps> = ({
  minLabel,
  maxLabel,
  value,
  min,
  max,
  unit,
  disabled = false,
  onChange,
}) => {
  return (
    <Box className="slider-w">
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: 'var(--text3)' }}>
          {minLabel}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: 'var(--green-d)' }}>
          {value}{unit ? ` ${unit}` : ''}
        </Typography>
        <Typography variant="caption" sx={{ color: 'var(--text3)' }}>
          {maxLabel}
        </Typography>
      </Box>
      <Slider
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        valueLabelDisplay="auto"
        size="small"
        onChange={(_, nextValue) => onChange(Array.isArray(nextValue) ? nextValue[0] : nextValue)}
        sx={{
          mt: 0.5,
          color: disabled ? 'var(--text3)' : 'var(--green)',
          '& .MuiSlider-rail': {
            opacity: 1,
            backgroundColor: 'var(--border2)',
          },
          '& .MuiSlider-track': {
            border: 'none',
            backgroundColor: disabled ? 'var(--text3)' : 'var(--green)',
          },
          '& .MuiSlider-thumb': {
            width: 14,
            height: 14,
            backgroundColor: 'var(--white)',
            border: `1px solid ${disabled ? 'var(--text3)' : 'var(--green)'}`,
          },
        }}
      />
    </Box>
  );
};
