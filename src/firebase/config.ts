
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Using mock Firebase configuration for preview
const firebaseConfig = {
  apiKey: "AIzaSyA1234567890abcdefghijklmnopqrstuv",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890",
  databaseURL: "https://demo-project.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const realtimeDb = getDatabase(app);

export default app;
