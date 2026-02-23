import React from 'react';
import { Chip } from '@mui/material';
import { BadgeTypeProps } from '../types';

export const BadgeType: React.FC<BadgeTypeProps> = ({ type }) => {
  const isQuantitatif = type === 'Quantitatif';
  return (
    <Chip
      label={type}
      size="small"
      sx={{
        height: '20px',
        fontSize: '0.55rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        marginLeft: '5px',
        backgroundColor: isQuantitatif ? '#c2dcfa' : '#dac1fa',
        color: isQuantitatif ? '#2972bb' : '#7945ae',
      }}
    />
  );
};
