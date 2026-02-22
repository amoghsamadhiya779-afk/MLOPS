from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import sys

# Tell Airflow where to find our python scripts
sys.path.insert(0, "/opt/airflow/dags/repo") 
from src.training.train_pipeline import ingest_data, preprocess_data, train_model

default_args = {
    'owner': 'voyage-analytics',
    'depends_on_past': False,
    'retries': 0, 
}

with DAG(
    'voyage_model_retraining',
    default_args=default_args,
    description='Automated ML Training Pipeline',
    schedule_interval=timedelta(days=7),
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=['mlops'],
) as dag:

    t1 = PythonOperator(task_id='ingest_data', python_callable=ingest_data)
    t2 = PythonOperator(task_id='preprocess_data', python_callable=preprocess_data)
    t3 = PythonOperator(task_id='train_model', python_callable=train_model)

    # Execution Order
    t1 >> t2 >> t3