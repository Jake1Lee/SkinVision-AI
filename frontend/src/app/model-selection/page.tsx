'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import BackButton from '@/components/BackButton';
import { useRouter } from 'next/navigation';
import { FaInfoCircle } from 'react-icons/fa';
import styles from './ModelSelection.module.css';
import axios from 'axios';

interface Model {
  id: string;
  name: string;
  description: string;
  accuracy: string;
}

const ModelSelection = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchModels = async () => {
      // Always use fallback models to ensure correct data
      const fallbackModels: Model[] = [
        {
          id: 'resnet50',
          name: 'ResNet50',
          description: 'Deep residual network with excellent performance for skin lesion classification.',
          accuracy: '72%'
        },
        {
          id: 'inceptionv3',
          name: 'InceptionV3',
          description: 'Google\'s inception architecture with efficient feature extraction capabilities.',
          accuracy: '51%'
        },
        {
          id: 'inceptionresnetv2',
          name: 'InceptionResNetV2',
          description: 'Advanced hybrid model combining Inception and ResNet architectures. Currently in development.',
          accuracy: 'In Development'
        }
      ];
      
      setModels(fallbackModels);
      setRefreshKey(Date.now()); // Force re-render
      
      // Try to fetch from backend but don't override if it fails
      try {
        const response = await fetch('http://localhost:5000/api/models');
        if (response.ok) {
          const data: Model[] = await response.json();
          // Only use backend data if it has the correct models
          if (data.length > 0 && data.some(model => model.id === 'inceptionresnetv2')) {
            setModels(data);
          }
        }
      } catch (error) {
        console.log('Using offline mode with fallback models');
      }
    };

    // Retrieve the uploaded image from local storage
    const image = localStorage.getItem('uploadedImage');
    if (image) {
      setUploadedImage(image);
    }

    // Clear any cached model data
    localStorage.removeItem('cachedModels');

    fetchModels();
  }, []);

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
  };

  const handleSubmit = async () => {
    if (selectedModel && uploadedImage) {
      // Store the selected model in local storage
      localStorage.setItem('selectedModel', selectedModel);

      try {
        // Retrieve the filename from local storage
        const filename = localStorage.getItem('uploadedImageName') || 'skin_lesion.jpg'; // Default filename

        // Send the selected model and image to the backend for analysis
        const response = await axios.post('http://localhost:5000/api/analyze', {
          filename: filename,
          model: selectedModel,
        });

        // Store the results in local storage
        localStorage.setItem('analysisResults', JSON.stringify(response.data.results));

        router.push('/results'); // Navigate to the results page
      } catch (error: unknown) {
        console.error('Error analyzing image:', error);
        
        // Check if it's a network error (backend not available)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
          alert('Backend server is not running. Please start the Flask server (python app.py) in the backend folder to perform analysis.');
        } else {
          alert('Error analyzing image: ' + errorMessage);
        }
      }
    } else {
      alert('Please select a model and upload an image.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <BackButton />
      <div className={styles.container} style={{ paddingTop: '20px' }}>
        {uploadedImage && (
          <GlassCard>
            <div className={styles.imageContainer}>
              <img src={uploadedImage} alt="Uploaded Image" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            </div>
          </GlassCard>
        )}
        <GlassCard className={styles.modelSelectionCard}>
          <h1 className="text-2xl font-bold mb-4 text-white">Select a Model</h1>
          <div className={styles.modelSelectionContainer}>
            <div className={styles.modelList} key={refreshKey}>
              {models.map((model) => (
                <div key={`${model.id}-${refreshKey}`} className={styles.modelItem}>
                  <label>
                    <input
                      type="radio"
                      name="model"
                      value={model.id}
                      checked={selectedModel === model.id}
                      onChange={() => handleModelSelect(model.id)}
                    />
                    {model.name}
                  </label>
                  <div className={styles.infoIcon}>
                    <FaInfoCircle />
                    <span className={styles.tooltip}>{model.description} (Accuracy: {model.accuracy})</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="bg-white text-purple-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default ModelSelection;
