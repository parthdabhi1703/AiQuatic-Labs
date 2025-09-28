import mongoose from "mongoose";

const fishDataSchema = new mongoose.Schema({
  eventID: { type: String, required: true },
  taxonID: { type: String },
  scientificName: { type: String, required: true },
  vernacularName: { type: String },
  Phylum: { type: String },
  Class: { type: String },
  Order: { type: String },
  Family: { type: String },
  Genus: { type: String },
  Species: { type: String },
  organismQuantity: { type: Number, required: true },
});

export default mongoose.model("FishData", fishDataSchema);
