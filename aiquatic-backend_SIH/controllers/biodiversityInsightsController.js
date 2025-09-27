import BiodiversityInsights from "../models/biodiversityInsightsModel.js";

// Get all insights
export const getAllInsights = async (req, res) => {
  try {
    const insights = await BiodiversityInsights.find()
      .populate("species_id")
      .populate("ocean_id");
    res.json(insights);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new insight
export const addInsight = async (req, res) => {
  try {
    const insight = new BiodiversityInsights(req.body);
    const saved = await insight.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get insight by ID
export const getInsightById = async (req, res) => {
  try {
    const insight = await BiodiversityInsights.findById(req.params.id)
      .populate("species_id")
      .populate("ocean_id");
    res.json(insight);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
