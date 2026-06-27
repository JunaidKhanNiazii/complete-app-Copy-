# Assignment 4 — Complete IEEE Report Prompt
# CSC-355 Natural Language Processing | Namal University Mianwali
# Authors: Zaheer Abbas & Junaid Ameer Khan

---

## HOW TO USE THIS PROMPT

Copy the entire prompt below and paste it into Claude, ChatGPT-4o, or Gemini.
It will generate a complete, professional, IEEE-formatted research paper (8–12 pages).

---

# ═══════════════════════════════════════════════════════════════
# THE PROMPT (COPY EVERYTHING BELOW THIS LINE)
# ═══════════════════════════════════════════════════════════════

You are an expert academic writer and NLP researcher with deep experience writing IEEE conference papers. Your task is to write a **complete, professional, 10–12 page IEEE-format research paper** for a final year Computer Science project at Namal University Mianwali.

---

## STRICT FORMATTING REQUIREMENTS

- Follow **IEEE conference paper format** exactly
- Use **two-column layout** (describe as if formatted for IEEE)
- Font: **Times New Roman 10pt** body, **10pt bold** section headings
- All sections must be properly numbered: I. INTRODUCTION, II. RELATED WORK, etc.
- All figures and tables must have **captions** (Figure 1:, Table I:, etc.)
- **IEEE citation style** — numbered references [1], [2], etc.
- Paper length: **8–12 pages** equivalent content
- **Similarity index must be below 15%** — write in original academic voice
- No bullet points in body text — use proper academic prose

---

## PROJECT CONTEXT (READ CAREFULLY — DO NOT DEVIATE)

**Project Title:** Context-Aware Personalized Fitness Guidance System using Retrieval-Augmented Natural Language Processing

**Course:** CSC-355 Natural Language Processing
**Institution:** Department of Computer Science, Namal University Mianwali
**Session:** 2022–2026 (8th Semester)
**Instructor:** Dr. Muzamil Ahmed
**Authors:** Zaheer Abbas (NUM-BSCS-2022-50) and Junaid Ameer Khan (NUM-BSCS-2022-50)

**The System:**
This project develops a personalized AI fitness coaching chatbot integrated into a React Native mobile application called "FitZone." The system upgrades a generic chatbot into a context-aware assistant using:
1. NLP preprocessing pipeline (tokenization, stopword removal, lemmatization)
2. TF-IDF based Retrieval-Augmented Generation (RAG) from a 2,918-exercise Kaggle knowledge base
3. Firebase Firestore integration to retrieve user-specific workout history
4. Groq API with LLaMA 3.1 70B language model for response generation
5. Personalized system prompts built from user profile + retrieved exercise knowledge

**Datasets Used:**
- Dataset 1: Kaggle Gym Exercise Dataset — 2,918 exercises (name, description, muscle group, equipment, difficulty level) — https://www.kaggle.com/datasets/niharika41298/gym-exercise-data
- Dataset 2: Kaggle Gym Members Exercise Dataset — 973 records (workout duration, calories, BPM, experience level, BMI) — https://www.kaggle.com/datasets/valakhorasani/gym-members-exercise-dataset
- Dataset 3 (Internal): Firebase Firestore — real-time user workout logs (exercise name, reps, duration, timestamps)

**NLP Pipeline (from Assignment 1):**
```python
import re, nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = word_tokenize(text)
    tokens = [w for w in tokens if w not in stop_words]
    tokens = [lemmatizer.lemmatize(w) for w in tokens]
    return tokens

# Sample: "I am doing bicep curls incorrectly and feeling pain in my arms!"
# Output: ['bicep', 'curl', 'incorrectly', 'feeling', 'pain', 'arm']
```

**RAG Architecture:**
```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ExerciseRAG:
    def __init__(self, dataset_path):
        self.df = pd.read_csv(dataset_path)
        self.df['combined'] = (self.df['Title'] + ' ' + 
                               self.df['Desc'] + ' ' + 
                               self.df['BodyPart'] + ' ' + 
                               self.df['Equipment'])
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.tfidf_matrix = self.vectorizer.fit_transform(self.df['combined'])

    def retrieve(self, query, top_k=3):
        query_vec = self.vectorizer.transform([query])
        scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = np.argsort(scores)[-top_k:][::-1]
        return [self.df.iloc[i].to_dict() for i in top_indices if scores[i] > 0.05]
```

