✈️ Voyage Analytics: End-to-End MLOps Platform

Voyage Analytics is an enterprise-grade, end-to-end Machine Learning Operations (MLOps) platform designed to predict dynamic flight prices. It encompasses the entire ML lifecycle: from automated data ingestion and model retraining, to containerized API serving, and scalable Kubernetes orchestration.

🏗️ System Architecture & Tech Stack

Data Engineering & Automation: Apache Airflow (Scheduled Pipelines)

Machine Learning: Scikit-Learn (Random Forest Regressor), Pandas, NumPy

Experiment Tracking: MLflow

Backend API: Flask, Gunicorn

Frontend UI: Streamlit

Containerization: Docker & Docker Compose

Orchestration: Kubernetes (K8s)

CI/CD: GitHub Actions

📂 Project Structure

voyage-analytics/
├── data/                   # Raw and processed datasets
├── dags/                   # Apache Airflow DAGs for workflow automation
├── deployment/             
│   ├── docker/             # Dockerfiles (API, UI, Airflow)
│   └── k8s/                # Kubernetes deployment & service manifests
├── models/                 # Serialized models (.joblib)
├── src/                    
│   ├── api/                # Flask REST API
│   ├── features/           # Feature engineering logic
│   ├── training/           # Model training pipeline scripts
│   └── ui/                 # Streamlit frontend application
├── .github/workflows/      # CI/CD pipelines
├── docker-compose-airflow.yaml # Local Airflow infrastructure
└── requirements.txt        # Python dependencies



🚀 How to Run Locally

Option 1: Development Mode (Docker Compose)

Run the automated Airflow retraining pipeline locally:

# Initialize Airflow DB
docker-compose -f docker-compose-airflow.yaml run airflow-webserver airflow db init

# Create Admin User
docker-compose -f docker-compose-airflow.yaml run airflow-webserver airflow users create --username admin --firstname Admin --lastname User --role Admin --email admin@example.com --password admin

# Start Services
docker-compose -f docker-compose-airflow.yaml up -d



Access Airflow UI at http://localhost:8080

Option 2: Production Mode (Kubernetes)

Deploy the API and UI to a local Kubernetes cluster (requires Docker Desktop with K8s enabled or Minikube):

# Build Images
docker build -t voyage-api:latest -f deployment/docker/api.Dockerfile .
docker build -t voyage-ui:latest -f deployment/docker/ui.Dockerfile .

# Apply Manifests
kubectl apply -f deployment/k8s/api-deployment.yaml
kubectl apply -f deployment/k8s/api-service.yaml
kubectl apply -f deployment/k8s/ui-deployment.yaml
kubectl apply -f deployment/k8s/ui-service.yaml

# Port Forward the UI
kubectl port-forward service/voyage-ui-service 8081:80



Access the interactive Streamlit Dashboard at http://localhost:8081

🧠 ML Pipeline Overview

Ingestion: Airflow DAG extracts latest flight data from the data/ directory.

Preprocessing: Categorical encoding, scaling, and feature engineering.

Training: Scikit-Learn Random Forest model is trained on the processed data.

Serialization: The champion model is saved to the models/ directory for API consumption.

Built with ❤️ to demonstrate modern MLOps principles.