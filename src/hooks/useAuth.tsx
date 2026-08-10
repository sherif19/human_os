import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  signInAnonymously,
  User as FirebaseUser,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const DEFAULT_NEURAL_DATA = {
  stability: 92,
  streak: 1,
  confidence: 65,
  discipline: 48,
  emotional: 75,
  charisma: 50,
  leadership: 60,
  consistency: 45,
  focus: 85,
  social: 40,
  selfWorth: 55,
  empathy: 70,
  anxiety: 12,
  diagnosticFocus: 88,
  archetype: 'The Strategist',
  archetypeAr: 'الاستراتيجي',
  primaryDriver: 'Logic & Efficiency',
  primaryDriverAr: 'المنطق والكفاءة',
  intelligenceInsight: 'System analysis detects a recurring avoidance pattern during social conflicts.',
  intelligenceInsightAr: 'يكشف تحليل النظام عن نمط تجنب متكرر أثناء النزاعات الاجتماعية.',
  protocol01: 'Execute a 10s Pause during conflict.',
  protocol01Ar: 'نفذ توقفاً لمدة 10 ثوانٍ أثناء النزاع.',
  protocol02: 'Record thoughts in Journal immediately.',
  protocol02Ar: 'سجل الأفكار في السجل العصبي فوراً.',
  growthProtocol: '"Phase I focus should be on Social Fluidity. Your current \'Analytical\' dominance is high-performing in isolation but creates friction in collaborative neural streams."',
  growthProtocolAr: '"يجب أن يكون تركيز المرحلة الأولى على السيولة الاجتماعية. سيادتك \"التحليلية\" الحالية عالية الأداء في العزلة ولكنها تخلق احتكاكاً في التيارات العصبية التعاونية."',
  strengths: 'Complex System Mapping, Strategic Detachment, Extreme Focus',
  strengthsAr: 'تخطيط الأنظمة المعقدة, الانفصال الاستراتيجي, التركيز الشديد',
  weaknesses: 'Tactical Spontaneity, Emotional Synchrony, Baseline Consistency',
  weaknessesAr: 'العفوية التكتيكية, التزامن العاطفي, الاتساق الأساسي',
  habits: [
    { id: 'h1', name: 'Morning Meditation', nameAr: 'التأمل الصباحي', streak: 12, target: 30, color: 'text-brand-primary', lastCompleted: '', history: [] },
    { id: 'h2', name: 'Deep Reading', nameAr: 'القراءة العميقة', streak: 5, target: 15, color: 'text-emerald-400', lastCompleted: '', history: [] },
  ],
};

export interface User {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  onboardingComplete?: boolean;
  role?: 'user' | 'admin' | 'super_admin' | 'employee';
  expiresAt?: any;
  adminId?: string;
  adminEmail?: string;
  adminName?: string;
  licenseKey?: string;
  subscriptionTier?: 'bronze' | 'silver' | 'gold' | string;
  planName?: string;
  phoneNumber?: string;
  country?: string;
  createdAt?: any;
  devices?: string[];
  isTrial?: boolean;
  trialStartedAt?: any;
  stability?: number;
  streak?: number;
  lastActive?: string;
  habits?: any[];
  archetype?: string;
  archetypeAr?: string;
  primaryDriver?: string;
  primaryDriverAr?: string;
  intelligenceInsight?: string;
  intelligenceInsightAr?: string;
  protocol01?: string;
  protocol01Ar?: string;
  protocol02?: string;
  protocol02Ar?: string;
  growthProtocol?: string;
  growthProtocolAr?: string;
  strengths?: string;
  strengthsAr?: string;
  weaknesses?: string;
  weaknessesAr?: string;
  completedTests?: any;
  anxiety?: number;
  diagnosticFocus?: number;
  confidence?: number;
  discipline?: number;
  emotional?: number;
  charisma?: number;
  leadership?: number;
  consistency?: number;
  focus?: number;
  social?: number;
  selfWorth?: number;
  empathy?: number;
  radarData?: any[];
  journalEntries?: any[];
  shieldProtocols?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInAsGuest: (registrationData?: { name: string; email: string; phone?: string; licenseCode?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user session
    const demoUserStr = localStorage.getItem('humanos_demo_user');
    if (demoUserStr) {
      setUser(JSON.parse(demoUserStr));
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            // Automatically initialize missing neural fields on user login/auth change
            if (data.stability === undefined) {
              await setDoc(doc(db, 'users', firebaseUser.uid), DEFAULT_NEURAL_DATA, { merge: true });
              setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                ...data,
                ...DEFAULT_NEURAL_DATA
              } as User);
            } else {
              setUser({
                uid: firebaseUser.uid,
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                ...data
              } as User);
            }
          } else {
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || 'guest@humanos.ai',
              name: firebaseUser.displayName || 'Explorer',
              photoURL: firebaseUser.photoURL,
              createdAt: serverTimestamp(),
              onboardingComplete: false,
              role: 'user',
              ...DEFAULT_NEURAL_DATA
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setUser(newUser as any);
          }
        } catch (error) {
          console.error("Auth sync error:", error);
        } finally {
          setLoading(false);
        }
      } else if (!localStorage.getItem('humanos_demo_user')) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Sign in error:", error);
      if (error.code === 'auth/popup-blocked') {
        alert("Pop-up blocked. Please enable pop-ups for this site or use Guest Mode.");
      }
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Sign in with email error:", error);
      throw error;
    }
  };

  const signInAsGuest = async (registrationData?: { name: string; email: string; phone?: string; licenseCode?: string }) => {
    try {
      const isDemo = registrationData?.email === 'demo@humanos.ai';
      let result;
      
      try {
        result = await signInAnonymously(auth);
      } catch (err: any) {
        if (!isDemo) throw err;
      }

      if (registrationData) {
        const uid = result?.user?.uid || `demo-${Date.now()}`;
        const newUser = {
          uid: uid,
          email: registrationData.email,
          name: registrationData.name,
          phone: registrationData.phone || null,
          licenseCode: registrationData.licenseCode || null,
          photoURL: null,
          createdAt: new Date().toISOString(),
          onboardingComplete: false,
          role: 'user',
          ...DEFAULT_NEURAL_DATA
        };
        
        if (result?.user) {
          await setDoc(doc(db, 'users', uid), newUser);
        } else {
          localStorage.setItem('humanos_demo_user', JSON.stringify(newUser));
        }
        
        setUser(newUser as any);
      }
    } catch (error) {
      console.error("Guest sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('humanos_demo_user');
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    
    if (user.uid.startsWith('demo-')) {
      localStorage.setItem('humanos_demo_user', JSON.stringify(updatedUser));
    } else {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    }
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signInWithEmail, signOut, signInAsGuest, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
