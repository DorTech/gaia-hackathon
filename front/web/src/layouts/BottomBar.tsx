import { alpha } from '@mui/material/styles';
import { AppBar, Button, Toolbar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const NEXT_STEP: Record<string, { label: string; path: string }> = {
  '/diagnostic': { label: 'Comparateur', path: '/benchmark' },
  '/benchmark': { label: 'Simulation', path: '/simulation' },
};

export default function BottomBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const next = NEXT_STEP[location.pathname];
  if (!next) return null;

  return (
    <AppBar
      position="fixed"
      component="footer"
      sx={{
        top: 'auto',
        bottom: 0,
        zIndex: (t) => t.zIndex.drawer + 1,
        background: alpha('rgba(194, 224, 123, 0.38)', 0.38),
        color: (t) => t.palette.secondary.dark,
        backdropFilter: 'blur(10px)',
        boxShadow: (t) => t.shadows[2],
        borderTop: (t) => `1px solid ${alpha(t.palette.common.white, 0.35)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', minHeight: 56 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(next.path)}
          sx={{
            borderRadius: 999,
            px: 3,
            py: 1,
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.9rem',
            backgroundColor: (t) => t.palette.secondary.dark,
            color: (t) => t.palette.common.white,
            boxShadow: (t) => `0 2px 10px ${alpha(t.palette.secondary.dark, 0.3)}`,
            '&:hover': {
              backgroundColor: (t) => t.palette.secondary.main,
            },
          }}
        >
          {next.label}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
