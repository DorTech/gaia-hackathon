import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAtomValue } from "jotai";
import { sidebarOpenAtom } from "../store/atoms";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const sidebarOpen = useAtomValue(sidebarOpenAtom);

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar open={sidebarOpen} />
      <Sidebar open={sidebarOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
