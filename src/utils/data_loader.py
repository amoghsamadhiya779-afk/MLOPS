import pandas as pd
import os
import logging
from typing import Dict, Tuple

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class DataLoader:
    """
    Handles loading and basic preprocessing of Voyage Analytics datasets.
    """
    
    def __init__(self, raw_data_path: str = 'data/raw'):
        self.raw_path = raw_data_path

    def load_dataset(self, filename: str) -> pd.DataFrame:
        """Loads a CSV file from the raw data directory."""
        file_path = os.path.join(self.raw_path, filename)
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            raise FileNotFoundError(f"{file_path} not found.")
        
        logger.info(f"Loading {filename}...")
        return pd.read_csv(file_path)

    def load_all_data(self) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """Loads flights, hotels, and users datasets."""
        flights = self.load_dataset('flights.csv')
        hotels = self.load_dataset('hotels.csv')
        users = self.load_dataset('users.csv')
        return flights, hotels, users

    def preprocess_flights(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean flights data: Date parsing and numeric conversion."""
        df = df.copy()
        # Convert date column
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        
        # Ensure numerical columns are correct types
        numeric_cols = ['price', 'time', 'distance']
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        return df

    def preprocess_users(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean users data."""
        df = df.copy()
        # Handle 'none' in gender if necessary, or map to category
        df['gender'] = df['gender'].astype('category')
        return df

    def preprocess_hotels(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean hotels data."""
        df = df.copy()
        if 'date' in df.columns:
            df['date'] = pd.to_datetime(df['date'])
        return df

if __name__ == "__main__":
    loader = DataLoader()
    try:
        f, h, u = loader.load_all_data()
        logger.info(f"Data Loaded Successfully. Flights: {f.shape}, Hotels: {h.shape}, Users: {u.shape}")
    except Exception as e:
        logger.error(f"Data load failed: {e}")