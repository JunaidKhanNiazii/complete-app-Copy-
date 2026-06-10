const axios = require('axios');

const BACKEND_URL = 'http://10.17.13.58:5000';

async function testAIChat() {
    console.log('=== Testing AI Chat Endpoint ===\n');

    const testMessages = [
        "Hello! Can you help me with my workout?",
        "How do I improve my squat form?",
        "What's the best way to build muscle?"
    ];

    for (let i = 0; i < testMessages.length; i++) {
        const message = testMessages[i];
        console.log(`\n${i + 1}. Testing message: "${message}"`);
        console.log('   Sending request...');

        try {
            const startTime = Date.now();
            const response = await axios.post(`${BACKEND_URL}/ai/chat`, {
                message: message,
                conversationHistory: []
            });

            const endTime = Date.now();
            const duration = ((endTime - startTime) / 1000).toFixed(2);

            if (response.data.success) {
                console.log(`   ✅ Success (${duration}s)`);
                console.log(`   AI Response: "${response.data.response}"`);
                console.log(`   Model: ${response.data.model}`);
            } else {
                console.log('   ❌ Failed: Response success = false');
            }
        } catch (error) {
            console.log('   ❌ Error:', error.response?.data || error.message);
        }
    }

    console.log('\n=== Test Complete ===');
}

testAIChat();
