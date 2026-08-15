import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  ChevronRight, 
  Star, 
  Clock, 
  Search, 
  ArrowLeft,
  Sparkles,
  Zap,
  Target,
  Shield,
  Activity,
  Heart,
  Users,
  MessageSquare,
  ShieldAlert,
  Dna,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Award,
  Trophy,
  CheckCircle2,
  X,
  Brain
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { useAuth } from '../hooks/useAuth';
import { PERSONALITY_TESTS } from '../constants/tests';
import { TestRunner } from '../components/personality/TestRunner';
import { NeuralTestCard, getCardTheme, CardBackgroundAnimation } from '../components/personality/NeuralTestCard';
import { analyzePersonality as analyzePersonalityAPI } from '../services/api';

const CATEGORIES = ['All', 'Diagnostic', 'Personality', 'Social IQ', 'Development'];

export default function NeuralTests() {
  const { language, isRTL } = useLanguage();
  const { user, updateUser } = useAuth();
  const t = (key: TranslationKey) => translations[language][key] || key;
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTest, setActiveTest] = useState<any>(null);
  const [runningTest, setRunningTest] = useState<boolean>(false);
  const [testResultModal, setTestResultModal] = useState<any | null>(null);

  const getMappedCategory = (cat: string) => {
    if (['Guide', 'AI', 'Career', 'Action'].includes(cat)) return 'Development';
    if (['Habits', 'Growth', 'Performance', 'Identity'].includes(cat)) return 'Personality';
    if (['Efficiency', 'Psychology', 'Emotional', 'DNA', 'Core'].includes(cat)) return 'Diagnostic';
    return 'Social IQ';
  };

  const handleTestComplete = async (answers: Record<number, number>) => {
    if (!user || !activeTest) return;

    const values = Object.values(answers);
    const sum = values.reduce((a, b) => a + b, 0);
    const score = Math.round((sum / (values.length * 5)) * 100);

    const testToFieldMap: Record<string, string> = {
      'assistant': 'selfWorth',
      'daily-ritual': 'consistency',
      'neural-flow': 'focus',
      'planner': 'consistency',
      'empathy': 'empathy',
      'shadow': 'empathy',
      'confidence': 'confidence',
      'charisma': 'charisma',
      'eq': 'emotional',
      'discipline': 'discipline',
      'conflict': 'social',
      'self-worth': 'selfWorth',
      'social-energy': 'social',
      'focus': 'focus',
      'burnout': 'stability',
      'archetype': 'empathy',
      'habit': 'discipline',
      'silence': 'social',
      'mission': 'discipline',
      'journal': 'focus',
      'toxicity': 'empathy',
      'leadership': 'leadership',
      'trauma': 'emotional',
      'communication': 'social',
      'growth-velocity': 'empathy',
      'dna-sync': 'empathy'
    };

    const field = testToFieldMap[activeTest.id];
    const updateData: any = {};
    if (field) {
      if (activeTest.id === 'burnout') {
        updateData[field] = Math.max(10, 100 - (score - 20));
      } else {
        updateData[field] = score;
      }
    }

    const completedTests = (user as any).completedTests || {};
    completedTests[activeTest.id] = {
      score,
      completedAt: new Date().toISOString()
    };
    updateData.completedTests = completedTests;

    let aiInsightText = "";
    // Fetch dynamic AI analysis
    try {
      const adminId = user.adminId || (user.role === 'admin' || user.role === 'super_admin' ? user.uid : '');
      const currentScores = {
        confidence: user.confidence ?? 65,
        discipline: user.discipline ?? 48,
        emotional: user.emotional ?? 75,
        charisma: user.charisma ?? 50,
        leadership: user.leadership ?? 60,
        selfWorth: user.selfWorth ?? 55,
        consistency: user.consistency ?? 45,
        focus: user.focus ?? 85,
        social: user.social ?? 40,
        empathy: user.empathy ?? 70,
        ...(field ? { [field]: updateData[field] } : {})
      };

      const aiResult = await analyzePersonalityAPI(
        answers, 
        { currentScores, email: user.email, name: user.name }, 
        [], 
        adminId
      );

      if (aiResult && aiResult.archetype) {
        updateData.archetype = aiResult.archetype;
        updateData.archetypeAr = aiResult.archetypeAr || aiResult.archetype;
        updateData.intelligenceInsight = aiResult.insight || aiResult.intelligenceInsight;
        updateData.intelligenceInsightAr = aiResult.insightAr || aiResult.intelligenceInsightAr;
        aiInsightText = language === 'ar' 
          ? (aiResult.insightAr || aiResult.intelligenceInsightAr || 'تم تحليل نمطك العادي وتحديث كفاءتك العصبي بنجاح.')
          : (aiResult.insight || aiResult.intelligenceInsight || 'Your behavioral archetype has been updated.');

        if (Array.isArray(aiResult.strengths)) updateData.strengths = aiResult.strengths.join(', ');
        if (Array.isArray(aiResult.strengthsAr)) updateData.strengthsAr = aiResult.strengthsAr.join(', ');
        if (Array.isArray(aiResult.weaknesses)) updateData.weaknesses = aiResult.weaknesses.join(', ');
        if (Array.isArray(aiResult.weaknessesAr)) updateData.weaknessesAr = aiResult.weaknessesAr.join(', ');
      }
    } catch (err) {
      console.error("AI Analysis skipped or failed:", err);
    }

    await updateUser(updateData);

    // Show Result Modal
    setTestResultModal({
      testName: language === 'ar' ? activeTest.nameAr : activeTest.nameEn,
      score,
      aiInsight: aiInsightText || (language === 'ar' ? 'تم تسجيل وتحديث كفاءتك العصبية بنجاح في ملفك الشخصي.' : 'Your assessment score has been recorded.'),
      xpGained: activeTest.questions * 5
    });

    setRunningTest(false);
    setActiveTest(null);
  };

  const tests = PERSONALITY_TESTS.map(test => {
    const isCompleted = user?.completedTests?.[test.id] !== undefined;
    const mappedCat = getMappedCategory(test.category);
    const nameEn = translations['en'][test.nameKey as TranslationKey] || test.nameKey;
    const nameAr = translations['ar'][test.nameKey as TranslationKey] || test.nameKey;

    return {
      ...test,
      nameEn,
      nameAr,
      category: mappedCat,
      status: (isCompleted ? 'completed' : 'available') as 'completed' | 'available' | 'locked' | 'new',
      time: '6 min',
    };
  });

  const filteredTests = tests.filter(test => {
    const matchesCategory = activeCategory === 'All' || test.category === activeCategory;
    const matchesSearch = test.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          test.nameAr.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (runningTest && activeTest) {
    const translatedTest = {
      ...activeTest,
      name: language === 'ar' ? activeTest.nameAr : activeTest.nameEn
    };
    return (
      <TestRunner 
        test={translatedTest} 
        onCancel={() => setRunningTest(false)} 
        onComplete={handleTestComplete} 
      />
    );
  }

  if (activeTest) {
    const detailTheme = getCardTheme(activeTest.id);
    const detailIsCompleted = user?.completedTests?.[activeTest.id] !== undefined;
    const themeColor = detailIsCompleted ? '#10b981' : detailTheme.themeColor;
    const themeColorRgb = detailIsCompleted ? '16, 185, 129' : detailTheme.themeColorRgb;

    return (
      <div 
        className="max-w-4xl mx-auto space-y-8 pb-20"
        style={{
          ['--theme-color' as any]: themeColor,
          ['--theme-color-rgb' as any]: themeColorRgb,
        }}
      >
        <button 
          onClick={() => setActiveTest(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          <span>{language === 'ar' ? 'العودة للاختبارات' : 'Back to Neural Tests'}</span>
        </button>

        <div 
          className={cn(
            "glass-card p-8 md:p-12 text-center relative overflow-hidden transition-all duration-500 border rounded-3xl",
            detailIsCompleted ? "border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]" : "border-[rgba(var(--theme-color-rgb),0.2)] shadow-[0_0_50px_rgba(var(--theme-color-rgb),0.1)]"
          )}
        >
          <CardBackgroundAnimation type={detailTheme.bgAnimType} id={activeTest.id} isHovered={true} />

          <div className="relative z-20 flex flex-col items-center">
             <div 
               className={cn(
                 "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-all duration-500 shadow-xl",
                 detailIsCompleted 
                   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                   : "bg-[rgba(var(--theme-color-rgb),0.1)] text-[var(--theme-color)] border-[rgba(var(--theme-color-rgb),0.2)]"
               )}
             >
                <activeTest.icon className="w-8 h-8 animate-pulse" />
             </div>
             
             <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">
               {language === 'ar' ? activeTest.nameAr : activeTest.nameEn}
             </h1>
             
             <p className="text-slate-400 font-normal mb-8 max-w-xl mx-auto text-xs md:text-sm leading-relaxed">
               {language === 'ar' 
                 ? 'سيقوم هذا التقييم بتحليل أنماطك السلوكية وعرض سيناريوهات تفاعلية بالذكاء الاصطناعي.' 
                 : 'This assessment will audit your behavioral patterns using AI-powered dynamic scenarios.'}
             </p>

             <div className="grid grid-cols-3 gap-4 max-w-md w-full mx-auto mb-8 text-[10px] font-bold uppercase tracking-wider">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-500 text-[9px]">{language === 'ar' ? 'الأسئلة' : 'QUESTIONS'}</span>
                   <span className="text-white text-xs font-extrabold">{activeTest.questions} Qs</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-500 text-[9px]">{language === 'ar' ? 'الوقت' : 'DURATION'}</span>
                   <span className="text-white text-xs font-extrabold">{activeTest.time}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-500 text-[9px]">{language === 'ar' ? 'الفئة' : 'CATEGORY'}</span>
                   <span className="text-white text-xs font-extrabold">{activeTest.category}</span>
                </div>
             </div>

             <button 
               onClick={() => setRunningTest(true)}
               className={cn(
                 "px-10 py-4 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2",
                 detailIsCompleted
                   ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-400"
                   : "bg-gradient-to-r from-brand-primary to-indigo-600 shadow-brand-primary/30 hover:brightness-110"
               )}
             >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? 'بدء التقييم التفاعلي الآن' : 'Start Interactive Test'}</span>
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* AI TEST COMPLETION RESULT MODAL */}
      <AnimatePresence>
        {testResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="max-w-md w-full glass-card p-6 rounded-3xl bg-slate-950 border border-brand-primary/40 shadow-2xl space-y-5 text-center relative"
            >
              <button 
                onClick={() => setTestResultModal(null)}
                className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-emerald-500 flex items-center justify-center text-white mx-auto shadow-xl shadow-brand-primary/30">
                <Trophy size={32} className="animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-md border border-brand-primary/20">
                  {testResultModal.testName}
                </span>
                <h3 className="text-2xl font-black text-white mt-2">
                  {language === 'ar' ? 'مكتمل بنجاح!' : 'Audit Completed!'}
                </h3>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-around">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">{language === 'ar' ? 'درجة الكفاءة' : 'Neuro Score'}</p>
                  <p className="text-2xl font-black text-emerald-400">{testResultModal.score}%</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">{language === 'ar' ? 'نقاط خبرة' : 'XP Earned'}</p>
                  <p className="text-2xl font-black text-amber-400">+{testResultModal.xpGained} XP</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-300 leading-relaxed text-right">
                <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Brain size={14} />
                  <span>{language === 'ar' ? 'التحليل العصبي الفوري' : 'Neural Analysis'}</span>
                </div>
                <p>{testResultModal.aiInsight}</p>
              </div>

              <button
                onClick={() => setTestResultModal(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:brightness-110 transition-all"
              >
                {language === 'ar' ? 'حفظ وتحديث الملف الشخصي' : 'Save & Update Profile'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-1">
            <BrainCircuit className="w-4 h-4 fill-brand-primary" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Assessment Engine (26 Tools)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{language === 'ar' ? 'الوحدات العصبية والتقييمات الذكية' : 'Neural Tests & Tools'}</h1>
          <p className="text-slate-400 text-xs font-normal mt-0.5">
            {language === 'ar' 
              ? 'اختبارات عصبية تفاعلية مدعومة بالذكاء الاصطناعي لتحديث الحمض النووي لشخصيتك.' 
              : 'Interactive neural diagnostics powered by AI scenarios to calibrate your personality DNA.'}
          </p>
        </div>
        
        <div className="w-full md:w-72 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder={language === 'ar' ? 'بحث عن تقييم...' : 'Search tools...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all border whitespace-nowrap",
              activeCategory === cat 
                ? "bg-brand-primary text-white border-brand-primary/60 shadow-md shadow-brand-primary/20" 
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            )}
          >
            {language === 'ar' ? (cat === 'All' ? 'الكل (26 أداة)' : cat) : cat}
          </button>
        ))}
      </div>

      {/* Tests Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTests.map((test) => (
            <motion.div
              layout
              key={test.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <NeuralTestCard
                test={test}
                onClick={() => setActiveTest(test)}
                language={language}
                isRTL={isRTL}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
