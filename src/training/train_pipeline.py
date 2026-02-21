import sys 
import os 
import joblib
import pandas as pd
import logging 
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error


sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'. .')))

from src.utils.data_loader import DataLoader
from src.features import FeatureEngineer

#Setup Logging 
logging.basicConfig(level=logging.INFO)
logger=logging.getLogger(__name__)

MODELS_DIR ="models"
os.makedirs(MODELS_DIR,exist_ok=True)

def ingest_data():
    """ Task :1 Load Data
    """
    logger.info("Starting Data Ingestion ....")
    loader = DataLoader()
    flights,_,_=loader.load_all_data()
    #In a real scenario , you might validate data schema here
    logger.info(F"Data Ingested . Flights Shape :{flights.shape}")
    return "Data Ingested"
def preprocess_data():
    """ Task 2: Feature Engineering
    """
    logger.info("Starting Preprocessing.......")
    loader = DataLoader()
    flights=loader.preprocess_flights(flights)

    engineer= FeatureEngineer(artifacts_dir=MODELS_DIR)

    X =flights.drop(column=['price'],errors='ignore')
    y=flights['price']

    #Fit and Transform 
    X_processed=engineer.fit_transform(X)

    # Save Processed data for training step 
    # We save to csv to pass data between Airflow tasks 
    X_processed['target price'] =y
    X_processed.to_csv(os.path.join(MODELS_DIR,"processed_train_data.csv"),index=False)
    logger.info ("Preprocessing Complete .Artifacts saved .")

def train_model():
    """ Task 3. MODEL TRAINING
    """    
    logger.info("Starting Model Training ....")
    data_path =os.path.join(MODELS_DIR,"processed_train_data.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError("Processed data not found. run preprocessing  first.")
    
    df =pd.read_csv(data_path)

    X=df.drop(columns=['target_price'])
    y=df['target_price']

    X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2,random_state=42)
    
    rf=RandomForestRegressor(n_estimators=100,max_depth=10,random_state=42)
    rf.fit(X_train,y_train)


    #Evaluate 
    preds=rf.predict(X_test)
    rmse=mean_squared_error(y_test,preds,squared=False)
    logger.info(f"Model Trained .RMSE :{rmse}")

    #Save Model 
    joblib.dump(rf,os.path.join(MODELS_DIR,"flight_price_rf.joblib"))
    logger.info("Model saved successfully .")

if __name__=="__main__":
    #Allow manual execution for testing
    ingest_data()
    preprocess_data()
    train_model()
        
    