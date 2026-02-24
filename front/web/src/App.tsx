import { ThemeProvider, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { theme } from "./theme/theme";
import "./styles/optimeo.css";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Outlet />
    </ThemeProvider>
  );
}
