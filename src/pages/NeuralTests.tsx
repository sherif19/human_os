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
  Trophy
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
    if (field) {
      const updateData: any = {};
      if (activeTest.id === 'burnout') {
        updateData[field] = Math.max(10, 100 - (score - 20));
      } else {
        updateData[field] = score;
      }

      const completedTests = (user as any).completedTests || {};
      completedTests[activeTest.id] = {
        score,
        completedAt: new Date().toISOString()
      };
      updateData.completedTests = completedTests;

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
          
          if (Array.isArray(aiResult.strengths)) {
            updateData.strengths = aiResult.strengths.join(', ');
          }
          if (Array.isArray(aiResult.strengthsAr)) {
            updateData.strengthsAr = aiResult.strengthsAr.join(', ');
          }
          if (Array.isArray(aiResult.weaknesses)) {
            updateData.weaknesses = aiResult.weaknesses.join(', ');
          }
          if (Array.isArray(aiResult.weaknessesAr)) {
            updateData.weaknessesAr = aiResult.weaknessesAr.join(', ');
          }
          
          if (Array.isArray(aiResult.growthPath)) {
            updateData.growthProtocol = aiResult.growthPath.map((step: string) => `"${step}"`).join(' ');
          }
          if (Array.isArray(aiResult.growthPathAr)) {
            updateData.growthProtocolAr = aiResult.growthPathAr.map((step: string) => `"${step}"`).join(' ');
          }

          if (Array.isArray(aiResult.recommendations) && aiResult.recommendations.length > 0) {
            updateData.protocol01 = aiResult.recommendations[0];
            updateData.protocol01Ar = aiResult.recommendationsAr?.[0] || aiResult.recommendations[0];
            if (aiResult.recommendations.length > 1) {
              updateData.protocol02 = aiResult.recommendations[1];
              updateData.protocol02Ar = aiResult.recommendationsAr?.[1] || aiResult.recommendations[1];
            }
          }
        }
      } catch (err) {
        console.error("AI Personality Analysis failed:", err);
        throw err;
      }

      await updateUser(updateData);
    }
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
        className="max-w-4xl mx-auto space-y-12 pb-32"
        style={{
          ['--theme-color' as any]: themeColor,
          ['--theme-color-rgb' as any]: themeColorRgb,
        }}
      >
        <button 
          onClick={() => setActiveTest(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ar' ? 'العودة للاختبارات' : 'Back to Neural Tests'}</span>
        </button>

        <div 
          className={cn(
            "glass-card p-12 text-center relative overflow-hidden transition-all duration-500 border",
            detailIsCompleted ? "border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.1)]" : "border-[rgba(var(--theme-color-rgb),0.15)] shadow-[0_0_50px_rgba(var(--theme-color-rgb),0.08)] hover:border-[rgba(var(--theme-color-rgb),0.3)]"
          )}
        >
          {/* Content-Aware Theme Background Animation */}
          <CardBackgroundAnimation type={detailTheme.bgAnimType} id={activeTest.id} isHovered={true} />

          <div className="relative z-20 flex flex-col items-center">
             <div 
               className={cn(
                 "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 border transition-all duration-500 shadow-xl",
                 detailIsCompleted 
                   ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                   : "bg-[rgba(var(--theme-color-rgb),0.1)] text-[var(--theme-color)] border-[rgba(var(--theme-color-rgb),0.2)]"
               )}
             >
                <activeTest.icon className="w-10 h-10 animate-pulse" />
             </div>
             
             <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
               {language === 'ar' ? activeTest.nameAr : activeTest.nameEn}
             </h1>
             
             <p className="text-slate-400 font-medium mb-12 max-w-xl mx-auto text-sm leading-relaxed">
               {language === 'ar' 
                 ? 'سيقوم هذا التقييم بتحليل أنماطك السلوكية لتقديم رؤى دقيقة للحمض النووي لشخصيتك.' 
                 : 'This assessment will analyze your behavioral patterns to provide accurate personality DNA insights.'}
             </p>

             <div className="grid grid-cols-3 gap-6 max-w-lg w-full mx-auto mb-12 text-[10px] font-black uppercase tracking-[0.15em]">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-600 text-[8px]">{language === 'ar' ? 'الأسئلة' : 'QUESTIONS'}</span>
                   <span className="text-white text-sm font-black">{activeTest.questions} Qs</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-600 text-[8px]">{language === 'ar' ? 'الوقت' : 'DURATION'}</span>
                   <span className="text-white text-sm font-black">{activeTest.time}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 flex flex-col justify-center items-center gap-1">
                   <span className="text-slate-600 text-[8px]">{language === 'ar' ? 'الفئة' : 'CATEGORY'}</span>
                   <span className="text-white text-sm font-black">{activeTest.category}</span>
                </div>
             </div>

             <button 
               onClick={() => setRunningTest(true)}
               className={cn(
                 "px-12 py-5 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer",
                 detailIsCompleted
                   ? "bg-emerald-500 shadow-emerald-500/20 hover:bg-emerald-400"
                   : "bg-[var(--theme-color)] shadow-[rgba(var(--theme-color-rgb),0.3)] hover:brightness-110"
               )}
             >
                {language === 'ar' ? 'بدء التقييم الآن' : 'Start Assessment Now'}
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="glass-card p-8 border border-white/5">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Shield className="w-4 h-4 text-[var(--theme-color)]" />
                 {language === 'ar' ? 'أمان البيانات' : 'Data Integrity'}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-medium">
                 {language === 'ar' 
                   ? 'يتم تشفير إجاباتك ومعالجتها بواسطة طبقة ذكاءنا العصبي بشكل خاص.' 
                   : 'Your answers are encrypted and processed by our neural intelligence layer exclusively.'}
              </p>
           </div>
           <div className="glass-card p-8 border border-white/5">
              <h4 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-amber-400" />
                 {language === 'ar' ? 'مكافأة الانتهاء' : 'Completion Bonus'}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed font-bold">
                 + {activeTest.questions * 5} XP & {language === 'ar' ? 'تحديث الحمض النووي' : 'DNA Update'}
              </p>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <BrainCircuit className="w-4 h-4 fill-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Assessment Layer</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{language === 'ar' ? 'الاختبارات العصبية' : 'Neural Tests'}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            {language === 'ar' 
              ? 'تزويد البيانات للاستخبارات الخاصة بك من خلال عمليات التدقيق القياسية.' 
              : 'Executing standardized psychological and performance audits.'}
          </p>
        </div>
        
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder={language === 'ar' ? 'بحث عن التقييمات...' : 'Search assessments...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-6 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/30 transition-all font-medium"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border whitespace-nowrap",
              activeCategory === cat 
                ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                : "bg-white/5 border-white/5 text-slate-500 hover:text-white"
            )}
          >
            {language === 'ar' ? (cat === 'All' ? 'الكل' : cat) : cat}
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
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

      {/* Case Studies / Diagnostic Results */}
      <div className="grid lg:grid-cols-2 gap-6">
         <div className="glass-card p-10 bg-gradient-to-br from-brand-primary/5 to-transparent border-brand-primary/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
               <Activity className="text-brand-primary" />
               {language === 'ar' ? 'دراسات الحالة والتشخيص' : 'Case Studies & Diagnostics'}
            </h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
               {language === 'ar' 
                 ? 'تحليل التقارير التشخيصية المتعمقة للكشط عن الأنماط المخفية في سلوكك.' 
                 : 'Analysis of in-depth diagnostic reports to uncover hidden patterns in your behavior.'}
            </p>
            <div className="space-y-3">
               {[
                 { label: "Anxiety Correlation Report", date: "May 12, 2026", labelAr: "تقرير ارتباط القلق" },
                 { label: "Social Dominance Case Study", date: "May 15, 2026", labelAr: "دراسة حالة الهيمنة الاجتماعية" },
               ].map(report => (
                 <div key={report.label} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/10 transition-all cursor-pointer group">
                    <div>
                       <p className="text-sm font-bold text-white">{language === 'ar' ? report.labelAr : report.label}</p>
                       <p className="text-[10px] text-slate-500 font-medium">{report.date}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-brand-primary transition-colors" />
                 </div>
               ))}
            </div>
         </div>

         <div className="glass-card p-10 bg-emerald-500/5 border-emerald-500/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
               <Award className="text-emerald-500" />
               {language === 'ar' ? 'رحلة تطوير الذات' : 'Self-Development Journey'}
            </h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
               {language === 'ar' 
                 ? 'المراحل التي قطعتها في إعادة بناء شخصيتك وتطوير مهاراتك الاجتماعية.' 
                 : 'The stages you have passed in rebuilding your personality and developing your social skills.'}
            </p>
            <div className="relative h-2 w-full bg-white/5 rounded-full mb-10 overflow-hidden">
               <div className="absolute left-0 top-0 h-full bg-emerald-500 w-[65%] rounded-full shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{language === 'ar' ? 'الشجاعة' : 'Courage'}</p>
                  <p className="text-lg font-black text-white">+12%</p>
               </div>
               <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-1">{language === 'ar' ? 'الانضباط' : 'Discipline'}</p>
                  <p className="text-lg font-black text-white">+24%</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
