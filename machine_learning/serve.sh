source .venv/bin/activate
uvicorn serve_model:app --reload --port 8000

# Example of call:
# curl -X POST http://localhost:8000/predict \
#  -H "Content-Type: application/json" \
#  -d '{"sdc_filiere":"CEREALES","departement":"33","sdc_type_agriculture":"BIO"}'