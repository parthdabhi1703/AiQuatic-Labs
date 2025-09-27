import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["scientist","engineer","admin"], default: "scientist" },
  organization: String,
  password: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
