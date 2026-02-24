import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#99cc33",
      light: "#b8d966",
      dark: "#6b8f24",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2d6b1e",
      light: "#4a8a3a",
      dark: "#1b4a12",
    },
    background: {
      default: "#f7f9f2",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
