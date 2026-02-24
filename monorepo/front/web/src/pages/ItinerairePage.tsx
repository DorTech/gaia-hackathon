import { Alert, Box, Stack, TextField, Typography } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { generateRotation } from '../api/rotation';
import {
  agricultureTypesAtom,
  soilWorkTypesAtom,
  itinerairePromptAtom,
  itineraireRotationDataAtom,
  itkFormAtom,
  mapDiagnosticVariablesToForm,
  prefilledKeysAtom,
} from '../store/diagnosticAtoms';
import { SectionPanel } from './diagnostic/components/units/SectionPanel';

export const ItineraireComponent: React.FC = () => {
  const [prompt, setPrompt] = useAtom(itinerairePromptAtom);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rotationData, setRotationData] = useAtom(itineraireRotationDataAtom);
  const setForm = useSetAtom(itkFormAtom);
  const setPrefilledKeys = useSetAtom(prefilledKeysAtom);
  const agricultureTypes = useAtomValue(agricultureTypesAtom);
  const soilWorkTypes = useAtomValue(soilWorkTypesAtom);

  const chartRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setRotationData(null);

    try {
      const data = await generateRotation({ prompt: prompt.trim() });
      setRotationData(data);

      // Prefill diagnostic variables from LLM extraction
      if (data.diagnostic_variables) {
        const { partial, filledKeys } = mapDiagnosticVariablesToForm(
          data.diagnostic_variables,
          agricultureTypes,
          soilWorkTypes,
        );
        if (filledKeys.size > 0) {
          setForm((prev) => ({ ...prev, ...partial }));
          setPrefilledKeys(filledKeys);
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate rotation';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!rotationData || !chartRef.current) return;
    const chartElement = chartRef.current;

    // Clear previous render
    chartElement.innerHTML = '';

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
      chartElement.innerHTML = '';
    };
  }, [rotationData]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        Ma ferme
      </Typography>

      <SectionPanel
        title="📝 Description de votre itinéraire technique"
        summary={prompt.trim() || 'Ajoutez une description pour générer un itinéraire'}
        className="itk-last-section"
        displayCard={false}
      >
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
            sx={{
              '& .MuiInputBase-root': {
                borderRadius: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          />
          <Box>
            <button
              className="btn btn-green"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{ height: '40px' }}
            >
              {loading ? 'Génération en cours...' : "Générer l'itinéraire"}
            </button>
          </Box>
        </Stack>
      </SectionPanel>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {rotationData && (
        <SectionPanel
          title="🗺️ Itinéraire généré"
          summary="Dépliez pour afficher l’itinéraire généré"
          defaultExpanded
        >
          <Box
            id="rotation-chart"
            ref={chartRef}
            sx={{
              width: '100%',
              minHeight: 500,
              borderRadius: 2,
              border: '1px dashed rgba(0, 0, 0, 0.12)',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            }}
          />
        </SectionPanel>
      )}
    </Box>
  );
};
