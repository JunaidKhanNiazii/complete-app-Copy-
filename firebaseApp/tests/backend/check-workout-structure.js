const { db } = require("./config/firebase");

async function checkWorkoutStructure() {
    try {
        console.log("Checking workout structure...\n");
        
        // Check if workouts are in a top-level collection
        const topLevelSnapshot = await db.collection("workouts").limit(3).get();
        
        if (!topLevelSnapshot.empty) {
            console.log("=== Top-level workouts collection ===");
            topLevelSnapshot.docs.forEach((doc, index) => {
                const data = doc.data();
                console.log(`\nWorkout ${index + 1} (ID: ${doc.id}):`);
                console.log(JSON.stringify(data, null, 2));
            });
        } else {
            console.log("No workouts in top-level collection");
        }
        
        // Check if workouts are subcollections under users
        console.log("\n\n=== Checking user subcollections ===");
        const userDoc = await db.collection("users").doc("3").get();
        
        if (userDoc.exists) {
            console.log("User 3 exists, checking for workouts subcollection...");
            const workoutsSubcollection = await db.collection("users").doc("3").collection("workouts").limit(3).get();
            
            if (!workoutsSubcollection.empty) {
                console.log("\nFound workouts in subcollection:");
                workoutsSubcollection.docs.forEach((doc, index) => {
                    const data = doc.data();
                    console.log(`\nWorkout ${index + 1} (ID: ${doc.id}):`);
                    console.log(JSON.stringify(data, null, 2));
                });
            } else {
                console.log("No workouts in subcollection");
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkWorkoutStructure();
