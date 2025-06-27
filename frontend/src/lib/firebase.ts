import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyACqHZ2hzpjFQLIfFjbTzNYzNfM-eSyWrA",
  authDomain: "skinvision-ai-cc1af.firebaseapp.com",
  projectId: "skinvision-ai-cc1af",
  storageBucket: "skinvision-ai-cc1af.firebasestorage.app",
  messagingSenderId: "80016990380",
  appId: "1:80016990380:web:5a707b7cf84aa8c0e3bf09",
  measurementId: "G-0VLC95CFKD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;
