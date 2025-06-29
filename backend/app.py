import os
import json
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
from models import predict_with_model

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# Allow CORS for both development and production
CORS(app, origins=[
    'http://localhost:3000', 
    'http://127.0.0.1:3000',
    'http://skinvisionai.com',
    'https://skinvisionai.com',
    'http://www.skinvisionai.com',
    'https://www.skinvisionai.com'
])

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload

# Create uploads folder if it doesn't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    logger.info("=== UPLOAD REQUEST RECEIVED ===")
    logger.info(f"Request files: {list(request.files.keys())}")
    
    if 'file' not in request.files:
        logger.error("No file part in request")
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    logger.info(f"File received: {file.filename}")
    
    if file.filename == '':
        logger.error("No file selected")
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        logger.info(f"File saved to: {filepath}")
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'File uploaded successfully'
        })
    
    logger.error(f"File type not allowed: {file.filename}")
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    logger.info("=== ANALYZE REQUEST RECEIVED ===")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request method: {request.method}")
    logger.info(f"Request content type: {request.content_type}")
    
    if not request.data:
        logger.error("Empty request body received")
        return jsonify({'error': 'Empty request body'}), 400

    data = request.get_json()
    logger.info(f"Request data: {data}")
    
    if not data or 'filename' not in data or 'model' not in data:
        logger.error(f"Missing data - filename: {'filename' in data if data else 'N/A'}, model: {'model' in data if data else 'N/A'}")
        return jsonify({'error': 'Missing filename or model selection'}), 400
    
    original_filename = data['filename']
    model_name = data['model']
    logger.info(f"Processing file: {original_filename} with model: {model_name}")
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], original_filename)
    logger.info(f"Looking for file at: {filepath}")
    
    if not os.path.exists(filepath):
        logger.error(f"File not found at path: {filepath}")
        # List files in upload directory for debugging
        if os.path.exists(app.config['UPLOAD_FOLDER']):
            files = os.listdir(app.config['UPLOAD_FOLDER'])
            logger.info(f"Files in upload directory: {files}")
        return jsonify({'error': 'File not found'}), 404
    
    try:
        logger.info("Starting prediction...")
        # Process the image and get predictions
        results = predict_with_model(filepath, model_name)
        logger.info(f"Prediction successful. Results: {results}")
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}", exc_info=True)
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    models = [
        {
            'id': 'inceptionv3',
            'name': 'InceptionV3',
            'description': 'Google InceptionV3 model trained for skin lesion classification'
        },
        {
            'id': 'resnet50',
            'name': 'ResNet50',
            'description': 'ResNet50 model trained for skin lesion classification'
        }
    ]
    
    return jsonify(models)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
