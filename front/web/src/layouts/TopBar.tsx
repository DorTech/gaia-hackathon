import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSetAtom } from "jotai";
import { sidebarToggleAtom } from "../store/atoms";

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_CLOSED = 64;

export default function TopBar({ open }: { open: boolean }) {
  const toggleSidebar = useSetAtom(sidebarToggleAtom);

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        ml: open ? `${DRAWER_WIDTH}px` : `${DRAWER_WIDTH_CLOSED}px`,
        width: open
          ? `calc(100% - ${DRAWER_WIDTH}px)`
          : `calc(100% - ${DRAWER_WIDTH_CLOSED}px)`,
        transition: (t) =>
          t.transitions.create(["width", "margin"], {
            easing: t.transitions.easing.sharp,
            duration: t.transitions.duration.leavingScreen,
          }),
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Optimeo
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
