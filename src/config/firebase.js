/**
 * Firebase Configuration
 * Initialize Firebase and export common services
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config - replace with your actual config from Firebase Console
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKey",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "landverify-demo.firebaseapp.com",
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "landverify-demo",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "landverify-demo.appspot.com",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abc123def456",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
