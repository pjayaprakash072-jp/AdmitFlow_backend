import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import connectDB from "../config/db.js";

import authRoutes from "../routes/authRoutes.js";
import universityRoutes from "../routes/universityRoutes.js";
import applicationRoutes from "../routes/applicationRoutes.js";
import documentRoutes from "../routes/documentRoutes.js";
import notificationRoutes from "../routes/notificationRoutes.js";
import parentRoutes from "../routes/parentRoutes.js";

const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);

// JSON body parser
app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AdmitFlow API",
  });
});

// Connect to MongoDB before handling API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Authentication rate limiter
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  authRoutes,
);

// API routes
app.use("/api/universities", universityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/parent", parentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  const status =
    err.status || (err.name === "ValidationError" ? 400 : 500);

  res.status(status).json({
    message: err.message || "Server error",
  });
});

// Vercel serverless entry point — no app.listen()
export default app;
