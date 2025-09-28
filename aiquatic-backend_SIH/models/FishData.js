import mongoose from "mongoose";

const fishDataSchema = new mongoose.Schema({
  eventID: { type: String, required: true }, // Keep this required as we generate it
  taxonID: { type: String, required: false, default: null },
  scientificName: { type: String, required: false, default: null },
  vernacularName: { type: String, required: false, default: null },
  Phylum: { type: String, required: false, default: null },
  Class: { type: String, required: false, default: null },
  Order: { type: String, required: false, default: null },
  Family: { type: String, required: false, default: null },
  Genus: { type: String, required: false, default: null },
  Species: { type: String, required: false, default: null },
  organismQuantity: { type: Number, required: false, default: null },
}, {
  timestamps: true // Add created/updated timestamps
});

export default mongoose.model("FishData", fishDataSchema);
