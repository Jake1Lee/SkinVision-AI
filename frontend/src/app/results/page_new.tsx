'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BackButton from '@/components/BackButton';
import GlassCard from '@/components/GlassCard';
import styles from './Results.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AnalysisResults {
  [key: string]: {
    name: string;
    probability: number;
  };
}

interface TopPrediction {
  name: string;
  code: string;
  probability: number;
}

const Results = () => {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [topPrediction, setTopPrediction] = useState<TopPrediction | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Retrieve the uploaded image from local storage
    const image = localStorage.getItem('uploadedImage');
    if (image) {
      setUploadedImage(image);
    }

    const fetchData = async () => {
      try {
        const filename = localStorage.getItem('uploadedImageName') || 'skin_lesion.jpg';
        const model = localStorage.getItem('selectedModel') || 'resnet50';

        // Use relative URL for production, absolute for development
        const apiUrl = process.env.NODE_ENV === 'production' 
          ? '/api/analyze' 
          : 'http://localhost:5000/api/analyze';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filename: filename, model: model }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAnalysisResults(data.results.predictions);
        setTopPrediction({ 
          code: data.results.top_prediction.code, 
          probability: data.results.top_prediction.probability, 
          name: data.results.top_prediction.name 
        });

        console.log('Analysis completed successfully');
      } catch (error) {
        console.error('Error fetching analysis results:', error);
        setError('Failed to analyze image. Please make sure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const data = {
    labels: analysisResults ? Object.keys(analysisResults).sort() : [],
    datasets: [
      {
        label: 'Probability (%)',
        data: analysisResults ? Object.values(analysisResults).map(item => item.probability) : [],
        backgroundColor: 'rgba(23, 1, 105, 0.8)',
        borderColor: 'rgba(75, 0, 130, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Skin Lesion Classification Probabilities',
        color: '#fff',
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: { y?: number } }) => {
            const label = context.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value.toFixed(2)}%`;
          }
        },
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: '#fff',
          callback: (value: number | string) => {
            return `${value}%`;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <GlassCard backButton={<BackButton />}>
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold">Analyzing your image...</h2>
            <p>Please wait while we process your skin lesion image.</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <GlassCard backButton={<BackButton />}>
          <div className="text-center text-white">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Analysis Error</h2>
            <p className="mb-4">{error}</p>
            <p className="text-sm text-gray-300">
              Make sure the backend server is running and accessible
            </p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GlassCard backButton={<BackButton />}>
        {/* Top Section with Image and Results */}
        <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
          {/* Image Column */}
          {uploadedImage && (
            <div className="md:w-1/3">
              <img 
                src={uploadedImage} 
                alt="Uploaded Skin Lesion" 
                className="rounded-lg max-w-full h-auto"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
            </div>
          )}
          
          {/* Results Column */}
          <div className={`${uploadedImage ? 'md:w-2/3' : 'w-full'}`}>
            <h1 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Red Rose', fontWeight: 600 }}>
              Analysis Results
            </h1>
            {topPrediction && (
              <div className="mb-4 text-white" style={{ fontSize: '1.1em' }}>
                <b style={{ fontWeight: 700 }}>Top Prediction:</b>
                <div className="mt-2 p-3 bg-white bg-opacity-10 rounded-lg">
                  <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    {topPrediction.code}
                  </span>
                  <br />
                  <span style={{ fontWeight: 500 }}>
                    {topPrediction.name}
                  </span>
                  <br />
                  <span style={{ fontWeight: 600, color: '#4CAF50' }}>
                    Confidence: {topPrediction.probability.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
            
            {analysisResults && (
              <div className="mb-4 text-white" style={{ fontSize: '1.1em' }}>
                <b style={{ fontWeight: 700 }}>Other Predictions:</b>
                <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
                  {Object.entries(analysisResults)
                    .sort(([, a], [, b]) => b.probability - a.probability)
                    .slice(1, 5)
                    .map(([code, result], index) => (
                      <li key={code} style={{ fontWeight: 500, marginBottom: '4px' }}>
                        {index + 2}. <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{code}</span>
                        <br />
                        <span style={{ marginLeft: '16px', fontSize: '0.9em' }}>
                          {result.name} - {result.probability.toFixed(2)}%
                        </span>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </div>
        </div>
        
        {/* Chart Section */}
        {data.labels.length > 0 && data.datasets[0].data.length > 0 && (
          <div className={styles.chartContainer}>
            <Bar data={data} options={options} />
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Results;
