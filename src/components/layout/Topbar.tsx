import React from 'react';
import { User, Globe, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function Topbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const { user, signOut } = useAuth();
  const { isRTL, language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [tenantConfig, setTenantConfig] = React.useState<any>(null);

  React.useEffect(() => {
    const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');
    if (!adminId) return;

    getDoc(doc(db, 'tenants', adminId))
      .then(snap => {
        if (snap.exists()) {
          setTenantConfig(snap.data());
        }
      })
      .catch(err => console.error("Error loading tenant config on topbar:", err));
  }, [user]);

  const getLayerName = () => {
    const path = location.pathname;
    if (language === 'ar') {
      if (path === '/dashboard') return 'مساحة عمل الخبرة';
      if (path === '/dna') return 'الطبقة النفسية';
      if (path === '/coach') return 'الواجهة العصبية';
      if (path === '/journey') return 'هندسة النمو';
      if (path === '/admin') return 'لوحة التحكم للمدير';
      if (path === '/super-admin') return 'لوحة التحكم للمالك';
      if (path === '/billing') return 'الاشتراك والدفع';
      return 'جوهر النظام';
    }
    if (path === '/dashboard') return 'Experience Workspace';
    if (path === '/dna') return 'Psychological Layer';
    if (path === '/coach') return 'Neural Interface';
    if (path === '/journey') return 'Growth Architecture';
    if (path === '/admin') return 'Admin Panel';
    if (path === '/super-admin') return 'Super Admin Control';
    if (path === '/billing') return 'Subscription & Billing';
    return 'System Core';
  };

  const getSubscriptionInfo = () => {
    if (!user) return null;
    
    // Super admins and employees do not show days remaining
    if (user.role === 'super_admin' || user.role === 'employee') {
      return null;
    }

    if (user.isTrial) {
      let expiresMs = 0;
      if (user.expiresAt) {
        const ts = user.expiresAt;
        expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      } else if (user.trialStartedAt) {
        const trialDays = tenantConfig?.freeTrial?.days || 7;
        const ts = user.trialStartedAt;
        const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
        expiresMs = startMs + trialDays * 86400000;
      }
      
      if (expiresMs) {
        const daysLeft = Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
        return {
          type: 'trial',
          daysLeft,
          expired: Date.now() > expiresMs
        };
      }
    }

    if (user.expiresAt) {
      const ts = user.expiresAt;
      const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      const daysLeft = Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
      return {
        type: 'subscription',
        daysLeft,
        expired: Date.now() > expiresMs
      };
    }

    return null;
  };

  const subInfo = getSubscriptionInfo();

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-bg-sidebar/50 backdrop-blur-md sticky top-0 z-40 transition-all w-full">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand-primary/20">
          {language === 'ar' ? 'الطبقة:' : 'Layer:'} {getLayerName()}
        </div>
      </div>

      {subInfo && (
        <div 
          onClick={() => navigate('/billing')}
          className={cn(
            "cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border transition-all hover:scale-105",
            subInfo.expired 
              ? "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:border-rose-500/40"
              : subInfo.type === 'trial'
                ? "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:border-amber-500/40"
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:border-emerald-500/40"
          )}
        >
          <span className="relative flex h-2 w-2">
            <span className={cn(
              "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
              subInfo.expired 
                ? "bg-rose-400"
                : subInfo.type === 'trial'
                  ? "bg-amber-400"
                  : "bg-emerald-400"
            )}></span>
            <span className={cn(
              "relative inline-flex rounded-full h-2 w-2",
              subInfo.expired 
                ? "bg-rose-500"
                : subInfo.type === 'trial'
                  ? "bg-amber-500"
                  : "bg-emerald-500"
            )}></span>
          </span>
          <span>
            {subInfo.expired 
              ? (language === 'ar' ? 'انتهت صلاحية الوصول' : 'Access Expired')
              : subInfo.type === 'trial'
                ? (language === 'ar' ? `فترة تجريبية: ${subInfo.daysLeft} أيام متبقية` : `Free Trial: ${subInfo.daysLeft} days left`)
                : (language === 'ar' ? `الاشتراك نشط: ${subInfo.daysLeft} يوم متبقي` : `Subscription Active: ${subInfo.daysLeft} days left`)}
          </span>
        </div>
      )}

      <div className="flex items-center gap-6">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all flex items-center gap-2 group"
          title={language === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
        >
          <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">{language.toUpperCase()}</span>
        </button>

        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-semibold text-white leading-tight">{user?.name || 'Alex Thompson'}</p>
          <p className="text-[10px] text-slate-500 font-medium">{language === 'ar' ? 'النموذج الأصلي: الاستراتيجي' : 'Archetype: The Strategist'}</p>
        </div>
        
        <button 
          onClick={() => signOut()}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-400 border-2 border-white/10 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt="User Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white/50" />
          )}
        </button>
      </div>
    </header>
  );
}
