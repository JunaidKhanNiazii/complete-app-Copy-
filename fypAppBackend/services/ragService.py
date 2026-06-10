import pandas as pd
import numpy as np
import os
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Add the parent directory to sys.path to import nlpPreprocessor
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from nlpPreprocessor import preprocess_query

class ExerciseRAG:
    def __init__(self, dataset_path: str):
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"Dataset not found at {dataset_path}")
        
        self.df = pd.read_csv(dataset_path)
        
        # Combine relevant fields for retrieval
        self.df['combined_text'] = (
            self.df['Title'].fillna('') + ' ' +
            self.df['Desc'].fillna('') + ' ' +
            self.df['BodyPart'].fillna('') + ' ' +
            self.df['Equipment'].fillna('')
        ).apply(preprocess_query)
        
        # Initialize TF-IDF Vectorizer
        self.vectorizer = TfidfVectorizer(max_features=5000)
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined_text'])

    def retrieve(self, query: str, top_k: int = 3) -> list:
        """Retrieve top-k most relevant exercises for a given query"""
        # Preprocess the query
        cleaned_query = preprocess_query(query)
        
        # Transform query to TF-IDF vector
        query_vec = self.vectorizer.transform([cleaned_query])
        
        # Calculate cosine similarity
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.05:  # Relevance threshold
                results.append({
                    'title': self.df.iloc[idx]['Title'],
                    'description': self.df.iloc[idx]['Desc'],
                    'body_part': self.df.iloc[idx]['BodyPart'],
                    'equipment': self.df.iloc[idx]['Equipment'],
                    'level': self.df.iloc[idx]['Level'],
                    'score': float(similarities[idx])
                })
        
        return results

if __name__ == "__main__":
    # Test the RAG service
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    DATA_PATH = os.path.join(BASE_DIR, "data/gym_exercises.csv")
    
    try:
        rag = ExerciseRAG(DATA_PATH)
        
        test_queries = [
            "How do I do a proper bench press?",
            "What exercises are good for quads?",
            "Need a beginner arm workout"
        ]
        
        for q in test_queries:
            print(f"\nQuery: {q}")
            matches = rag.retrieve(q)
            for m in matches:
                print(f" - [{m['score']:.4f}] {m['title']} ({m['body_part']})")
    except Exception as e:
        print(f"Error: {e}")
