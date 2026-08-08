import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  Zap,
  Target,
  Brain,
  Flame,
  Trophy,
  Shield,
  Heart,
  Users,
  ArrowUpRight,
  ChevronRight,
  Target as TargetIcon,
  Search,
  MessageSquare,
  MessageCircle,
  X,
  CreditCard,
  Library as LibraryIcon,
  HelpCircle,
  Dna,
  Settings,
  AlertCircle,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { coreTools, Tool } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TestRunner } from '../components/personality/TestRunner';
import { analyzePersonality, getAxisDescription, getDynamicStability } from '../lib/personalityAnalyzer';



const radarData = [
  { subject: 'Confidence', subjectAr: 'الثقة', A: 65 },
  { subject: 'Discipline', subjectAr: 'الانضباط', A: 48 },
  { subject: 'Emotional', subjectAr: 'عاطفي', A: 75 },
  { subject: 'Charisma', subjectAr: 'الكاريزما', A: 50 },
  { subject: 'Leadership', subjectAr: 'القيادة', A: 60 },
  { subject: 'Consistency', subjectAr: 'الاتساق', A: 45 },
  { subject: 'Focus', subjectAr: 'التركيز', A: 85 },
  { subject: 'Social', subjectAr: 'اجتماعي', A: 40 },
  { subject: 'Self Worth', subjectAr: 'الذات', A: 55 },
  { subject: 'Empathy', subjectAr: 'التعاطف', A: 70 },
];

