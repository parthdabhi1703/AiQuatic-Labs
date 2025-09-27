import express from "express";
import { getAllInsights, addInsight, getInsightById } from "../controllers/biodiversityInsightsController.js";

const router = express.Router();

router.get("/", getAllInsights);
router.post("/", addInsight);
router.get("/:id", getInsightById);

export default router;
