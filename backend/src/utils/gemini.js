import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateRAGResponse, searchKnowledgeBase, shouldUseRAG } from './rag.js';

// Initialize Gemini AI
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("✅ Gemini AI initialized successfully");
  } else {
    console.log("⚠️ Gemini API key not found - AI features will use RAG only");
  }
} catch (error) {
  console.error("❌ Gemini initialization error:", error.message);
}

// Enhanced system prompt for volunteer management context
const SYSTEM_PROMPT = `You are a helpful AI assistant for the Food Good Volunteer Management System (VMS). 

CONTEXT: You're helping users with a platform focused on:
- Volunteer registration and management
- Food donation coordination  
- Community events and activities
- User account management
- Volunteer work opportunities

PERSONALITY: Be friendly, helpful, and encouraging about volunteering and community service.

GUIDELINES:
- Provide clear, actionable answers
- Be concise but thorough
- Encourage community participation
- If unsure about platform-specific details, suggest contacting support
- Keep responses under 200 words unless more detail is specifically requested

Please respond helpfully to the user's question.`;

/**
 * Generate AI response with RAG-first approach, Gemini fallback
 */
export const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    console.log("🤖 Processing AI request with RAG + Gemini system");
    
    // Step 1: Check if we should use RAG for this query
    if (shouldUseRAG(message)) {
      console.log("🔍 Query suitable for RAG - searching knowledge base first");
      
      // Search local knowledge base
      const ragResults = await searchKnowledgeBase(message);
      
      if (ragResults.found && ragResults.content.length > 0) {
        console.log("✅ Found answer in knowledge base - generating RAG response");
        const ragResponse = generateRAGResponse(ragResults, message);
        
        if (ragResponse) {
          console.log("🎯 Returning RAG response (cost: $0.00)");
          return ragResponse;
        }
      }
      
      console.log("❌ RAG didn't find sufficient answer - falling back to Gemini");
    } else {
      console.log("🌐 General query detected - using Gemini directly");
    }

    // Step 2: Use Gemini for general questions or RAG fallback
    if (!model) {
      // If no Gemini available, try to provide a helpful RAG-only response
      console.log("⚠️ Gemini not available - attempting RAG-only response");
      const ragResults = await searchKnowledgeBase(message);
      
      if (ragResults.found && ragResults.content.length > 0) {
        const ragResponse = generateRAGResponse(ragResults, message);
        if (ragResponse) {
          return ragResponse + "\n\n*Note: For more detailed assistance, please contact our support team.*";
        }
      }
      
      return "I'm currently having trouble accessing my full AI capabilities. However, I can still help with basic platform questions! Try asking about registration, volunteering, donations, or events. For complex queries, please contact our support team.";
    }

    // Build conversation context for Gemini
    let conversationContext = SYSTEM_PROMPT + "\n\nCONVERSATION HISTORY:\n";
    
    // Add recent conversation history (last 6 messages to keep within limits)
    const recentHistory = conversationHistory.slice(-6);
    recentHistory.forEach(msg => {
      conversationContext += `${msg.role}: ${msg.content}\n`;
    });
    
    conversationContext += `\nUser: ${message}\nAssistant:`;

    console.log("🔄 Calling Gemini API...");
    
    // Generate response with Gemini
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    const reply = response.text();

    if (!reply || reply.trim().length === 0) {
      throw new Error("Empty response from Gemini");
    }

    console.log("✅ Gemini response generated successfully");
    return reply.trim();

  } catch (error) {
    console.error("❌ AI Response Generation Error:", error);
    
    // Enhanced error handling with RAG fallback
    try {
      console.log("🔄 Attempting RAG fallback due to Gemini error...");
      const ragResults = await searchKnowledgeBase(message);
      
      if (ragResults.found && ragResults.content.length > 0) {
        const ragResponse = generateRAGResponse(ragResults, message);
        if (ragResponse) {
          return ragResponse + "\n\n*Note: I used our knowledge base since the AI service is temporarily unavailable.*";
        }
      }
    } catch (ragError) {
      console.error("❌ RAG fallback also failed:", ragError);
    }

    // Final fallback message
    if (error.message.includes("API_KEY")) {
      return "I'm currently unable to access the AI service due to configuration issues. However, I can still help with basic platform questions! Try asking about registration, volunteering, donations, or events.";
    } else if (error.message.includes("quota") || error.message.includes("limit")) {
      return "The AI service is temporarily at capacity. I can still help with platform-specific questions from our knowledge base! Try asking about how to register, volunteer opportunities, or donation processes.";
    } else if (error.message.includes("network") || error.message.includes("timeout")) {
      return "I'm experiencing network connectivity issues. Please try again in a moment. In the meantime, you can browse our help sections or contact support directly.";
    }

    return "I'm having trouble processing your request right now. Please try rephrasing your question or contact our support team for assistance.";
  }
};

// Export for backward compatibility
export default {
  generateAIResponse
};