const moodData = [
  { day: 'Mon', score: 6 },
  { day: 'Tue', score: 4 },
  { day: 'Wed', score: 8 },
  { day: 'Thu', score: 7 },
  { day: 'Fri', score: 9 },
  { day: 'Sat', score: 5 },
  { day: 'Sun', score: 7 },
];

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const profile = analyzePersonality(user);
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(!user?.onboardingComplete);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [modalTab, setModalTab] = useState<'guide' | 'utility' | 'benefit'>('guide');
  const [activeTest, setActiveTest] = useState<any>(null);

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

      await updateUser(updateData);
    }
    setActiveTest(null);
  };

  const dynamicRadarData = [
    { subject: 'Confidence', subjectAr: 'الثقة', A: user?.confidence !== undefined ? user.confidence : 65 },
    { subject: 'Discipline', subjectAr: 'الانضباط', A: user?.discipline !== undefined ? user.discipline : 48 },
    { subject: 'Emotional', subjectAr: 'عاطفي', A: user?.emotional !== undefined ? user.emotional : 75 },
    { subject: 'Charisma', subjectAr: 'الكاريزما', A: user?.charisma !== undefined ? user.charisma : 50 },
    { subject: 'Leadership', subjectAr: 'القيادة', A: user?.leadership !== undefined ? user.leadership : 60 },
    { subject: 'Consistency', subjectAr: 'الاتساق', A: user?.consistency !== undefined ? user.consistency : 45 },
    { subject: 'Focus', subjectAr: 'التركيز', A: user?.focus !== undefined ? user.focus : 85 },
    { subject: 'Social', subjectAr: 'اجتماعي', A: user?.social !== undefined ? user.social : 40 },
    { subject: 'Self Worth', subjectAr: 'الذات', A: user?.selfWorth !== undefined ? user.selfWorth : 55 },
    { subject: 'Empathy', subjectAr: 'التعاطف', A: user?.empathy !== undefined ? user.empathy : 70 },
  ];

  const strongest = [...dynamicRadarData].sort((a, b) => b.A - a.A)[0];
  const weakest = [...dynamicRadarData].sort((a, b) => a.A - b.A)[0];

  const [activeProtocolSession, setActiveProtocolSession] = useState<'breathing' | 'timer' | 'pause' | null>(null);
  const [sessionStep, setSessionStep] = useState<'idle' | 'running' | 'completed'>('idle');
  const [sessionTimer, setSessionTimer] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'inhake' | 'hold' | 'exhale'>('inhake');

  const startProtocolSession = () => {
    setSessionStep('running');
    const wKey = weakest.subject.toLowerCase();
    if (wKey === 'focus' || wKey === 'التركيز') {
      setSessionTimer(4);
      setBreathPhase('inhake');
    } else if (wKey === 'discipline' || wKey === 'الانضباط') {
      setSessionTimer(300);
    } else {
      setSessionTimer(10);
    }
  };

  const completeProtocolSession = async () => {
    setSessionStep('completed');
    if (user) {
      const currentStability = getDynamicStability(user);
      const newStability = Math.min(100, currentStability + 2);
      try {
        await updateUser({ stability: newStability });
      } catch (err) {
        console.error("Error updating stability:", err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  React.useEffect(() => {
    if (sessionStep !== 'running' || !activeProtocolSession) return;

    const interval = setInterval(() => {
      setSessionTimer((prev) => {
        if (prev <= 1) {
          if (activeProtocolSession === 'breathing') {
            if (breathPhase === 'inhake') {
              setBreathPhase('hold');
              return 7;
            } else if (breathPhase === 'hold') {
              setBreathPhase('exhale');
              return 8;
            } else {
              clearInterval(interval);
              completeProtocolSession();
              return 0;
            }
          } else {
            clearInterval(interval);
            completeProtocolSession();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStep, activeProtocolSession, breathPhase]);

  // Update onboarding state when user changes
  React.useEffect(() => {
    if (user?.onboardingComplete) {
      setShowOnboarding(false);
    }
  }, [user]);

  // Update daily activity streak dynamically
  React.useEffect(() => {
    if (!user || !user.uid) return;

    // Use current local date formatted as YYYY-MM-DD
    const localToday = new Date();
    const year = localToday.getFullYear();
    const month = String(localToday.getMonth() + 1).padStart(2, '0');
    const day = String(localToday.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const lastActive = user.lastActive;
    let currentStreak = user.streak !== undefined ? user.streak : 1;

    if (!lastActive) {
      // First time tracking or reset
      updateUser({
        lastActive: todayStr,
        streak: 1
      }).catch(err => console.error("Error setting initial streak:", err));
    } else if (lastActive !== todayStr) {
      const todayDate = new Date(todayStr);
      const lastActiveDate = new Date(lastActive);
      const diffTime = todayDate.getTime() - lastActiveDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Active on consecutive days
        updateUser({
          lastActive: todayStr,
          streak: currentStreak + 1
        }).catch(err => console.error("Error incrementing streak:", err));
      } else if (diffDays > 1) {
        // Streak broken (more than 1 day difference)
        updateUser({
          lastActive: todayStr,
          streak: 1
        }).catch(err => console.error("Error resetting streak:", err));
      } else if (diffDays < 0) {
        // Safe check for timezone changes
        updateUser({
          lastActive: todayStr
        }).catch(err => console.error("Error updating lastActive date:", err));
      }
    }
  }, [user?.uid, user?.lastActive]);

  // Simulated AI Credits (1-2 times daily)
  const [aiCredits, setAiCredits] = useState(2);

  const [tenantConfig, setTenantConfig] = useState<any>(null);

  // Load tenant configuration (free trial days, colors, etc.)
  React.useEffect(() => {
    const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');
    if (!adminId) return;

    getDoc(doc(db, 'tenants', adminId))
      .then(snap => {
        if (snap.exists()) {
          setTenantConfig(snap.data());
        }
      })
      .catch(err => console.error("Error loading tenant config on dashboard:", err));
  }, [user]);

  // Compute subscription state and remaining days
  const getSubscriptionInfo = () => {
    if (!user) return { isActive: false, type: 'none', daysLeft: 0, expired: true };
    
    // Admins and super admins have lifetime/unlimited access
    if (user.role === 'admin' || user.role === 'super_admin') {
      return { isActive: true, type: 'admin', daysLeft: 9999, expired: false };
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
          isActive: Date.now() <= expiresMs,
          type: 'trial',
          daysLeft,
          expired: Date.now() > expiresMs,
          expiryDate: new Date(expiresMs)
        };
      }
    }

    if (user.expiresAt) {
      const ts = user.expiresAt;
      const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      const daysLeft = Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
      return {
        isActive: Date.now() <= expiresMs,
        type: 'subscription',
        daysLeft,
        expired: Date.now() > expiresMs,
        expiryDate: new Date(expiresMs)
      };
    }

    // Default: expired if no trial or expiresAt exists
    return { isActive: false, type: 'none', daysLeft: 0, expired: true };
  };

  const subInfo = getSubscriptionInfo();

  const goals = [
    { label: "Confidence Building", labelAr: "بناء الثقة", icon: Zap },
    { label: "Stress Release", labelAr: "تخفيف التوتر", icon: Heart },
    { label: "Personal Power", labelAr: "القوة الشخصية", icon: Shield },
    { label: "Social Dominance", labelAr: "الهيمنة الاجتماعية", icon: Users },
    { label: "Deep Discipline", labelAr: "الانضباط العميق", icon: TargetIcon },
    { label: "Productivity", labelAr: "الإنتاجية", icon: Activity },
    { label: "Self Understanding", labelAr: "فهم الذات", icon: Brain },
    { label: "Building Habits", labelAr: "بناء العادات", icon: Flame },
  ];

  if (activeTest) {
    return <TestRunner test={activeTest} onCancel={() => setActiveTest(null)} onComplete={handleTestComplete} />;
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card max-w-2xl w-full p-6 md:p-12 text-center relative overflow-hidden"
            >
              <div className={cn("absolute top-0 p-4 md:p-8", isRTL ? "left-0" : "right-0")}>
                 <button onClick={() => {
                    setShowOnboarding(false);
                    updateUser({ onboardingComplete: true });
                 }} className="text-slate-500 hover:text-white transition-colors">
                    <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest">{t('skip')}</span>
                 </button>
              </div>
              
              <div className="w-16 h-16 md:w-20 md:h-20 bg-brand-primary/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-6 md:mb-8 border border-brand-primary/10 shadow-2xl shadow-brand-primary/20">
                 <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-brand-primary" />
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2 md:mb-4">{t('initialize_growth')}</h2>
              <p className="text-sm md:text-base text-slate-400 font-medium mb-8 md:mb-12">{t('what_develop')}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                 {goals.map((goal) => (
                   <button 
                     key={goal.label}
                     onClick={() => {
                        setShowOnboarding(false);
                        updateUser({ onboardingComplete: true });
                     }}
                     className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all group"
                   >
                     <goal.icon className="w-5 h-5 md:w-6 md:h-6 text-slate-500 mb-2 md:mb-3 mx-auto group-hover:text-brand-primary" />
                     <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white text-center leading-tight">
                       {language === 'ar' ? goal.labelAr : goal.label}
                     </p>
                   </button>
                 ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showExplanation && selectedTool && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="glass-card max-w-xl w-full p-6 md:p-10 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowExplanation(false)}
                className={cn("absolute top-6 text-slate-500 hover:text-white", isRTL ? "left-6" : "right-6")}
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <selectedTool.icon size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t(selectedTool.nameKey)}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{selectedTool.category}</p>
                 </div>
              </div>

              <div className="flex gap-2 mb-6 border-b border-white/5">
                {(['guide', 'utility', 'benefit'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={cn(
                      "pb-2 text-[10px] font-black uppercase tracking-widest transition-all relative",
                      modalTab === tab ? "text-brand-primary border-b-2 border-brand-primary" : "text-slate-500 hover:text-white"
                    )}
                  >
                    {t(tab as any)}
                  </button>
                ))}
              </div>

              <div className="min-h-[200px]">
                 <AnimatePresence mode="wait">
                    {modalTab === 'guide' && (
                      <motion.div 
                        key="guide"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                         <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                            <Target size={12} /> {t('step_by_step')}
                         </h4>
                         <div className="space-y-3">
                            <div className="flex gap-3">
                               <span className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-black flex items-center justify-center text-brand-primary">1</span>
                               <p className="text-xs text-slate-300 font-medium">{language === 'ar' ? 'قم بتهيئة الوحدة العصبية للمزامنة مع هويتك الحالية.' : 'Initialize the neural module to sync with your current identity.'}</p>
                            </div>
                            <div className="flex gap-3">
                               <span className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-black flex items-center justify-center text-brand-primary">2</span>
                               <p className="text-xs text-slate-300 font-medium">{language === 'ar' ? 'أكمل التقييم التفاعلي لجمع البيانات السلوكية.' : 'Complete the interactive assessment to gather behavioral data.'}</p>
                            </div>
                            <div className="flex gap-3">
                               <span className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-black flex items-center justify-center text-brand-primary">3</span>
                               <p className="text-xs text-slate-300 font-medium">{language === 'ar' ? 'استلم بروتوكول التنفيذ المخصص وابدأ التطبيق العملي.' : 'Receive your custom execution protocol and start practical application.'}</p>
                            </div>
                         </div>
                      </motion.div>
                    )}

                    {modalTab === 'utility' && (
                      <motion.div 
                        key="utility"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                         <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                            <Zap size={12} /> {t('daily_utility')}
                         </h4>
                         <p className="text-xs text-slate-300 leading-relaxed">
                            {language === 'ar' 
                              ? 'استخدم هذه الأداة في بداية يومك لضبط مساراتك العصبية، أو عند مواجهة مواقف تتطلب تدخلاً استراتيجيًا فورياً.'
                              : 'Use this tool at the start of your day to prime your neural paths, or when facing situations requiring immediate strategic intervention.'}
                         </p>
                         <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('neural_context')}</span>
                            <span className="text-[10px] font-black text-white uppercase ">{language === 'ar' ? 'تزامن عالي' : 'High Sync'}</span>
                         </div>
                      </motion.div>
                    )}

                    {modalTab === 'benefit' && (
                      <motion.div 
                        key="benefit"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                         <h4 className="flex items-center gap-2 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">
                            <Star size={12} /> {t('personal_benefit')}
                         </h4>
                         <p className="text-xs text-slate-300 leading-relaxed">
                            {t(selectedTool.descKey)} {t('tool_explanation_suffix')}
                         </p>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                               <h4 className="text-[8px] font-black text-brand-primary uppercase tracking-widest mb-1">{t('result')}</h4>
                               <p className="text-[10px] font-bold text-white uppercase ">{t('neural_optimization')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                               <h4 className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mb-1">{t('benefit')}</h4>
                               <p className="text-[10px] font-bold text-white uppercase ">{t('dominance_bonus')}</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button 
                  onClick={() => {
                    setShowExplanation(false);
                    const toolMap: Record<string, string> = {
                      'assistant': '/coach',
                      'daily-ritual': '/habits',
                      'neural-flow': '/cognitive-load',
                      'planner': '/journey',
                      'empathy': '/social-iq',
                      'shadow': '/dna',
                      'dna-sync': '/dna',
                      'dna': '/dna',
                      'archetype': '/dna',
                      'eq': '/emotional-iq',
                      'social-energy': '/social-iq',
                      'conflict': '/social-iq',
                      'communication': '/social-iq',
                      'focus': '/cognitive-load',
                      'discipline': '/growth-lab',
                      'habit': '/habits',
                      'mission': '/growth-lab',
                      'journal': '/coach',
                      'toxicity': '/toxicity',
                      'growth-velocity': '/velocity',
                      'trauma': '/tests',
                      'confidence': '/dna',
                      'burnout': '/crisis',
                      'charisma': '/social-iq',
                      'self-worth': '/dna',
                      'silence': '/social-iq',
                      'leadership': '/growth-lab',
                      'eq-assessment': '/emotional-iq',
                      'discipline-index': '/growth-lab',
                      'conflict-resolution': '/social-iq',
                      'self-worth-pulse': '/dna',
                      'social-energy-tracker': '/social-iq',
                      'focus-mastery': '/cognitive-load',
                      'burnout-resistance': '/crisis',
                      'archetype-detection': '/archetype',
                      'habit-forge': '/habits',
                      'strategic-silence': '/social-iq',
                      'micro-mission-lab': '/growth-lab',
                      'neural-journaling': '/coach',
                      'leadership-iq': '/growth-lab',
                      'trauma-audit': '/tests',
                      'communication-bio': '/social-iq',
                      'dna-synchronization': '/dna'
                    };
                    
                    if (subInfo.expired && user?.role !== 'admin' && user?.role !== 'super_admin') {
                      setShowExplanation(false);
                      navigate('/billing');
                      return;
                    }
                    const targetPath = toolMap[selectedTool.id];
                    if (targetPath) {
                      navigate(targetPath);
                    } else if (['journey', 'library', 'tests'].includes(selectedTool.id)) {
                      navigate(`/${selectedTool.id}`);
                    } else {
                      alert(language === 'ar' ? 'هذه الوحدة قيد التطوير العصبي حالياً.' : 'This module is currently under neural development.');
                    }
                  }}
                  className="flex-1 py-4 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-brand-primary hover:text-white transition-all text-center"
                >
                  {t('get_started_tool')}
                </button>
                <button 
                  onClick={() => {
                    setShowExplanation(false);
                    setActiveTest({
                      id: selectedTool.id,
                      name: t(selectedTool.nameKey),
                      questions: 5
                    });
                  }}
                  className="flex-1 py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:brightness-110 active:scale-95 transition-all text-center"
                >
                  {language === 'ar' ? 'إجراء التقييم العصبي' : 'Take Neural Audit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-12 gap-4 md:gap-6 pb-20">
        

        
        {subInfo.expired && user?.role !== 'admin' && user?.role !== 'super_admin' && (() => {
          const whatsappNumber = tenantConfig?.whatsappNumber;
          const whatsappLink = whatsappNumber 
            ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحساب Humanos AI الخاص بي (${user?.email || ''}) وأرغب في تفعيل الاشتراك.` : `Hello, my Humanos AI free trial has ended for (${user?.email || ''}) and I would like to activate my subscription.`)}`
            : `https://wa.me/201145680938?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحساب Humanos AI الخاص بي (${user?.email || ''}) وأرغب في تفعيل الاشتراك.` : `Hello, my Humanos AI free trial has ended for (${user?.email || ''}) and I would like to activate my subscription.`)}`;

          return (
            <div className="col-span-12 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex flex-col md:flex-row justify-between items-center gap-4 text-rose-400">
               <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-rose-500 animate-pulse shrink-0" />
                  <div className="text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                     <h4 className="font-bold text-white text-base">
                        {user?.isTrial 
                          ? (language === 'ar' ? 'انتهت الفترة التجريبية (Free Trial)' : 'Free Trial Expired!')
                          : (language === 'ar' ? 'انتهت صلاحية وصولك العصبية!' : 'Your Neural Access Has Expired!')}
                     </h4>
                     <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {user?.isTrial
                          ? (language === 'ar'
                            ? 'انتهت فترة التجربة المجانية الخاصة بك. يرجى التواصل معنا عبر الواتساب لتفعيل حسابك ومتابعة تطوير ذكائك الاصطناعي.'
                            : 'Your free trial period has ended. Please contact us via WhatsApp to activate your account and continue utilizing premium neural modules.')
                          : (language === 'ar' 
                            ? 'انتهت فترة صلاحية الاشتراك. يرجى تجديد الاشتراك للاستمرار في تشغيل الوحدات وتطوير ذكائك الاصطناعي.'
                            : 'Your subscription period has ended. Please renew your access to continue utilizing premium neural modules.')}
                     </p>
                  </div>
               </div>
               {user?.isTrial ? (
                 <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-green-600/30 hover:brightness-110 active:scale-95 transition-all text-center flex items-center gap-2 whitespace-nowrap font-bold"
                 >
                    <MessageCircle size={14} />
                    <span>{language === 'ar' ? 'تفعيل الحساب عبر الواتساب' : 'ACTIVATE VIA WHATSAPP'}</span>
                 </a>
               ) : (
                 <button 
                    onClick={() => navigate('/billing')}
                    className="px-6 py-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-600/30 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
                 >
                    {language === 'ar' ? 'تفعيل الاشتراك الآن' : 'ACTIVATE SUBSCRIPTION NOW'}
                 </button>
               )}
            </div>
          );
        })()}
        <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 text-xs">
           {[
             { label: 'Stability', labelAr: 'الاستقرار', val: `${getDynamicStability(user)}%`, icon: Activity, color: 'text-emerald-400', onClick: () => navigate('/tests') },
             { label: 'Streak', labelAr: 'النشاط', val: user?.streak !== undefined ? `${user.streak} ${language === 'ar' ? 'يوم' : 'Days'}` : (language === 'ar' ? '1 يوم' : '1 Day'), icon: Flame, color: 'text-orange-400', onClick: () => navigate('/habits') },
             { 
               label: 'Subscription', 
               labelAr: 'الاشتراك', 
               val: subInfo.type === 'admin'
                 ? (language === 'ar' ? 'وصول كامل' : 'Lifetime Access')
                 : subInfo.type === 'trial'
                   ? (language === 'ar' ? 'فترة تجريبية' : 'Free Trial')
                   : subInfo.type === 'subscription'
                     ? (language === 'ar' ? 'باقة احترافية' : 'Pro Plan')
                     : (language === 'ar' ? 'لا يوجد اشتراك' : 'No Active Plan'),
               icon: Trophy, 
               color: 'text-amber-400',
               onClick: () => navigate('/billing')
             },
             { 
               label: 'Access Time', 
               labelAr: 'صلاحية الوصول', 
               val: subInfo.type === 'admin'
                 ? (language === 'ar' ? 'مستمر' : 'Unlimited')
                 : subInfo.expired
                   ? (language === 'ar' ? 'منتهي' : 'Expired')
                   : `${subInfo.daysLeft} ${language === 'ar' ? 'أيام متبقية' : 'Days Left'}`, 
               icon: CreditCard, 
               color: subInfo.expired ? 'text-rose-400 animate-pulse' : 'text-brand-primary',
               onClick: () => navigate('/billing')
             },
           ].map((stat) => (
             <div 
               key={stat.label} 
               className={cn(
                 "glass-card p-2 md:p-4 flex items-center gap-2 md:gap-4 shadow-sm",
                 stat.onClick && "cursor-pointer hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all"
               )}
               onClick={stat.onClick}
             >
                <div className={cn("w-6 h-6 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center", stat.color)}>
                   <stat.icon size={14} className="md:w-5 md:h-5" />
                </div>
                <div className="min-w-0">
                   <p className="text-[6px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5 truncate">{language === 'ar' ? stat.labelAr : stat.label}</p>
                   <p className="font-black text-white text-[10px] md:text-sm">{stat.val}</p>
                </div>
             </div>
           ))}
        </div>

        {/* 2. Intelligence Insight Layer */}
        <div className="col-span-12 lg:col-span-8">
           <div className="glass-card bg-gradient-to-br from-brand-primary/10 to-transparent border-brand-primary/20 p-5 md:p-8 relative overflow-hidden h-full">
              <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-8">
                 <div className="w-8 h-8 rounded-lg md:rounded-xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30">
                    <Sparkles size={16} className="md:w-5 md:h-5 text-white" />
                 </div>
                 <div>
                    <h3 className="text-[7px] md:text-[10px] font-black text-brand-primary uppercase tracking-[0.25em] whitespace-nowrap">{t('intelligence_insight')}</h3>
                    <p className="text-[8px] md:text-xs text-slate-500 font-bold tracking-tight">{t('generated_vectors')}</p>
                 </div>
              </div>
              
              <h2 className="text-lg md:text-3xl font-light text-white leading-tight mb-6 md:mb-8">
                "{language === 'ar' ? profile.insightAr : profile.insight}"
              </h2>
              
              <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-6 md:mb-10">
                  <div className="flex-1 p-4 rounded-xl md:rounded-3xl bg-white/5 border border-white/5 hover:border-brand-primary/40 transition-all cursor-pointer group">
                     <p className="text-[7px] font-black uppercase tracking-widest text-slate-500 mb-1">Protocol 01</p>
                     <p className="text-[10px] md:text-sm font-bold text-white tracking-tight leading-snug">
                       {language === 'ar' ? profile.protocol01Ar : profile.protocol01}
                     </p>
                  </div>
                  <div className="flex-1 p-4 rounded-xl md:rounded-3xl bg-white/5 border border-white/5 hover:border-brand-primary/40 transition-all cursor-pointer group">
                     <p className="text-[7px] font-black uppercase tracking-widest text-slate-500 mb-1">Protocol 02</p>
                     <p className="text-[10px] md:text-sm font-bold text-white tracking-tight leading-snug">
                       {language === 'ar' ? profile.protocol02Ar : profile.protocol02}
                     </p>
                  </div>
              </div>
               <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
                 <button 
                   onClick={() => {
                     const wKey = weakest.subject.toLowerCase();
                     let type: 'breathing' | 'timer' | 'pause' = 'pause';
                     if (wKey === 'focus' || wKey === 'التركيز') type = 'breathing';
                     else if (wKey === 'discipline' || wKey === 'الانضباط') type = 'timer';
                     setActiveProtocolSession(type);
                     setSessionStep('idle');
                   }}
                   className="px-6 py-2.5 bg-brand-primary text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg md:rounded-2xl hover:brightness-110 shadow-lg shadow-brand-primary/30 transition-all active:scale-95 flex items-center gap-2"
                 >
                   <Zap size={12} className="animate-pulse" />
                   <span>{language === 'ar' ? 'تطبيق البروتوكول' : 'RUN PROTOCOL'}</span>
                 </button>
                 <button 
                   onClick={() => navigate('/coach')}
                   className="px-6 py-2.5 bg-white/5 border border-white/5 hover:bg-white/10 text-white text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] rounded-lg md:rounded-2xl transition-all active:scale-95"
                 >
                   {t('consult_coach')}
                 </button>
                 <button 
                   onClick={() => navigate('/crisis')}
                   className="flex items-center gap-2 text-[8px] md:text-[10px] font-black tracking-widest text-red-500 hover:text-red-400 transition-colors"
                 >
                   <AlertCircle size={14} className="animate-pulse" />
                   {language === 'ar' ? 'مساعدة عاجلة (يوم سيء)' : 'EMERGENCY HELP (BAD DAY)'}
                 </button>
               </div>

               {/* Dynamic Interactive Protocol Session */}
               <AnimatePresence>
                 {activeProtocolSession && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20"
                   >
                      <button 
                        onClick={() => {
                          setActiveProtocolSession(null);
                          setSessionStep('idle');
                        }}
                        className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                      >
                         <X size={20} />
                      </button>

                      {sessionStep === 'idle' && (
                        <div className="max-w-md">
                           <Zap className="w-12 h-12 text-brand-primary mx-auto mb-4 animate-bounce" />
                           <h3 className="text-xl font-bold text-white mb-2">
                             {language === 'ar' ? 'بدء تدريب البروتوكول العيادي' : 'Start Clinical Protocol Training'}
                           </h3>
                           <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                             {language === 'ar' 
                               ? 'سيقوم النظام بتهيئة مساحة تدريب تفاعلية لتحفيز الاتساق وتقليل الضغط عن أضعف منطقة لديك حالياً.'
                               : 'The system will prepare an interactive workspace to stimulate consistency and reduce pressure on your weakest zone.'}
                           </p>
                           <button 
                             onClick={startProtocolSession}
                             className="px-8 py-3 bg-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
                           >
                             {language === 'ar' ? 'تفعيل وتدريب الآن (+2% استقرار)' : 'Activate & Train Now (+2% Stability)'}
                           </button>
                        </div>
                      )}

                      {sessionStep === 'running' && (
                        <div className="flex flex-col items-center justify-center">
                           <motion.div
                             animate={
                               activeProtocolSession === 'breathing'
                                 ? breathPhase === 'inhake' 
                                   ? { scale: 1.5, boxShadow: "0 0 40px rgba(99,102,241,0.6)" } 
                                   : breathPhase === 'hold' 
                                     ? { scale: 1.5, boxShadow: "0 0 50px rgba(99,102,241,0.8)" } 
                                     : { scale: 1.0, boxShadow: "0 0 10px rgba(99,102,241,0.2)" }
                                 : { scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(99,102,241,0.2)", "0 0 30px rgba(99,102,241,0.5)", "0 0 10px rgba(99,102,241,0.2)"] }
                             }
                             transition={
                               activeProtocolSession === 'breathing'
                                 ? { duration: breathPhase === 'inhake' ? 4 : breathPhase === 'hold' ? 7 : 8, ease: "easeInOut" }
                                 : { repeat: Infinity, duration: 2, ease: "easeInOut" }
                             }
                             className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-2xl"
                           >
                              {activeProtocolSession === 'timer' 
                                ? formatTime(sessionTimer) 
                                : sessionTimer}
                           </motion.div>

                           <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">
                              {activeProtocolSession === 'breathing' 
                                ? (language === 'ar' 
                                    ? (breathPhase === 'inhake' ? 'شهييق... (اسحب الهواء)' : breathPhase === 'hold' ? 'اكتم النفس... (استقرار)' : 'زفيير... (أخرج الهواء ببطء)')
                                    : (breathPhase === 'inhake' ? 'Inhale... (Pull Air)' : breathPhase === 'hold' ? 'Hold... (Calm)' : 'Exhale... (Slowly Release)'))
                                : activeProtocolSession === 'timer'
                                  ? (language === 'ar' ? 'جلسة التركيز والإنتاجية' : 'Focus Session Active')
                                  : (language === 'ar' ? 'توقف ذهني للتنفس والهدوء' : 'Mental Pause Session')}
                           </h4>
                           <p className="text-xs text-slate-400 max-w-xs leading-relaxed font-medium">
                              {activeProtocolSession === 'breathing'
                                ? (language === 'ar' ? 'اتبع إيقاع الدائرة لتنظيم ضربات القلب وتخفيف الضغط الذهني.' : 'Follow the circle rhythm to regulate heart rate and release mental pressure.')
                                : activeProtocolSession === 'timer'
                                  ? (language === 'ar' ? 'ابدأ العمل على الفور. لا تشتت انتباهك بأي شيء آخر حتى نهاية المؤقت.' : 'Start execution immediately. Do not distract yourself until the timer ends.')
                                  : (language === 'ar' ? 'خذ شهيقاً عميقاً، أغمض عينيك، وافصل ذهنك عن أي ضوضاء خارجية.' : 'Take a deep breath, close your eyes, and detach your mind from external noise.')}
                           </p>

                           {activeProtocolSession === 'timer' && (
                              <button 
                                onClick={completeProtocolSession}
                                className="mt-6 text-[8px] font-black uppercase tracking-widest text-brand-primary hover:text-white transition-colors"
                              >
                                 {language === 'ar' ? 'تخطي وإنهاء الجلسة بنجاح' : 'Skip & Finish Session Successfully'}
                              </button>
                           )}
                        </div>
                      )}

                      {sessionStep === 'completed' && (
                        <div className="max-w-md">
                           <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 text-emerald-400 animate-bounce">
                              <Trophy size={28} />
                           </div>
                           <h3 className="text-xl font-bold text-white mb-2">
                             {language === 'ar' ? 'تمت مزامنة البروتوكول بنجاح!' : 'Protocol Synced Successfully!'}
                           </h3>
                           <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                             {language === 'ar'
                               ? 'لقد قمت بإتمام المزامنة اليومية لتقليل التشتت. تم تحديث مؤشر استقرارك السلوكي (+2%).'
                               : 'You completed your daily sync to reduce friction. Your stability index has been updated (+2%).'}
                           </p>
                           <button 
                             onClick={() => {
                               setActiveProtocolSession(null);
                               setSessionStep('idle');
                             }}
                             className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-emerald-600/20"
                           >
                             {language === 'ar' ? 'العودة للوحة التحكم' : 'Return to Dashboard'}
                           </button>
                        </div>
                      )}
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
         </div>

        {/* 3. Personality Radar */}
        <div className="col-span-12 lg:col-span-4">
           <div className="glass-card flex flex-col h-full">
            <div className="flex justify-between items-start mb-4 md:mb-6">
              <h3 className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('neural_map')}</h3>
              <button onClick={() => navigate('/dna')} className="text-brand-primary hover:bg-brand-primary/10 p-1 md:p-2 rounded-lg transition-all">
                <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart data={dynamicRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.05)" />
                  <PolarAngleAxis 
                    dataKey={language === 'ar' ? "subjectAr" : "subject"} 
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 6, fontWeight: '900' }} 
                  />
                  <Radar name="DNA" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const name = payload[0].payload[language === 'ar' ? 'subjectAr' : 'subject'];
                        return (
                          <div className="glass-card p-2 border border-brand-primary/20 text-[10px] font-black text-white uppercase tracking-widest bg-slate-950/90 shadow-xl">
                            {name}: <span className="text-brand-primary font-bold">{payload[0].value}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
               <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5">
                 <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-slate-500">{t('archetype')}</span>
                 <span className="text-[9px] md:text-xs font-black text-brand-primary uppercase ">
                    {language === 'ar' ? profile.archetypeAr : profile.archetype}
                 </span>
               </div>
               
               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/20 transition-all text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('strongest_axis')}</p>
                 <p className="text-xs font-black text-brand-primary mb-1">
                   {language === 'ar' ? strongest.subjectAr : strongest.subject} ({strongest.A}%)
                 </p>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                   {getAxisDescription(strongest.subject, 'strongest', language)}
                 </p>
               </div>

               <div className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-primary/20 transition-all text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('growth_axis')}</p>
                 <p className="text-xs font-black text-rose-400 mb-1">
                   {language === 'ar' ? weakest.subjectAr : weakest.subject} ({weakest.A}%)
                 </p>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                   {getAxisDescription(weakest.subject, 'growth', language)}
                 </p>
               </div>
            </div>
          </div>
        </div>

        {/* 4. Genetic Core Toolkit (20 Tools Section) */}
        <div className="col-span-12 mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
             <div>
                <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-2">{t('toolset_title')}</h3>
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tighter uppercase">{language === 'ar' ? 'جميع الوحدات العصبية (26)' : 'All Neural Modules (26)'}</h2>
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
             {coreTools.map((tool) => (
                <div 
                  key={tool.id} 
                  className="glass-card p-4 md:p-6 group hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all cursor-pointer relative overflow-hidden"
                  onClick={() => {
                    setSelectedTool(tool);
                    setShowExplanation(true);
                  }}
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-brand-primary transition-colors">
                        <tool.icon size={18} />
                      </div>
                      <HelpCircle size={14} className="text-slate-700 group-hover:text-brand-primary transition-colors mt-1" />
                   </div>
                   
                   <h4 className="text-[10px] md:text-xs font-black text-white uppercase tracking-tight mb-1 group-hover:text-brand-primary transition-colors truncate">{t(tool.nameKey)}</h4>
                   <p className="text-[7px] md:text-[8px] font-black text-slate-500 uppercase tracking-widest group-hover:text-white/60 transition-colors uppercase leading-none truncate">{tool.category}</p>
                </div>
             ))}
          </div>
        </div>

        {/* Growth Matrix */}
        <div className="col-span-12 lg:col-span-8">
           <div className="glass-card h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[8px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{t('growth_matrix')}</h3>
                <TrendingUp className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="h-48 md:h-64 w-full min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 8, fontWeight: 900 }} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBase)" />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="glass-card p-2 border border-brand-primary/20 text-[10px] font-black text-white uppercase tracking-widest bg-slate-950/90 shadow-xl">
                              {language === 'ar' ? 'مؤشر النمو: ' : 'Growth: '}
                              <span className="text-brand-primary font-bold">{payload[0].value}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-4">
           {/* Diagnostic Quick View */}
           <div className="glass-card bg-emerald-500/5 border-emerald-500/20">
              <div className="flex items-center gap-3 mb-6 font-black text-[8px] md:text-[10px] text-emerald-500 uppercase tracking-widest">
                 <Shield className="w-4 h-4" />
                 {t('diagnostic_summary')}
              </div>
              <div className="space-y-4 text-[10px] md:text-xs">
                 {[
                   { label: "Anxiety", val: "12%", labelAr: "القلق" },
                   { label: "Focus", val: "88%", labelAr: "التركيز" },
                 ].map(item => (
                   <div key={item.label} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="font-bold text-slate-400 uppercase tracking-widest">{language === 'ar' ? item.labelAr : item.label}</span>
                      <span className="font-black text-white">{item.val}</span>
                   </div>
                 ))}
                 <div className="pt-2">
                    <p className="font-black uppercase text-slate-500 leading-relaxed  text-[7px] md:text-[8px]">
                       {t('stability_baseline')}
                    </p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
