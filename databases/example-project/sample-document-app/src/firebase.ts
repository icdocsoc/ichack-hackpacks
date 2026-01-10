// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyATp2urlrzqezJG4xJuPGp7iFSNyW0P7rE",
  authDomain: "sample-project-44e1c.firebaseapp.com",
  projectId: "sample-project-44e1c",
  storageBucket: "sample-project-44e1c.firebasestorage.app",
  messagingSenderId: "144612313940",
  appId: "1:144612313940:web:4bb3250db12ca0e63c96c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialise Auth
export const auth = getAuth(app);
// Initialise Firestore
export const db = getFirestore(app);