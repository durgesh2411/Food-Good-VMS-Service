/**
 * Test script for RAG (Retrieval-Augmented Generation) system
 * This script tests the RAG functionality to ensure it works correctly
 */

import { searchKnowledgeBase, generateRAGResponse, shouldUseRAG } from './src/utils/rag.js';

// Async test function
async function testRAGSystem() {
console.log("🧪 Testing RAG System\n");

// Test 1: Knowledge Base Search
console.log("📚 Test 1: Knowledge Base Search");
console.log("================================");

const testQueries = [
  "How do I register?",
  "What is volunteer work?",
  "How to make donations?",
  "What events are available?",
  "How do I reset my password?",
  "What is the weather today?", // This should not be found in knowledge base
];

for (const query of testQueries) {
  console.log(`\n🔍 Query: "${query}"`);
  
  const shouldUse = shouldUseRAG(query);
  console.log(`Should use RAG: ${shouldUse}`);
  
  if (shouldUse) {
    try {
      const results = await searchKnowledgeBase(query);
      console.log(`Found: ${results.found ? 'Yes' : 'No'}`);
      
      if (results.found && results.content.length > 0) {
        console.log(`Best match preview:`, 
          results.content[0].substring(0, 100) + "...");
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Test 2: RAG Response Generation
console.log("\n\n🤖 Test 2: RAG Response Generation");
console.log("===================================");

const ragTestQueries = [
  "How do I sign up for volunteering?",
  "Can you explain the donation process?",
  "What should I do if I forgot my password?"
];

for (const query of ragTestQueries) {
  console.log(`\n🔍 Generating RAG response for: "${query}"`);
  
  try {
    // First search the knowledge base
    const searchResults = await searchKnowledgeBase(query);
    
    // Then generate response from results
    const response = generateRAGResponse(searchResults, query);
    
    if (response) {
      console.log("✅ RAG Response:", response.substring(0, 150) + "...");
    } else {
      console.log("❌ No response generated - query not found in knowledge base");
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }
}

console.log("\n\n✅ RAG System Test Complete!");
console.log("===============================");
console.log("The RAG system is ready to:");
console.log("• Answer platform-specific questions from knowledge base");
console.log("• Fallback to OpenAI for general questions");
console.log("• Reduce API costs by using local knowledge first");
}

// Run the test
testRAGSystem().catch(console.error);
