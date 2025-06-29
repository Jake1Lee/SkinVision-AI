#!/usr/bin/env python3
"""
Direct test of the models to verify they can load and make predictions
"""
import os
import sys
import torch
from PIL import Image
import torchvision.transforms as transforms

def test_model_loading():
    """Test if the models can be loaded"""
    print("=== Testing Model Loading ===")
    
    model_paths = {
        'resnet50': 'models/resnet50_model.pth',
        'inceptionv3': 'models/inceptionv3_model.pth'
    }
    
    for model_name, model_path in model_paths.items():
        print(f"\nTesting {model_name}...")
        
        # Check if file exists
        if not os.path.exists(model_path):
            print(f"❌ Model file not found: {model_path}")
            continue
            
        # Check file size
        file_size = os.path.getsize(model_path)
        print(f"Model file size: {file_size / (1024*1024):.2f} MB")
        
        if file_size < 1000000:  # Less than 1MB suggests LFS issue
            print(f"⚠️  Model file seems too small, might be LFS pointer")
            continue
            
        try:
            # Try to load the model
            model = torch.load(model_path, map_location='cpu')
            print(f"✅ Model loaded successfully")
            print(f"Model type: {type(model)}")
            
            # If it's a state dict, we need to create the model architecture first
            if isinstance(model, dict):
                print(f"Model keys: {list(model.keys())[:5]}...")  # Show first 5 keys
            
        except Exception as e:
            print(f"❌ Error loading model: {str(e)}")

def test_image_processing():
    """Test if we can process an image"""
    print("\n=== Testing Image Processing ===")
    
    # Check if there's a test image
    upload_dir = 'uploads'
    if os.path.exists(upload_dir):
        images = [f for f in os.listdir(upload_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        if images:
            test_image = os.path.join(upload_dir, images[0])
            print(f"Found test image: {test_image}")
            
            try:
                # Try to load and process the image
                image = Image.open(test_image)
                print(f"✅ Image loaded: {image.size}, mode: {image.mode}")
                
                # Test transforms
                transform = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])
                
                image_tensor = transform(image)
                print(f"✅ Image transformed: {image_tensor.shape}")
                
            except Exception as e:
                print(f"❌ Error processing image: {str(e)}")
        else:
            print("No test images found in uploads directory")
    else:
        print("Uploads directory not found")

def test_models_py():
    """Test the models.py prediction function"""
    print("\n=== Testing models.py ===")
    
    try:
        from models import predict_with_model
        print("✅ Successfully imported predict_with_model")
        
        # Check if there's a test image
        upload_dir = 'uploads'
        if os.path.exists(upload_dir):
            images = [f for f in os.listdir(upload_dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
            if images:
                test_image = os.path.join(upload_dir, images[0])
                print(f"Testing with image: {test_image}")
                
                for model_name in ['resnet50', 'inceptionv3']:
                    try:
                        print(f"\nTesting {model_name}...")
                        result = predict_with_model(test_image, model_name)
                        print(f"✅ Prediction successful: {result}")
                    except Exception as e:
                        print(f"❌ Error with {model_name}: {str(e)}")
                        import traceback
                        traceback.print_exc()
            else:
                print("No test images found for prediction test")
        else:
            print("No uploads directory found for prediction test")
            
    except Exception as e:
        print(f"❌ Error importing models.py: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🔍 SkinVision AI Model Testing")
    print("=" * 50)
    
    test_model_loading()
    test_image_processing()
    test_models_py()
    
    print("\n" + "=" * 50)
    print("Testing complete!")
