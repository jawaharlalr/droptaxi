// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAr1pQd8dCjmYBN4ujGORYSCLb4GhEUddA",
  authDomain: "pranavdroptaxi-9e31b.firebaseapp.com",
  projectId: "pranavdroptaxi-9e31b",
  storageBucket: "pranavdroptaxi-9e31b.appspot.com",
  messagingSenderId: "610007777923",
  appId: "1:610007777923:web:d2071b21ea6000fd5f11b6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
