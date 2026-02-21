import os
import sys
import sys
import logging
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

# --- CRITICAL PATH FIX FOR DOCKER ---
# Force Python to look in the mounted repo directory for our custom modules
REPO_PATH = "/opt/airflow/dags/repo"
if REPO_PATH not in sys.path:
    sys.path.insert(0, REPO_PATH)

# Now we can safely import from our src folder
from src.training.train_pipeline import ingest_data, preprocess_data, train_model

default_args = {
    'owner': 'voyage-analytics',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 0, # Set to 0 so it fails immediately for easier debugging
    'retry_delay': timedelta(minutes=1),
}

def verify_setup():
    """
    Diagnostic task to ensure folders and files are mounted correctly in Docker.
    This prevents confusing errors by catching the root cause early.
    """
    logger = logging.getLogger("airflow.task")
    
    logger.info(f"Current Working Directory inside Docker: {os.getcwd()}")
    logger.info(f"Python System Path: {sys.path}")
    
    data_dir = os.path.join(REPO_PATH, "data")
    models_dir = os.path.join(REPO_PATH, "models")
    
    # 1. Check if directories exist
    if not os.path.exists(data_dir):
        raise FileNotFoundError(f"CRITICAL: The data folder is missing at {data_dir}. Check your Docker volumes!")
    
    if not os.path.exists(models_dir):
        logger.info(f"Models directory missing. Creating it at {models_dir}")
        os.makedirs(models_dir, exist_ok=True)
        
    # 2. Check for the actual data file
    flights_file = os.path.join(data_dir, "flights.csv")
    if not os.path.exists(flights_file):
        error_msg = (
            f"\n\n{'='*60}\n"
            f"🚨 STOP! FLIGHTS.CSV NOT FOUND! 🚨\n"
            f"Airflow is looking for data at: {flights_file}\n\n"
            f"HOW TO FIX:\n"
            f"1. Open your code editor on your Windows machine.\n"
            f"2. Go into your 'data' folder.\n"
            f"3. Create a file named 'flights.csv'.\n"
            f"4. Paste some dummy data inside it and save.\n"
            f"{'='*60}\n"
        )
        logger.error(error_msg)
        raise FileNotFoundError("Missing flights.csv file.")
        
    logger.info("✅ Environment verified! Data file found. Proceeding to pipeline.")

with DAG(
    'voyage_model_retraining',
    default_args=default_args,
    description='Automated retraining pipeline with Diagnostics',
    schedule_interval=timedelta(days=7),
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=['mlops', 'production', 'diagnostic'],
) as dag:

    # Task 0: Diagnose the environment
    t0 = PythonOperator(
        task_id='verify_environment',
        python_callable=verify_setup,
    )

    # Task 1: Load Data
    t1 = PythonOperator(
        task_id='ingest_data',
        python_callable=ingest_data,
    )

    # Task 2: Process Data
    t2 = PythonOperator(
        task_id='preprocess_data',
        python_callable=preprocess_data,
    )

    # Task 3: Train Machine Learning Model
    t3 = PythonOperator(
        task_id='train_model',
        python_callable=train_model,
    )

    # Define the precise execution order
    t0 >> t1 >> t2 >> t3