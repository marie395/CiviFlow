import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import validator from "validator";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !phone || !password) {
    res.status(400);
    throw new Error("Tous les champs sont obligatoires (nom, email, téléphone, mot de passe)");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Adresse email invalide");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Le mot de passe doit contenir au moins 6 caractères");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("Un compte existe déjà avec cet email");
  }

  const user = await User.create({ fullName, email, phone, password, role: "citizen" });

  res.status(201).json({
    user: user.toSafeObject(),
    token: signToken(user._id),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email?.toLowerCase() }).select("+password").populate("department", "name");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Email ou mot de passe incorrect");
  }
  if (!user.isActive) {
    res.status(403);
    throw new Error("Ce compte a été désactivé. Contactez l'administrateur.");
  }

  res.json({
    user: user.toSafeObject(),
    token: signToken(user._id),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("department", "name");
  res.json({ user });
});

export const updateNotificationPreferences = asyncHandler(async (req, res) => {
  const { email, sms } = req.body;
  const user = await User.findById(req.user._id);
  if (email !== undefined) user.notificationPreferences.email = email;
  if (sms !== undefined) user.notificationPreferences.sms = sms;
  await user.save();
  res.json({ user: user.toSafeObject() });
});
