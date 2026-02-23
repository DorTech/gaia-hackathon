import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ChipGroup } from './components/atoms/ChipGroup';
import { SliderControl } from './components/atoms/SliderControl';
import { DiagnosticHeader } from './components/units/DiagnosticHeader';
import { FieldLabel } from './components/atoms/FieldLabel';
import { Field } from './components/units/Field';
import { PredictionSidebar } from './components/units/PredictionSidebar';
import { Section } from './components/units/Section';
import {
  itkFormAtom,
  predictedIFTAtom,
  CHIP_OPTIONS,
  type ITKFormState,
} from '../../store/diagnosticAtoms';
import { Box } from '@mui/material';

export const DiagnosticPage: React.FC = () => {
  const [form, setForm] = useAtom(itkFormAtom);
  const predictedIFT = useAtomValue(predictedIFTAtom);

  const handleFieldChange = <K extends keyof ITKFormState>(field: K, value: ITKFormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="page active" id="page-itk">
      <DiagnosticHeader />

      <div className="itk-layout">
        <div className="card" style={{ padding: '16px 18px' }}>
          <Section title="🌾 Variables du diagnostic" className="itk-last-section">
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: 2,
              }}
            >
              <Field label="NB Rotation" >
                <SliderControl
                  minLabel="1 culture"
                  maxLabel="8+"
                  value={form.rotation}
                  min={1}
                  max={8}
                  onChange={(value) => handleFieldChange('rotation', Math.round(value))}
                />
              </Field>

              <Field label="Fertilisation" >
                <SliderControl
                  minLabel="0"
                  maxLabel="300"
                  value={form.fertilization}
                  min={0}
                  max={300}
                  onChange={(value) => handleFieldChange('fertilization', Math.round(value))}
                />
              </Field>

              <Field label="Travail du sol" >
                <ChipGroup
                  options={CHIP_OPTIONS.soilWork}
                  selectedIndex={form.soilWork}
                  onSelect={(index) => handleFieldChange('soilWork', index)}
                />
              </Field>

              <Field label="Nombre UTH" >
                <SliderControl
                  minLabel="0"
                  maxLabel="6"
                  value={form.uth}
                  min={0}
                  max={6}
                  onChange={(value) => handleFieldChange('uth', Math.round(value))}
                />
              </Field>

              <Field label="Recours moyens biologiques" >
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.biologicalControl}
                  onSelect={(index) => handleFieldChange('biologicalControl', index)}
                />
              </Field>

              <Field label="Recours macroorganismes" >
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.macroorganisms}
                  onSelect={(index) => handleFieldChange('macroorganisms', index)}
                />
              </Field>

              <Field label="Désherbage" >
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.hasWeeding}
                  onSelect={(index) => handleFieldChange('hasWeeding', index)}
                />
                <Box sx={{ mt: 1 }}>
                  <SliderControl
                    minLabel="0 Nombre de passages"
                    maxLabel="6"
                    value={form.weedingPassages}
                    min={0}
                    max={6}
                    disabled={form.hasWeeding !== 1}
                    onChange={(value) => handleFieldChange('weedingPassages', Math.round(value))}
                  />
                </Box>
              </Field>
            </Box>
          </Section>
        </div>

        <PredictionSidebar predictedIFT={predictedIFT} />
      </div>
    </div>
  );
};
