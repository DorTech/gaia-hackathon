import React, { useEffect, useRef, useState } from 'react';
import {
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Stack,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { generateRotation } from '../api/rotation';

export const ItineraireComponent: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotationData, setRotationData] = useState<Record<string, unknown> | null>(null);

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
      const message = err instanceof Error ? err.message : 'Failed to generate rotation';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rotationData || !chartRef.current) return;

    // Clear previous render
    chartRef.current.innerHTML = '';

    // RotationRenderer is a global from chart-render.js loaded in index.html
    type RotationRendererCtor = new (
      divId: string,
      data: Record<string, unknown>,
    ) => {
      render: () => void;
    };
    const Renderer = (window as unknown as { RotationRenderer?: RotationRendererCtor })
      .RotationRenderer;
    if (!Renderer) {
      setError("Le moteur de rendu du graphique n'est pas chargé.");
      return;
    }

    const renderer = new Renderer('rotation-chart', rotationData);
    renderer.render();

    return () => {
      if (chartRef.current) {
        chartRef.current.innerHTML = '';
      }
    };
  }, [rotationData]);

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Itinéraire Technique
      </Typography>

      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Description de votre itinéraire technique</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper elevation={0}>
            <Stack spacing={2}>
              <TextField
                multiline
                minRows={4}
                maxRows={10}
                label="Décrivez votre itinéraire techique..."
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
                  {loading ? 'Génération en cours...' : "Générer l'itinéraire"}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {rotationData && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Itinéraire généré</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper elevation={0}>
              <Box id="rotation-chart" ref={chartRef} sx={{ width: '100%', minHeight: 500 }} />
            </Paper>
          </AccordionDetails>
        </Accordion>
      )}
    </>
  );
};
