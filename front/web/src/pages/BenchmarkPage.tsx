import React, { useState } from 'react';

export const BenchmarkPage: React.FC = () => {
  const [species, setSpecies] = useState('Blé tendre');
  const [department, setDepartment] = useState('35 — Ille-et-Vilaine');
  const [agricultureType, setAgricultureType] = useState('Tous (Bio + Conv.)');
  const [iftThreshold, setIftThreshold] = useState('−30% vs médiane');

  const referenceData = [
    { rank: 1, name: 'GAEC Kervran', type: 'Bio · 89 ha · SD', ift: 0.82, gap: '−64%' },
    { rank: 2, name: 'EARL Tanguy', type: 'Conv. · 124 ha', ift: 0.98, gap: '−57%' },
    { rank: 3, name: 'SAS Morvan', type: 'Conv. · 67 ha · TCS', ift: 1.10, gap: '−52%' },
    { rank: 4, name: 'SCEA Le Goff', type: 'Conv. · 210 ha', ift: 1.22, gap: '−47%' },
    { rank: 5, name: 'GAEC Quéfélec', type: 'Bio · 155 ha · SD', ift: 1.28, gap: '−44%' },
    { rank: 6, name: 'EARL Jouan', type: 'Conv. · 98 ha', ift: 1.35, gap: '−41%' },
    { rank: 7, name: 'SAS Penglaou', type: 'Conv. · 78 ha', ift: 1.41, gap: '−39%' },
    { rank: 8, name: 'EARL Beaudouin', type: 'Conv. · 190 ha', ift: 1.48, gap: '−36%' },
  ];

  return (
    <div className="page active" id="page-bench">
      <div className="page-hd">
        <div>
          <h1>Benchmark régional — Dép. 35 · Blé tendre</h1>
          <p>Identification des fermes les plus performantes sur l'IFT · Campagne 2023–2024</p>
        </div>
        <div className="page-hd-right">
          <button className="btn btn-outline">Mon ITK →</button>
        </div>
      </div>

      {/* FILTRES */}
      <div className="filters">
        <div className="fg">
          <div className="fg-label">🌾 Espèce cultivée</div>
          <select 
            className="fg-sel" 
            value={species} 
            onChange={(e) => setSpecies(e.target.value)}
          >
            <option>Blé tendre</option>
            <option>Maïs grain</option>
            <option>Colza</option>
            <option>Orge d'hiver</option>
            <option>Tournesol</option>
          </select>
        </div>
        <div className="fg">
          <div className="fg-label">📍 Département</div>
          <select 
            className="fg-sel" 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option>35 — Ille-et-Vilaine</option>
            <option>29 — Finistère</option>
            <option>22 — Côtes-d'Armor</option>
            <option>56 — Morbihan</option>
          </select>
        </div>
        <div className="fg">
          <div className="fg-label">🌿 Type agriculture</div>
          <select 
            className="fg-sel" 
            value={agricultureType} 
            onChange={(e) => setAgricultureType(e.target.value)}
          >
            <option>Tous (Bio + Conv.)</option>
            <option>Conventionnel seul</option>
            <option>Biologique seul</option>
          </select>
        </div>
        <div className="fg-sep"></div>
        <div className="fg">
          <div className="fg-label">🎯 Seuil de performance IFT</div>
          <select 
            className="fg-sel" 
            value={iftThreshold} 
            onChange={(e) => setIftThreshold(e.target.value)}
          >
            <option>−20% vs médiane</option>
            <option>−30% vs médiane</option>
            <option>−40% vs médiane</option>
          </select>
        </div>
        <button className="btn btn-green">Appliquer</button>
      </div>

      {/* SEUIL RETENU */}
      <div style={{
        background: 'var(--teal-l)',
        border: '1px solid #A8D8D8',
        borderRadius: '8px',
        padding: '9px 13px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '9px',
        fontSize: '.73rem'
      }}>
        <span style={{ fontSize: '1rem' }}>🎯</span>
        <div>
          Seuil retenu : <b>IFT ≤ 1,61</b> (médiane 2,30 × 0,70) ·
          <b style={{ color: '#1F9595' }}>22 fermes référence</b> identifiées sur 312 ·
          <span style={{ color: 'var(--text2)' }}>Ces fermes constituent votre feuille de route</span>
        </div>
      </div>

      {/* KPIs MÉDIANE */}
      <div className="kpi-row">
        <div className="kpi green">
          <div className="kpi-label">📉 Médiane IFT total — Dép. 35</div>
          <div className="kpi-val green">
            2,30 
            <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text3)' }}>IFT</span>
          </div>
          <div className="kpi-sub">312 exploitations · Blé tendre · Campagne 2023</div>
          <div className="kpi-delta warn">↑ +21,7% vs votre exploitation (2,80)</div>
        </div>
        <div className="kpi teal">
          <div className="kpi-label">⏱ Médiane temps de travail — Dép. 35</div>
          <div className="kpi-val teal">
            18,4 
            <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text3)' }}>h/ha</span>
          </div>
          <div className="kpi-sub">Travail total (manuel + mécanisé)</div>
          <div className="kpi-delta good">↓ −7,5% vs votre exploitation (19,9 h/ha)</div>
        </div>
        <div className="kpi violet">
          <div className="kpi-label">€ Médiane marge brute — Dép. 35</div>
          <div className="kpi-val violet">
            1 240 
            <span style={{ fontSize: '.9rem', fontWeight: 500, color: 'var(--text3)' }}>€/ha</span>
          </div>
          <div className="kpi-sub">Marge brute réelle hors autoconsommation</div>
          <div className="kpi-delta good">↓ −4,0% vs votre exploitation (1 292 €/ha)</div>
        </div>
      </div>

      {/* MAIN : PROFIL + TABLE */}
      <div className="g64">
        {/* LEFT : PROFIL PRATIQUES */}
        <div className="card">
          <div className="card-h">
            <div className="card-title">🔍 Profil des pratiques — 22 fermes référence (IFT ≤ 1,61)</div>
            <span className="tag tag-teal">IFT −30%</span>
          </div>
          <div className="lev-grid">
            <div className="lt">
              <div className="lt-h">
                <div>
                  <div className="lt-name">Travail du sol</div>
                  <div className="lt-var">type_de_travail_du_sol</div>
                </div>
                <span className="badge-type bt-ql">Qualitatif</span>
              </div>
              <div className="fr">
                <div className="fr-lbl">Semis direct</div>
                <div className="fr-trk"><div className="fr-fil top" style={{ width: '59%' }}></div></div>
                <div className="fr-pct">59%</div>
              </div>
              <div className="fr">
                <div className="fr-lbl">TCS</div>
                <div className="fr-trk"><div className="fr-fil" style={{ width: '32%' }}></div></div>
                <div className="fr-pct">32%</div>
              </div>
              <div className="fr">
                <div className="fr-lbl">Labour</div>
                <div className="fr-trk"><div className="fr-fil" style={{ width: '9%' }}></div></div>
                <div className="fr-pct">9%</div>
              </div>
            </div>

            <div className="lt">
              <div className="lt-h">
                <div>
                  <div className="lt-name">Désherbage mécanique</div>
                  <div className="lt-var">utili_desherbage_meca</div>
                </div>
                <span className="badge-type bt-ql">Qualitatif</span>
              </div>
              <div className="fr">
                <div className="fr-lbl">Oui — systématique</div>
                <div className="fr-trk"><div className="fr-fil top" style={{ width: '82%' }}></div></div>
                <div className="fr-pct">82%</div>
              </div>
              <div className="fr">
                <div className="fr-lbl">Non</div>
                <div className="fr-trk"><div className="fr-fil" style={{ width: '18%' }}></div></div>
                <div className="fr-pct">18%</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT : FERMES RÉFÉRENCE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <div className="card-h">
              <div className="card-title">🏆 22 fermes référence</div>
              <span className="badge bg-green">IFT ≤ 1,61</span>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Exploitation</th>
                  <th>IFT</th>
                  <th>Écart</th>
                </tr>
              </thead>
              <tbody>
                {referenceData.map((farm) => (
                  <tr key={farm.rank}>
                    <td className="tbl-rank">#{farm.rank}</td>
                    <td>
                      <div className="tbl-name">{farm.name}</div>
                      <div className="tbl-sub">{farm.type}</div>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--green-d)' }}>{farm.ift}</td>
                    <td><span className="badge bg-green">{farm.gap}</span></td>
                  </tr>
                ))}
                <tr>
                  <td className="tbl-rank">···</td>
                  <td colSpan={3} style={{ fontSize: '.67rem', color: 'var(--text3)' }}>
                    14 autres · IFT entre 1,49 et 1,61
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{
            background: 'var(--green-ll)',
            border: '1px solid #CBEAA8',
            borderRadius: '8px',
            padding: '11px 13px',
            fontSize: '.72rem',
            color: 'var(--text2)',
            lineHeight: '1.55'
          }}>
            <div style={{ fontWeight: 800, color: 'var(--green-d)', marginBottom: '4px' }}>
              💡 Signal dominant
            </div>
            Ces 22 fermes pratiquent massivement le <b>semis direct ou TCS</b>, le <b>désherbage mécanique</b> (3+ passages), une <b>rotation longue</b> (≥5 cultures) et des <b>variétés très résistantes</b>.
          </div>
          <button 
            className="btn btn-green" 
            style={{
              width: '100%',
              padding: '9px',
              fontSize: '.8rem',
              justifyContent: 'center'
            }}
          >
            → Renseigner mon ITK
          </button>
        </div>
      </div>
    </div>
  );
};
