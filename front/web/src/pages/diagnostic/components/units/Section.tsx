import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';

interface SectionProps {
  title: string;
  summary?: string;
  className?: string;
  style?: React.CSSProperties;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
  title,
  summary,
  className,
  style,
  defaultExpanded = true,
  children,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      className={'fsec' + (className ? ` ${className}` : '')}
      sx={{
        boxShadow: 'none',
        '&::before': { display: 'none' },
        borderRadius: 2,
      }}
      style={style}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 1.5, minHeight: 44 }}>
        <Box sx={{ display: 'grid', gap: 0.25, width: '100%', minWidth: 0, pr: 0.5 }}>
          <Typography
            variant="subtitle2"
            className="fsec-title"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              display: 'inline-flex',
              width: 'fit-content',
              mb: 0,
            }}
          >
            {title}
          </Typography>
          {summary && !isExpanded ? (
            <Typography
              variant="caption"
              sx={{
                color: 'var(--text3)',
                minWidth: 0,
                width: '100%',
                maxHeight: '1.1rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.4,
              }}
            >
              {summary}
            </Typography>
          ) : null}
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 1.5, pt: 0.5 }}>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};
