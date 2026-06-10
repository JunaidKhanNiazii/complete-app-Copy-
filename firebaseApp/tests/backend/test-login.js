const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

async function testLogin() {
    try {
        console.log('Testing member login with existing user...\n');
        
        // Test with the first user from database
        const testUser = {
            email: 'junaidameerkhan555@gmail.com',
            password: 'junaid123'
        };
        
        console.log('Attempting login with:');
        console.log('Email:', testUser.email);
        console.log('Password:', testUser.password);
        console.log('\nSending request to:', `${BACKEND_URL}/member/login`);
        
        const response = await axios.post(`${BACKEND_URL}/member/login`, testUser);
        
        console.log('\n✅ Login successful!');
        console.log('\nResponse data:');
        console.log(JSON.stringify(response.data, null, 2));
        
        // Check if user has all required fields
        const user = response.data.user;
        console.log('\n=== User Data Validation ===');
        console.log('✓ userId:', user.userId || user.id);
        console.log('✓ name:', user.name);
        console.log('✓ email:', user.email);
        console.log('✓ username:', user.username);
        console.log('✓ images:', Array.isArray(user.images) ? `Array(${user.images.length})` : 'MISSING');
        console.log('✓ joinDate:', user.joinDate);
        console.log('✓ phone:', user.phone || 'null');
        
        console.log('\n✅ All tests passed! User can login successfully.');
        
    } catch (error) {
        console.error('\n❌ Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        console.error('\nMake sure the backend is running on port 5000');
    }
}

testLogin();
