# SkinVision-AI Quick Start Guide

## 🚨 IMPORTANT: Fix for "Internal Server Error"

The "Internal Server Error" on the model-selection page happens because the **Flask backend server is not running**. The application needs both servers to work:

- **Frontend (Next.js)**: http://localhost:3000 ✅ (Already running)
- **Backend (Flask)**: http://localhost:5000 ❌ (Needs to be started)

## 🚀 Quick Start (Recommended)

### Option 1: Use the Startup Script
1. Double-click `start-app.bat` in the main folder
2. This will automatically:
   - Install Python dependencies
   - Start the Flask backend server
   - Start the Next.js frontend server
3. Wait for both servers to start
4. Go to http://localhost:3000

### Option 2: Manual Setup

#### Step 1: Start Backend Server
```bash
# Open terminal in the project root
cd backend

# Install Python dependencies (first time only)
pip install -r requirements.txt

# Start Flask server
python app.py
```

You should see:
```
* Running on http://127.0.0.1:5000
* Debug mode: on
```

#### Step 2: Start Frontend Server (in a new terminal)
```bash
cd frontend
npm run dev
```

#### Step 3: Test Both Servers
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/models

## ✅ Verification

### Test Backend is Working
Go to: http://localhost:5000/api/models

You should see JSON data with available models:
```json
[
  {
    "id": "resnet50",
    "name": "ResNet50",
    "description": "Excellent for general skin lesion classification...",
    "accuracy": "92.5%"
  }
]
```

### Test Full Application Flow
1. Go to http://localhost:3000
2. Login/Register with your account
3. Upload an image
4. Fill patient information
5. Select a model → Should now work without errors!
6. View results and save to history

## 🔧 Troubleshooting

### "Internal Server Error" Still Appearing?
- Make sure Flask server is running: `python app.py` in the backend folder
- Check if port 5000 is available
- Look for error messages in the Flask terminal

### Python Dependencies Issues?
```bash
pip install Flask Flask-CORS Pillow numpy torch torchvision
```

### Can't Find Python/Pip?
- Install Python from https://python.org
- Make sure "Add Python to PATH" is checked during installation

## 📝 What Was Fixed

1. **Added error handling**: Frontend now shows helpful messages when backend is offline
2. **Fallback models**: Basic models available even without backend
3. **Clear error messages**: Users know exactly what to do when backend is missing
4. **Startup script**: One-click solution to start both servers
5. **Requirements file**: All Python dependencies listed

## 🎯 Normal Application Flow

Once both servers are running:
1. **Authentication**: Login/register with medical profile
2. **Image Upload**: Select skin lesion image
3. **Patient Info**: Fill patient details (age, gender, scan area, etc.)
4. **Model Selection**: Choose AI model for analysis
5. **Analysis**: AI processes the image
6. **Results**: View predictions with confidence scores
7. **History**: All scans saved to personal history with notes

The authentication and scan history features are fully working - the only issue was the missing backend server!
