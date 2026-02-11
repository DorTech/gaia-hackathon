import { Typography, Paper } from "@mui/material";

export default function SettingsPage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Configure application settings here. Build this page during the
          hackathon.
        </Typography>
      </Paper>
    </>
  );
}
