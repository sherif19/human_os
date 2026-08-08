import React, { useState, useEffect } from 'react';
import { Zap, Brain, Target, Clock, AlertCircle, TrendingUp, Sparkles, X, Play, Pause } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function CognitiveLoad() {
  const { language } = useLanguage();
  const { user, updateUser } = useAuth();

  // Live fluctuating chart heights state
  const [chartHeights, setChartHeights] = useState([40, 60, 45, 80, 70, 90, 85, 40, 50, 60, 45, 80, 70, 90, 85]);

  // Buffer Dump (Free Resources) simulation state
  const [isDumping, setIsDumping] = useState(false);
  const [dumpProgress, setDumpProgress] = useState(0);

  // Focus Timer (Pomodoro) state
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const timerTotal = 25 * 60;

  // Fluctuating chart simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setChartHeights(prev => 
        prev.map(h => Math.min(100, Math.max(10, h + Math.round((Math.random() - 0.5) * 20))))
      );
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Buffer Dump progress interval
  useEffect(() => {
    let interval: any;
    if (isDumping) {
      interval = setInterval(() => {
        setDumpProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            finishBufferDump();
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isDumping]);

  // Focus Timer countdown
  useEffect(() => {
    let interval: any;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      finishFocusSession();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  // Bind Metrics dynamically
  const focusVal = user?.focus ?? 85;
  const disciplineVal = user?.discipline ?? 48;
  const consistencyVal = user?.consistency ?? 45;

  const activeProcessing = focusVal;
  const memoryBandwidth = disciplineVal;
  const contextLeak = Math.max(5, 100 - consistencyVal);

  const metrics = [
    { label: language === 'ar' ? 'المعالجة النشطة' : 'Active Processing', value: `${activeProcessing}%`, color: 'text-brand-primary' },
    { label: language === 'ar' ? 'مساحة الذاكرة' : 'Memory Bandwidth', value: `${memoryBandwidth}%`, color: 'text-emerald-400' },
    { label: language === 'ar' ? 'فقدان البيانات' : 'Context Leak', value: `${contextLeak}%`, color: 'text-red-400' },
  ];

  const triggerBufferDump = () => {
    setDumpProgress(0);
    setIsDumping(true);
  };

  const finishBufferDump = async () => {
    setIsDumping(false);
    if (!user) return;
    const currentFocus = user.focus ?? 85;
    const currentConsistency = user.consistency ?? 45;
    
    await updateUser({
      focus: Math.min(100, currentFocus + 3),
      consistency: Math.min(100, currentConsistency + 2)
    });
    alert(language === 'ar' ? 'تم تفريغ الذاكرة المؤقتة! +3٪ تركيز، +2٪ اتساق' : 'Neural buffer dumped! +3% Focus, +2% Consistency');
  };

  const startFocusSession = () => {
    setTimeLeft(timerTotal);
    setTimerActive(true);
  };

  const finishFocusSession = async () => {
    setTimerActive(false);
    if (!user) return;
    const currentFocus = user.focus ?? 85;
    await updateUser({
      focus: Math.min(100, currentFocus + 2)
    });
    alert(language === 'ar' ? 'اكتملت جلسة التركيز! +2٪ تركيز' : 'Focus session completed! +2% Focus Index');
  };

  const skipFocusSession = () => {
    finishFocusSession();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProtocolClick = async (protocolName: string) => {
    if (!user) return;
    let updates: any = {};
    if (protocolName === 'Buffer Dump' || protocolName === 'تفريغ الذاكرة المؤقتة') {
      triggerBufferDump();
      return;
    } else if (protocolName === 'Digital Seclusion' || protocolName === 'العزل الرقمي') {
      updates.discipline = Math.min(100, (user.discipline ?? 48) + 2);
    } else if (protocolName === 'Task Automation' || protocolName === 'أتمتة المهام') {
      updates.consistency = Math.min(100, (user.consistency ?? 45) + 2);
    }
    await updateUser(updates);
    alert(language === 'ar' ? `تم تفعيل ${protocolName} بنجاح!` : `${protocolName} activated successfully!`);
  };

  const handleActivateAI = async () => {
    if (!user) return;
    await updateUser({
      focus: Math.min(100, (user.focus ?? 85) + 4),
      discipline: Math.min(100, (user.discipline ?? 48) + 3)
    });
    alert(language === 'ar' ? 'تم تحسين الجدول المعرفي بالذكاء الاصطناعي!' : 'AI cognitive schedule optimized!');
  };

  return (
    <div className="pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <Zap size={20} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase ">
            {language === 'ar' ? 'الحمل المعرفي' : 'COGNITIVE LOAD'}
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl">
          {language === 'ar' 
            ? 'مراقبة وتحسين توزيع الموارد العصبية لضمان ذروة الأداء دون احتراق.'
            : 'Monitor and optimize neural resource allocation to ensure peak performance without burnout.'}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-8 bg-gradient-to-br from-brand-primary/10 to-transparent">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{language === 'ar' ? 'تحليل الوقت الحقيقي' : 'REAL-TIME ANALYSIS'}</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{language === 'ar' ? 'متصل' : 'LIVE'}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 mb-12">
              {metrics.map((m, i) => {
                const desc = [
                  language === 'ar' ? 'مستوى تخصيص التركيز والانتباه الحالي.' : 'Focus allocation level. Higher means better attention.',
                  language === 'ar' ? 'مساحة الانضباط والالتزام بالمهام.' : 'Discipline buffer. Capacity to stay on task.',
                  language === 'ar' ? 'معدل استنزاف وتشتت الانتباه بسبب المهام المتعددة.' : 'Multitasking drain rate. Lower is better.',
                ][i];
                return (
                  <div key={m.label} className="text-center space-y-2">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
                    <p className={cn("text-4xl font-black ", m.color)}>{m.value}</p>
                    <p className="text-[9px] text-slate-400 font-medium leading-relaxed max-w-[120px] mx-auto">{desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="h-40 flex items-end gap-1 px-4">
              {chartHeights.map((h, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  className="flex-1 bg-brand-primary/20 rounded-t-sm hover:bg-brand-primary transition-colors cursor-pointer"
                />
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Neural Congestion / Free Resources */}
            <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                 <AlertCircle size={18} className="text-amber-500" />
                 <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{language === 'ar' ? 'تحذير الاحتقان' : 'NEURAL CONGESTION'}</h4>
              </div>
              <p className="text-xs text-white font-medium mb-4">
                {language === 'ar' 
                  ? `تعدد المهام يستهلك حالياً ${contextLeak}% من انتباهك المتاح.` 
                  : `Multitasking is currently leaking ${contextLeak}% of your available focus.`}
              </p>
              
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
                {language === 'ar' 
                  ? '💡 الإجراء المطلوب: اضغط على "تحرير الموارد" عند الشعور بالضغط لتفريغ الذاكرة العصبي المؤقت واستعادة +3٪ تركيز.'
                  : '💡 Action Required: Click "Free Resources" when feeling overwhelmed to clear mental cache and recover +3% Focus.'}
              </p>
              
              {isDumping ? (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between text-[8px] font-black text-slate-400">
                    <span>{language === 'ar' ? 'جاري تفريغ الذاكرة...' : 'DUMPING CACHE...'}</span>
                    <span>{dumpProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${dumpProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={triggerBufferDump}
                  className="w-full py-2 bg-amber-500 text-black text-[9px] font-black uppercase tracking-widest rounded-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  {language === 'ar' ? 'تحرير الموارد' : 'FREE RESOURCES'}
                </button>
              )}
            </div>
            
            {/* Focus Session / Schedule Session */}
            <div className="glass-card p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                 <Clock size={18} className="text-brand-primary" />
                 <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{language === 'ar' ? 'التركيز المتبقي' : 'REMAINING FOCUS'}</h4>
              </div>
              <p className="text-xs text-white font-medium mb-4">
                {language === 'ar' 
                  ? `${(activeProcessing / 30).toFixed(1)} ساعة من التدفق العصبي المتاح اليوم.` 
                  : `${(activeProcessing / 30).toFixed(1)} hours of neural flow remaining today.`}
              </p>

              <p className="text-[10px] text-slate-400 font-medium leading-relaxed mb-4">
                {language === 'ar' 
                  ? '💡 الإجراء المطلوب: ابدأ جلسة تركيز مدتها 25 دقيقة لتجنب تشتت الانتباه وزيادة مؤشر التركيز بمقدار +2٪.'
                  : '💡 Action Required: Start a 25-minute Pomodoro run to block multitasking leaks and increase Focus by +2%.'}
              </p>

              {timerActive ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
                    <span className="text-sm font-mono font-black text-white">{formatTime(timeLeft)}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setTimerActive(false)}
                        className="p-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                      >
                        <Pause size={12} />
                      </button>
                      <button 
                        onClick={skipFocusSession}
                        className="text-[8px] font-black uppercase bg-brand-primary text-white px-2 py-1 rounded"
                      >
                        {language === 'ar' ? 'تخطي' : 'SKIP'}
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-primary" style={{ width: `${((timerTotal - timeLeft) / timerTotal) * 100}%` }} />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={startFocusSession}
                  className="w-full py-2 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-white/10 transition-all"
                >
                  {language === 'ar' ? 'بدء جلسة التركيز' : 'START FOCUS SESSION'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">{language === 'ar' ? 'بروتوكولات التخفيف' : 'REDUCTION PROTOCOLS'}</h3>
            <div className="space-y-4">
              {[
                { 
                  label: language === 'ar' ? 'تفريغ الذاكرة المؤقتة' : 'Buffer Dump', 
                  desc: language === 'ar' ? 'إجراء تصفية للذهن لاستعادة انتباهك الفوري.' : 'Clear mental cache to recover immediate focus.',
                  icon: Brain 
                },
                { 
                  label: language === 'ar' ? 'العزل الرقمي' : 'Digital Seclusion', 
                  desc: language === 'ar' ? 'إخفاء الإشعارات الخارجية وتخفيف العبء التكراري (+2٪ انضباط).' : 'Block notifications to reduce cognitive load (+2% Discipline).',
                  icon: Target 
                },
                { 
                  label: language === 'ar' ? 'أتمتة المهام' : 'Task Automation', 
                  desc: language === 'ar' ? 'تفويض المهام المكررة لبناء اتساق طويل الأجل (+2٪ اتساق).' : 'Delegate repetitive tasks to build long-term consistency (+2% Consistency).',
                  icon: Zap 
                },
              ].map(p => (
                <button 
                  key={p.label} 
                  onClick={() => handleProtocolClick(p.label)}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-brand-primary/40 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <p.icon size={16} className="text-slate-500 group-hover:text-brand-primary shrink-0" />
                    <div>
                      <span className="text-[10px] font-bold text-white uppercase block">{p.label}</span>
                      <span className="text-[9px] text-slate-500 font-medium">{p.desc}</span>
                    </div>
                  </div>
                  <TrendingUp size={12} className="text-slate-700 group-hover:text-brand-primary shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 bg-brand-primary/10 border-brand-primary/20">
            <Sparkles className="w-8 h-8 text-brand-primary mb-4" />
            <h4 className="text-sm font-black text-white uppercase  mb-2">{language === 'ar' ? 'تحسين الذكاء الاصطناعي' : 'AI OPTIMIZATION'}</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mb-6">
              {language === 'ar' 
                ? 'دع النظام يتولى جدولة مهامك بناءً على إيقاعك البيولوجي العصبي.'
                : 'Let the system handle your task scheduling based on your neural biological rhythm.'}
            </p>
            <button 
              onClick={handleActivateAI}
              className="w-full py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all"
            >
              {language === 'ar' ? 'تفعيل الأتمتة' : 'ACTIVATE READY'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
