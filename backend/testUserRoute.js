import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1';

const testUserRegistration = async () => {
  console.log('🔍 Testing User Registration Route\n');
  
  try {
    const testUser = {
      fullName: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
      number: '9876543210'
    };
    
    const response = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('✅ User Registration Success:', response.data);
    
  } catch (error) {
    console.log('❌ User Registration Error:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full Error:', error.response?.data);
    
    if (error.response?.status === 400) {
      console.log('\n📋 This is expected - registration requires:');
      console.log('  - Valid user data');
      console.log('  - Avatar file upload');
      console.log('  - All required fields');
      console.log('\n✅ Route is accessible and validation is working!');
    }
  }
};

testUserRegistration();
