import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  approveVolunteerWork,
  createVolunteerWork,
  deleteVolunteerWork,
  getAllPendingVolunteerWorks,
  getAllVolunteerWorks,
  getVolunteersWithHours,
  updateVolunteerWork,
} from "../Controllers/volunteerWork.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT); // All routes require authentication

// Create new volunteer work
router
  .route("/")
  .post(
    upload.fields([{ name: "workFile", maxCount: 1 }]),
    createVolunteerWork
  );

// Admin routes
router.route("/admin/").get(getAllVolunteerWorks);
router
  .route("/admin/approvedVolunteerWorkWithHours")
  .get(getVolunteersWithHours);
router.route("/admin/volunteerPendingWorks").get(getAllPendingVolunteerWorks);
router.route("/admin/:volunteerWorkId").patch(approveVolunteerWork);

// Update and delete volunteer work
router
  .route("/:volunteerWorkId")
  .patch(
    upload.fields([{ name: "workFile", maxCount: 1 }]),
    updateVolunteerWork
  )
  .delete(deleteVolunteerWork);

export default router;
