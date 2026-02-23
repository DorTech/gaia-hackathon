import React from 'react';
import { Box } from '@mui/material';
import { FieldLabel } from '../atoms/FieldLabel';

interface FieldProps {
  label: string;
  reference?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, reference, children }) => {
  return (
    <Box className="fld">
      <FieldLabel label={label} reference={reference} />
      {children}
    </Box>
  );
};
