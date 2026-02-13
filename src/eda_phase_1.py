import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import os
import sys

# Add parent directory to path to import utils
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.data_loader import DataLoader

# Configuration for Plotting
sns.set_theme(style="whitegrid")
FIGURES_DIR = 'reports/figures'
os.makedirs(FIGURES_DIR, exist_ok=True)

def generate_profile_report(df: pd.DataFrame, name: str):
    """Generates a text summary of the dataframe."""
    print(f"\n{'='*40}")
    print(f"DATASET REPORT: {name.upper()}")
    print(f"{'='*40}")
    
    print(f"Shape: {df.shape}")
    print(f"\nMissing Values:\n{df.isnull().sum()[df.isnull().sum() > 0]}")
    print(f"\nDuplicates: {df.duplicated().sum()}")
    print(f"\nData Types:\n{df.dtypes}")
    print(f"\nSample Data:\n{df.head(3)}")
    
    if 'price' in df.columns:
        print(f"\nPrice Statistics:\n{df['price'].describe()}")

def plot_flight_prices_distribution(df: pd.DataFrame):
    """Visualizes the distribution of flight prices."""
    plt.figure(figsize=(10, 6))
    sns.histplot(df['price'], bins=50, kde=True, color='skyblue')
    plt.title('Distribution of Flight Prices')
    plt.xlabel('Price')
    plt.ylabel('Frequency')
    plt.savefig(f"{FIGURES_DIR}/flight_price_dist.png")
    print(f"Generated plot: {FIGURES_DIR}/flight_price_dist.png")
    plt.close()

def plot_price_by_agency(df: pd.DataFrame):
    """Compares prices across different agencies."""
    plt.figure(figsize=(12, 6))
    sns.boxplot(x='agency', y='price', data=df)
    plt.title('Flight Prices by Agency')
    plt.xticks(rotation=45)
    plt.savefig(f"{FIGURES_DIR}/price_by_agency.png")
    print(f"Generated plot: {FIGURES_DIR}/price_by_agency.png")
    plt.close()

def plot_correlation_matrix(df: pd.DataFrame):
    """Plots correlation heatmap for numerical features."""
    # Select only numeric columns
    numeric_df = df.select_dtypes(include=['float64', 'int64'])
    
    if numeric_df.empty:
        print("No numeric columns for correlation matrix.")
        return

    plt.figure(figsize=(10, 8))
    corr = numeric_df.corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Correlation Matrix (Numerical Features)')
    plt.savefig(f"{FIGURES_DIR}/correlation_matrix.png")
    print(f"Generated plot: {FIGURES_DIR}/correlation_matrix.png")
    plt.close()

def analyze_flight_trends(df: pd.DataFrame):
    """Analyzes trends over time."""
    # Group by date and get mean price
    daily_avg = df.groupby('date')['price'].mean().reset_index()
    
    plt.figure(figsize=(14, 7))
    sns.lineplot(x='date', y='price', data=daily_avg)
    plt.title('Average Flight Price Over Time')
    plt.xlabel('Date')
    plt.ylabel('Average Price')
    plt.savefig(f"{FIGURES_DIR}/price_over_time.png")
    print(f"Generated plot: {FIGURES_DIR}/price_over_time.png")
    plt.close()

def main():
    print("🚀 Starting Phase 1: Exploratory Data Analysis (EDA)\n")
    
    # 1. Load Data
    loader = DataLoader()
    try:
        flights, hotels, users = loader.load_all_data()
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        return

    # 2. Preprocess
    flights = loader.preprocess_flights(flights)
    hotels = loader.preprocess_hotels(hotels)
    users = loader.preprocess_users(users)

    # 3. Profile Data
    generate_profile_report(flights, "Flights")
    generate_profile_report(hotels, "Hotels")
    generate_profile_report(users, "Users")

    # 4. Visualizations & Deep Dive
    print("\n📊 Generating Visualizations...")
    
    # Flight Price Analysis
    plot_flight_prices_distribution(flights)
    plot_price_by_agency(flights)
    plot_correlation_matrix(flights)
    analyze_flight_trends(flights)

    # 5. Feature Selection Insights for Regression Model
    print("\n💡 PHASE 1 INSIGHTS & FEATURE SELECTION:")
    print("-" * 50)
    print("Based on the preliminary analysis, here are the recommendations for the Flight Price Model:")
    print("1. Target Variable: 'price'")
    print("2. High Potential Features:")
    print("   - 'distance': Likely strong positive correlation with price.")
    print("   - 'agency': Prices seem to vary significantly by agency (needs One-Hot Encoding).")
    print("   - 'flightType': Premium/First Class will have higher baseline prices.")
    print("   - 'time': Duration of flight usually correlates with distance/price.")
    print("3. Data Quality Notes:")
    print("   - Ensure 'date' is handled (extract Month/Day/DayOfWeek).")
    print("   - 'userCode' should likely be dropped for price prediction (unless personalizing).")
    print("-" * 50)
    print("✅ Phase 1 Complete. Ready for Model Development.")

if __name__ == "__main__":
    main()