import os
import shutil

def check_figures():
    """
    Checks if required figures for Assignment 4 exist and are in the correct place.
    """
    required_figures = {
        "system_architecture.png": "System Architecture Diagram"
    }
    
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename, description in required_figures.items():
        filepath = os.path.join(current_dir, filename)
        if os.path.exists(filepath):
            print(f"[OK] Found {description} ({filename})")
        else:
            print(f"[MISSING] {description} ({filename}) is not in the directory.")
            print(f"Please ensure {filename} is placed in: {current_dir}")

if __name__ == "__main__":
    check_figures()
