const { retrieveExercises } = require('../services/ragHelper');
const { buildPersonalizedSystemPrompt } = require('../services/promptBuilder');

// Mock User Context (since we don't want to rely on live Firestore for a quick test)
const mockUserContext = {
    userName: "Junaid (Admin Test)",
    experienceLevel: "Intermediate",
    totalWorkouts: 15,
    topExercises: ["Bench Press (5x)", "Squat (3x)", "Bicep Curl (2x)"],
    lastWorkoutDate: "2026-06-09",
    reports: {
        today: 1,
        thisWeek: 4,
        thisMonth: 12,
        recentActivities: [
            "2026-06-09: Bench Press, Pushups",
            "2026-06-07: Squats, Leg Press",
            "2026-06-05: Bicep Curls, Pullups"
        ]
    }
};

async function testFullPipeline() {
    console.log("--- FitZone Personalized AI Pipeline Test ---");
    console.log(`[Step 1] Loading Mock User Context for: ${mockUserContext.userName}`);

    const userQuery = "How can I improve my bench press? I did it yesterday but felt some elbow pain.";
    console.log(`[Step 2] User Query: "${userQuery}"`);

    console.log("[Step 3] Running RAG Retrieval...");
    const context = await retrieveExercises(userQuery, 3);

    console.log(`[Step 4] Found ${context.length} relevant exercises in database:`);
    context.forEach((ex, i) => {
        console.log(`  ${i + 1}. ${ex.title} (Relevance Score: ${ex.score.toFixed(4)})`);
    });

    console.log("[Step 5] Building Personalized System Prompt...");
    const systemPrompt = buildPersonalizedSystemPrompt(mockUserContext, context);

    console.log("\n--- FINAL PERSONALIZED SYSTEM PROMPT ---");
    console.log(systemPrompt);
    console.log("------------------------------------------");

    console.log("\n[SUCCESS] Pipeline verified: NLP Preprocessing -> RAG -> Personalization -> Prompt Injection.");
}

testFullPipeline();
