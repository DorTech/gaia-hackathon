import os
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

FEATURE_COLS = ["sdc_filiere", "departement", "sdc_type_agriculture"]


class PredictionRequest(BaseModel):
    sdc_filiere: str
    departement: str
    sdc_type_agriculture: str


def load_model():
    repo_root = Path(__file__).resolve().parents[0]
    model_path = os.getenv(
        "MODEL_PATH",
        str(repo_root / "models" / "ift_histo_chimique_tot_rf.joblib"),
    )
    return joblib.load(model_path)


app = FastAPI(title="Dephy IFT Predictor")
model = load_model()


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(payload: PredictionRequest):
    features = pd.DataFrame([
        {
            "sdc_filiere": payload.sdc_filiere,
            "departement": payload.departement,
            "sdc_type_agriculture": payload.sdc_type_agriculture,
        }
    ])
    prediction = float(model.predict(features)[0])
    return {"ift_histo_chimique_tot": prediction}
