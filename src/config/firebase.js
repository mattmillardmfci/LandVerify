/**
 * Firebase Configuration
 * Initialize Firebase and export common services
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase config - replace with your actual config from Firebase Console
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDZjzCNPwXi_TUCKQxLDafeFBzJeTC-i_Q",
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "landverify-46eb6.firebaseapp.com",
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "landverify-46eb6",
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "landverify-46eb6.firebasestorage.app",
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "590411644837",
	appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:590411644837:web:a515380ae43b9b136a324c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
