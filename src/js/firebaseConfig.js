// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBgobrW_SzqAVxxQI-GP-xibMJUz4Znz3E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bby05project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bby05project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bby05project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdefghijklmnop",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://bby05project-default-rtdb.firebaseio.com/"
};

// Debug: show Firebase config but hide most of API key
console.log('Firebase config:', {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey.substring(0, 10) + '...' 
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with error handling
let db;
try {
  db = getFirestore(app);
  console.log('Firebase Firestore initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Firestore:', error);
  db = null;
}

// Export storage too
export const storage = getStorage(app);

export { db };
