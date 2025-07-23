import express from "express";
const router = express.Router();
import { getAIReply } from "../Controllers/genAI.controller.js";

router.post("/chat", getAIReply);

export default router;
