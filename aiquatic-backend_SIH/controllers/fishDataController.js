import FishData from "../models/FishData.js";

export const createFishData = async (req, res) => {
  try {
    const newData = await FishData.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getFishData = async (req, res) => {
  try {
    const data = await FishData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFishDataById = async (req, res) => {
  try {
    const data = await FishData.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Fish Data not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFishData = async (req, res) => {
  try {
    const updated = await FishData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Fish Data not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteFishData = async (req, res) => {
  try {
    const deleted = await FishData.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Fish Data not found" });
    res.status(200).json({ message: "Fish Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
