import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Document from "../models/Document.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ["application/pdf", "image/jpeg", "image/png"].includes(
      file.mimetype,
    );
    cb(
      ok ? null : new Error("Blocked: only PDF, JPG and PNG files are allowed"),
      ok,
    );
  },
});
router.get("/", async (req, res, next) => {
  try {
    res.json(
      await Document.find({ user: req.user._id }).sort({ createdAt: -1 }),
    );
  } catch (e) {
    next(e);
  }
});
router.post("/", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Choose a file first" });
    const { universityId, documentType } = req.body;
    if (!universityId || !documentType)
      return res
        .status(400)
        .json({ message: "Target university and document type are required" });
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    )
      return res
        .status(503)
        .json({
          message:
            "Cloudinary is not configured. Add credentials to backend/.env",
        });
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: `admitflow/${req.user._id}`,
          use_filename: false,
          unique_filename: true,
        },
        (err, data) => (err ? reject(err) : resolve(data)),
      );
      stream.end(req.file.buffer);
    });
    const doc = await Document.create({
      user: req.user._id,
      universityId,
      documentType,
      originalName: req.file.originalname,
      fileUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
    res.status(201).json(doc);
  } catch (e) {
    next(e);
  }
});
router.patch("/:id/status", async (req, res, next) => {
  try {
    if (
      !["Uploaded", "Correction Required", "Verified"].includes(req.body.status)
    )
      return res.status(400).json({ message: "Invalid document status" });
    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status },
      { new: true },
    );
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});
export default router;
