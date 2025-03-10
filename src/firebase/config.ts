
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                     // Replace with your Firebase API key
  authDomain: "YOUR_AUTH_DOMAIN",             // Replace with your Firebase auth domain
  projectId: "YOUR_PROJECT_ID",               // Replace with your Firebase project ID
  storageBucket: "YOUR_STORAGE_BUCKET",       // Replace with your Firebase storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your Firebase messaging sender ID
  appId: "YOUR_APP_ID",                       // Replace with your Firebase app ID
  databaseURL: "YOUR_DATABASE_URL"            // Replace with your Firebase realtime database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;

