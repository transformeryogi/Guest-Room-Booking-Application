// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2T-7Jc2k7kWCxHT188N-GU5Kl8G3VyFA",
  authDomain: "yogesh-in-paavangal.firebaseapp.com",
  projectId: "yogesh-in-paavangal",
  storageBucket: "yogesh-in-paavangal.firebasestorage.app",
  messagingSenderId: "357836396613",
  appId: "1:357836396613:web:1ccd009b00560dd8f8eb2c",
  measurementId: "G-4BTS609DBE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { app, analytics, db };