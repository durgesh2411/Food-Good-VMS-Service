import { OpenAI } from "openai";
import { searchKnowledgeBase, generateRAGResponse, shouldUseRAG } from "./rag.js";

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
  console.log("User query:", message);

  // Step 1: Try RAG first for platform-specific questions
  if (shouldUseRAG(message)) {
    console.log("🔍 Using RAG for platform-specific query");

    try {
      const ragResults = await searchKnowledgeBase(message);
      const ragResponse = generateRAGResponse(ragResults, message);

      if (ragResponse) {
        console.log("✅ RAG provided response from knowledge base");
        return ragResponse;
      }

      console.log("📚 RAG didn't find sufficient information, falling back to OpenAI");
    } catch (ragError) {
      console.error("❌ RAG Error:", ragError);
      console.log("🔄 Falling back to OpenAI due to RAG error");
    }
  } else {
    console.log("🤖 Using OpenAI for general query (not platform-specific)");
  }

  // Step 2: Fallback to OpenAI for general questions or when RAG fails
  console.log("OpenAI instance exists:", !!openai);

  if (!openai) {
    console.log("❌ OpenAI not initialized");
    throw new Error(
      "AI service is not available. For platform-specific questions, I can help with information about volunteering, donations, events, and platform features. For other questions, please try again later."
    );
  }

  console.log("📝 Building conversation context for OpenAI...");

  // Enhanced system prompt that includes knowledge about RAG
  const systemPrompt = `You are an AI assistant for "Lift for Upliftment" - a NEET preparation NGO based in Pune, Maharashtra, founded in 2015.

**IMPORTANT RESPONSE GUIDELINES:**
1. Keep responses under 150 words unless detailed explanation is specifically requested
2. For non-platform queries (weather, news, general facts), politely redirect to platform topics
3. Always prioritize NEET preparation and educational support information
4. Focus on actionable information that helps users

**Your role**:
- For general questions: Provide brief, helpful responses but guide back to platform topics
- For platform questions: Provide comprehensive guidance about NEET preparation, volunteering, donations
- Always be encouraging about education and helping NEET aspirants achieve their medical career dreams

**Platform Context**:
- This is a FREE NEET preparation NGO for underprivileged students
- 12,847+ students served since 2015, 3,456+ NEET qualifiers
- 890+ volunteer tutors, 15,000+ practice questions, 2,400+ video lectures
- Located in Pune with 23 centers across 8 states
- 80G tax-exempt donations, CSR partnerships available

**Response Strategy:**
- For NEET questions: Provide study tips, exam strategies, subject guidance
- For volunteer questions: Explain requirements, benefits, how to join
- For donation questions: Highlight impact, tax benefits, process
- For platform technical questions: Guide to features, support contacts
- For irrelevant questions: Briefly acknowledge then redirect to platform topics

**Tone**: Be friendly, helpful, and encouraging. Show enthusiasm for education and helping students achieve their medical career dreams.

If you're unsure about specific platform details, acknowledge it and provide our contact information: info@liftforupliftment.org or +91-20-2612-XXXX.`;

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
      max_tokens: 400,
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
