import React from 'react';
import GlassCard from '@/components/GlassCard';
import BackButton from '@/components/BackButton';

const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GlassCard backButton={<BackButton />}>
        <h1 className="text-3xl font-bold mb-6 text-white text-center">About SkinVision AI</h1>
        
        <div className="space-y-6 text-white">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Project Overview</h2>
            <p className="mb-4">
              SkinVision AI is a comprehensive artificial intelligence application designed for the classification 
              and detection of pigmented skin lesions. This project represents a significant advancement in 
              dermatology technology, combining cutting-edge machine learning techniques with practical 
              healthcare applications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Mission & Impact</h2>
            <p className="mb-4">
              Our mission is to democratize access to preliminary skin lesion analysis through AI-powered 
              technology. By providing healthcare professionals and individuals with an accessible tool for 
              initial skin lesion assessment, we aim to contribute to early detection and improved dermatological 
              care outcomes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">AI Models & Technology</h2>
            <p className="mb-3">
              The application leverages multiple state-of-the-art deep learning architectures:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>ResNet50:</strong> A 50-layer residual network optimized for image classification with superior accuracy and stability</li>
              <li><strong>InceptionV3:</strong> Google's inception architecture designed for efficient feature extraction and pattern recognition</li>
              <li><strong>Advanced Classification:</strong> Capable of identifying 40+ different types of skin lesions and conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Key Features</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Real-time image analysis and classification</li>
              <li>Comprehensive benchmarking and performance metrics</li>
              <li>User-friendly interface with detailed results visualization</li>
              <li>Model comparison and selection capabilities</li>
              <li>Confidence scoring and probability distributions</li>
              <li>Educational resources and classification insights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Technical Implementation</h2>
            <p className="mb-4">
              This PFE (Projet de Fin d'Études) encompasses the complete development lifecycle from research 
              and model training to deployment and testing. The solution integrates advanced computer vision 
              techniques with a modern web application architecture, ensuring both accuracy and usability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Important Disclaimer</h2>
            <div className="bg-yellow-900 bg-opacity-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-yellow-100">
                <strong>Medical Disclaimer:</strong> This application is designed for educational and research 
                purposes. Results should not be considered as medical diagnosis or treatment recommendations. 
                Always consult with qualified healthcare professionals for proper medical evaluation and diagnosis.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Academic Context</h2>
            <p>
              Developed as part of a final year project (PFE), this application demonstrates the practical 
              application of artificial intelligence in healthcare, showcasing skills in machine learning, 
              web development, model deployment, and comprehensive testing methodologies.
            </p>
          </section>
        </div>
      </GlassCard>
    </div>
  );
};

export default About;
