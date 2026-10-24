import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import universityRoutes from "./routes/universityRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import parentRoutes from "./routes/parentRoutes.js";
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get('/',(req,res)=>{
    res.send("Welcome to AdmitFlow!")
})
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
app.use("/api/universities", universityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/parent", parentRoutes);
app.get("/api/health", (req, res) =>
  res.json({ status: "ok", app: "AdmitFlow API" }),
);
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || (err.name === "ValidationError" ? 400 : 500);
  res.status(status).json({ message: err.message || "Server error" });
});
const port = process.env.PORT || 5000;
connectDB()
  .then(() =>
    app.listen(port, () => console.log(`AdmitFlow API listening on ${port}`)),
  )
  .catch((err) => {
    console.error("Startup failed:", err.message);
    process.exit(1);
  });
