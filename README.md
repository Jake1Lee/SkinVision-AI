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

## 🚀 Getting Started

### Prerequisites

- [Node.js](httpss://nodejs.org/en/) (v18.x or later)
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
