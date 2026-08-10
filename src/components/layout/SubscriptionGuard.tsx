import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isPathUnlocked } from '../../lib/subscription';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const location = useLocation();
  const [tenantConfig, setTenantConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');

  useEffect(() => {
    if (!adminId) {
      setLoading(false);
      return;
    }
    getDoc(doc(db, 'tenants', adminId))
      .then(snap => {
        if (snap.exists()) {
          setTenantConfig(snap.data());
        }
      })
      .catch((err) => {
        console.error("SubscriptionGuard: Error loading tenant config", err);
      })
      .finally(() => setLoading(false));
  }, [adminId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
          {language === 'ar' ? 'جاري التحقق من الصلاحيات...' : 'Verifying tier authorization...'}
        </span>
      </div>
    );
  }

  const isUnlocked = isPathUnlocked(user, location.pathname, tenantConfig);

  if (!isUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="glass-card max-w-md p-8 border border-white/5 relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand-primary/10 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8 text-brand-primary animate-pulse" />
          </div>

          <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-2">
            {language === 'ar' ? 'ميزة مقفلة في باقتك' : 'Feature Locked'}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            {language === 'ar'
              ? 'هذه الأداة التشخيصية غير متوفرة في باقة اشتراكك الحالية. يرجى ترقية باقتك للوصول إليها.'
              : 'This diagnostic interface is locked under your current subscription tier. Upgrade your package plan to unlock it.'}
          </p>

          <Link
            to="/billing"
            className="w-full py-3 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-1.5"
          >
            <span>{language === 'ar' ? 'ترقية باقتك الآن' : 'Upgrade Plan Now'}</span>
            <ArrowRight size={14} className="shrink-0" />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
