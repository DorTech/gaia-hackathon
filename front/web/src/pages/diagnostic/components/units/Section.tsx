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
      sx={{ boxShadow: 'none', '&::before': { display: 'none' } }}
      style={style}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className="fsec-title" sx={{ fontSize: '.78rem', fontWeight: 800 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};
