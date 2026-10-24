import { Router } from "express";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.use(protect);
router.get("/", async (req, res, next) => {
  try {
    res.json(
      await Application.find({ user: req.user._id }).sort({ deadline: 1 }),
    );
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const { universityId, universityName, deadline } = req.body;
    if (!universityName || !deadline)
      return res
        .status(400)
        .json({ message: "University and deadline are required" });
    const row = await Application.create({
      user: req.user._id,
      universityId,
      universityName,
      deadline,
      status: "Not Started",
    });
    await Notification.create({
      user: req.user._id,
      title: "Application added",
      message: `${universityName} has been added to your tracker.`,
      type: "application",
    });
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
});
router.patch("/:id", async (req, res, next) => {
  try {
    const allowed = [
      "Not Started",
      "In Progress",
      "Submitted",
      "Correction Required",
    ];
    if (req.body.status && !allowed.includes(req.body.status))
      return res.status(400).json({ message: "Invalid status" });
    const row = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!row) return res.status(404).json({ message: "Application not found" });
    if (row.status === "Correction Required")
      await Notification.create({
        user: req.user._id,
        title: "Correction required",
        message: `Review the requested corrections for ${row.universityName}.`,
        type: "document",
      });
    res.json(row);
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const row = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!row) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application removed" });
  } catch (e) {
    next(e);
  }
});
export default router;
