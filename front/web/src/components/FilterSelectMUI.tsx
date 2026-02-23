import React from 'react';
import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

interface FilterSelectMUIProps {
  label: string;
  value: string;
  options: string[];
  ariaLabel: string;
  onChange: (value: string) => void;
}

export const FilterSelectMUI: React.FC<FilterSelectMUIProps> = ({
  label,
  value,
  options,
  ariaLabel,
  onChange,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value as string);
  };

  return (
    <div className="fg">
      <div className="fg-label">{label}</div>
      <FormControl size="small" fullWidth>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': ariaLabel }}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