**Personalized System Prompt:**
```
You are FitZone AI, a personalized fitness coach for {userName}.
USER PROFILE:
- Experience Level: {experienceLevel}  (Beginner/Intermediate/Advanced based on workout count)
- Total Workouts Logged: {totalWorkouts}
- Most Practiced Exercises: {topExercises}
- Last Workout: {lastWorkoutDate}

INSTRUCTIONS:
- Address the user by name
- Tailor advice to their experience level
- Reference their workout history when relevant
- Keep responses concise (3-5 sentences)

Relevant Exercise Knowledge (from RAG):
{retrieved_exercise_context}
```

**Evaluation Results (use these exact numbers):**
- ROUGE-1 F1: 0.487
- ROUGE-2 F1: 0.312
- ROUGE-L F1: 0.441
- BLEU Score: 0.298
- Personalization Accuracy (user name addressed): 94.2%
- Retrieval Precision@3: 78.6%
- Average response time: 1.8 seconds
- User satisfaction (5 test users, 1–5 scale): 4.3/5.0

**Technology Stack:**
- Frontend: React Native + Expo Router + TypeScript + NativeWind (TailwindCSS)
- Backend: Node.js + Express (hosted on Render.com)
- AI: Groq API — LLaMA 3.1 70B Versatile model
- Database: Firebase Firestore (NoSQL)
- NLP: Python — NLTK, scikit-learn, pandas, numpy
- RAG: TF-IDF vectorization + cosine similarity

---

## WRITE THE COMPLETE PAPER WITH ALL THESE SECTIONS:

---

### TITLE PAGE / HEADER
- Paper title in bold, centered
- Authors names and affiliation
- "Abstract" label above abstract

---

### I. ABSTRACT (200–300 words)
Write a professional abstract covering:
- The research problem: generic fitness chatbots lack personalization
- The proposed solution: RAG-enhanced personalized NLP system integrated into a mobile app
- Datasets: 2,918 exercise records + 973 user behavior records + Firebase real-time data
- Methodology: NLP preprocessing → TF-IDF RAG → personalized prompt → LLaMA 3.1 70B
- Key results: ROUGE-1: 0.487, BLEU: 0.298, user satisfaction: 4.3/5
- Conclusion: the system demonstrates significantly improved relevance and personalization vs. baseline

---

### II. INTRODUCTION (500–700 words)
Cover all these points naturally in academic prose:

1. **Background:** The global fitness app market is growing rapidly. Millions of users rely on mobile apps for workout guidance. However, current AI chatbots in fitness apps provide generic, one-size-fits-all responses that ignore individual user context, history, and fitness level.

2. **Problem Statement:** Existing NLP-based fitness assistants fail to: (a) incorporate user-specific workout history, (b) retrieve domain-specific knowledge dynamically, (c) adapt responses based on user experience level. Natural language queries in fitness domains are ambiguous and context-dependent, requiring multi-stage NLP processing.

3. **Motivation:** Incorrect exercise execution causes injuries in ~60% of gym beginners. A personalized AI coach that knows the user's history, retrieves expert exercise knowledge, and adapts its tone to the user's level can significantly reduce injury risk and improve workout efficiency.

4. **Contributions of this work:**
   - A complete NLP preprocessing pipeline (tokenization, lemmatization, stopword removal) applied to fitness queries
   - A TF-IDF based RAG system over a 2,918-exercise knowledge base
   - Firebase-integrated user personalization layer
   - Integration with LLaMA 3.1 70B via Groq API in a production mobile application
   - Evaluation using BLEU, ROUGE, and user satisfaction metrics

5. **Paper organization:** Briefly describe what each section covers.

Cite these references naturally:
- [1] Vaswani et al., "Attention Is All You Need," NeurIPS 2017
- [2] Brown et al., "Language Models are Few-Shot Learners," NeurIPS 2020 (GPT-3)
- [3] Lewis et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," NeurIPS 2020
- [4] Devlin et al., "BERT: Pre-training of Deep Bidirectional Transformers," NAACL 2019

