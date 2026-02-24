import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';

interface SectionProps {
  title: string;
  className?: string;
  style?: React.CSSProperties;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  className,
  style,
  defaultExpanded = true,
  children,
}) => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      className={'fsec' + (className ? ` ${className}` : '')}
      sx={{
        boxShadow: 'none',
        '&::before': { display: 'none' },
        borderRadius: 2,
      }}
      style={style}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1.5, minHeight: 44 }}>
        <Typography variant="subtitle2" className="fsec-title" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pt: 0.5 }}>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};
