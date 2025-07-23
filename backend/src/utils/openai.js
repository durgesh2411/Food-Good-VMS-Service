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

export const generateAIResponse = async (message) => {
  if (!openai) {
    throw new Error(
      "OpenAI is not configured. Please set OPENAI_API_KEY environment variable."
    );
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message.content;
};
