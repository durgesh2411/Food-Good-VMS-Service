import { generateAIResponse } from "../utils/openai.js";

export const getAIReply = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    
    console.log("🤖 AI Chat Request received");
    console.log("Message:", message);
    console.log("OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("OpenAI API Key prefix:", process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 10) + "..." : "NOT SET");
    
    // Validate input
    if (!message || typeof message !== 'string') {
      console.log("❌ Invalid message input");
      return res.status(400).json({ 
        success: false, 
        error: "Message is required and must be a string" 
      });
    }

    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY) {
      console.log("❌ OpenAI API key not configured");
      return res.status(500).json({ 
        success: false, 
        error: "AI service is not configured. Please contact support." 
      });
    }

    console.log("🔄 Calling generateAIResponse...");
    // Generate AI response with conversation context
    const reply = await generateAIResponse(message, conversationHistory);
    console.log("✅ AI response generated successfully");
    
    res.json({ 
      success: true, 
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("❌ AI Controller Error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    // More specific error messages
    let userMessage = "Failed to generate AI response";
    if (error.message.includes("API key")) {
      userMessage = "AI service configuration error. Please contact support.";
    } else if (error.message.includes("quota")) {
      userMessage = "AI service is temporarily unavailable. Please try again later.";
    } else if (error.message.includes("network") || error.message.includes("timeout")) {
      userMessage = "Network error. Please check your connection and try again.";
    }
    
    res.status(500).json({ 
      success: false, 
      error: userMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};