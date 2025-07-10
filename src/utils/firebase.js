import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// ✅ Direct Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvIu0cG6f6qeoB16jzr34TGdAd1dqe0tE",
  authDomain: "pranavdroptaxi-51778.firebaseapp.com",
  projectId: "pranavdroptaxi-51778",
  storageBucket: "pranavdroptaxi-51778.appspot.com",
  messagingSenderId: "154528385131",
  appId: "1:154528385131:web:ba63977d5e1f46e18a092e"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
