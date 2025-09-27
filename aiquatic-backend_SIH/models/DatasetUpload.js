import mongoose from "mongoose";

const datasetUploadSchema = new mongoose.Schema({
  file_name: { type: String, required: true },
  file_type: { type: String, enum: ["CSV", "JSON"], required: true },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  upload_date: { type: Date, default: Date.now },
  mapped_to: { type: String, enum: ["fish_data", "ocean_data"], required: true },
});

export default mongoose.model("DatasetUpload", datasetUploadSchema);
