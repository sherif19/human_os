import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;

  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-8 text-center border border-red-500/20 shadow-2xl shadow-red-500/5">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight">
          {isRTL ? 'غير مصرح بالوصول' : 'Access Restricted'}
        </h2>
        <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">
          {isRTL 
            ? 'عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة. يرجى العودة إلى لوحة التحكم الرئيسية.' 
            : 'You do not have the required permissions to access this page. Please return to your main dashboard.'}
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
        >
          {isRTL ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
        </button>
      </div>
    </div>
  );
}
