// utils/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCvIu0cG6f6qeoB16jzr34TGdAd1dqe0tE",
  authDomain: "pranavdroptaxi-51778.firebaseapp.com",
  projectId: "pranavdroptaxi-51778",
  storageBucket: "pranavdroptaxi-51778.appspot.com", // fixed typo: `.app` → `.appspot.com`
  messagingSenderId: "154528385131",
  appId: "1:154528385131:web:ba63977d5e1f46e18a092e"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Export Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
