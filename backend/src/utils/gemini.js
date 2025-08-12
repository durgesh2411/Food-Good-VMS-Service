import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  generateRAGResponse,
  searchKnowledgeBase,
  shouldUseRAG,
} from "./rag.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

// Initialize Gemini AI
let genAI;
let model;

try {
  if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
} catch (error) {
  console.error("Gemini initialization error:", error.message);
}

// Enhanced system prompt for NEET preparation NGO context
const SYSTEM_PROMPT = `You are an AI assistant for "Lift for Upliftment" - a NEET preparation NGO based in Pune, Maharashtra, founded in 2015. You help students with NEET exam preparation and platform-related queries.

IMPORTANT RESPONSE GUIDELINES:
1. ALWAYS prioritize platform-specific information over general knowledge
2. Keep responses under 150 words unless detailed explanation is specifically requested
3. For non-platform queries (weather, news, general facts), politely redirect to platform topics
4. Focus on actionable information that helps users with NEET preparation or platform usage

CONTEXT: You're helping users with a platform focused on:
- NEET preparation support and tutoring (FREE for underprivileged students)
- Educational resource sharing (15,000+ practice questions, 2,400+ video lectures)
- Study group coordination and events (mock tests, workshops)
- Volunteer tutors and mentors (890+ active tutors)
- Donations for educational materials (80G tax-exempt)

PERSONALITY: Be friendly, helpful, and encouraging about education and NEET preparation support.

RESPONSE STRATEGY:
- For NEET questions: Provide study tips, exam strategies, subject guidance
- For platform questions: Guide to registration, features, support
- For volunteer questions: Explain how to join, requirements, benefits  
- For donation questions: Explain impact, tax benefits, process
- For general/irrelevant questions: Politely redirect to platform topics

GUIDELINES:
- Provide clear, actionable answers
- Be concise but thorough
- Encourage educational volunteering and NEET preparation support
- If unsure about platform-specific details, suggest contacting support
- Always include next steps or contact information when relevant
- Use emojis sparingly but effectively for important points

Please respond helpfully to the user's question with focus on our NEET preparation mission.`;

/**
 * Generate AI response with RAG-first approach, Gemini fallback
 */
export const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    // Step 1: Check if we should use RAG for this query
    if (shouldUseRAG(message)) {
      // Search local knowledge base
      const ragResults = await searchKnowledgeBase(message);

      if (ragResults.found && ragResults.content.length > 0) {
        const ragResponse = generateRAGResponse(ragResults, message);
        if (ragResponse) {
          return ragResponse;
        }
      }
    }

    // Step 2: Fallback to Gemini for general questions or when RAG fails
    if (!genAI || !model) {
      throw new Error("Gemini AI service is not properly configured. Please check your API key.");
    }

    // Build conversation history
    let conversationText = "";
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-6); // Last 6 messages
      conversationText = recentHistory
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n");
    }

    // Create the prompt
    const fullPrompt = `${SYSTEM_PROMPT}

${conversationText ? "Previous conversation:\n" + conversationText + "\n\n" : ""}Current user question: ${message}

Please provide a helpful response focused on NEET preparation and our platform features.`;

    // Generate response with Gemini
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    if (!aiResponse || aiResponse.trim().length === 0) {
      throw new Error("Gemini returned empty response");
    }

    return aiResponse.trim();

  } catch (error) {
    console.error("❌ AI Response Generation Error:", error);
    
    // Provide helpful fallback based on query type
    const queryLower = message.toLowerCase();
    if (queryLower.includes("neet") || queryLower.includes("exam") || queryLower.includes("preparation")) {
      return `I'm having trouble accessing our AI service right now, but I can help with NEET preparation! 

For immediate assistance:
📚 Visit our center at Camp, Pune for free NEET coaching
📱 Download our "Lift Learning" app for 2,400+ video lectures
💬 Contact us at info@liftforupliftment.org
📞 Call our helpline: +91-20-2612-XXXX

What specific NEET topic would you like guidance on?`;
    } else if (queryLower.includes("volunteer") || queryLower.includes("tutor")) {
      return `Our AI service is temporarily unavailable, but you can still join our volunteer team!

To become a volunteer tutor:
📧 Email: volunteer@liftforupliftment.org
🤝 Attend our monthly volunteer meet (first Saturday)
📋 Requirements: Graduation in PCB subjects, passion for teaching
🎯 Impact: Help underprivileged students crack NEET

Would you like more details about volunteer opportunities?`;
    } else {
      return `I'm experiencing technical difficulties right now. For immediate support:

📞 Call: +91-20-2612-XXXX
📧 Email: info@liftforupliftment.org
🌐 Visit: Our center at Camp, Pune
💬 WhatsApp: Available during exam season

How can I help you with NEET preparation or our platform features?`;
    }
  }
};

export default { generateAIResponse };
