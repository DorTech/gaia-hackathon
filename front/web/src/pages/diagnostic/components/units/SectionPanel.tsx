import React from 'react';
import { type SxProps, type Theme } from '@mui/material';
import { Section } from './Section';
import { SectionCard } from './SectionCard';

interface SectionPanelProps {
  title: string;
  summary?: string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  cardSx?: SxProps<Theme>;
}

export const SectionPanel: React.FC<SectionPanelProps> = ({
  title,
  summary,
  children,
  className,
  defaultExpanded = true,
  cardSx,
}) => {
  return (
    <Section title={title} summary={summary} className={className} defaultExpanded={defaultExpanded}>
      <SectionCard sx={cardSx}>{children}</SectionCard>
    </Section>
  );
};
