import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple text similarity function using word overlap
function calculateSimilarity(text1, text2) {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  // Boost similarity for exact keyword matches
  const exactMatches = words1.filter(word => 
    word.length > 3 && words2.includes(word)
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
  sections.forEach(section => {
    // Split large sections by FAQ patterns
    const faqSplit = section.split(/\n\*\*Q:/);
    allSections.push(...faqSplit);
  });

  for (const section of allSections) {
    if (section.trim().length > 30) { // Skip very short sections
      const similarity = calculateSimilarity(section, query);
      if (similarity > threshold) {
        relevantSections.push({
          content: section.trim(),
          similarity: similarity
        });
      }
    }
  }

  // Sort by relevance and return top 3 sections
  return relevantSections
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(section => section.content);
}

// Advanced keyword matching for better search
function findKeywordMatches(knowledgeBase, query) {
  const keywords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
  const lines = knowledgeBase.split('\n');
  const matches = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const keywordMatches = keywords.filter(keyword => line.includes(keyword));
    
    if (keywordMatches.length > 0) {
      // Include more context for better answers
      const contextStart = Math.max(0, i - 2);
      const contextEnd = Math.min(lines.length - 1, i + 3);
      const context = lines.slice(contextStart, contextEnd + 1).join('\n');
      
      matches.push({
        content: context.trim(),
        relevance: keywordMatches.length / keywords.length,
        matchedKeywords: keywordMatches,
        lineNumber: i
      });
    }
  }

  // Remove duplicates and sort by relevance
  const uniqueMatches = matches
    .filter((match, index, self) => 
      index === self.findIndex(m => Math.abs(m.lineNumber - match.lineNumber) < 3)
    )
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  return uniqueMatches.map(match => match.content);
}

// Main RAG search function
export const searchKnowledgeBase = async (query) => {
  try {
    // Load knowledge base
    const knowledgeBasePath = path.join(process.cwd(), 'knowledge-base.md');
    const knowledgeBase = fs.readFileSync(knowledgeBasePath, 'utf8');

    console.log('🔍 RAG: Searching knowledge base for:', query);

    // Try multiple search strategies
    const keywordMatches = findKeywordMatches(knowledgeBase, query);
    const sectionMatches = extractRelevantSections(knowledgeBase, query);

    // Combine and deduplicate results
    const allMatches = [...keywordMatches, ...sectionMatches];
    const uniqueMatches = [...new Set(allMatches)];

    if (uniqueMatches.length > 0) {
      console.log('✅ RAG: Found relevant information in knowledge base');
      return {
        found: true,
        content: uniqueMatches.slice(0, 3), // Top 3 most relevant sections
        source: 'knowledge_base'
      };
    }

    console.log('❌ RAG: No relevant information found in knowledge base');
    return {
      found: false,
      content: [],
      source: 'knowledge_base'
    };

  } catch (error) {
    console.error('❌ RAG: Error searching knowledge base:', error);
    return {
      found: false,
      content: [],
      source: 'knowledge_base',
      error: error.message
    };
  }
};

// Generate response from knowledge base content
export const generateRAGResponse = (searchResults, originalQuery) => {
  if (!searchResults.found || searchResults.content.length === 0) {
    return null;
  }

  const relevantContent = searchResults.content.join('\n\n');
  
  // Create a more focused response based on query intent
  let response = "Based on our platform information:\n\n";
  
  // Clean up and format the content
  const cleanContent = relevantContent
    .replace(/#{1,4}\s*/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/- /g, '• ') // Convert dashes to bullets
    .replace(/\n{3,}/g, '\n\n') // Remove excessive line breaks
    .trim();

  response += cleanContent;
  
  // Add helpful closing based on query type
  const queryLower = originalQuery.toLowerCase();
  if (queryLower.includes('register') || queryLower.includes('sign up')) {
    response += "\n\n💡 Tip: Make sure to have a clear profile picture ready for upload during registration!";
  } else if (queryLower.includes('volunteer')) {
    response += "\n\n🌟 Ready to make a difference? Your volunteer journey starts with just one click!";
  } else if (queryLower.includes('donate') || queryLower.includes('donation')) {
    response += "\n\n❤️ Every donation, no matter the size, helps feed families in need.";
  } else {
    response += "\n\n💬 Need more help? Feel free to ask follow-up questions!";
  }
  
  return response;
};

// Check if query should be handled by RAG or OpenAI
export const shouldUseRAG = (query) => {
  // Keywords that suggest platform-specific questions
  const platformKeywords = [
    'volunteer', 'donation', 'event', 'register', 'login', 'profile',
    'dashboard', 'post', 'announcement', 'vote', 'star', 'leaderboard',
    'payment', 'razorpay', 'avatar', 'feedback', 'support', 'platform',
    'account', 'how to', 'what is', 'where can', 'food good', 'vms'
  ];

  const queryLower = query.toLowerCase();
  return platformKeywords.some(keyword => queryLower.includes(keyword));
};
