import { Fragment } from 'react';
import { alpha } from '@mui/material/styles';
import { AppBar, Box, ToggleButton, ToggleButtonGroup, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Ma ferme', path: '/diagnostic' },
  { label: 'Comparateur', path: '/benchmark' },
  { label: 'Simulation leviers', path: '/simulation' },
];

export default function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentIndex = NAV_ITEMS.findIndex((item) => item.path === location.pathname);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        background: (t) =>
          `linear-gradient(110deg, ${alpha(t.palette.primary.light, 0.94)} 0%, ${alpha(t.palette.primary.main, 0.88)} 100%)`,
        color: (t) => t.palette.secondary.dark,
        backdropFilter: 'blur(10px)',
        boxShadow: (t) => t.shadows[2],
        borderBottom: (t) => `1px solid ${alpha(t.palette.common.white, 0.35)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, minHeight: 64 }}>
        <Box display="flex" alignItems="center" gap={1.2}>
          <img src="/logo.png" alt="Logo" style={{ height: 50 }} />

          <Box>
            <Typography
              variant="h5"
              noWrap
              sx={{
                fontFamily: '"Fredoka", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.01em',
                lineHeight: 1.1,
                textShadow: (t) => `0 1px 3px ${alpha(t.palette.secondary.dark, 0.2)}`,
              }}
            >
              <Box component="span" sx={{ color: (t) => t.palette.common.white }}>
                Opti
              </Box>
              <Box component="span" sx={{ color: (t) => alpha(t.palette.secondary.dark, 0.9) }}>
                meo
              </Box>
            </Typography>
            <Typography
              noWrap
              sx={{
                fontSize: '0.6rem',
                fontWeight: 600,
                fontStyle: 'italic',
                color: (t) => alpha(t.palette.secondary.dark, 0.7),
                letterSpacing: '0.03em',
                mt: -0.2,
              }}
            >
              Driven by Doriane
            </Typography>
          </Box>
        </Box>

        <Box>
          <ToggleButtonGroup
            exclusive
            value={location.pathname}
            onChange={(_, value: string | null) => {
              if (value) navigate(value);
            }}
            aria-label="top navigation"
            sx={{
              backgroundColor: (t) => alpha(t.palette.common.white, 0.32),
              borderRadius: 14,
              p: 0.45,
              border: (t) => `1px solid ${alpha(t.palette.common.white, 0.45)}`,
              boxShadow: (t) => `inset 0 1px 0 ${alpha(t.palette.common.white, 0.5)}`,
              '& .MuiToggleButtonGroup-grouped': {
                border: (t) => `1px solid ${alpha(t.palette.common.white, 0.34)}`,
                borderRadius: 10,
                px: 1.35,
                py: 0.55,
                textTransform: 'none',
                color: (t) => alpha(t.palette.secondary.dark, 0.86),
                fontWeight: 700,
                fontSize: '0.84rem',
                lineHeight: 1.2,
                transition: 'all 180ms ease',
                '&.Mui-selected': {
                  backgroundColor: '#dcedb6',
                  fontWeight: 800,
                  borderColor: (t) => alpha(t.palette.secondary.dark, 0.22),
                  boxShadow: (t) => `0 2px 10px ${alpha(t.palette.secondary.dark, 0.2)}`,
                },
                '&:hover': {
                  backgroundColor: (t) => alpha(t.palette.common.white, 0.42),
                },
              },
            }}
          >
            {NAV_ITEMS.map((item, index) => (
              <Fragment key={item.path}>
                <ToggleButton
                  value={item.path}
                  aria-label={item.label}
                  sx={{
                    ...(index < currentIndex
                      ? {
                          backgroundColor: (t) => alpha(t.palette.common.white, 0.5),
                          color: (t) => alpha(t.palette.secondary.dark, 0.95),
                        }
                      : {}),
                  }}
                >
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8 }}>
                    <Box
                      sx={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        backgroundColor:
                          index < currentIndex
                            ? (t) => alpha(t.palette.secondary.dark, 0.9)
                            : index === currentIndex
                              ? (t) => t.palette.secondary.dark
                              : (t) => alpha(t.palette.secondary.dark, 0.2),
                        color:
                          index <= currentIndex
                            ? (t) => t.palette.common.white
                            : (t) => alpha(t.palette.secondary.dark, 0.8),
                      }}
                    >
                      {index < currentIndex ? '✓' : index + 1}
                    </Box>
                    <span>{item.label}</span>
                  </Box>
                </ToggleButton>
                {index < NAV_ITEMS.length - 1 ? (
                  <Box
                    component="span"
                    sx={{
                      mx: 0.9,
                      width: 10,
                      height: 10,
                      borderTop: (t) => `2.2px solid ${alpha(t.palette.secondary.dark, 0.62)}`,
                      borderRight: (t) => `2.2px solid ${alpha(t.palette.secondary.dark, 0.62)}`,
                      transform: 'rotate(45deg)',
                      alignSelf: 'center',
                      flexShrink: 0,
                      userSelect: 'none',
                    }}
                  />
                ) : null}
              </Fragment>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
