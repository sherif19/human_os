const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signOut } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Read configuration
const configPath = path.join(__dirname, 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId);

const accounts = [
  {
    email: 'admin@humanos.ai',
    password: 'Password123!',
    name: 'System Admin',
    role: 'admin'
  },
  {
    email: 'superadmin@humanos.ai',
    password: 'Password123!',
    name: 'Super Admin',
    role: 'super_admin'
  }
];

async function createAccounts() {
  for (const account of accounts) {
    console.log(`Checking account: ${account.email}...`);
    try {
      // Try to create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, account.email, account.password);
      const user = userCredential.user;
      console.log(`Auth user created for ${account.email}. UID: ${user.uid}`);

      // Set Firestore profile
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: account.email,
        name: account.name,
        role: account.role,
        createdAt: new Date().toISOString(),
        onboardingComplete: true
      });
      console.log(`Firestore profile created for ${account.email}.`);
      
      // Sign out to clean session
      await signOut(auth);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`Account ${account.email} already exists in Auth. Updating Firestore role just in case...`);
        // Since we don't have the UID easily in client SDK without logging in, we assume it's created or we can log in to update
        try {
          // Standard login to get UID
          const { signInWithEmailAndPassword } = require('firebase/auth');
          const userCredential = await signInWithEmailAndPassword(auth, account.email, account.password);
          const user = userCredential.user;
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: account.email,
            name: account.name,
            role: account.role,
            createdAt: new Date().toISOString(),
            onboardingComplete: true
          }, { merge: true });
          console.log(`Firestore profile updated for existing user ${account.email}.`);
          await signOut(auth);
        } catch (innerError) {
          console.error(`Failed to update Firestore profile for existing user:`, innerError.message);
        }
      } else {
        console.error(`Error creating ${account.email}:`, error);
      }
    }
  }
  console.log('Seeding complete!');
  process.exit(0);
}

createAccounts();
