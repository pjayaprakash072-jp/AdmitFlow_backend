import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
const router = Router();
router.use(protect);
router.get("/summary", async (req, res, next) => {
  try {
    if (req.user.role !== "parent")
      return res
        .status(403)
        .json({ message: "Sign in with a parent account to view this page" });
    if (!req.user.linkedStudent)
      return res.json({
        applicationCount: 0,
        estimatedBudget: 0,
        sharingEnabled: false,
        linked: false,
      });
    const student = await User.findById(req.user.linkedStudent);
    if (!student || !student.parentSharingEnabled)
      return res
        .status(403)
        .json({ message: "The student has not enabled parent sharing" });
    const apps = await Application.find({ user: student._id }).select(
      "status deadline",
    );
    res.json({
      applicationCount: apps.length,
      estimatedBudget: 0,
      sharingEnabled: true,
      applications: apps.map((a) => ({
        status: a.status,
        deadline: a.deadline,
      })),
    });
  } catch (e) {
    next(e);
  }
});
router.patch("/sharing", async (req, res, next) => {
  try {
    if (req.user.role !== "student")
      return res
        .status(403)
        .json({ message: "Only student accounts can change parent sharing" });
    const enabled = Boolean(req.body.enabled);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { parentSharingEnabled: enabled },
      { new: true },
    );
    res.json({ enabled: user.parentSharingEnabled });
  } catch (e) {
    next(e);
  }
});
export default router;
