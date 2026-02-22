import os
import pandas as pd
import logging
from sklearn.ensemble import RandomForestRegressor
import joblib

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Absolute paths based on Airflow Docker container
BASE_DIR = "/opt/airflow/dags/repo"
DATA_FILE = os.path.join(BASE_DIR, "data", "flights.csv")
MODEL_DIR = os.path.join(BASE_DIR, "models")
PROCESSED_FILE = os.path.join(MODEL_DIR, "processed_data.csv")

os.makedirs(MODEL_DIR, exist_ok=True)

def ingest_data():
    logger.info("Task 1: Ingesting Data...")
    if not os.path.exists(DATA_FILE):
        raise FileNotFoundError(f"CRITICAL: Cannot find data at {DATA_FILE}. Please create data/flights.csv!")
    
    df = pd.read_csv(DATA_FILE)
    logger.info(f"Successfully loaded {len(df)} rows of flight data.")
    return "Data Ingested"

def preprocess_data():
    logger.info("Task 2: Preprocessing Data...")
    df = pd.read_csv(DATA_FILE)
    
    # Simple preprocessing: Convert text to numbers for the model
    df['agency_code'] = df['agency'].astype('category').cat.codes
    df['class_code'] = df['flightType'].astype('category').cat.codes
    
    # Select features
    processed_df = df[['agency_code', 'class_code', 'distance', 'time', 'price']]
    processed_df.to_csv(PROCESSED_FILE, index=False)
    logger.info("Data preprocessed and saved.")

def train_model():
    logger.info("Task 3: Training Model...")
    df = pd.read_csv(PROCESSED_FILE)
    
    X = df.drop(columns=['price'])
    y = df['price']
    
    model = RandomForestRegressor(n_estimators=10, random_state=42)
    model.fit(X, y)
    
    model_path = os.path.join(MODEL_DIR, "flight_model.joblib")
    joblib.dump(model, model_path)
    logger.info(f"Model successfully trained and saved to {model_path}!")

if __name__ == "__main__":
    ingest_data()
    preprocess_data()
    train_model()