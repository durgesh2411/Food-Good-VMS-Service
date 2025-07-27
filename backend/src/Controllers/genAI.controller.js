import { generateAIResponse } from "../utils/openai.js";

export const getAIReply = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string"
      });
    }

    // Generate AI response with conversation context
    const reply = await generateAIResponse(message, conversationHistory);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI response"
    });
  }
};
