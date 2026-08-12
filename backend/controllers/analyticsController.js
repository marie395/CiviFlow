import asyncHandler from "express-async-handler";
import Complaint from "../models/Complaint.js";

export const getSummary = asyncHandler(async (req, res) => {
  const [total, byStatus, byCategory, byDepartment, resolutionStats] = await Promise.all([
    Complaint.countDocuments(),

    Complaint.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

    Complaint.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),

    Complaint.aggregate([
      { $match: { department: { $ne: null } } },
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          resolues: { $sum: { $cond: [{ $eq: ["$status", "Résolue"] }, 1, 0] } },
        },
      },
      { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } },
      { $unwind: "$dept" },
      { $project: { department: "$dept.name", total: 1, resolues: 1 } },
    ]),

    Complaint.aggregate([
      { $match: { resolvedAt: { $ne: null } } },
      {
        $project: {
          hours: { $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60] },
        },
      },
      { $group: { _id: null, avgHours: { $avg: "$hours" }, minHours: { $min: "$hours" }, maxHours: { $max: "$hours" } } },
    ]),
  ]);

  const resolvedCount = byStatus.find((s) => s._id === "Résolue")?.count || 0;
  const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0;

  res.json({
    total,
    resolutionRate,
    byStatus: byStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    byCategory,
    byDepartment,
    resolutionTime: resolutionStats[0]
      ? {
          averageHours: Math.round(resolutionStats[0].avgHours),
          minHours: Math.round(resolutionStats[0].minHours),
          maxHours: Math.round(resolutionStats[0].maxHours),
        }
      : null,
  });
});

export const getMonthlyTrend = asyncHandler(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);

  const submitted = await Complaint.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo } } },
    { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  const resolved = await Complaint.aggregate([
    { $match: { resolvedAt: { $gte: twelveMonthsAgo } } },
    { $group: { _id: { y: { $year: "$resolvedAt" }, m: { $month: "$resolvedAt" } }, count: { $sum: 1 } } },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  res.json({ submitted, resolved });
});
