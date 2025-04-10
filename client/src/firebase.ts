// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBITO4Oog1g4F9R1mhB6C-kE6JDblrVOmA",
  authDomain: "prompt-app-be1a2.firebaseapp.com",
  projectId: "prompt-app-be1a2",
  storageBucket: "prompt-app-be1a2.firebasestorage.app",
  messagingSenderId: "287158164729",
  appId: "1:287158164729:web:b2cdeccc9262861eb41628",
  measurementId: "G-PPYWVTZ73L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
