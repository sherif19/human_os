import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const libFirebaseConfig = {
  apiKey: "AIzaSyCaswftcLmfIepG_F8fzizqGXFl5mnXvj8",
  authDomain: "aibrand-vision.firebaseapp.com",
  projectId: "aibrand-vision",
  storageBucket: "aibrand-vision.firebasestorage.app",
  messagingSenderId: "36898907108",
  appId: "1:36898907108:web:423352bb5b0f5825d65df1"
};

const app = initializeApp(libFirebaseConfig, 'LibraryApp');
const db = getFirestore(app);

async function run() {
  console.log("Querying brandLibrary collection...");
  const snap = await getDocs(collection(db, 'brandLibrary'));
  console.log(`Found ${snap.size} documents.`);
  snap.forEach(doc => {
    console.log(`- ID: ${doc.id}, Title: ${doc.data().title}, Type: ${doc.data().type}`);
  });
}

run().catch(console.error);

