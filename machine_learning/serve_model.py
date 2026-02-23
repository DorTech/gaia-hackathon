import os
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

FEATURE_COLS = ["nb_cultures_rotation", "sequence_cultures", "recours_macroorganismes", "nbre_de_passages_desherbage_meca", "type_de_travail_du_sol"]


class PredictionRequest(BaseModel):
    nb_cultures_rotation: int
    sequence_cultures: str
    recours_macroorganismes: str
    nbre_de_passages_desherbage_meca: int
    type_de_travail_du_sol: str


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
            "nb_cultures_rotation": payload.nb_cultures_rotation,
            "sequence_cultures": payload.sequence_cultures,
            "recours_macroorganismes": payload.recours_macroorganismes,
            "nbre_de_passages_desherbage_meca": payload.nbre_de_passages_desherbage_meca,
            "type_de_travail_du_sol": payload.type_de_travail_du_sol
        }
    ])
    prediction = float(model.predict(features)[0])
    return {"ift_histo_chimique_tot": prediction}
