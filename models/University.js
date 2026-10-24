import mongoose from "mongoose";
const universitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    tuition: { type: Number, default: 0 },
    living: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    scholarship: { type: Number, default: 0 },
    eligibility: { type: String, default: "Confirm with university" },
    deadline: { type: Date },
    course: { type: String, default: "General" },
    rating: { type: Number, default: 0 },
    source: { type: String, default: "Demo data" },
    lastVerified: { type: Date },
  },
  { timestamps: true },
);
export default mongoose.model("University", universitySchema);
