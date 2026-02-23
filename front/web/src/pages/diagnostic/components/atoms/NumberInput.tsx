import React from 'react';
import { TextField } from '@mui/material';

interface NumberInputProps {
  value: number;
  step?: number;
  min?: number;
  onChange: (value: number) => void;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  step,
  min,
  onChange,
}) => {
  return (
    <TextField
      type="number"
      className="finp"
      value={value}
      size="small"
      fullWidth
      inputProps={{ step, min }}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '10px',
          backgroundColor: 'white',
          fontSize: '.78rem',
        },
      }}
    />
  );
};
