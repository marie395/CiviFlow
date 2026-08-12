import express from "express";
import { createStaffUser, listUsers, toggleUserStatus } from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, authorize("admin"), createStaffUser);
router.get("/", protect, authorize("authority", "admin"), listUsers);
router.patch("/:id/status", protect, authorize("admin"), toggleUserStatus);

export default router;
