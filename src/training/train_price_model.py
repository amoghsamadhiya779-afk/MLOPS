import sys
import os
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Add parent directory to path to import utils and features
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_loader import DataLoader
from features import FeatureEngineer

# Configuration
EXPERIMENT_NAME = "Flight_Price_Prediction"
MODEL_PATH = "models/flight_price_rf_model"
RANDOM_STATE = 42

def eval_metrics(actual, pred):
    rmse = np.sqrt(mean_squared_error(actual, pred))
    mae = mean_absolute_error(actual, pred)
    r2 = r2_score(actual, pred)
    return rmse, mae, r2

def main():
    print("🚀 Starting Model Training Pipeline...")

    # 1. Initialize MLflow
    mlflow.set_experiment(EXPERIMENT_NAME)
    
    with mlflow.start_run():
        # 2. Load Data
        print("Loading data...")
        loader = DataLoader()
        flights, _, _ = loader.load_all_data()
        flights = loader.preprocess_flights(flights)

        # 3. Feature Engineering
        print("Engineering features...")
        engineer = FeatureEngineer()
        
        # Separate Target
        X = flights.drop(columns=['price'])
        y = flights['price']
        
        # Transform features
        X_processed = engineer.fit_transform(X)
        
        print(f"Feature set shape: {X_processed.shape}")
        
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
        predicted_qualities = rf.predict(X_test)
        (rmse, mae, r2) = eval_metrics(y_test, predicted_qualities)

        print(f"  RMSE: {rmse}")
        print(f"  MAE: {mae}")
        print(f"  R2: {r2}")

        # 7. Log to MLflow
        print("Logging to MLflow...")
        mlflow.log_param("n_estimators", n_estimators)
        mlflow.log_param("max_depth", max_depth)
        mlflow.log_metric("rmse", rmse)
        mlflow.log_metric("mae", mae)
        mlflow.log_metric("r2", r2)
        
        # Log the model
        mlflow.sklearn.log_model(rf, "model")
        
        print(f"✅ Training Complete. Model tracked in MLflow experiment '{EXPERIMENT_NAME}'")

if __name__ == "__main__":
    main()