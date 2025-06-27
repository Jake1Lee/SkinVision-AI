// Test Firebase integration
import { scanHistoryService } from '../services/scanHistoryService';

export const testFirebaseIntegration = async (userId: string) => {
  try {
    console.log('🧪 Testing Firebase integration...');
    
    // Test reading scans
    const scans = await scanHistoryService.getUserScans(userId);
    console.log(`✅ Successfully retrieved ${scans.length} scans from Firebase`);
    
    return true;
  } catch (error) {
    console.error('❌ Firebase integration test failed:', error);
    return false;
  }
};
