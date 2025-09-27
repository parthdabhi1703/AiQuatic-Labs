import mongoose from "mongoose";

const oceanDataSchema = new mongoose.Schema({
  eventID: { type: String, required: true },
  temperature_C: { type: Number, required: true },
  DepthInMeters: { type: Number, required: true },
  decimalLatitude: { type: Number, required: true },
  decimalLongitude: { type: Number, required: true },
  sea_water_salinity: { type: Number, required: true },
  oxygen_concentration_mgL: { type: Number, required: true },
  sea_water_velocity: { type: Number, required: true },
  eventDate: { type: Date, required: true },
});

export default mongoose.model("OceanData", oceanDataSchema);
