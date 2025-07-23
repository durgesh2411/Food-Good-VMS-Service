import axios from 'axios';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env');
dotenv.config({ path: envPath });

const BASE_URL = 'http://localhost:8000/api/v1';

const testRoutes = async () => {
  console.log('🚀 Starting Route Testing with HTTP Requests\n');
  
  // Test 1: Health Check
  console.log('🔍 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check:', response.data.message);
  } catch (error) {
    console.log('❌ Health Check Failed:', error.message);
  }
  
  // Test 2: Feedback Routes
  console.log('\n🔍 Testing Feedback Routes...');
  try {
    // Test GET feedbacks
    const getFeedbacks = await axios.get(`${BASE_URL}/feedback`);
    console.log('✅ GET Feedbacks:', `Found ${getFeedbacks.data.data.length} feedbacks`);
    
    // Test POST feedback
    const postFeedback = await axios.post(`${BASE_URL}/feedback`, {
      message: 'Test feedback from route test - please ignore'
    });
    console.log('✅ POST Feedback:', postFeedback.data.message);
    
    // Clean up - delete test feedback
    if (postFeedback.data.data._id) {
      // Note: DELETE requires authentication, so this might fail
      try {
        await axios.delete(`${BASE_URL}/feedback/${postFeedback.data.data._id}`);
        console.log('✅ DELETE Feedback: Success');
      } catch (delError) {
        console.log('⚠️ DELETE Feedback: Requires authentication (expected)');
      }
    }
    
  } catch (error) {
    console.log('❌ Feedback Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 3: User Routes (Registration)
  console.log('\n🔍 Testing User Routes...');
  try {
    // Test registration endpoint (without actual registration)
    const testUserData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'testpass123',
      number: '1234567890'
    };
    
    // This will likely fail due to missing avatar file, but tests the route
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, testUserData);
      console.log('✅ User Registration Route:', response.data.message);
    } catch (regError) {
      if (regError.response?.status === 400) {
        console.log('✅ User Registration Route: Accessible (validation working)');
        console.log('   Expected error:', regError.response.data.message);
      } else {
        throw regError;
      }
    }
  } catch (error) {
    console.log('❌ User Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 4: Event Routes
  console.log('\n🔍 Testing Event Routes...');
  try {
    const getEvents = await axios.get(`${BASE_URL}/events`);
    console.log('✅ GET Events:', `Found ${getEvents.data.data.length} events`);
  } catch (error) {
    console.log('❌ Event Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 5: Post Routes
  console.log('\n🔍 Testing Post Routes...');
  try {
    const getPosts = await axios.get(`${BASE_URL}/posts`);
    console.log('✅ GET Posts:', `Found ${getPosts.data.data.posts.length} posts`);
  } catch (error) {
    console.log('❌ Post Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 6: Announcement Routes
  console.log('\n🔍 Testing Announcement Routes...');
  try {
    const getAnnouncements = await axios.get(`${BASE_URL}/announcements`);
    console.log('✅ GET Announcements:', `Found ${getAnnouncements.data.data.length} announcements`);
  } catch (error) {
    console.log('❌ Announcement Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 7: Donation Routes
  console.log('\n🔍 Testing Donation Routes...');
  try {
    const getDonations = await axios.get(`${BASE_URL}/donations`);
    console.log('✅ GET Donations:', `Found ${getDonations.data.data.length} donations`);
  } catch (error) {
    console.log('❌ Donation Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 8: Volunteer Work Routes
  console.log('\n🔍 Testing Volunteer Work Routes...');
  try {
    const getVolunteerWorks = await axios.get(`${BASE_URL}/volunteerWorks`);
    console.log('✅ GET Volunteer Works:', `Found ${getVolunteerWorks.data.data.length} volunteer works`);
  } catch (error) {
    console.log('❌ Volunteer Work Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 9: Star Vote Routes
  console.log('\n🔍 Testing Star Vote Routes...');
  try {
    const getStarVotes = await axios.get(`${BASE_URL}/star-votes`);
    console.log('✅ GET Star Votes:', `Found ${getStarVotes.data.data.length} star votes`);
  } catch (error) {
    console.log('❌ Star Vote Routes Error:', error.response?.data?.message || error.message);
  }
  
  // Test 10: Dashboard Routes
  console.log('\n🔍 Testing Dashboard Routes...');
  try {
    // Dashboard usually requires authentication
    const getDashboard = await axios.get(`${BASE_URL}/dashboard`);
    console.log('✅ GET Dashboard:', getDashboard.data.message);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Dashboard Route: Accessible (requires authentication)');
    } else {
      console.log('❌ Dashboard Routes Error:', error.response?.data?.message || error.message);
    }
  }
  
  console.log('\n✅ Route testing completed!');
};

// Check if server is running first
const checkServer = async () => {
  try {
    await axios.get(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    console.log('❌ Server not running on http://localhost:8000');
    console.log('Please start the backend server first with: npm start');
    return false;
  }
};

const main = async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testRoutes();
  }
};

main().catch(console.error);
