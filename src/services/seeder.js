import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export const seedAccount = async (role) => {
  const email = role === 'super_admin' ? 'superadmin@humanos.ai' : 'admin@humanos.ai';
  const password = 'Password123!';
  const name = role === 'super_admin' ? 'Super Admin' : 'System Admin';

  try {
    // 1. Create the Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Create the Firestore User Profile
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      name: name,
      role: role,
      createdAt: new Date().toISOString(),
      onboardingComplete: true
    });

    // 3. Sign out the newly created user (since createUserWithEmailAndPassword automatically signs them in)
    await signOut(auth);

    return {
      success: true,
      email,
      password,
      message: `تم إنشاء حساب ${role === 'super_admin' ? 'المالك العام (Super Admin)' : 'المدير (Admin)'} بنجاح.`
    };
  } catch (error) {
    console.error('Seeding error:', error);
    // If user already exists, we can return a message indicating so
    if (error.code === 'auth/email-already-in-use') {
      return {
        success: false,
        email,
        password,
        message: 'الحساب موجود بالفعل في النظام، يمكنك تسجيل الدخول به مباشرة.'
      };
    }
    throw error;
  }
};
