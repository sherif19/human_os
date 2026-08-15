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
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isInitializingGoal, setIsInitializingGoal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [modalTab, setModalTab] = useState<'guide' | 'utility' | 'benefit'>('guide');
  const [activeTest, setActiveTest] = useState<any>(null);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsInitializingGoal(true);
    setTimeout(() => {
      setShowOnboarding(false);
      updateUser({ onboardingComplete: true, primaryGoal: goalId } as any);
    }, 700);
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

    if (!user.isTrial && (user.subscriptionTier || user.subscriptionType === 'lifetime')) {
      return { isActive: true, type: 'subscription', daysLeft: 999, expired: false };
    }

    // Default: expired if no trial or expiresAt exists
    return { isActive: false, type: 'none', daysLeft: 0, expired: true };
  };

  const subInfo = getSubscriptionInfo();

  const goals = [
    {
      id: 'confidence',
      label: "Confidence Building",
      labelAr: "بناء الثقة",
      desc: "Self-assurance & courage",
      descAr: "اليقين الداخلي والتخلص من التردد",
      icon: Zap,
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      border: "group-hover:border-amber-500/50",
      glow: "shadow-amber-500/20",
      iconColor: "text-amber-400 group-hover:text-amber-300",
      badgeBg: "bg-amber-500/10 border-amber-500/30",
    },
    {
      id: 'stress',
      label: "Stress Release",
      labelAr: "تخفيف التوتر",
      desc: "Inner peace & neuro-calm",
      descAr: "تهدئة الجهاز العصبي واستعادة التوازن",
      icon: Heart,
      gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      border: "group-hover:border-emerald-500/50",
      glow: "shadow-emerald-500/20",
      iconColor: "text-emerald-400 group-hover:text-emerald-300",
      badgeBg: "bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: 'power',
      label: "Personal Power",
      labelAr: "القوة الشخصية",
      desc: "Unshakable core presence",
      descAr: "فرض الحضور ورسم الحدود بثبات",
      icon: Shield,
      gradient: "from-purple-500/20 via-violet-500/10 to-transparent",
      border: "group-hover:border-purple-500/50",
      glow: "shadow-purple-500/20",
      iconColor: "text-purple-400 group-hover:text-purple-300",
      badgeBg: "bg-purple-500/10 border-purple-500/30",
    },
    {
      id: 'social',
      label: "Social Dominance",
      labelAr: "الهيمنة الاجتماعية",
      desc: "Charisma & magnetism",
      descAr: "إتقان التأثير الاجتماعي والكاريزما",
      icon: Users,
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      border: "group-hover:border-cyan-500/50",
      glow: "shadow-cyan-500/20",
      iconColor: "text-cyan-400 group-hover:text-cyan-300",
      badgeBg: "bg-cyan-500/10 border-cyan-500/30",
    },
    {
      id: 'discipline',
      label: "Deep Discipline",
      labelAr: "الانضباط العميق",
      desc: "Iron willpower & focus",
      descAr: "الالتزام الحازم وتجاوز التشتت",
      icon: TargetIcon,
      gradient: "from-rose-500/20 via-red-500/10 to-transparent",
      border: "group-hover:border-rose-500/50",
      glow: "shadow-rose-500/20",
      iconColor: "text-rose-400 group-hover:text-rose-300",
      badgeBg: "bg-rose-500/10 border-rose-500/30",
    },
    {
      id: 'productivity',
      label: "Productivity",
      labelAr: "الإنتاجية",
      desc: "Peak cognitive output",
      descAr: "مضاعفة الأداء وطاقة الإنجاز",
      icon: Activity,
      gradient: "from-yellow-500/20 via-amber-500/10 to-transparent",
      border: "group-hover:border-yellow-500/50",
      glow: "shadow-yellow-500/20",
      iconColor: "text-yellow-400 group-hover:text-yellow-300",
      badgeBg: "bg-yellow-500/10 border-yellow-500/30",
    },
    {
      id: 'self',
      label: "Self Understanding",
      labelAr: "فهم الذات",
      desc: "Decipher mental blueprints",
      descAr: "فك شفرة الشخصية والدوافع",
      icon: Brain,
      gradient: "from-fuchsia-500/20 via-pink-500/10 to-transparent",
      border: "group-hover:border-fuchsia-500/50",
      glow: "shadow-fuchsia-500/20",
      iconColor: "text-fuchsia-400 group-hover:text-fuchsia-300",
      badgeBg: "bg-fuchsia-500/10 border-fuchsia-500/30",
    },
    {
      id: 'habits',
      label: "Building Habits",
      labelAr: "بناء العادات",
      desc: "Atomic habit loops",
      descAr: "برمجة الروتين اليومي المستدام",
      icon: Flame,
      gradient: "from-orange-500/20 via-amber-500/10 to-transparent",
      border: "group-hover:border-orange-500/50",
      glow: "shadow-orange-500/20",
      iconColor: "text-orange-400 group-hover:text-orange-300",
      badgeBg: "bg-orange-500/10 border-orange-500/30",
    },
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
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.88, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="relative max-w-3xl w-full p-6 md:p-10 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 border border-white/10 shadow-[0_0_80px_rgba(14,165,233,0.15)] overflow-hidden my-auto"
            >
              {/* Background Glow Blobs */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-brand-primary/15 rounded-full blur-[110px] pointer-events-none animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />

              {/* Skip Button */}
              <div className={cn("absolute top-6 z-20", isRTL ? "left-6" : "right-6")}>
                 <button onClick={() => {
                    setShowOnboarding(false);
                    updateUser({ onboardingComplete: true });
                 }} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all text-xs font-medium flex items-center gap-1.5 group">
                    <span>{t('skip')}</span>
                    <ChevronRight size={14} className={cn("transition-transform group-hover:translate-x-0.5", isRTL && "rotate-180 group-hover:-translate-x-0.5")} />
                 </button>
              </div>
              
              {/* Header Badge & Titles */}
              <div className="text-center relative z-10 mb-8 md:mb-10">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                  className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-brand-primary/20 via-cyan-500/20 to-purple-500/20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-5 border border-brand-primary/30 shadow-2xl shadow-brand-primary/30 relative group"
                >
                   <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-brand-primary animate-pulse" />
                   <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-brand-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black tracking-[0.2em] uppercase mb-3 shadow-lg shadow-brand-primary/10">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                  {language === 'ar' ? 'تهيئة النظام البشري' : 'HUMAN OS // INITIALIZATION'}
                </div>

                <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                  {t('initialize_growth')}
                </h2>
                <p className="text-sm md:text-base text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                  {t('what_develop')}
                </p>
              </div>

              {/* Goals Cards Grid */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: 0.15 }
                  }
                }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10"
              >
                 {goals.map((goal) => {
                   const isSelected = selectedGoalId === goal.id;
                   const Icon = goal.icon;
                   return (
                     <motion.button 
                       key={goal.id}
                       variants={{
                         hidden: { opacity: 0, y: 20, scale: 0.92 },
                         visible: { opacity: 1, y: 0, scale: 1 }
                       }}
                       whileHover={{ y: -4, scale: 1.03 }}
                       whileTap={{ scale: 0.97 }}
                       onClick={() => handleGoalSelect(goal.id)}
                       disabled={isInitializingGoal}
                       className={cn(
                         "relative p-4 md:p-5 rounded-2xl transition-all duration-300 group text-right flex flex-col justify-between min-h-[120px] md:min-h-[140px] border overflow-hidden",
                         isSelected
                           ? "bg-brand-primary/20 border-brand-primary shadow-[0_0_30px_rgba(14,165,233,0.3)]"
                           : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] " + goal.border + " hover:shadow-lg " + goal.glow
                       )}
                     >
                       {/* Gradient Glow */}
                       <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", goal.gradient)} />
                       
                       <div className="flex items-center justify-between relative z-10 mb-3">
                         <div className={cn("w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-md", goal.badgeBg, isSelected ? "bg-brand-primary text-black border-brand-primary" : goal.iconColor)}>
                           <Icon className="w-5 h-5 md:w-6 md:h-6" />
                         </div>
                         <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-brand-primary transition-colors" />
                       </div>

                       <div className="relative z-10">
                         <h3 className="text-xs md:text-sm font-bold text-white group-hover:text-brand-primary transition-colors leading-snug mb-1">
                           {language === 'ar' ? goal.labelAr : goal.label}
                         </h3>
                         <p className="text-[10px] text-slate-400 font-normal leading-tight line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">
                           {language === 'ar' ? goal.descAr : goal.desc}
                         </p>
                       </div>

                       {/* Hover outline */}
                       <div className="absolute inset-0 border border-white/0 group-hover:border-white/15 rounded-2xl pointer-events-none transition-colors" />
                     </motion.button>
                   );
                 })}
              </motion.div>

              {/* Initializing Overlay */}
              {isInitializingGoal && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center mb-4 relative shadow-lg shadow-brand-primary/20">
                    <Sparkles className="w-7 h-7 text-brand-primary animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {language === 'ar' ? 'جاري معايرة وتنشيط المسار...' : 'Calibrating Neural Pathway...'}
                  </h4>
                  <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      className="h-full bg-gradient-to-r from-brand-primary via-cyan-400 to-purple-500 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {showExplanation && selectedTool && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 overflow-y-auto"
          >
            {/* Ambient Backlight Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />

            <motion.div 
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="glass-card max-w-xl w-full p-6 md:p-8 relative overflow-hidden bg-slate-950/90 border border-brand-primary/30 shadow-[0_0_60px_rgba(99,102,241,0.2)] rounded-3xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowExplanation(false)}
                className={cn("absolute top-5 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10", isRTL ? "left-5" : "right-5")}
              >
                <X size={18} />
              </button>
              
              {/* Modal Header */}
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-600 to-cyan-400 flex items-center justify-center text-white shrink-0 shadow-xl shadow-brand-primary/30 border border-brand-primary/40">
                    <selectedTool.icon size={26} className="animate-pulse" />
                 </div>
                 <div>
                    <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-2.5 py-0.5 rounded-md border border-brand-primary/20 inline-block mb-1">
                      {selectedTool.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-tight">{t(selectedTool.nameKey)}</h3>
                 </div>
              </div>

              {/* Modern Tab Bar */}
              <div className="flex p-1 gap-1 mb-6 rounded-2xl bg-white/5 border border-white/10">
                {(['guide', 'utility', 'benefit'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-xs font-extrabold transition-all relative text-center",
                      modalTab === tab 
                        ? "bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-md shadow-brand-primary/20" 
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {t(tab as any)}
                  </button>
                ))}
              </div>

              {/* Dynamic Animated Content */}
              <div className="min-h-[190px]">
                 <AnimatePresence mode="wait">
                    {modalTab === 'guide' && (
                      <motion.div 
                        key="guide"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-3.5"
                      >
                         <h4 className="flex items-center gap-2 text-[11px] font-black text-brand-primary uppercase tracking-widest">
                            <Target size={14} /> 
                            <span>{language === 'ar' ? 'دليل العمل خطوة بخطوة' : 'Step by Step Execution Guide'}</span>
                         </h4>
                         
                         <div className="space-y-2.5">
                            <motion.div 
                              whileHover={{ x: isRTL ? -4 : 4, scale: 1.01 }}
                              className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 transition-all hover:bg-white/10"
                            >
                               <span className="w-7 h-7 rounded-xl bg-brand-primary/20 border border-brand-primary/40 text-xs font-black flex items-center justify-center text-brand-primary shrink-0">1</span>
                               <p className="text-xs text-slate-200 font-medium leading-relaxed">{language === 'ar' ? 'قم بتهيئة الوحدة العصبية للمزامنة مع هويتك الحالية.' : 'Initialize the neural module to sync with your current identity.'}</p>
                            </motion.div>

                            <motion.div 
                              whileHover={{ x: isRTL ? -4 : 4, scale: 1.01 }}
                              className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 transition-all hover:bg-white/10"
                            >
                               <span className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-xs font-black flex items-center justify-center text-cyan-400 shrink-0">2</span>
                               <p className="text-xs text-slate-200 font-medium leading-relaxed">{language === 'ar' ? 'أكمل التقييم التفاعلي لجمع البيانات السلوكية.' : 'Complete the interactive assessment to gather behavioral data.'}</p>
                            </motion.div>

                            <motion.div 
                              whileHover={{ x: isRTL ? -4 : 4, scale: 1.01 }}
                              className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 transition-all hover:bg-white/10"
                            >
                               <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-black flex items-center justify-center text-emerald-400 shrink-0">3</span>
                               <p className="text-xs text-slate-200 font-medium leading-relaxed">{language === 'ar' ? 'استلم بروتوكول التنفيذ المخصص وابدأ التطبيق العملي.' : 'Receive your custom execution protocol and start practical application.'}</p>
                            </motion.div>
                         </div>
                      </motion.div>
                    )}

                    {modalTab === 'utility' && (
                      <motion.div 
                        key="utility"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                         <h4 className="flex items-center gap-2 text-[11px] font-black text-cyan-400 uppercase tracking-widest">
                            <Zap size={14} /> 
                            <span>{language === 'ar' ? 'مجالات الاستخدام اليومي' : 'Daily Utility Context'}</span>
                         </h4>
                         <p className="text-xs text-slate-300 leading-relaxed font-normal bg-white/5 p-4 rounded-2xl border border-white/10">
                            {language === 'ar' 
                              ? 'استخدم هذه الأداة في بداية يومك لضبط مساراتك العصبية، أو عند مواجهة مواقف تتطلب تدخلاً استراتيجيًا فورياً.'
                              : 'Use this tool at the start of your day to prime your neural paths, or when facing situations requiring immediate strategic intervention.'}
                         </p>
                         <div className="p-3.5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-300">{t('neural_context')}</span>
                            <span className="text-xs font-black text-brand-primary uppercase bg-brand-primary/20 px-2.5 py-0.5 rounded-lg border border-brand-primary/30">
                              {language === 'ar' ? '⚡ مزامنة فائقة' : 'High Sync'}
                            </span>
                         </div>
                      </motion.div>
                    )}

                    {modalTab === 'benefit' && (
                      <motion.div 
                        key="benefit"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                         <h4 className="flex items-center gap-2 text-[11px] font-black text-amber-400 uppercase tracking-widest">
                            <Star size={14} /> 
                            <span>{language === 'ar' ? 'الفائدة والأثر الشخصي' : 'Personal Benefits & Output'}</span>
                         </h4>
                         <p className="text-xs text-slate-300 leading-relaxed font-normal bg-white/5 p-4 rounded-2xl border border-white/10">
                            {t(selectedTool.descKey)} {t('tool_explanation_suffix')}
                         </p>
                         <div className="grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-center">
                               <h4 className="text-[9px] font-extrabold text-brand-primary uppercase tracking-widest mb-1">{t('result')}</h4>
                               <p className="text-xs font-black text-white uppercase">{t('neural_optimization')}</p>
                            </div>
                            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                               <h4 className="text-[9px] font-extrabold text-emerald-400 uppercase tracking-widest mb-1">{t('benefit')}</h4>
                               <p className="text-xs font-black text-white uppercase">{t('dominance_bonus')}</p>
                            </div>
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-white/10">
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
                      navigate('/tests');
                    }
                  }}
                  className="flex-1 py-3.5 px-4 bg-white/5 border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all text-center"
                >
                  {language === 'ar' ? 'فتح الوحدة مباشرة' : 'Launch Module'}
                </button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setShowExplanation(false);
                    setActiveTest({
                      id: selectedTool.id,
                      name: t(selectedTool.nameKey),
                      questions: 5
                    });
                  }}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-brand-primary via-indigo-600 to-cyan-500 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl shadow-brand-primary/30 hover:brightness-110 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={14} className="text-amber-300 animate-pulse" />
                  <span>{language === 'ar' ? 'إجراء التقييم العصبي' : 'Take Neural Audit'}</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Grid with Futuristic Aesthetics */}
      <div className="grid grid-cols-12 gap-4 md:gap-6 pb-20 relative">
        {/* Background Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
        {subInfo.expired && user?.role !== 'admin' && user?.role !== 'super_admin' && (() => {
          const whatsappNumber = tenantConfig?.whatsappNumber;
          const whatsappLink = whatsappNumber 
            ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحساب Humanos AI الخاص بي (${user?.email || ''}) وأرغب في تفعيل الاشتراك.` : `Hello, my Humanos AI free trial has ended for (${user?.email || ''}) and I would like to activate my subscription.`)}`
            : `https://wa.me/201145680938?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحساب Humanos AI الخاص بي (${user?.email || ''}) وأرغب في تفعيل الاشتراك.` : `Hello, my Humanos AI free trial has ended for (${user?.email || ''}) and I would like to activate my subscription.`)}`;

          return (
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-12 p-5 md:p-6 rounded-3xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-950 border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-col md:flex-row justify-between items-center gap-4 text-rose-300 relative overflow-hidden backdrop-blur-xl"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/20">
                     <AlertCircle className="w-6 h-6 text-rose-400 animate-pulse" />
                  </div>
                  <div className="text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                     <h4 className="font-bold text-white text-base md:text-lg flex items-center gap-2">
                        <span>{user?.isTrial 
                          ? (language === 'ar' ? 'انتهت الفترة التجريبية (Free Trial)' : 'Free Trial Expired!')
                          : (language === 'ar' ? 'انتهت صلاحية وصولك العصبية!' : 'Your Neural Access Has Expired!')}</span>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                     </h4>
                     <p className="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed max-w-2xl">
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
                 <motion.a 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-green-600/30 hover:brightness-110 transition-all text-center flex items-center gap-2 whitespace-nowrap relative z-10 shrink-0"
                 >
                    <MessageCircle size={16} />
                    <span>{language === 'ar' ? 'تفعيل الحساب عبر الواتساب' : 'ACTIVATE VIA WHATSAPP'}</span>
                 </motion.a>
               ) : (
                 <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/billing')}
                    className="px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/30 hover:brightness-110 transition-all whitespace-nowrap relative z-10 shrink-0"
                 >
                    {language === 'ar' ? 'تفعيل الاشتراك الآن' : 'ACTIVATE SUBSCRIPTION NOW'}
                 </motion.button>
               )}
            </motion.div>
          );
        })()}

        {/* 2. Top Metrics Row (Interactive 3D Micro-Cards) */}
        <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-xs">
           {[
             { label: 'Stability', labelAr: 'الاستقرار', val: `${getDynamicStability(user)}%`, icon: Activity, color: 'text-emerald-400', bg: 'from-emerald-500/20 to-teal-500/5', border: 'border-emerald-500/20', onClick: () => navigate('/tests') },
             { label: 'Streak', labelAr: 'النشاط', val: user?.streak !== undefined ? `${user.streak} ${language === 'ar' ? 'يوم' : 'Days'}` : (language === 'ar' ? '1 يوم' : '1 Day'), icon: Flame, color: 'text-orange-400', bg: 'from-orange-500/20 to-amber-500/5', border: 'border-orange-500/20', onClick: () => navigate('/habits') },
             { 
               label: 'Subscription', 
               labelAr: 'الاشتراك', 
               val: (() => {
                 if (user?.role === 'admin' || user?.role === 'super_admin' || subInfo.type === 'admin') {
                   return language === 'ar' ? 'وصول كامل (مسؤول)' : 'Full Access (Admin)';
                 }
                 if (subInfo.type === 'trial' && !subInfo.expired) {
                   return language === 'ar' ? 'فترة تجريبية' : 'Free Trial';
                 }
                 if (subInfo.expired && user?.role !== 'admin' && user?.role !== 'super_admin') {
                   return language === 'ar' ? 'اشتراك منتهي' : 'Expired Plan';
                 }
                 const tier = (user?.subscriptionTier as string) || 'silver';
                 const pkg = tenantConfig?.packages?.[tier];
                 if (pkg) {
                   return language === 'ar' ? pkg.nameAr : pkg.nameEn;
                 }
                 if (tier === 'bronze') {
                   return language === 'ar' ? 'الباقة الأولى (برونزية)' : 'Bronze Plan';
                 }
                 if (tier === 'gold') {
                   return language === 'ar' ? 'الباقة الذهبية (VIP)' : 'Gold Plan (VIP)';
                 }
                 return language === 'ar' ? 'الباقة الثانية (احترافية)' : 'Silver Plan (Pro)';
               })(),
               icon: Trophy, 
               color: 'text-amber-400',
               bg: 'from-amber-500/20 to-yellow-500/5',
               border: 'border-amber-500/20',
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
               color: subInfo.expired ? 'text-rose-400 animate-pulse' : 'text-cyan-400',
               bg: subInfo.expired ? 'from-rose-500/20 to-red-500/5' : 'from-cyan-500/20 to-blue-500/5',
               border: subInfo.expired ? 'border-rose-500/30' : 'border-cyan-500/20',
               onClick: () => navigate('/billing')
             },
           ].map((stat) => (
             <motion.div 
               key={stat.label} 
               whileHover={{ y: -3, scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className={cn(
                 "p-4 md:p-5 rounded-2xl bg-gradient-to-br border backdrop-blur-xl flex items-center gap-3 md:gap-4 shadow-lg transition-all duration-300 relative overflow-hidden group cursor-pointer",
                 stat.bg, stat.border, "hover:shadow-[0_0_25px_rgba(255,255,255,0.05)]"
               )}
               onClick={stat.onClick}
             >
                <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300", stat.color)}>
                   <stat.icon size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 flex-1">
                   <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 truncate">{language === 'ar' ? stat.labelAr : stat.label}</p>
                   <p className="font-extrabold text-white text-sm md:text-lg tracking-tight truncate">{stat.val}</p>
                </div>
                <ChevronRight size={14} className={cn("text-slate-600 group-hover:text-white transition-colors shrink-0", isRTL && "rotate-180")} />
             </motion.div>
           ))}
        </div>

        {/* 3. Intelligence Insight Layer (AI Control Center) */}
        <div className="col-span-12 lg:col-span-8">
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900 border border-brand-primary/30 shadow-[0_0_50px_rgba(99,102,241,0.12)] relative overflow-hidden h-full flex flex-col justify-between backdrop-blur-2xl"
           >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-3 mb-6 md:mb-8">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-cyan-400 flex items-center justify-center shadow-lg shadow-brand-primary/30 text-white">
                        <Sparkles size={20} className="animate-pulse" />
                     </div>
                     <div>
                        <h3 className="text-[9px] md:text-[11px] font-black text-brand-primary uppercase tracking-[0.25em]">{t('intelligence_insight')}</h3>
                        <p className="text-[10px] md:text-xs text-slate-400 font-semibold">{t('generated_vectors')}</p>
                     </div>
                   </div>
                   <span className="px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[9px] font-black tracking-widest uppercase">
                     AI ACTIVE
                   </span>
                </div>
                
                <h2 className="text-xl md:text-3xl font-light text-white leading-relaxed mb-6 md:mb-8 border-l-2 md:border-l-4 border-brand-primary/50 pl-4 md:pl-6 italic">
                  "{language === 'ar' ? profile.insightAr : profile.insight}"
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all cursor-pointer group"
                    >
                       <span className="px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary text-[8px] font-black uppercase tracking-widest mb-2 inline-block">Protocol 01</span>
                       <p className="text-xs md:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-brand-primary transition-colors">
                         {language === 'ar' ? profile.protocol01Ar : profile.protocol01}
                       </p>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all cursor-pointer group"
                    >
                       <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 text-[8px] font-black uppercase tracking-widest mb-2 inline-block">Protocol 02</span>
                       <p className="text-xs md:text-sm font-bold text-white tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                         {language === 'ar' ? profile.protocol02Ar : profile.protocol02}
                       </p>
                    </motion.div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    const wKey = weakest.subject.toLowerCase();
                    let type: 'breathing' | 'timer' | 'pause' = 'pause';
                    if (wKey === 'focus' || wKey === 'التركيز') type = 'breathing';
                    else if (wKey === 'discipline' || wKey === 'الانضباط') type = 'timer';
                    setActiveProtocolSession(type);
                    setSessionStep('idle');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-brand-primary to-indigo-600 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl hover:brightness-110 shadow-lg shadow-brand-primary/25 transition-all flex items-center gap-2"
                >
                  <Zap size={14} className="animate-pulse" />
                  <span>{language === 'ar' ? 'تطبيق البروتوكول' : 'RUN PROTOCOL'}</span>
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/coach')}
                  className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all"
                >
                  {t('consult_coach')}
                </motion.button>

                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => navigate('/crisis')}
                  className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-rose-400 text-xs font-black tracking-wider rounded-xl transition-all flex items-center gap-2"
                >
                  <AlertCircle size={14} className="animate-pulse text-rose-500" />
                  <span>{language === 'ar' ? 'مساعدة عاجلة (يوم سيء)' : 'EMERGENCY HELP (BAD DAY)'}</span>
                </motion.button>
              </div>

              {/* Dynamic Interactive Protocol Session Modal */}
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
           </motion.div>
        </div>

        {/* 4. Personality Radar & Growth Axes Card */}
        <div className="col-span-12 lg:col-span-4">
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="p-5 md:p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl flex flex-col justify-between h-full backdrop-blur-xl"
           >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('neural_map')}</h3>
              <button onClick={() => navigate('/dna')} className="text-brand-primary hover:bg-brand-primary/10 p-2 rounded-xl transition-all">
                <ArrowUpRight size={18} />
              </button>
            </div>
            
            <div className="h-60 w-full relative my-2">
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <RadarChart data={dynamicRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.08)" />
                  <PolarAngleAxis 
                    dataKey={language === 'ar' ? "subjectAr" : "subject"} 
                    tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: '800' }} 
                  />
                  <Radar name="DNA" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2.5} />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const name = payload[0].payload[language === 'ar' ? 'subjectAr' : 'subject'];
                        return (
                          <div className="px-3 py-1.5 rounded-xl border border-brand-primary/30 text-xs font-bold text-white bg-slate-950/90 shadow-2xl backdrop-blur-md">
                            {name}: <span className="text-brand-primary font-black">{payload[0].value}%</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 mt-2">
               <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                 <span className="text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">{t('archetype')}</span>
                 <span className="text-xs md:text-sm font-extrabold text-brand-primary uppercase">
                    {language === 'ar' ? profile.archetypeAr : profile.archetype}
                 </span>
               </div>
               
               <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('strongest_axis')}</span>
                   <span className="text-xs font-black text-emerald-400">{strongest.A}%</span>
                 </div>
                 <p className="text-xs font-black text-white mb-1">
                   {language === 'ar' ? strongest.subjectAr : strongest.subject}
                 </p>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium line-clamp-2">
                   {getAxisDescription(strongest.subject, 'strongest', language)}
                 </p>
               </div>

               <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-right" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('growth_axis')}</span>
                   <span className="text-xs font-black text-rose-400">{weakest.A}%</span>
                 </div>
                 <p className="text-xs font-black text-white mb-1">
                   {language === 'ar' ? weakest.subjectAr : weakest.subject}
                 </p>
                 <p className="text-[10px] text-slate-400 leading-relaxed font-medium line-clamp-2">
                   {getAxisDescription(weakest.subject, 'growth', language)}
                 </p>
               </div>
            </div>
           </motion.div>
        </div>

        {/* 5. All Neural Modules (Interactive Grid with Stagger & Glow) */}
        <div className="col-span-12 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black tracking-widest uppercase mb-2">
                  <Sparkles size={12} className="animate-pulse" />
                  <span>{t('toolset_title')}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{language === 'ar' ? 'جميع الوحدات العصبية' : 'All Neural Modules'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary font-bold border border-brand-primary/30">
                    26 {language === 'ar' ? 'أداة' : 'Tools'}
                  </span>
                </h2>
             </div>

             <button
               onClick={() => navigate('/tests')}
               className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
             >
               <span>{language === 'ar' ? 'فتح شاشة الاختبارات العصبية ←' : 'Open Full Neural Tests →'}</span>
             </button>
          </div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.03, delayChildren: 0.1 }
              }
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
          >
             {coreTools.map((tool) => {
                const isCompleted = (user as any)?.completedTests?.[tool.id] !== undefined;
                const categoryTheme = (() => {
                  switch (tool.category) {
                    case 'Efficiency':
                    case 'Psychology':
                    case 'Emotional':
                    case 'DNA':
                    case 'Core':
                      return {
                        gradient: 'from-cyan-500/15 via-teal-500/5 to-slate-900/90',
                        border: 'border-cyan-500/20 hover:border-cyan-400/60',
                        iconColor: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-black',
                        glow: 'group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]',
                        tagBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                      };
                    case 'Habits':
                    case 'Growth':
                    case 'Performance':
                    case 'Identity':
                      return {
                        gradient: 'from-amber-500/15 via-orange-500/5 to-slate-900/90',
                        border: 'border-amber-500/20 hover:border-amber-400/60',
                        iconColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black',
                        glow: 'group-hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
                        tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      };
                    case 'Social IQ':
                    case 'Social':
                    case 'Relationships':
                      return {
                        gradient: 'from-rose-500/15 via-pink-500/5 to-slate-900/90',
                        border: 'border-rose-500/20 hover:border-rose-400/60',
                        iconColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30 group-hover:bg-rose-500 group-hover:text-black',
                        glow: 'group-hover:shadow-[0_0_25px_rgba(244,63,94,0.25)]',
                        tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      };
                    default:
                      return {
                        gradient: 'from-indigo-500/15 via-purple-500/5 to-slate-900/90',
                        border: 'border-indigo-500/20 hover:border-indigo-400/60',
                        iconColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-500 group-hover:text-black',
                        glow: 'group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]',
                        tagBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      };
                  }
                })();

                return (
                  <motion.div 
                    key={tool.id} 
                    variants={{
                      hidden: { opacity: 0, y: 15, scale: 0.94 },
                      visible: { opacity: 1, y: 0, scale: 1 }
                    }}
                    whileHover={{ y: -6, scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      "p-4 rounded-2xl bg-gradient-to-br backdrop-blur-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group flex flex-col justify-between min-h-[125px] shadow-lg",
                      categoryTheme.gradient,
                      categoryTheme.border,
                      categoryTheme.glow,
                      isCompleted && "border-emerald-500/40 shadow-emerald-500/10"
                    )}
                    onClick={() => {
                      setSelectedTool(tool);
                      setShowExplanation(true);
                    }}
                  >
                     <div className="flex justify-between items-start mb-2.5">
                        <div className={cn("w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-300 shadow-md", categoryTheme.iconColor)}>
                          <tool.icon size={18} />
                        </div>
                        
                        {isCompleted ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-[10px] font-bold shadow-sm">
                            ✓
                          </span>
                        ) : (
                          <HelpCircle size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                        )}
                     </div>
                     
                     <div>
                        <h4 className="text-xs md:text-sm font-bold text-white tracking-tight mb-1 group-hover:text-brand-primary transition-colors truncate">
                          {t(tool.nameKey)}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-wider truncate">
                            {tool.category}
                          </span>
                          {isCompleted && (
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                              {language === 'ar' ? 'مكتمل' : 'Done'}
                            </span>
                          )}
                        </div>
                     </div>
                  </motion.div>
                );
             })}
          </motion.div>
        </div>

        {/* 6. Growth Matrix Chart & Diagnostic Overview */}
        <div className="col-span-12 lg:col-span-8 mt-4">
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-5 md:p-6 rounded-3xl bg-slate-900/90 border border-white/10 shadow-xl h-full backdrop-blur-xl flex flex-col justify-between"
           >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('growth_matrix')}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{language === 'ar' ? 'تتبع مؤشر النمو والاتساق الأسبوعي' : 'Weekly Growth Index Tracking'}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
                  <TrendingUp className="w-4 h-4 text-brand-primary" />
                </div>
              </div>

              <div className="h-52 md:h-64 w-full min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={moodData}>
                    <defs>
                      <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                    <YAxis hide />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorBase)" />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="px-3 py-1.5 rounded-xl border border-brand-primary/30 text-xs font-bold text-white bg-slate-950/90 shadow-2xl backdrop-blur-md">
                              {language === 'ar' ? 'مؤشر النمو: ' : 'Growth: '}
                              <span className="text-brand-primary font-black">{payload[0].value}</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </motion.div>
        </div>
        
        <div className="col-span-12 lg:col-span-4 mt-4">
           {/* Diagnostic Quick View */}
           <motion.div 
             initial={{ opacity: 0, y: 15 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-5 md:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20 shadow-xl h-full flex flex-col justify-between backdrop-blur-xl"
           >
              <div>
                <div className="flex items-center gap-3 mb-6 font-black text-xs text-emerald-400 uppercase tracking-widest">
                   <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                     <Shield className="w-4 h-4 text-emerald-400" />
                   </div>
                   <span>{t('diagnostic_summary')}</span>
                </div>

                <div className="space-y-4 text-xs md:text-sm">
                   {[
                     { label: "Anxiety", val: "12%", labelAr: "القلق" },
                     { label: "Focus", val: "88%", labelAr: "التركيز" },
                   ].map(item => (
                     <div key={item.label} className="flex justify-between items-center border-b border-white/10 pb-3">
                        <span className="font-semibold text-slate-300 uppercase tracking-wider">{language === 'ar' ? item.labelAr : item.label}</span>
                        <span className="font-extrabold text-white bg-white/10 px-2.5 py-1 rounded-lg">{item.val}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 mt-4">
                 <p className="font-semibold uppercase text-slate-400 leading-relaxed text-xs">
                    {t('stability_baseline')}
                 </p>
              </div>
           </motion.div>
        </div>

      </div>
    </div>
  );
}

