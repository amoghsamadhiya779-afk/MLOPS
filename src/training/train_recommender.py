import sys
import os
import pandas as pd
import numpy as np
import joblib 
from sklearn.neighbors import NearestNeighbors

# Add parent directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'. .')))
from src.utils.data_loader  import DataLoader

#Configuration
MODEL_OUTPUT_PATH="models/recommender_artifacts"

def main():
    print("Starting Recommendation System TRAINING ......")
    os.makedirs(MODEL_OUTPUT_PATH,exist_ok=True)


    #1. Load Data
    loader = DataLoader()
    _,hotels,_=loader.load_all_data()

    # 2. Create User-Item Matrix
    # We want to recommend hotels based on user booking history.
    # Rows: User ,Columns:Hotels(Place +Name serves as unique ID, Values: Days booked)
    

    print("Building Interaction matrix......")
    hotels['hotel_id'] = hotels['place'] + " - " + hotels["name"]

    #Pivot table :Sum of days booked by user for each hotel 
    user_hotel_matrix = hotels.pivot_table(
        index='userCode',
        columns='hotel_id',
        values='days',
        aggfunc='sum'
    ).fillna(0)

    #Convert sparse matrix format (good for scale but optional)
    # For this sclae,dense dataframe is fine.

    print(f"Matrix Shape :{user_hotel_matrix.shape}")
    # 3. Train NearestNeighbors Model (Collaborativ Filtering)
    # We use cosine similarity to find users with similar booking patterns 
    model_knn=NearestNeighbors(metric='cosine',algorithm='brute')
    model_knn.fit(user_hotel_matrix)
   

    # 4. Save Artifacts
    # We need both the model and the matrix (to map indices back to hotel names)
    print ("Saving artifacts......")


    artifacts={
        'model':model_knn,
        'matrix':user_hotel_matrix,
        'hotel_names':user_hotel_matrix.columns.tolist()
    }

    joblib.dump(artifacts,os.path.join(MODEL_OUTPUT_PATH,"recommender.joblib"))
    print(f"Recommender system saved to {MODEL_OUTPUT_PATH} / recommender.joblib")

if __name__== "__main__":
    main()
