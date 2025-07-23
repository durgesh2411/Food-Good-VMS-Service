// filepath: backend/src/Controllers/feedback.controller.js
import { Feedback } from "../models/feedback.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createFeedback = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res
      .status(400)
      .json({ success: false, message: "Message required" });
  }
  const feedback = await Feedback.create({ message });
  res.status(201).json(new ApiResponse(201, feedback, "Feedback submitted"));
});

export const getFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, feedbacks, "All feedbacks"));
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const feedback = await Feedback.findById(id);
  if (!feedback) {
    return res
      .status(404)
      .json({ success: false, message: "Feedback not found" });
  }

  await Feedback.findByIdAndDelete(id);
  res
    .status(200)
    .json(new ApiResponse(200, null, "Feedback dismissed successfully"));
});
