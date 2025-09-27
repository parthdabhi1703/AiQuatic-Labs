import OceanData from "../models/OceanData.js";

export const createOceanData = async (req, res) => {
  try {
    const newData = await OceanData.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOceanData = async (req, res) => {
  try {
    const data = await OceanData.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getOceanDataById = async (req, res) => {
  try {
    const data = await OceanData.findById(req.params.id);
    if (!data) return res.status(404).json({ message: "Ocean Data not found" });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOceanData = async (req, res) => {
  try {
    const updated = await OceanData.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Ocean Data not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteOceanData = async (req, res) => {
  try {
    const deleted = await OceanData.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ocean Data not found" });
    res.status(200).json({ message: "Ocean Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
