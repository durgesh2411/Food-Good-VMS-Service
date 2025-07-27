import { OpenAI } from "openai";

let openai = null;

if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("OpenAI initialized successfully");
} else {
  console.log("OpenAI API key not found - AI functionality will be disabled");
}

export const generateAIResponse = async (message, conversationHistory = []) => {
  console.log("🔧 generateAIResponse called");
  console.log("OpenAI instance exists:", !!openai);
  
  if (!openai) {
    console.log("❌ OpenAI not initialized");
    throw new Error(
      "OpenAI is not configured. Please set OPENAI_API_KEY environment variable."
    );
  }

  console.log("📝 Building conversation context...");
  // System prompt to make AI context-aware for Volunteer Management System
  const systemPrompt = `You are a helpful AI assistant for "Food Good VMS" - a Volunteer Management System focused on food donation and community service. You specialize in helping users with:

**Core Services:**
- Volunteer registration and onboarding
- Food donation processes and campaigns
- Event management and participation
- Community feedback and support
- User account management

**Your Capabilities:**
- Answer questions about becoming a volunteer
- Explain donation processes and payment methods
- Provide information about upcoming events
- Help with account-related issues
- Guide users through platform features
- Offer general support for community service activities

**Tone & Style:**
- Be friendly, helpful, and encouraging
- Use clear, simple language
- Show enthusiasm for community service
- Provide step-by-step guidance when needed
- Be empathetic and supportive

**Platform Context:**
- This is a web-based platform with user authentication
- Users can register as volunteers, donate money, participate in events
- The platform connects volunteers with food donation opportunities
- Community-focused with social impact goals

Always try to be helpful and guide users to the right features of the platform. If you're unsure about specific technical details, acknowledge it and suggest they contact support.`;

  // Build messages array with system prompt, conversation history, and new message
  const messages = [
    { role: "system", content: systemPrompt }
  ];

  // Add conversation history (limit to last 10 exchanges to manage token usage)
  const recentHistory = conversationHistory.slice(-20); // Last 20 messages (10 exchanges)
  messages.push(...recentHistory);

  // Add the current user message
  messages.push({ role: "user", content: message });

  console.log("🚀 Calling OpenAI API...");
  console.log("Messages count:", messages.length);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    console.log("✅ OpenAI API call successful");
    const aiResponse = response.choices[0].message.content;
    console.log("Response length:", aiResponse.length);
    
    return aiResponse;
  } catch (error) {
    console.error("❌ OpenAI API Error:", error);
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    
    // Re-throw with more context
    if (error.message.includes("401")) {
      throw new Error("Invalid OpenAI API key. Please check your configuration.");
    } else if (error.message.includes("429")) {
      throw new Error("OpenAI API quota exceeded. Please try again later.");
    } else if (error.message.includes("503") || error.message.includes("502")) {
      throw new Error("OpenAI service temporarily unavailable. Please try again.");
    } else {
      throw new Error(`OpenAI API error: ${error.message}`);
    }
  }
};
