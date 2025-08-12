import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple text similarity function using word overlap
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);

  const intersection = words1.filter((word) => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];

  // Boost similarity for exact keyword matches
  const exactMatches = words1.filter(
    (word) => word.length > 3 && words2.includes(word)
  ).length;

  const baseSimilarity = intersection.length / union.length;
  const boostFactor = exactMatches * 0.1; // 10% boost per exact match

  return Math.min(1.0, baseSimilarity + boostFactor);
}

// Extract relevant sections from knowledge base
function extractRelevantSections(knowledgeBase, query, threshold = 0.08) {
  const sections = knowledgeBase.split(/#{1,3}\s+/);
  const relevantSections = [];

  // Also split by major topic breaks for better granularity
  const allSections = [];
  sections.forEach((section) => {
    // Split large sections by FAQ patterns
    const faqSplit = section.split(/\n\*\*Q:/);
    allSections.push(...faqSplit);
  });

  for (const section of allSections) {
    if (section.trim().length > 30) {
      // Skip very short sections
      const similarity = calculateSimilarity(section, query);
      if (similarity > threshold) {
        relevantSections.push({
          content: section.trim(),
          similarity: similarity,
        });
      }
    }
  }

  // Sort by relevance and return top 3 sections
  return relevantSections
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map((section) => section.content);
}

// Advanced keyword matching for better search
function findKeywordMatches(knowledgeBase, query) {
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);
  const lines = knowledgeBase.split("\n");
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const keywordMatches = keywords.filter((keyword) => line.includes(keyword));

    if (keywordMatches.length > 0) {
      // Include more context for better answers
      const contextStart = Math.max(0, i - 2);
      const contextEnd = Math.min(lines.length - 1, i + 3);
      const context = lines.slice(contextStart, contextEnd + 1).join("\n");

      matches.push({
        content: context.trim(),
        relevance: keywordMatches.length / keywords.length,
        matchedKeywords: keywordMatches,
        lineNumber: i,
      });
    }
  }

  // Remove duplicates and sort by relevance
  const uniqueMatches = matches
    .filter(
      (match, index, self) =>
        index ===
        self.findIndex((m) => Math.abs(m.lineNumber - match.lineNumber) < 3)
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  return uniqueMatches.map((match) => match.content);
}

// Main RAG search function
export const searchKnowledgeBase = async (query) => {
  try {
    // Load knowledge base
    const knowledgeBasePath = path.join(process.cwd(), "knowledge-base.md");
    const knowledgeBase = fs.readFileSync(knowledgeBasePath, "utf8");

    // Try multiple search strategies
    const keywordMatches = findKeywordMatches(knowledgeBase, query);
    const sectionMatches = extractRelevantSections(knowledgeBase, query);

    // Combine and deduplicate results
    const allMatches = [...keywordMatches, ...sectionMatches];
    const uniqueMatches = [...new Set(allMatches)];

    if (uniqueMatches.length > 0) {
      return {
        found: true,
        content: uniqueMatches.slice(0, 3), // Top 3 most relevant sections
        source: "knowledge_base",
      };
    }

    return {
      found: false,
      content: [],
      source: "knowledge_base",
    };
  } catch (error) {
    console.error("RAG: Error searching knowledge base:", error);
    return {
      found: false,
      content: [],
      source: "knowledge_base",
      error: error.message,
    };
  }
};

