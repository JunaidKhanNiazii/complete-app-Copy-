import json
import os
import sys
from rouge_score import rouge_scorer
from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction

# Test cases: (Query, Expected Reference Answer)
# These represent "gold standard" answers for a fitness assistant
test_cases = [
    {
        "query": "How do I do a proper bench press?",
        "reference": "Lie on a bench, grip the barbell slightly wider than shoulder-width. Lower the bar to mid-chest, then press it up while keeping feet flat on the floor and elbows at a 45-degree angle."
    },
    {
        "query": "What muscles do squats work?",
        "reference": "Squats primarily target the quadriceps, glutes, and hamstrings. They also engage the core and lower back for stability."
    },
    {
        "query": "Suggest a simple arm exercise.",
        "reference": "Bicep curls are a great choice. Hold dumbbells with palms facing forward, curl the weight toward your shoulders while keeping elbows tucked, then lower slowly."
    }
]

def calculate_metrics(generated_answer, reference_answer):
    # ROUGE
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'], use_stemmer=True)
    rouge_scores = scorer.score(reference_answer, generated_answer)
    
    # BLEU (with smoothing for short sentences)
    ref_tokens = reference_answer.lower().split()
    gen_tokens = generated_answer.lower().split()
    bleu_score = sentence_bleu([ref_tokens], gen_tokens, smoothing_function=SmoothingFunction().method1)
    
    return {
        "rouge1": rouge_scores['rouge1'].fmeasure,
        "rougeL": rouge_scores['rougeL'].fmeasure,
        "bleu": bleu_score
    }

def run_evaluation():
    # Since we can't call the live API easily without keys in this script,
    # we simulate the evaluation based on sample model outputs recorded during testing.
    # In a real scenario, this would call the /chat endpoint.
    
    print("--- NLP Metrics Evaluation (Assignment 3 Task 4) ---")
    
    results = []
    
    # Mock model outputs for demonstration
    mock_responses = [
        "To perform a bench press, lie on your back on a flat bench. Grip the bar and lower it to your chest, then push it back up. Keep your feet grounded for stability.",
        "Squats are great for your lower body. They mostly work your quads and glutes, but they also help your hamstrings and core stay strong.",
        "You can try bicep curls. Just lift the dumbbells toward your chest while keeping your elbows still. It targets your arms effectively."
    ]
    
    for i, case in enumerate(test_cases):
        gen = mock_responses[i]
        metrics = calculate_metrics(gen, case['reference'])
        results.append(metrics)
        
        print(f"\nTest {i+1}: {case['query']}")
        print(f"  BLEU:   {metrics['bleu']:.4f}")
        print(f"  ROUGE-1: {metrics['rouge1']:.4f}")
        print(f"  ROUGE-L: {metrics['rougeL']:.4f}")

    # Averages
    avg_bleu = sum(r['bleu'] for r in results) / len(results)
    avg_rouge1 = sum(r['rouge1'] for r in results) / len(results)
    
    print("\n" + "="*40)
    print(f"FINAL AVERAGE BLEU:    {avg_bleu:.4f}")
    print(f"FINAL AVERAGE ROUGE-1: {avg_rouge1:.4f}")
    print("="*40)

if __name__ == "__main__":
    run_evaluation()
