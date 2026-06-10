# Personalized AI Assistant — Assignment 3 Implementation Plan

**Project:** FitZone — Context-Aware Personalized Fitness Guidance System  
**Course:** CSC-355 Natural Language Processing  
**Assignment:** Milestone 3  
**Team:** Zaheer Abbas & Junaid Ameer Khan  

---

## What We Are Building

Upgrading the current generic Groq chatbot into a **truly personalized AI assistant** that:

- Knows who the user is (name, level, workout history)
- Uses RAG (Retrieval-Augmented Generation) to answer from a real fitness knowledge base
- Applies NLP preprocessing to clean and understand user queries
- Responds with context pulled from the user's own Firebase data
- Can be evaluated with standard NLP metrics (BLEU, ROUGE, F1)

This directly maps to every task in Assignment 3.

---

## Assignment 3 Task Mapping

| Task | What to Do | Where It Lives |
|------|-----------|----------------|
| Task 1 | Dataset analysis + visualizations | Python notebook / report |
| Task 2 | Architecture + math (TF-IDF, attention, softmax) | Report section |
| Task 3 | Implement the full pipeline | Backend + frontend code |
| Task 4 | Evaluate with BLEU/ROUGE/F1 | Python evaluation script |
| Task 5 | Technical report + similarity + AI declaration | PDF document |

---

## Architecture Overview

```
User Query (React Native)
        ↓
  NLP Preprocessing
  (lowercase, tokenize, stopword removal, lemmatize)
        ↓
  Query Embedding  ←── TF-IDF or sentence-transformers
        ↓
  RAG Retrieval  ←── Kaggle Exercise Dataset (2918 records)
  (cosine similarity against knowledge base chunks)
        ↓
  Context Builder
  (retrieved exercise docs + user's Firebase workout history)
        ↓
  Personalized System Prompt
  (user name, level, recent exercises, goals)
        ↓
  Groq LLaMA 3.1 70B  ←── already integrated
        ↓
  Personalized Response
        ↓
  React Native Chat UI  ←── already built
```

---

## Step-by-Step Implementation Plan

---

### Step 1 — Dataset Analysis (Task 1)

**Goal:** Analyze the two Kaggle datasets and Firebase data. Generate visualizations.

