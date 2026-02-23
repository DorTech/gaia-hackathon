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
                <Typography className="lt-name" component="div">{item.name}</Typography>
                <Typography className="lt-var" component="div">{item.variable}</Typography>
              </Box>
              <Box component="span" className={`badge-type ${item.type === 'Quantitatif' ? 'bt-q' : 'bt-ql'}`}>
                {item.type}
              </Box>
            </Box>

            {item.mode === 'quali' && item.frequencies?.map((frequency) => (
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
                {item.note.label}{' '}
                <b style={{ color: 'var(--green-d)' }}>{item.note.value}</b>
                {item.note.suffix ? ` ${item.note.suffix}` : ''}
              </Box>
            )}

            {item.mode === 'quanti' && item.quantitative && (
              <>
                <Typography className="qv" component="div">
                  {item.quantitative.value}{' '}
                  <span style={{ fontSize: '.7rem', fontWeight: 400, color: 'var(--text3)' }}>
                    {item.quantitative.unit}
                  </span>
                </Typography>
                <Typography className="qvs" component="div">
                  {item.quantitative.comparison}
                </Typography>
                {item.quantitative.bars.map((bar) => (
                  <Box key={bar.label} className="qbar-row">
                    <Box className="qbar-lbl" sx={{ color: bar.color === 'var(--green)' ? 'var(--green-d)' : 'var(--text3)' }}>
                      {bar.label}
                    </Box>
                    <Box className="qbar-trk">
                      <Box className="qbar-fil" sx={{ width: `${bar.width}%`, background: bar.color }}></Box>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
