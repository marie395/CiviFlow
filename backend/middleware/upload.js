import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const allowedTypes = /jpeg|jpg|png|webp|mp4|mov|avi|webm/;

const fileFilter = (req, file, cb) => {
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = /image|video/.test(file.mimetype);
  if (extValid && mimeValid) return cb(null, true);
  cb(new Error("Type de fichier non supporté. Formats acceptés : images (jpg, png, webp) et vidéos (mp4, mov, avi, webm)."));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024, files: 5 },
});
