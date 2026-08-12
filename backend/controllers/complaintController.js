import asyncHandler from "express-async-handler";
import Complaint, { STATUS_ENUM } from "../models/Complaint.js";
import Department from "../models/Department.js";
import User from "../models/User.js";
import { generateTicketNumber } from "../utils/generateTicket.js";
import { notifyStatusChange } from "../utils/notify.js";

const routeToDepartment = async (category) => {
  const department = await Department.findOne({ categories: category });
  return department ? department._id : null;
};

export const createComplaint = asyncHandler(async (req, res) => {
  const { title, description, category, address, latitude, longitude, isPublic } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error("Titre, description et catégorie sont obligatoires");
  }

  const ticketNumber = await generateTicketNumber();
  const department = await routeToDepartment(category);

  const evidence = (req.files || []).map((f) => ({
    url: `/uploads/${f.filename}`,
    fileType: f.mimetype.startsWith("video") ? "video" : "image",
    originalName: f.originalname,
  }));

  const complaint = await Complaint.create({
    ticketNumber,
    citizen: req.user._id,
    title,
    description,
    category,
    location: {
      address,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    },
    evidence,
    department,
    isPublic: isPublic === undefined ? true : isPublic === "true" || isPublic === true,
  });

  res.status(201).json({ complaint });
});

export const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ citizen: req.user._id })
    .sort("-createdAt")
    .populate("department", "name");
  res.json({ complaints });
});

export const trackByTicket = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findOne({ ticketNumber: req.params.ticketNumber })
    .populate("department", "name")
    .select("-citizen");

  if (!complaint) {
    res.status(404);
    throw new Error("Aucune plainte trouvée avec ce numéro de suivi");
  }
  res.json({ complaint });
});

export const getPublicComplaints = asyncHandler(async (req, res) => {
  const { category, status, page = 1, limit = 20 } = req.query;
  const filter = { isPublic: true };
  if (category) filter.category = category;
  if (status) filter.status = status;

  const complaints = await Complaint.find(filter)
    .select("ticketNumber title category status location.address createdAt resolvedAt priority")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Complaint.countDocuments(filter);

  res.json({ complaints, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getComplaintsForAuthority = asyncHandler(async (req, res) => {
  const { status, category, department, assignedAgent, page = 1, limit = 20 } = req.query;
  const filter = {};

  if (req.user.role === "agent" || req.user.role === "authority") {
    if (req.user.department) filter.department = req.user.department;
  }
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (department) filter.department = department;
  if (assignedAgent) filter.assignedAgent = assignedAgent;

  const complaints = await Complaint.find(filter)
    .populate("citizen", "fullName email phone")
    .populate("department", "name")
    .populate("assignedAgent", "fullName email")
    .sort("-createdAt")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Complaint.countDocuments(filter);
  res.json({ complaints, total, page: Number(page), pages: Math.ceil(total / limit) });
});

export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("citizen", "fullName email phone")
    .populate("department", "name")
    .populate("assignedAgent", "fullName email");

  if (!complaint) {
    res.status(404);
    throw new Error("Plainte introuvable");
  }

  const isOwner = complaint.citizen._id.toString() === req.user._id.toString();
  const isStaff = ["agent", "authority", "admin"].includes(req.user.role);
  if (!isOwner && !isStaff) {
    res.status(403);
    throw new Error("Accès refusé à cette plainte");
  }

  res.json({ complaint });
});

export const assignComplaint = asyncHandler(async (req, res) => {
  const { departmentId, agentId } = req.body;
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) {
    res.status(404);
    throw new Error("Plainte introuvable");
  }

  if (departmentId) complaint.department = departmentId;
  if (agentId) {
    const agent = await User.findById(agentId);
    if (!agent || !["agent", "authority"].includes(agent.role)) {
      res.status(400);
      throw new Error("Agent invalide");
    }
    complaint.assignedAgent = agentId;
  }

  await complaint.save();
  res.json({ complaint });
});

export const updateStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!STATUS_ENUM.includes(status)) {
    res.status(400);
    throw new Error(`Statut invalide. Valeurs autorisées : ${STATUS_ENUM.join(", ")}`);
  }

  const complaint = await Complaint.findById(req.params.id).populate("citizen");
  if (!complaint) {
    res.status(404);
    throw new Error("Plainte introuvable");
  }

  complaint.status = status;
  complaint.statusHistory.push({ status, note, changedBy: req.user._id });
  if (status === "Résolue") complaint.resolvedAt = new Date();

  await complaint.save();

  notifyStatusChange(complaint.citizen, complaint, status).catch((e) =>
    console.error("Erreur notification:", e.message)
  );

  res.json({ complaint });
});

export const respondToComplaint = asyncHandler(async (req, res) => {
  const { text, markResolved } = req.body;
  const complaint = await Complaint.findById(req.params.id).populate("citizen");
  if (!complaint) {
    res.status(404);
    throw new Error("Plainte introuvable");
  }

  complaint.response = { text, respondedBy: req.user._id, respondedAt: new Date() };

  if (markResolved) {
    complaint.status = "Résolue";
    complaint.resolvedAt = new Date();
    complaint.statusHistory.push({ status: "Résolue", note: text, changedBy: req.user._id });
    notifyStatusChange(complaint.citizen, complaint, "Résolue").catch((e) =>
      console.error("Erreur notification:", e.message)
    );
  }

  await complaint.save();
  res.json({ complaint });
});

