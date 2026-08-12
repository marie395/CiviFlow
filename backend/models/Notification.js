import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    complaint: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
    channel: { type: String, enum: ["email", "sms"], required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "sent", "failed"], default: "pending" },
    error: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
