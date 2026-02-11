import { Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <>
      <Typography variant="h4" gutterBottom>
        404 — Page Not Found
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary" gutterBottom>
          The page you are looking for does not exist.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </Button>
      </Paper>
    </>
  );
}
