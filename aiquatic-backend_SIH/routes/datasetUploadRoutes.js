import express from "express";
import {
  createDatasetUpload,
  getDatasetUploads,
  getDatasetUploadById,
  deleteDatasetUpload,
} from "../controllers/datasetUploadController.js";

const router = express.Router();

router.post("/", createDatasetUpload);
router.get("/", getDatasetUploads);
router.get("/:id", getDatasetUploadById);
router.delete("/:id", deleteDatasetUpload);

export default router;
