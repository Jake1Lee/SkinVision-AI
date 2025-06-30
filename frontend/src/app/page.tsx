'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      proceedWithImageUpload(file);
    }
  };

  const proceedWithImageUpload = (file: File) => {
    setUploading(true);
    // Store the image in local storage
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        localStorage.setItem('uploadedImage', reader.result as string);
        router.push('/model-selection');
      }
    };
    reader.readAsDataURL(file);
    uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use relative URL for production, absolute for development
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/upload' 
        : 'http://localhost:5000/api/upload';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        // IMPORTANT: Use the filename returned by the backend, not the original filename
        // The backend sanitizes filenames (spaces become underscores, etc.)
        localStorage.setItem('uploadedImageName', data.filename);
      } else {
        alert('Error uploading image: ' + data.error);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error uploading image:', errorMessage);
      alert('Error uploading image: ' + errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('imageUpload')?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <h1 className="text-4xl md:text-7xl font-bold mb-6 md:mb-8 text-purple-800 text-center" style={{ fontFamily: 'Red Rose', fontWeight: 600 }}>
        SkinVision AI
      </h1>
      <h2 className="text-xl md:text-4xl font-bold mb-6 md:mb-8 text-purple-800 text-center px-4" style={{ fontFamily: 'Red Rose', fontWeight: 600 }}>
         Upload image of skin to classify it
      </h2>
      <GlassCard>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        <button
          className={`${styles.uploadButton} bg-white text-purple-800 font-bold py-4 md:py-6 px-6 md:px-8 rounded-xl focus:outline-none focus:shadow-outline text-xl md:text-2xl`}
          onClick={handleUploadButtonClick}
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        {selectedImage && (
          <div className="mt-4">
            <p className="text-white">Selected Image: {selectedImage.name}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
