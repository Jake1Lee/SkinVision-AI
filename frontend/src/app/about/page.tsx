import React from 'react';
import GlassCard from '@/components/GlassCard';
import BackButton from '@/components/BackButton';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GlassCard backButton={<BackButton />}>
        <h1 className="text-2xl font-bold mb-4 text-white">About Skin Lesion Detection App</h1>
        <p className="text-white mb-4">
          This app uses AI to detect skin lesions from uploaded images.
        </p>
        <p className="text-white mb-4">
          It utilizes three different models: ResNet50, InceptionV3, and SkinNet.
        </p>
        <p className="text-white">
          Each model has its own strengths and weaknesses, so you can choose the one that best suits your needs.
        </p>
      </GlassCard>
    </div>
  );
};

export default About;
