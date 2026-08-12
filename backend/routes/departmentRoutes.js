import express from "express";
import { listDepartments, createDepartment, updateDepartment } from "../controllers/departmentController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listDepartments);
router.post("/", protect, authorize("admin"), createDepartment);
router.put("/:id", protect, authorize("admin"), updateDepartment);

export default router;
