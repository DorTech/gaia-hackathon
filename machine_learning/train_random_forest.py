import json
import os
from pathlib import Path

import joblib
import pandas as pd
import psycopg2
from dotenv import load_dotenv
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC_COLS = ["nb_cultures_rotation", "nbre_de_passages_desherbage_meca", "sequence_length"]
CATEGORICAL_COLS = ["recours_macroorganismes", "type_de_travail_du_sol"]
SEQUENCE_COL = "sequence_cultures"
TARGET_COL = "ift_histo_chimique_tot"

# These will be populated during training
KNOWN_CROPS = []
FEATURE_COLS = NUMERIC_COLS + CATEGORICAL_COLS  # Crops will be added dynamically


def extract_crops_from_sequence(sequence: str) -> list[str]:
    """Extract individual crops from a sequence string."""
    if pd.isna(sequence) or not str(sequence).strip():
        return []
    return [crop.strip() for crop in str(sequence).split(">")]


def get_known_crops(df: pd.DataFrame) -> list[str]:
    """Extract all unique crops from sequence_cultures column."""
    all_crops = set()
    for seq in df[SEQUENCE_COL].dropna():
        crops = extract_crops_from_sequence(seq)
        all_crops.update(crops)
    return sorted(list(all_crops))


def add_crop_features(df: pd.DataFrame) -> pd.DataFrame:
    """Add binary features for each crop presence and sequence length."""
    df = df.copy()
    
    # Add sequence length
    df["sequence_length"] = df[SEQUENCE_COL].apply(
        lambda x: len(extract_crops_from_sequence(x)) if pd.notna(x) else 0
    )
    
    # Add binary features for each known crop
    for crop in KNOWN_CROPS:
        df[f"crop_{crop}"] = df[SEQUENCE_COL].apply(
            lambda x: 1 if crop in extract_crops_from_sequence(x) else 0
        )
    
    return df


def load_env() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    env_path = repo_root / "env" / ".env.local"
    if env_path.exists():
        load_dotenv(env_path)


def get_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5433")),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
        dbname=os.getenv("DB_DATABASE", "dephy"),
    )


def fetch_training_data() -> pd.DataFrame:
    query = """
WITH rotation_cte AS (
    SELECT
        sdc.id,
        COUNT(DISTINCT succession_assolee_synthetise_magasin_can.culture_nom) AS nb_cultures_rotation,
        STRING_AGG(DISTINCT succession_assolee_synthetise_magasin_can.culture_nom, ' > ') AS sequence_cultures
    FROM sdc
    JOIN succession_assolee_synthetise_magasin_can
        ON sdc.id = succession_assolee_synthetise_magasin_can.sdc_id
    GROUP BY sdc.id
    HAVING COUNT(DISTINCT succession_assolee_synthetise_magasin_can.culture_nom) > 2
       AND COUNT(DISTINCT succession_assolee_synthetise_magasin_can.culture_nom) < 6
)
SELECT
    r.id,
    r.nb_cultures_rotation,
    r.sequence_cultures,
    spmc.ift_histo_chimique_tot,
    spmc.ift_histo_biocontrole,
    spmc.tps_utilisation_materiel,
    spmc.tps_travail_manuel,
    spmc.recours_macroorganismes,
    spmc.recours_produits_biotiques_sansamm,
    spmc.utili_desherbage_meca,
    spmc.type_de_travail_du_sol,
    spmc.ferti_n_tot,
    spmc.conso_eau,
    spmc.conso_carburant,
    spmc.mb_reelle_avec_autoconso,
    spmc.nbre_de_passages_desherbage_meca,
    spmc.recours_aux_moyens_biologiques,
    spmc.nombre_uth_necessaires
FROM rotation_cte r
JOIN synthetise_perf_magasin_can spmc
    ON r.id = spmc.sdc_id;
    """
    with get_connection() as conn:
        df = pd.read_sql(query, conn)
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna(subset=[TARGET_COL, SEQUENCE_COL] + CATEGORICAL_COLS)
    # Convert numeric columns to numeric type
    for col in ["nb_cultures_rotation", "nbre_de_passages_desherbage_meca"]:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    # Convert categorical columns to string
    for col in CATEGORICAL_COLS:
        df[col] = df[col].astype(str).str.strip()
    return df


def train_model(df: pd.DataFrame) -> tuple[Pipeline, dict]:
    global KNOWN_CROPS, FEATURE_COLS
    
    # Extract known crops from training data
    KNOWN_CROPS = get_known_crops(df)
    print(f"Found {len(KNOWN_CROPS)} unique crops: {KNOWN_CROPS}")
    
    # Add crop features
    df = add_crop_features(df)
    
    # Update feature columns to include crops (they are numeric binary features)
    crop_cols = [f"crop_{crop}" for crop in KNOWN_CROPS]
    FEATURE_COLS = NUMERIC_COLS + CATEGORICAL_COLS + crop_cols
    
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # All crop columns are numeric binary, so include them in numeric preprocessing
    numeric_cols_with_crops = NUMERIC_COLS + crop_cols
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_cols_with_crops),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_COLS),
        ],
        remainder="drop",
    )

    model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            ("model", model),
        ]
    )

    pipeline.fit(X_train, y_train)
    preds = pipeline.predict(X_test)

    metrics = {
        "rows": int(df.shape[0]),
        "train_rows": int(X_train.shape[0]),
        "test_rows": int(X_test.shape[0]),
        "mae": float(mean_absolute_error(y_test, preds)),
        "rmse": float(mean_squared_error(y_test, preds, squared=False)),
        "r2": float(r2_score(y_test, preds)),
        "known_crops": KNOWN_CROPS,
    }

    return pipeline, metrics


def save_artifacts(pipeline: Pipeline, metrics: dict) -> None:
    repo_root = Path(__file__).resolve().parents[0]
    model_dir = repo_root / "models"
    model_dir.mkdir(parents=True, exist_ok=True)

    model_path = model_dir / "ift_histo_chimique_tot_rf.joblib"
    metrics_path = model_dir / "ift_histo_chimique_tot_rf.metrics.json"

    joblib.dump(pipeline, model_path)
    with metrics_path.open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)

    print(f"Saved model to {model_path}")
    print(f"Saved metrics to {metrics_path}")


def main() -> None:
    load_env()
    df = fetch_training_data()
    df = clean_data(df)

    if df.empty:
        raise RuntimeError("No training data after filtering. Check the source table.")

    pipeline, metrics = train_model(df)
    print("Training metrics:")
    for key, value in metrics.items():
        print(f"  {key}: {value}")

    save_artifacts(pipeline, metrics)


if __name__ == "__main__":
    main()
