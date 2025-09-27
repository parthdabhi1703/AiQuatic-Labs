import express from "express";
import {
  createOceanData,
  getOceanData,
  getOceanDataById,
  updateOceanData,
  deleteOceanData,
} from "../controllers/oceanDataController.js";

const router = express.Router();

router.post("/", createOceanData);
router.get("/", getOceanData);
router.get("/:id", getOceanDataById);
router.put("/:id", updateOceanData);
router.delete("/:id", deleteOceanData);

export default router;
