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
              borderRadius: 999,
              p: 0.45,
              border: (t) => `1px solid ${alpha(t.palette.common.white, 0.45)}`,
              boxShadow: (t) => `inset 0 1px 0 ${alpha(t.palette.common.white, 0.5)}`,
              '& .MuiToggleButtonGroup-grouped': {
                border: 0,
                borderRadius: 999,
                px: 2,
                py: 0.7,
                textTransform: 'none',
                color: (t) => alpha(t.palette.secondary.dark, 0.86),
                fontWeight: 700,
                fontSize: '0.84rem',
                lineHeight: 1.2,
                '&:not(:first-of-type)': {
                  ml: 0.5,
                },
                '&.Mui-selected': {
                  background: (t) =>
                    `linear-gradient(125deg, ${t.palette.common.white} 0%, ${alpha(t.palette.primary.light, 0.92)} 100%)`,
                  color: (t) => t.palette.secondary.dark,
                  fontWeight: 800,
                  boxShadow: (t) => `0 2px 10px ${alpha(t.palette.secondary.dark, 0.2)}`,
                },
                '&.Mui-selected:hover': {
                  background: (t) =>
                    `linear-gradient(125deg, ${alpha(t.palette.common.white, 0.98)} 0%, ${alpha(t.palette.primary.light, 0.95)} 100%)`,
                },
                '&:hover': {
                  backgroundColor: (t) => alpha(t.palette.common.white, 0.42),
                },
              },
            }}
          >
            {NAV_ITEMS.map((item) => (
              <ToggleButton key={item.path} value={item.path} aria-label={item.label}>
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