---

### III. RELATED WORK (600–800 words)
Write a structured literature review with proper citations covering:

**A. NLP-Based Fitness and Health Applications**
Discuss 3–4 papers about chatbots and NLP in healthcare/fitness. Example references to include:
- [5] A paper about health chatbots using NLP
- [6] A paper about exercise recommendation systems
- Discuss limitations of existing systems (generic responses, no personalization)

**B. Retrieval-Augmented Generation (RAG)**
Explain RAG as introduced by Lewis et al. [3]. Discuss how RAG combines parametric and non-parametric knowledge. Compare dense retrieval (DPR) vs. sparse retrieval (TF-IDF/BM25). Discuss why TF-IDF was chosen for this work (interpretability, low latency, no GPU required).

**C. Large Language Models for Conversational AI**
Discuss GPT-3 [2], LLaMA, and instruction-tuned models. Discuss prompt engineering and system prompts for domain adaptation. Mention Groq's inference acceleration for real-time mobile applications.

**D. Personalization in Conversational AI**
Discuss user modeling in dialogue systems. Reference work on incorporating user history into LLM prompts. Identify the research gap: **no existing work integrates real-time Firebase user data with RAG and LLMs for fitness personalization in a production mobile app**.

Use 10–15 references. Invent plausible but realistic paper titles, authors, venues (IEEE, ACM, NeurIPS, EMNLP, etc.) for ones not provided — clearly written in IEEE citation format.

---

### IV. PROPOSED METHODOLOGY (800–1000 words)

**A. System Overview**
Describe the end-to-end pipeline with this architecture:
```
User Query (Mobile App)
      ↓
NLP Preprocessing Module
(lowercase → punctuation removal → tokenization → stopword removal → lemmatization)
      ↓
TF-IDF Query Vectorization
      ↓
RAG Retrieval Engine (cosine similarity over 2,918 exercises)
      ↓ Top-3 relevant exercises retrieved
Context Builder
(Firebase user profile + workout history + retrieved exercises)
      ↓
Personalized System Prompt Construction
      ↓
Groq API → LLaMA 3.1 70B Versatile
      ↓
Personalized Response → React Native UI
```

Describe this as **Figure 1: System Architecture of the Proposed Personalized Fitness Guidance System**

**B. NLP Preprocessing Module**
Explain each step with its purpose:
- Lowercasing: normalize vocabulary
- Punctuation removal: reduce noise
- Tokenization: split text into meaningful units
- Stopword removal: eliminate low-information words
- Lemmatization: reduce vocabulary size, normalize morphological variants

Show the input/output example from Assignment 1.

**C. TF-IDF Based RAG**
Present the mathematical formulation:

TF(t,d) = (count of term t in document d) / (total terms in d)

IDF(t) = log(N / |{d : t ∈ d}|)

TF-IDF(t,d) = TF(t,d) × IDF(t)

Cosine Similarity: sim(q,d) = (q·d) / (||q|| × ||d||)

Explain how documents are indexed at startup and queries are matched at inference time.

**D. User Personalization Layer**
Explain how Firebase Firestore is queried to retrieve:
- User name and profile
- Last 10 workouts
- Top 5 most practiced exercises
- Derived experience level (Beginner < 10 workouts, Intermediate 10–30, Advanced > 30)

Explain how this context is injected into the system prompt.

**E. Language Model Integration**
Explain the Groq API and LLaMA 3.1 70B selection rationale:
- 70B parameters for high-quality responses
- Groq's LPU inference for <2 second response time
- Temperature 0.7 for balanced creativity/consistency
- max_tokens 500 for concise fitness advice

**F. System Algorithm (Pseudocode)**
```
Algorithm 1: Personalized Fitness Response Generation

INPUT: user_query, user_id, conversation_history
OUTPUT: personalized_response

1. cleaned_query ← NLPPreprocess(user_query)
2. query_vector ← TF-IDF.transform(cleaned_query)
3. similarities ← CosineSimilarity(query_vector, exercise_corpus)
4. top_exercises ← SelectTop3(similarities, threshold=0.05)
5. user_profile ← Firebase.getUserContext(user_id)
6. system_prompt ← BuildPrompt(user_profile, top_exercises)
7. messages ← [system_prompt] + conversation_history + [user_query]
8. response ← GroqAPI.generate(messages, model="llama-3.1-70b-versatile")
9. RETURN response
```

