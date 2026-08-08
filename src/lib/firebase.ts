import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
export { firebaseConfig };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Enable tab-isolated session persistence
setPersistence(auth, browserSessionPersistence).catch((err) => {
  console.error("Firebase Auth persistence setup failed:", err);
});

// Library & Automation Firebase config (aibrand-vision)
export const libFirebaseConfig = {
  apiKey: "AIzaSyCaswftcLmfIepG_F8fzizqGXFl5mnXvj8",
  authDomain: "aibrand-vision.firebaseapp.com",
  projectId: "aibrand-vision",
  storageBucket: "aibrand-vision.firebasestorage.app",
  messagingSenderId: "36898907108",
  appId: "1:36898907108:web:423352bb5b0f5825d65df1",
  measurementId: "G-G0CFX66Q3V"
};

const libApp = getApps().find(a => a.name === 'LibraryApp') || initializeApp(libFirebaseConfig, 'LibraryApp');
export const libDb = getFirestore(libApp);
export const libStorage = getStorage(libApp);

