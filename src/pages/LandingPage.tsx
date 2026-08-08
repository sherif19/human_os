import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Target, 
  Zap, 
  Shield, 
  Globe,
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  ChevronDown,
  LayoutDashboard,
  Dna,
  Clock,
  Book,
  FileText,
  Search,
  Sliders,
  Calendar,
  Sparkle,
  Volume2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function LandingPage() {
  const navigate = useNavigate();
  const { language, setLanguage, isRTL } = useLanguage();
  const [branding, setBranding] = useState<any>(null);

  const t = (key: TranslationKey | string) => {
    if (branding?.i18nOverrides?.[language]?.[key]) {
      return branding.i18nOverrides[language][key];
    }
    // Backward compatibility fallbacks
    if (key === 'hero_badge') {
      const val = language === 'ar' ? branding?.heroBadge : (branding?.heroBadgeEn || branding?.heroBadge);
      if (val) return val;
    }
    if (key === 'hero_sub') {
      const val = language === 'ar' ? branding?.heroSub : (branding?.heroSubEn || branding?.heroSub);
      if (val) return val;
    }
    if (key === 'footer_text') {
      const val = language === 'ar' ? branding?.footerText : (branding?.footerTextEn || branding?.footerText);
      if (val) return val;
    }
    return translations[language][key as TranslationKey] || key;
  };

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedBook, setSelectedBook] = useState<number>(0);
  
  // ── MOUSE GLOW COORDINATES ──
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // ── TENANT BRANDING HOOKS ──
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isPreview = searchParams.get('preview') === 'true';
    const tenantParam = searchParams.get('tenant');

    if (isPreview) {
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'TENANT_BRANDING') {
          setBranding(event.data.config);
        }
      };
      window.addEventListener('message', handleMessage);
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
      return () => window.removeEventListener('message', handleMessage);
    }

    const fetchBranding = async () => {
      try {
        let tenantData: any = null;

        if (tenantParam) {
          const docRef = doc(db, 'tenants', tenantParam);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            tenantData = docSnap.data();
          }
        } else {
          const hostname = window.location.hostname;
          if (hostname && hostname !== 'localhost' && !hostname.includes('web.app') && !hostname.includes('firebaseapp.com')) {
            const q = query(collection(db, 'tenants'), where('domain', '==', hostname));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              tenantData = querySnapshot.docs[0].data();
            }
          } else {
            // Localhost fallback: load the first available tenant config so edits reflect on localhost landing page
            const q = query(collection(db, 'tenants'));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              tenantData = querySnapshot.docs[0].data();
            }
          }
        }

        if (tenantData) {
          setBranding(tenantData);
        }
      } catch (err) {
        console.error('Error loading tenant branding:', err);
      }
    };

    fetchBranding();
  }, []);

  useEffect(() => {
    if (!branding) {
      document.documentElement.style.removeProperty('--color-brand-primary');
      document.documentElement.style.removeProperty('--color-brand-secondary');
      document.documentElement.style.removeProperty('--color-bg-dark');
      document.documentElement.style.removeProperty('--color-bg-sidebar');
      document.documentElement.style.removeProperty('--color-bg-card');
      return;
    }

    if (branding.primaryColor) {
      document.documentElement.style.setProperty('--color-brand-primary', branding.primaryColor);
    }
    if (branding.accentColor) {
      document.documentElement.style.setProperty('--color-brand-secondary', branding.accentColor);
    }
    if (branding.bgColor) {
      document.documentElement.style.setProperty('--color-bg-dark', branding.bgColor);
    }
    if (branding.sidebarBgColor || branding.panelColor) {
      document.documentElement.style.setProperty('--color-bg-sidebar', branding.sidebarBgColor || branding.panelColor);
      document.documentElement.style.setProperty('--color-bg-card', branding.panelColor || branding.sidebarBgColor);
    }
  }, [branding]);

  // ── HERO SIMULATOR LOGIC ──
  const [simSelectedPrompt, setSimSelectedPrompt] = useState<number | null>(null);
  const [simState, setSimState] = useState<'idle' | 'typing' | 'analyzing' | 'completed'>('idle');
  const [simLog, setSimLog] = useState<string[]>([]);
  const [simProgress, setSimProgress] = useState(0);
  const [simMetrics, setSimMetrics] = useState({ focus: 62, shield: 48, velocity: 15 });

    const simScenarios = [
    {
      title: t('hud_s1_title'),
      prompt: t('hud_s1_prompt'),
      metricsTarget: { focus: 97, shield: 55, velocity: 85 },
      logs: [
        t('hud_s1_log1'),
        t('hud_s1_log2'),
        t('hud_s1_log3'),
        t('hud_s1_log4')
      ]
    },
    {
      title: t('hud_s2_title'),
      prompt: t('hud_s2_prompt'),
      metricsTarget: { focus: 68, shield: 91, velocity: 40 },
      logs: [
        t('hud_s2_log1'),
        t('hud_s2_log2'),
        t('hud_s2_log3'),
        t('hud_s2_log4')
      ]
    },
    {
      title: t('hud_s3_title'),
      prompt: t('hud_s3_prompt'),
      metricsTarget: { focus: 85, shield: 50, velocity: 94 },
      logs: [
        t('hud_s3_log1'),
        t('hud_s3_log2'),
        t('hud_s3_log3'),
        t('hud_s3_log4')
      ]
    }
  ];

  const triggerSimulation = (idx: number) => {
    if (simState === 'typing' || simState === 'analyzing') return;
    setSimSelectedPrompt(idx);
    setSimState('typing');
    setSimLog([]);
    setSimProgress(0);

    const scenario = simScenarios[idx];
    const logSource = scenario.logs;
    
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      setSimProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSimState('completed');
          setSimMetrics(scenario.metricsTarget);
          return 100;
        }
        
        const logIndex = Math.floor((prev / 100) * logSource.length);
        if (logIndex > currentLogIndex && logIndex < logSource.length) {
          setSimLog(old => [...old, logSource[logIndex]]);
          currentLogIndex = logIndex;
        }

        return prev + 5;
      });
    }, 150);

    setSimLog([logSource[0]]);
  };

  // Run first simulation on mount automatically
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerSimulation(0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [language]);


  // ── INTERACTIVE QUIZ STATE ──
  const [quizStep, setQuizStep] = useState(0); 
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [computedArchetype, setComputedArchetype] = useState<any>(null);

  const quizQuestions = [
    {
      title: t('quiz_q1_title'),
      options: [
        { code: "A", text: t('quiz_q1_optA') },
        { code: "B", text: t('quiz_q1_optB') },
        { code: "C", text: t('quiz_q1_optC') }
      ]
    },
    {
      title: t('quiz_q2_title'),
      options: [
        { code: "A", text: t('quiz_q2_optA') },
        { code: "B", text: t('quiz_q2_optB') },
        { code: "C", text: t('quiz_q2_optC') }
      ]
    },
    {
      title: t('quiz_q3_title'),
      options: [
        { code: "A", text: t('quiz_q3_optA') },
        { code: "B", text: t('quiz_q3_optB') },
        { code: "C", text: t('quiz_q3_optC') }
      ]
    }
  ];

  const handleSelectAnswer = (code: string) => {
    const nextAnswers = [...quizAnswers, code];
    setQuizAnswers(nextAnswers);
    if (quizStep < quizQuestions.length) {
      setQuizStep(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (quizStep === quizQuestions.length + 1) {
      const counts = quizAnswers.reduce((acc: any, val) => {
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      }, { A: 0, B: 0, C: 0 });

      let resultArchetype = "";
      if (counts.A >= counts.B && counts.A >= counts.C) {
        resultArchetype = "neuro_architect";
      } else if (counts.B >= counts.A && counts.B >= counts.C) {
        resultArchetype = "emotional_alchemist";
      } else {
        resultArchetype = "performance_catalyst";
      }

      const archetypeDetails: any = {
        neuro_architect: {
          title: t('arch_architect_title'),
          desc: t('arch_architect_desc'),
          color: "from-indigo-500 to-violet-600",
          accentColor: "#6366f1",
          focusVal: 95,
          eqVal: 65,
          velocityVal: 70,
          module: t('arch_architect_mod')
        },
        emotional_alchemist: {
          title: t('arch_alchemist_title'),
          desc: t('arch_alchemist_desc'),
          color: "from-pink-500 to-rose-600",
          accentColor: "#ec4899",
          focusVal: 65,
          eqVal: 98,
          velocityVal: 60,
          module: t('arch_alchemist_mod')
        },
        performance_catalyst: {
          title: t('arch_catalyst_title'),
          desc: t('arch_catalyst_desc'),
          color: "from-emerald-400 to-teal-600",
          accentColor: "#10b981",
          focusVal: 75,
          eqVal: 70,
          velocityVal: 95,
          module: t('arch_catalyst_mod')
        }
      };

      setComputedArchetype(archetypeDetails[resultArchetype]);
    }
  }, [quizStep, quizAnswers]);

  const resetQuiz = () => {
    setQuizStep(1);
    setQuizAnswers([]);
    setComputedArchetype(null);
  };


  // ── TOOL LIST FILTERS ──
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const toolCategories = [
    { id: "all", label: t('cat_all') },
    { id: "cognitive", label: t('cat_cognitive') },
    { id: "emotional", label: t('cat_emotional') },
    { id: "social", label: t('cat_social') },
    { id: "growth", label: t('cat_growth') },
    { id: "bio", label: t('cat_bio') }
  ];

  const getToolList = () => [
    { name: t('confidence_audit'), desc: t('confidence_desc'), c: language === 'ar' ? 'نمو' : 'Growth', cat: "growth" },
    { name: t('charisma_mapping'), desc: t('charisma_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('eq_assessment'), desc: t('eq_desc'), c: language === 'ar' ? 'عاطفي' : 'Emotional', cat: "emotional" },
    { name: t('discipline_index'), desc: t('discipline_desc'), c: language === 'ar' ? 'نمو' : 'Growth', cat: "growth" },
    { name: t('focus_mastery'), desc: t('focus_desc'), c: language === 'ar' ? 'إدراكي' : 'Cognitive', cat: "cognitive" },
    { name: t('strategic_silence'), desc: t('silence_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('toxicity_shield'), desc: t('shield_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('burnout_resistance'), desc: t('burnout_desc'), c: language === 'ar' ? 'إدراكي' : 'Cognitive', cat: "cognitive" },
    { name: t('habit_forge'), desc: t('habit_desc'), c: language === 'ar' ? 'نمو' : 'Growth', cat: "growth" },
    { name: t('leadership_iq'), desc: t('leadership_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('trauma_audit'), desc: t('trauma_desc'), c: language === 'ar' ? 'عاطفي' : 'Emotional', cat: "emotional" },
    { name: t('self_worth_pulse'), desc: t('self_worth_desc'), c: language === 'ar' ? 'نمو' : 'Growth', cat: "growth" },
    { name: t('social_energy_tracker'), desc: t('social_energy_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('micro_mission_lab'), desc: t('mission_desc'), c: language === 'ar' ? 'نمو' : 'Growth', cat: "growth" },
    { name: t('neural_journaling'), desc: t('journal_desc'), c: language === 'ar' ? 'إدراكي' : 'Cognitive', cat: "cognitive" },
    { name: t('logic_flow_engine'), desc: t('dna_sync_desc'), c: language === 'ar' ? 'إدراكي' : 'Cognitive', cat: "cognitive" },
    { name: t('neural_conflict_res'), desc: t('conflict_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('deep_sleep_protocol'), desc: t('dna_sync_desc'), c: language === 'ar' ? 'بيولوجي' : 'Bio', cat: "bio" },
    { name: t('body_language_scan'), desc: t('comm_desc'), c: language === 'ar' ? 'اجتماعي' : 'Social', cat: "social" },
    { name: t('focus_recovery'), desc: t('focus_desc'), c: language === 'ar' ? 'إدراكي' : 'Cognitive', cat: "cognitive" }
  ];

  const filteredTools = getToolList().filter(tool => {
    const matchesCategory = activeCategory === "all" || tool.cat === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const booksData = [
    {
      title: t('books_title1'),
      desc: t('books_desc1'),
      tag: t('books_tag1'),
      icon: Book,
      color: "from-indigo-600/35 to-indigo-950/70 border-indigo-500/25",
      accent: "rgba(99, 102, 241, 0.4)",
      label: t('books_label1')
    },
    {
      title: t('books_title2'),
      desc: t('books_desc2'),
      tag: t('books_tag2'),
      icon: Sparkles,
      color: "from-purple-600/35 to-purple-950/70 border-purple-500/25",
      accent: "rgba(168, 85, 247, 0.4)",
      label: t('books_label2')
    },
    {
      title: t('books_title3'),
      desc: t('books_desc3'),
      tag: t('books_tag3'),
      icon: FileText,
      color: "from-emerald-600/35 to-emerald-950/70 border-emerald-500/25",
      accent: "rgba(16, 185, 129, 0.4)",
      label: t('books_label3')
    },
    {
      title: t('books_title4'),
      desc: t('books_desc4'),
      tag: t('books_tag4'),
      icon: Layers,
      color: "from-pink-600/35 to-pink-950/70 border-pink-500/25",
      accent: "rgba(236, 72, 153, 0.4)",
      label: t('books_label4')
    }
  ];

  // ── PRICING SLIDER ──
  const [isYearly, setIsYearly] = useState(false);

  const stats = [
    { label: t('stats_1_label'), value: t('stats_1_value') },
    { label: t('stats_2_label'), value: t('stats_2_value') },
    { label: t('stats_3_label'), value: t('stats_3_value') },
  ];

  // ── 3D BOOK HOVER (perspective simulation) ──
  const handleBookMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    card.style.transform = `rotateY(${x / 8}deg) rotateX(${-y / 8}deg) scale(1.03)`;
  };

  const handleBookMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) scale(1)";
  };

  return (
    <div 
      className="bg-bg-dark min-h-screen text-slate-300 overflow-x-hidden font-sans relative"
      onMouseMove={handleMouseMove}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Dynamic Cursor Ambient Light */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-all duration-500 ease-out opacity-20 hidden md:block"
        style={{
          background: `radial-gradient(550px at ${mousePos.x}px ${mousePos.y}px, var(--color-brand-primary) 0%, transparent 80%)`
        }}
      />

      {/* Grid Drift Overlay */}
      <div className="absolute inset-0 bg-grid-pattern animate-grid-drift opacity-[0.15] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             {branding?.logoUrl ? (
                <img src={branding.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
             ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
                   <Brain className="w-6 h-6 text-white" />
                </div>
             )}
             <span className="text-2xl font-black text-white tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               {language === 'ar' 
                 ? (branding?.appName || 'HumanOS')
                 : (branding?.appNameEn || branding?.appName || 'HumanOS')
               }
             </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
             <a href="#vision" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">{t('vision_title')}</a>
             <a href="#architecture" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">{t('architecture_title')}</a>
             <a href="#tools" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">{t('toolset_title')}</a>
             <a href="#pricing" className="text-[10px] font-black uppercase tracking-widest hover:text-brand-primary transition-colors">{t('pricing_title')}</a>
          </div>

          <div className="flex items-center gap-4">
             <button 
               onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
               className="px-3.5 py-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5"
             >
                <Globe size={12} className="text-slate-400" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
             </button>
             <button onClick={() => navigate('/auth')} className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">{t('sign_in_now')}</button>
             <button 
               onClick={() => navigate('/auth')} 
               className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
             >
               {t('get_started')}
             </button>
          </div>
        </div>
      </nav>

      {/* ── Redesigned Futuristic Hero Section ── */}
      <section className="relative pt-44 pb-28 px-6 overflow-hidden">
         {/* Animated Backdrop Gradient Swirls */}
         <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-brand-primary/10 blur-[130px] rounded-full pointer-events-none" />
         <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-brand-secondary/10 blur-[130px] rounded-full pointer-events-none" />
         
         <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center relative z-10">
            {/* Copy side: Text, CTA buttons, and stats aggregated into a clean visual stack */}
            <div className="lg:col-span-6 space-y-8 text-center lg:text-start order-1">
               <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 shadow-lg shadow-black/30"
               >
                  <Sparkles size={14} className="text-brand-primary animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
                     {t('hero_badge')}
                  </span>
               </motion.div>

               <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.0] uppercase"
               >
                  {t('hero_title').split(' ').map((word, idx) => (
                    idx === 3 || idx === 4 
                      ? <span key={idx} className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 block sm:inline">{word} </span> 
                      : <span key={idx}>{word} </span>
                  ))}
               </motion.h1>
               
               <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed"
               >
                  {language === 'ar' ? (branding?.tagline || t('hero_sub')) : (branding?.taglineEn || branding?.tagline || t('hero_sub'))}
               </motion.p>

               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
               >
                  <button onClick={() => navigate('/auth')} className="group px-8 py-4.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-3 w-full sm:w-auto justify-center">
                     {t('get_started')}
                     <ArrowRight size={16} className={cn("group-hover:translate-x-1 transition-transform", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                  </button>
                  <a href="#demo-section" className="px-8 py-4.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all w-full sm:w-auto text-center">
                     {t('view_demo')}
                  </a>
               </motion.div>

               {/* Unified Glass Stat Panel */}
               <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card border border-white/5 bg-white/[0.01] p-6 rounded-2xl grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 shadow-xl"
               >
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center lg:text-start space-y-1">
                       <p className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">{stat.value}</p>
                       <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 leading-tight">{stat.label}</p>
                    </div>
                  ))}
               </motion.div>
            </div>

            {/* Futuristic Holographic HUD Visualizer (Replaces flat desktop window) */}
            <div id="demo-section" className="lg:col-span-6 w-full relative order-2">
               {/* Ambient Glow behind the widget */}
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 blur-[100px] rounded-3xl" />
               
               <motion.div 
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card border border-white/10 p-6 rounded-3xl shadow-2xl relative bg-bg-card/75 backdrop-blur-2xl flex flex-col gap-6"
               >
                  {/* HUD Header Status */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping" />
                        <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                          {t('hud_header_status')}
                        </span>
                     </div>
                     <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                        <div className="w-2 h-2 rounded-full bg-white/10" />
                     </div>
                  </div>

                  {/* Dynamic SVG Visualizer swapped based on selected tab */}
                  <div className="relative">
                     {simSelectedPrompt === 0 && (
                       <motion.div 
                         key="focus-viz"
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="relative w-full h-44 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center"
                       >
                         {/* Grid Lines */}
                         <div className="absolute inset-0 bg-grid-pattern opacity-30" />
                         {/* Sweeping laser */}
                         <motion.div 
                           className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_12px_rgba(99,102,241,1)]"
                           animate={{ y: [-80, 80] }}
                           transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                         />
                         {/* Brain Node Sparks */}
                         <div className="flex gap-10 z-10">
                           <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                           <motion.div animate={{ scale: [1.25, 1, 1.25], opacity: [1, 0.6, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="w-4 h-4 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                           <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} className="w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]" />
                         </div>
                       </motion.div>
                     )}

                     {simSelectedPrompt === 1 && (
                       <motion.div 
                         key="shield-viz"
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="relative w-full h-44 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center"
                       >
                         <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                         {/* Expanding radar shield rings */}
                         <motion.div 
                           className="absolute border-2 border-dashed border-pink-500/20 rounded-full w-28 h-28"
                           animate={{ scale: [1, 1.4], opacity: [0.8, 0] }}
                           transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                         />
                         <motion.div 
                           className="absolute border border-pink-500/35 rounded-full w-20 h-20"
                           animate={{ scale: [1, 1.25], opacity: [0.9, 0.1] }}
                           transition={{ duration: 2, repeat: Infinity, delay: 0.6, ease: "easeOut" }}
                         />
                         {/* Center Core Lock */}
                         <div className="z-10 w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.35)]">
                           <Shield size={26} className="animate-pulse" />
                         </div>
                       </motion.div>
                     )}

                     {simSelectedPrompt === 2 && (
                       <motion.div 
                         key="velocity-viz"
                         initial={{ opacity: 0, scale: 0.98 }}
                         animate={{ opacity: 1, scale: 1 }}
                         className="relative w-full h-44 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-end p-4"
                       >
                         <div className="absolute inset-0 bg-grid-pattern opacity-15" />
                         {/* Path wave drawing */}
                         <svg className="w-full h-24 overflow-visible z-10" viewBox="0 0 200 60">
                           <motion.path
                             d="M0,35 Q25,10 50,35 T100,35 T150,35 T200,35"
                             fill="none"
                             stroke="#10b981"
                             strokeWidth="3.5"
                             initial={{ pathLength: 0 }}
                             animate={{ pathLength: 1 }}
                             transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                             className="drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                           />
                           <motion.path
                             d="M0,35 Q25,10 50,35 T100,35 T150,35 T200,35"
                             fill="none"
                             stroke="#10b981"
                             strokeWidth="1"
                             strokeDasharray="4 4"
                             animate={{ strokeDashoffset: -20 }}
                             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                           />
                         </svg>
                         <div className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded text-[9px] font-mono text-emerald-400 z-20 flex items-center gap-1">
                           <TrendingUp size={11} />
                           <span>TRAJECTORY: EXPONENTIAL</span>
                         </div>
                       </motion.div>
                     )}
                  </div>

                  {/* Terminal Log Outputs (Directionally controlled to prevent text warping) */}
                  <div 
                    className="bg-black/55 border border-white/5 rounded-2xl p-4 min-h-[120px] font-mono text-[11px] flex flex-col justify-between"
                    style={{ direction: isRTL ? 'rtl' : 'ltr' }}
                  >
                     <div className="space-y-2">
                        {/* Prompt Input Line */}
                        <div className={cn("flex gap-2 items-center", isRTL ? "text-right" : "text-left")}>
                           <span className="text-brand-primary font-bold">&gt;_</span>
                           <p className="text-slate-200">
                             {simSelectedPrompt !== null 
                               ? simScenarios[simSelectedPrompt].prompt
                               : t('initiating_neural_scan')
                             }
                           </p>
                        </div>

                        {/* Staggered progress loading bar */}
                        {simState === 'typing' && (
                          <div className="space-y-2 pt-1">
                             <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                   className="h-full bg-brand-primary"
                                   initial={{ width: 0 }}
                                   animate={{ width: `${simProgress}%` }}
                                   transition={{ duration: 0.1 }}
                                />
                             </div>
                          </div>
                        )}

                        {/* Logs stack */}
                        <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                           {simLog.slice(1).map((log, i) => (
                             <motion.p 
                               key={i} 
                               initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                               animate={{ opacity: 1, x: 0 }}
                               className="text-emerald-400 font-bold leading-tight"
                             >
                               ✓ {log}
                             </motion.p>
                           ))}
                        </div>
                     </div>

                     {/* Sync status indicator */}
                     <div className={cn("flex items-center gap-2 text-[9px] text-slate-500 pt-3 border-t border-white/5", isRTL ? "justify-start" : "justify-end")}>
                        <Cpu size={11} className="animate-spin text-brand-primary" />
                        <span>SYNCHRONIZATION: COMPLETED</span>
                     </div>
                  </div>

                  {/* Terminal Option Selector Tabs (Replaced list button) */}
                  <div className="grid grid-cols-3 gap-2">
                     {simScenarios.map((scen, idx) => (
                       <button
                         key={idx}
                         onClick={() => triggerSimulation(idx)}
                         className={cn(
                           "flex flex-col items-center justify-center p-3 rounded-2xl text-[10px] font-black transition-all border gap-1.5",
                           simSelectedPrompt === idx 
                             ? "bg-brand-primary/10 border-brand-primary/45 text-white shadow-lg shadow-indigo-500/5" 
                             : "bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/5 hover:text-white"
                         )}
                       >
                         {idx === 0 && <Target size={14} className={simSelectedPrompt === 0 ? "text-indigo-400" : "text-slate-500"} />}
                         {idx === 1 && <Shield size={14} className={simSelectedPrompt === 1 ? "text-pink-400" : "text-slate-500"} />}
                         {idx === 2 && <Zap size={14} className={simSelectedPrompt === 2 ? "text-emerald-400" : "text-slate-500"} />}
                         <span>{language === 'ar' ? (scen.title || '').split(' ')[0] : (scen.title || '').split(' ').pop()}</span>
                       </button>
                     ))}
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ── Section: Diagnostic Archetype Quiz Widget ── */}
      <section className="py-24 px-6 relative border-t border-b border-white/5 bg-black/20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
         
         <div className="max-w-4xl mx-auto relative z-10">
            <div className="text-center mb-12">
               <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">
                 {language === 'ar' ? 'اختبار النماذج الحية' : 'LIVE NEURAL AUDIT'}
               </span>
               <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mt-3">
                 {language === 'ar' ? 'اكتشف نموذجك العصبي فوراً' : 'Discover Your Neural Archetype'}
               </h2>
               <p className="text-slate-400 max-w-xl mx-auto mt-4 font-medium text-sm md:text-base">
                 {language === 'ar' 
                   ? "أجب عن 3 أسئلة سريعة لمحاكاة التشخيص وتحديد نظام الموديولات الأنسب لك."
                   : "Answer 3 quick questions to calculate your response vectors and retrieve your custom profile recommendations."}
               </p>
            </div>

            <div className="glass-card border border-white/10 p-8 md:p-12 rounded-3xl relative min-h-[300px] flex flex-col justify-center">
               <AnimatePresence mode="wait">
                  {quizStep === 0 && (
                    <motion.div 
                      key="intro"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="text-center space-y-6"
                    >
                       <Dna className="w-16 h-16 text-brand-primary mx-auto animate-pulse" />
                       <h3 className="text-xl font-bold text-white uppercase">
                         {t('quiz_ready')}
                       </h3>
                       <button
                         onClick={() => setQuizStep(1)}
                         className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                       >
                         {t('initialize_diagnostic')}
                       </button>
                    </motion.div>
                  )}

                  {quizStep >= 1 && quizStep <= quizQuestions.length && (
                    <motion.div 
                      key={`question-${quizStep}`}
                      initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
                      className="space-y-8"
                    >
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>{t('question_label')} {quizStep}/{quizQuestions.length}</span>
                          <span className="text-brand-primary">{t('calibrating_label')}</span>
                       </div>
                       
                       <h3 className="text-lg md:text-xl font-extrabold text-white">
                         {quizQuestions[quizStep - 1].title}
                       </h3>

                       <div className="grid gap-3">
                          {quizQuestions[quizStep - 1].options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleSelectAnswer(opt.code)}
                              className="w-full text-start p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/40 hover:bg-brand-primary/5 text-slate-300 hover:text-white transition-all duration-200 text-xs md:text-sm font-bold flex gap-4 items-center"
                            >
                               <span className="w-7 h-7 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black shrink-0 text-slate-400 group-hover:text-brand-primary">
                                 {opt.code}
                               </span>
                               <span>{opt.text}</span>
                            </button>
                          ))}
                       </div>
                    </motion.div>
                  )}

                  {quizStep === quizQuestions.length + 1 && computedArchetype && (
                    <motion.div 
                      key="results"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="grid md:grid-cols-12 gap-8 items-center"
                    >
                       <div className="md:col-span-7 space-y-6">
                          <div className={cn(
                            "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r text-white text-[9px] font-black uppercase tracking-widest",
                            computedArchetype.color
                          )}>
                             <Sparkle size={12} className="animate-spin" />
                             <span>{t('diagnostic_completed')}</span>
                          </div>

                          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            {computedArchetype.title}
                          </h3>

                          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                            {computedArchetype.desc}
                          </p>

                          <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
                             <Zap className="text-amber-400 shrink-0" size={18} />
                             <div>
                                <p className="text-[9px] font-bold text-slate-500 uppercase">{t('recommended_protocol')}</p>
                                <span className="text-xs font-black text-white">{computedArchetype.module}</span>
                             </div>
                          </div>

                          <div className="flex gap-4">
                             <button
                               onClick={() => navigate('/auth')}
                               className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg"
                             >
                               {t('claim_my_trial')}
                             </button>
                             <button
                               onClick={resetQuiz}
                               className="px-6 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all"
                             >
                               {t('re_scan')}
                             </button>
                          </div>
                       </div>

                       <div className="md:col-span-5 flex flex-col items-center justify-center space-y-6">
                          <div className="relative w-36 h-36 flex items-center justify-center">
                             <svg className="w-full h-full transform -rotate-90">
                                <circle cx="72" cy="72" r="64" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                                <motion.circle 
                                   cx="72" 
                                   cy="72" 
                                   r="64" 
                                   className="stroke-indigo-500" 
                                   strokeWidth="7" 
                                   fill="transparent" 
                                   strokeDasharray={402}
                                   initial={{ strokeDashoffset: 402 }}
                                   animate={{ strokeDashoffset: 402 - (402 * computedArchetype.focusVal) / 100 }}
                                   transition={{ duration: 1.2, ease: "easeOut" }}
                                   style={{ stroke: computedArchetype.accentColor }}
                                />
                             </svg>
                             <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-white font-mono">{computedArchetype.focusVal}%</span>
                                <span className="text-[8px] font-bold text-slate-500 uppercase">{t('flow_energy')}</span>
                             </div>
                          </div>

                          <div className="w-full space-y-3 font-mono text-[11px]">
                             <div>
                                <div className="flex justify-between text-slate-400 mb-1">
                                   <span>{t('cognitive_focus')}</span>
                                   <span>{computedArchetype.focusVal}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-indigo-500" style={{ width: `${computedArchetype.focusVal}%`, backgroundColor: computedArchetype.accentColor }} />
                                </div>
                             </div>
                             <div>
                                <div className="flex justify-between text-slate-400 mb-1">
                                   <span>{t('emotional_eq')}</span>
                                   <span>{computedArchetype.eqVal}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-pink-500" style={{ width: `${computedArchetype.eqVal}%` }} />
                                </div>
                             </div>
                             <div>
                                <div className="flex justify-between text-slate-400 mb-1">
                                   <span>{t('habit_velocity')}</span>
                                   <span>{computedArchetype.velocityVal}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div className="h-full bg-emerald-400" style={{ width: `${computedArchetype.velocityVal}%` }} />
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>

      {/* Vision / Loop vs Optimization Section */}
      <section id="vision" className="py-24 px-6 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-16">
           <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('vision_title')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mt-3">
                 {t('vision_heading')}
              </h2>
              <p className="text-slate-400 mt-4 font-medium leading-relaxed">
                 {t('vision_desc')}
              </p>
           </div>

           <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Card Left: The Default Loops (Friction/entropy) */}
              <motion.div 
                 whileInView={{ opacity: 1, y: 0 }}
                 initial={{ opacity: 0, y: 20 }}
                 viewport={{ once: true }}
                 className="glass-card border border-red-500/10 bg-red-500/[0.01] p-8 md:p-10 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[50px] rounded-full" />
                 <div className="flex gap-4 items-center mb-6">
                    <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center shrink-0">
                       <Lock size={20} className="text-red-400" />
                    </div>
                    <div>
                       <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{t('vision_legacy_badge')}</span>
                       <h3 className="text-xl font-black text-white">{t('vision_legacy_title')}</h3>
                    </div>
                 </div>

                 <div className="space-y-4 text-xs font-bold text-slate-400">
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <h4 className="text-slate-300 font-extrabold">{t('vision_card1_title')}</h4>
                       <p className="text-[11px] text-slate-500 leading-normal">{t('vision_card1_desc')}</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <h4 className="text-slate-300 font-extrabold">{t('vision_card2_title')}</h4>
                       <p className="text-[11px] text-slate-500 leading-normal">{t('vision_card2_desc')}</p>
                    </div>
                    <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-1">
                       <h4 className="text-slate-300 font-extrabold">{t('vision_card3_title')}</h4>
                       <p className="text-[11px] text-slate-500 leading-normal">
                         {t('vision_card3_desc')}
                       </p>
                    </div>
                 </div>
              </motion.div>

              {/* Card Right: The Optimized Core (HumanOS) */}
              <motion.div 
                 whileInView={{ opacity: 1, y: 0 }}
                 initial={{ opacity: 0, y: 20 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.15 }}
                 className="glass-card border-brand-primary/20 bg-brand-primary/[0.02] p-8 md:p-10 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 blur-[50px] rounded-full" />
                 <div className="flex gap-4 items-center mb-6">
                    <div className="w-11 h-11 bg-brand-primary/10 rounded-xl flex items-center justify-center shrink-0">
                       <Cpu size={20} className="text-brand-primary" />
                    </div>
                    <div>
                       <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">{t('vision_opt_badge')}</span>
                       <h3 className="text-xl font-black text-white">{t('vision_opt_title')}</h3>
                    </div>
                 </div>

                 <div className="space-y-4 text-xs font-bold text-slate-400">
                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 space-y-1">
                       <h4 className="text-white font-extrabold">{t('vision_opt_card1_title')}</h4>
                       <p className="text-[11px] text-indigo-300/80 leading-normal">
                         {t('vision_opt_card1_desc')}
                       </p>
                    </div>
                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 space-y-1">
                       <h4 className="text-white font-extrabold">{t('vision_opt_card2_title')}</h4>
                       <p className="text-[11px] text-indigo-300/80 leading-normal">
                         {t('vision_opt_card2_desc')}
                       </p>
                    </div>
                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10 space-y-1">
                       <h4 className="text-white font-extrabold">{t('vision_opt_card3_title')}</h4>
                       <p className="text-[11px] text-indigo-300/80 leading-normal">
                         {t('vision_opt_card3_desc')}
                       </p>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Architecture / Connected Diagram Section */}
      <section id="architecture" className="py-24 px-6 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-brand-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-20">
           <div className="text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('architecture_title')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mt-3">{t('architecture_heading')}</h2>
           </div>

           <div className="grid md:grid-cols-4 gap-6 relative">
              {[
                { title: t('architecture_card1_title'), icon: Dna, desc: t('architecture_card1_desc'), color: "from-blue-500/10 to-indigo-500/10", border: "border-blue-500/20" },
                { title: t('architecture_card2_title'), icon: TrendingUp, desc: t('architecture_card2_desc'), color: "from-indigo-500/10 to-purple-500/10", border: "border-indigo-500/20" },
                { title: t('architecture_card3_title'), icon: Sparkles, desc: t('architecture_card3_desc'), color: "from-purple-500/10 to-pink-500/10", border: "border-purple-500/20" },
                { title: t('architecture_card4_title'), icon: Layers, desc: t('architecture_card4_desc'), color: "from-pink-500/10 to-red-500/10", border: "border-pink-500/20" }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -8 }}
                  className={cn(
                    "glass-card p-8 md:p-10 group transition-all text-center relative border bg-gradient-to-b",
                    item.color,
                    item.border
                  )}
                >
                   <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-[20px]" />
                   
                   <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-8 border border-white/5 group-hover:scale-110 transition-all relative z-10">
                      <item.icon className="w-8 h-8 text-slate-400 group-hover:text-white transition-colors" />
                   </div>
                   
                   <h4 className="text-xl font-black text-white mb-2 uppercase tracking-tight relative z-10">{item.title}</h4>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">{item.desc}</p>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Tools Section / Filterable Catalog */}
      <section id="tools" className="py-24 px-6 border-b border-white/5 relative">
         <div className="max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
               <div className="max-w-2xl text-center md:text-start">
                  <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('toolset_title')}</span>
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mt-3 leading-none">
                     {t('tools_heading')}
                  </h2>
               </div>
               <button onClick={() => navigate('/library')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all pb-2 shrink-0">
                  {t('view_full_catalog')} <ArrowUpRight size={16} />
               </button>
            </div>

            {/* Filter and Search Bar Panel */}
            <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-3 rounded-2xl">
               <div className="flex flex-wrap items-center gap-2 flex-1 w-full overflow-x-auto">
                  {toolCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all relative",
                        activeCategory === cat.id 
                          ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                          : "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
               </div>

               <div className="relative w-full md:w-80 shrink-0">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('search_placeholder')}
                    className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/5 focus:border-brand-primary/50 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all"
                  />
                  <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
               </div>
            </div>

            {/* Grid of Dynamic Modules */}
            <motion.div 
               layout
               className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
               <AnimatePresence mode="popLayout">
                  {filteredTools.map((tool, i) => (
                    <motion.div 
                      key={tool.name}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card hover:bg-brand-primary/[0.04] hover:border-brand-primary/40 transition-all duration-300 group p-7 flex flex-col justify-between min-h-[170px]"
                    >
                       <div>
                          <div className="flex justify-between items-start gap-2 mb-3">
                             <span className="text-[9px] font-black uppercase tracking-widest text-brand-primary/70 group-hover:text-brand-primary">
                               {tool.c}
                             </span>
                             <div className="w-2 h-2 rounded-full bg-white/10 group-hover:bg-brand-primary transition-colors" />
                          </div>
                          <h4 className="text-base font-black text-white tracking-tight uppercase mb-2 group-hover:text-white transition-colors">
                            {tool.name}
                          </h4>
                       </div>
                       <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-3">
                         {tool.desc}
                       </p>
                    </motion.div>
                  ))}
               </AnimatePresence>
            </motion.div>
         </div>
      </section>

      {/* ── Redesigned 3D Library Shelf Section ── */}
      <section className="py-24 px-6 bg-black/40 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
           
           {/* Interactive 3D CSS Book Shelf Visualizer */}
           <div className="flex-1 w-full max-w-lg mx-auto relative perspective-1000 flex flex-col items-center justify-center gap-10 py-6 order-2 lg:order-1">
              {/* Dynamic backing glow matching the selected book */}
              <div 
                className="absolute inset-0 w-80 h-80 bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none mx-auto transition-all duration-700" 
                style={{ background: booksData[selectedBook].accent }}
              />
              
              {/* Overlapping standing books */}
              <div className="flex items-end justify-center gap-3 sm:gap-4 h-64 relative preserve-3d pt-10">
                 {booksData.map((book, idx) => (
                   <div 
                     key={idx}
                     onClick={() => setSelectedBook(idx)}
                     className={cn(
                       "relative w-24 sm:w-28 h-36 sm:h-40 cursor-pointer transition-all duration-500 preserve-3d origin-bottom",
                       selectedBook === idx 
                         ? "scale-110 -translate-y-6" 
                         : "hover:-translate-y-2 opacity-40 hover:opacity-80"
                     )}
                     style={{
                       transform: selectedBook === idx 
                         ? "rotateY(-24deg) rotateX(8deg)" 
                         : "rotateY(0deg) rotateX(0deg)",
                       zIndex: selectedBook === idx ? 30 : 10
                     }}
                   >
                     {/* Spine shadow overlay */}
                     <div className="absolute inset-y-0 left-0 w-2.5 bg-black/40 rounded-l shadow-xl z-30 pointer-events-none" />
                     
                     {/* Cover face */}
                     <div className={cn(
                        "absolute inset-0 rounded-r-xl rounded-l-md bg-gradient-to-br p-4 flex flex-col justify-between border-l border-t border-white/20 shadow-2xl z-20 transition-all duration-300",
                        selectedBook === idx ? "border-white/35" : "",
                        book.color
                     )}>
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                           <book.icon size={16} className="text-white/80" />
                        </div>
                        <div className="space-y-1">
                           <p className="text-[6px] font-black text-white/40 tracking-wider uppercase">
                              {book.tag}
                           </p>
                           <h4 className="text-[10px] sm:text-xs font-black text-white leading-tight">
                              {book.label}
                           </h4>
                        </div>
                     </div>

                     {/* Page stack depth block */}
                     <div className="absolute top-[2px] bottom-[2px] right-[-6px] w-[8px] bg-slate-100 rounded-r border-r border-y border-slate-300/50 z-10 transform skew-y-[5deg] origin-left shadow-sm" />
                     <div className="absolute top-[2px] bottom-[2px] right-[-6px] w-[8px] bg-slate-100 rounded-r border-r border-y border-slate-300/50 z-10 transform -skew-y-[5deg] origin-left shadow-sm" />

                     {/* Glow aura */}
                     {selectedBook === idx && (
                       <div 
                         className="absolute inset-0 blur-[30px] rounded-xl opacity-40 z-0 pointer-events-none"
                         style={{ background: book.accent }}
                       />
                     )}
                   </div>
                 ))}
              </div>

              {/* Glass Shelf structure */}
              <div className="w-full h-3 bg-gradient-to-r from-transparent via-white/10 to-transparent border-t border-white/10 rounded-full shadow-[0_12px_24px_rgba(0,0,0,0.5)] relative">
                 <div className="absolute inset-x-12 -bottom-2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/35 to-transparent blur-[1px]" />
              </div>
           </div>

           {/* Detail Display Column */}
           <div className="flex-1 space-y-6 text-center lg:text-start order-1 lg:order-2">
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">
                    {t('library_heading')}
                 </span>
                 <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedBook}
                      initial={{ opacity: 0, x: isRTL ? 15 : -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: isRTL ? -15 : 15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                       <span className="text-xs font-black text-slate-500 tracking-wider uppercase">
                          {booksData[selectedBook].tag}
                       </span>
                       <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1]">
                          {booksData[selectedBook].title}
                       </h2>
                       <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                          {booksData[selectedBook].desc}
                       </p>
                    </motion.div>
                 </AnimatePresence>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                 <button 
                   onClick={() => navigate('/library')}
                   className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                 >
                    {t('explore_repository')}
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-bg-dark border-b border-white/5 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto space-y-16">
           <div className="text-center space-y-6">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('pricing_title')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase">{t('pricing_heading')}</h2>
              
              <div className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl relative">
                 <button 
                   onClick={() => setIsYearly(false)}
                   className={cn(
                     "px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10",
                     !isYearly ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                   )}
                 >
                   {t('pricing_monthly')}
                 </button>
                 <button 
                   onClick={() => setIsYearly(true)}
                   className={cn(
                     "px-6 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 flex items-center gap-2",
                     isYearly ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                   )}
                 >
                   <span>{t('pricing_yearly')}</span>
                   <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-black uppercase">
                     {t('pricing_save_percentage')}
                   </span>
                  </button>
               </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
                {branding?.plan && branding?.plan?.visible !== false ? (
                 [
                   { 
                     name: language === 'ar' ? (branding.plan.name || 'الباقة الاحترافية') : (branding.plan.nameEn || branding.plan.name || 'Pro Optimization Plan'), 
                     price: isYearly 
                       ? Math.floor(parseFloat(branding.plan.price || '99') * 0.8 * 12) 
                       : (branding.plan.price || '99'), 
                     currency: language === 'ar' ? (branding.plan.currency || 'ج.م') : (branding.plan.currencyEn || branding.plan.currency || 'EGP'), 
                     period: isYearly 
                       ? (language === 'ar' ? 'سنوياً' : 'yearly') 
                       : (language === 'ar' ? 'شهرياً' : 'monthly'), 
                     badge: language === 'ar' ? (branding.plan.badge || 'الأكثر شعبية') : (branding.plan.badgeEn || branding.plan.badge || 'Most Popular'), 
                     feat: language === 'ar' ? (branding.plan.features || []) : (branding.plan.featuresEn || branding.plan.features || []), 
                     ctaText: language === 'ar' ? (branding.plan.ctaText || 'اشترك الآن') : (branding.plan.ctaTextEn || branding.plan.ctaText || 'Subscribe Now'),
                     popular: true 
                   }
                 ].map((plan, i) => (
                   <div key={i} className="glass-card p-10 flex flex-col items-center justify-between relative group overflow-hidden border-brand-primary/40 bg-brand-primary/5 scale-105 z-10 max-w-md mx-auto col-span-3 min-h-[480px]">
                      {plan.badge && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest rounded-b-lg">
                          {plan.badge}
                        </div>
                      )}
                      <div className="w-full text-center space-y-4">
                         <h4 className="text-2xl font-black text-white uppercase">{plan.name}</h4>
                         <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black text-white font-mono">{plan.price}</span>
                            <span className="text-white font-extrabold uppercase text-2xl mr-1">{plan.currency}</span>
                            <span className="text-slate-500 font-bold uppercase text-[10px]">/{plan.period}</span>
                         </div>
                         <ul className="space-y-4 pt-6 text-start" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                            {plan.feat.map((f, j) => (
                              <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                 <CheckCircle2 size={15} className="text-brand-primary shrink-0" />
                                 <span>{f}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                      <button 
                        onClick={() => navigate('/auth')} 
                        className="w-full py-4.5 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:brightness-110 transition-all active:scale-[0.98] mt-10"
                      >
                        {plan.ctaText}
                      </button>
                   </div>
                 ))
               ) : (
                 [ 
                   { 
                     name: t('pricing_plan1_name'), 
                     price: "0", 
                     feat: [t('pricing_plan1_feat1'), t('pricing_plan1_feat2'), t('pricing_plan1_feat3')],
                     popular: false
                   },
                   { 
                     name: t('pricing_plan2_name'), 
                     price: isYearly ? "278" : "29", 
                     feat: [t('pricing_plan2_feat1'), t('pricing_plan2_feat2'), t('pricing_plan2_feat3')], 
                     popular: true 
                   },
                   { 
                     name: t('pricing_plan3_name'), 
                     price: isYearly ? "950" : "99", 
                     feat: [t('pricing_plan3_feat1'), t('pricing_plan3_feat2'), t('pricing_plan3_feat3')],
                     popular: false
                   }
                 ].map((plan, i) => (
                   <div key={i} className={cn(
                     "glass-card p-10 flex flex-col justify-between items-center relative group overflow-hidden transition-all duration-300",
                     plan.popular 
                       ? "border-brand-primary/40 bg-brand-primary/5 scale-105 z-10 shadow-2xl shadow-indigo-500/10" 
                       : "border-white/5 hover:border-white/15"
                   )}>
                      {plan.popular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-brand-primary text-white text-[8px] font-black uppercase tracking-widest rounded-b-lg">
                          {t('pricing_badge_popular')}
                        </div>
                      )}
                      
                      <div className="w-full text-center space-y-4">
                         <h4 className="text-2xl font-black text-white uppercase">{plan.name}</h4>
                         <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black text-white font-mono">${plan.price}</span>
                            <span className="text-slate-500 font-bold uppercase text-[10px]">/{isYearly ? (language === 'ar' ? 'سنوياً' : 'year') : (language === 'ar' ? 'شهرياً' : 'month')}</span>
                         </div>
                         <ul className="space-y-4 pt-6 text-start" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                            {plan.feat.map((f, j) => (
                              <li key={j} className="flex items-center gap-3 text-xs font-bold text-slate-400">
                                 <CheckCircle2 size={15} className="text-brand-primary shrink-0" />
                                 <span>{f}</span>
                              </li>
                            ))}
                         </ul>
                      </div>
                      
                      <button 
                        onClick={() => navigate('/auth')} 
                        className={cn(
                          "w-full py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all mt-10",
                          plan.popular 
                            ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:brightness-110" 
                            : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                        )}
                      >
                        {t('initialize_phase')}
                      </button>
                   </div>
                 ))
               )}
            </div>
         </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-b border-white/5 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('faq_title')}</span>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase mt-3">{t('faq_heading')}</h2>
          </div>
          
          <div className="space-y-4">
             {[
               { q: t('faq_q1'), a: t('faq_a1') },
               { q: t('faq_q2'), a: t('faq_a2') },
               { q: t('faq_q3'), a: t('faq_a3') },
               { q: t('faq_q4'), a: t('faq_a4') }
             ].map((faq, i) => (
                <div key={i} className="glass-card p-0 overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300">
                   <button 
                     onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                     className="w-full p-6 flex items-center justify-between hover:bg-white/[0.01] transition-all text-start gap-4"
                   >
                      <span className="font-extrabold text-white text-sm md:text-base leading-snug">{faq.q}</span>
                      <ChevronDown className={cn("w-5 h-5 text-brand-primary transition-transform shrink-0", activeFaq === i && "rotate-180")} />
                   </button>
                   <AnimatePresence initial={false}>
                      {activeFaq === i && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                           <div className="p-6 pt-2 text-xs md:text-sm text-slate-400 font-medium border-t border-white/5 leading-relaxed whitespace-pre-wrap">
                              {faq.a}
                           </div>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="reviews" className="py-24 px-6 border-b border-white/5 relative">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center">
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em]">{t('reviews_heading')}</span>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mt-3">{t('reviews_subheading')}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {[
               { r: t('review_1_text'), a: t('review_1_author'), role: t('review_1_role'), img: "SK" },
               { r: t('review_2_text'), a: t('review_2_author'), role: t('review_2_role'), img: "MV" },
               { r: t('review_3_text'), a: t('review_3_author'), role: t('review_3_role'), img: "ED" },
               { r: t('review_4_text'), a: t('review_4_author'), role: t('review_4_role'), img: "DZ" }
             ].map((review, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ scale: 1.01 }}
                  className="glass-card p-10 hover:bg-white/[0.02] transition-all border border-white/5 hover:border-white/10 flex flex-col justify-between"
                >
                   <div>
                      <div className="flex gap-1 mb-6">
                        {[...Array(5)].map((_, idx) => <Star key={idx} size={13} className="fill-brand-primary text-brand-primary" />)}
                      </div>
                      <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-8">
                         "{review.r}"
                      </p>
                   </div>
                   <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-brand-primary/30 flex items-center justify-center text-brand-primary font-black text-xs shrink-0">
                         {review.img}
                      </div>
                      <div>
                         <p className="text-sm font-black text-white">{review.a}</p>
                         <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">{review.role}</p>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-20 px-6 bg-bg-sidebar/55 border-t border-white/5 relative z-10">
         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
              <div className="flex items-center gap-3">
                 {branding?.logoUrl ? (
                    <img src={branding.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl" />
                 ) : (
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                       <Brain className="w-6 h-6 text-white" />
                    </div>
                 )}
                 <span className="text-2xl font-black text-white tracking-tighter uppercase">
                    {language === 'ar' 
                      ? (branding?.appName || 'HumanOS')
                      : (branding?.appNameEn || branding?.appName || 'HumanOS')
                    }
                 </span>
              </div>
              <p className="text-slate-500 max-w-sm font-medium leading-relaxed text-xs">
                 {t('footer_subtext')}
              </p>
            </div>
            <div>
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">{t('footer_product_heading')}</h5>
               <ul className="space-y-4 text-xs font-bold text-slate-500">
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_dna')}</li>
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_coach')}</li>
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_library')}</li>
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_pricing')}</li>
               </ul>
            </div>
            <div>
               <h5 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">{t('footer_legal_heading')}</h5>
               <ul className="space-y-4 text-xs font-bold text-slate-500">
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_privacy')}</li>
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_terms')}</li>
                  <li className="hover:text-brand-primary cursor-pointer transition-colors">{t('footer_link_data')}</li>
               </ul>
            </div>
         </div>
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-600">
             <p>
               {t('footer_text')}
             </p>
            <div className="flex gap-8">
               <span className="hover:text-white cursor-pointer transition-colors">{t('footer_social_twitter')}</span>
               <span className="hover:text-white cursor-pointer transition-colors">{t('footer_social_discord')}</span>
               <span className="hover:text-white cursor-pointer transition-colors">{t('footer_social_medium')}</span>
            </div>
         </div>
      </footer>

      {/* Floating WhatsApp Support Widget */}
      {branding?.whatsappNumber && (
        <a
          href={`https://wa.me/${branding.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
          title={language === 'ar' ? 'تواصل معنا عبر واتساب' : 'Contact Support'}
        >
          <Volume2 size={24} className="group-hover:rotate-12 transition-transform" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </span>
        </a>
      )}
    </div>
  );
}
