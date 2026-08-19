import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";

// Charger les variables d'environnement
dotenv.config();

// Initialisation de l'application
const app = express();

// Configuration de __dirname avec ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// CONFIGURATION CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://civi-flow.vercel.app",
  "https://civi-flow-52v0xmxiq-rooswell-s-projects.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autoriser les requêtes sans origine
      // (Postman, requêtes serveur à serveur, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origine non autorisée par CORS : ${origin}`));
    },
    credentials: true,
  })
);

// =====================================================
// MIDDLEWARES
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan uniquement en développement
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// =====================================================
// LIMITATION DES REQUÊTES API
// =====================================================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// =====================================================
// FICHIERS UPLOADÉS
// =====================================================

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =====================================================
// ROUTE PRINCIPALE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API du système de gestion des plaintes opérationnelle",
    status: "OK",
    version: "1.0.0",
  });
});

// =====================================================
// ROUTE DE SANTÉ
// =====================================================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Serveur opérationnel",
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// ROUTES API
// =====================================================

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/users", userRoutes);

app.use("/api/departments", departmentRoutes);

// =====================================================
// GESTION DES ROUTES INEXISTANTES
// =====================================================

app.use(notFound);

// =====================================================
// GESTION GLOBALE DES ERREURS
// =====================================================

app.use(errorHandler);

// =====================================================
// DÉMARRAGE DU SERVEUR
// =====================================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `🚀 Serveur démarré sur le port ${
          PORT
        } (${process.env.NODE_ENV || "development"})`
      );
    });
  } catch (error) {
    console.error(
      "❌ Impossible de démarrer le serveur :",
      error.message
    );

    process.exit(1);
  }
};

startServer();