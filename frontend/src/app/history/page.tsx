'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import GlassCard from '@/components/GlassCard';
import BackButton from '@/components/BackButton';
import { FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import { scanHistoryService, ScanRecord } from '@/services/scanHistoryService';
import styles from './History.module.css';

const History = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [scanHistory, setScanHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
      return;
    }

    // Load scan history from Firebase
    const loadScanHistory = async () => {
      try {
        const scans = await scanHistoryService.getUserScans(currentUser.uid);
        setScanHistory(scans);
      } catch (error) {
        console.error('Error loading scan history from Firebase:', error);
        // Try to migrate localStorage data as fallback
        await scanHistoryService.migrateLocalStorageToFirebase(currentUser.uid);
        // Try loading again after migration
        try {
          const scans = await scanHistoryService.getUserScans(currentUser.uid);
          setScanHistory(scans);
        } catch (migrationError) {
          console.error('Error after migration attempt:', migrationError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadScanHistory();
  }, [currentUser, router]);

  const handleDownloadPDF = async (scanId: string | undefined) => {
    if (!scanId) {
      alert('Scan ID not available');
      return;
    }
    
    const scan = scanHistory.find(s => s.id === scanId);
    if (scan && scan.pdfReport) {
      try {
        console.log('📥 Downloading PDF from Firebase:', scan.pdfReport);
        
        // Fetch the PDF from Firebase Storage URL
        const response = await fetch(scan.pdfReport);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF from cloud storage');
        }
        
        const blob = await response.blob();
        
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        
        // Extract date from timestamp (handle different timestamp formats)
        let dateString = 'unknown';
        if (typeof scan.timestamp === 'string') {
          dateString = scan.timestamp.includes('T') ? scan.timestamp.split('T')[0] : scan.timestamp;
        }
        
        link.download = scan.pdfFileName || `medical_report_${dateString}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        URL.revokeObjectURL(url);
        
        console.log('✅ PDF downloaded successfully');
      } catch (error) {
        console.error('Error downloading PDF:', error);
        alert('Error downloading PDF report. The file might not be available in cloud storage.');
      }
    } else {
      alert('PDF report not available for this scan.');
    }
  };

  const handleViewResults = (scan: ScanRecord) => {
    // Store the scan data in localStorage and navigate to results
    localStorage.setItem('uploadedImage', scan.imageUrl); // Use imageUrl instead of image
    localStorage.setItem('uploadedImageName', scan.imageName);
    localStorage.setItem('selectedModel', scan.selectedModel);
    localStorage.setItem('analysisResults', JSON.stringify(scan.analysisResults));
    localStorage.setItem('patientData', JSON.stringify(scan.patientData));
    
    router.push('/results');
  };

  const handleDeleteScan = async (scanId: string | undefined) => {
    if (!scanId) {
      alert('Scan ID not available');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this scan record?')) {
      try {
        const scan = scanHistory.find(s => s.id === scanId);
        if (scan) {
          // Delete from Firebase
          await scanHistoryService.deleteScan(scanId, scan.imageUrl, scan.pdfReport);
          
          // Update local state
          const updatedHistory = scanHistory.filter(s => s.id !== scanId);
          setScanHistory(updatedHistory);
          
          console.log('✅ Scan deleted from Firebase');
        }
      } catch (error) {
        console.error('Error deleting scan:', error);
        alert('Error deleting scan. Please try again.');
      }
    }
  };

  const formatDate = (timestamp: string | any) => {
    try {
      if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
      }
      // Handle Firestore Timestamp objects
      if (timestamp && typeof timestamp.toDate === 'function') {
        return timestamp.toDate().toLocaleString();
      }
      return 'Unknown date';
    } catch {
      return 'Unknown date';
    }
  };

  const getModelDisplayName = (modelId: string) => {
    const modelNames: { [key: string]: string } = {
      'resnet50': 'ResNet50',
      'inceptionv3': 'InceptionV3',
      'inceptionresnetv2': 'InceptionResNetV2'
    };
    return modelNames[modelId] || modelId;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-white text-xl">Loading scan history...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <GlassCard backButton={<BackButton />}>
        <div className={styles.container}>
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Scan History</h1>
          
          {scanHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <p className="text-white text-lg mb-4">No scan history found.</p>
              <p className="text-white opacity-90">Upload and analyze your first skin lesion to start building your history.</p>
            </div>
          ) : (
            <div className={styles.historyList}>
              {scanHistory.map((scan) => (
                <div key={scan.id} className={styles.scanCard}>
                  <div className={styles.scanHeader}>
                    <div className={styles.scanInfo}>
                      <h3 className={styles.scanTitle}>
                        Scan - {formatDate(scan.timestamp)}
                      </h3>
                      <p className={styles.scanModel}>
                        Model: {getModelDisplayName(scan.selectedModel)}
                      </p>
                    </div>
                    <div className={styles.scanActions}>
                      <button
                        onClick={() => handleViewResults(scan)}
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        title="View Results"
                      >
                        <FaEye />
                      </button>
                      {scan.pdfReport ? (
                        <button
                          onClick={() => handleDownloadPDF(scan.id)}
                          className={`${styles.actionButton} ${styles.downloadButton}`}
                          title="Download PDF Report"
                        >
                          <FaDownload />
                        </button>
                      ) : (
                        <button
                          className={`${styles.actionButton} ${styles.downloadButton} ${styles.disabled}`}
                          title="PDF Report not available"
                          disabled
                        >
                          <FaDownload />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteScan(scan.id)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        title="Delete Scan"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.scanContent}>
                    <div className={styles.imageSection}>
                      <img 
                        src={scan.imageUrl}
                        alt="Skin lesion scan" 
                        className={styles.scanImage}
                      />
                    </div>
                    
                    <div className={styles.patientInfo}>
                      <h4 className={styles.sectionTitle}>Patient Information</h4>
                      <div className={styles.patientDetails}>
                        <p><strong>Age:</strong> {scan.patientData.age}</p>
                        <p><strong>Gender:</strong> {scan.patientData.gender}</p>
                        <p><strong>Location:</strong> {scan.patientData.placement}</p>
                        {scan.patientData.symptoms && (
                          <p><strong>Symptoms:</strong> {scan.patientData.symptoms}</p>
                        )}
                        {scan.patientData.medicalHistory && (
                          <p><strong>Medical History:</strong> {scan.patientData.medicalHistory}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.resultsPreview}>
                      <h4 className={styles.sectionTitle}>Analysis Results</h4>
                      {scan.analysisResults && scan.analysisResults.topPrediction ? (
                        <div className={styles.topPrediction}>
                          <p><strong>Top Prediction:</strong> {scan.analysisResults.topPrediction.name}</p>
                          <p><strong>Confidence:</strong> {scan.analysisResults.topPrediction.probability?.toFixed(2)}%</p>
                          <p><strong>PDF Report:</strong> 
                            <span style={{ 
                              color: scan.pdfReport ? '#4CAF50' : '#ff9800',
                              marginLeft: '8px',
                              fontWeight: '600'
                            }}>
                              {scan.pdfReport ? '✅ Available' : '⚠️ Not generated'}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-white opacity-75">Analysis results not available</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default History;
