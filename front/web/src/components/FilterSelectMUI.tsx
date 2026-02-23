import React from 'react';
import { FormControl, MenuItem, Select, type SelectChangeEvent } from '@mui/material';

interface FilterSelectMUIProps {
  label: string;
  value: string;
  options: string[];
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FilterSelectMUI: React.FC<FilterSelectMUIProps> = ({
  label,
  value,
  options,
  ariaLabel,
  onChange,
  placeholder,
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
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: 'var(--text3)' }}>{placeholder || label}</span>;
            }
            return selected;
          }}
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
