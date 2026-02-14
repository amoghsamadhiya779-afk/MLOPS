import sys
import os
import argparse

def main():
    project_root = os.path.dirname(os.path.abspath(__file__))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

    parser = argparse.ArgumentParser(description="Voyage Analytics Project Manager")
    parser.add_argument('task', type=str, help="Task: train-gender, train-price, train-recommender, eda, run-api, run-ui")
    args = parser.parse_args()

    print(f"🚀 Running task: {args.task}")

    try:
        if args.task == 'train-gender':
            from src.training.train_gender_model import main as train_gender
            train_gender()
            
        elif args.task == 'train-price':
            from src.training.train_price_model import main as train_price
            train_price()

        elif args.task == 'train-recommender':
            from src.training.train_recommender import main as train_rec
            train_rec()
            
        elif args.task == 'eda':
            from src.eda_phase_1 import main as run_eda
            run_eda()

        elif args.task == 'run-api':
            # Run Flask App
            print("Starting API Server...")
            from src.api.app import main as run_api
            run_api()
            
        elif args.task == 'run-ui':
            # Run Streamlit (Needs shell command)
            print("Starting Dashboard...")
            os.system("streamlit run src/ui/dashboard.py")
            
        else:
            print(f"❌ Unknown task: {args.task}")
            
    except ImportError as e:
        print(f"❌ Import Error: {e}")
    except Exception as e:
        print(f"❌ Execution Error: {e}")

if __name__ == "__main__":
    main()