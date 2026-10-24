import mongoose from "mongoose";
const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    universityId: { type: String, required: true },
    universityName: { type: String, default: "" },
    documentType: { type: String, required: true },
    originalName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Uploaded", "Correction Required", "Verified"],
      default: "Uploaded",
    },
    isPrivate: { type: Boolean, default: true },
  },
  { timestamps: true },
);
export default mongoose.model("Document", documentSchema);
