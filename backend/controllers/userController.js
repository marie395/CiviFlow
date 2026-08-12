import asyncHandler from "express-async-handler";
import User from "../models/User.js";

export const createStaffUser = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, department } = req.body;

  if (!["agent", "authority", "admin"].includes(role)) {
    res.status(400);
    throw new Error("Rôle invalide pour un compte du personnel");
  }

  const existing = await User.findOne({ email: email?.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Un compte existe déjà avec cet email");
  }

  const user = await User.create({ fullName, email, phone, password, role, department });
  res.status(201).json({ user: user.toSafeObject() });
});

export const listUsers = asyncHandler(async (req, res) => {
  const { role, department } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (department) filter.department = department;
  const users = await User.find(filter).populate("department", "name").sort("fullName");
  res.json({ users });
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("Utilisateur introuvable");
  }
  user.isActive = req.body.isActive;
  await user.save();
  res.json({ user: user.toSafeObject() });
});
