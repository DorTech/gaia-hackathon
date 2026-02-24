import { alpha } from '@mui/material/styles';
import { AppBar, Toolbar } from '@mui/material';
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
        <button
          className="btn"
          onClick={() => navigate(next.path)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'linear-gradient(135deg, #b8d966 0%, #99cc33 100%)',
            border: '1px solid rgba(255,255,255,0.45)',
            color: '#1b4a12',
            borderRadius: 10,
            padding: '8px 20px',
            fontSize: '0.85rem',
            fontWeight: 800,
            boxShadow: '0 2px 10px rgba(27,74,18,0.18)',
          }}
        >
          {next.label} <ArrowForwardIcon sx={{ fontSize: 18 }} />
        </button>
      </Toolbar>
    </AppBar>
  );
}
