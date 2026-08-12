import express from "express";
import { register, login, getMe, updateNotificationPreferences } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/notification-preferences", protect, updateNotificationPreferences);

export default router;
