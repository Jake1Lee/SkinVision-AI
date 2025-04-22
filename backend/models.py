import numpy as np
from PIL import Image
import time
import random

# Dictionary of skin lesion types
LESION_TYPES = {
    'acb': 'melanocytic, benign, banal, compound, acral',
    'acd': 'melanocytic, benign, dysplastic, compound, acral',
    'ajb': 'melanocytic, benign, banal, junctional, acral',
    'ajd': 'melanocytic, benign, dysplastic, junctional, acral',
    'ak': 'nonmelanocytic, indeterminate, keratinocytic, keratinocytic, actinic_keratosis',
    'alm': 'melanocytic, malignant, melanoma, melanoma, acral_lentiginious',
    'angk': 'nonmelanocytic, benign, vascular, vascular, angiokeratoma',
    'anm': 'melanocytic, malignant, melanoma, melanoma, acral_nodular',
    'bcc': 'nonmelanocytic, malignant, keratinocytic, keratinocytic, basal_cell_carcinoma',
    'bd': 'nonmelanocytic, malignant, keratinocytic, keratinocytic, bowen_disease',
    'bdb': 'melanocytic, benign, banal, dermal, blue',
    'cb': 'melanocytic, benign, banal, compound, compound',
    'ccb': 'melanocytic, benign, banal, compound, congenital',
    'ccd': 'melanocytic, benign, dysplastic, compound, congenital',
    'cd': 'melanocytic, benign, dysplastic, compound, compound',
    'ch': 'nonmelanocytic, malignant, keratinocytic, keratinocytic, cutaneous_horn',
    'cjb': 'melanocytic, benign, banal, junctional, congenital',
    'db': 'melanocytic, benign, banal, dermal, dermal',
    'df': 'nonmelanocytic, benign, fibro_histiocytic, fibro_histiocytic, dermatofibroma',
    'dfsp': 'nonmelanocytic, malignant, fibro_histiocytic, fibro_histiocytic, dermatofibrosarcoma_protuberans',
    'ha': 'nonmelanocytic, benign, vascular, vascular, hemangioma',
    'isl': 'melanocytic, neging, lentigo, lentigo, ink_spot_lentigo',
    'jb': 'melanocytic, benign, banal, junctional, junctional',
    'jd': 'melanocytic, benign, dysplastic, junctional, junctional',
    'ks': 'nonmelanocytic, malignant, vascular, vascular, kaposi_sarcoma',
    'la': 'nonmelanocytic, benign, vascular, vascular, lymphangioma',
    'lk': 'nonmelanocytic, benign, keratinocytic, keratinocytic, lichenoid_keratosis',
    'lm': 'melanocytic, malignant, melanoma, melanoma, lentigo_maligna',
    'lmm': 'melanocytic, malignant, melanoma, melanoma, lentigo_maligna_melanoma',
    'ls': 'melanocytic, benign, lentigo, lentigo, lentigo_simplex',
    'mcb': 'melanocytic, benign, banal, compound, Miescher',
    'mel': 'melanocytic, malignant, melanoma, melanoma, melanoma',
    'mpd': 'nonmelanocytic, malignant, keratinocytic, keratinocytic, mammary_paget_disease',
    'pg': 'nonmelanocytic, benign, vascular, vascular, pyogenic_granuloma',
    'rd': 'melanocytic, benign, dysplastic, recurrent, recurrent',
    'sa': 'nonmelanocytic, benign, vascular, vascular, spider_angioma',
    'scc': 'nonmelanocytic, malignant, keratinocytic, keratinocytic, squamous_cell_carcinoma',
    'sk': 'nonmelanocytic, benign, keratinocytic, keratinocytic, seborrheic_keratosis',
    'sl': 'melanocytic, benign, lentigo, lentigo, solar_lentigo',
    'srjd': 'melanocytic, benign, dysplastic, junctional, spitz_reed'
}

def preprocess_image(image_path):
    """
    Preprocess the image for model input
    """
    try:
        img = Image.open(image_path)
        img = img.resize((224, 224))  # Resize to model input size
        img_array = np.array(img) / 255.0  # Normalize
        return img_array
    except Exception as e:
        raise Exception(f"Error preprocessing image: {str(e)}")

def predict_with_model(image_path, model_name):
    """
    Make predictions using the specified model
    
    Since we don't have actual models loaded, this function simulates
    the prediction process with random results for demonstration purposes.
    
    In a real implementation, this would load the appropriate model and
    run the actual prediction.
    """
    try:
        # Preprocess the image
        _ = preprocess_image(image_path)
        
        # Simulate processing time
        time.sleep(2)
        
        # Generate random predictions for demonstration
        # In a real implementation, this would be the model's output
        predictions = {}
        
        # Create random probabilities for each lesion type
        raw_probs = np.random.rand(len(LESION_TYPES))
        
        # Adjust probabilities based on model selection to simulate different model behaviors
        if model_name == 'resnet50':
            # ResNet50 tends to be more confident in its top predictions
            raw_probs = raw_probs ** 2
        elif model_name == 'inceptionv3':
            # InceptionV3 might have a more balanced distribution
            raw_probs = np.sqrt(raw_probs)
        elif model_name == 'skinnet':
            # SkinNet might have higher accuracy, so make one prediction stronger
            max_idx = np.argmax(raw_probs)
            raw_probs[max_idx] = raw_probs[max_idx] * 1.5
        # Normalize to sum to 100
        total_prob = np.sum(raw_probs)
        probs = raw_probs / total_prob * 100
        
        # Create the results dictionary
        for i, (code, name) in enumerate(LESION_TYPES.items()):
            predictions[code] = {
                'name': name,
                'probability': round(float(probs[i]), 2)
            }
        
        # Sort by probability (descending)
        sorted_predictions = {k: v for k, v in sorted(
            predictions.items(), 
            key=lambda item: item[1]['probability'], 
            reverse=True
        )}
        
          # Get the top prediction
        top_prediction = next(iter(sorted_predictions))
        
        return {
            'predictions': sorted_predictions,
            'top_prediction': {
                'code': top_prediction,
                'name': sorted_predictions[top_prediction]['name'],
                'probability': sorted_predictions[top_prediction]['probability']
            }
        }
        
    except Exception as e:
        raise Exception(f"Error making prediction: {str(e)}")
