// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDegpwFGiK_7A35-LKFDQENwQaaT9qX1uo",
  authDomain: "push-notification-f9f92.firebaseapp.com",
  projectId: "push-notification-f9f92",
  storageBucket: "push-notification-f9f92.firebasestorage.app",
  messagingSenderId: "925782573398",
  appId: "1:925782573398:web:8e29dff903f816a45596f7",
  measurementId: "G-7T0VS5YZP7"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[🔥 Firebase SW] Background message received:', payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: "/icon.png", // optional
  });
});
