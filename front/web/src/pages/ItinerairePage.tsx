import { useEffect, useRef, useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { generateRotation } from "../api/rotation";

export default function ItinerairePage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotationData, setRotationData] = useState<Record<
    string,
    unknown
  > | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setRotationData(null);

    try {
      const data = await generateRotation({ prompt: prompt.trim() });
      setRotationData(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to generate rotation";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rotationData || !chartRef.current) return;

    // Clear previous render
    chartRef.current.innerHTML = "";

    // RotationRenderer is a global from chart-render.js loaded in index.html
    const renderer = new RotationRenderer("rotation-chart", rotationData);
    renderer.render();

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = "";
      }
    };
  }, [rotationData]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Itinéraire Technique
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Décrivez votre rotation culturale
        </Typography>
        <Stack spacing={2}>
          <TextField
            multiline
            minRows={4}
            maxRows={10}
            label="Décrivez la rotation que vous souhaitez générer..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            fullWidth
            disabled={loading}
          />
          <Box>
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : undefined}
            >
              {loading ? "Génération en cours..." : "Générer la rotation"}
            </Button>
          </Box>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {rotationData && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Rotation générée
          </Typography>
          <Box
            id="rotation-chart"
            ref={chartRef}
            sx={{ width: "100%", minHeight: 500 }}
          />
        </Paper>
      )}
    </>
  );
}
