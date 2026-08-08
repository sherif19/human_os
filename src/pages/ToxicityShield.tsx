import React, { useState, useEffect, useRef } from 'react';
import { Shield, Ban, AlertTriangle, CheckCircle2, Search, Brain, Zap, Users, X, Volume2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export default function ToxicityShield() {
  const { language, isRTL } = { language: useLanguage().language, isRTL: useLanguage().isRTL };
  const { user, updateUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'scan' | 'shield' | 'healing'>('scan');

  // Scan simulation state
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);

  // Lockdown emergency state
  const [showLockdown, setShowLockdown] = useState(false);
  const [lockdownTime, setLockdownTime] = useState(10);

  // Healing state
  const [healingActive, setHealingActive] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);

  // Audio refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const leftOscRef = useRef<OscillatorNode | null>(null);
  const rightOscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Handle lockdown timer
  useEffect(() => {
    let interval: any;
    if (showLockdown && lockdownTime > 0) {
      interval = setInterval(() => {
        setLockdownTime(prev => prev - 1);
      }, 1000);
    } else if (lockdownTime === 0 && showLockdown) {
      finishLockdown();
    }
    return () => clearInterval(interval);
  }, [showLockdown, lockdownTime]);

  // Handle scan progress
  useEffect(() => {
    let interval: any;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setScanComplete(true);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Handle healing progress
  useEffect(() => {
    let interval: any;
    if (healingActive) {
      interval = setInterval(() => {
        setHealingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setHealingActive(false);
            finishHealing();
            return 100;
          }
          return prev + 10;
        });
      }, 400);
    }
    return () => clearInterval(interval);
  }, [healingActive]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  const defaultProtocols = {
    blockDistractions: true,
    responseFiltering: true,
    cortisolIsolation: false,
    autoRedirect: false
  };

  const activeProtocols = user?.shieldProtocols || defaultProtocols;

  const handleToggleProtocol = async (key: string) => {
    if (!user) return;
    const updated = {
      ...activeProtocols,
      [key]: !activeProtocols[key]
    };
    await updateUser({
      shieldProtocols: updated
    });
  };

  const startScan = () => {
    setScanProgress(0);
    setIsScanning(true);
    setScanComplete(false);
  };

  const startLockdown = () => {
    setLockdownTime(10);
    setShowLockdown(true);
  };

  const finishLockdown = async () => {
    setShowLockdown(false);
    if (!user) return;
    const currentStability = user.stability ?? 92;
    await updateUser({
      stability: Math.min(100, currentStability + 5)
    });
    alert(language === 'ar' ? 'اكتمل بروتوكول العزل! تم استعادة +5٪ من استقرار النظام' : 'Isolation protocol complete! Restored +5% System Stability');
  };

  // Synthesize binaural alpha waves
  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const leftOsc = audioCtx.createOscillator();
      const rightOsc = audioCtx.createOscillator();
      leftOsc.type = 'sine';
      rightOsc.type = 'sine';
      
      // Carrier frequency of 200Hz, and a modulator of 210Hz creates a 10Hz binaural beat (Alpha frequency)
      leftOsc.frequency.value = 200; 
      rightOsc.frequency.value = 210; 

      const pannerLeft = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
      const pannerRight = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;

      const gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 1.0); // Smooth fade-in
      gainNodeRef.current = gainNode;

      if (pannerLeft && pannerRight) {
        pannerLeft.pan.value = -1;
        pannerRight.pan.value = 1;

        leftOsc.connect(pannerLeft);
        pannerLeft.connect(gainNode);

        rightOsc.connect(pannerRight);
        pannerRight.connect(gainNode);
      } else {
        leftOsc.connect(gainNode);
        rightOsc.connect(gainNode);
      }

      // Add a lowpass filter to make it sound warm and ocean-like
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 140; 
      
      gainNode.connect(filter);
      filter.connect(audioCtx.destination);

      leftOsc.start();
      rightOsc.start();

      leftOscRef.current = leftOsc;
      rightOscRef.current = rightOsc;
    } catch (e) {
      console.error("Web Audio API not supported or blocked by autoplay policy", e);
    }
  };

  const stopAudio = () => {
    const gainNode = gainNodeRef.current;
    const audioCtx = audioContextRef.current;
    const leftOsc = leftOscRef.current;
    const rightOsc = rightOscRef.current;

    if (gainNode && audioCtx) {
      try {
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      try {
        if (leftOsc) leftOsc.stop();
        if (rightOsc) rightOsc.stop();
        if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      } catch (err) {
        console.error(err);
      }
    }, 500);
  };

  const startHealing = () => {
    setHealingProgress(0);
    setHealingActive(true);
    startAudio();
  };

  const finishHealing = async () => {
    stopAudio();
    if (!user) return;
    const currentEmotional = user.emotional ?? 75;
    const currentAnxiety = user.anxiety ?? 12;
    await updateUser({
      emotional: Math.min(100, currentEmotional + 3),
      anxiety: Math.max(0, currentAnxiety - 2)
    });
    alert(language === 'ar' ? 'تمت إعادة ضبط النبض العصبي! +3٪ اتزان عاطفي، -2٪ مستوى القلق' : 'Neural pulse recalibrated! +3% Emotional Stability, -2% Anxiety Level');
  };

  const handleTabChange = (tab: 'scan' | 'shield' | 'healing') => {
    if (activeTab === 'healing') {
      stopAudio();
      setHealingActive(false);
    }
    setActiveTab(tab);
  };

  // Dynamic calculations based on user metrics
  const stability = user?.stability ?? 92;
  const empathy = user?.empathy ?? 70;
  const discipline = user?.discipline ?? 48;
  const social = user?.social ?? 40;
  const anxiety = user?.anxiety ?? 12;

  const exposureRisk = Math.max(5, Math.round(100 - stability));
  
  const getRiskLabel = (val: number) => {
    if (val < 15) return language === 'ar' ? 'خطر منخفض جداً' : 'ULTRA LOW RISK';
    if (val < 45) return language === 'ar' ? 'خطر معتدل' : 'MODERATE RISK';
    return language === 'ar' ? 'خطر حرج للغاية' : 'HIGH CRITICAL RISK';
  };

  const emotionalManipulation = Math.max(10, Math.round((100 - empathy + anxiety) / 1.1));
  const workplaceToxicity = Math.max(10, Math.round(100 - discipline));
  const socialDrama = Math.max(10, Math.round(100 - social));

  const toxicityFactors = [
    { id: 1, type: 'Relationship', name: language === 'ar' ? 'التلاعب العاطفي' : 'Emotional Manipulation', level: emotionalManipulation, icon: Brain },
    { id: 2, type: 'Environment', name: language === 'ar' ? 'بيئة العمل السامة' : 'Workplace Toxicity', level: workplaceToxicity, icon: Zap },
    { id: 3, type: 'Social', name: language === 'ar' ? 'الدراما الاجتماعية' : 'Social Drama', level: socialDrama, icon: Users },
  ];

  const labels = {
    en: {
      layer: 'Toxicity Shield Layer',
      title: 'Toxicity Shield',
      subtitle: 'Identify, neutralize, and heal external stressful influences that hinder your neural growth.',
      neural_scan: 'Neural Scan',
      shield_proto: 'Shield Protocol',
      energy_heal: 'Energy Healing',
      factors: 'Active Toxic Factors',
      exposure: 'Exposure Risk',
      start_scan: 'Run Algorithm Scan',
      scanning: 'Scanning Social Channels...',
      scan_btn: 'RUN ALGORITHM',
      active_shield: 'NEURAL SHIELD ACTIVE',
      block_dist: 'Block Distractions',
      resp_filter: 'Response Filtering',
      cort_isolation: 'Cortisol Isolation',
      auto_redirect: 'Auto-Redirect',
      emergency: 'EMERGENCY MODE',
      isolation_desc: 'Activate total isolation and cut all untrusted external communications immediately.',
      activate_iso: 'ACTIVATE ISOLATION',
      boundaries_strong: 'Strong personal boundaries',
      stress_neutralized: 'Stress sources neutralized',
      potential_risk: 'Potential high-risk interaction',
      cooldown: 'EMERGENCY SHIELD LOCKDOWN ACTIVE',
      cooldown_desc: 'Disconnecting neural feedback loop from external stressors to establish stability.',
      time_rem: 'Time remaining',
      healing_title: 'Bio-frequency Syncer',
      healing_desc: 'Calibrating auditory neural pathways using high-stability alpha wave frequencies.',
      healing_btn: 'RESTORE FREQUENCY',
      healing_active: 'Synchronizing...'
    },
    ar: {
      layer: 'طبقة درع السمية',
      title: 'درع السمية',
      subtitle: 'تحديد وتحييد ومعالجة التأثيرات الخارجية المجهدة التي تعيق نموك العصبي.',
      neural_scan: 'الفحص العصبي',
      shield_proto: 'بروتوكول الحماية',
      energy_heal: 'ترميم الطاقة',
      factors: 'العوامل النشطة السامة',
      exposure: 'احتمالية التعرض',
      start_scan: 'تشغيل خوارزمية الفحص',
      scanning: 'جاري فحص القنوات الاجتماعية...',
      scan_btn: 'تشغيل الخوارزمية',
      active_shield: 'الدرع العصبي نشط',
      block_dist: 'حظر المشتتات',
      resp_filter: 'فلترة الردود',
      cort_isolation: 'عزل كورتيزول',
      auto_redirect: 'إعادة التوجيه',
      emergency: 'وضع الطوارئ',
      isolation_desc: 'تفعيل العزلة التامة وقطع جميع الاتصالات الخارجية غير الموثوقة فوراً.',
      activate_iso: 'تفعيل العزلة',
      boundaries_strong: 'الحدود الشخصية قوية',
      stress_neutralized: 'تم تحييد مصادر الضغط',
      potential_risk: 'تفاعل عالي الخطورة محتمل',
      cooldown: 'وضع الطوارئ مغلق بالكامل',
      cooldown_desc: 'فصل قنوات التغذية العصبية عن المثيرات الخارجية لاستعادة ثبات النظام.',
      time_rem: 'الوقت المتبقي',
      healing_title: 'مزامنة الترددات الحيوية',
      healing_desc: 'معايرة المسارات العصبية السمعية باستخدام ترددات موجات ألفا عالية الاستقرار.',
      healing_btn: 'ترميم التردد',
      healing_active: 'جاري المزامنة...'
    }
  }[language];

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <Shield size={20} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase ">
              {labels.title}
            </h1>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl">
            {labels.subtitle}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
        {(['scan', 'shield', 'healing'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={cn(
              "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
              activeTab === tab 
                ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                : "bg-white/5 text-slate-500 hover:text-white"
            )}
          >
            {tab === 'scan' && labels.neural_scan}
            {tab === 'shield' && labels.shield_proto}
            {tab === 'healing' && labels.energy_heal}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'scan' && (
              <motion.div 
                key="scan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
              >
                <div className="glass-card p-8">
                  <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-6">
                    {labels.factors}
                  </h3>
                  <div className="space-y-6">
                    {toxicityFactors.map((factor) => (
                      <div key={factor.id} className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                          <factor.icon size={24} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-end mb-2">
                            <div>
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{factor.type}</span>
                              <h4 className="text-lg font-bold text-white">{factor.name}</h4>
                            </div>
                            <span className="text-xl font-black text-red-500 ">{factor.level}%</span>
                          </div>
                          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${factor.level}%` }}
                              className="bg-red-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-8 text-center bg-brand-primary/5 relative">
                  {isScanning ? (
                    <div className="py-8 space-y-4">
                      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto" />
                      <p className="text-xs font-black text-brand-primary uppercase tracking-widest">{labels.scanning}</p>
                      <div className="max-w-xs mx-auto bg-white/10 h-1 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: `${scanProgress}%` }} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <Search className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">{labels.start_scan}</h3>
                      <p className="text-slate-400 text-sm mb-4 max-w-sm mx-auto text-center">
                        {language === 'ar' 
                          ? 'سيقوم النظام بتحليل محادثاتك الأخيرة وتفاعلاتك لاكتشاف الأنماط السامة.'
                          : 'System will analyze your recent conversations and interactions to detect toxic patterns.'}
                      </p>
                      
                      <p className="text-[10px] text-brand-primary font-bold mb-6 max-w-xs mx-auto text-center uppercase tracking-wider">
                        {language === 'ar' 
                          ? '💡 الإجراء المطلوب: اضغط لتقييم مستويات التوتر وتحديث إحصائيات التعرض للضغوطات.'
                          : '💡 Action Required: Click to evaluate stress levels and refresh exposure statistics.'}
                      </p>

                      <button 
                        onClick={startScan}
                        className="px-10 py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all"
                      >
                        {labels.scan_btn}
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'shield' && (
              <motion.div 
                key="shield"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="glass-card p-10 bg-emerald-500/5 border-emerald-500/20">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 mx-auto">
                    <Shield size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-white text-center mb-4 uppercase ">
                    {labels.active_shield}
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4 mt-12">
                     {[
                       { id: 'blockDistractions', label: labels.block_dist, desc: language === 'ar' ? 'حجب الكلمات والرسائل السلبية تلقائياً.' : 'Automatically block negative keywords.' },
                       { id: 'responseFiltering', label: labels.resp_filter, desc: language === 'ar' ? 'فحص رسائلك قبل إرسالها لتفادي الحدة والتوتر.' : 'Scans your messages before sending to prevent friction.' },
                       { id: 'cortisolIsolation', label: labels.cort_isolation, desc: language === 'ar' ? 'تفعيل فترات صمت رقمي لتجنب ضغوطات العمل.' : 'Enforces silence intervals to reduce workplace stress.' },
                       { id: 'autoRedirect', label: labels.auto_redirect, desc: language === 'ar' ? 'توجيه طاقة الغضب والانفعال نحو أنشطة بناءة.' : 'Redirects aggressive energy into focus targets.' },
                     ].map((item) => {
                       const isActive = !!activeProtocols[item.id as keyof typeof activeProtocols];
                       return (
                         <button 
                           key={item.id} 
                           onClick={() => handleToggleProtocol(item.id)}
                           className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 text-left hover:border-white/10 transition-all w-full gap-4"
                         >
                            <div>
                              <span className="text-xs font-bold text-white uppercase block">{item.label}</span>
                              <span className="text-[9px] text-slate-500 font-medium">{item.desc}</span>
                            </div>
                            <div className={cn("w-10 h-5 rounded-full relative transition-colors duration-300 shrink-0", isActive ? "bg-emerald-500" : "bg-slate-700")}>
                               <div className={cn("absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300", isRTL ? (isActive ? "left-6" : "left-1") : (isActive ? "right-1" : "right-6") )} />
                            </div>
                         </button>
                       );
                     })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'healing' && (
              <motion.div 
                key="healing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass-card p-10 bg-brand-primary/5 border border-brand-primary/10 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-pulse">
                  <Volume2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase">{labels.healing_title}</h3>
                <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                  {labels.healing_desc}
                </p>
                <p className="text-[10px] text-slate-500 font-medium max-w-xs leading-relaxed">
                  {language === 'ar'
                    ? '💡 الإجراء المطلوب: شغل التردد والبس سماعات الأذن وركز على الصوت لتهدئة الأعصاب وتخفيض القلق (-2٪).'
                    : '💡 Action Required: Wear headphones, play frequency, and focus on sound to soothe nerves and lower anxiety (-2% Anxiety).'}
                </p>

                {healingActive ? (
                  <div className="w-full max-w-xs space-y-3">
                    <div className="flex justify-between text-[10px] font-black text-brand-primary tracking-widest uppercase">
                      <span>{labels.healing_active}</span>
                      <span>{healingProgress}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary transition-all duration-300" style={{ width: `${healingProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={startHealing}
                    className="px-8 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    {labels.healing_btn}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">
              {labels.exposure}
            </h3>
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-2 ">{exposureRisk}%</div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                {getRiskLabel(exposureRisk)}
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>{labels.boundaries_strong}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span>{labels.stress_neutralized}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <AlertTriangle size={12} className="text-amber-500" />
                <span>{labels.potential_risk}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 border-red-500/20 bg-red-500/5">
             <Ban className="w-8 h-8 text-red-500 mb-4" />
             <h4 className="text-sm font-black text-white uppercase  mb-2">{labels.emergency}</h4>
             <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
               {labels.isolation_desc}
             </p>
             
             <p className="text-[10px] text-red-400 font-medium leading-relaxed mb-4">
               {language === 'ar'
                 ? '💡 الإجراء المطلوب: قم بتفعيل هذا الوضع عند التعرض لموقف ضاغط حاد أو خلاف حادي لعزل نفسك تماماً لمدة 10 ثوانٍ واستعادة +5٪ استقرار.'
                 : '💡 Action Required: Activate this mode during acute high-stress conflict to isolate yourself completely for 10s and restore +5% stability.'}
             </p>

             <button 
               onClick={startLockdown}
               className="w-full py-3 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all"
             >
               {labels.activate_iso}
             </button>
          </div>
        </div>
      </div>

      {/* Lockdown overlay */}
      {showLockdown && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[100] flex flex-col items-center justify-center p-8 text-center select-none">
          <div className="relative w-40 h-40 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-red-500/10 border-t-red-500 animate-spin" />
            <ShieldAlert size={64} className="text-red-500 animate-pulse" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-red-500 tracking-tighter uppercase  mb-4">
            {labels.cooldown}
          </h1>
          <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-8">
            {labels.cooldown_desc}
          </p>
          <div className="text-2xl font-mono font-black text-white tracking-widest">
            {labels.time_rem}: {lockdownTime}s
          </div>
        </div>
      )}
    </div>
  );
}
