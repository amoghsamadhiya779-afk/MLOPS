FROM apache/airflow:2.7.1-python3.9

USER root
RUN apt-get update && apt-get install -y git && apt-get clean

USER airflow
# Install machine learning libraries
RUN pip install --no-cache-dir pandas scikit-learn joblib