import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import BottomBar from "./BottomBar";

export default function MainLayout() {
  const location = useLocation();
  const showFooter = location.pathname !== "/simulation";

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pb: showFooter ? 10 : 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
      {showFooter && <BottomBar />}
    </Box>
  );
}
