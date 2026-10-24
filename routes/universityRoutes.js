import { Router } from "express";
import University from "../models/University.js";
const router = Router();
const samples = [
  {
    name: "Northstar Institute of Technology",
    location: "Bengaluru, Karnataka",
    tuition: 180000,
    living: 110000,
    other: 25000,
    scholarship: 30000,
    eligibility: "12th with 75% + entrance score",
    deadline: "2026-11-15",
    course: "Computer Science",
    rating: 4.7,
  },
  {
    name: "Riverdale University",
    location: "Pune, Maharashtra",
    tuition: 150000,
    living: 95000,
    other: 22000,
    scholarship: 20000,
    eligibility: "12th with 70% aggregate",
    deadline: "2026-12-02",
    course: "Computer Science",
    rating: 4.4,
  },
  {
    name: "Coastal School of Engineering",
    location: "Visakhapatnam, Andhra Pradesh",
    tuition: 125000,
    living: 85000,
    other: 18000,
    scholarship: 15000,
    eligibility: "12th with Mathematics and 65%",
    deadline: "2026-11-08",
    course: "Computer Science",
    rating: 4.2,
  },
  {
    name: "Summit Global College",
    location: "Hyderabad, Telangana",
    tuition: 210000,
    living: 105000,
    other: 30000,
    scholarship: 40000,
    eligibility: "12th with 80% aggregate",
    deadline: "2026-12-18",
    course: "Computer Science",
    rating: 4.8,
  },
  {
    name: "Greenfield University",
    location: "Chennai, Tamil Nadu",
    tuition: 135000,
    living: 90000,
    other: 20000,
    scholarship: 10000,
    eligibility: "12th with 65% aggregate",
    deadline: "2027-01-05",
    course: "Computer Science",
    rating: 4.1,
  },
  {
    name: "Pioneer Technical University",
    location: "Mysuru, Karnataka",
    tuition: 165000,
    living: 80000,
    other: 21000,
    scholarship: 25000,
    eligibility: "12th with 70% + mathematics",
    deadline: "2026-11-28",
    course: "Computer Science",
    rating: 4.3,
  },
];
router.get("/", async (req, res, next) => {
  try {
    let rows = await University.find().sort({ name: 1 });
    if (!rows.length)
      rows = samples.map((u, i) => ({
        ...u,
        _id: `demo-${i + 1}`,
        source: "Demo data",
      }));
    res.json(rows);
  } catch (e) {
    next(e);
  }
});
router.post("/", async (req, res, next) => {
  try {
    const row = await University.create({
      ...req.body,
      source: req.body.source || "User provided",
    });
    res.status(201).json(row);
  } catch (e) {
    next(e);
  }
});
export default router;
