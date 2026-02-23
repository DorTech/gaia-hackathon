source .venv/bin/activate
uvicorn serve_model:app --reload --port 8000

# Example of call:
#curl -X POST http://localhost:8000/predict \
#  -H "Content-Type: application/json" \
#  -d '{"nb_cultures_rotation":6,"sequence_cultures":"Blé","type_de_travail_du_sol":"LABOUR_OCCASIONNEL","recours_macroorganismes":"true","nbre_de_passages_desherbage_meca":2}'