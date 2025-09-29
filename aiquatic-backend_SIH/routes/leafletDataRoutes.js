import express from 'express';
import { getLeafletData, getSampleLeafletData } from '../controllers/leafletDataController.js';

const router = express.Router();

// Route to get leaflet data for map display
router.get('/leaflet', getLeafletData);

// Route to get sample leaflet data (fallback)
router.get('/leaflet/sample', getSampleLeafletData);

export default router;