import React, { useState } from 'react';
import { Heart, AlertCircle, Zap, Shield, HelpCircle, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function SystemCrisis() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const crisisSteps = [
    {
      title: language === 'ar' ? 'نمط الإنقاذ العاطفي' : 'EMOTIONAL RESCUE MODE',
      desc: language === 'ar' ? 'ما الذي تشعر به الآن؟ اختر المحرك العصبي الأكثر تأثراً.' : 'What are you feeling right now? Select the most affected neural driver.',
      options: [
        { label: language === 'ar' ? 'اضطراب حاد' : 'Acute Anxiety', icon: AlertCircle, color: 'text-red-500' },
        { label: language === 'ar' ? 'فشل إحباطي' : 'Defeat/Sadness', icon: Heart, color: 'text-blue-500' },
        { label: language === 'ar' ? 'غضب عارم' : 'Overwhelming Anger', icon: Zap, color: 'text-orange-500' },
        { label: language === 'ar' ? 'تشتت ذهني' : 'Mental Fog', icon: HelpCircle, color: 'text-slate-500' },
      ]
    },
    {
      title: language === 'ar' ? 'التحليل الفوري' : 'IMMEDIATE ANALYSIS',
      desc: language === 'ar' ? 'دعنا نقوم بتحييد هذا المحفز. هل الموقف خارجي أم داخلي؟' : 'Let\'s neutralize this trigger. Is the situation external or internal?',
      options: [
        { label: language === 'ar' ? 'خارجي (أشخاص/ظروف)' : 'External (People/Circumstance)', icon: Shield, color: 'text-emerald-500' },
        { label: language === 'ar' ? 'داخلي (أفكار/ذات)' : 'Internal (Thoughts/Self)', icon: MessageSquare, color: 'text-brand-primary' },
      ]
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {step < crisisSteps.length ? (
            <motion.div 
              key={step}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-red-500/20 shadow-2xl shadow-red-500/10">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase  mb-4">
                {crisisSteps[step].title}
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                {crisisSteps[step].desc}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {crisisSteps[step].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(s => s + 1)}
                    className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-red-500/40 hover:bg-red-500/5 transition-all text-left flex items-center gap-6"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-white/10 transition-all">
                      <option.icon className={option.color} size={24} />
                    </div>
                    <div className="flex-1">
                       <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">{option.label}</p>
                    </div>
                    <ArrowRight size={18} className="text-slate-700 group-hover:text-red-500 transition-all" />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-12 text-center"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
                <Shield className="w-12 h-12 text-emerald-500" />
              </div>
              <h2 className="text-4xl font-black text-white mb-6 uppercase ">
                {language === 'ar' ? 'تم تفعيل بروتوكول الهدوء' : 'CALM PROTOCOL ACTIVATED'}
              </h2>
              <div className="space-y-4 max-w-sm mx-auto mb-10 text-slate-400 text-sm font-medium">
                <p>1. {language === 'ar' ? 'توقف عن أي رد فعل فوري.' : 'Stop any immediate reaction.'}</p>
                <p>2. {language === 'ar' ? 'قم بتفعيل العزل الذهني لـ 90 ثانية.' : 'Activate mental isolation for 90 seconds.'}</p>
                <p>3. {language === 'ar' ? 'استخدم تقنية "المراقب" لتوصيف المشاعر دون تقييم.' : 'Use "Observer" technique to label feelings without judgment.'}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/coach')}
                  className="px-8 py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl"
                >
                  {language === 'ar' ? 'تحدث مع المدرب لمزيد من الدعم' : 'TALK TO COACH FOR SUPPORT'}
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl"
                >
                  {language === 'ar' ? 'العودة للمركز' : 'BACK TO HUB'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
