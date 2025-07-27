/**
 * Test script for Gemini AI with RAG system
 */

import { generateAIResponse } from './src/utils/gemini.js';

console.log("🧪 Testing Gemini + RAG System\n");

// Test queries
const testQueries = [
  {
    message: "How do I register for volunteering?",
    expected: "Should use RAG (local knowledge)"
  },
  {
    message: "What volunteer opportunities are available?",
    expected: "Should use RAG (local knowledge)"
  },
  {
    message: "Tell me a joke",
    expected: "Should use Gemini (general query)"
  },
  {
    message: "What's the weather like today?",
    expected: "Should use Gemini (general query)"
  }
];

// Test function
async function testGeminiRAG() {
  console.log("🔍 Testing Gemini + RAG Integration");
  console.log("=====================================\n");

  for (const test of testQueries) {
    console.log(`🔍 Query: "${test.message}"`);
    console.log(`Expected: ${test.expected}`);
    
    try {
      const startTime = Date.now();
      const response = await generateAIResponse(test.message, []);
      const endTime = Date.now();
      
      console.log(`✅ Response (${endTime - startTime}ms):`, 
        response.substring(0, 150) + "...");
      console.log("─────────────────────────────────────\n");
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      console.log("─────────────────────────────────────\n");
    }
  }
  
  console.log("✅ Test Complete!");
  console.log("==================");
  console.log("Benefits of Gemini + RAG:");
  console.log("• Much lower cost than OpenAI");
  console.log("• RAG handles platform questions for FREE");
  console.log("• Gemini handles general questions at low cost");
  console.log("• Better context understanding");
}

// Run tests
testGeminiRAG().catch(console.error);
