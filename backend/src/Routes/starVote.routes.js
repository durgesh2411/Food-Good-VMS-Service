import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  castStarVote,
  getVolunteerStarVotes,
  getAllVolunteersWithVotes,
  removeStarVote,
  checkUserVote,
} from "../Controllers/starVote.controller.js";

const router = Router();
router.use(verifyJWT); // All routes require authentication

// Cast a star vote for a volunteer (POST /star-votes)
router.route("/").post(castStarVote);

// Get all volunteers with their vote counts (GET /star-votes/volunteers)
router.route("/volunteers").get(getAllVolunteersWithVotes);

// Get votes for a specific volunteer (GET /star-votes/volunteer/:volunteerId)
router.route("/volunteer/:volunteerId").get(getVolunteerStarVotes);

// Check if current user voted for a volunteer (GET /star-votes/check/:volunteerId)
router.route("/check/:volunteerId").get(checkUserVote);

// Remove user's vote for a volunteer (DELETE /star-votes/:volunteerId)
router.route("/:volunteerId").delete(removeStarVote);

export default router;
