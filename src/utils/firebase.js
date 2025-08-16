import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAr1pQd8dCjmYBN4ujGORYSCLb4GhEUddA",
  authDomain: "pranavdroptaxi-9e31b.firebaseapp.com",
  projectId: "pranavdroptaxi-9e31b",
  storageBucket: "pranavdroptaxi-9e31b.firebasestorage.app",
  messagingSenderId: "610007777923",
  appId: "1:610007777923:web:d2071b21ea6000fd5f11b6"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };