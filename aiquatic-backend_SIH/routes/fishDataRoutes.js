import express from "express";
import {
  createFishData,
  getFishData,
  getFishDataById,
  updateFishData,
  deleteFishData,
} from "../controllers/fishDataController.js";

const router = express.Router();

router.post("/", createFishData);
router.get("/", getFishData);
router.get("/:id", getFishDataById);
router.put("/:id", updateFishData);
router.delete("/:id", deleteFishData);

export default router;
