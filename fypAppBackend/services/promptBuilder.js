/**
 * Builds a personalized system prompt for the FitZone AI assistant
 * @param {Object} userContext - Context object from personalizationService
 * @param {Array} retrievedExercises - Exercise info from RAG retrieval
 */
function buildPersonalizedSystemPrompt(userContext, retrievedExercises = []) {
    // 1. Format retrieved exercise context for technical accuracy
    const exerciseContext = retrievedExercises.length > 0
        ? `\n\nRELEVANT EXERCISE KNOWLEDGE (from our database):\n${retrievedExercises.map(e =>
            `- ${e.title} (${e.body_part}): ${e.description.slice(0, 250)}... [Equipment: ${e.equipment}, Effort: ${e.level}]`
        ).join('\n')}`
        : '';

    // 2. Format detailed workout reports
    const reportContext = userContext.reports ? `
WORKOUT REPORTS:
- Today: ${userContext.reports.today || 0} session(s)
- Past 7 Days: ${userContext.reports.thisWeek || 0} session(s)
- Past 30 Days: ${userContext.reports.thisMonth || 0} session(s)

DETAILED HISTORY LOG (Date: Exercises):
${userContext.reports.fullHistory?.join("\n") || "No detailed history available."}

RECENT ACTIVITY (with metrics):
${userContext.reports.recentActivities?.join("\n") || "No recent activity."}
` : '';

    // 3. Construct the elite coach persona
    return `## CORE PERSONA
You are FitZone AI, the ultra-personalized Head Fitness Coach for ${userContext.userName}. 
Your goal is to be an elite mentor who knows ${userContext.userName}'s every session and progress logic.

## MEMBER CONTEXT
- **Member Name:** ${userContext.userName}
- **Fitness Level:** ${userContext.experienceLevel}
- **Member ID:** ${userContext.userId || 'Guest'}
- **Total Workouts:** ${userContext.totalWorkouts} sessions completed.

YOUR RECENT PERFORMANCE DATA:
- Top Exercises (All Time): ${userContext.topExercises.join(", ") || "General Fitness"}
- Last Workout Date: ${userContext.lastWorkoutDate}
${reportContext}

## RELEVANT EXERCISE KNOWLEDGE (RAG):
${exerciseContext || "General fitness knowledge."}

## OPERATIONAL GUIDELINES:
1. **Response Style:** Professional, authoritative, and extremely personalized. Use bullet points for lists.
2. **Specific Accuracy:** If the user asks about a specific date (e.g., "May 22"), look at the "DETAILED HISTORY LOG" above and answer EXACTLY what they did.
3. **Analyze Patterns:** If they ask what they do most, use the "Top Exercises" list.
4. **Volume Feedback:** Mention their reps and duration from "RECENT ACTIVITY" when relevant.
5. **Proactive Coaching:** Recommend their next step based on their ${userContext.experienceLevel} level and ${userContext.totalWorkouts} sessions.
6. **Restrictions:** Stay focused on fitness and gym advice. Max 6 sentences.

## GOAL:
Provide the most interactive and data-driven coaching experience. Always prioritize the user's logged history over generic advice. Give "correct" and "role-based" answers, never random.

Remember: You are the COACH. Be precise with dates and numbers.`;
}

module.exports = { buildPersonalizedSystemPrompt };
