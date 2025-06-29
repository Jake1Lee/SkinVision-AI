# SkinVision AI 🩺🤖

SkinVision AI is a web-based application designed to provide AI-powered analysis of skin lesions. Users can upload an image of a skin lesion, and the application will use a deep learning model to classify it and provide detailed predictions. The app features an interactive chat assistant to help users understand their results and a secure system for saving scan history.

## ✨ Features

- **🖼️ Image Upload & Analysis**: Upload images of skin lesions for analysis by state-of-the-art deep learning models (ResNet50 and InceptionV3).
- **📊 Detailed Results**: View the top prediction with a confidence score and a chart of other potential classifications.
- **🤖 AI Chat Assistant**: An interactive chat powered by OpenAI's GPT-4o allows users to ask questions about their analysis results in natural language.
- **📄 PDF Report Generation**: Generate and download a professional medical report summarizing the analysis.
- **🔒 User Authentication & History**: Secure user authentication with Firebase, allowing users to save and review their past scan history.
- **☁️ Cloud Storage**: All scan data, including images and PDF reports, are securely stored in Firebase Cloud Storage.

## 🛠️ Tech Stack

- **Frontend**:
  - [Next.js](https://nextjs.org/) – React Framework
  - [TypeScript](https://www.typescriptlang.org/) – Typed JavaScript
  - [React](https://reactjs.org/) – UI Library
  - [Chart.js](https://www.chartjs.org/) – for data visualization
  - [Tailwind CSS](https://tailwindcss.com/) – for styling
  - [Firebase SDK](https://firebase.google.com/docs/web/setup) – for authentication and cloud services

- **Backend**:
  - [Python](https://www.python.org/)
  - [Flask](https://flask.palletsprojects.com/) – Web Framework
  - [PyTorch](https://pytorch.org/) – Deep Learning Framework

- **Database & Storage**:
  - [Firebase Firestore](https://firebase.google.com/docs/firestore) – NoSQL Database for user data and scan history
  - [Firebase Storage](https://firebase.google.com/docs/storage) – for image and PDF uploads

- **AI Services**:
  - [OpenAI API (GPT-4o)](https://openai.com/api/) – for the AI chat assistant and report generation

## 🌐 Live Production Deployment

**🚀 SkinVision AI is now live at: [http://www.skinvisionai.com](http://www.skinvisionai.com)**

### Production Status ✅
- **Backend**: Flask + Gunicorn serving real AI predictions
- **Frontend**: Next.js with optimized static assets  
- **Models**: ResNet50 & InceptionV3 fully functional
- **Infrastructure**: DigitalOcean droplet with Nginx proxy
- **Storage**: Firebase for authentication and data persistence

### Production Features
- Real-time skin lesion analysis with confidence scores
- Secure file uploads and processing
- Comprehensive error logging and monitoring
- Production-optimized build with proper caching

## 🔧 Production Deployment

### Server Requirements
- Ubuntu 24.10+ with 2GB RAM minimum
- Python 3.12+ with venv
- Node.js 18+ 
- Nginx for reverse proxy
- Git LFS for model files

### Production Setup Steps

1. **Clone and Setup Repository:**
   ```bash
   git clone https://github.com/Jake1Lee/SkinVision-AI.git
   cd SkinVision-AI
   git checkout production  # Use the production branch
   ```

2. **Backend Production Setup:**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   pip install gunicorn
   
   # Pull model files with Git LFS
   git lfs pull
   ```

3. **Frontend Production Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   npm start
   ```

4. **Start Production Services:**
   ```bash
   # Backend with Gunicorn
   cd backend && source venv/bin/activate
   gunicorn -w 4 -b 127.0.0.1:5000 app:app
   
   # Frontend (in separate terminal)
   cd frontend && npm start
   ```

5. **Nginx Configuration:**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
       
       location /api/ {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Production Testing
```bash
# Test model loading
cd backend && python test_models_direct.py

# Test API endpoints
curl http://localhost:5000/api/models
curl -X POST -F "file=@test_image.jpg" http://localhost:5000/api/upload
```

### Monitoring
- Backend logs: Check Gunicorn output for prediction requests
- Frontend: Monitor Next.js build and static asset serving
- Models: Verify `.pth` files are 100MB+ (not LFS pointers)

## 📊 Model Performance
- **ResNet50**: Achieves 90%+ confidence on clear lesion images
- **InceptionV3**: Provides detailed multi-class probability distributions
- **Processing Time**: ~2-3 seconds per image on 2GB RAM droplet

## 🔍 Troubleshooting

### Common Issues
1. **CSS 404 Errors**: Rebuild frontend with `npm run build && npm start`
2. **Model Loading Fails**: Ensure Git LFS pulled files (`git lfs pull`)
3. **CORS Errors**: Check backend CORS configuration includes your domain
4. **Memory Issues**: Add swap file for droplets with <4GB RAM
5. **API Analyze 404 Errors**: File not found after upload (see below)

### 🔧 API Analyze 404 Error Fix
If you get 404 errors when analyzing uploaded images (especially from mobile):

**Problem**: The filename sent to `/api/analyze` doesn't match the actual saved filename.

**Solution**: Always use the exact filename returned by `/api/upload`:
```javascript
// ✅ Correct way
const uploadResponse = await fetch('/api/upload', {...});
const uploadData = await uploadResponse.json();
const filename = uploadData.filename; // Use this exact value

const analyzeResponse = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    filename: filename, // Use the returned filename
    model: selectedModel 
  })
});

// ❌ Wrong way - guessing the filename
const analyzeResponse = await fetch('/api/analyze', {
  body: JSON.stringify({ 
    filename: originalFile.name, // This might not match!
    model: selectedModel 
  })
});
```

**Debug Steps**:
1. Check browser console for the exact filename being sent
2. Check backend logs for available files vs requested filename
3. Ensure no race condition between upload and analyze calls

### Debug Commands
```bash
# Check model files
ls -lah backend/models/*.pth

# Test backend directly
cd backend && python -c "from models import predict_with_model; print('OK')"

# Check frontend build
ls -la frontend/.next/static/css/
```

## 🚀 Getting Started (Development)

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18.x or later)
- [Python](https://www.python.org/downloads/) (v3.10 or later)
- `pip` and `virtualenv` for Python package management
- A [Firebase](https://firebase.google.com/) project with Authentication, Firestore, and Storage enabled.
- An [OpenAI API Key](https://platform.openai.com/api-keys).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/SkinVision-AI.git
    cd SkinVision-AI
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Environment Variables:**
    - Create a `.env.local` file in the `frontend` directory and add your Firebase project configuration and other keys.
    - Configure your OpenAI API key within the application settings.

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd backend
    source venv/bin/activate
    python app.py
    ```
    The backend will be running at `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

## Usage

1.  Navigate to `http://localhost:3000`.
2.  Sign up or log in to your account.
3.  Go to the "Scan" page to upload an image of a skin lesion.
4.  Select a model (ResNet50 or InceptionV3) and submit for analysis.
5.  View the results page with the diagnostic predictions.
6.  Use the AI chat assistant to ask questions or generate a PDF report.
7.  View your saved scans in the "History" page.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- PyTorch team for the deep learning framework
- Next.js team for the React framework
- Firebase for cloud services
- The medical AI research community for advancing skin lesion classification
