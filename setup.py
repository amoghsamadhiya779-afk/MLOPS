import os
import shutil
import sys
import venv

def setup_project():
    print("🚀 Initializing Voyage Analytics Project Structure...")

    # 1. Create Directory Hierarchy
    directories = [
        "data/raw", "data/processed", "data/external",
        "notebooks",
        "src/api", "src/ui", "src/training", "src/utils",
        "deployment/docker", "deployment/k8s",
        "config", "tests", "logs", "reports/figures"
    ]

    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        # print(f"Created directory: {directory}")

    # 2. Create Placeholder Files
    files = [
        "config/config.yaml",
        "config/logging.yaml",
        "README.md",
        ".gitignore"
    ]
    
    for file in files:
        if not os.path.exists(file):
            with open(file, 'w') as f:
                pass # Create empty file
            # print(f"Created file: {file}")

    # 3. Create .gitignore Content
    gitignore_content = """# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.env

# Jupyter
.ipynb_checkpoints

# Data
data/raw/*
data/processed/*
!data/raw/.gitkeep
!data/processed/.gitkeep

# Logs and Reports
logs/*
reports/*

# OS
.DS_Store
Thumbs.db
"""
    with open(".gitignore", "w") as f:
        f.write(gitignore_content)
    print("✅ .gitignore configured")

    # 4. Move uploaded files (Assuming they are in the current directory)
    files_to_move = ["flights.csv", "hotels.csv", "users.csv"]
    moved_count = 0
    
    for filename in files_to_move:
        if os.path.exists(filename):
            destination = os.path.join("data", "raw", filename)
            # Handle case where file already exists in destination
            if os.path.exists(destination):
                os.remove(destination)
            shutil.move(filename, destination)
            print(f"✅ Moved {filename} to data/raw/")
            moved_count += 1
        else:
            # Check if it's already in the destination (idempotency)
            if os.path.exists(os.path.join("data", "raw", filename)):
                 print(f"ℹ️  {filename} is already in data/raw/")
            else:
                 print(f"⚠️  {filename} not found in root directory.")

    print(f"📂 Directory structure created successfully.")

    # 5. Virtual Environment Setup
    print("🐍 Setting up Python Virtual Environment (this may take a moment)...")
    try:
        venv.create("venv", with_pip=True)
        print("✅ Virtual environment 'venv' created.")
        
        # Determine activation command based on OS
        if sys.platform == "win32":
            activate_cmd = ".\\venv\\Scripts\\activate"
        else:
            activate_cmd = "source venv/bin/activate"
            
        print("\n" + "="*50)
        print(f"🎉 SETUP COMPLETE!")
        print(f"To start working, run: {activate_cmd}")
        print("Then install dependencies: pip install -r requirements.txt")
        print("="*50)
        
    except Exception as e:
        print(f"❌ Failed to create virtual environment: {e}")

if __name__ == "__main__":
    setup_project()