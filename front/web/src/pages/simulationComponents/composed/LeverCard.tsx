import React from 'react';
import { Box, Card, Typography } from '@mui/material';
import { LeverCardProps } from '../types';
import { BadgeType } from '../atomic';
import { LeverOptions } from './LeverOptions';

export const LeverCard: React.FC<LeverCardProps> = ({ lever, delta, onPickOption }) => {
  return (
    <Card
      sx={{
        backgroundColor: delta && delta !== 0 ? 'var(--green-ll)' : 'white',
        border: '1px solid var(--border)',
        borderColor: delta && delta !== 0 ? 'var(--green)' : 'var(--border)',
        borderRadius: '9px',
        padding: '12px 14px',
        marginBottom: '8px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '12px',
        alignItems: 'start',
        cursor: 'default',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        '&:hover': {
          borderColor: 'var(--green)',
        },
      }}
    >
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--text)',
            }}
          >
            {lever.name}
          </Typography>
          <BadgeType type={lever.type} />
        </Box>
        <LeverOptions lever={lever} delta={delta} onPickOption={onPickOption} />
      </Box>
    </Card>
  );
};
