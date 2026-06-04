// src/firebaseConfig.js
// Central Firebase SDK initialization for Auth and Firestore.
// Replace the placeholder values below with your actual Firebase project config.

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBOu85QwpA98H3g1KYIahQS_joMKpmIlc0",
  authDomain: "confession-wala2.firebaseapp.com",
  projectId: "confession-wala2",
  storageBucket: "confession-wala2.firebasestorage.app",
  messagingSenderId: "582182557857",
  appId: "1:582182557857:web:23e4a664a2c4dd4a7f38e0",
  measurementId: "G-K98REC0HKG"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
