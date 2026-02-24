import json
import os
from pathlib import Path

import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel


def extract_crops_from_sequence(sequence: str) -> list[str]:
    """Extract individual crops from a sequence string."""
    if not sequence or not str(sequence).strip():
        return []
    return [crop.strip() for crop in str(sequence).split(">")]


class PredictionRequest(BaseModel):
    nb_cultures_rotation: int
    sequence_cultures: str
    recours_macroorganismes: str
    nbre_de_passages_desherbage_meca: int
    type_de_travail_du_sol: str
    departement: int
    sdc_type_agriculture: str
    ferti_n_tot: float


def load_model_and_metadata():
    repo_root = Path(__file__).resolve().parents[0]
    model_path = os.getenv(
        "MODEL_PATH",
        str(repo_root / "models" / "ift_histo_chimique_tot_rf.joblib"),
    )
    metrics_path = os.getenv(
        "METRICS_PATH",
        str(repo_root / "models" / "ift_histo_chimique_tot_rf.metrics.json"),
    )
    
    model = joblib.load(model_path)
    
    with open(metrics_path) as f:
        metadata = json.load(f)
    
    known_crops = metadata.get("known_crops", [])
    return model, known_crops


app = FastAPI(title="Dephy IFT Predictor")
model, KNOWN_CROPS = load_model_and_metadata()
print(f"Model loaded with {len(KNOWN_CROPS)} known crops: {KNOWN_CROPS}")


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/predict")
async def predict(payload: PredictionRequest):
    # Extract crops from the sequence
    crops_in_sequence = extract_crops_from_sequence(payload.sequence_cultures)
    sequence_length = len(crops_in_sequence)
    
    # Create the feature dictionary
    features = {
        "nb_cultures_rotation": payload.nb_cultures_rotation,
        "sequence_length": sequence_length,
        "recours_macroorganismes": payload.recours_macroorganismes,
        "nbre_de_passages_desherbage_meca": payload.nbre_de_passages_desherbage_meca,
        "type_de_travail_du_sol": payload.type_de_travail_du_sol,
        "departement": payload.departement,
        "sdc_type_agriculture": payload.sdc_type_agriculture,
        "ferti_n_tot": payload.ferti_n_tot,
    }
    
    # Add binary features for each known crop
    for crop in KNOWN_CROPS:
        features[f"crop_{crop}"] = 1 if crop in crops_in_sequence else 0
    
    # Create DataFrame and predict
    df = pd.DataFrame([features])
    prediction = float(model.predict(df)[0])
    
    return {"ift_histo_chimique_tot": prediction}
