import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export interface DnaProfile {
  archetype: string;
  stability: number;
  scores: Record<string, number>;
  updatedAt: any;
}

export interface GrowthJourney {
  id?: string;
  title: string;
  status: 'active' | 'completed' | 'paused';
  mastery: number;
  createdAt: any;
}

export interface UserProject {
  id?: string;
  title: string;
  val: string;
  createdAt: any;
}

export const dataService = {
  async saveDnaProfile(profile: Omit<DnaProfile, 'updatedAt'>) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    await setDoc(doc(db, 'users', userId, 'dna', 'current'), {
      ...profile,
      updatedAt: serverTimestamp()
    });
  },

  async getDnaProfile(): Promise<DnaProfile | null> {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;
    
    const snap = await getDoc(doc(db, 'users', userId, 'dna', 'current'));
    return snap.exists() ? (snap.data() as DnaProfile) : null;
  },

  async createJourney(journey: Omit<GrowthJourney, 'createdAt'>) {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    
    const journeyRef = doc(collection(db, 'users', userId, 'journeys'));
    await setDoc(journeyRef, {
      ...journey,
      createdAt: serverTimestamp()
    });
  },

  async getJourneys(): Promise<GrowthJourney[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    const q = query(collection(db, 'users', userId, 'journeys'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GrowthJourney));
  },

  async getProjects(): Promise<UserProject[]> {
    const userId = auth.currentUser?.uid;
    if (!userId) return [];
    
    const q = query(collection(db, 'users', userId, 'projects'), orderBy('createdAt', 'desc'), limit(10));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProject));
  }
};
