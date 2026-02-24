import React, { useEffect, useRef } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ChipGroup } from './components/atoms/ChipGroup';
import { InputControl } from './components/atoms/InputControl';
import { SliderControl } from './components/atoms/SliderControl';

import { Field } from './components/units/Field';
import { PredictionSidebar } from './components/units/PredictionSidebar';
import { SectionPanel } from './components/units/SectionPanel';
import {
  agricultureTypesAtom,
  soilWorkTypesAtom,
  itkFormAtom,
  predictedIFTAtom,
  predictingAtom,
  prefilledKeysAtom,
  type ITKFormState,
} from '../../store/diagnosticAtoms';
import { fetchDistinctAgricultureTypes, fetchDistinctSoilWorkTypes } from '../../api/benchmark';
import { FormControl, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import { DIAGNOSTIC_VARIABLES } from '../../config/variables';
import { predictIFT } from '../../api/predict';
import { ItineraireComponent } from '../ItinerairePage';

export const DiagnosticPage: React.FC = () => {
  const [form, setForm] = useAtom(itkFormAtom);
  const predictedIFT = useAtomValue(predictedIFTAtom);
  const setPredictedIFT = useSetAtom(predictedIFTAtom);
  const setPredicting = useSetAtom(predictingAtom);
  const [agricultureTypes, setAgricultureTypes] = useAtom(agricultureTypesAtom);
  const [soilWorkTypes, setSoilWorkTypes] = useAtom(soilWorkTypesAtom);
  const prefilledKeys = useAtomValue(prefilledKeysAtom);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userTouched = useRef(predictedIFT !== null);

  useEffect(() => {
    if (agricultureTypes.length === 0) {
      fetchDistinctAgricultureTypes()
        .then(setAgricultureTypes)
        .catch(() => {});
    }
    if (soilWorkTypes.length === 0) {
      fetchDistinctSoilWorkTypes()
        .then(setSoilWorkTypes)
        .catch(() => {});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mark as touched when LLM prefills the form
  useEffect(() => {
    if (prefilledKeys.size > 0) userTouched.current = true;
  }, [prefilledKeys]);

  useEffect(() => {
    if (!userTouched.current) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setPredicting(true);
      try {
        const ift = await predictIFT(form, agricultureTypes, soilWorkTypes);
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
  }, [agricultureTypes, soilWorkTypes, form, setPredictedIFT, setPredicting]);

  const handleFieldChange = <K extends keyof ITKFormState>(field: K, value: ITKFormState[K]) => {
    userTouched.current = true;
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const dynamicChipsMap: Record<string, string[]> = {
    agricultureTypes,
    soilWorkTypes,
  };

  const selectedSoilWork = soilWorkTypes[form.typeTravailDuSol] ?? 'Travail du sol non défini';
  const selectedAgricultureType =
    agricultureTypes[form.sdcTypeAgriculture] ?? 'Type d’agriculture non défini';
  const variablesSummary = `${form.nbCulturesRotation} cultures • ${selectedSoilWork} • Dépt. ${form.departement} • ${selectedAgricultureType}`;

  return (
    <div className="page active" id="page-itk">
      <div style={{ marginBottom: '14px' }}>
        <ItineraireComponent />
      </div>

      <div className="itk-layout">
        <SectionPanel
          title="🌾 Variables"
          summary={variablesSummary}
          className="itk-last-section"
          displayCard={false}
        >
          <div className="fgrid">
            {DIAGNOSTIC_VARIABLES.map((v) => (
              <Field key={v.id} label={v.label} prefilled={prefilledKeys.has(v.formKey)}>
                {v.slider ? (
                  <SliderControl
                    minLabel={v.slider.minLabel}
                    maxLabel={v.slider.maxLabel}
                    value={form[v.formKey] as number}
                    min={v.slider.min}
                    max={v.slider.max}
                    unit={v.unit}
                    onChange={(value) =>
                      handleFieldChange(
                        v.formKey,
                        Math.round(value) as ITKFormState[typeof v.formKey],
                      )
                    }
                  />
                ) : v.dynamicChips ? (
                  <ChipGroup
                    options={dynamicChipsMap[v.dynamicChips] ?? []}
                    selectedIndex={form[v.formKey] as number}
                    onSelect={(index) =>
                      handleFieldChange(v.formKey, index as ITKFormState[typeof v.formKey])
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
                ) : v.select ? (
                  <FormControl size="small" fullWidth>
                    <Select
                      value={String(form[v.formKey])}
                      onChange={(e: SelectChangeEvent) => {
                        const num = parseInt(e.target.value, 10);
                        if (!isNaN(num)) {
                          handleFieldChange(v.formKey, num as ITKFormState[typeof v.formKey]);
                        }
                      }}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <Typography variant="body2" sx={{ color: 'var(--text3)' }}>
                              {v.select!.placeholder}
                            </Typography>
                          );
                        }
                        const name = v.select!.options[selected];
                        return (
                          <Typography variant="body2">
                            {name ? `${selected} — ${name}` : selected}
                          </Typography>
                        );
                      }}
                    >
                      {Object.entries(v.select.options)
                        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
                        .map(([code, name]) => (
                          <MenuItem key={code} value={code}>
                            <Typography variant="body2">{code} — {name}</Typography>
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
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
        </SectionPanel>

        {predictedIFT !== null && <PredictionSidebar predictedIFT={predictedIFT} />}
      </div>
    </div>
  );
};
