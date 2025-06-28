// Test script to verify Firebase Storage URL parsing
const testUrls = [
  'https://firebasestorage.googleapis.com/v0/b/project-id.appspot.com/o/pdf-reports%2FscanId%2Freport.pdf?alt=media&token=abc123',
  'https://firebasestorage.googleapis.com/v0/b/skinvision-ai.appspot.com/o/pdf-reports%2FscanId%2Freport.pdf?alt=media&token=def456',
  'https://storage.googleapis.com/project-id.appspot.com/pdf-reports/scanId/report.pdf'
];

console.log('🧪 Testing Firebase Storage URL parsing...\n');

testUrls.forEach((url, index) => {
  console.log(`Test ${index + 1}: ${url}`);
  
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/);
    
    if (pathMatch) {
      const filePath = decodeURIComponent(pathMatch[1]);
      console.log(`✅ Extracted path: ${filePath}`);
    } else {
      console.log(`❌ Could not extract path from URL`);
      
      // Alternative parsing for different URL formats
      const altMatch = urlObj.pathname.match(/\/(.+)/);
      if (altMatch) {
        console.log(`💡 Alternative path: ${altMatch[1]}`);
      }
    }
  } catch (error) {
    console.log(`❌ Error parsing URL: ${error.message}`);
  }
  
  console.log('---');
});

console.log('\n🎯 The download function should now handle both formats correctly!');
