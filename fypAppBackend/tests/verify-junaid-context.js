const { getUserContext } = require('../services/personalizationService');
const { db } = require('../config/firebase');

async function verifyJunaid() {
    console.log("--- Verifying Context for Junaid (ID: 3) ---");
    try {
        const context = await getUserContext(3);
        console.log(JSON.stringify(context, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
    process.exit(0);
}

verifyJunaid();
