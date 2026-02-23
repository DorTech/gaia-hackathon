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
        backgroundColor: isQuantitatif ? '#EBF3FC' : '#F2ECFA',
        color: isQuantitatif ? '#3A82C8' : '#9966CC'
      }}
    />
  );
};
