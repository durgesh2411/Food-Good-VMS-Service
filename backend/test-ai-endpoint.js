import fetch from "node-fetch";

const testAIEndpoint = async () => {
  try {
    console.log("🧪 Testing AI endpoint...");

    const response = await fetch("http://localhost:8000/api/v1/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Hello, how can I volunteer?",
        conversationHistory: [],
      }),
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);

    const data = await response.json();
    console.log("Response data:", data);

    if (data.success) {
      console.log("✅ AI endpoint is working!");
      console.log("AI Reply:", data.reply);
    } else {
      console.log("❌ AI endpoint returned error:", data.error);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

testAIEndpoint();
