import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import {
  itkFormAtom,
  predictedIFTAtom,
  ITK_FORM_DEFAULTS,
  CHIP_OPTIONS,
  FIELD_REFERENCES,
  type ITKFormState,
} from '../store/diagnosticAtoms';
import { iftReferenceValueAtom, iftMedianValueAtom, iftMaxGaugeAtom } from '../store/referenceAtoms';
import { getIFTColor, getGaugePct } from '../utils/ift';

export const DiagnosticPage: React.FC = () => {
  const [form, setForm] = useAtom(itkFormAtom);
  const predictedIFT = useAtomValue(predictedIFTAtom);
  const iftRef = useAtomValue(iftReferenceValueAtom);
  const iftMedian = useAtomValue(iftMedianValueAtom);
  const iftMax = useAtomValue(iftMaxGaugeAtom);

  const handleFieldChange = (field: keyof ITKFormState, value: any) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChipSelect = (field: keyof ITKFormState, value: number) => {
    handleFieldChange(field, value);
  };

  const resetForm = () => {
    setForm(ITK_FORM_DEFAULTS);
  };

  const vmed = ((predictedIFT - iftMedian) / iftMedian * 100).toFixed(1);
  const vref = ((predictedIFT - iftRef) / iftRef * 100).toFixed(1);

  return (
    <div className="page active" id="page-itk">
      <div className="page-hd">
        <div>
          <h1>Mon diagnostic ITK</h1>
          <p>Renseignez votre itinéraire technique · Le modèle Random Forest prédit votre IFT en temps réel</p>
        </div>
        <div className="page-hd-right">
          <div className="steps">
            <div className="step done">
              <div className="step-n">✓</div>Benchmark
            </div>
            <span className="step-sep">›</span>
            <div className="step active">
              <div className="step-n">2</div>Mon ITK
            </div>
            <span className="step-sep">›</span>
            <div className="step">
              <div className="step-n">3</div>Simulation
            </div>
          </div>
          <button className="btn btn-outline" onClick={resetForm}>↺ Reset</button>
          <button className="btn btn-green">Simuler →</button>
        </div>
      </div>

      <div className="itk-layout">
        {/* FORM */}
        <div className="card" style={{ padding: '16px 18px' }}>

          {/* Rotation & assolement */}
          <div className="fsec">
            <div className="fsec-title">🌾 Rotation & assolement</div>
            <div className="fgrid">
              <div className="fld">
                <div className="flbl">
                  NB Rotation
                  <span className="fref">{FIELD_REFERENCES.rotation}</span>
                </div>
                <div className="slider-w">
                  <div className="slider-top">
                    <span className="cap">1 culture</span>
                    <span className="slider-val">{form.rotation}</span>
                    <span className="cap">8+</span>
                  </div>
                  <input
                    type="range"
                    className="fslider"
                    min="1"
                    max="8"
                    value={form.rotation}
                    onChange={(e) => handleFieldChange('rotation', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="fld">
                <div className="flbl">
                  Couverts hivernaux
                  <span className="fref">{FIELD_REFERENCES.coverCrops}</span>
                </div>
                <div className="chips">
                  {CHIP_OPTIONS.coverCrops.map((label, idx) => (
                    <div
                      key={idx}
                      className={'chip ' + (form.coverCrops === idx ? 'on' : '')}
                      onClick={() => handleChipSelect('coverCrops', idx)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Travail du sol */}
          <div className="fsec">
            <div className="fsec-title">🚜 Travail du sol & désherbage</div>
            <div className="fgrid">
              <div className="fld">
                <div className="flbl">
                  Type travail du sol
                  <span className="fref">{FIELD_REFERENCES.soilType}</span>
                </div>
                <div className="chips">
                  {CHIP_OPTIONS.soilType.map((label, idx) => (
                    <div
                      key={idx}
                      className={'chip ' + (form.soilType === idx ? 'on' : '')}
                      onClick={() => handleChipSelect('soilType', idx)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fld">
                <div className="flbl">
                  Désherbage mécanique
                  <span className="fref">{FIELD_REFERENCES.mechanicalWeeding}</span>
                </div>
                <div className="chips">
                  {CHIP_OPTIONS.mechanicalWeeding.map((label, idx) => (
                    <div
                      key={idx}
                      className={'chip ' + (form.mechanicalWeeding === idx ? 'on' : '')}
                      onClick={() => handleChipSelect('mechanicalWeeding', idx)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="fld">
                <div className="flbl">
                  Nb passages désherb. méca
                  <span className="fref">{FIELD_REFERENCES.weededPassages}</span>
                </div>
                <div className="slider-w">
                  <div className="slider-top">
                    <span className="cap">0</span>
                    <span className="slider-val">{form.weededPassages}</span>
                    <span className="cap">6</span>
                  </div>
                  <input
                    type="range"
                    className="fslider"
                    min="0"
                    max="6"
                    value={form.weededPassages}
                    onChange={(e) => handleFieldChange('weededPassages', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Protection phyto */}
          <div className="fsec">
            <div className="fsec-title">🧪 Protection phytosanitaire</div>
            <div className="fgrid">
              <div className="fld">
                <div className="flbl">IFT Chimique actuel</div>
                <input
                  type="number"
                  className="finp"
                  value={form.chemiIFT}
                  step="0.05"
                  min="0"
                  onChange={(e) => handleFieldChange('chemiIFT', parseFloat(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">
                  IFT Biocontrôle actuel
                  <span className="fref">{FIELD_REFERENCES.biocontrolIFT}</span>
                </div>
                <input
                  type="number"
                  className="finp"
                  value={form.biocontrolIFT}
                  step="0.05"
                  min="0"
                  onChange={(e) => handleFieldChange('biocontrolIFT', parseFloat(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">
                  Variété résistante
                  <span className="fref">{FIELD_REFERENCES.resistantVariety}</span>
                </div>
                <select
                  className="fsel"
                  value={form.resistantVariety}
                  onChange={(e) => handleFieldChange('resistantVariety', parseInt(e.target.value))}
                >
                  <option value="2">Standard (sans résistance)</option>
                  <option value="1">Résistance partielle</option>
                  <option value="0">Très résistante</option>
                </select>
              </div>
              <div className="fld">
                <div className="flbl">
                  Recours Biocontrôle
                  <span className="fref">{FIELD_REFERENCES.biocontrolUse}</span>
                </div>
                <div className="chips">
                  {CHIP_OPTIONS.biocontrolUse.map((label, idx) => (
                    <div
                      key={idx}
                      className={'chip ' + (form.biocontrolUse === idx ? 'on' : '')}
                      onClick={() => handleChipSelect('biocontrolUse', idx)}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fertilisation */}
          <div className="fsec">
            <div className="fsec-title">🌿 Fertilisation</div>
            <div className="fgrid t3">
              <div className="fld">
                <div className="flbl">
                  N total (kgN/ha)
                  <span className="fref">{FIELD_REFERENCES.nitrogenTotal}</span>
                </div>
                <div className="slider-w">
                  <div className="slider-top">
                    <span className="cap">0</span>
                    <span className="slider-val">{form.nitrogenTotal}</span>
                    <span className="cap">300</span>
                  </div>
                  <input
                    type="range"
                    className="fslider"
                    min="0"
                    max="300"
                    value={form.nitrogenTotal}
                    onChange={(e) => handleFieldChange('nitrogenTotal', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="fld">
                <div className="flbl">P₂O₅ (kg/ha)</div>
                <div className="slider-w">
                  <div className="slider-top">
                    <span className="cap">0</span>
                    <span className="slider-val">{form.phosphate}</span>
                    <span className="cap">150</span>
                  </div>
                  <input
                    type="range"
                    className="fslider"
                    min="0"
                    max="150"
                    value={form.phosphate}
                    onChange={(e) => handleFieldChange('phosphate', parseInt(e.target.value))}
                  />
                </div>
              </div>
              <div className="fld">
                <div className="flbl">K₂O (kg/ha)</div>
                <div className="slider-w">
                  <div className="slider-top">
                    <span className="cap">0</span>
                    <span className="slider-val">{form.potassium}</span>
                    <span className="cap">200</span>
                  </div>
                  <input
                    type="range"
                    className="fslider"
                    min="0"
                    max="200"
                    value={form.potassium}
                    onChange={(e) => handleFieldChange('potassium', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Économie & Travail */}
          <div className="fsec" style={{ marginBottom: 0 }}>
            <div className="fsec-title">📊 Économie & travail</div>
            <div className="fgrid">
              <div className="fld">
                <div className="flbl">
                  Marge brute (€/ha)
                  <span className="fref">{FIELD_REFERENCES.grossMargin}</span>
                </div>
                <input
                  type="number"
                  className="finp"
                  value={form.grossMargin}
                  step="10"
                  onChange={(e) => handleFieldChange('grossMargin', parseInt(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">
                  Temps de travail (h/ha)
                  <span className="fref">{FIELD_REFERENCES.workTime}</span>
                </div>
                <input
                  type="number"
                  className="finp"
                  value={form.workTime}
                  step="0.5"
                  onChange={(e) => handleFieldChange('workTime', parseFloat(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">Nombre UTH</div>
                <input
                  type="number"
                  className="finp"
                  value={form.uth}
                  step="0.5"
                  onChange={(e) => handleFieldChange('uth', parseFloat(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">
                  Carburant (L/ha)
                  <span className="fref">{FIELD_REFERENCES.fuel}</span>
                </div>
                <input
                  type="number"
                  className="finp"
                  value={form.fuel}
                  step="1"
                  onChange={(e) => handleFieldChange('fuel', parseInt(e.target.value))}
                />
              </div>
              <div className="fld">
                <div className="flbl">Consommation eau (m³/ha)</div>
                <input
                  type="number"
                  className="finp"
                  value={form.water}
                  step="10"
                  onChange={(e) => handleFieldChange('water', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

        </div>

        {/* SIDEBAR RESULT */}
        <div>
          {/* IFT prédit */}
          <div className="ift-card">
            <div className="ift-card-lbl">IFT total prédit · Modèle RF</div>
            <div
              className="ift-card-val"
              style={{ color: getIFTColor(predictedIFT, iftRef, iftMedian) }}
            >
              {predictedIFT.toFixed(2)}
              <span className="ift-card-unit">IFT</span>
            </div>
            <div className="gauge-wrap">
              <div className="gauge-trk">
                <div
                  className="gauge-fil"
                  style={{
                    width: getGaugePct(predictedIFT, iftMax) + '%',
                    background: getIFTColor(predictedIFT, iftRef, iftMedian)
                  }}
                ></div>
              </div>
              <div className="gauge-tks">
                <span>0</span>
                <span>Réf {iftRef.toFixed(2).replace('.', ',')}</span>
                <span>Méd {iftMedian.toFixed(1).replace('.', ',')}</span>
                <span>{iftMax}+</span>
              </div>
            </div>
            <div className="ift-card-sub">IFT chimique + IFT biocontrôle</div>
          </div>

          {/* Décomposition */}
          <div className="card" style={{ marginBottom: '10px' }}>
            <div className="card-title" style={{ marginBottom: '10px' }}>📉 Décomposition IFT</div>
            <div className="cr">
              <span className="k">IFT Chimique</span>
              <span className="v v-warn">{form.chemiIFT.toFixed(2)}</span>
            </div>
            <div className="cr">
              <span className="k">IFT Biocontrôle</span>
              <span className="v v-teal">{form.biocontrolIFT.toFixed(2)}</span>
            </div>
            <div className="cr">
              <span className="k">vs médiane ({iftMedian.toFixed(2).replace('.', ',')})</span>
              <span className="v" style={{ color: parseFloat(vmed) > 0 ? 'var(--orange)' : 'var(--green-d)' }}>
                {parseFloat(vmed) > 0 ? '+' : ''}{vmed}%
              </span>
            </div>
            <div className="cr">
              <span className="k">vs référence ({iftRef.toFixed(2).replace('.', ',')})</span>
              <span className="v v-bad">
                {parseFloat(vref) > 0 ? '+' : ''}{vref}%
              </span>
            </div>
            <div className="cr">
              <span className="k">Potentiel estimé</span>
              <span className="v v-good">−40 à −45%</span>
            </div>
          </div>

          {/* Autres indicateurs */}
          <div className="card card-bg-green">
            <div className="card-title" style={{ marginBottom: '10px' }}>
              🌍 Indicateurs complémentaires
            </div>
            <div className="cr">
              <span className="k">⏱ Temps de travail</span>
              <span className="v v-warn">{form.workTime} h/ha</span>
            </div>
            <div className="cr">
              <span className="k">€ Marge brute</span>
              <span className="v" style={{ color: 'var(--violet)' }}>
                {form.grossMargin.toLocaleString('fr')} €/ha
              </span>
            </div>
            <div className="cr">
              <span className="k">⛽ Carburant</span>
              <span className="v v-warn">{form.fuel} L/ha</span>
            </div>
          </div>

          <button
            className="btn btn-green"
            style={{
              width: '100%',
              padding: '9px',
              marginTop: '10px',
              fontSize: '.78rem',
              justifyContent: 'center'
            }}
          >
            ⚡ Simuler les leviers →
          </button>
        </div>

      </div>
    </div>
  );
};
