import { User } from '../hooks/useAuth';

export interface PackageConfig {
  nameEn: string;
  nameAr: string;
  price: string;
  currency: string;
  currencyEn: string;
  period: string;
  periodEn: string;
  unlockedTools: string[];
  enabled?: boolean;
}

export interface TenantPackages {
  bronze: PackageConfig;
  silver: PackageConfig;
  gold: PackageConfig;
}

export const DEFAULT_PACKAGES: TenantPackages = {
  bronze: {
    nameEn: 'Bronze Tier',
    nameAr: 'الفئة البرونزية',
    price: '49',
    currency: 'ج.م',
    currencyEn: 'EGP',
    period: 'شهرياً',
    periodEn: 'monthly',
    unlockedTools: ['neural_tests', 'personality_dna'],
    enabled: true
  },
  silver: {
    nameEn: 'Silver Tier',
    nameAr: 'الفئة الفضية',
    price: '99',
    currency: 'ج.م',
    currencyEn: 'EGP',
    period: 'شهرياً',
    periodEn: 'monthly',
    unlockedTools: ['neural_tests', 'personality_dna', 'ai_coach', 'growth_lab'],
    enabled: true
  },
  gold: {
    nameEn: 'Gold Tier',
    nameAr: 'الفئة الذهبية',
    price: '149',
    currency: 'ج.م',
    currencyEn: 'EGP',
    period: 'شهرياً',
    periodEn: 'monthly',
    unlockedTools: [
      'neural_tests',
      'personality_dna',
      'ai_coach',
      'growth_lab',
      'archetype',
      'growth_velocity',
      'emotional_iq',
      'social_iq',
      'cog_load',
      'toxicity',
      'book_appointment',
      'library'
    ],
    enabled: true
  }
};

export function isSubscriptionActive(user: User | null, tenantConfig?: any): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin') return true;
  
  if (user.isTrial) {
    let expiresMs = 0;
    if (user.expiresAt) {
      const ts = user.expiresAt;
      expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
    } else if (user.createdAt) {
      const trialDays = tenantConfig?.freeTrial?.days || 7;
      const ts = user.createdAt;
      const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      expiresMs = startMs + trialDays * 86400000;
    }
    if (expiresMs) {
      return expiresMs > Date.now();
    }
  }
  
  if (!user.expiresAt) return false;
  const ts = user.expiresAt;
  const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
  return expiresMs > Date.now();
}

export function isPathUnlocked(
  user: User | null,
  path: string,
  tenantConfig: any
): boolean {
  if (!user) return false;
  if (user.role === 'admin' || user.role === 'super_admin') return true;

  // 1. Check if subscription itself is active
  if (!isSubscriptionActive(user, tenantConfig)) {
    return ['/dashboard', '/profile', '/settings', '/billing'].includes(path);
  }

  // 2. Map paths to tool keys
  const pathToToolMap: Record<string, string> = {
    '/tests': 'neural_tests',
    '/dna': 'personality_dna',
    '/archetype': 'archetype',
    '/velocity': 'growth_velocity',
    '/growth-lab': 'growth_lab',
    '/emotional-iq': 'emotional_iq',
    '/social-iq': 'social_iq',
    '/cognitive-load': 'cog_load',
    '/toxicity': 'toxicity',
    '/coach': 'ai_coach',
    '/booking': 'book_appointment',
    '/library': 'library'
  };

  const toolKey = pathToToolMap[path];
  if (!toolKey) {
    return true;
  }

  // 3. Resolve tenant's packages
  const packages: TenantPackages = tenantConfig?.packages || DEFAULT_PACKAGES;
  const userTier: 'bronze' | 'silver' | 'gold' = (user.subscriptionTier as any) || 'bronze';
  const planConfig = packages[userTier] || packages.bronze;

  return planConfig.unlockedTools.includes(toolKey);
}
