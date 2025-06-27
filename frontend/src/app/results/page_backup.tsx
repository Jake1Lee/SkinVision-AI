'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { FaComments, FaCog } from 'react-icons/fa';

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: number, text: string, isUser: boolean, timestamp: Date}>>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you understand your skin analysis results. I have access to your uploaded image and the classification results. Feel free to ask me anything!",
      isUser: false,
      timestamp: new Date()
    }
  ]);  const [chatInput, setChatInput] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [tempApiKey, setTempApiKey] = useState<string>('');
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  useEffect(() => {
    // Retrieve the uploaded image from local storage
    const image = localStorage.getItem('uploadedImage');
    if (image) {
      setUploadedImage(image);
    }

    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('chatGptApiKey');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setTempApiKey(savedApiKey);
    }

    const fetchData = async () => {      try {
        const filename = localStorage.getItem('uploadedImageName') || 'skin_lesion.jpg';
        const model = localStorage.getItem('selectedModel') || 'resnet50';
        setSelectedModel(model);

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
    };    fetchData();
  }, [searchParams]);

  // Auto-scroll chat messages to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages]);  const toggleChat = () => {
    setShowChat(!showChat);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (!showSettings) {
      setTempApiKey(apiKey); // Reset temp key when opening settings
    }
  };

  const saveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('chatGptApiKey', tempApiKey);
    setShowSettings(false);
  };

  const handleSettingsKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveApiKey();
    }
  };
  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');

    // If API key is available, use ChatGPT API, otherwise use local responses
    if (apiKey && apiKey.startsWith('sk-')) {
      try {
        const aiResponse = await callChatGPTAPI(currentInput);
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error('ChatGPT API error:', error);
        // Fallback to local response
        const fallbackResponse = generateAIResponse(currentInput);
        const aiMessage = {
          id: Date.now() + 1,
          text: `Sorry, I couldn't connect to ChatGPT API. Here's a local response: ${fallbackResponse}`,
          isUser: false,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }
    } else {
      // Use local AI response simulation
      setTimeout(() => {
        const aiResponse = generateAIResponse(currentInput);
        const aiMessage = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
      }, 1000);
    }
  };
  const getMedicalAnalysisPrompt = (): string => {
    const lesionCodes = Object.keys(analysisResults || {}).map(code => {
      const result = analysisResults![code];
      return `${code}: ${result.name} (${result.probability.toFixed(2)}% confidence)`;
    }).join('\n');

    return `Vous êtes un assistant médical IA spécialisé dans l'analyse des lésions cutanées. 
    
CONTEXTE MÉDICAL:
- Image de lésion cutanée analysée par IA
- Modèle utilisé: ${selectedModel}
- Prédiction principale: ${topPrediction ? `${topPrediction.code} - ${topPrediction.name} (${topPrediction.probability.toFixed(2)}% de confiance)` : 'Non disponible'}

CLASSIFICATIONS DÉTECTÉES:
${lesionCodes}

CODES DE CLASSIFICATION:
Les codes suivent le format: [mélanocytaire/non-mélanocytaire], [bénin/malin/indéterminé], [type histologique], [sous-type], [localisation/caractéristique]

INSTRUCTIONS:
1. Analysez l'image de la lésion cutanée en corrélation avec les résultats de l'IA
2. Commentez la cohérence entre l'apparence visuelle et les prédictions
3. Identifiez les caractéristiques dermoscopiques observables
4. Évaluez le niveau de confiance des prédictions
5. Recommandez des actions cliniques appropriées

IMPORTANT: Rappelez toujours que ceci est un outil d'aide au diagnostic et qu'une consultation médicale est nécessaire pour un diagnostic définitif.`;
  };

  const callChatGPTAPI = async (userInput: string, includeImage: boolean = false): Promise<string> => {
    const isDetectedImageAnalysisRequest = userInput.toLowerCase().includes('analyze') || 
                                           userInput.toLowerCase().includes('analyse') ||
                                           userInput.toLowerCase().includes('examine') ||
                                           userInput.toLowerCase().includes('look at') ||
                                           userInput.toLowerCase().includes('medical') ||
                                           userInput.toLowerCase().includes('diagnostic') ||
                                           userInput.toLowerCase().includes('rapport');

    const shouldUseVisionAPI = (includeImage || isDetectedImageAnalysisRequest) && uploadedImage;
    const model = shouldUseVisionAPI ? 'gpt-4o' : 'gpt-3.5-turbo';

    let messages: any[] = [];

    if (shouldUseVisionAPI) {
      // Use medical analysis prompt for vision API
      messages = [
        {
          role: 'system',
          content: getMedicalAnalysisPrompt()
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: userInput
            },
            {
              type: 'image_url',
              image_url: {
                url: uploadedImage,
                detail: 'high'
              }
            }
          ]
        }
      ];
    } else {
      // Standard text-only conversation
      const contextualInfo = `
      User has uploaded a skin lesion image for analysis. Here are the current analysis results:
      - Top prediction: ${topPrediction ? `${topPrediction.name} (${topPrediction.code}) with ${topPrediction.probability.toFixed(2)}% confidence` : 'Not available'}
      - Model used: ${selectedModel}
      - Image uploaded: ${uploadedImage ? 'Yes' : 'No'}
      - Analysis results: ${analysisResults ? Object.keys(analysisResults).length + ' classifications available' : 'Not available'}
      
      Please provide helpful, medical-appropriate responses about the skin lesion analysis. Always remind users to consult healthcare professionals for proper diagnosis.
      `;

      messages = [
        {
          role: 'system',
          content: `You are an AI assistant helping users understand their skin lesion analysis results. ${contextualInfo}You should be helpful but always emphasize that this is not medical advice and users should consult healthcare professionals.`
        },
        {
          role: 'user',
          content: userInput
        }
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: shouldUseVisionAPI ? 1000 : 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const generateMedicalReport = async (): Promise<string> => {
    if (!apiKey || !uploadedImage || !topPrediction) {
      throw new Error('Données insuffisantes pour générer le rapport médical');
    }

    const reportPrompt = `Générez un rapport médical détaillé en français pour cette analyse de lésion cutanée.

STRUCTURE REQUISE:
=================

**RAPPORT D'ANALYSE DERMOSCOPIQUE**

**Informations Patient:**
- Date d'analyse: ${new Date().toLocaleDateString('fr-FR')}
- Méthode: Intelligence Artificielle (${selectedModel})

**Observations Cliniques:**
[Décrivez l'apparence visuelle de la lésion basée sur l'image]

**Résultats de l'Analyse IA:**
- Classification principale: ${topPrediction.code} - ${topPrediction.name}
- Niveau de confiance: ${topPrediction.probability.toFixed(2)}%

**Classifications Alternatives:**
${Object.entries(analysisResults || {})
  .sort(([,a]: [string, any], [,b]: [string, any]) => b.probability - a.probability)
  .slice(1, 4)
  .map(([code, result]: [string, any], index) => 
    `${index + 2}. ${code} - ${result.name} (${result.probability.toFixed(2)}%)`
  ).join('\n')}

**Analyse Dermoscopique:**
[Commentaires sur les caractéristiques observées]

**Interprétation:**
[Évaluation clinique basée sur les résultats]

**Recommandations:**
[Actions cliniques recommandées]

**Limitations:**
Cette analyse par IA constitue un outil d'aide au diagnostic. Un examen clinique par un dermatologue reste indispensable pour établir un diagnostic définitif et déterminer la conduite thérapeutique appropriée.

**Signature Numérique:**
Analyse automatisée - SkinVision AI v1.0

IMPORTANT: Générez un rapport médical complet, professionnel et détaillé en français, en analysant attentivement l'image fournie.`;

    try {
      const reportContent = await callChatGPTAPI(reportPrompt, true);
      return reportContent;
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      throw error;
    }
  };

  const downloadPDFReport = async () => {
    try {
      const reportContent = await generateMedicalReport();
      
      // Create a simple text-based PDF content (you could enhance this with a proper PDF library)
      const element = document.createElement('a');
      const file = new Blob([reportContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `rapport_medical_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      // Add success message to chat
      const successMessage = {
        id: Date.now(),
        text: "✅ Rapport médical généré et téléchargé avec succès!",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, successMessage]);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement du rapport:', error);
      const errorMessage = {
        id: Date.now(),
        text: "❌ Erreur lors de la génération du rapport médical. Veuillez vérifier votre clé API et réessayer.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };
    const input = userInput.toLowerCase();
    
    // Generate contextual responses based on analysis results
    if (input.includes('top prediction') || input.includes('most likely')) {
      if (topPrediction) {
        return `Based on the ${selectedModel} model analysis, the top prediction is "${topPrediction.name}" (${topPrediction.code}) with a confidence of ${topPrediction.probability.toFixed(2)}%. This classification was made by analyzing the uploaded skin lesion image.`;
      }
      return "I don't have access to the top prediction data yet. Please make sure the analysis has completed.";
    }
    
    if (input.includes('image') || input.includes('photo') || input.includes('picture')) {
      return `I can see your uploaded skin lesion image. The image has been analyzed using the ${selectedModel} model. Would you like me to explain what the model detected or discuss the classification results?`;
    }
    
    if (input.includes('model') || input.includes('algorithm')) {
      return `Your analysis was performed using the ${selectedModel} model. ${selectedModel === 'resnet50' ? 'ResNet50 is a deep residual network with 50 layers, known for its accuracy in image classification tasks.' : 'InceptionV3 is Google\'s inception architecture designed for efficient feature extraction and pattern recognition.'} Would you like to know more about how it works?`;
    }
    
    if (input.includes('confident') || input.includes('accuracy') || input.includes('sure')) {
      if (topPrediction) {
        const confidence = topPrediction.probability;
        if (confidence > 80) {
          return `The model shows high confidence (${confidence.toFixed(2)}%) in its prediction. This suggests the features detected in your image strongly match the characteristics of "${topPrediction.name}".`;
        } else if (confidence > 50) {
          return `The model shows moderate confidence (${confidence.toFixed(2)}%) in its prediction. This means there are some matching features, but you might want to consider the other top predictions as well.`;
        } else {
          return `The model shows lower confidence (${confidence.toFixed(2)}%) in its prediction. This suggests the lesion may have ambiguous features or might require professional medical evaluation.`;
        }
      }
    }
    
    if (input.includes('other') || input.includes('alternative') || input.includes('second')) {
      if (analysisResults) {
        const sortedResults = Object.entries(analysisResults)
          .sort(([,a]: [string, any], [,b]: [string, any]) => b.probability - a.probability)
          .slice(1, 4);
        
        if (sortedResults.length > 0) {
          const alternatives = sortedResults.map(([code, result]: [string, any], index) => 
            `${index + 2}. ${result.name} (${code}): ${result.probability.toFixed(2)}%`
          ).join('\n');
          
          return `Here are the top alternative predictions:\n${alternatives}\n\nThese represent other possible classifications the model considered based on the image features.`;
        }
      }
    }
    
    if (input.includes('what') && (input.includes('mean') || input.includes('is'))) {
      if (topPrediction) {
        return `"${topPrediction.name}" refers to a specific type of skin lesion. Each classification code (like ${topPrediction.code}) represents a different category of skin condition that the AI model has been trained to recognize. Would you like me to explain more about this specific classification?`;
      }
    }
    
    if (input.includes('help') || input.includes('explain') || input.includes('understand')) {
      return `I can help you understand various aspects of your results:
      
• The classification predictions and their confidence levels
• What the different skin lesion types mean
• How the AI model analyzed your image
• The significance of the probability scores

What specific aspect would you like me to explain?`;
    }
    
    // Default responses
    const defaultResponses = [
      `I'm here to help you understand your skin analysis results. The AI model has processed your image and provided classification predictions. What would you like to know more about?`,
      `Your image has been analyzed using advanced AI technology. I can explain the results, discuss the confidence levels, or help you understand what the predictions mean. What interests you most?`,
      `Based on your uploaded image and the AI analysis, I can provide insights about the classification results. Feel free to ask about specific predictions, model confidence, or what the results might indicate.`
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

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
        {/* Top Section with Image and Results */}
        <div className="flex flex-col md:flex-row gap-4 items-start mb-6">
          {/* Image Column - Always visible */}
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
            <h1 className="text-2xl font-bold mb-4 text-white" style={{ fontFamily: 'Red Rose', fontWeight: 600 }}>Analysis Results</h1>
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
          </div>
        </div>
        
        {data.labels.length > 0 && data.datasets[0].data.length > 0 && (
          <div className={styles.chartContainer}>
            <Bar data={data} options={options} />
          </div>
        )}
      </GlassCard>
      
      {/* Floating Chat Button */}
      <div className={styles.chatButtonContainer}>
        <button 
          className={styles.chatButton}
          onClick={toggleChat}
          aria-label="Chat with AI assistant"
        >
          <FaComments size={24} />
        </button>
          {/* Chat Interface */}
        {showChat && (
          <div className={styles.chatInterface}>            <div className={styles.chatHeader}>
              <h3>AI Assistant</h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button 
                  className={styles.settingsButton}
                  onClick={toggleSettings}
                  aria-label="Settings"
                >
                  <FaCog />
                </button>
                <button onClick={toggleChat}>×</button>
              </div>
              
              {/* Settings Modal */}
              {showSettings && (
                <div className={styles.settingsModal}>
                  <div className={styles.settingsModalHeader}>
                    <h4>Settings</h4>
                    <button 
                      className={styles.settingsModalClose}
                      onClick={toggleSettings}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className={styles.apiKeySection}>
                    <label htmlFor="apiKey">ChatGPT API Key:</label>
                    <input
                      id="apiKey"
                      type="password"
                      value={tempApiKey}
                      onChange={(e) => setTempApiKey(e.target.value)}
                      onKeyPress={handleSettingsKeyPress}
                      placeholder="sk-..."
                      className={styles.apiKeyInput}
                    />
                    <button 
                      onClick={saveApiKey}
                      className={styles.saveButton}
                    >
                      Save API Key
                    </button>
                    
                    <div className={`${styles.apiStatus} ${apiKey ? styles.apiStatusConnected : styles.apiStatusDisconnected}`}>
                      {apiKey ? '✓ API Key Configured' : '⚠ No API Key Set'}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.chatMessages} ref={chatMessagesRef}>
              {chatMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`${styles.chatMessage} ${message.isUser ? styles.userMessage : ''}`}
                >
                  <p>{message.text}</p>
                  <span className={styles.timestamp}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
            <div className={styles.chatInputContainer}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your results, image analysis, or model predictions..." 
                className={styles.chatInput}
              />
              <button 
                onClick={sendMessage}
                className={styles.chatSendButton}
                disabled={!chatInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
