import DatasetUpload from "../models/DatasetUpload.js";

export const createDatasetUpload = async (req, res) => {
  try {
    const newUpload = await DatasetUpload.create(req.body);
    res.status(201).json(newUpload);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDatasetUploads = async (req, res) => {
  try {
    const uploads = await DatasetUpload.find().populate("uploaded_by", "name email");
    res.status(200).json(uploads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDatasetUploadById = async (req, res) => {
  try {
    const upload = await DatasetUpload.findById(req.params.id).populate("uploaded_by", "name email");
    if (!upload) return res.status(404).json({ message: "Dataset Upload not found" });
    res.status(200).json(upload);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDatasetUpload = async (req, res) => {
  try {
    const deleted = await DatasetUpload.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Dataset Upload not found" });
    res.status(200).json({ message: "Dataset Upload deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
