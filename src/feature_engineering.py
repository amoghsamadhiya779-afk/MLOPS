import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder
import joblib
import os

class FeatureEngineer:
    """
    Handles feature transformation pipelines for the Flight Price Model.
    Saves/Loads encoders to ensure consistency between training and inference.
    """
    
    def __init__(self, artifacts_dir='models/'):
        self.artifacts_dir = artifacts_dir
        os.makedirs(self.artifacts_dir, exist_ok=True)
        self.encoder_agency = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        self.encoder_type = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        self._is_fitted = False

    def process_dates(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extracts temporal features from the date column."""
        df = df.copy()
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
            df['month'] = df['date'].dt.month
            df['day_of_week'] = df['date'].dt.dayofweek
            df['is_weekend'] = df['date'].dt.dayofweek.isin([5, 6]).astype(int)
            df = df.drop(columns=['date'])
        return df

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Fits encoders on training data and transforms it."""
        df = self.process_dates(df)
        
        # 1. Encode Agency
        agency_encoded = self.encoder_agency.fit_transform(df[['agency']])
        agency_cols = [f"agency_{cat}" for cat in self.encoder_agency.categories_[0]]
        df_agency = pd.DataFrame(agency_encoded, columns=agency_cols, index=df.index)
        
        # 2. Encode Flight Type
        type_encoded = self.encoder_type.fit_transform(df[['flightType']])
        type_cols = [f"type_{cat}" for cat in self.encoder_type.categories_[0]]
        df_type = pd.DataFrame(type_encoded, columns=type_cols, index=df.index)

        # Concatenate and drop originals
        df_final = pd.concat([df, df_agency, df_type], axis=1)
        df_final = df_final.drop(columns=['agency', 'flightType', 'userCode', 'from', 'to', 'travelCode'], errors='ignore')
        
        # Save encoders
        joblib.dump(self.encoder_agency, os.path.join(self.artifacts_dir, 'encoder_agency.joblib'))
        joblib.dump(self.encoder_type, os.path.join(self.artifacts_dir, 'encoder_type.joblib'))
        
        self._is_fitted = True
        return df_final

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transforms new data using already fitted encoders (for API/Inference)."""
        if not self._is_fitted:
            self._load_encoders()
            
        df = self.process_dates(df)
        
        # Encode Agency
        agency_encoded = self.encoder_agency.transform(df[['agency']])
        agency_cols = [f"agency_{cat}" for cat in self.encoder_agency.categories_[0]]
        df_agency = pd.DataFrame(agency_encoded, columns=agency_cols, index=df.index)
        
        # Encode Flight Type
        type_encoded = self.encoder_type.transform(df[['flightType']])
        type_cols = [f"type_{cat}" for cat in self.encoder_type.categories_[0]]
        df_type = pd.DataFrame(type_encoded, columns=type_cols, index=df.index)
        
        df_final = pd.concat([df, df_agency, df_type], axis=1)
        df_final = df_final.drop(columns=['agency', 'flightType', 'userCode', 'from', 'to', 'travelCode'], errors='ignore')
        
        return df_final

    def _load_encoders(self):
        """Loads encoders from disk."""
        try:
            self.encoder_agency = joblib.load(os.path.join(self.artifacts_dir, 'encoder_agency.joblib'))
            self.encoder_type = joblib.load(os.path.join(self.artifacts_dir, 'encoder_type.joblib'))
            self._is_fitted = True
        except FileNotFoundError:
            raise Exception("Encoders not found. Please run fit_transform on training data first.")