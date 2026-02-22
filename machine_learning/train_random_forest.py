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
from sklearn.preprocessing import OneHotEncoder

FEATURE_COLS = ["sdc_filiere", "departement", "sdc_type_agriculture"]
TARGET_COL = "ift_histo_chimique_tot"


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
        SELECT
            ift_histo_chimique_tot,
            sdc_filiere,
            departement,
            sdc_type_agriculture
        FROM sdc_realise_perf_magasin_can
        WHERE ift_histo_chimique_tot IS NOT NULL
    """
    with get_connection() as conn:
        df = pd.read_sql(query, conn)
    return df


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    df = df.dropna(subset=[TARGET_COL] + FEATURE_COLS)
    for col in FEATURE_COLS:
        df[col] = df[col].astype(str).str.strip()
    return df


def train_model(df: pd.DataFrame) -> tuple[Pipeline, dict]:
    X = df[FEATURE_COLS]
    y = df[TARGET_COL]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                FEATURE_COLS,
            )
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
