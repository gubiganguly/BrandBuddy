// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRBqVA2fVWmnb3IBm2zxBc1eKPpjvyogE",
  authDomain: "brandbuddy-565bd.firebaseapp.com",
  projectId: "brandbuddy-565bd",
  storageBucket: "brandbuddy-565bd.firebasestorage.app",
  messagingSenderId: "842415349413",
  appId: "1:842415349413:web:10e3532ffde976b3da374c",
  measurementId: "G-LBVNDZT0E2"
};

// Initialize Firebase (avoid multiple initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics };
export default app;