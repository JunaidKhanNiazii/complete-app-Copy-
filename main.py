import os
from generate_figures import check_figures

def main():
    print("=== Assignment 4: IEEE Report Workflow ===")
    
    # 1. Check if assets are ready
    print("\n[Step 1] Checking Assets...")
    check_figures()
    
    # 2. Instructions for compilation
    print("\n[Step 2] Compilation Instructions:")
    print("To compile the LaTeX report, run:")
    print("  pdflatex Assignment_4_IEEE_Report.tex")
    print("\nThe code is already configured to automatically load 'system_architecture.png'")
    print("if it exists in the same directory as this script.")

if __name__ == "__main__":
    main()
