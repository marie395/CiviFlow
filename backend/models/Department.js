import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    categories: [
      {
        type: String,
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
    ],
    contactEmail: { type: String, trim: true },
    contactPhone: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("Department", departmentSchema);