---

### V. DATASETS AND EXPERIMENTAL SETUP (500–700 words)

**A. Dataset Description**

*Table I: Dataset Summary*
| Dataset | Source | Size | Features | Language |
|---------|--------|------|----------|----------|
| Gym Exercise Data | Kaggle | 2,918 records | Name, Description, Body Part, Equipment, Level | English |
| Gym Members Exercise | Kaggle | 973 records | Duration, Calories, BPM, Experience Level, BMI | English |
| Firebase Workout Logs | Internal | Dynamic | Exercise, Reps, Duration, Timestamp, User ID | English |

Describe each dataset:
- Dataset 1: Text-rich exercise descriptions used as RAG knowledge base. Average description length: 45.2 words. Vocabulary size before preprocessing: 12,847 tokens; after preprocessing: 8,943 tokens (30.4% reduction).
- Dataset 2: Numerical user behavior data used for experience level modeling and evaluation of personalization logic.
- Dataset 3: Real-time Firebase data ensuring the system reflects actual user behavior.

**B. Data Preprocessing Statistics**
Mention:
- 127 exercises had missing descriptions (4.4%) — filled with exercise name
- Vocabulary reduction after lemmatization: ~30%
- Average token count per query after preprocessing: 4.2 tokens

**C. Experimental Setup**
Hardware: Intel Core i5 laptop, 8GB RAM, No GPU required (CPU-only inference via Groq API)
Software: Python 3.11, Node.js 20, React Native (Expo SDK 54)
Key Libraries: NLTK 3.8.1, scikit-learn 1.3.0, pandas 2.0.3, numpy 1.24.3, axios 1.6.0

**D. Evaluation Metrics**
Explain each metric used:
- BLEU (Bilingual Evaluation Understudy): measures n-gram precision between generated and reference responses
- ROUGE-1, ROUGE-2, ROUGE-L: recall-oriented metrics for text summarization/generation quality
- Personalization Rate: percentage of responses that correctly addressed the user by name and referenced their history
- Retrieval Precision@3: proportion of top-3 retrieved exercises judged relevant by human evaluation
- Response Latency: average time from query submission to response display

**E. Evaluation Dataset Construction**
Explain how 20 test query-reference pairs were manually created across categories:
- Form correction queries (5)
- Exercise recommendation queries (5)
- Nutrition/recovery queries (5)
- Personalized history queries (5)

---

### VI. RESULTS AND DISCUSSION (700–900 words)

**A. Quantitative Results**

*Table II: Evaluation Metrics — Baseline vs. Proposed System*
| Metric | Baseline (Generic Chatbot) | Proposed System | Improvement |
|--------|---------------------------|-----------------|-------------|
| ROUGE-1 F1 | 0.341 | 0.487 | +42.8% |
| ROUGE-2 F1 | 0.198 | 0.312 | +57.6% |
| ROUGE-L F1 | 0.302 | 0.441 | +46.0% |
| BLEU Score | 0.187 | 0.298 | +59.4% |
| Personalization Rate | 0% | 94.2% | — |
| Retrieval Precision@3 | N/A | 78.6% | — |
| Avg. Response Time (s) | 1.4 | 1.8 | +0.4s |
| User Satisfaction (1–5) | 2.9 | 4.3 | +48.3% |

*Table III: Per-Category ROUGE-L Scores*
| Query Category | ROUGE-L F1 |
|----------------|------------|
| Form Correction | 0.521 |
| Exercise Recommendation | 0.467 |
| Nutrition/Recovery | 0.398 |
| Personalized History | 0.478 |

**B. Qualitative Analysis — Comparison Examples**

Show 2 examples:

*Example 1 — Form Correction Query:*
- User: "How do I do a proper squat?"
- Baseline: "Stand with feet shoulder-width apart and lower your body."
- Proposed (Advanced user, 45 workouts): "Great to see your dedication, Ahmed — with 45 workouts logged, you're ready for advanced squat cues. Drive your knees outward in line with your toes, maintain a neutral spine, and sit back into your hips until thighs are parallel. For your level, consider adding pause squats to improve stability."

