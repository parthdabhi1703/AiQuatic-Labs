# AiQuatic Labs - Deployment Guide

## Render Deployment Instructions

### Backend Deployment (Web Service)

1. **Prepare your repository:**

   - Push your backend code to GitHub
   - Ensure all files are committed

2. **Deploy on Render:**

   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `aiquatic-backend_SIH` folder

3. **Configuration:**

   - **Runtime**: Node.js
   - **Build Command**: `npm install && pip3 install -r requirements.txt`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `MONGO_URI`: `mongodb+srv://aiquaticlabs_db_user:AiQuaticLabs123@aiquaticlabs-cluster.iuxjpdw.mongodb.net/aiquatic`
     - `JWT_SECRET`: `your_secret_key_change_in_production`

4. **After deployment:**
   - Note the URL (e.g., `https://your-service-name.onrender.com`)
   - Update the frontend configuration

### Frontend Deployment (Static Site)

1. **Update API Configuration:**

   - Open `config.js` in the frontend folder
   - Update the `BASE_URL` with your backend URL:
     ```javascript
     const API_CONFIG = {
       BASE_URL: "https://your-backend-name.onrender.com/api",
     };
     ```

2. **Deploy Frontend:**
   - Go to Render Dashboard
   - Click "New" → "Static Site"
   - Connect your repository
   - Select the `aiquatic-frontend_SIH` folder
   - **Build Command**: Leave empty
   - **Publish Directory**: `.` (current directory)

### Important Notes

- **Free Tier Limitations**: Render free tier spins down after 15 minutes of inactivity
- **Cold Starts**: First request may take 30-60 seconds to respond
- **Python Dependencies**: The backend uses Python for data processing, ensure requirements.txt is present
- **File Uploads**: On free tier, uploaded files are temporary and may be lost on restarts

### Environment Variables to Update in Production

1. Change `JWT_SECRET` to a strong, unique secret
2. Consider using environment variables for MongoDB connection
3. Set proper CORS origins in production

### Testing Deployment

1. Visit your frontend URL
2. Try uploading a CSV file
3. Check if data processing works
4. Verify file downloads work

### Troubleshooting

- Check Render logs for Python/Node.js errors
- Ensure all dependencies are listed in package.json and requirements.txt
- Verify MongoDB connection from Render's IP addresses
