import express from "express";
import RecentUpload from "../models/RecentUpload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cleanedDirPath = path.join(__dirname, '..', 'cleaned_files');

// Get all recent uploads
router.get("/", async (req, res) => {
  try {
    const recentUploads = await RecentUpload.find()
      .sort({ uploadDate: -1 })
      .limit(20); // Limit to 20 most recent uploads
    
    res.json(recentUploads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get file data for visualization
router.get("/view/:id", async (req, res) => {
  try {
    const upload = await RecentUpload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    const filePath = path.join(cleanedDirPath, upload.cleanedFilename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Read and parse the CSV file
    const csvData = fs.readFileSync(filePath, 'utf8');
    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true
    });

    res.json({
      upload: upload,
      data: parsedData.data
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a recent upload record (optional)
router.delete("/:id", async (req, res) => {
  try {
    const upload = await RecentUpload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // Delete the file
    const filePath = path.join(cleanedDirPath, upload.cleanedFilename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete the record
    await RecentUpload.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Upload deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;