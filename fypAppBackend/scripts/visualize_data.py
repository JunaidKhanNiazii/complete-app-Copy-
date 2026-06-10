import pandas as pd
import matplotlib.pyplot as plt
import os

def generate_visualizations(data_path, output_dir):
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return

    # Load dataset
    df = pd.read_csv(data_path)
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # 1. Exercise distribution by Muscle Group (BodyPart)
    plt.figure(figsize=(10, 6))
    df['BodyPart'].value_counts().plot(kind='bar', color='skyblue')
    plt.title('Distribution of Exercises by Muscle Group')
    plt.xlabel('Muscle Group')
    plt.ylabel('Count')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'muscle_group_dist.png'))
    plt.close()

    # 2. Exercise distribution by Equipment
    plt.figure(figsize=(10, 6))
    df['Equipment'].value_counts().plot(kind='pie', autopct='%1.1f%%')
    plt.title('Exercises by Equipment Type')
    plt.ylabel('')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'equipment_dist.png'))
    plt.close()

    # 3. Description Length Distribution
    df['desc_length'] = df['Desc'].apply(lambda x: len(str(x).split()))
    plt.figure(figsize=(10, 6))
    df['desc_length'].hist(bins=20, color='salmon', edgecolor='black')
    plt.title('Distribution of Description Lengths')
    plt.xlabel('Word Count')
    plt.ylabel('Frequency')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'desc_length_hist.png'))
    plt.close()

    print(f"Visualizations saved to {output_dir}")

if __name__ == "__main__":
    BASE_DIR = "/media/junaid-ameer-khan/University Data/semester 8/fyp/complete app  (Copy)/fypAppBackend"
    DATA_PATH = os.path.join(BASE_DIR, "data/gym_exercises.csv")
    OUTPUT_DIR = os.path.join(BASE_DIR, "visuals")
    
    generate_visualizations(DATA_PATH, OUTPUT_DIR)
