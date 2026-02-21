import sys
import os
import joblib
import pandas as pd
from flask import Flask,request,jsonify

# Fix path to import modules

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'. .')))
from src.features import FeatureEngineer

app = Flask(__name__)

#----LOAD MODELS AT STARTUP---

print (" Loading Models . . . . ")
MODELS_DIR ="models"

# 1. Load Price Model & Engineer

try:
    price_model=joblib.load(os.path.join(MODELS_DIR,"flight_price_rf.joblib"))
    price_engineer = FeatureEngineer(artifacts_dir=MODELS_DIR)
    print("Price Model Loaded")
except Exception as e:
    print (f"Could not load Price Model :{e}")
    price_model=None

    # 2. Load Gender Model
try:
    gender_pipeline=joblib.load(os.path.join(MODELS_DIR,"gender_model_artifacts","gender_pipeline.joblib"))
    print("Gender Model Loaded")
except Exception as e:
    print(f"Could not Load Gender Model {e}")
    gender_pipeline=None

# 3. Load Recommender Model
try:
    rec_artifacts=joblib.load(os.path.join(MODELS_DIR,"recommender_artifacts","recommender.joblib"))
    rec_model=rec_artifacts['model']
    rec_matrix=rec_artifacts['matrix']
    rec_hotel_names=rec_artifacts['hotel_names']
    print("Recommender Model Loaded")  
except Exception as e:
    print(f"Could not Load Recommender :{e}") 
    rec_model=None

# ---Routes---

@app.route('/health',methods=['GET'])
def health():
    return jsonify({"status":"ok","message":"Voyage Analytics API is running "})
@app.route('/predict_price',methods=['POST'])
def predict_price():
    if not price_model:
        return jsonify({"error": "MOdel not found..."}),500
    
    data =request.get_json()
    #Expecting {"name":"Maria","company":"4You",age":30}

    try:
        df=pd.DataFrame([data])

        #Preprocessing using our FeatureEngineering 
        #Note :We use .transform(),not .fit_transform() because we are in inference mode
        X_trans=price_engineer.tranform(df)

        #Predict
        prediction=gender_pipeline.predict(df)


        return jsonify({
            "predict_gender":prediction[0]

        })
    except Exception as e:
        return jsonify({"error":str(e)}),400
    
@app.route('/predict/gender',methods=['POST'])
def predict_gender():
    if not gender_pipeline():
        return jsonify({"error":"Model not loaded..."}),500
     
    data =request.get_json()
    # Expecting {"name":"Maria","company":"4You","age":30}

    try:
        df=pd.DataFrame([data])
        prediction =gender_pipeline.predict(df)

        return jsonify({
            "predict_gender":prediction[0]

        })
    except Exception as e:
      return jsonify({"error":str(e)}) ,400
    
@app.route('/recommend',methods=['POST'])
def recommend():
    if not rec_model:
        return jsonify({"error":"Model not loaded..."}),500
    data=request.get_json()
    user_code=data.get('userCode')
   # 1. Check if user exists in our matrix
    if user_code not in rec_matrix.index:
        return jsonify({"message": "User not found. Showing popular items.", "recommendations": []})
    
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
    
    return jsonify({
        "user_code": user_code,
        "recommendations": unique_recs
    })

def main():
    app.run(host='0.0.0.0', port=5000, debug=True)

if __name__ == '__main__':
    main()
    