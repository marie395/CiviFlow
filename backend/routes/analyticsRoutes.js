import express from "express";
import { getSummary, getMonthlyTrend } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/summary", protect, authorize("agent", "authority", "admin"), getSummary);
router.get("/trend", protect, authorize("agent", "authority", "admin"), getMonthlyTrend);

export default router;
