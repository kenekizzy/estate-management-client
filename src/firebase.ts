// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FirebaseApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: (import.meta as any).env.VITE_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: (import.meta as any).env.VITE_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: (import.meta as any).env.VITE_FIREBASE_CONFIG_APP_ID
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);