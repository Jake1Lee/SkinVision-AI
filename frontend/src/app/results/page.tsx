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

type TooltipMode = 'index' | 'dataset' | 'point' | 'nearest' | 'x' | 'y';

const Results = () => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [topPrediction, setTopPrediction] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const resnet = searchParams.get('resnet');

    // Retrieve the analysis results from local storage
    const results = localStorage.getItem('analysisResults');

    if (resnet === 'true' || !results) {
      // For prototyping purposes, generate random data if ResNet is selected or no results are found
      const randomData: any = {};
      const labels = ['acb', 'acd', 'ajb', 'ajd', 'ak', 'alm', 'angk', 'anm', 'bcc', 'bd', 'bdb', 'cb', 'ccb', 'ccd', 'cd', 'ch', 'cjb', 'db', 'df', 'dfsp', 'ha', 'isl', 'jb', 'jd', 'ks', 'la', 'lk', 'lm', 'lmm', 'ls', 'mcb', 'mel', 'mpd', 'pg', 'rd', 'sa', 'scc', 'sk', 'sl', 'srjd'];

      // Assign specific probabilities to the top predictions
      randomData['lm'] = { name: 'lentigo_maligna', probability: 86.7 };
      randomData['mel'] = { name: 'melanoma', probability: 4.2 };
      randomData['bcc'] = { name: 'basal_cell_carcinoma', probability: 3.8 };
      randomData['sk'] = { name: 'seborrheic_keratosis', probability: 2.1 };
      randomData['nv'] = { name: 'melanocytic_nevus', probability: 1.8 };

      // Assign the remaining probability to the rest of the labels
      const remainingLabels = labels.filter(label => !(label in randomData));
      const remainingProbability = 100 - 86.7 - 4.2 - 3.8 - 2.1 - 1.8;
      const probabilityPerLabel = remainingProbability / remainingLabels.length;

      remainingLabels.forEach(label => {
        randomData[label] = {
          name: label,
          probability: probabilityPerLabel
        };
      });

      setAnalysisResults(randomData);

      let topCode = 'lm';
      setTopPrediction({ code: topCode, probability: 86.7, name: 'lentigo_maligna' });
    } else {
      const parsedResults = JSON.parse(results);
      setAnalysisResults(parsedResults);

      // Find the top prediction
      let topCode = '';
      let topProbability = 0;
      for (const code in parsedResults) {
        if (parsedResults[code].probability > topProbability) {
          topCode = code;
          topProbability = parsedResults[topCode].probability;
        }
      }
      setTopPrediction({ code: topCode, probability: topProbability, name: parsedResults[topCode].name });
    }
  }, [searchParams]);

  const data = {
    labels: analysisResults ? Object.keys(analysisResults) : [],
    datasets: [
      {
        label: 'Probability',
        data: analysisResults ? Object.values(analysisResults).map((item: any) => item.probability) : [],
        backgroundColor: Object.keys(analysisResults || {}).map((key, index) => {
          if (key === 'lm') {
            return 'orangered';
          } else if (index < 5) {
            return 'yellow';
          } else {
            return 'deepblue';
          }
        }),
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
        ],
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
            return value + '%';
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
        <h1 className="text-2xl font-bold mb-4 text-white">Analysis Results</h1>
        {topPrediction && (
          <div className="mb-4 text-white">
            Top Prediction: {topPrediction.code} ({topPrediction.name}) - {topPrediction.probability.toFixed(2)}%
          </div>
        )}
        {analysisResults && (
          <div className="mb-4 text-white">
            Next Predictions:
            <ul>
              {Object.entries(analysisResults)
                .sort(([, a], [, b]) => (b as any).probability - (a as any).probability)
                .slice(1, 5)
                .map(([code, result]: [string, any]) => (
                  <li key={code}>
                    {code} ({result.name}) - {result.probability.toFixed(2)}%
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div className={styles.chartContainer}>
          <Bar data={data} options={options} />
        </div>
      </GlassCard>
    </div>
  );
};

export default Results;
