import React from 'react';
import { Brain, Fingerprint, Search, Cpu, Activity, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { analyzePersonality } from '../lib/personalityAnalyzer';
import { useNavigate } from 'react-router-dom';

export default function ArchetypeAnalysis() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const profile = analyzePersonality(user);

  // Dynamic Logic, Intuition, and Impulse parameters
  const logicVal = user ? Math.round(((user.focus ?? 85) + (user.discipline ?? 48) + (user.consistency ?? 45)) / 3) : 95;
  const intuitionVal = user ? Math.round(((user.empathy ?? 70) + (user.emotional ?? 75)) / 2) : 65;
  const impulseVal = user ? Math.max(5, Math.round(100 - (user.discipline ?? 48))) : 12;

  // Potential archetypes and their calculated level
  const archetypes = [
    { 
      name: language === 'ar' ? 'المخطط الاستراتيجي' : 'The Mastermind', 
      desc: language === 'ar' ? 'منظم، دقيق، ويركز على الكفاءة الكلية.' : 'Calculated, visionary, and objective.', 
      level: Math.round((logicVal * 2 + intuitionVal) / 3) 
    },
    { 
      name: language === 'ar' ? 'القائد الملهم' : 'The Inspiring Leader', 
      desc: language === 'ar' ? 'حضور قوي، ملهم، ويحرك همم المجموعة.' : 'Magnetic, persuasive, and people-driven.', 
      level: user ? Math.round(((user.charisma ?? 50) + (user.social ?? 40)) / 2) : 40 
    },
    { 
      name: language === 'ar' ? 'المصلح العاطفي' : 'The Harmonizer', 
      desc: language === 'ar' ? 'متعاطف، مستمع، ويصنع بيئات صحية.' : 'Empathetic, supportive, and sync-oriented.', 
      level: intuitionVal 
    },
  ].sort((a, b) => b.level - a.level);

  const compatScore = user ? Math.max(40, Math.round(((user.focus ?? 85) + (user.confidence ?? 65) + (user.emotional ?? 75)) / 3)) : 92;

  return (
    <div className="pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Fingerprint size={20} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase ">
            {language === 'ar' ? 'تحليل النموذج الأصلي' : 'ARCHETYPE ANALYSIS'}
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl">
          {language === 'ar' 
            ? 'تحديد النواة العصبية لشخصيتك وفهم نماذج الاستجابة التلقائية لديك.'
            : 'Identify your personality\'s neural core and understand your automatic response patterns.'}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <div className="glass-card p-10 bg-gradient-to-br from-brand-primary/10 to-transparent relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-10">{language === 'ar' ? 'النموذج النشط حالياً' : 'CURRENT ACTIVE ARCHETYPE'}</h3>
                <div className="flex items-center gap-8 mb-12">
                   <div className="w-24 h-24 rounded-3xl bg-brand-primary flex items-center justify-center shadow-2xl shadow-brand-primary/30">
                      <Brain size={48} className="text-white" />
                   </div>
                   <div>
                      <h2 className="text-4xl md:text-6xl font-black text-white  uppercase tracking-tighter">{language === 'ar' ? profile.archetypeAr : profile.archetype}</h2>
                      <p className="text-xl text-slate-400 font-medium">{language === 'ar' ? `التوافق العصبي: ${compatScore}٪` : `Neural Compatibility: ${compatScore}%`}</p>
                   </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                   {[
                     { label: language === 'ar' ? 'المنطق' : 'Logic', value: logicVal },
                     { label: language === 'ar' ? 'الحدس' : 'Intuition', value: intuitionVal },
                     { label: language === 'ar' ? 'الاندفاع' : 'Impulse', value: impulseVal },
                   ].map(stat => (
                     <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                        <div className="flex items-end gap-2">
                           <span className="text-2xl font-black text-white">{stat.value}%</span>
                           <div className="flex-1 bg-white/5 h-1 mb-2 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-primary" style={{ width: `${stat.value}%` }} />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
             <Fingerprint className="absolute -right-20 -bottom-20 w-80 h-80 text-brand-primary opacity-5 rotate-12" />
          </div>

          <div className="glass-card p-8">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">{language === 'ar' ? 'خرائط الظل' : 'SHADOW MAPPING'}</h3>
             <div className="space-y-6">
                {archetypes.map((a, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-brand-primary/40 transition-all">
                     <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors">
                        <Cpu size={24} />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-lg font-bold text-white mb-1">{a.name}</h4>
                        <p className="text-sm text-slate-500">{a.desc}</p>
                     </div>
                     <div className="text-right">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">{language === 'ar' ? 'إمكانية الظهور' : 'EMERGENCE'}</span>
                        <span className="text-xl font-black text-white ">{a.level}%</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-card p-8">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">{language === 'ar' ? 'توصيات البروتوكول' : 'PROTOCOL RECOMMENDATIONS'}</h3>
             <div className="space-y-4">
                {[
                  { t: language === 'ar' ? 'تطوير القيادة' : 'Leadership Dev.', i: Shield, path: '/growth-lab' },
                  { t: language === 'ar' ? 'تحليل المشاعر' : 'Sentiment Analysis', i: Activity, path: '/emotional-iq' },
                  { t: language === 'ar' ? 'مزامنة DNA' : 'DNA Sync', i: Fingerprint, path: '/dna' },
                ].map((p, i) => (
                  <button 
                    key={i} 
                    onClick={() => navigate(p.path)}
                    className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-brand-primary/40 transition-all"
                  >
                     <div className="flex items-center gap-3">
                        <p.i size={16} className="text-brand-primary" />
                        <span className="text-[10px] font-bold text-white uppercase">{p.t}</span>
                     </div>
                     <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all" />
                  </button>
                ))}
             </div>
          </div>

          <div className="glass-card p-8 bg-brand-primary/5">
             <Search className="w-8 h-8 text-brand-primary mb-4" />
             <h4 className="text-sm font-black text-white uppercase  mb-2">{language === 'ar' ? 'تحديث التشخيص' : 'REFRESH DIAGNOSTIC'}</h4>
             <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
               {language === 'ar' 
                 ? 'أكمل اختبارات الاستجابة الجديدة لتحديث خريطة النموذج الأصلي الخاص بك.'
                 : 'Complete new response tests to refresh your archetype mapping.'}
             </p>
             <button 
               onClick={() => navigate('/tests')}
               className="w-full py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
             >
               {language === 'ar' ? 'بدء الفحص السريع' : 'START QUICK SCAN'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
