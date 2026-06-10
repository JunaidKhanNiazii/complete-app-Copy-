const axios = require('axios');

const BACKEND_URL = 'http://10.17.13.58:5000';
const TEST_USER_ID = '3'; // Junaid's user ID

async function testReportsData() {
    console.log('=== Testing Reports Data ===\n');

    // Test Daily
    const today = new Date().toISOString().split('T')[0];
    console.log(`1. Testing Daily (${today}):`);
    try {
        const response = await axios.get(
            `${BACKEND_URL}/workouts/user/${TEST_USER_ID}?startDate=${today}&endDate=${today}`
        );
        console.log(`   Found ${response.data.workouts.length} workouts`);
        if (response.data.workouts.length > 0) {
            console.log(`   Dates:`, response.data.workouts.map(w => w.date));
        }
    } catch (error) {
        console.error(`   Error:`, error.message);
    }

    // Test Weekly
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    console.log(`\n2. Testing Weekly (${weekAgoStr} to ${today}):`);
    try {
        const response = await axios.get(
            `${BACKEND_URL}/workouts/user/${TEST_USER_ID}?startDate=${weekAgoStr}&endDate=${today}`
        );
        console.log(`   Found ${response.data.workouts.length} workouts`);
        if (response.data.workouts.length > 0) {
            console.log(`   Dates:`, response.data.workouts.map(w => w.date));
        }
    } catch (error) {
        console.error(`   Error:`, error.message);
    }

    // Test Monthly
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthAgoStr = monthAgo.toISOString().split('T')[0];
    console.log(`\n3. Testing Monthly (${monthAgoStr} to ${today}):`);
    try {
        const response = await axios.get(
            `${BACKEND_URL}/workouts/user/${TEST_USER_ID}?startDate=${monthAgoStr}&endDate=${today}`
        );
        console.log(`   Found ${response.data.workouts.length} workouts`);
        if (response.data.workouts.length > 0) {
            console.log(`   Dates:`, response.data.workouts.map(w => w.date));
            console.log(`\n   Sample workout structure:`);
            console.log(JSON.stringify(response.data.workouts[0], null, 2));
        }
    } catch (error) {
        console.error(`   Error:`, error.message);
    }

    console.log('\n=== Test Complete ===');
}

testReportsData();
