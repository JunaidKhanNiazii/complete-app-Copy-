const { db } = require("./config/firebase");

async function checkUserStructure() {
    try {
        console.log("Fetching all users to check structure...\n");
        
        const snapshot = await db.collection("users").limit(5).get();
        
        if (snapshot.empty) {
            console.log("No users found in database");
            return;
        }
        
        snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            console.log(`\n=== User ${index + 1} (Doc ID: ${doc.id}) ===`);
            console.log("Fields present:");
            console.log("- userId:", data.userId || "MISSING");
            console.log("- username:", data.username || "MISSING");
            console.log("- name:", data.name || "MISSING");
            console.log("- email:", data.email || "MISSING");
            console.log("- password:", data.password ? "EXISTS" : "MISSING");
            console.log("- phone:", data.phone || "MISSING");
            console.log("- images:", Array.isArray(data.images) ? `Array(${data.images.length})` : "MISSING");
            console.log("- joinDate:", data.joinDate || "MISSING");
            console.log("- createdAt:", data.createdAt || "MISSING");
            console.log("- updatedAt:", data.updatedAt || "MISSING");
            console.log("\nFull data:", JSON.stringify(data, null, 2));
        });
        
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkUserStructure();
