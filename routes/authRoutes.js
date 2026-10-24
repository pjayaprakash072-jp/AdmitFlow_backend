import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = Router();
const tokenFor = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const safe = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  parentSharingEnabled: user.parentSharingEnabled,
});
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    if (password.length < 8)
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    if (!["student", "parent"].includes(role || "student"))
      return res.status(400).json({ message: "Invalid account type" });
    if (await User.exists({ email: email.toLowerCase() }))
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });
    res.status(201).json({ token: tokenFor(user), user: safe(user) });
  } catch (e) {
    next(e);
  }
});
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: String(req.body.email || "").toLowerCase(),
    }).select("+password");
    if (!user || !(await user.comparePassword(req.body.password || "")))
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    res.json({ token: tokenFor(user), user: safe(user) });
  } catch (e) {
    next(e);
  }
});
export default router;
