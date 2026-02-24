python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Ensure DB is running and env/.env.local has DB_* values
python train_random_forest.py