// server/routes/UploadRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(process.cwd(), "public", "images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// disk storage with server-generated unique filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const filename = `${Date.now()}-${Math.round(Math.random()*1e6)}-${base}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// NOTE: router handles POST to "/" (not "/upload") so it can be mounted at multiple paths.
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const filename = req.file.filename;
    const url = `/images/${filename}`;
    return res.status(200).json({ filename, url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
