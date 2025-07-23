import { StarVote } from "../models/starVote.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

// Cast vote for a volunteer (only users can vote)
const castStarVote = asyncHandler(async (req, res) => {
  const { volunteerId, reason } = req.body;
  const voterId = req.user._id;

  // Validate volunteer ID
  if (!isValidObjectId(volunteerId)) {
    throw new ApiError(400, "Invalid volunteer ID");
  }

  // Check if voter is a regular user (not volunteer or admin)
  if (req.user.role !== "user") {
    throw new ApiError(403, "Only regular users can cast star votes");
  }

  // Check if volunteer exists and has volunteer role
  const volunteer = await User.findById(volunteerId);
  if (!volunteer) {
    throw new ApiError(404, "Volunteer not found");
  }

  if (volunteer.role !== "volunteer") {
    throw new ApiError(400, "You can only vote for volunteers");
  }

  // Check if user already voted for this volunteer
  const existingVote = await StarVote.findOne({
    voter: voterId,
    volunteer: volunteerId,
  });

  if (existingVote) {
    throw new ApiError(409, "You have already voted for this volunteer");
  }

  // Create the vote
  const vote = await StarVote.create({
    voter: voterId,
    volunteer: volunteerId,
    reason: reason || "",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, vote, "Star vote cast successfully"));
});

// Get total votes for a volunteer
const getVolunteerStarVotes = asyncHandler(async (req, res) => {
  const { volunteerId } = req.params;

  if (!isValidObjectId(volunteerId)) {
    throw new ApiError(400, "Invalid volunteer ID");
  }

  const totalVotes = await StarVote.countDocuments({ volunteer: volunteerId });

  const votes = await StarVote.find({ volunteer: volunteerId })
    .populate("voter", "fullName avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVotes,
        votes,
      },
      "Volunteer star votes fetched successfully"
    )
  );
});

// Get all volunteers with their star vote counts
const getAllVolunteersWithVotes = asyncHandler(async (req, res) => {
  const volunteers = await User.find({ role: "volunteer" }).select(
    "fullName avatar email"
  );

  const volunteersWithVotes = await Promise.all(
    volunteers.map(async (volunteer) => {
      const voteCount = await StarVote.countDocuments({
        volunteer: volunteer._id,
      });
      return {
        ...volunteer.toObject(),
        starVotes: voteCount,
      };
    })
  );

  // Sort by star votes
  volunteersWithVotes.sort((a, b) => b.starVotes - a.starVotes);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        volunteersWithVotes,
        "Volunteers with star votes fetched successfully"
      )
    );
});

// Remove vote (only the voter can remove their own vote)
const removeStarVote = asyncHandler(async (req, res) => {
  const { volunteerId } = req.params;
  const voterId = req.user._id;

  if (!isValidObjectId(volunteerId)) {
    throw new ApiError(400, "Invalid volunteer ID");
  }

  const vote = await StarVote.findOneAndDelete({
    voter: voterId,
    volunteer: volunteerId,
  });

  if (!vote) {
    throw new ApiError(
      404,
      "Vote not found or you haven't voted for this volunteer"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Star vote removed successfully"));
});

// Check if user has voted for a volunteer
const checkUserVote = asyncHandler(async (req, res) => {
  const { volunteerId } = req.params;
  const voterId = req.user._id;

  if (!isValidObjectId(volunteerId)) {
    throw new ApiError(400, "Invalid volunteer ID");
  }

  const vote = await StarVote.findOne({
    voter: voterId,
    volunteer: volunteerId,
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hasVoted: !!vote,
        vote: vote || null,
      },
      "Vote status checked successfully"
    )
  );
});

export {
  castStarVote,
  getVolunteerStarVotes,
  getAllVolunteersWithVotes,
  removeStarVote,
  checkUserVote,
};
