import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
from models import predict_with_model

app = Flask(__name__)
CORS(app)

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
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'success': True,
            'filename': filename,
            'message': 'File uploaded successfully'
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    data = request.json
    
    if not data or 'filename' not in data or 'model' not in data:
        return jsonify({'error': 'Missing filename or model selection'}), 400
    
    filename = data['filename']
    model_name = data['model']
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Process the image and get predictions
        results = predict_with_model(filepath, model_name)
        
        return jsonify({
            'success': True,
            'results': results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/models', methods=['GET'])
def get_models():
    # Return information about available models
    models = [
        {
            'id': 'resnet50',
            'name': 'ResNet50',
            'description': 'Excellent for general skin lesion classification with high accuracy on common conditions.',
            'accuracy': '92.5%'
        },
        {
            'id': 'inceptionv3',
            'name': 'InceptionV3',
            'description': 'Specialized in detecting subtle patterns in complex lesions, performs well on rare conditions.',
            'accuracy': '91.8%'
        },
        {
            'id': 'skinnet',
            'name': 'SkinNet',
            'description': 'Custom model optimized specifically for dermatological analysis with balanced performance across all lesion types.',
            'accuracy': '94.2%'
        }
    ]
    
    return jsonify(models)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
