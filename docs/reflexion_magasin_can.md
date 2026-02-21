# Notice d'utilisation des fichiers DEPHY

## Contexte

Ce dataset provient de l'export du Magasin CAN (DEPHY). L'objectif est d'identifier les fermes performantes sur l'IFT et d'analyser les leviers agronomiques mobilisés pour permettre à un agriculteur de simuler l'impact de modifications de son ITK.

---

## Fichiers prioritaires

### 1. Données d'IFT (variable cible)

| Fichier | Description | Volume | Clé primaire |
|---------|-------------|--------|--------------|
| `sdc_realise_performance_magasin_can.csv` | IFT agrégé au niveau **système de culture** | ~22k lignes | `sdc_id` |
| `zone_realise_performance_magasin_can.csv` | IFT au niveau **zone/parcelle** (plus fin) | ~120k lignes | `zone_id` |

**Colonnes IFT disponibles :**
- `ift_histo_chimique_tot` : IFT chimique total
- `ift_histo_chim_tot_hts` : IFT chimique hors traitement de semences
- `ift_histo_h` : IFT herbicides
- `ift_histo_f` : IFT fongicides
- `ift_histo_i` : IFT insecticides
- `ift_histo_ts` : IFT traitement de semences
- `ift_histo_biocontrole` : IFT biocontrôle

