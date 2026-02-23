import React from 'react';
import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ChipGroupProps {
  options: readonly string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selectedIndex,
  onSelect,
}) => {
  return (
    <ToggleButtonGroup
      exclusive
      className="chips"
      value={selectedIndex}
      onChange={(_, value: number | null) => {
        if (value !== null) {
          onSelect(value);
        }
      }}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        '& .MuiToggleButtonGroup-grouped': {
          borderRadius: '999px !important',
          border: '1px solid var(--border2)',
          color: 'var(--text2)',
          px: 1.25,
          py: 0.5,
          textTransform: 'none',
          fontSize: '.72rem',
          fontWeight: 700,
        },
      }}
    >
      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
        {options.map((label, idx) => (
          <ToggleButton
            key={idx}
            className={'chip ' + (selectedIndex === idx ? 'on' : '')}
            value={idx}
            selected={selectedIndex === idx}
            sx={{
              '&.Mui-selected': {
                bgcolor: 'var(--green-l)',
                borderColor: 'var(--green)',
                color: 'var(--green-d)',
              },
              '&.Mui-selected:hover': {
                bgcolor: 'var(--green-l)',
              },
            }}
          >
            {label}
          </ToggleButton>
        ))}
      </Stack>
    </ToggleButtonGroup>
  );
};
