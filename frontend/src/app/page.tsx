'use client';

import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Store the image in local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          localStorage.setItem('uploadedImage', reader.result as string);
          router.push('/model-selection');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    document.getElementById('imageUpload')?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-white">
        SkinVision AI: Upload image of skin to classify it
      </h1>
      <GlassCard>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button
          className={`${styles.uploadButton} bg-white text-purple-800 font-bold py-6 px-8 rounded-xl focus:outline-none focus:shadow-outline text-2xl`}
          onClick={handleUploadButtonClick}
        >
          Upload Image
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
