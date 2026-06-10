import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

# Download necessary NLTK data
def download_nltk_data():
    try:
        nltk.download('punkt', quiet=True)
        nltk.download('stopwords', quiet=True)
        nltk.download('wordnet', quiet=True)
        nltk.download('punkt_tab', quiet=True)
    except Exception as e:
        print(f"Error downloading NLTK data: {e}")

download_nltk_data()

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text: str) -> list:
    """Full NLP preprocessing pipeline: cleaning, tokenization, lemmatization"""
    if not isinstance(text, str):
        return []
    
    # Lowercasing
    text = text.lower()
    
    # Punctuation removal
    text = re.sub(r'[^\w\s]', '', text)
    
    # Tokenization
    tokens = word_tokenize(text)
    
    # Stopword removal and lemmatization
    cleaned_tokens = [
        lemmatizer.lemmatize(w) 
        for w in tokens 
        if w not in stop_words and w.isalpha()
    ]
    
    return cleaned_tokens

def preprocess_query(text: str) -> str:
    """Returns cleaned string for embedding/matching"""
    return ' '.join(preprocess_text(text))

if __name__ == "__main__":
    # Test cases
    test_queries = [
        "How do I improve my squat form?",
        "What's the best way to do bench press?",
        "I want to build muscle in 3 months!!"
    ]
    
    for query in test_queries:
        print(f"Original: {query}")
        print(f"Processed: {preprocess_query(query)}")
        print("-" * 20)
