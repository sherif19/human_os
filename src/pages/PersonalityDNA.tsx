import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dna, 
  ChevronRight, 
  Play, 
  Lock, 
  CheckCircle2, 
  Info,
  ShieldAlert,
  Zap,
  Target,
  Brain,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar,
  Tooltip
} from 'recharts';
import { PERSONALITY_TESTS } from '../constants/tests.tsx';
import { TestRunner } from '../components/personality/TestRunner';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzePersonality, getAxisDescription } from '../lib/personalityAnalyzer';

import { translations, TranslationKey } from '../lib/translations';

export default function PersonalityDNA() {
  const { user, updateUser } = useAuth();
  const { language, isRTL } = useLanguage();
  const profile = analyzePersonality(user);

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
    'dna-sync': 'empathy',
    // Fallback/Legacy
    'self_esteem': 'selfWorth',
    'social_anxiety': 'anxiety',
    'overthinking': 'focus',
    'attachment': 'empathy',
    'stress_resistance': 'stability',
    'trauma_pattern': 'anxiety',
    'emotional_maturity': 'emotional'
  };

  const handleTestComplete = async (answers: Record<number, number>) => {
    if (!user || !activeTest) return;

    const values = Object.values(answers);
    const sum = values.reduce((a, b) => a + b, 0);
    const score = Math.round((sum / (values.length * 5)) * 100);

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

  const statsData = [
    { subject: 'Confidence', subjectAr: 'الثقة', A: user?.confidence !== undefined ? user.confidence : 82 },
    { subject: 'Discipline', subjectAr: 'الانضباط', A: user?.discipline !== undefined ? user.discipline : 48 },
    { subject: 'EQ', subjectAr: 'الذكاء العاطفي', A: user?.emotional !== undefined ? user.emotional : 75 },
    { subject: 'Charisma', subjectAr: 'الكاريزما', A: user?.charisma !== undefined ? user.charisma : 50 },
    { subject: 'Leadership', subjectAr: 'القيادة', A: user?.leadership !== undefined ? user.leadership : 60 },
    { subject: 'Self Worth', subjectAr: 'تقدير الذات', A: user?.selfWorth !== undefined ? user.selfWorth : 70 },
    { subject: 'Consistency', subjectAr: 'الاتساق', A: user?.consistency !== undefined ? user.consistency : 45 },
    { subject: 'Focus', subjectAr: 'التركيز', A: user?.focus !== undefined ? user.focus : 85 },
    { subject: 'Social Energy', subjectAr: 'الطاقة الاجتماعية', A: user?.social !== undefined ? user.social : 55 },
    { subject: 'Resilience', subjectAr: 'المرونة', A: user?.empathy !== undefined ? user.empathy : 65 },
  ];

  const averageIndex = Math.round(statsData.reduce((acc, curr) => acc + curr.A, 0) / statsData.length);
  const strongest = [...statsData].sort((a, b) => b.A - a.A)[0];
  const weakest = [...statsData].sort((a, b) => a.A - b.A)[0];

  const getStrengths = () => {
    if (language === 'ar') {
      if (user?.strengthsAr) return user.strengthsAr.split(',').map(s => s.trim());
      return ['تخطيط الأنظمة المعقدة', 'الانفصال الاستراتيجي', 'التركيز الشديد'];
    } else {
      if (user?.strengths) return user.strengths.split(',').map(s => s.trim());
      return ['Complex System Mapping', 'Strategic Detachment', 'Extreme Focus'];
    }
  };

  const getWeaknesses = () => {
    if (language === 'ar') {
      if (user?.weaknessesAr) return user.weaknessesAr.split(',').map(w => w.trim());
      return ['العفوية التكتيكية', 'التزامن العاطفي', 'الاتساق الأساسي'];
    } else {
      if (user?.weaknesses) return user.weaknesses.split(',').map(w => w.trim());
      return ['Tactical Spontaneity', 'Emotional Synchrony', 'Baseline Consistency'];
    }
  };

  const t = (key: TranslationKey) => translations[language][key] || key;
  const [activeTab, setActiveTab] = useState<'overview' | 'tests'>('overview');
  const [activeTest, setActiveTest] = useState<typeof PERSONALITY_TESTS[0] | null>(null);

  if (activeTest) {
    const translatedTest = {
      ...activeTest,
      name: t(activeTest.nameKey as TranslationKey)
    };
    return <TestRunner test={translatedTest} onCancel={() => setActiveTest(null)} onComplete={handleTestComplete} />;
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <Dna className="w-4 h-4 fill-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transformation Core v0.4.1</span>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">{t('personality_dna')}</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">{t('personality_landscape')}</p>
        </div>
        
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
          {(['overview', 'tests'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
              )}
            >
              {language === 'ar' ? (tab === 'overview' ? 'نظرة عامة' : 'الاختبارات') : tab}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Detailed Radar Chart */}
            <div className="glass-card flex flex-col min-h-[550px] relative overflow-hidden group">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="flex items-center justify-between mb-8 relative">
                <div>
                  <h4 className="font-bold text-xl text-white tracking-tight">{t('intelligence_radar')}</h4>
                  <p className="text-[10px] text-slate-500 font-black mt-1 uppercase tracking-[0.2em]">{t('neural_state')} (Index {averageIndex})</p>
                </div>
                <div className="flex gap-2">
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('global_percentile')}</span>
                      <span className="text-sm font-black text-brand-primary">Top {Math.max(1.0, Number((100 - averageIndex * 1.1).toFixed(1)))}%</span>
                   </div>
                </div>
              </div>
              <div className="flex-1 w-full relative min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <RadarChart data={statsData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis 
                      dataKey={language === 'ar' ? "subjectAr" : "subject"} 
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 7, fontWeight: '900' }} 
                    />
                    <Radar
                      name="Current"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                      strokeWidth={3}
                    />
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
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4 relative">
                 <div className="flex-1 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-primary/20 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('strongest_axis')}</p>
                    <p className="text-base font-black text-brand-primary tracking-tight mb-2">
                      {language === 'ar' ? strongest.subjectAr : strongest.subject} ({strongest.A}%)
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {getAxisDescription(strongest.subject, 'strongest', language)}
                    </p>
                 </div>
                 <div className="flex-1 p-5 rounded-3xl bg-white/5 border border-white/5 hover:border-brand-primary/20 transition-all">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('growth_axis')}</p>
                    <p className="text-base font-black text-rose-400 tracking-tight mb-2">
                      {language === 'ar' ? weakest.subjectAr : weakest.subject} ({weakest.A}%)
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {getAxisDescription(weakest.subject, 'growth', language)}
                    </p>
                 </div>
              </div>
            </div>

            {/* Analysis Summary */}
            <div className="space-y-6">
              <div className="glass-card border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                   <Brain size={80} className="text-brand-primary" />
                </div>
                <div className="flex items-center gap-2 text-brand-primary mb-6">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">Neural archetype detection</span>
                </div>
                
                <div className="flex items-start gap-6 relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center shrink-0 shadow-2xl shadow-brand-primary/40 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-white  mb-2 tracking-tighter">
                      {language === 'ar' ? profile.archetypeAr : profile.archetype}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                       {t('primary_driver')}: {language === 'ar' ? profile.primaryDriverAr : profile.primaryDriver}
                    </p>
                    <p className="text-slate-400 leading-relaxed font-medium text-sm max-w-md">
                      {language === 'ar' ? profile.insightAr : profile.insight}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="glass-card">
                  <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    {t('core_strengths')}
                  </h5>
                  <ul className="space-y-3">
                    {(language === 'ar' ? profile.strengthsAr : profile.strengths).map(s => (
                      <li key={s} className="flex items-center gap-2 text-xs font-bold text-white tracking-tight">
                        <div className="w-1 h-1 rounded-full bg-emerald-500/50" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card">
                  <h5 className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <ShieldAlert size={12} />
                    {t('vulnerability_window')}
                  </h5>
                  <ul className="space-y-3">
                    {(language === 'ar' ? profile.weaknessesAr : profile.weaknesses).map(w => (
                      <li key={w} className="flex items-center gap-2 text-xs font-bold text-white tracking-tight">
                        <div className="w-1 h-1 rounded-full bg-rose-500/50" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="glass-card bg-bg-sidebar border-white/5 relative">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('growth_protocol')}</h4>
                   <Zap size={14} className="text-brand-primary" />
                </div>
                <p className="text-sm text-slate-400 leading-relaxed  font-medium">
                  {language === 'ar' ? profile.growthProtocolAr : profile.growthProtocol}
                </p>
                <div className="mt-6 flex justify-end">
                   <button className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2">
                      {t('initialize_phase')} <ChevronRight size={12} className={cn(isRTL && "rotate-180")} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {PERSONALITY_TESTS.map((test) => (
              <div 
                key={test.id} 
                className="glass-card hover:bg-white/5 transition-all cursor-pointer group"
                onClick={() => setActiveTest(test)}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="p-4 rounded-2xl bg-brand-primary/10 text-brand-primary border border-brand-primary/10">
                    <test.icon className="w-6 h-6" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {t(test.nameKey as TranslationKey)}
                </h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">{test.questions} {language === 'ar' ? 'فصل في التقييم' : 'Assessment Points'}</p>
                
                <div className="flex items-center gap-4 mb-4">
                  <button className="text-[8px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <HelpCircle size={10} /> {t('explanation')}
                  </button>
                </div>

                <button className="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 bg-brand-primary text-white hover:brightness-110 transition-all border border-white/10">
                  {t('begin_execution')}
                  <ChevronRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
                </button>
              </div>
            ))}
          </motion.div>
        )}

        {/* Roadmap tab removed */}
      </AnimatePresence>
    </div>
  );
}

function TrophyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
