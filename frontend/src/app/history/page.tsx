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
    const loadScanHistory = async () => {
      if (!currentUser) {
        router.push('/');
        return;
      }

      setLoading(true);
      try {
        const scans = await scanHistoryService.getUserScans(currentUser.uid);
        setScanHistory(scans);
        
        // Debug: Check how many scans have PDFs
        const scansWithPdf = scans.filter((scan: any) => scan.pdfReport);
        console.log(`📊 Loaded ${scans.length} scans, ${scansWithPdf.length} have PDFs`);
        
        if (scansWithPdf.length > 0) {
          console.log('📋 Sample PDF URLs:', scansWithPdf.slice(0, 2).map((scan: any) => ({
            id: scan.id,
            pdfUrl: scan.pdfReport?.substring(0, 100) + '...',
            fileName: scan.pdfFileName
          })));
        }
        
      } catch (error) {
        console.error('Error loading scan history:', error);
        // Note: setError state not defined, just log for now
      } finally {
        setLoading(false);
      }
    };

    loadScanHistory();
  }, [currentUser, router]);

  // Alternative download method using direct link navigation
  const downloadPDFDirect = (url: string, filename: string) => {
    console.log('🔗 Attempting direct download via link navigation...');
    
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add to document, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('✅ Direct download link clicked');
      return true;
    } catch (error) {
      console.error('❌ Direct download failed:', error);
      return false;
    }
  };

  // Debug function to inspect scan data
  const debugScanData = (scan: any) => {
    console.log('🔍 Debug scan data:', {
      id: scan.id,
      hasPdfReport: !!scan.pdfReport,
      pdfReportType: typeof scan.pdfReport,
      pdfReportLength: scan.pdfReport?.length,
      pdfReportPreview: scan.pdfReport?.substring(0, 100) + '...',
      pdfFileName: scan.pdfFileName,
      timestamp: scan.timestamp,
      timestampType: typeof scan.timestamp
    });
  };

  const handleDownloadPDF = async (scanId: string | undefined) => {
    if (!scanId) {
      console.warn('Scan ID not available');
      return;
    }
    
    const scan = scanHistory.find(s => s.id === scanId);
    if (!scan || !scan.pdfReport) {
      console.warn('PDF report not available for this scan.');
      return;
    }
    
    // Debug the scan data first
    debugScanData(scan);
    
    console.log('📥 Starting PDF download process...');
    
    // Calculate filename
    let dateString = 'unknown';
    try {
      if (scan.timestamp) {
        let date: Date;
        if (typeof scan.timestamp === 'string') {
          date = new Date(scan.timestamp);
        } else if (scan.timestamp && typeof scan.timestamp === 'object') {
          if ('toDate' in scan.timestamp && typeof scan.timestamp.toDate === 'function') {
            date = scan.timestamp.toDate();
          } else if ('seconds' in scan.timestamp) {
            date = new Date(scan.timestamp.seconds * 1000);
          } else {
            date = new Date();
          }
        } else {
          date = new Date();
        }
        dateString = date.toISOString().split('T')[0];
      }
    } catch (timestampError) {
      console.warn('Error parsing timestamp:', timestampError);
      dateString = new Date().toISOString().split('T')[0];
    }
    
    const fileName = scan.pdfFileName || `medical_report_${dateString}.pdf`;
    console.log('📄 Target filename:', fileName);
    
    // Method 1: Direct link download (most reliable, no fetch required)
    console.log('🔄 Attempting direct download method...');
    if (downloadPDFDirect(scan.pdfReport, fileName)) {
      console.log('✅ Direct download initiated');
      return;
    }
    
    // Method 2: Open in new tab as fallback (no fetch required)
    console.log('🔄 Fallback: Opening PDF in new tab...');
    try {
      const newTab = window.open(scan.pdfReport, '_blank');
      if (newTab) {
        console.log('✅ PDF opened in new tab');
      } else {
        console.warn('Popup blocked. URL:', scan.pdfReport);
      }
    } catch (error) {
      console.error('❌ All methods failed:', error);
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
      console.warn('Scan ID not available');
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
