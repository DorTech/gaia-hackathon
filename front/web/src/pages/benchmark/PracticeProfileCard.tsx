import React from 'react';
import { Box, Typography } from '@mui/material';
import type { PracticeProfileItem } from '../../types/benchmark';

interface PracticeProfileCardProps {
  title: string;
  items: PracticeProfileItem[];
}

export const PracticeProfileCard: React.FC<PracticeProfileCardProps> = ({ title, items }) => {
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

            {item.mode === 'quali' &&
              item.frequencies?.map((frequency) => {
                const isMyPosition = item.note && frequency.label === item.note.value;
                return (
                  <Box key={frequency.label} className="fr">
                    <Box className="fr-lbl" sx={{ fontSize: '1rem', minWidth: '120px', flex: '0 0 120px' }}>
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
                    const diff = ((myVal - refVal) / refVal) * 100;
                    const isPositive = diff < 0; // négatif est bon pour consommation/N

                    return (
                      <Box
                        sx={{
                          fontSize: '0.85rem',
                          marginTop: '8px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          backgroundColor: isPositive ? 'rgba(40, 167, 69, 0.1)' : 'rgba(255, 152, 0, 0.1)',
                          border: isPositive ? '1px solid rgba(40, 167, 69, 0.3)' : '1px solid rgba(255, 152, 0, 0.3)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--text3)' }}>vs moi:</span>
                          <span style={{ fontWeight: 700, color: 'var(--text2)' }}>
                            {item.quantitative.myValue} {item.quantitative.unit}
                          </span>
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
                        </Box>
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
