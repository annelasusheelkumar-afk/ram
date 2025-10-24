// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker
// "Default" Firebase app (important for Firebase App Hosting)
firebase.initializeApp({
  apiKey: "AIzaSyA18pgO65X8C1C1PgpJQl88BCJZ9uU9XMA",
  authDomain: "studio-2301500788-e948e.firebaseapp.com",
  projectId: "studio-2301500788-e948e",
  storageBucket: "studio-2301500788-e948e.appspot.com",
  messagingSenderId: "253318450593",
  appId: "1:253318450593:web:e41acc1af8d80aacf50fe0",
  measurementId: ""
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
