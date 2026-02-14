import sys
import os
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
import joblib  # Added joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Clean Import
from src.utils.data_loader import DataLoader
from features import FeatureEngineer

# Configuration
EXPERIMENT_NAME = "Flight_Price_Prediction"
# We will save the model here so the API can find it easily
MODEL_FILE_PATH = os.path.join("models", "flight_price_rf.joblib")
RANDOM_STATE = 42

def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2

def main():
    print("🚀 Starting Model Training Pipeline...")
    os.makedirs("models", exist_ok=True)

    # 1. Initialize MLflow
    mlflow.set_experiment(EXPERIMENT_NAME)
    
    with mlflow.start_run():
        # 2. Load Data
        print("Loading data...")
        loader = DataLoader()
        flights, _, _ = loader.load_all_data()
        
        # 3. Feature Engineering
        print("Engineering features...")
        engineer = FeatureEngineer()
        
        X = flights.drop(columns=['price'], errors='ignore')
        y = flights['price']
        
        # Transform features
        X_processed = engineer.fit_transform(X)
        
        # 4. Split Data
        X_train, X_test, y_train, y_test = train_test_split(
            X_processed, y, test_size=0.2, random_state=RANDOM_STATE
        )

        # 5. Train Model
        print("Training Random Forest Regressor...")
        n_estimators = 100
        max_depth = 10
        
        rf = RandomForestRegressor(
            n_estimators=n_estimators, 
            max_depth=max_depth, 
            random_state=RANDOM_STATE
        )
        rf.fit(X_train, y_train)

        # 6. Evaluate
        print("Evaluating model...")
        predicted = rf.predict(X_test)
        (rmse, mae, r2) = eval_metrics(y_test, predicted)

        print(f"  RMSE: {rmse}")
        print(f"  R2: {r2}")

        # 7. Log & Save
        mlflow.log_metric("rmse", rmse)
        mlflow.sklearn.log_model(rf, "model")
        
        # --- SAVE LOCALLY FOR API ---
        joblib.dump(rf, MODEL_FILE_PATH)
        print(f"✅ Model saved locally to {MODEL_FILE_PATH}")

if __name__ == "__main__":
    main()