**Datasets:**
1. [Gym Exercise Data](https://www.kaggle.com/datasets/niharika41298/gym-exercise-data) — 2,918 exercises with name, description, muscle group, equipment, difficulty
2. [Gym Members Exercise Dataset](https://www.kaggle.com/datasets/valakhorasani/gym-members-exercise-dataset) — 973 samples with workout duration, calories, BPM, experience level
3. Internal Firebase — user workout logs (exercise name, reps, duration, timestamps)

**What to analyze and visualize:**

```python
# Required visualizations for the report:
# 1. Exercise type distribution (bar chart — muscle groups)
# 2. Token frequency plot (most common words in exercise descriptions)
# 3. Histogram of description lengths (sentence length distribution)
# 4. Experience level distribution (beginner vs intermediate vs expert)
# 5. Workout duration vs calories burned (scatter plot)
# 6. Top 10 most frequent exercises in Firebase data

import pandas as pd
import matplotlib.pyplot as plt
from collections import Counter
import nltk

df = pd.read_csv('gym_exercise_dataset.csv')

# Token frequency
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

all_tokens = []
for desc in df['Description'].dropna():
    tokens = word_tokenize(desc.lower())
    tokens = [t for t in tokens if t.isalpha() and t not in stop_words]
    all_tokens.extend(tokens)

freq = Counter(all_tokens).most_common(20)
# Plot bar chart of top 20 tokens

# Sentence length histogram
df['desc_length'] = df['Description'].apply(lambda x: len(str(x).split()))
df['desc_length'].hist(bins=30)
plt.title('Distribution of Exercise Description Lengths')
plt.xlabel('Word Count')
plt.ylabel('Frequency')
```

**Key discussion points for the report:**
- Why this dataset: rich textual descriptions = ideal for semantic NLP retrieval
- Challenges: inconsistent formatting, missing descriptions, noisy text
- Preprocessing decisions: lemmatization reduces vocabulary size by ~30%
- Limitations: dataset may not cover all exercises, descriptions are English-only

---

### Step 2 — NLP Preprocessing Pipeline (from Assignment 1)

**Already defined in Assignment 1. Reuse and extend it in the backend.**

```python
# backend/services/nlpPreprocessor.py
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt_tab')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text: str) -> list[str]:
    """Full NLP preprocessing pipeline from Assignment 1"""
    text = text.lower()                           # Lowercasing
    text = re.sub(r'[^\w\s]', '', text)           # Punctuation removal
    tokens = word_tokenize(text)                  # Tokenization
    tokens = [w for w in tokens if w not in stop_words]  # Stopword removal
    tokens = [lemmatizer.lemmatize(w) for w in tokens]   # Lemmatization
    return tokens

def preprocess_query(text: str) -> str:
    """Returns cleaned string for embedding"""
    return ' '.join(preprocess_text(text))
```

---

### Step 3 — RAG Knowledge Base (Core of Personalization)

**Goal:** Build a searchable index from the Kaggle exercise dataset so the AI can retrieve relevant exercise info before responding.

#### Option A — TF-IDF (Simpler, good for report math)

```python
# backend/services/ragService.py
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ExerciseRAG:
    def __init__(self, dataset_path: str):
        self.df = pd.read_csv(dataset_path)
        self.df['combined'] = (
            self.df['Title'].fillna('') + ' ' +
            self.df['Desc'].fillna('') + ' ' +
            self.df['BodyPart'].fillna('') + ' ' +
            self.df['Equipment'].fillna('')
        )
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined'])

    def retrieve(self, query: str, top_k: int = 3) -> list[dict]:
        """Retrieve top-k most relevant exercises for a query"""
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = np.argsort(scores)[-top_k:][::-1]
        results = []
        for i in top_indices:
            if scores[i] > 0.05:  # relevance threshold
                results.append({
                    'title': self.df.iloc[i]['Title'],
                    'description': self.df.iloc[i]['Desc'],
                    'body_part': self.df.iloc[i]['BodyPart'],
                    'equipment': self.df.iloc[i]['Equipment'],
                    'level': self.df.iloc[i]['Level'],
                    'score': float(scores[i])
                })
        return results
```

#### Option B — Sentence Transformers (Better quality, bonus marks)

```python
from sentence_transformers import SentenceTransformer
import faiss

model = SentenceTransformer('all-MiniLM-L6-v2')
embeddings = model.encode(corpus_texts)
# Build FAISS index for fast ANN search
index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings)
```

**Recommendation:** Implement TF-IDF for the base submission (easier math to explain), add sentence transformers for bonus marks.

---

### Step 4 — User Personalization Layer

**Goal:** Pull the logged-in user's Firebase workout data and inject it into the prompt.

```javascript
// backend/services/personalizationService.js
const { db } = require('../config/firebase');

async function getUserContext(userId) {
    // Get recent workouts (last 7 days)
    const workoutsSnap = await db.collection('workouts')
        .where('userId', '==', userId)
        .orderBy('recordedAt', 'desc')
        .limit(10)
        .get();

    const workouts = workoutsSnap.docs.map(d => d.data());

    // Calculate stats
    const exerciseFreq = {};
    workouts.forEach(w => {
        w.exercises?.forEach(e => {
            exerciseFreq[e.name] = (exerciseFreq[e.name] || 0) + 1;
        });
    });

    const topExercises = Object.entries(exerciseFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => `${name} (${count}x)`);

    // Get user profile
    const userDoc = await db.collection('users').doc(userId).get();
    const user = userDoc.data();

    return {
        userName: user?.name || 'Member',
        totalWorkouts: workouts.length,
        topExercises,
        lastWorkoutDate: workouts[0]?.date || 'No recent workouts',
        experienceLevel: workouts.length > 30 ? 'Advanced' : 
                         workouts.length > 10 ? 'Intermediate' : 'Beginner'
    };
}
```

---

### Step 5 — Personalized System Prompt Builder

This is where personalization actually happens. The AI is given the user's context before every conversation.

```javascript
// backend/services/promptBuilder.js
function buildPersonalizedSystemPrompt(userContext, retrievedExercises) {
    const exerciseContext = retrievedExercises.length > 0
        ? `\n\nRelevant exercise knowledge:\n${retrievedExercises.map(e =>
            `- ${e.title} (${e.body_part}): ${e.description?.slice(0, 200)}`
          ).join('\n')}`
        : '';

    return `You are FitZone AI, a personalized fitness coach for ${userContext.userName}.

USER PROFILE:
- Experience Level: ${userContext.experienceLevel}
- Total Workouts Logged: ${userContext.totalWorkouts}
- Most Practiced Exercises: ${userContext.topExercises.join(', ') || 'None yet'}
- Last Workout: ${userContext.lastWorkoutDate}

INSTRUCTIONS:
- Address the user by name when natural
- Tailor advice to their experience level (${userContext.experienceLevel})
- Reference their workout history when relevant
- Prioritize safety and proper form
- Keep responses concise (3-5 sentences)
- If asked about medical issues, recommend a professional
${exerciseContext}`;
}
```

---

### Step 6 — Updated Backend Endpoint

```javascript
// backend/routes/aiRoutes.js  (updated)
const { ExerciseRAG } = require('../services/ragService');
const { getUserContext } = require('../services/personalizationService');
const { buildPersonalizedSystemPrompt } = require('../services/promptBuilder');
const { preprocessQuery } = require('../services/nlpPreprocessor');

const rag = new ExerciseRAG('./data/gym_exercises.csv');

router.post('/chat', async (req, res) => {
    const { message, conversationHistory, userId } = req.body;

    // Step 1: NLP Preprocessing
    const cleanedQuery = preprocessQuery(message);

    // Step 2: RAG Retrieval
    const retrievedExercises = rag.retrieve(cleanedQuery, 3);

    // Step 3: User Personalization
    const userContext = userId 
        ? await getUserContext(userId)
        : { userName: 'Member', experienceLevel: 'Beginner', topExercises: [], totalWorkouts: 0 };

    // Step 4: Build personalized prompt
    const systemPrompt = buildPersonalizedSystemPrompt(userContext, retrievedExercises);

    // Step 5: Call Groq with personalized context
    const response = await groq.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            })),
            { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
    });

    res.json({
        success: true,
        response: response.choices[0].message.content,
        retrievedContext: retrievedExercises,  // useful for evaluation
        userContext
    });
});
```

---

### Step 7 — Frontend Update (Pass userId)

Only one small change to `ai-assistant.tsx` — pass the logged-in user's ID:

```typescript
// In ai-assistant.tsx sendMessage()
// Add userId from auth context or AsyncStorage

const response = await axios.post(`${BACKEND_URL}/ai/chat`, {
    message: userMessage.text,
    conversationHistory,
    userId: currentUser?.id  // add this
});
```

---

### Step 8 — Evaluation (Task 4)

**Build an evaluation script to measure quality.**

```python
# tests/evaluate_rag.py
from rouge_score import rouge_scorer
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

# Test pairs: (user_query, expected_response)
test_cases = [
    {
        "query": "How do I do a proper squat?",
        "reference": "Keep your chest up, push knees out, sit back into hips, maintain neutral spine.",
        "generated": ""  # fill from actual model output
    },
    # ... add 10-20 test cases
]

scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
smoothing = SmoothingFunction().method1

results = []
for case in test_cases:
    # ROUGE
    rouge = scorer.score(case['reference'], case['generated'])
    # BLEU
    bleu = sentence_bleu(
        [case['reference'].split()],
        case['generated'].split(),
        smoothing_function=smoothing
    )
    results.append({
        'rouge1': rouge['rouge1'].fmeasure,
        'rouge2': rouge['rouge2'].fmeasure,
        'rougeL': rouge['rougeL'].fmeasure,
        'bleu': bleu
    })

# Print average scores
import pandas as pd
df = pd.DataFrame(results)
print(df.mean())
```

---

## Mathematical Foundations (Task 2 — for the Report)

### TF-IDF

$$\text{TF}(t, d) = \frac{\text{count of } t \text{ in } d}{\text{total terms in } d}$$

$$\text{IDF}(t) = \log\frac{N}{|\{d : t \in d\}|}$$

$$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t)$$

### Cosine Similarity (for retrieval)

$$\text{sim}(q, d) = \frac{q \cdot d}{||q|| \cdot ||d||}$$

### Attention Mechanism (Transformer)

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

### Softmax

$$\text{softmax}(z_i) = \frac{e^{z_i}}{\sum_{j} e^{z_j}}$$

### Loss Function (Cross-Entropy for language model)

$$\mathcal{L} = -\sum_{t} \log P(w_t | w_{<t})$$

---

## Report Structure (Task 5)

```
1. Abstract
2. Introduction
   - Problem statement
   - Motivation
   - Objectives
3. Dataset Analysis (Task 1)
   - Dataset descriptions
   - Statistical analysis
   - Visualizations
   - Discussion
4. Proposed Architecture (Task 2)
   - System pipeline diagram
   - Component descriptions
   - Mathematical modelling
5. Implementation (Task 3)
   - NLP preprocessing
   - TF-IDF RAG
   - Personalization layer
   - Backend integration
   - Frontend changes
6. Experimental Results (Task 4)
   - BLEU scores
   - ROUGE scores
   - Qualitative examples
   - Discussion
7. Conclusion
8. References
```

---

## What Makes This Personalized (Summary)

The current chatbot is generic. After this implementation:

| Feature | Before | After |
|---------|--------|-------|
| Knows user name | No | Yes (from Firebase) |
| Knows user level | No | Yes (derived from workout count) |
| References user history | No | Yes (top exercises, last workout) |
| Uses exercise knowledge base | No | Yes (RAG from Kaggle dataset) |
| NLP preprocessing | No | Yes (tokenize, lemmatize, etc.) |
| Evaluatable | No | Yes (BLEU/ROUGE metrics) |

---

## Implementation Order (Recommended)

1. Download Kaggle datasets, do EDA in Jupyter → generates Task 1 visuals
2. Implement `nlpPreprocessor.py` (already written in Assignment 1, just port it)
3. Build `ragService.py` with TF-IDF
4. Build `personalizationService.js` to pull Firebase user context
5. Update `/ai/chat` endpoint to wire everything together
6. Update frontend to pass `userId`
7. Run evaluation script, record BLEU/ROUGE numbers
8. Write the technical report

**Estimated time:** 3-4 days of focused work

---

## Bonus Marks Strategy

- Replace TF-IDF with `sentence-transformers` + FAISS for better retrieval quality
- Add comparative experiment: TF-IDF vs sentence-transformers (different ROUGE scores)
- Add a second dataset comparison (Exercise dataset vs Member behavior dataset)
- Include error analysis: cases where the model failed and why

---

## File Structure After Implementation

```
firebaseApp/
├── backend/
│   ├── data/
│   │   ├── gym_exercises.csv          ← Kaggle dataset 1
│   │   └── gym_members.csv            ← Kaggle dataset 2
│   ├── services/
│   │   ├── nlpPreprocessor.py         ← Assignment 1 pipeline
│   │   ├── ragService.py              ← TF-IDF retrieval
│   │   ├── personalizationService.js  ← Firebase user context
│   │   └── promptBuilder.js           ← System prompt builder
│   └── routes/
│       └── aiRoutes.js                ← Updated endpoint
├── app/(member)/
│   └── ai-assistant.tsx               ← Pass userId
└── tests/
    └── evaluate_rag.py                ← BLEU/ROUGE evaluation
```
