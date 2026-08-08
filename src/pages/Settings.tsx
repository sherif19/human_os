import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { Bell, Lock, Eye, Globe, Zap, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Settings() {
  const { language, setLanguage, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const navigate = useNavigate();

  const sections = [
    {
      title: language === 'ar' ? 'عام' : 'General',
      items: [
        { icon: User, label: language === 'ar' ? 'الملف الشخصي' : 'Profile', desc: language === 'ar' ? 'إدارة معلوماتك الشخصية' : 'Manage your personal info', path: '/profile' },
        { icon: Globe, label: language === 'ar' ? 'اللغة' : 'Language', desc: language === 'ar' ? 'تغيير لغة النظام' : 'Change system language', action: 'language' },
      ]
    },
    {
      title: language === 'ar' ? 'النظام' : 'System',
      items: [
        { icon: Bell, label: language === 'ar' ? 'التنبيهات' : 'Notifications', desc: language === 'ar' ? 'تكوين تنبيهات الذكاء الاصطناعي' : 'Configure AI alerts' },
        { icon: Lock, label: language === 'ar' ? 'الأمان' : 'Security', desc: language === 'ar' ? 'تغيير كلمة المرور والوصول' : 'Change password & access', path: '/profile' },
      ]
    },
    {
      title: language === 'ar' ? 'التحسين العضوي' : 'Biological Optimization',
      items: [
        { icon: Zap, label: language === 'ar' ? 'كثافة التحليل' : 'Analysis Intensity', desc: language === 'ar' ? 'تعديل قوة المعالجة العصبية' : 'Adjust neural processing strength' },
        { icon: Shield, label: language === 'ar' ? 'دروع الخصوصية' : 'Privacy Shields', desc: language === 'ar' ? 'إدارة مستوى عزل البيانات' : 'Manage data isolation level' },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white uppercase  tracking-tighter">{t('settings')}</h1>
        <p className="text-slate-500 font-medium">{language === 'ar' ? 'تهيئة معالم نظامك العصبي.' : 'Configure your neural system parameters.'}</p>
      </div>

      <div className="grid gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] px-2">{section.title}</h3>
            <div className="grid gap-3">
              {section.items.map((item, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    if (item.action === 'language') {
                      setLanguage(language === 'ar' ? 'en' : 'ar');
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className="w-full text-left glass-card p-6 flex items-center justify-between group hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors border border-white/5">
                      <item.icon size={20} />
                    </div>
                    <div style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
                      <h4 className="text-sm font-bold text-white uppercase tracking-tight mb-0.5">{item.label}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none group-hover:text-white/60">{item.desc}</p>
                    </div>
                  </div>
                  <Eye className="w-4 h-4 text-slate-700 group-hover:text-brand-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