> **Recommandation** : Utiliser `sdc_realise_performance` pour le MVP (niveau système de culture = niveau décisionnel de l'agriculteur).

---

### 2. Leviers agronomiques (variables explicatives)

| Fichier | Description | Volume | Clé |
|---------|-------------|--------|-----|
| `sdc_magasin_can.csv` | **~50 leviers binaires** prêts à l'emploi | ~45k lignes | `sdc_id` |

**Catégories de leviers disponibles :**

#### Rotation culturale
- `monoculture_rotation_courte`
- `rotation_diversifiee_avec_pt` (prairie temporaire)
- `rotation_diversifiee_sans_pt`
- `rotation_diversifiee_intro_une_culture`
- `rotation_cultures_rustiques`

#### Travail du sol
- `labour_occasionnel`, `labour_frequent`, `labour_systematique`
- `semis_direct_occasionnel`, `semis_direct_systematique`
- `strip_till_occasionnel`, `strip_till_frequent`
- `tcs` (techniques culturales simplifiées)
- `faux_semis_ponctuels`, `faux_semis_intensifs`
- `decompactage_occasionnel`, `decompactage_frequent`

#### Désherbage alternatif
- `desherbage_meca_frequent`, `desherbage_meca_occasionnel`
- `desherbage_thermique`
- `desherbage_autre_forme`

#### Réduction des doses
- `reduction_dose_herbi`
- `reduction_dose_fongi`
- `reduction_dose_insec`
- `reduction_dose_autres_phyto`

#### Choix variétal
- `var_peu_sensibles_maladies`
- `var_peu_sensibles_ravageurs`
- `var_competitives_adventice`
- `var_peu_sensibles_verse`

#### Outils d'aide à la décision
- `utilisation_oad`
- `utilisation_seuils`
- `adaptation_lutte_a_la_parcelle`
- `optim_conditions_application`

#### Biocontrôle et alternatives
- `lutte_bio_confu_sexuelle`
- `lutte_bio_autre`
- `utilisation_stim_defense`
- `utilisation_adjuvants`

#### Couverts et intercultures
- `cipan`
- `ci_effet_allelo_ou_biocide`
- `ci_attractives_pour_auxiliaires`
- `couverts_associes`

#### Infrastructures agroécologiques
- `haies_anciennes`, `haies_jeunes`
- `bandes_enherbees`, `bandes_fleuries`
- `agroforesterie`
- `arbres_bordure_parcelle`
- `bois_bosquet`

#### Autres pratiques
- `traitement_localise`
- `cultures_pieges`
- `melange` (mélanges variétaux/espèces)
- `gestion_residus`

---

### 3. Localisation (filtrage régional)

| Fichier | Description | Volume | Clé |
|---------|-------------|--------|-----|
| `domaine_magasin_can.csv` | Informations sur l'exploitation | ~66k lignes | `domaine_id` |

**Colonnes utiles pour le filtrage géographique :**
- `departement`
- `commune`
- `petite_region_agricole`
- `domaine_zonage`

**Colonnes contextuelles :**
- `sau` : Surface Agricole Utile
- `otex_18_nom`, `otex_70_nom` : Orientation technico-économique
- `sdc_filiere` (dans sdc_magasin_can) : VITICULTURE, POLYCULTURE_ELEVAGE, GRANDES_CULTURES...
- `sdc_type_agriculture` : conventionnel, bio...

---

### 4. Rotation détaillée (enrichissement)

| Fichier | Description | Clé |
|---------|-------------|-----|
| `succession_assolee_realise_magasin_can.csv` | Séquence des cultures par zone | `sdc_id`, `zone_id` |

**Usage** : Calculer le nombre de cultures distinctes dans la rotation (indicateur synthétique de diversification).

```sql
-- Exemple : nombre de cultures par système
SELECT sdc_id, COUNT(DISTINCT culture_id) as nb_cultures_rotation
FROM succession_assolee_realise
GROUP BY sdc_id
```

---

## Schéma relationnel

```
┌─────────────────────────┐
│  domaine_magasin_can    │  (exploitation)
│  - domaine_id (PK)      │
│  - departement          │
│  - petite_region_agri   │
└───────────┬─────────────┘
            │ 1:N
            ▼
┌─────────────────────────┐
│  sdc_magasin_can        │  (système de culture + leviers)
│  - sdc_id (PK)          │
│  - domaine_id (FK)      │
│  - 50+ leviers binaires │
└───────────┬─────────────┘
            │ 1:1
            ▼
┌─────────────────────────────────┐
│  sdc_realise_performance        │  (IFT)
│  - sdc_id (PK/FK)               │
│  - ift_histo_chimique_tot       │
│  - ift_histo_h, f, i...         │
└─────────────────────────────────┘
```

---

## Tables PostgreSQL recommandées

### Tables principales (MVP)

```sql
-- 1. Exploitations avec localisation
CREATE TABLE domaine (
    domaine_id UUID PRIMARY KEY,
    domaine_code VARCHAR,
    domaine_nom VARCHAR,
    domaine_campagne INTEGER,
    departement VARCHAR,
    commune VARCHAR,
    petite_region_agricole VARCHAR,
    sau NUMERIC,
    otex_18_nom VARCHAR,
    otex_70_nom VARCHAR
);

-- 2. Systèmes de culture avec leviers
CREATE TABLE sdc (
    sdc_id UUID PRIMARY KEY,
    domaine_id UUID REFERENCES domaine(domaine_id),
    sdc_nom VARCHAR,
    sdc_filiere VARCHAR,
    sdc_type_agriculture VARCHAR,
    -- Leviers (booléens)
    monoculture_rotation_courte BOOLEAN,
    rotation_diversifiee_avec_pt BOOLEAN,
    rotation_diversifiee_sans_pt BOOLEAN,
    desherbage_meca_frequent BOOLEAN,
    desherbage_meca_occasionnel BOOLEAN,
    reduction_dose_herbi BOOLEAN,
    reduction_dose_fongi BOOLEAN,
    reduction_dose_insec BOOLEAN,
    var_peu_sensibles_maladies BOOLEAN,
    utilisation_oad BOOLEAN,
    utilisation_seuils BOOLEAN,
    labour_frequent BOOLEAN,
    semis_direct_systematique BOOLEAN,
    tcs BOOLEAN,
    faux_semis_intensifs BOOLEAN
    -- ... autres leviers selon besoins
);

-- 3. Performance IFT
CREATE TABLE sdc_performance (
    sdc_id UUID PRIMARY KEY REFERENCES sdc(sdc_id),
    ift_histo_chimique_tot NUMERIC,
    ift_histo_chim_tot_hts NUMERIC,
    ift_histo_h NUMERIC,
    ift_histo_f NUMERIC,
    ift_histo_i NUMERIC,
    ift_histo_biocontrole NUMERIC,
    ift_histo_tx_comp NUMERIC
);
```

### Vue analytique pour le modèle ML

```sql
CREATE VIEW v_sdc_analyse AS
SELECT 
    d.departement,
    d.petite_region_agricole,
    s.sdc_filiere,
    s.sdc_type_agriculture,
    -- Leviers
    s.monoculture_rotation_courte,
    s.rotation_diversifiee_avec_pt,
    s.desherbage_meca_frequent,
    s.reduction_dose_herbi,
    s.reduction_dose_fongi,
    s.var_peu_sensibles_maladies,
    s.utilisation_oad,
    s.tcs,
    -- Target
    p.ift_histo_chimique_tot
FROM sdc s
JOIN domaine d ON s.domaine_id = d.domaine_id
JOIN sdc_performance p ON s.sdc_id = p.sdc_id
WHERE p.ift_histo_chimique_tot IS NOT NULL;
```

---

## Fichiers secondaires (extensions futures)

| Fichier | Usage potentiel |
|---------|-----------------|
| `parcelle_magasin_can.csv` | Caractéristiques sol (texture, pH, irrigation) comme covariables |
| `intervention_realise_magasin_can.csv` | Détail des interventions (nb passages, dates) |
| `utilisation_intrant_realise_magasin_can.csv` | Doses appliquées par produit |
| `recolte_realise_magasin_can.csv` | Rendements (indicateur supplémentaire à optimiser) |
| `intrant_magasin_can.csv` | Référentiel produits phyto/ferti |

---

## Workflow recommandé

1. **Importer** `domaine`, `sdc`, `sdc_realise_performance`
2. **Joindre** les 3 tables sur `domaine_id` et `sdc_id`
3. **Filtrer** par région/filière pour le sous-échantillonnage
4. **Calculer** IFT moyen régional et identifier les X% meilleurs
5. **Analyser** la fréquence des leviers chez les meilleurs
6. **Entraîner** le Random Forest avec les leviers en features et IFT en target