// Generate response from knowledge base content
export const generateRAGResponse = (searchResults, originalQuery) => {
  if (!searchResults.found || searchResults.content.length === 0) {
    return null;
  }

  const queryLower = originalQuery.toLowerCase();
  
  // Check if this is a non-platform query that we should redirect
  if (!shouldProvidePlatformGuidance(originalQuery)) {
    return `I'm specifically designed to help with Lift for Upliftment's NEET preparation programs and platform features. For general questions like "${originalQuery}", I'd recommend using a general search engine. 

However, I can help you with:
• NEET preparation guidance and study tips
• Information about our volunteer tutoring programs  
• Details about free NEET coaching and resources
• How to register for our programs or donate
• Technical support for our platform features

How can I assist you with your NEET preparation or our platform today?`;
  }

  // Limit content for more focused responses
  const relevantContent = searchResults.content.slice(0, 2).join("\n\n");

  // Start with a contextual introduction
  let response = "";
  
  if (queryLower.includes("neet") || queryLower.includes("exam") || queryLower.includes("preparation")) {
    response = "🎯 **NEET Preparation Information:**\n\n";
  } else if (queryLower.includes("volunteer") || queryLower.includes("tutor")) {
    response = "👩‍🏫 **Volunteer Tutoring Information:**\n\n";
  } else if (queryLower.includes("donation") || queryLower.includes("donate")) {
    response = "💝 **Donation Information:**\n\n";
  } else if (queryLower.includes("register") || queryLower.includes("admission")) {
    response = "📝 **Registration Information:**\n\n";
  } else if (queryLower.includes("contact") || queryLower.includes("support")) {
    response = "📞 **Contact & Support Information:**\n\n";
  } else {
    response = "ℹ️ **Information about Lift for Upliftment:**\n\n";
  }

  // Clean up and format the content more effectively
  const cleanContent = relevantContent
    .replace(/#{1,4}\s*/g, "") // Remove markdown headers
    .replace(/\*\*Q:\s*/g, "**Q:** ") // Better FAQ formatting
    .replace(/\*\*A:\s*/g, "**A:** ")
    .replace(/\*\*(.*?)\*\*/g, "**$1**") // Keep important bold text
    .replace(/- /g, "• ") // Convert dashes to bullets
    .replace(/\n{3,}/g, "\n\n") // Remove excessive line breaks
    .split('\n')
    .filter(line => line.trim().length > 10) // Remove very short/empty lines
    .slice(0, 8) // Limit to 8 lines for conciseness
    .join('\n')
    .trim();

  response += cleanContent;

  // Add specific, actionable closing based on query type
  if (queryLower.includes("register") || queryLower.includes("admission") || queryLower.includes("join")) {
    response += "\n\n✅ **Next Step:** Visit our center at Camp, Pune or call +91-20-2612-XXXX to start your registration process!";
  } else if (queryLower.includes("volunteer") || queryLower.includes("tutor") || queryLower.includes("teach")) {
    response += "\n\n🌟 **Ready to Help Students?** Contact volunteer@liftforupliftment.org or attend our monthly volunteer meet (first Saturday of every month)!";
  } else if (queryLower.includes("donate") || queryLower.includes("donation") || queryLower.includes("support financially")) {
    response += "\n\n❤️ **Make a Difference:** Every donation helps a student achieve their medical career dream. Donations are 80G tax-exempt!";
  } else if (queryLower.includes("neet") || queryLower.includes("study") || queryLower.includes("exam") || queryLower.includes("preparation")) {
    response += "\n\n📚 **Success Tip:** Consistent daily practice with our 15,000+ question bank can improve your NEET score by an average of 180 marks!";
  } else if (queryLower.includes("app") || queryLower.includes("mobile") || queryLower.includes("online")) {
    response += "\n\n📱 **Tech Support:** Download 'Lift Learning' app for 24/7 access to lectures and practice tests!";
  } else {
    response += "\n\n💬 **Need More Help?** Contact us at info@liftforupliftment.org or use our 24/7 WhatsApp support during exam season!";
  }

  return response;
};

// Check if query should be handled by RAG or OpenAI
export const shouldUseRAG = (query) => {
  const queryLower = query.toLowerCase();
  
  // High priority platform-specific keywords (always use RAG)
  const highPriorityKeywords = [
    "lift for upliftment", "lfu", "neet", "medical", "exam", "preparation", 
    "volunteer", "tutor", "mentor", "donation", "register", "admission",
    "study", "coaching", "center", "pune", "maharashtra", "scholarship",
    "mock test", "biology", "physics", "chemistry", "score", "qualifying",
    "fees", "free", "course", "student", "teacher", "learning"
  ];

  // Medium priority keywords (likely platform-related)
  const mediumPriorityKeywords = [
    "event", "login", "profile", "dashboard", "post", "announcement",
    "vote", "star", "leaderboard", "payment", "razorpay", "avatar",
    "feedback", "support", "platform", "account", "how to", "what is",
    "where can", "help", "contact", "mobile app", "website"
  ];

  // Educational and academic keywords
  const educationalKeywords = [
    "education", "academic", "syllabus", "curriculum", "textbook",
    "lecture", "class", "session", "workshop", "seminar", "guidance",
    "counseling", "career", "future", "goal", "dream", "aspiration"
  ];

  // Check high priority first
  const hasHighPriority = highPriorityKeywords.some(keyword => 
    queryLower.includes(keyword)
  );
  
  if (hasHighPriority) {
    return true;
  }

  // Check if query mentions our organization or NEET specifically
  const mentionsOrganization = queryLower.includes("lift") || 
                               queryLower.includes("upliftment") ||
                               queryLower.includes("ngo") ||
                               queryLower.includes("organization");
  
  if (mentionsOrganization) {
    return true;
  }

  // Check medium priority keywords (need at least 2 matches for non-platform queries)
  const mediumMatches = mediumPriorityKeywords.filter(keyword => 
    queryLower.includes(keyword)
  ).length;

  const educationalMatches = educationalKeywords.filter(keyword =>
    queryLower.includes(keyword)
  ).length;

  // Use RAG if we have good keyword matches or educational context
  return mediumMatches >= 1 || educationalMatches >= 1;
};

// Enhanced function to determine if we should provide a platform-focused response
export const shouldProvidePlatformGuidance = (query) => {
  const queryLower = query.toLowerCase();
  
  // Questions that should always redirect to platform features
  const platformRedirectQueries = [
    "weather", "news", "stock", "sports", "entertainment", "politics",
    "recipe", "cooking", "travel", "shopping", "fashion", "celebrity",
    "movie", "music", "game", "joke", "story", "poem", "philosophy",
    "general knowledge", "trivia", "history", "geography", "science fact"
  ];

  const hasNonPlatformQuery = platformRedirectQueries.some(term => 
    queryLower.includes(term)
  );

  return !hasNonPlatformQuery;
};
