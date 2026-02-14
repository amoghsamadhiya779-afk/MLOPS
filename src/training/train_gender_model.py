import os
import pandas as pd
import mlflow
import mlflow.sklearn
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, classification_report

# CLEAN IMPORT (Works because manage.py sets the path)
from src.utils.data_loader import DataLoader

# Configuration
EXPERIMENT_NAME = "Gender_Classification"
# Paths are now relative to the project root
MODEL_OUTPUT_PATH = os.path.join("models", "gender_model_artifacts")
RANDOM_STATE = 42

def main():
    print("Starting Gender Model Training Pipeline...")
    os.makedirs(MODEL_OUTPUT_PATH, exist_ok=True)

    # 1. Initialize MLflow
    mlflow.set_experiment(EXPERIMENT_NAME)

    with mlflow.start_run():
        # 2. Load Data
        loader = DataLoader()
        _, _, users = loader.load_all_data()
        
        # Preprocessing: target label encoding
        # Filter 'none' genders if you want strictly male/female, 
        # but for this dataset we will keep them or filter them out.
        # users = users[users['gender'].isin(['male', 'female'])]
        
        X = users.drop(columns=['gender'])
        y = users['gender']

        # 3. Define Feature Engineering Pipeline
        name_transformer = CountVectorizer(analyzer='char', ngram_range=(2, 3))
        categorical_transformer = OneHotEncoder(handle_unknown='ignore')
        numeric_transformer = StandardScaler()

        preprocessor = ColumnTransformer(
            transformers=[
                ('name', name_transformer, 'name'),
                ('company', categorical_transformer, ['company']),
                ('age', numeric_transformer, ['age'])
            ]
        )

        # 4. Define Model Pipeline
        clf = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('classifier', GradientBoostingClassifier(random_state=RANDOM_STATE))
        ])

        # 5. Split Data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=RANDOM_STATE, stratify=y
        )

        # 6. Train
        print("Training Gradient Boosting Classifier...")
        clf.fit(X_train, y_train)

        # 7. Evaluate
        print("Evaluating model...")
        y_pred = clf.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        
        print(f"Accuracy: {acc}")
        print("Classification Report:\n")
        print(classification_report(y_test, y_pred))

        # 8. Log to MLflow and Save
        mlflow.log_metric("accuracy", acc)
        mlflow.sklearn.log_model(clf, "model")
        
        joblib.dump(clf, os.path.join(MODEL_OUTPUT_PATH, "gender_pipeline.joblib"))
        print(f"✅ Pipeline saved to {MODEL_OUTPUT_PATH}/gender_pipeline.joblib")

if __name__ == "__main__":
    main()