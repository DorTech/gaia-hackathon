import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import type { PracticeProfileItem } from '../../types/benchmark';

interface PracticeProfileCardProps {
  title: string;
  items: PracticeProfileItem[];
}

// ── Helpers ──

const parseValue = (val: string): number | null => {
  const num = parseFloat(val.replace(',', '.'));
  return isNaN(num) ? null : num;
};

const isValidQuantitativeValue = (value: string | undefined): boolean => {
  if (!value || value === '—') return false;
  const parsed = parseValue(value);
  return parsed !== null && parsed !== -1 && value !== '-1';
};

const calculateDiff = (refVal: number, myVal: number): number | null => {
  return refVal !== 0 ? ((myVal - refVal) / refVal) * 100 : null;
};

// ── Qualitative Item ──

interface QualitativeItemProps {
  item: PracticeProfileItem;
}

const QualitativeItem: React.FC<QualitativeItemProps> = ({ item }) => {
  if (!item.frequencies || item.frequencies.length === 0) {
    return (
      <Typography sx={{ fontSize: '1rem', color: 'var(--text3)', py: 1 }}>
        Données non disponibles
      </Typography>
    );
  }

  return (
    <>
      {item.frequencies.map((frequency) => {
        const isMyPosition = item.note && frequency.label === item.note.value;
        return (
          <Box key={frequency.label} className="fr">
            <Tooltip title={frequency.label} arrow enterDelay={300} placement="top">
              <Box
                className="fr-lbl"
                sx={{
                  fontSize: '1rem',
                  minWidth: '180px',
                  flex: '0 0 180px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {frequency.label}
                {isMyPosition && (
                  <Box
                    component="span"
                    sx={{
                      marginLeft: '6px',
                      color: 'var(--green-d)',
                      fontSize: '1.3rem',
                      fontWeight: 700,
                    }}
                  >
                    ←
                  </Box>
                )}
              </Box>
            </Tooltip>
            <Box className="fr-trk" sx={{ flex: '1 1 auto' }}>
              <Box
                className={`fr-fil ${frequency.top ? 'top' : ''}`}
                sx={{ width: `${frequency.pct}%` }}
              ></Box>
            </Box>
            <Box className="fr-pct">{frequency.pct}%</Box>
          </Box>
        );
      })}
    </>
  );
};

// ── Quantitative Item ──

interface QuantitativeItemProps {
  item: PracticeProfileItem;
}

const QuantitativeItem: React.FC<QuantitativeItemProps> = ({ item }) => {
  if (!item.quantitative) return null;

  const isValid = isValidQuantitativeValue(item.quantitative.value);

  if (!isValid) {
    return (
      <Typography sx={{ fontSize: '1rem', color: 'var(--text3)', py: 1 }}>
        Données non disponibles
      </Typography>
    );
  }

  const refVal = parseValue(item.quantitative.value)!;

  return (
    <>
      <Typography className="qv" component="div" fontSize={'1.6rem'}>
        {item.quantitative.value}{' '}
        <span style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--text3)' }}>
          {item.quantitative.unit}
        </span>
      </Typography>
      {item.quantitative.myValue && <ComparisonBox refVal={refVal} item={item} />}
    </>
  );
};

// ── Comparison Box ──

interface ComparisonBoxProps {
  refVal: number;
  item: PracticeProfileItem;
}

const ComparisonBox: React.FC<ComparisonBoxProps> = ({ refVal, item }) => {
  if (!item.quantitative?.myValue) return null;

  const myVal = parseValue(item.quantitative.myValue);
  if (myVal === null) return null;

  const diff = calculateDiff(refVal, myVal);
  const isPositive = diff !== null && diff < 0; // négatif est bon

  return (
    <Box
      sx={{
        fontSize: '0.85rem',
        marginTop: '8px',
        padding: '8px 12px',
        borderRadius: '6px',
        backgroundColor: isPositive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 152, 0, 0.1)',
        border: isPositive
          ? '1px solid rgba(40, 167, 69, 0.3)'
          : '1px solid rgba(255, 152, 0, 0.3)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ color: 'var(--text3)' }}>vs moi:</span>
        <span style={{ fontWeight: 700, color: 'var(--text2)' }}>
          {item.quantitative.myValue} {item.quantitative.unit}
        </span>
        {diff !== null && (
          <span
            style={{
              fontWeight: 700,
              color: isPositive ? 'var(--green-d)' : 'var(--orange)',
              fontSize: '0.9rem',
            }}
          >
            ({diff > 0 ? '+' : ''}
            {diff.toFixed(0)}%)
          </span>
        )}
      </Box>
    </Box>
  );
};

// ── Main Component ──

export const PracticeProfileCard: React.FC<PracticeProfileCardProps> = ({ title, items }) => {
  if (!items || items.length === 0) {
    return (
      <Box className="card">
        <Box className="card-h">
          <Typography className="card-title" component="div">
            {title}
          </Typography>
        </Box>
        <Box sx={{ p: 3, textAlign: 'center', color: 'var(--text3)' }}>
          <Typography>Aucune donnée disponible</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="card">
      <Box className="card-h">
        <Typography className="card-title" component="div">
          {title}
        </Typography>
      </Box>
      <Box className="lev-grid">
        {items.map((item) => (
          <Box key={item.id} className="lt">
            <Box className="lt-h">
              <Box>
                <Typography className="lt-name" fontSize={15} component="div">
                  {item.name}
                </Typography>
                <Typography className="lt-var" fontSize={10} component="div">
                  {item.variable}
                </Typography>
              </Box>
              <Box
                component="span"
                className={`badge-type ${item.type === 'Quantitatif' ? 'bt-q' : 'bt-ql'}`}
              >
                {item.type}
              </Box>
            </Box>

            {item.mode === 'quali' && <QualitativeItem item={item} />}
            {item.mode === 'quanti' && <QuantitativeItem item={item} />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
