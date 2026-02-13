import sys
import os 
import pandas as pd
import mlflow
import mlflow.sklearn
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from  sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder , StandardScaler  
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score,classification_report

# Add parent directory to path 
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__),'. .')))
from utils.data_loader import DataLoader

#Configuration
EXPERIMENT_NAME = "Gender_Classification"
MODEL_OUTPUT_PATH = "models/gender_model_artifacts"
RANDOM_STATE =42

def main():
    print (" Starting the gender model training pipeline......")
    os.makedirs(MODEL_OUTPUT_PATH,exist_ok=True)

    # 1. Initialize MLflow
    mlflow.set_experiment(EXPERIMENT_NAME)

    with mlflow.start_run():
        # 2. Load Data
        loader = DataLoader()
        _,_, users =loader.load_all_data()

        # Preprocessing : target label encoding
        # Filter valid gender if necessary or keep 'none' as a class

        print(f"Original  class distibution :\n{users['gender'].value_counts()}")

        x=  users.drop(columns=['gender'])
        y= users['gender']
        
        name_transformer =CountVectorizer(analyser='char',ngram_range=(2,3))
        categorical_transformer = OneHotEncoder(handle_unknown='ignore')
        numeric_transformer = StandardScaler()


        preprocessor = ColumnTransformer(
            transformers=[
                ('name',name_transformer, 'name'),
                ('company',categorical_transformer,['company']),
                ('age',numeric_transformer,['age'])
            ]
        )

        # 4.  Define Model Pipeline
        clf= Pipeline(steps=[
            ('preprocessor',preprocessor),
            ('classifier',GradientBoostingClassifier(RANDOM_STATE))
         ])     
        
        # 5. Split Data

        x_train, x_test, y_train, y_test = train_test_split(
            x,y,test_size=0.2,random_state=RANDOM_STATE,stratify =y

        )

        # 6. Train
        print ("Training Gradient Boosting Classifier....")
        clf.fit(x_train, y_train)

        # 7. Evaluate 
        print ("Evaluating Model .....")
        y_pred=clf.predict(x_test)
        acc =accuracy_score(y_test,y_pred)
        report =classification_report(y_test,y_pred)

        print (f"Accuracy :{acc}")
        print("Classification Report:\n")
        print(report)
        # 8. Log to MLflow and Save Artifacts
        mlflow.log_metric("accuracy",acc)
        mlflow.sklearn.log_model(clf,"model")

        # Save pipeline locally for API usage
        joblib.dump(clf,os.path.join(MODEL_OUTPUT_PATH,'gender_pipeline.joblib'))
        print(f"Pipeline saved to {MODEL_OUTPUT_PATH} / gender_pipeline.joblib")

if __name__ == "__main__":
    main()