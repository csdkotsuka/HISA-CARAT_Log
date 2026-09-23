import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

export const firebaseConfig = {
  apiKey: "AIzaSyBC3Sjol4A0oIpOjyjtRmV1WTn-f27q1oI",
  authDomain: "hisa-carat-log.firebaseapp.com",
  projectId: "hisa-carat-log",
  storageBucket: "hisa-carat-log.firebasestorage.app",
  messagingSenderId: "56716892358",
  appId: "1:56716892358:web:fd495a94815f891c641fc7",
  measurementId: "G-EEBG8SFBYY"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Initialize Analytics if supported
export let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics unsupported environment
  });
}
