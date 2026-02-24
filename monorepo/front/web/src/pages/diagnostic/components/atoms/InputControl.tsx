import React from 'react';
import { TextField } from '@mui/material';

interface InputControlProps {
  type: 'text' | 'number';
  value: string | number;
  placeholder?: string;
  min?: number;
  max?: number;
  onChange: (value: string | number) => void;
}

export const InputControl: React.FC<InputControlProps> = ({
  type,
  value,
  placeholder,
  min,
  max,
  onChange,
}) => {
  return (
    <TextField
      size="small"
      fullWidth
      type={type}
      value={value}
      placeholder={placeholder}
      inputProps={{ min, max }}
      onChange={(e) => {
        if (type === 'number') {
          const n = parseInt(e.target.value, 10);
          if (!isNaN(n)) onChange(n);
        } else {
          onChange(e.target.value);
        }
      }}
      sx={{
        '& .MuiInputBase-input': {
          typography: 'body2',
        },
      }}
    />
  );
};
