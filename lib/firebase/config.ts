// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRBqVA2fVWmnb3IBm2zxBc1eKPpjvyogE",
  authDomain: "brandbuddy-565bd.firebaseapp.com",
  projectId: "brandbuddy-565bd",
  storageBucket: "brandbuddy-565bd.firebasestorage.app",
  messagingSenderId: "842415349413",
  appId: "1:842415349413:web:10e3532ffde976b3da374c",
  measurementId: "G-LBVNDZT0E2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);