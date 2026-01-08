// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATp2urlrzqezJG4xJuPGp7iFSNyW0P7rE",
  authDomain: "sample-project-44e1c.firebaseapp.com",
  projectId: "sample-project-44e1c",
  storageBucket: "sample-project-44e1c.firebasestorage.app",
  messagingSenderId: "144612313940",
  appId: "1:144612313940:web:a7a16332f7fc02363c96c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);