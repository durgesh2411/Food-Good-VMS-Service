import { generateAIResponse } from "../utils/openai.js";

export const getAIReply = async (req, res) => {
  try {
    const { message } = req.body;
    const reply = await generateAIResponse(message);
    res.json({ success: true, reply });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
