import React from 'react';
import { Box } from '@mui/material';
import { FieldLabel } from '../atoms/FieldLabel';

interface FieldProps {
  label: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({ label, disabled = false, children }) => {
  const childWithDisabled = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const childProps = child.props as { disabled?: boolean };
    const nextDisabled = disabled || childProps.disabled;

    return React.cloneElement(child as React.ReactElement<{ disabled?: boolean }>, {
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
        border: '1px solid var(--border)',
        borderRadius: '10px',
        padding: '10px 12px',
        backgroundColor: 'var(--white)',
        opacity: disabled ? 0.55 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <FieldLabel label={label} />
      {childWithDisabled}
    </Box>
  );
};
