const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

const testUsers = [
    { email: 'junaidameerkhan555@gmail.com', password: 'junaid123', name: 'Junaid khan' },
    { email: 'sarfraz@gmail.com', password: 'junaid123', name: 'Sarfraz jamal' },
    { email: 'zaheer@gmail.com', password: 'junaid123', name: 'Zaheer Abbas' },
    { email: 'dawood@gmail.com', password: 'junaid123', name: 'Habib' },
    { email: 'ali@gmail.com', password: '123', name: 'Alii' }
];

async function testAllLogins() {
    console.log('Testing login for all existing users...\n');
    
    let passed = 0;
    let failed = 0;
    
    for (const testUser of testUsers) {
        try {
            console.log(`Testing: ${testUser.name} (${testUser.email})`);
            
            const response = await axios.post(`${BACKEND_URL}/member/login`, {
                email: testUser.email,
                password: testUser.password
            });
            
            if (response.data.success) {
                const user = response.data.user;
                console.log(`  ✅ Login successful - userId: ${user.userId || user.id}`);
                console.log(`     Images: ${user.images ? user.images.length : 0}, JoinDate: ${user.joinDate}`);
                passed++;
            }
        } catch (error) {
            console.log(`  ❌ Login failed - ${error.response?.data?.error || error.message}`);
            failed++;
        }
        console.log('');
    }
    
    console.log('='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(50));
}

testAllLogins();
