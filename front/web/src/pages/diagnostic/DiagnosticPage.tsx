import React, { useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ChipGroup } from './components/atoms/ChipGroup';
import { InputControl } from './components/atoms/InputControl';
import { SliderControl } from './components/atoms/SliderControl';
import { DiagnosticHeader } from './components/units/DiagnosticHeader';
import { FieldLabel } from './components/atoms/FieldLabel';
import { Field } from './components/units/Field';
import { PredictionSidebar } from './components/units/PredictionSidebar';
import { Section } from './components/units/Section';
import {
  itkFormAtom,
  predictedIFTAtom,
  predictingAtom,
  type ITKFormState,
} from '../../store/diagnosticAtoms';
import { Box } from '@mui/material';
import { DIAGNOSTIC_VARIABLES } from '../../config/variables';
import { predictIFT } from '../../api/predict';
import { ItineraireComponent } from '../ItinerairePage';

export const DiagnosticPage: React.FC = () => {
  const [form, setForm] = useAtom(itkFormAtom);
  const predictedIFT = useAtomValue(predictedIFTAtom);
  const setPredictedIFT = useSetAtom(predictedIFTAtom);
  const setPredicting = useSetAtom(predictingAtom);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setPredicting(true);
      try {
        const ift = await predictIFT(form);
        setPredictedIFT(ift);
      } catch {
        // keep previous value on error
      } finally {
        setPredicting(false);
      }
    }, 400);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [form, setPredictedIFT, setPredicting]);

  const handleFieldChange = <K extends keyof ITKFormState>(field: K, value: ITKFormState[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="page active" id="page-itk">
      <div>
        <ItineraireComponent/>
      </div>
      
      <DiagnosticHeader />

      <div className="itk-layout">
        <div className="card" style={{ padding: '20px 24px' }}>
          <Section title="🌾 Variables du diagnostic" className="itk-last-section">
            <div className="fgrid">
              {DIAGNOSTIC_VARIABLES.map((v) => (
                <Field key={v.id} label={v.label}>
                  {v.slider ? (
                    <SliderControl
                      minLabel={v.slider.minLabel}
                      maxLabel={v.slider.maxLabel}
                      value={form[v.formKey] as number}
                      min={v.slider.min}
                      max={v.slider.max}
                      onChange={(value) =>
                        handleFieldChange(
                          v.formKey,
                          Math.round(value) as ITKFormState[typeof v.formKey],
                        )
                      }
                    />
                  ) : v.chips ? (
                    <ChipGroup
                      options={v.chips.options}
                      selectedIndex={form[v.formKey] as number}
                      onSelect={(index) =>
                        handleFieldChange(v.formKey, index as ITKFormState[typeof v.formKey])
                      }
                    />
                  ) : v.input ? (
                    <InputControl
                      type={v.input.type}
                      value={form[v.formKey]}
                      placeholder={v.input.placeholder}
                      min={v.input.min}
                      max={v.input.max}
                      onChange={(val) =>
                        handleFieldChange(v.formKey, val as ITKFormState[typeof v.formKey])
                      }
                    />
                  ) : null}
                </Field>
              ))}
            </div>
          </Section>
        </div>

        <PredictionSidebar predictedIFT={predictedIFT} />
      </div>
    </div>
  );
};
