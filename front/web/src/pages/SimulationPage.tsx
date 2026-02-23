import React, { useState } from 'react';

interface LeverDeltas {
  [key: string]: number;
}

export const SimulationPage: React.FC = () => {
  const baseIFT = 2.80;
  const [deltas, setDeltas] = useState<LeverDeltas>({});

  const levers = [
    {
      id: 'rot',
      name: '🌾 NB Rotation',
      type: 'Quantitatif',
      description: 'Les fermes référence pratiquent une rotation longue (médiane 4,8 cultures vs 3,1 ensemble), réduisant la pression adventice et maladie. Votre situation : 3 cultures.',
      current: '3 cultures · actuel',
      options: [
        { label: '4 cultures', delta: -0.22 },
        { label: '5+ cultures ★ réf.', delta: -0.38 }
      ]
    },
    {
      id: 'sol',
      name: '🚜 Travail du sol',
      type: 'Qualitatif',
      description: '59% des fermes référence sont en semis direct, 32% en TCS. Le labour systématique augmente la pression adventice et les herbicides. Votre situation : Labour.',
      current: 'Labour · actuel',
      options: [
        { label: 'TCS', delta: -0.28 },
        { label: 'Semis direct ★ réf.', delta: -0.45 }
      ]
    },
    {
      id: 'desh',
      name: '⚙️ Désherbage mécanique',
      type: 'Qualitatif',
      description: "82% des fermes référence pratiquent le désherbage mécanique (médiane 3,2 passages). Réduit directement l'IFT herbicide. Votre situation : Aucun.",
      current: 'Non · actuel',
      options: [
        { label: 'Oui — partiel (2 pass.)', delta: -0.30 },
        { label: 'Oui — complet ★ réf.', delta: -0.52 }
      ]
    },
    {
      id: 'var',
      name: '🧬 Variété résistante',
      type: 'Qualitatif',
      description: '73% des fermes référence utilisent des variétés très résistantes aux maladies fongiques, réduisant le nombre d\'interventions. Votre situation : Standard.',
      current: 'Standard · actuel',
      options: [
        { label: 'Résistance partielle', delta: -0.18 },
        { label: 'Très résistante ★ réf.', delta: -0.35 }
      ]
    },
    {
      id: 'bio',
      name: '🌿 Recours Biocontrôle',
      type: 'Qualitatif',
      description: '68% des fermes référence ont un recours complet au biocontrôle, substituant partiellement les traitements chimiques. Votre situation : Aucun.',
      current: 'Aucun · actuel',
      options: [
        { label: 'Partiel', delta: -0.20 },
        { label: 'Systématique ★ réf.', delta: -0.42 }
      ]
    },
    {
      id: 'couv',
      name: '🌱 Couverts hivernaux',
      type: 'Qualitatif',
      description: '86% des fermes référence ont des couverts hivernaux systématiques, réduisant la pression adventice et les herbicides. Votre situation : Partiel.',
      current: 'Partiel · actuel',
      options: [
        { label: 'Systématique ★ réf.', delta: -0.14 }
      ]
    },
    {
      id: 'n',
      name: '🧪 Fertilisation N',
      type: 'Quantitatif',
      description: 'Les fermes référence apportent 142 kgN/ha (médiane) vs 185 kg pour l\'ensemble. La réduction de l\'azote limite la vigueur et la pression fongique. Votre situation : 185 kgN/ha.',
      current: '185 kgN/ha · actuel',
      options: [
        { label: '160 kgN/ha', delta: -0.10 },
        { label: '142 kgN/ha ★ réf.', delta: -0.18 }
      ]
    }
  ];

  const handlePickOption = (leverId: string, delta: number) => {
    setDeltas(prev => ({
      ...prev,
      [leverId]: delta
    }));
  };

  const calculateSimulatedIFT = () => {
    let ift = baseIFT;
    Object.values(deltas).forEach(delta => {
      ift += delta;
    });
    return Math.max(0.05, Math.round(ift * 100) / 100);
  };

  const simulatedIFT = calculateSimulatedIFT();
  const activeLeverCount = Object.values(deltas).filter(d => d !== 0).length;
  const gained = baseIFT - simulatedIFT;
  const gainPct = gained > 0 ? (gained / baseIFT * 100).toFixed(1) : '0';

  const getIFTColor = (ift: number) => {
    if (ift <= 1.61) return 'var(--green-d)';
    if (ift <= 2.30) return 'var(--teal)';
    return 'var(--orange)';
  };

  const getGaugePct = (ift: number) => Math.min((ift / 4) * 100, 100);

  const getScenarioTag = () => {
    if (gained <= 0) return { text: 'Scénario en cours', class: 'tag-orange' };
    if (simulatedIFT <= 1.61) return { text: '★ Niveau référence !', class: 'tag-green' };
    if (simulatedIFT <= 2.30) return { text: '✓ Sous la médiane', class: 'tag-teal' };
    return { text: `En cours (−${gainPct}%)`, class: 'tag-orange' };
  };

  const scenarioTag = getScenarioTag();

  const vmed = ((simulatedIFT - 2.30) / 2.30 * 100).toFixed(1);
  const vref = ((simulatedIFT - 1.61) / 1.61 * 100).toFixed(1);

  return (
    <div className="page" id="page-sim">
      <div className="page-hd">
        <div>
          <h1>Simulation des leviers agronomiques</h1>
          <p>Sélectionnez les pratiques des fermes référence que vous seriez prêt à mobiliser · Recalcul RF en temps réel</p>
        </div>
        <div className="page-hd-right">
          <div className="steps">
            <div className="step done"><div className="step-n">✓</div>Benchmark</div>
            <span className="step-sep">›</span>
            <div className="step done"><div className="step-n">✓</div>Mon ITK</div>
            <span className="step-sep">›</span>
            <div className="step active"><div className="step-n">3</div>Simulation</div>
          </div>
          <div className={'tag ' + scenarioTag.class}>{scenarioTag.text}</div>
          <button className="btn btn-outline" onClick={() => setDeltas({})}>↺ Réinitialiser</button>
          <button className="btn btn-teal">💾 Sauvegarder</button>
        </div>
      </div>

      {/* BARRE RÉSUMÉ */}
      <div className="sim-summary">
        <div className="ss-group">
          <div className="ss-lbl">IFT actuel</div>
          <div className="ss-val current">{baseIFT}</div>
        </div>
        <div className="ss-arrow">→</div>
        <div className="ss-group">
          <div className="ss-lbl">IFT simulé</div>
          <div className="ss-val simulated" style={{ color: getIFTColor(simulatedIFT) }}>
            {simulatedIFT.toFixed(2)}
          </div>
        </div>
        <div className="ss-arrow">·</div>
        <div className="ss-group">
          <div className="ss-lbl">Amélioration</div>
          <div className="ss-val gain" style={{ color: gained > 0 ? 'var(--green-d)' : 'var(--text3)' }}>
            {gained > 0 ? `−${gainPct}%` : '—'}
          </div>
        </div>
        <div className="ss-sep"></div>
        <div className="ss-ref">
          <div className="ss-ref-item">
            <div className="ss-ref-lbl">Médiane Dép. 35</div>
            <div className="ss-ref-val" style={{ color: 'var(--text2)' }}>2,30</div>
          </div>
          <div className="ss-ref-item">
            <div className="ss-ref-lbl">Cible référence</div>
            <div className="ss-ref-val" style={{ color: 'var(--green-d)' }}>1,61</div>
          </div>
          <div className="ss-ref-item">
            <div className="ss-ref-lbl">Leviers actifs</div>
            <div className="ss-ref-val" style={{ color: 'var(--teal)' }}>{activeLeverCount}</div>
          </div>
        </div>
      </div>

      <div className="sim-layout">
        {/* LEFT : LEVIER CARDS */}
        <div>
          <div style={{
            fontSize: '.71rem',
            color: 'var(--text2)',
            marginBottom: '10px'
          }}>
            Observez les pratiques des 22 fermes référence et sélectionnez les leviers à mobiliser :
          </div>

          {levers.map((lever) => (
            <div
              key={lever.id}
              className={'lev-row ' + (deltas[lever.id] ? 'picked' : '')}
            >
              <div>
                <div className="lev-name">
                  {lever.name}
                  <span className={`badge-type ${lever.type === 'Quantitatif' ? 'bt-q' : 'bt-ql'}`}>
                    {lever.type}
                  </span>
                </div>
                <div className="lev-desc">{lever.description}</div>
                <div className="lev-opts">
                  <div className="lo curr">{lever.current}</div>
                  {lever.options.map((opt, idx) => (
                    <div
                      key={idx}
                      className="lo ref"
                      onClick={() => handlePickOption(lever.id, opt.delta)}
                    >
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="lev-impact">
                <div className={`lev-impact-val ${deltas[lever.id] ? 'good' : 'neu'}`}>
                  {deltas[lever.id] ? deltas[lever.id].toFixed(2) + ' IFT' : '—'}
                </div>
                <div className="lev-impact-sub">impact IFT</div>
              </div>
            </div>
          ))}

          <div style={{
            padding: '9px 12px',
            background: 'var(--green-ll)',
            border: '1px solid #CBEAA8',
            borderRadius: '7px',
            fontSize: '.67rem',
            color: 'var(--text2)',
            lineHeight: '1.5',
            marginTop: '4px'
          }}>
            <b style={{ color: 'var(--green-d)' }}>★</b> = modalité dominante chez les 22 fermes référence ·
            <b style={{ color: 'var(--orange)' }}>Actuel</b> = votre pratique actuelle (page 02) ·
            Les impacts sont estimés par le modèle Random Forest entraîné sur l'IFT total.
          </div>
        </div>

        {/* RIGHT : PANNEAU RÉSULTATS */}
        <div>
          {/* Waterfall */}
          <div className="card" style={{ marginBottom: '11px' }}>
            <div className="card-title" style={{ marginBottom: '11px' }}>
              📊 Décomposition de la réduction
            </div>
            <div id="waterfall">
              <div className="wf-row">
                <div className="wf-lbl">IFT de départ</div>
                <div className="wf-area">
                  <div className="wf-bar" style={{
                    background: 'var(--orange)',
                    opacity: 0.7,
                    width: '70%'
                  }}></div>
                </div>
                <div className="wf-num warn">{baseIFT}</div>
              </div>
              {levers.map((lever) => (
                deltas[lever.id] ? (
                  <div key={lever.id} className="wf-row">
                    <div className="wf-lbl">— {lever.name.split(' ').slice(1).join(' ')}</div>
                    <div className="wf-area">
                      <div className="wf-bar" style={{
                        background: 'var(--green)',
                        width: Math.min(Math.abs(deltas[lever.id]) / 4 * 100 * 1.2, 60) + '%'
                      }}></div>
                    </div>
                    <div className="wf-num good">{deltas[lever.id].toFixed(2)}</div>
                  </div>
                ) : null
              ))}
              <div className="wf-row">
                <div className="wf-lbl str">IFT simulé</div>
                <div className="wf-area">
                  <div className="wf-bar" style={{
                    background: getIFTColor(simulatedIFT),
                    width: getGaugePct(simulatedIFT) + '%'
                  }}></div>
                </div>
                <div className="wf-num" style={{
                  color: getIFTColor(simulatedIFT),
                  fontSize: '.78rem',
                  fontWeight: 800
                }}>
                  {simulatedIFT.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="total-impact">
              <div>
                <div className="ti-label">Réduction IFT totale</div>
                <div style={{
                  fontSize: '.62rem',
                  color: 'rgba(255,255,255,.55)',
                  marginTop: '2px'
                }}>
                  {activeLeverCount} levier{activeLeverCount > 1 ? 's' : ''} activé{activeLeverCount > 1 ? 's' : ''}
                </div>
              </div>
              <div className="ti-val">
                {gained > 0 ? `−${gainPct}%` : '—'}
                <small> IFT</small>
              </div>
            </div>
          </div>

          {/* Positionnement */}
          <div className="card" style={{ marginBottom: '11px' }}>
            <div className="card-title" style={{ marginBottom: '10px' }}>
              🎯 Positionnement simulé
            </div>
            <div className="cr">
              <span className="k">IFT simulé</span>
              <span className="v v-teal" style={{ color: getIFTColor(simulatedIFT) }}>
                {simulatedIFT.toFixed(2)}
              </span>
            </div>
            <div className="cr">
              <span className="k">vs médiane Dép. 35 (2,30)</span>
              <span className="v" style={{
                color: parseFloat(vmed) <= 0 ? 'var(--green-d)' : 'var(--orange)'
              }}>
                {parseFloat(vmed) > 0 ? '+' : ''}{vmed}%
              </span>
            </div>
            <div className="cr">
              <span className="k">vs fermes référence (1,61)</span>
              <span className="v" style={{
                color: parseFloat(vref) <= 0 ? 'var(--green-d)' : 'var(--red)'
              }}>
                {parseFloat(vref) > 0 ? '+' : ''}{vref}%
              </span>
            </div>
            <div className="cr">
              <span className="k">vs ma situation actuelle</span>
              <span className="v" style={{
                color: gained > 0 ? 'var(--green-d)' : 'var(--text3)'
              }}>
                {gained > 0 ? `−${gainPct}%` : '—'}
              </span>
            </div>
          </div>

          {/* Multi-indicateurs */}
          <div className="multi-ind">
            <div className="mi-title">🌍 Vision combinée multi-indicateurs</div>
            <div className="mi-row">
              <div className="mi-ico">📉</div>
              <div className="mi-key">IFT Total</div>
              <span className="mi-curr">{baseIFT}</span>
              <span className="mi-new" style={{
                color: getIFTColor(simulatedIFT)
              }}>
                → {simulatedIFT.toFixed(2)}
              </span>
            </div>
            <div className="mi-row">
              <div className="mi-ico">⏱</div>
              <div className="mi-key">Temps de travail</div>
              <span className="mi-curr">19,9 h/ha</span>
              <span className="mi-new">
                → {(19.9 + (deltas['desh'] ? Math.abs(deltas['desh']) * 2.5 : 0)).toFixed(1)} h/ha
              </span>
            </div>
            <div className="mi-row">
              <div className="mi-ico">€</div>
              <div className="mi-key">Marge brute</div>
              <span className="mi-curr">1 292 €/ha</span>
              <span className="mi-new" style={{
                color: gained > 0 ? 'var(--green-d)' : 'var(--text2)'
              }}>
                → {Math.round(1292 + gained * 14).toLocaleString('fr')} €/ha
              </span>
            </div>
            <div className="mi-row">
              <div className="mi-ico">⛽</div>
              <div className="mi-key">Carburant</div>
              <span className="mi-curr">94 L/ha</span>
              <span className="mi-new" style={{
                color: deltas['sol'] ? 'var(--green-d)' : 'var(--text2)'
              }}>
                → {Math.max(0, 94 - (deltas['sol'] ? Math.abs(deltas['sol']) * 16 : 0))} L/ha
              </span>
            </div>
            <div style={{
              marginTop: '7px',
              fontSize: '.61rem',
              color: 'var(--text3)'
            }}>
              Extension future : 💧 eau · 🌿 biodiversité · 🌡 carbone · ⚠ HRI1
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
