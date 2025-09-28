import mongoose from "mongoose";

const oceanDataSchema = new mongoose.Schema({
  eventID: { type: String, required: true }, // Keep this required as we generate it
  temperature_C: { type: Number, required: false, default: null },
  DepthInMeters: { type: Number, required: false, default: null },
  decimalLatitude: { type: Number, required: false, default: null },
  decimalLongitude: { type: Number, required: false, default: null },
  sea_water_salinity: { type: Number, required: false, default: null },
  oxygen_concentration_mgL: { type: Number, required: false, default: null },
  sea_water_velocity: { type: Number, required: false, default: null },
  eventDate: { type: Date, required: false, default: null },
}, {
  timestamps: true // Add created/updated timestamps
});

export default mongoose.model("OceanData", oceanDataSchema);
