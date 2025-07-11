// firebase-messaging-sw.js

// Import scripts for Firebase
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize Firebase (same config as your main app)
firebase.initializeApp({
  apiKey: "AIzaSyCvIu0cG6f6qeoB16jzr34TGdAd1dqe0tE",
  authDomain: "pranavdroptaxi-51778.firebaseapp.com",
  projectId: "pranavdroptaxi-51778",
  storageBucket: "pranavdroptaxi-51778.appspot.com",
  messagingSenderId: "154528385131",
  appId: "1:154528385131:web:ba63977d5e1f46e18a092e"
});

// Get messaging instance
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log('📦 Received background message:', payload);

  const notificationTitle = payload.notification.title || 'Booking Alert';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new booking.',
    icon: '/logo192.png', // Optional: path to your app's icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
