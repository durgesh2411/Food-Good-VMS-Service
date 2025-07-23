// filepath: backend/src/Routes/feedback.routes.js
import { Router } from "express";
import {
  createFeedback,
  getFeedbacks,
  deleteFeedback,
} from "../Controllers/feedback.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", createFeedback);
router.get("/", getFeedbacks);
router.delete("/:id", verifyJWT, deleteFeedback); // Admin only endpoint for dismissing feedback

export default router;
