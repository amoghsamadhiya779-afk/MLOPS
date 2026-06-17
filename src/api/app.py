import sys
import os
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import uvicorn

# Fix path to import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from src.features import FeatureEngineer

app = FastAPI(title="Voyage Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#----LOAD MODELS AT STARTUP---

print(" Loading Models . . . . ")
MODELS_DIR = "models"

# 1. Load Price Model & Engineer
try:
    price_model = joblib.load(os.path.join(MODELS_DIR, "flight_price_rf.joblib"))
    price_engineer = FeatureEngineer(artifacts_dir=MODELS_DIR)
    print("Price Model Loaded")
except Exception as e:
    print(f"Could not load Price Model: {e}")
    price_model = None
    price_engineer = None

# 2. Load Gender Model
try:
    gender_pipeline = joblib.load(os.path.join(MODELS_DIR, "gender_model_artifacts", "gender_pipeline.joblib"))
    print("Gender Model Loaded")
except Exception as e:
    print(f"Could not Load Gender Model: {e}")
    gender_pipeline = None

# 3. Load Recommender Model
try:
    rec_artifacts = joblib.load(os.path.join(MODELS_DIR, "recommender_artifacts", "recommender.joblib"))
    rec_model = rec_artifacts['model']
    rec_matrix = rec_artifacts['matrix']
    rec_hotel_names = rec_artifacts['hotel_names']
    print("Recommender Model Loaded")  
except Exception as e:
    print(f"Could not Load Recommender: {e}") 
    rec_model = None
    rec_matrix = None

# ---Routes---

@app.get('/health')
def health():
    return {"status": "ok", "message": "Voyage Analytics API is running"}

@app.post('/predict_price')
async def predict_price(request: Request):
    if not price_model:
        raise HTTPException(status_code=500, detail="Model not found...")
    
    data = await request.json()
    
    try:
        df = pd.DataFrame([data])

        # Preprocessing using our FeatureEngineering 
        # Note: We use .transform(), not .fit_transform() because we are in inference mode
        X_trans = price_engineer.transform(df)

        # Predict
        prediction = price_model.predict(X_trans)

        return {
            "predict_price": prediction[0]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post('/predict/gender')
async def predict_gender(request: Request):
    if not gender_pipeline:
        raise HTTPException(status_code=500, detail="Model not loaded...")
     
    data = await request.json()

    try:
        df = pd.DataFrame([data])
        prediction = gender_pipeline.predict(df)

        return {
            "predict_gender": prediction[0]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post('/recommend')
async def recommend(request: Request):
    if not rec_model:
        raise HTTPException(status_code=500, detail="Model not loaded...")
    
    data = await request.json()
    user_code = data.get('userCode')
    
    # 1. Check if user exists in our matrix
    if user_code not in rec_matrix.index:
        return {"message": "User not found. Showing popular items.", "recommendations": []}
    
    # 2. Get user vector
    user_vector = rec_matrix.loc[user_code].values.reshape(1, -1)
    
    # 3. Find neighbors
    distances, indices = rec_model.kneighbors(user_vector, n_neighbors=3)
    
    # 4. Get recommended hotels from similar users
    # (Simplification: just return the hotels the neighbors liked)
    similar_users_indices = indices.flatten()
    
    # Get top hotels from these similar users
    recommendations = []
    for idx in similar_users_indices:
        user_id = rec_matrix.index[idx]
        if user_id == user_code: continue # Skip self
        
        # Get hotels this similar user visited
        user_ratings = rec_matrix.iloc[idx]
        top_hotels = user_ratings[user_ratings > 0].index.tolist()
        recommendations.extend(top_hotels)
    
    # Deduplicate and limit
    unique_recs = list(set(recommendations))[:5]
    
    return {
        "user_code": user_code,
        "recommendations": unique_recs
    }
# --- MLOps Dashboard Endpoints ---
import random
from datetime import datetime, timedelta

@app.get('/api/experiments')
def get_experiments():
    now = datetime.now()
    experiments = []
    for i in range(10):
        acc = 0.85 + (random.random() * 0.1)
        loss = 0.4 - (random.random() * 0.2)
        experiments.append({
            "id": f"EXP-{1000+i}",
            "name": f"ResNet50_Run_{i}",
            "status": random.choice(["Completed", "Completed", "Completed", "Failed", "Running"]),
            "accuracy": round(acc, 4),
            "loss": round(loss, 4),
            "duration": f"{random.randint(45, 120)}m",
            "timestamp": (now - timedelta(hours=i*2)).strftime("%Y-%m-%d %H:%M")
        })
    return {"experiments": experiments}

@app.get('/api/models')
def get_models():
    return {"models": [
        {"name": "flight_price_rf", "version": "v1.4.2", "stage": "Production", "accuracy": 0.94, "last_updated": "2 hours ago"},
        {"name": "gender_pipeline", "version": "v2.1.0", "stage": "Staging", "accuracy": 0.89, "last_updated": "5 hours ago"},
        {"name": "hotel_recommender", "version": "v1.0.0", "stage": "Production", "accuracy": 0.91, "last_updated": "1 day ago"},
        {"name": "churn_predictor_xgb", "version": "v0.9.1", "stage": "Archived", "accuracy": 0.78, "last_updated": "2 weeks ago"},
        {"name": "fraud_detection_nn", "version": "v3.0.0", "stage": "Production", "accuracy": 0.99, "last_updated": "1 month ago"}
    ]}

@app.get('/api/deployments')
def get_deployments():
    return {"clusters": [
        {"name": "us-east-1-prod", "status": "Healthy", "nodes": 12, "pods": 48, "cpu_usage": 65, "mem_usage": 72},
        {"name": "eu-west-1-prod", "status": "Healthy", "nodes": 8, "pods": 32, "cpu_usage": 58, "mem_usage": 60},
        {"name": "us-west-2-staging", "status": "Warning", "nodes": 3, "pods": 10, "cpu_usage": 85, "mem_usage": 90}
    ]}

@app.get('/api/telemetry')
def get_telemetry():
    return {
        "p99_latency": random.randint(45, 120),
        "throughput": random.randint(1000, 5000),
        "error_rate": round(random.uniform(0.01, 0.5), 2),
        "active_users": random.randint(10000, 50000)
    }

import asyncio

@app.post('/api/train')
async def trigger_training():
    # Simulate a long running training process asynchronously
    await asyncio.sleep(2.5) # Simulate delay
    return {
        "status": "success",
        "message": "Training Pipeline Completed Successfully",
        "run_id": f"EXP-{random.randint(2000, 9999)}",
        "metrics": {
            "accuracy": round(0.92 + random.random() * 0.05, 4),
            "loss": round(0.1 + random.random() * 0.1, 4)
        }
    }

from pydantic import BaseModel
class PromoteRequest(BaseModel):
    model_name: str
    version: str

@app.post('/api/models/promote')
async def promote_model(req: PromoteRequest):
    await asyncio.sleep(1.0)
    return {
        "status": "success",
        "message": f"Successfully promoted {req.model_name} {req.version} to Production"
    }

def main():
    uvicorn.run("src.api.app:app", host="0.0.0.0", port=5000, reload=True)

if __name__ == '__main__':
    main()