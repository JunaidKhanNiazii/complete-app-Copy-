const { db } = require('../config/firebase');

/**
 * Fetches user profile and recent workout context for AI personalization
 * @param {string} userId - The ID of the logged-in user
 */
async function getUserContext(userId) {
    try {
        if (!userId) {
            return {
                userName: 'Member',
                experienceLevel: 'Beginner',
                totalWorkouts: 0,
                topExercises: [],
                lastWorkoutDate: 'None'
            };
        }

        const userIdStr = userId.toString();

        // 1. Get User Profile
        const userDoc = await db.collection('users').doc(userIdStr).get();
        const userData = userDoc.data() || {};
        const userName = userData.name || 'Member';

        // 2. Get Workouts for stats (Retrieve last 50 for accurate reporting)
        let workoutsSnap = await db.collection('users').doc(userIdStr).collection('workouts')
            .orderBy('date', 'desc')
            .limit(50)
            .get();

        // 3. Get Total Workout Count (using the size of the collection)
        const totalWorkoutsSnap = await db.collection('users').doc(userIdStr).collection('workouts').get();
        const totalWorkouts = totalWorkoutsSnap.size;

        const workouts = workoutsSnap.docs.map(doc => doc.data());

        // 3. Analyze Workout History for Reports
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 7);
        const startOfMonth = new Date(now);
        startOfMonth.setMonth(now.getMonth() - 1);

        const stats = {
            todayCount: 0,
            thisWeekCount: 0,
            thisMonthCount: 0,
            exerciseFreq: {},
            recentSummary: []
        };

        const todayStr = now.toISOString().split('T')[0];

        const fullHistoryLog = [];

        workouts.forEach((w, index) => {
            const wDate = new Date(w.date);
            const wDateStr = w.date;

            // Frequency
            if (w.exercises && Array.isArray(w.exercises)) {
                const exerciseList = w.exercises.map(ex => ex.name || 'Unknown').join(", ");
                fullHistoryLog.push(`${wDateStr}: ${exerciseList}`);

                w.exercises.forEach(ex => {
                    const name = ex.name || 'Unknown';
                    stats.exerciseFreq[name] = (stats.exerciseFreq[name] || 0) + 1;
                });
            }

            // Stats by time periods
            if (wDateStr === todayStr) stats.todayCount++;
            if (wDate >= startOfWeek) stats.thisWeekCount++;
            if (wDate >= startOfMonth) stats.thisMonthCount++;

            // Recent summary (first 5 for richness)
            if (index < 5 && w.exercises) {
                const exercises = w.exercises.map(e => e.name).join(", ");
                stats.recentSummary.push(`${w.date}: ${exercises} (${w.totalReps || 0} reps, ${w.totalDuration || 'N/A'})`);
            }
        });

        const topExercises = Object.entries(stats.exerciseFreq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([name, count]) => `${name} (${count}x)`);

        // 4. Experience Level
        const workoutCount = workouts.length;
        const experienceLevel = userData.level || (
            workoutCount > 20 ? 'Advanced' :
                workoutCount > 5 ? 'Intermediate' : 'Beginner'
        );

        return {
            userId: userIdStr,
            userName,
            experienceLevel,
            totalWorkouts: totalWorkouts,
            topExercises,
            lastWorkoutDate: workouts[0]?.date || 'No recent workouts recorded',
            reports: {
                today: stats.todayCount,
                thisWeek: stats.thisWeekCount,
                thisMonth: stats.thisMonthCount,
                recentActivities: stats.recentSummary,
                fullHistory: fullHistoryLog.slice(0, 20) // Limit to last 20 for prompt size
            }
        };

    } catch (error) {
        console.error('[PersonalizationService] Error fetching user context:', error.message);
        return {
            userName: 'Member',
            experienceLevel: 'Beginner',
            totalWorkouts: 0,
            topExercises: [],
            lastWorkoutDate: 'Error fetching history'
        };
    }
}

module.exports = { getUserContext };
