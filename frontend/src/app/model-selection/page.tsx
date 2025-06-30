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
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    placement: '',
    symptoms: '',
    medicalHistory: ''
  });
  const [isPatientDataSaved, setIsPatientDataSaved] = useState(false);
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
        // Use relative URL for production, absolute for development
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/models' 
          : 'http://localhost:5000/api/models';
        
        const response = await fetch(apiUrl);
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

  const handlePatientDataChange = (field: string, value: string) => {
    setPatientData(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePatientData = () => {
    // Save patient data to localStorage
    localStorage.setItem('patientData', JSON.stringify(patientData));
    setIsPatientDataSaved(true);
    console.log('Patient data saved successfully!');
  };

  const handleSubmit = async () => {
    if (selectedModel && uploadedImage) {
      // Store the selected model in local storage
      localStorage.setItem('selectedModel', selectedModel);

      try {
        // Retrieve the filename from local storage
        const filename = localStorage.getItem('uploadedImageName') || 'skin_lesion.jpg'; // Default filename

        // Use relative URL for production, absolute for development
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/analyze' 
          : 'http://localhost:5000/api/analyze';

        console.log(`Sending analysis request to ${apiUrl}:`, {
          filename: filename,
          model: selectedModel,
        });

        // Send the selected model and image to the backend for analysis
        const response = await axios.post(apiUrl, {
          filename: filename,
          model: selectedModel,
        });

        console.log('Analysis response:', response.data);

        // Store the results in local storage
        localStorage.setItem('analysisResults', JSON.stringify(response.data.results));

        router.push('/results'); // Navigate to the results page
      } catch (error: unknown) {
        console.error('Error analyzing image:', error);
        
        // Check if it's a network error (backend not available)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (errorMessage.includes('Network Error') || errorMessage.includes('ERR_CONNECTION_REFUSED')) {
          console.error('Backend server is not running. Please start the Flask server (python app.py) in the backend folder to perform analysis.');
        } else {
          console.error('Error analyzing image: ' + errorMessage);
        }
      }
    } else {
      console.warn('Please select a model and upload an image.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <BackButton />
      <div className={styles.container} style={{ paddingTop: '20px' }}>
        {uploadedImage && (
          <div className={styles.topCardsContainer}>
            <GlassCard className={styles.topCard}>
              <div className={styles.imageContainer}>
                <img src={uploadedImage} alt="Uploaded Image" />
              </div>
            </GlassCard>
            <GlassCard className={`${styles.topCard} ${styles.modelSelectionCard}`}>
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
                  className={`${styles.submitButton} ${!selectedModel ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={!selectedModel}
                >
                  Submit
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Patient Data Card - Full Width */}
        {uploadedImage && (
          <div className={styles.patientDataContainer}>
            <GlassCard className={styles.patientDataCard}>
              <h2 className="text-xl font-bold mb-4 text-white">Patient Information</h2>
              <div className={styles.patientForm}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Age *</label>
                    <input
                      type="number"
                      value={patientData.age}
                      onChange={(e) => handlePatientDataChange('age', e.target.value)}
                      className={styles.input}
                      placeholder="Enter age"
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Gender *</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => handlePatientDataChange('gender', e.target.value)}
                      className={styles.select}
                      required
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Image Placement *</label>
                    <input
                      type="text"
                      value={patientData.placement}
                      onChange={(e) => handlePatientDataChange('placement', e.target.value)}
                      className={styles.input}
                      placeholder="e.g., left arm, face, back"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Symptoms (Optional)</label>
                    <textarea
                      value={patientData.symptoms}
                      onChange={(e) => handlePatientDataChange('symptoms', e.target.value)}
                      className={styles.textarea}
                      placeholder="Describe any symptoms (itching, pain, changes, etc.)"
                      rows={3}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Medical History (Optional)</label>
                    <textarea
                      value={patientData.medicalHistory}
                      onChange={(e) => handlePatientDataChange('medicalHistory', e.target.value)}
                      className={styles.textarea}
                      placeholder="Relevant medical history (allergies, previous conditions, etc.)"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className={styles.saveButtonContainer}>
                  <button
                    onClick={handleSavePatientData}
                    className={`${styles.saveButton} ${isPatientDataSaved ? styles.saved : ''}`}
                  >
                    {isPatientDataSaved ? '✓ Saved' : 'Save Patient Data'}
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSelection;
