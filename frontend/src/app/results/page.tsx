'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import BackButton from '@/components/BackButton';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useSearchParams } from 'next/navigation';
import styles from './Results.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
BarElement,
  Title,
  Tooltip,
  Legend
);

type TooltipMode = 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y' | undefined;

const Results = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [topPrediction, setTopPrediction] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filename = localStorage.getItem('uploadedImageName') || 'skin_lesion.jpg';
        const model = localStorage.getItem('selectedModel') || 'resnet50';

        const response = await fetch('http://localhost:5000/api/analyze', {
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
        setTopPrediction({ code: data.results.top_prediction.code, probability: data.results.top_prediction.probability, name: data.results.top_prediction.name });

        console.log('analysisResults:', data.results.predictions);
        console.log('topPrediction:', { code: data.results.top_prediction.code, probability: data.results.top_prediction.probability, name: data.results.top_prediction.name });

      } catch (error) {
        console.error('Error fetching analysis results:', error);
      }
    };

    fetchData();
  }, [searchParams]);

  const data = {
    labels: analysisResults ? Object.keys(analysisResults).sort() : [],
    datasets: [
      {
        label: 'Probability',
        data: analysisResults ? Object.values(analysisResults).map((item: any) => item.probability) : [],
        backgroundColor: 'rgba(23, 1, 105, 0.8)', // Deep blue to purple gradient
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
          label: (context: any) => {
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
            return value;
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GlassCard backButton={<BackButton />}>
        <h1 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Red Rose', fontWeight: 600, marginTop: '20px' }}>Analysis Results</h1>
        {topPrediction && (
          <div className="mb-4 text-white" style={{ fontSize: '1.1em' }}>
            <b style={{ fontWeight: 700 }}>Top Prediction:</b> <span style={{ fontWeight: 500 }}>
              <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{topPrediction.code}</span>
              ({topPrediction.name}) - {topPrediction.probability.toFixed(2)}%
            </span>
          </div>
        )}
        {analysisResults && (
          <div className="mb-4 text-white" style={{ fontSize: '1.1em' }}>
            <b style={{ fontWeight: 700 }}>Next Predictions:</b>
            <ol style={{ paddingLeft: '20px' }}>
              {Object.entries(analysisResults)
                .sort(([, a]: [string, any], [, b]: [string, any]) => b.probability - a.probability)
                .slice(1, 5)
                .map(([code, result]: [string, any], index) => {
                  const nameParts = result.name.split('(');
                  const name = nameParts[0].trim();
                  const explanation = ` (${(nameParts.length > 1 ? nameParts[1] : nameParts[0]).toLowerCase()})`;

                  return (
                    <li key={code} style={{ fontWeight: 500 }}>
                      {index + 2}. <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{code}</span>{explanation} - {result.probability.toFixed(2)}%
                    </li>
                  );
                })}
            </ol>
          </div>
        )}
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
