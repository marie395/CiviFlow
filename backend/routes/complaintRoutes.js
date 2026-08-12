import express from "express";
import {
  createComplaint,
  getMyComplaints,
  trackByTicket,
  getPublicComplaints,
  getComplaintsForAuthority,
  getComplaintById,
  assignComplaint,
  updateStatus,
  respondToComplaint,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/public", getPublicComplaints);
router.get("/track/:ticketNumber", trackByTicket);

router.post("/", protect, upload.array("evidence", 5), createComplaint);
router.get("/mine", protect, getMyComplaints);

router.get("/", protect, authorize("agent", "authority", "admin"), getComplaintsForAuthority);
router.patch("/:id/assign", protect, authorize("authority", "admin"), assignComplaint);
router.patch("/:id/status", protect, authorize("agent", "authority", "admin"), updateStatus);
router.post("/:id/response", protect, authorize("agent", "authority", "admin"), respondToComplaint);

router.get("/:id", protect, getComplaintById);

export default router;
