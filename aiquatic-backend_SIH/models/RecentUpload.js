import mongoose from "mongoose";

const recentUploadSchema = new mongoose.Schema({
  originalFilename: { type: String, required: true },
  cleanedFilename: { type: String, required: true },
  dataType: { type: String, enum: ["ocean", "fish", "edna", "otolith"], required: true },
  recordsProcessed: { type: Number, required: true },
  recordsSaved: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  filePath: { type: String, required: true }, // Path to the cleaned file
});

export default mongoose.model("RecentUpload", recentUploadSchema);