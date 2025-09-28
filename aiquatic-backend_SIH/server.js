import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import OceanData from "./models/OceanData.js";
import RecentUpload from "./models/RecentUpload.js";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import oceanDataRoutes from "./routes/oceanDataRoutes.js";
import fishDataRoutes from "./routes/fishDataRoutes.js";
import datasetUploadRoutes from "./routes/datasetUploadRoutes.js";
import biodiversityInsightsRoutes from "./routes/biodiversityInsightsRoutes.js";
import recentUploadsRoutes from "./routes/recentUploadsRoutes.js";

dotenv.config();
const app = express();
connectDB();

// Setup for serving downloadable files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cleanedDirPath = path.join(__dirname, 'cleaned_files');
const uploadDirPath = path.join(__dirname, 'uploads');

// Ensure directories exist
try {
  fs.mkdirSync(cleanedDirPath, { recursive: true });
  fs.mkdirSync(uploadDirPath, { recursive: true });
  console.log('Directories created successfully');
} catch (error) {
  console.error('Error creating directories:', error);
}

// Route for DOWNLOADING files (as attachments)
app.use('/api/download', express.static(cleanedDirPath));

// --- [NEW] ROUTE FOR VIEWING FILES ---
// This route will serve the file and tell the browser to display it inline.
app.get('/api/view/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(cleanedDirPath, filename);

    // Security: Check if file exists to avoid errors
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Type', 'text/csv');
        // 'inline' tells the browser to try and display it, not download it
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.status(404).send('File not found.');
    }
});


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /csv/;
    if (allowedTypes.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed. Please upload CSV files.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// Configure CORS for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://aiquatic-labs-live.onrender.com',
        'https://aiquatic-labs.onrender.com',
        // Allow both frontend domains
      ]
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Test endpoints (MUST be before any other routes)
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit!");
  res.json({ 
    message: "Backend API is working!", 
    timestamp: new Date().toISOString(),
    cors: "enabled",
    environment: process.env.NODE_ENV || "development"
  });
});

// Simple health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Debug endpoint to list available files
app.get("/api/files", (req, res) => {
  try {
    const files = fs.readdirSync(cleanedDirPath);
    res.json({ 
      files: files,
      cleanedDirPath: cleanedDirPath,
      count: files.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const runPythonCleaner = (filePath, dataType) => {
  return new Promise((resolve, reject) => {
    // Try python3 first, then python for compatibility
    const pythonCmd = process.env.NODE_ENV === 'production' ? 'python3' : 'python';
    const pythonProcess = spawn(pythonCmd, ['./clean_and_export.py', filePath, dataType]);
    let result = '', error = '';
    pythonProcess.stdout.on('data', (data) => { result += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { error += data.toString(); });
    pythonProcess.on('close', (code) => {
      if (code !== 0) return reject(new Error(`Data cleaning failed: ${error}`));
      try { resolve(JSON.parse(result)); }
      catch (e) { reject(new Error('Failed to parse cleaned data from Python.')); }
    });
    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
};

const jsonToCsv = (jsonData) => {
    if (!jsonData || jsonData.length === 0) return "";
    const headers = Object.keys(jsonData[0]);
    const csvRows = [headers.join(',')];
    for (const row of jsonData) {
        const values = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? '' : row[header];
            const escaped = ('' + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};

app.post('/api/upload', upload.single('dataset'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filePath = req.file.path;
  const dataType = req.body.dataType || 'ocean';

  try {
    const cleanedData = await runPythonCleaner(filePath, dataType);
    const originalCount = cleanedData.length;

    const csvData = jsonToCsv(cleanedData);
    const cleanedFilename = `cleaned-${Date.now()}-${req.file.originalname}`;
    const cleanedFilePath = path.join(cleanedDirPath, cleanedFilename);
    fs.writeFileSync(cleanedFilePath, csvData);
    console.log(`Cleaned file saved to ${cleanedFilePath}`);

    const dataToInsert = cleanedData.filter(row => row.eventID != null && row.eventDate != null);
    const finalCount = dataToInsert.length;
    if (finalCount > 0) {
        await OceanData.insertMany(dataToInsert);
        console.log(`${finalCount} records saved to MongoDB.`);
    }
    
    // Save to recent uploads
    const recentUpload = new RecentUpload({
      originalFilename: req.file.originalname,
      cleanedFilename: cleanedFilename,
      dataType: dataType,
      recordsProcessed: originalCount,
      recordsSaved: finalCount,
      filePath: cleanedFilePath
    });
    
    await recentUpload.save();
    console.log(`Recent upload record saved for ${req.file.originalname}`);
    
    let message = `Data cleaned. Processed ${originalCount} records.`;
    message += ` ${finalCount} were valid for database entry.`;

    res.status(200).json({
      message: message,
      originalFilename: req.file.originalname,
      cleanedFilename: cleanedFilename,
      recordsProcessed: originalCount,
      recordsSaved: finalCount,
      uploadId: recentUpload._id
    });

  } catch (error) {
    console.error('--- UPLOAD FAILED ---', error);
    res.status(500).json({ message: error.message || 'Server error during processing.' });
  } finally {
      fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting temp file:", err.message);
      });
  }
});

// Other API Routes
app.use("/api/users", userRoutes);
app.use("/api/ocean_data", oceanDataRoutes);
app.use("/api/fish_data", fishDataRoutes);
app.use("/api/dataset_uploads", datasetUploadRoutes); 
app.use("/api/insights", biodiversityInsightsRoutes);
app.use("/api/recent-uploads", recentUploadsRoutes);

// Specific download route with better error handling
app.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(cleanedDirPath, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ 
      error: "File not found", 
      message: "The requested file may have been moved, deleted, or never existed.",
      filename: filename,
      suggestion: "Please re-upload your data or check the recent uploads list."
    });
  }

  // Set appropriate headers for download
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  
  fileStream.on('error', (error) => {
    console.error('File stream error:', error);
    res.status(500).json({ 
      error: "File read error", 
      message: "An error occurred while reading the file." 
    });
  });
});

// Root endpoint
app.get("/", (req, res) => res.send("Welcome to the AiQuatic Labs Backend API! 🚀"));

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ 
    error: "Route not found", 
    path: req.originalUrl,
    method: req.method 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));