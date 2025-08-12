import { generateAIResponse } from "../utils/gemini.js";

export const getAIReply = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string",
      });
    }

    // Generate AI response with RAG + Gemini fallback
    const reply = await generateAIResponse(message, conversationHistory);

    res.json({
      success: true,
      reply,
      timestamp: new Date().toISOString(),
      system: "RAG + Gemini AI",
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    // More specific error messages
    let userMessage = "I'm having trouble processing your request right now.";

    if (
      error.message.includes("API key") ||
      error.message.includes("not available")
    ) {
      userMessage =
        "I can still help with basic platform questions! Try asking about volunteering, donations, events, or how to use specific features.";
    } else if (error.message.includes("quota")) {
      userMessage =
        "The AI service is temporarily at capacity. I can still help with platform-specific questions from our knowledge base!";
    } else if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      userMessage =
        "There's a network issue right now. Please try again in a moment.";
    }

    res.status(500).json({
      success: false,
      error: userMessage,
      timestamp: new Date().toISOString(),
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
