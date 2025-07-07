// firebase.js or a separate fcm.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDegpwFGiK_7A35-LKFDQENwQaaT9qX1uo",
  authDomain: "push-notification-f9f92.firebaseapp.com",
  projectId: "push-notification-f9f92",
  storageBucket: "push-notification-f9f92.firebasestorage.app",
  messagingSenderId: "925782573398",
  appId: "1:925782573398:web:8e29dff903f816a45596f7",
  measurementId: "G-7T0VS5YZP7"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Ask permission and get token
export const requestPermission = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BF6uwVQtgAsinOb-bFAQIYPLvFEnv8w0-HlItAZUxKz0ze0dYSe_3PUkk3g121wpfxjkEoAU26h7LouX0bBt790"
    });
    console.log("FCM Token:", token);
    // Save this token to your DB to send notifications later
  } catch (err) {
    console.error("Permission denied or error occurred", err);
  }
};

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received in foreground: ", payload);
  // You can show a custom in-app toast or popup here
});
