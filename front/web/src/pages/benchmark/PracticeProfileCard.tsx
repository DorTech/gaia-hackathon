import React from 'react';
import { Box, Typography } from '@mui/material';
import type { PracticeProfileItem } from '../../data/benchmark';

interface PracticeProfileCardProps {
  title: string;
  tagLabel: string;
  items: PracticeProfileItem[];
}

export const PracticeProfileCard: React.FC<PracticeProfileCardProps> = ({
  title,
  tagLabel,
  items,
}) => {
  return (
    <Box className="card">
      <Box className="card-h">
        <Typography className="card-title" component="div">
          {title}
        </Typography>
        <Box component="span" className="tag tag-teal">
          {tagLabel}
        </Box>
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

            {item.mode === 'quali' &&
              item.frequencies?.map((frequency) => (
                <Box key={frequency.label} className="fr">
                  <Box className="fr-lbl">{frequency.label}</Box>
                  <Box className="fr-trk">
                    <Box
                      className={`fr-fil ${frequency.top ? 'top' : ''}`}
                      sx={{ width: `${frequency.pct}%` }}
                    ></Box>
                  </Box>
                  <Box className="fr-pct">{frequency.pct}%</Box>
                </Box>
              ))}

            {item.mode === 'quali' && item.note && (
              <Box sx={{ fontSize: '.62rem', color: 'var(--text2)', marginTop: '5px' }}>
                {item.note.label} <b style={{ color: 'var(--green-d)' }}>{item.note.value}</b>
                {item.note.suffix ? ` ${item.note.suffix}` : ''}
              </Box>
            )}

            {item.mode === 'quanti' && item.quantitative && (
              <>
                <Typography className="qv" component="div" fontSize={'1.6rem'}>
                  {item.quantitative.value}{' '}
                  <span style={{ fontSize: '1.5rem', fontWeight: 400, color: 'var(--text3)' }}>
                    {item.quantitative.unit}
                  </span>
                </Typography>
                {item.quantitative.myValue &&
                  (() => {
                    const refVal = parseFloat(item.quantitative.value.replace(',', '.'));
                    const myVal = parseFloat(item.quantitative.myValue.replace(',', '.'));
                    const diff = ((refVal - myVal) / myVal) * 100;
                    const isPositive = diff < 0; // négatif est bon pour consommation/N

                    return (
                      <Box
                        sx={{
                          fontSize: '1rem',
                          color: 'var(--text3)',
                          marginTop: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>vs moi:</span>
                        <span style={{ fontWeight: 700, color: 'var(--text2)' }}>
                          {item.quantitative.myValue} {item.quantitative.unit}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            color: isPositive ? 'var(--green-d)' : 'var(--orange)',
                            fontSize: '1rem',
                          }}
                        >
                          ({diff > 0 ? '+' : ''}
                          {diff.toFixed(0)}%)
                        </span>
                      </Box>
                    );
                  })()}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
