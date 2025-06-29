import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import { 
  ref,
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase';

export interface ScanRecord {
  id?: string;
  userId: string;
  timestamp: Timestamp | string | FieldValue;
  imageUrl: string;
  imageName: string;
  patientData: {
    age: string;
    gender: string;
    placement: string;
    symptoms: string;
    medicalHistory: string;
  };
  selectedModel: string;
  analysisResults: {
    predictions: any;
    topPrediction: {
      code: string;
      name: string;
      probability: number;
    };
  };
  pdfReport?: string;
  pdfFileName?: string;
}

class ScanHistoryService {
  private collectionName = 'scanHistory';

  /**
   * Save a new scan to Firestore with image upload to Firebase Storage
   */
  async saveScan(
    userId: string,
    imageBlob: Blob,
    imageName: string,
    patientData: any,
    selectedModel: string,
    analysisResults: any
  ): Promise<string> {
    try {
      console.log('🔄 Starting scan save to Firebase...');
      
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `scan-images/${userId}/${Date.now()}_${imageName}`);
      console.log('📤 Uploading image to Firebase Storage...');
      const uploadResult = await uploadBytes(imageRef, imageBlob);
      const imageUrl = await getDownloadURL(uploadResult.ref);
      console.log('✅ Image uploaded successfully:', imageUrl);

      // Create scan record
      const scanData: Omit<ScanRecord, 'id'> = {
        userId,
        timestamp: serverTimestamp(),
        imageUrl,
        imageName,
        patientData,
        selectedModel,
        analysisResults
      };

      // Save to Firestore
      console.log('💾 Saving scan data to Firestore...');
      const docRef = await addDoc(collection(db, this.collectionName), scanData);
      console.log('✅ Scan saved to Firebase with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error saving scan to Firebase:', error);
      
      // Provide user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('Permission denied for file upload. Please check your authentication.');
        } else if (error.message.includes('firestore/permission-denied')) {
          throw new Error('Permission denied for database access. Please check your authentication.');
        } else if (error.message.includes('storage/quota-exceeded')) {
          throw new Error('Storage quota exceeded. Please contact support.');
        }
      }
      
      throw error;
    }
  }

  /**
   * Get all scans for a user from Firestore
   */
  async getUserScans(userId: string): Promise<ScanRecord[]> {
    try {
      console.log('🔍 Fetching user scans from Firebase...');
      
      // Try the optimized query first (requires index)
      try {
        const q = query(
          collection(db, this.collectionName),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const scans: ScanRecord[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          scans.push({
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to ISO string for consistency
            timestamp: data.timestamp instanceof Timestamp 
              ? data.timestamp.toDate().toISOString() 
              : data.timestamp
          } as ScanRecord);
        });

        console.log(`✅ Retrieved ${scans.length} scans from Firebase (optimized)`);
        return scans;
        
      } catch (indexError) {
        console.warn('⚠️ Index not available, falling back to simple query...');
        
        // Fallback: Simple query without orderBy (doesn't require index)
        const simpleQuery = query(
          collection(db, this.collectionName),
          where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(simpleQuery);
        const scans: ScanRecord[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          scans.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp 
              ? data.timestamp.toDate().toISOString() 
              : data.timestamp
          } as ScanRecord);
        });

        // Sort manually by timestamp (descending)
        scans.sort((a, b) => {
          const timeA = new Date(a.timestamp as string).getTime();
          const timeB = new Date(b.timestamp as string).getTime();
          return timeB - timeA;
        });

        console.log(`✅ Retrieved ${scans.length} scans from Firebase (fallback)`);
        return scans;
      }
      
    } catch (error) {
      console.error('❌ Error retrieving scans from Firebase:', error);
      throw error;
    }
  }

  /**
   * Update a scan with PDF report information
   */
  async updateScanWithPDF(
    scanId: string,
    pdfBlob: Blob,
    pdfFileName: string
  ): Promise<void> {
    try {
      // Upload PDF to Firebase Storage
      const pdfRef = ref(storage, `pdf-reports/${scanId}/${pdfFileName}`);
      const uploadResult = await uploadBytes(pdfRef, pdfBlob);
      const pdfUrl = await getDownloadURL(uploadResult.ref);

      // Update scan record with PDF URL
      const scanRef = doc(db, this.collectionName, scanId);
      await updateDoc(scanRef, {
        pdfReport: pdfUrl,
        pdfFileName: pdfFileName
      });

      console.log('✅ PDF report added to scan in Firebase');
    } catch (error) {
      console.error('❌ Error updating scan with PDF:', error);
      throw error;
    }
  }

  /**
   * Delete a scan and its associated files
   */
  async deleteScan(scanId: string, imageUrl: string, pdfReport?: string): Promise<void> {
    try {
      // Delete scan document from Firestore
      await deleteDoc(doc(db, this.collectionName, scanId));

      // Delete image from Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(console.warn);
      }

      // Delete PDF from Storage if exists
      if (pdfReport) {
        const pdfRef = ref(storage, pdfReport);
        await deleteObject(pdfRef).catch(console.warn);
      }

      console.log('✅ Scan deleted from Firebase');
    } catch (error) {
      console.error('❌ Error deleting scan from Firebase:', error);
      throw error;
    }
  }

  /**
   * Convert base64 image to blob for upload
   */
  base64ToBlob(base64: string, mimeType: string = 'image/jpeg'): Blob {
    try {
      console.log('🔄 Converting base64 to blob...');
      console.log('Base64 data length:', base64.length);
      console.log('Base64 data preview:', base64.substring(0, 50) + '...');
      
      // Handle different base64 formats
      let base64Data = base64;
      
      // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
      if (base64Data.includes(',')) {
        // Extract MIME type from data URL if available
        const mimeMatch = base64Data.match(/data:([^;]+)/);
        if (mimeMatch && mimeType === 'image/jpeg') {
          mimeType = mimeMatch[1];
        }
        base64Data = base64Data.split(',')[1];
      }
      
      // Validate base64 string
      if (!base64Data || base64Data.length === 0) {
        throw new Error('Empty base64 data');
      }
      
      // Clean base64 data - remove any whitespace or newlines
      base64Data = base64Data.replace(/\s/g, '');
      
      // Check if it's valid base64 (more lenient regex)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(base64Data)) {
        console.warn('⚠️ Base64 validation failed, data preview:', base64Data.substring(0, 100));
        throw new Error(`Invalid base64 format: contains invalid characters`);
      }
      
      // Ensure proper padding
      while (base64Data.length % 4) {
        base64Data += '=';
      }
      
      // Try to decode base64
      let byteCharacters: string;
      try {
        byteCharacters = atob(base64Data);
      } catch (atobError) {
        console.error('❌ atob() failed:', atobError);
        throw new Error('Failed to decode base64 data - invalid encoding');
      }
      
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      
      console.log('✅ Base64 to blob conversion successful, size:', blob.size);
      return blob;
      
    } catch (error) {
      console.error('❌ Error converting base64 to blob:', error);
      // Don't create fallback with the original string as it would corrupt the data
      throw new Error(`Failed to convert base64 to blob: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert various image formats to blob for upload
   */
  async imageToBlob(imageData: string): Promise<Blob> {
    try {
      console.log('🔄 Converting image data to blob...');
      
      // First validate the image data
      const validation = this.validateImageData(imageData);
      console.log('📋 Image validation result:', validation);
      
      if (!validation.isValid) {
        throw new Error(`Invalid image data: ${validation.error}`);
      }
      
      console.log('Image data type:', typeof imageData);
      console.log('Image data length:', imageData.length);
      console.log('Image data format:', validation.format);
      console.log('Image data starts with:', imageData.substring(0, 20));
      
      // Method 1: Handle data URLs (base64 encoded images)
      if (validation.format === 'data-url') {
        try {
          console.log('🔄 Converting data URL to blob...');
          return this.base64ToBlob(imageData);
        } catch (base64Error) {
          console.warn('⚠️ Data URL conversion failed:', base64Error);
          throw base64Error; // Don't continue with other methods for data URLs
        }
      }
      
      // Method 2: Handle plain base64 strings
      if (validation.format === 'base64') {
        try {
          console.log('🔄 Converting plain base64 to blob...');
          return this.base64ToBlob(imageData);
        } catch (base64Error) {
          console.warn('⚠️ Base64 conversion failed:', base64Error);
          throw base64Error; // Don't continue with other methods for base64
        }
      }
      
      // Method 3: Handle URLs (http/https/blob URLs)
      if (validation.format === 'url') {
        try {
          console.log('🔄 Fetching image from URL:', imageData.substring(0, 50) + '...');
          const response = await fetch(imageData);
          if (response.ok) {
            const blob = await response.blob();
            console.log('✅ URL to blob conversion successful, size:', blob.size, 'type:', blob.type);
            return blob;
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (urlError) {
          console.error('❌ URL fetch failed:', urlError);
          throw urlError;
        }
      }
      
      // If we get here, something went wrong with validation
      throw new Error(`Unsupported image format: ${validation.format}`);
      
    } catch (error) {
      console.error('❌ Image conversion failed:', error);
      throw error;
    }
  }

  /**
   * Validate image data format and basic integrity
   */
  validateImageData(imageData: string): { isValid: boolean; format: string; error?: string } {
    try {
      if (!imageData || typeof imageData !== 'string') {
        return { isValid: false, format: 'unknown', error: 'No image data provided or invalid type' };
      }

      if (imageData.length === 0) {
        return { isValid: false, format: 'empty', error: 'Empty image data' };
      }

      // Check for data URL format
      if (imageData.startsWith('data:')) {
        const mimeMatch = imageData.match(/data:([^;]+)/);
        const format = mimeMatch ? mimeMatch[1] : 'unknown';
        
        if (!imageData.includes(',')) {
          return { isValid: false, format, error: 'Invalid data URL format - missing comma separator' };
        }
        
        const base64Part = imageData.split(',')[1];
        if (!base64Part || base64Part.length === 0) {
          return { isValid: false, format, error: 'Empty base64 data in data URL' };
        }
        
        return { isValid: true, format: 'data-url', error: undefined };
      }

      // Check for URL format
      if (imageData.startsWith('http') || imageData.startsWith('blob:')) {
        return { isValid: true, format: 'url', error: undefined };
      }

      // Check for plain base64 (assume if it's a long string with base64 characters)
      if (imageData.length > 100) {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        const cleanData = imageData.replace(/\s/g, '');
        
        if (base64Regex.test(cleanData)) {
          return { isValid: true, format: 'base64', error: undefined };
        }
      }

      return { isValid: false, format: 'unknown', error: 'Unrecognized image data format' };
      
    } catch (error) {
      return { 
        isValid: false, 
        format: 'error', 
        error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Test Firebase connection and user permissions
   */
  async testConnection(userId: string): Promise<boolean> {
    try {
      console.log('🔌 Testing Firebase connection for user:', userId);
      
      // Check if user is authenticated
      if (!userId) {
        console.error('❌ No userId provided for connection test');
        return false;
      }
      
      // Test Firestore connection by attempting to get user's scan count
      const userScansRef = collection(db, this.collectionName);
      const q = query(userScansRef, where('userId', '==', userId), limit(1));
      
      console.log('📊 Testing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('✅ Query executed successfully, found', querySnapshot.size, 'documents');
      
      console.log('✅ Firebase connection test successful');
      return true;
      
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      return false;
    }
  }

  /**
   * Debug authentication and permissions
   */
  async debugAuth(): Promise<void> {
    try {
      // Import auth functions
      const { getAuth } = await import('firebase/auth');
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      console.log('🔍 Authentication Debug Info:');
      console.log('- Current User:', currentUser);
      console.log('- User ID:', currentUser?.uid);
      console.log('- User Email:', currentUser?.email);
      console.log('- User Email Verified:', currentUser?.emailVerified);
      console.log('- Collection Name:', this.collectionName);
      
      if (currentUser) {
        // Try to get ID token
        try {
          const idToken = await currentUser.getIdToken();
          console.log('- ID Token Available:', !!idToken);
          console.log('- ID Token Preview:', idToken?.substring(0, 50) + '...');
        } catch (tokenError) {
          console.error('❌ Error getting ID token:', tokenError);
        }
      }
      
    } catch (error) {
      console.error('❌ Error debugging auth:', error);
    }
  }
}

// Export a singleton instance
export const scanHistoryService = new ScanHistoryService();