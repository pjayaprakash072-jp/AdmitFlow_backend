import mongoose from "mongoose";
const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    university: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
    universityName: { type: String, required: true },
    universityId: { type: String },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Submitted", "Correction Required"],
      default: "Not Started",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true },
);
export default mongoose.model("Application", applicationSchema);
