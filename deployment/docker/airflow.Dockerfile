FROM apache/airflow:2.7.1-python3.9

USER root
# Install git/build tools if needed
RUN apt-get update && \
    apt-get install -y git && \
    apt-get clean

USER airflow

# Copy requirements and install dependencies
COPY requirements.txt /requirements.txt
RUN pip install --no-cache-dir -r /requirements.txt

# Create directory for source code
RUN mkdir -p /opt/airflow/dags/repo