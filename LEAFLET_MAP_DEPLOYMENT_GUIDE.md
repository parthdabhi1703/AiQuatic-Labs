# AiQuatic Labs - Leaflet Map Integration Deployment Guide

## ✅ What We've Implemented

The dashboard now includes an interactive map that displays marine research data with the following features:

### 🗺️ Map Features

- **Interactive Leaflet Map** showing ocean monitoring stations
- **CSV Data Integration** with marine species and oceanographic data
- **Multiple Data Sources**: API, CSV files, and embedded fallback data
- **Color-coded Markers**:
  - 🟢 Green: Normal CSV data points
  - 🟡 Orange: High temperature (>25°C)
  - 🔴 Red: High salinity (>35 PSU)
  - 🔵 Blue: Static monitoring stations

### 📊 Data Filtering

- **High Temperature**: Shows only locations with temperature >25°C
- **High Salinity**: Shows only locations with salinity >34 PSU
- **CSV Data**: Shows only data from CSV sources
- **All Data**: Shows all markers (static + CSV data)

## 🚀 Deployment Options

### Option 1: Static Website Hosting (Recommended for Frontend)

**Best for**: Netlify, Vercel, GitHub Pages, Firebase Hosting

1. **Upload these files**:

   ```
   aiquatic-frontend_SIH/
   ├── index.html
   ├── style.css
   ├── app.js
   ├── script.js
   ├── config.js
   ├── leaflet-data.js (embedded data)
   ├── leaflet_data.csv (optional)
   └── assets/
       ├── logo.png
       └── favicon.ico
   ```

2. **Works immediately** - No server setup required!

3. **Data Source Priority**:
   - First tries: Your backend API (if deployed)
   - Then tries: CSV file (if available)
   - Finally uses: Embedded data (always available)

### Option 2: Full Stack Deployment

**Backend**: Deploy to Render, Heroku, or any Node.js hosting
**Frontend**: Deploy to Netlify, Vercel, or any static hosting

#### Backend Setup:

1. Deploy your `aiquatic-backend_SIH` folder to Render
2. The new endpoint `/api/ocean-data/leaflet` will serve CSV data
3. Update your `config.js` with the deployed backend URL

#### Frontend Setup:

1. Update `config.js` with your deployed backend URL:
   ```javascript
   const API_CONFIG = {
     BASE_URL: "https://your-backend-app.onrender.com/api",
   };
   ```
2. Deploy frontend files to static hosting

## 🔧 Configuration

### config.js Settings

```javascript
const API_CONFIG = {
  // Production backend URL
  BASE_URL: "https://aiquatic-labs.onrender.com/api",

  // For local development, uncomment:
  // BASE_URL: 'http://localhost:5000/api'
};
```

## 🌐 How It Works in Different Environments

### 1. Direct File Opening (file:// protocol)

- ✅ **Works**: Uses embedded data from `leaflet-data.js`
- ❌ **Limitations**: Cannot load external CSV files due to browser security

### 2. Static Web Server (http:// or https://)

- ✅ **Works**: Can try to load CSV files
- ✅ **Fallback**: Uses embedded data if CSV fails
- ✅ **Best for**: Most hosting platforms

### 3. With Backend API

- ✅ **Works**: Fetches fresh data from your backend
- ✅ **Fallback**: Uses CSV or embedded data if API fails
- ✅ **Best for**: Production applications with dynamic data

## 🎯 Testing Scenarios

### Test 1: Direct Browser Opening

1. Open `index.html` directly in any browser
2. Map should load with 8 sample data points
3. All filter buttons should work

### Test 2: Simple Web Server

1. Run any web server in the frontend directory
2. Navigate to `http://localhost:PORT`
3. Map should try to load CSV data, fallback to embedded data

### Test 3: With Backend (Production)

1. Deploy backend to Render/Heroku
2. Deploy frontend to Netlify/Vercel
3. Map should fetch data from API

## 📝 Files Added/Modified

### New Files:

- `leaflet-data.js` - Embedded data for offline functionality
- `routes/leafletDataRoutes.js` - Backend API route
- `controllers/leafletDataController.js` - Backend API controller

### Modified Files:

- `index.html` - Added PapaParse and leaflet-data.js scripts
- `app.js` - Enhanced map with CSV integration and multiple data sources
- `style.css` - Added custom marker and popup styles
- `server.js` - Added leaflet data route

## 🔑 Key Benefits

1. **Zero Server Dependency**: Works even when opened directly in browser
2. **Progressive Enhancement**: Better features when server is available
3. **Automatic Fallbacks**: Always shows data even if external sources fail
4. **Easy Deployment**: Can be deployed to any static hosting platform
5. **Real Marine Data**: Uses actual research data from Lakshadweep region

## 🚨 Troubleshooting

### Map not showing data?

1. Check browser console for errors
2. Verify `leaflet-data.js` is loading
3. Check if backend API is running (if using full stack)

### CSV not loading?

- Normal behavior when opening file directly
- Embedded data will be used automatically
- Ensure `leaflet_data.csv` exists when using web server

### API not working?

- Check backend deployment status
- Verify `config.js` has correct API URL
- CSV and embedded data will be used as fallback

## 🎉 Ready to Deploy!

Your application now works in all scenarios:

- ✅ Opens directly in browser
- ✅ Works on any web hosting platform
- ✅ Integrates with your backend when available
- ✅ Always shows data (never breaks)

Simply upload the frontend files to any hosting platform and it will work immediately!
