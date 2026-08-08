import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Activity, 
  Plus, 
  History, 
  Sparkles, 
  Wind, 
  Smile, 
  Meh, 
  Frown, 
  TrendingUp, 
  AlertCircle,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

export default function EmotionalIQ() {
  const { language, isRTL } = useLanguage();
  const { user, updateUser } = useAuth();
  
  const [selectedMood, setSelectedMood] = useState('neutral');
  const [journalEntry, setJournalEntry] = useState('');
  
  // Breathing simulation state
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingSeconds, setBreathingSeconds] = useState(24);

  // Set selected mood initially from user's latest check-in
  useEffect(() => {
    if (user?.journalEntries && user.journalEntries.length > 0) {
      const lastEntry = user.journalEntries[user.journalEntries.length - 1];
      if (lastEntry.mood) {
        setSelectedMood(lastEntry.mood);
      }
    }
  }, [user]);

  // Breathing timer loop
  useEffect(() => {
    let timer: any;
    let phaseTimer: any;
    if (showBreathing && breathingSeconds > 0) {
      timer = setInterval(() => {
        setBreathingSeconds((prev) => prev - 1);
      }, 1000);

      phaseTimer = setInterval(() => {
        setBreathingPhase((prev) => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);
    } else if (breathingSeconds === 0 && showBreathing) {
      handleBreathingComplete();
    }

    return () => {
      clearInterval(timer);
      clearInterval(phaseTimer);
    };
  }, [showBreathing, breathingSeconds]);

  const startBreathing = () => {
    setBreathingSeconds(24);
    setBreathingPhase('inhale');
    setShowBreathing(true);
  };

  const handleBreathingComplete = async () => {
    setShowBreathing(false);
    if (!user) return;
    const currentStability = user.stability ?? 92;
    const currentEmotional = user.emotional ?? 75;
    
    await updateUser({
      stability: Math.min(100, currentStability + 3),
      emotional: Math.min(100, currentEmotional + 3)
    });
    alert(language === 'ar' ? 'تمت تهيئة النبض العصبي! +3٪ استقرار عاطفي' : 'Neural pulse stabilized! +3% Emotional Stability');
  };

  // Log a text entry
  const handleAddJournal = async () => {
    if (!journalEntry.trim() || !user) return;
    
    // Pattern recognition
    let triggerEn = 'Routine';
    let triggerAr = 'روتيني';
    if (/(work|job|task|deadline|stress|pressure|boss|عمل|وظيفة|مهمة|ضغط|مدير)/i.test(journalEntry)) {
      triggerEn = 'Workload Overload';
      triggerAr = 'العبء المعرفي الزائد';
    } else if (/(delay|procrastinate|later|tomorrow|تأجيل|تسويف|لاحقا|بكرة|بعدين)/i.test(journalEntry)) {
      triggerEn = 'Procrastination Pattern';
      triggerAr = 'نمط التسويف';
    } else if (/(people|friend|family|conflict|argument|social|ناس|صديق|عائلة|خلاف|جدال|اجتماعي)/i.test(journalEntry)) {
      triggerEn = 'Social Friction';
      triggerAr = 'الاحتكاك الاجتماعي';
    } else if (/(sad|lonely|down|tired|exhausted|حزين|وحيد|تعبان|مرهق)/i.test(journalEntry)) {
      triggerEn = 'Low Emotional Energy';
      triggerAr = 'طاقة عاطفية منخفضة';
    }

    const moodScore = selectedMood === 'high' ? 90 : selectedMood === 'low' ? 45 : 70;
    const now = new Date();
    const newEntry = {
      date: now.toLocaleDateString('en-US', { weekday: 'short' }),
      dateAr: now.toLocaleDateString('ar-EG', { weekday: 'short' }),
      mood: selectedMood,
      score: moodScore,
      text: journalEntry,
      trigger: triggerEn,
      triggerAr: triggerAr,
      timestamp: now.toISOString()
    };

    const currentEntries = user.journalEntries || [];
    const updatedEntries = [...currentEntries, newEntry].slice(-10);

    let currentStability = user.stability ?? 92;
    let currentEmotional = user.emotional ?? 75;
    if (selectedMood === 'high') {
      currentStability = Math.min(100, currentStability + 2);
      currentEmotional = Math.min(100, currentEmotional + 3);
    } else if (selectedMood === 'low') {
      currentStability = Math.max(20, currentStability - 4);
      currentEmotional = Math.max(20, currentEmotional - 5);
    }

    await updateUser({
      journalEntries: updatedEntries,
      stability: currentStability,
      emotional: currentEmotional
    });

    setJournalEntry('');
    alert(language === 'ar' ? 'تم تسجيل التدوين العصبي بنجاح!' : 'Neural journal saved successfully!');
  };

  const handleQuickMoodSelect = async (moodVal: string) => {
    setSelectedMood(moodVal);
    if (!user) return;

    const moodScore = moodVal === 'high' ? 90 : moodVal === 'low' ? 45 : 70;
    const now = new Date();
    const newEntry = {
      date: now.toLocaleDateString('en-US', { weekday: 'short' }),
      dateAr: now.toLocaleDateString('ar-EG', { weekday: 'short' }),
      mood: moodVal,
      score: moodScore,
      text: moodVal === 'high' ? 'Feeling Optimized' : moodVal === 'low' ? 'Feeling Degraded' : 'Feeling Balanced',
      textAr: moodVal === 'high' ? 'شعور ممتاز' : moodVal === 'low' ? 'شعور منخفض' : 'شعور متزن',
      trigger: 'Quick Check-in',
      triggerAr: 'فحص سريع',
      timestamp: now.toISOString()
    };

    const currentEntries = user.journalEntries || [];
    const updatedEntries = [...currentEntries, newEntry].slice(-10);

    let currentStability = user.stability ?? 92;
    let currentEmotional = user.emotional ?? 75;
    if (moodVal === 'high') {
      currentStability = Math.min(100, currentStability + 2);
      currentEmotional = Math.min(100, currentEmotional + 3);
    } else if (moodVal === 'low') {
      currentStability = Math.max(20, currentStability - 4);
      currentEmotional = Math.max(20, currentEmotional - 5);
    }

    await updateUser({
      journalEntries: updatedEntries,
      stability: currentStability,
      emotional: currentEmotional
    });
  };

  const labels = {
    en: {
      layer: 'Emotional Intelligence Layer',
      title: 'Emotional Workspace',
      subtitle: 'Analyzing neural state and processing emotional data stream.',
      trigger_breath: 'Trigger Breathing',
      new_entry: 'Save Log',
      daily_check: 'Daily State Check-in',
      optimized: 'Optimized',
      stable: 'Stable',
      degraded: 'Degraded',
      journal_title: 'Neural Journaling',
      journal_ai: 'AI Pattern Recognition Active',
      journal_placeholder: 'Record your current emotional state or triggers...',
      stability_index: 'Emotional Stability Index',
      stabler: 'Stabler',
      ai_insights: 'AI Insights',
      patterns: 'Recent Patterns',
      growth_path: 'Growth path',
      execute_relief: 'Execute Stress Relief',
      b_inhale: 'Inhale...',
      b_hold: 'Hold...',
      b_exhale: 'Exhale...',
      b_title: 'Neural Pulse Reset',
      b_desc: 'Synchronizing respiration rate with high stability wave patterns.'
    },
    ar: {
      layer: 'طبقة الذكاء العاطفي',
      title: 'مساحة العمل العاطفية',
      subtitle: 'تحليل الحالة العصبية ومعالجة دفق البيانات العاطفية.',
      trigger_breath: 'بدء التنفس',
      new_entry: 'حفظ السجل',
      daily_check: 'تسجيل الحالة اليومية',
      optimized: 'ممتاز',
      stable: 'مستقر',
      degraded: 'منخفض',
      journal_title: 'التدوين العصبي',
      journal_ai: 'التعرف على الأنماط بالذكاء الاصطناعي نشط',
      journal_placeholder: 'سجل حالتك العاطفية الحالية أو المحفزات...',
      stability_index: 'مؤشر الاستقرار العاطفي',
      stabler: 'أكثر استقراراً',
      ai_insights: 'رؤى الذكاء الاصطناعي',
      patterns: 'الأنماط الأخيرة',
      growth_path: 'مسار النمو',
      execute_relief: 'تنفيذ تخفيف التوتر',
      b_inhale: 'شهيق...',
      b_hold: 'اكتم النفس...',
      b_exhale: 'زفير...',
      b_title: 'إعادة ضبط النبض العصبي',
      b_desc: 'مزامنة معدل التنفس مع أنماط موجات الاستقرار العالية.'
    }
  }[language];

  const EMOTIONS = [
    { icon: Smile, label: labels.optimized, value: 'high', color: 'text-emerald-400' },
    { icon: Meh, label: labels.stable, value: 'neutral', color: 'text-brand-primary' },
    { icon: Frown, label: labels.degraded, value: 'low', color: 'text-rose-400' },
  ];

  // Default fallback data for mood chart
  const defaultEntries = [
    { date: 'Mon', dateAr: 'الإثنين', mood: 'neutral', score: 65, text: 'Baseline stability checks normal.', trigger: 'Routine', triggerAr: 'روتيني' },
    { date: 'Tue', dateAr: 'الثلاثاء', mood: 'high', score: 72, text: 'Morning alignment was successful.', trigger: 'Routine', triggerAr: 'روتيني' },
    { date: 'Wed', dateAr: 'الأربعاء', mood: 'low', score: 58, text: 'Encountered some work-related friction.', trigger: 'Workload Overload', triggerAr: 'العبء المعرفي الزائد' },
    { date: 'Thu', dateAr: 'الخميس', mood: 'high', score: 85, text: 'Completed core tasks early.', trigger: 'Routine', triggerAr: 'روتيني' },
    { date: 'Fri', dateAr: 'الجمعة', mood: 'neutral', score: 78, text: 'Maintained balance throughout the afternoon.', trigger: 'Routine', triggerAr: 'روتيني' },
    { date: 'Sat', dateAr: 'السبت', mood: 'high', score: 92, text: 'Excellent social synchronization.', trigger: 'Social Sync', triggerAr: 'مزامنة اجتماعية' },
    { date: 'Sun', dateAr: 'الأحد', mood: 'high', score: 88, text: 'Reflecting on personal goals.', trigger: 'Routine', triggerAr: 'روتيني' },
  ];

  const activeEntries = user?.journalEntries && user.journalEntries.length > 0
    ? user.journalEntries
    : defaultEntries;

  // Map to chart values
  const chartData = activeEntries.map((e: any) => ({
    time: e.date,
    ar: e.dateAr || e.date,
    score: e.score || 70,
  }));

  // Identify primary trigger dynamically based on latest journal entry
  const latestTextEntry = [...activeEntries].reverse().find((e: any) => e.text && e.text !== 'Feeling Optimized' && e.text !== 'Feeling Degraded' && e.text !== 'Feeling Balanced');
  const dynamicTrigger = latestTextEntry 
    ? (language === 'ar' ? latestTextEntry.triggerAr || latestTextEntry.trigger : latestTextEntry.trigger || 'Routine')
    : (language === 'ar' ? 'روتيني' : 'Routine');

  // Peak stability calculation helper
  const peakStabilityStr = language === 'ar' ? 'الصباح (08:00)' : 'Morning (08:00)';
  
  // Growth focus dynamic text
  const lowestMetricName = user
    ? Object.entries({
        focus: user.focus ?? 85,
        discipline: user.discipline ?? 48,
        consistency: user.consistency ?? 45,
        empathy: user.empathy ?? 70,
        social: user.social ?? 40,
        confidence: user.confidence ?? 65
      }).sort((a, b) => a[1] - b[1])[0][0]
    : 'consistency';

  const growthFocusStr = {
    focus: language === 'ar' ? 'تحسين التركيز والاهتمام' : 'Focus Optimization',
    discipline: language === 'ar' ? 'تنظيم الانضباط الذاتي' : 'Self-Discipline Sync',
    consistency: language === 'ar' ? 'بناء الاتساق اليومي' : 'Daily Consistency Build',
    empathy: language === 'ar' ? 'تطوير التعاطف الاجتماعي' : 'Empathy Development',
    social: language === 'ar' ? 'توسيع المهارات الاجتماعية' : 'Social Skills Expansion',
    confidence: language === 'ar' ? 'تعزيز الثقة بالنفس' : 'Confidence Boost'
  }[lowestMetricName as 'focus' | 'discipline' | 'consistency' | 'empathy' | 'social' | 'confidence'] || (language === 'ar' ? 'مقارنة الذات' : 'Self-Comparison');

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <Heart size={16} className="fill-rose-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{labels.layer}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{labels.title}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{labels.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
             onClick={startBreathing}
             className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-white transition-all"
           >
             <Wind size={14} />
             {labels.trigger_breath}
           </button>
           <button 
             onClick={handleAddJournal}
             className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all"
           >
             <Plus size={14} />
             {labels.new_entry}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8">{labels.daily_check}</h3>
            <div className="flex justify-between gap-4">
               {EMOTIONS.map((mood) => (
                 <button
                   key={mood.value}
                   onClick={() => handleQuickMoodSelect(mood.value)}
                   className={cn(
                     "flex-1 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 group",
                     selectedMood === mood.value 
                       ? "bg-white/5 border-white/20 ring-2 ring-brand-primary/20" 
                       : "bg-white/5 border-transparent opacity-40 hover:opacity-100"
                   )}
                 >
                   <mood.icon size={40} className={cn("transition-transform group-hover:scale-110", mood.color)} />
                   <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{mood.label}</span>
                 </button>
               ))}
            </div>
          </div>

          <div className="glass-card">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                   <Activity size={16} className="text-rose-400" />
                   {labels.journal_title}
                </h3>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{labels.journal_ai}</span>
             </div>
             <div className="relative">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  placeholder={labels.journal_placeholder}
                  className="w-full h-48 bg-white/5 border border-white/5 rounded-[2rem] p-8 text-white font-medium focus:outline-none focus:border-brand-primary/30 transition-all resize-none placeholder:text-slate-600"
                />
                <button 
                  onClick={handleAddJournal}
                  className={cn("absolute bottom-6 p-4 bg-brand-primary text-white rounded-2xl shadow-xl shadow-brand-primary/20 hover:brightness-110 transition-all", isRTL ? "left-6" : "right-6")}
                >
                  <Sparkles size={20} />
                </button>
             </div>
          </div>

          <div className="glass-card">
            <div className="flex items-center justify-between mb-8 text-sm font-black text-white uppercase tracking-[0.2em]">
              <span>{labels.stability_index}</span>
              <div className="flex items-center gap-2 text-emerald-400">
                <TrendingUp size={16} />
                <span>{(user?.stability ?? 92) > 80 ? '+12%' : '+4%'} {labels.stabler}</span>
              </div>
            </div>
            <div className="h-64 w-full min-w-0 min-h-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                  <XAxis 
                    dataKey={language === 'ar' ? 'ar' : 'time'} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0c0c0e', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorMood)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-brand-primary" />
                {labels.ai_insights}
             </h3>
             <div className="space-y-4">
                {[
                  { label: language === 'ar' ? 'المحفز الرئيسي' : 'Primary Trigger', value: dynamicTrigger, color: 'text-amber-400' },
                  { label: language === 'ar' ? 'ذروة الاستقرار' : 'Peak Stability', value: peakStabilityStr, color: 'text-emerald-400' },
                  { label: language === 'ar' ? 'تركيز النمو' : 'Growth Focus', value: growthFocusStr, color: 'text-indigo-400' },
                ].map((insight) => (
                  <div key={insight.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{insight.label}</p>
                    <p className={cn("text-sm font-bold tracking-tight", insight.color)}>{insight.value}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-card">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <History size={16} className="text-slate-500" />
               {language === 'ar' ? 'الأنماط الأخيرة' : 'Recent Patterns'}
             </h3>
             <div className="space-y-4">
                {activeEntries.slice(-3).reverse().map((entry: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
                       <Activity size={14} className="text-slate-500" />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white mb-1">
                         {language === 'ar' 
                           ? (entry.textAr || entry.text || 'تحديث الحالة') 
                           : (entry.text || 'State Update')}
                       </p>
                       <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                         {language === 'ar' 
                           ? `المحفز: ${entry.triggerAr || 'فحص سريع'}` 
                           : `Trigger: ${entry.trigger || 'Quick Check-in'}`}
                       </p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-card bg-rose-500/5 border-rose-500/20">
             <div className="flex items-center gap-3 mb-4">
                <AlertCircle size={20} className="text-rose-500" />
                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em]">{labels.growth_path}</h4>
             </div>
             <p className="text-[13px] text-slate-300 font-medium leading-relaxed  mb-6">
                {language === 'ar' 
                  ? '"وعيك بمحفزاتك هو الخطوة الأولى لتحييدها. ركز على التنفس بعمق بانتظام هذا الأسبوع."' 
                  : '"Your awareness of your triggers is the first step toward neutralizing them. Focus on regular deep breathing this week."'
                }
             </p>
             <button 
               onClick={startBreathing}
               className="w-full py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:brightness-110 transition-all"
             >
                {labels.execute_relief}
             </button>
          </div>
        </div>
      </div>

      {/* Breathing Guide Modal */}
      {showBreathing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="glass-card max-w-md w-full p-8 relative flex flex-col items-center text-center">
            <button 
              onClick={() => setShowBreathing(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black text-white  uppercase tracking-tighter mb-2">
              {labels.b_title}
            </h2>
            <p className="text-xs text-slate-400 mb-8 max-w-xs">
              {labels.b_desc}
            </p>

            {/* Breathing Animation Circle */}
            <div className="w-48 h-48 flex items-center justify-center mb-8 relative">
              <div 
                className={cn(
                  "absolute rounded-full bg-brand-primary/20 border border-brand-primary/40 transition-all duration-[4000ms] ease-in-out"
                )}
                style={{ 
                  width: breathingPhase === 'exhale' ? '80px' : '180px', 
                  height: breathingPhase === 'exhale' ? '80px' : '180px' 
                }}
              />
              <div 
                className="absolute w-20 h-20 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-sm z-10 transition-all duration-[4000ms] ease-in-out"
                style={{
                  transform: breathingPhase === 'exhale' ? 'scale(1)' : 'scale(1.2)'
                }}
              >
                {breathingPhase === 'inhale' && labels.b_inhale}
                {breathingPhase === 'hold' && labels.b_hold}
                {breathingPhase === 'exhale' && labels.b_exhale}
              </div>
            </div>

            <div className="text-sm font-mono text-brand-primary font-black tracking-widest">
              {language === 'ar' ? `المتبقي: ${breathingSeconds} ثانية` : `${breathingSeconds}s REMAINING`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
