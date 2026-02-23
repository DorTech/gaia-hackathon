import React, { useEffect, useState } from 'react';
import { ChipGroup } from './components/atoms/ChipGroup';
import { SliderControl } from './components/atoms/SliderControl';
import { DiagnosticHeader } from './components/units/DiagnosticHeader';
import { Field } from './components/units/Field';
import { PredictionSidebar } from './components/units/PredictionSidebar';
import { Section } from './components/units/Section';
import { CHIP_OPTIONS, INITIAL_ITK_FORM } from './constants';
import type { ITKFormState } from './types';
import { calculatePredictedIFT } from './utils';

export const DiagnosticPage: React.FC = () => {
  const [form, setForm] = useState<ITKFormState>(INITIAL_ITK_FORM);
  const [predictedIFT, setPredictedIFT] = useState(2.8);

  useEffect(() => {
    setPredictedIFT(calculatePredictedIFT(form));
  }, [form]);

  const handleFieldChange = <K extends keyof ITKFormState>(field: K, value: ITKFormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_ITK_FORM);
  };

  return (
    <div className="page active" id="page-itk">
      <DiagnosticHeader onReset={resetForm} />

      <div className="itk-layout">
        <div className="card" style={{ padding: '16px 18px' }}>
          <Section title="🌾 Variables du diagnostic" className="itk-last-section">
            <div className="fgrid">
              <Field label="NB Rotation" reference="Réf : 4,8 cultures">
                <SliderControl
                  minLabel="1 culture"
                  maxLabel="8+"
                  value={form.rotation}
                  min={1}
                  max={8}
                  onChange={(value) => handleFieldChange('rotation', Math.round(value))}
                />
              </Field>

              <Field label="Fertilisation" reference="Réf : 140 kg/ha">
                <SliderControl
                  minLabel="0"
                  maxLabel="300"
                  value={form.fertilization}
                  min={0}
                  max={300}
                  onChange={(value) => handleFieldChange('fertilization', Math.round(value))}
                />
              </Field>

              <Field label="Travail du sol" reference="Réf : TCS">
                <ChipGroup
                  options={CHIP_OPTIONS.soilWork}
                  selectedIndex={form.soilWork}
                  onSelect={(index) => handleFieldChange('soilWork', index)}
                />
              </Field>

              <Field label="Présence de désherbage" reference="Réf : Oui">
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.hasWeeding}
                  onSelect={(index) => handleFieldChange('hasWeeding', index)}
                />
              </Field>

              {form.hasWeeding === 1 && (
                <Field label="Nombre de passages" reference="Réf : 2 à 3">
                  <SliderControl
                    minLabel="0"
                    maxLabel="6"
                    value={form.weedingPassages}
                    min={0}
                    max={6}
                    onChange={(value) => handleFieldChange('weedingPassages', Math.round(value))}
                  />
                </Field>
              )}

              <Field label="Nombre UTH" reference="Réf : 2">
                <SliderControl
                  minLabel="0"
                  maxLabel="6"
                  value={form.uth}
                  min={0}
                  max={6}
                  onChange={(value) => handleFieldChange('uth', Math.round(value))}
                />
              </Field>

              <Field label="Recours moyens biologiques" reference="Réf : Oui">
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.biologicalControl}
                  onSelect={(index) => handleFieldChange('biologicalControl', index)}
                />
              </Field>

              <Field label="Recours macroorganismes" reference="Réf : Oui">
                <ChipGroup
                  options={CHIP_OPTIONS.yesNo}
                  selectedIndex={form.macroorganisms}
                  onSelect={(index) => handleFieldChange('macroorganisms', index)}
                />
              </Field>
            </div>
          </Section>
        </div>

        <PredictionSidebar predictedIFT={predictedIFT} form={form} />
      </div>
    </div>
  );
};
