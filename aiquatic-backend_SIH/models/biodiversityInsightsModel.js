import mongoose from "mongoose";

const biodiversityInsightsSchema = new mongoose.Schema({
  species_id: { type: mongoose.Schema.Types.ObjectId, ref: "FishData" },
  ocean_id: { type: mongoose.Schema.Types.ObjectId, ref: "OceanData" },
  abundance_index: Number,
  migration_pattern: String,
  anomaly_detected: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model("BiodiversityInsights", biodiversityInsightsSchema);
