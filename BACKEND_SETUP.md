# Backend Server Setup Instructions

## The Issue
The model-selection page is getting a 500 Internal Server Error when trying to connect to `http://localhost:5000/api/models`. This happens because the Flask backend server is not running.

## Solution - Start the Backend Server

### Step 1: Install Python Dependencies
Open a terminal/command prompt and navigate to the backend directory:

```bash
cd "C:\Users\JakeLee\Desktop\PFE\App\SkinVision-AI\backend"
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

### Step 2: Start the Flask Server
Run the Flask application:
```bash
python app.py
```

You should see output like:
```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://[your-ip]:5000
 * Debug mode: on
```

### Step 3: Test the Backend
Open a browser and go to: `http://localhost:5000/api/models`

You should see a JSON response with the available models:
```json
[
  {
    "id": "resnet50",
    "name": "ResNet50",
    "description": "Excellent for general skin lesion classification...",
    "accuracy": "92.5%"
  },
  // ... more models
]
```

### Step 4: Keep Both Servers Running
- Frontend (Next.js): `http://localhost:3000` (already running)
- Backend (Flask): `http://localhost:5000` (needs to be started)

Both servers need to be running simultaneously for the application to work properly.

## Alternative: Quick Backend Test
If you want to test if the backend is working without starting it manually, you can modify the frontend to handle the case when the backend is not available.

The error occurs because the model-selection page tries to fetch data from the backend at startup, but the backend isn't running.
