import asyncHandler from "express-async-handler";
import Department from "../models/Department.js";

export const listDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().sort("name");
  res.json({ departments });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const department = await Department.create(req.body);
  res.status(201).json({ department });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!department) {
    res.status(404);
    throw new Error("Service introuvable");
  }
  res.json({ department });
});