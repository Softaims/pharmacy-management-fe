/* eslint-env serviceworker */
/* global firebase, importScripts */

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyD069uhQv7OD86sMBQSg8Xj01YVbAHTy3I",
  authDomain: "pharmacy-app-e1013.firebaseapp.com",
  projectId: "pharmacy-app-e1013",
  storageBucket: "pharmacy-app-e1013.firebasestorage.app",
  messagingSenderId: "1043708916422",
  appId: "1:1043708916422:web:e892667f2408b338b1ddc7",
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
