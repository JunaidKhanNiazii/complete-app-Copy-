const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testWorkoutAPIs() {
    try {
        console.log('Testing workout APIs with user ID 3...\n');
        
        // Test 1: Get all workouts for user
        console.log('1. Testing GET /workouts/user/3');
        const workoutsResponse = await axios.get(`${BACKEND_URL}/workouts/user/3`);
        console.log(`   ✅ Success! Found ${workoutsResponse.data.count} workouts`);
        if (workoutsResponse.data.workouts.length > 0) {
            console.log(`   First workout date: ${workoutsResponse.data.workouts[0].date}`);
        }
        
        // Test 2: Get workouts with date range
        console.log('\n2. Testing GET /workouts/user/3 with date range');
        const rangeResponse = await axios.get(`${BACKEND_URL}/workouts/user/3?startDate=2026-02-24&endDate=2026-02-25`);
        console.log(`   ✅ Success! Found ${rangeResponse.data.count} workouts in range`);
        
        // Test 3: Get workout stats
        console.log('\n3. Testing GET /workouts/stats/3?period=weekly');
        const statsResponse = await axios.get(`${BACKEND_URL}/workouts/stats/3?period=weekly`);
        console.log(`   ✅ Success!`);
        console.log(`   Total workouts: ${statsResponse.data.stats.totalWorkouts}`);
        console.log(`   Total exercises: ${statsResponse.data.stats.totalExercises}`);
        console.log(`   Total reps: ${statsResponse.data.stats.totalReps}`);
        
        console.log('\n✅ All tests passed!');
        
    } catch (error) {
        console.error('\n❌ Test failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testWorkoutAPIs();
