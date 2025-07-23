import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getAllApprovedPosts,
  getAllPendingPosts,
  getVolunteerPosts,
  updatePost,
  approvePost,
  rejectPost,
} from "../Controllers/post.controller.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPost);
router.route("/volunteer/allPosts").get(getAllApprovedPosts); // both volunteer and admin
router.route("/volunteer/myPosts").get(getVolunteerPosts); // both volunteer and admin
router.route("/admin/pending").get(getAllPendingPosts); // admin - match frontend
router.route("/admin/approved").get(getAllApprovedPosts); // admin - match frontend
router.route("/admin/:postId/approve").patch(approvePost); // admin approve - match frontend
router.route("/admin/:postId/reject").patch(rejectPost); // admin reject - match frontend
router.route("/:postId").patch(updatePost).delete(deletePost);

export default router;
