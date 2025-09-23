
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAuth } from "firebase/auth";   // 👈 import auth

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initialize Firebase app
const app = initializeApp(firebaseConfig);

// Firestore (database)
export const db = getFirestore(app);

// Auth (login/signup)
export const auth = getAuth(app);   // 👈 add this

// Cloud Messaging (for FCM tokens + receiving messages)
export const messaging = getMessaging(app);

export default app;
