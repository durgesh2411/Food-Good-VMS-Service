import axios from "axios";

const testLeaderboardEndpoint = async () => {
  try {
    // First, login as admin
    console.log("🔐 Logging in as test admin...");
    const loginResponse = await axios.post("http://localhost:8000/api/v1/users/login", {
      email: "testadmin@test.com",
      password: "test123"
    }, {
      withCredentials: true
    });

    if (loginResponse.data.success) {
      console.log("✅ Admin login successful");
      console.log("📋 Login response:", loginResponse.data);
      console.log("🍪 Cookies:", loginResponse.headers['set-cookie']);
      
      // Now test the leaderboard endpoint
      console.log("📊 Fetching leaderboard data...");
      const leaderboardResponse = await axios.get(
        "http://localhost:8000/api/v1/volunteerWorks/admin/approvedVolunteerWorkWithHours",
        { 
          withCredentials: true,
          headers: {
            'Cookie': loginResponse.headers['set-cookie']?.join('; ') || ''
          }
        }
      );

      console.log("📈 Leaderboard response:", leaderboardResponse.data);
    } else {
      console.log("❌ Admin login failed");
    }

  } catch (error) {
    console.error("❌ Error:", error.response?.data || error.message);
  }
};

testLeaderboardEndpoint();
