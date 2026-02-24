import React from 'react';
import { Box, Chip } from '@mui/material';
import { FieldLabel } from '../atoms/FieldLabel';

interface FieldProps {
  label: string;
  disabled?: boolean;
  prefilled?: boolean;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, disabled = false, prefilled = false, children }) => {
  const childWithDisabled = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childProps = child.props as { disabled?: boolean };
    const nextDisabled = disabled || childProps.disabled;

    return React.cloneElement(child as React.ReactElement<{ disabled?: boolean }>, {
      ...childProps,
      disabled: nextDisabled,
    });
  });

  return (
    <Box
      className="fld"
      aria-disabled={disabled}
      sx={{
        display: 'grid',
        gap: 0.6,
        border: prefilled ? '1.5px solid #4caf50' : '1px solid var(--border)',
        borderRadius: '10px',
        padding: '10px 12px',
        backgroundColor: prefilled ? 'rgba(76, 175, 80, 0.04)' : 'var(--white)',
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
        transition: 'border-color 0.3s, background-color 0.3s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FieldLabel label={label} />
        {prefilled && (
          <Chip
            label="Auto"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              fontWeight: 600,
              backgroundColor: '#4caf50',
              color: '#fff',
            }}
          />
        )}
      </Box>
      {childWithDisabled}
    </Box>
  );
};
