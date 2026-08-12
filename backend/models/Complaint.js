import mongoose from "mongoose";

const STATUS_FLOW = ["Soumise", "En cours d'examen", "En traitement", "Résolue", "Rejetée"];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: STATUS_FLOW, required: true },
    note: { type: String, trim: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true, index: true },
    citizen: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 3000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Voirie & Routes",
        "Eau & Assainissement",
        "Électricité",
        "Santé Publique",
        "Sécurité",
        "Éducation",
        "Transport Public",
        "Environnement & Déchets",
        "Corruption & Ethique",
        "Autre",
      ],
    },
    location: {
      address: { type: String, trim: true },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    evidence: [
      {
        url: { type: String, required: true },
        fileType: { type: String, enum: ["image", "video"], required: true },
        originalName: String,
      },
    ],
    status: { type: String, enum: STATUS_FLOW, default: "Soumise" },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: "Soumise" }],
    },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    response: {
      text: { type: String, trim: true },
      respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      respondedAt: { type: Date },
    },
    isPublic: { type: Boolean, default: true },
    priority: { type: String, enum: ["Basse", "Normale", "Haute", "Critique"], default: "Normale" },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.virtual("resolutionTimeHours").get(function () {
  if (!this.resolvedAt) return null;
  return Math.round((this.resolvedAt - this.createdAt) / 36e5);
});
complaintSchema.set("toJSON", { virtuals: true });
complaintSchema.set("toObject", { virtuals: true });

complaintSchema.index({ category: 1, status: 1 });
complaintSchema.index({ "location.latitude": 1, "location.longitude": 1 });

export const STATUS_ENUM = STATUS_FLOW;
export default mongoose.model("Complaint", complaintSchema);