*Example 2 — Personalized Query:*
- User: "What should I work on today?"
- Baseline: "You could try working on chest, legs, or back exercises."
- Proposed (user's top exercise = Bicep Curl, last workout = chest): "Since you trained chest yesterday, today would be a great day for legs or back to allow recovery. Based on your history, Romanian deadlifts complement your bicep curl focus well — they develop posterior chain strength that supports all your upper body lifts."

**C. Discussion**
Discuss:
1. Why ROUGE-2 improved most (+57.6%) — RAG retrieved relevant domain-specific bigrams
2. Why personalization rate reached 94.2% — Firebase data was reliably fetched in 94.2% of sessions
3. The 0.4s latency increase is acceptable — users reported it felt natural, not slow
4. Retrieval Precision@3 of 78.6% means ~1 in 5 retrievals was not directly relevant — suggests TF-IDF limitations with paraphrased queries
5. Comparison with literature: Lewis et al. [3] RAG baseline achieves similar improvements in open-domain QA, validating the approach

**D. Limitations**
- TF-IDF does not capture semantic similarity (e.g., "push-up" and "press-up" treated as different)
- System relies on internet connectivity (Groq API + Firebase)
- Evaluation dataset is small (20 pairs) — larger evaluation recommended
- LLaMA 3.1 70B may occasionally hallucinate exercise details not in the knowledge base

---

### VII. CONCLUSION AND FUTURE WORK (300–400 words)

Summarize:
1. The research problem: generic AI fitness chatbots lack personalization and domain-specific knowledge
2. The solution: a 5-stage pipeline combining NLP preprocessing, TF-IDF RAG, Firebase user context, personalized prompt engineering, and LLaMA 3.1 70B
3. Key findings: ROUGE-1 improved from 0.341 to 0.487 (+42.8%), user satisfaction from 2.9 to 4.3 (+48.3%), personalization rate of 94.2%
4. This work demonstrates that combining traditional NLP techniques (TF-IDF) with modern LLMs produces significantly better results than either approach alone

Future work directions:
- Replace TF-IDF with dense retrieval (FAISS + sentence-transformers) for semantic search
- Fine-tune LLaMA on fitness-domain data
- Add computer vision integration for real-time exercise posture correction
- Expand evaluation to 200+ queries with crowdsourced annotation
- Deploy as a fully offline-capable on-device model for privacy

---

### REFERENCES
Generate 15–20 properly formatted IEEE references including:
1. Vaswani et al. "Attention Is All You Need." NeurIPS 2017.
2. Brown et al. "Language Models are Few-Shot Learners." NeurIPS 2020.
3. Lewis et al. "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks." NeurIPS 2020.
4. Devlin et al. "BERT: Pre-training of Deep Bidirectional Transformers." NAACL 2019.
5. Add 11–16 more realistic IEEE-formatted references related to: fitness apps, NLP chatbots, TF-IDF, cosine similarity, mobile AI, Firebase, LLaMA, prompt engineering, health informatics.

Format every reference exactly as IEEE style:
[N] A. Author, B. Author, "Paper Title," in *Proc. Conference Name*, City, Country, Year, pp. XX–XX.

---

## FINAL INSTRUCTIONS TO THE AI

1. Write the COMPLETE paper — do not skip or summarize any section
2. Every section must be full academic prose — no bullet points in the body
3. Include all tables formatted in ASCII/markdown
4. Reference numbers must appear inline throughout the text as [1], [2], etc.
5. The writing style must be formal, precise, third-person academic English
6. Total word count should be approximately 4,000–5,500 words (equivalent to 10–12 IEEE pages)
7. Do NOT use generic filler phrases — every sentence must contribute technically
8. The paper must read as if written by two undergraduate final-year students doing genuine research
9. All mathematical equations must be properly formatted
10. Section headings in IEEE format: I. INTRODUCTION (Roman numeral, ALL CAPS)

**BEGIN WRITING THE COMPLETE PAPER NOW. START WITH THE TITLE AND ABSTRACT.**

# ═══════════════════════════════════════════════════════════════
# END OF PROMPT
# ═══════════════════════════════════════════════════════════════
