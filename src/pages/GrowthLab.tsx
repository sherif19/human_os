import React, { useState } from 'react';
import { 
  Zap, 
  Target, 
  Trophy, 
  ChevronRight, 
  Flame, 
  Clock, 
  Search, 
  Filter,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Shield,
  Star,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const MISSIONS = [
  {
    id: 'conf-1',
    category: 'Confidence',
    catAr: 'الثقة',
    title: 'Visual Dominance',
    titleAr: 'الهيمنة البصرية',
    description: 'Maintain eye contact with 3 strangers until they look away.',
    descriptionAr: 'حافظ على التواصل البصري مع 3 غرباء حتى ينظروا بعيداً.',
    difficulty: 'Medium',
    diffAr: 'متوسط',
    points: 150,
    status: 'available'
  },
  {
    id: 'disc-1',
    category: 'Discipline',
    catAr: 'الانضباط',
    title: 'Deep Focus Block',
    titleAr: 'كتلة التركيز العميق',
    description: 'Complete 90 minutes of work without a single tab switch.',
    descriptionAr: 'أكمل 90 دقيقة من العمل دون تبديل علامة تبويب واحدة.',
    difficulty: 'Hard',
    diffAr: 'صعب',
    points: 300,
    status: 'available'
  },
  {
    id: 'id-1',
    category: 'Identity',
    catAr: 'الهوية',
    title: 'The Silent Lead',
    titleAr: 'القيادة الصامتة',
    description: 'Attend a meeting and only speak at the very end to summarize.',
    descriptionAr: 'احضر اجتماعاً وتحدث فقط في النهاية للتلخيص.',
    difficulty: 'Medium',
    diffAr: 'متوسط',
    points: 200,
    status: 'available'
  },
  {
    id: 'soc-1',
    category: 'Social',
    catAr: 'اجتماعي',
    title: 'The Hook',
    titleAr: 'الخطاف',
    description: 'Start a conversation with a total stranger using only a question.',
    descriptionAr: 'ابدأ محادثة مع شخص غريب تماماً باستخدام سؤال فقط.',
    difficulty: 'Hard',
    diffAr: 'صعب',
    points: 250,
    status: 'available'
  }
];

export default function GrowthLab() {
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const labels = {
    en: {
      layer: 'Growth Accelerator v2.0',
      title: 'Growth Lab',
      subtitle: 'Executing methodical identity rebuilding sequences.',
      streak: 'Global Streak',
      missions: 'Active Missions',
      history: 'History Timeline',
      habit_forge: 'Habit Forge',
      index: 'Performance index',
      total_xp: 'Total XP',
      rank: 'Global Rank',
      done: 'Missions Done',
      init_habit: 'Initialize New Habit'
    },
    ar: {
      layer: 'مسرع النمو v2.0',
      title: 'مختبر النمو',
      subtitle: 'تنفيذ تسلسلات منهجية لإعادة بناء الهوية.',
      streak: 'النشاط العالمي',
      missions: 'المهمات النشطة',
      history: 'الخط الزمني للسجل',
      habit_forge: 'مصنع العادات',
      index: 'مؤشر الأداء',
      total_xp: 'إجمالي XP',
      rank: 'التصنيف العالمي',
      done: 'المهمات المنجزة',
      init_habit: 'بدء عادة جديدة'
    }
  }[language];

  // Dynamic Habits
  const habits = user?.habits || [
    { id: 'h1', name: 'Morning Meditation', nameAr: 'التأمل الصباحي', streak: 12, target: 30, color: 'text-brand-primary' },
    { id: 'h2', name: 'Deep Reading', nameAr: 'القراءة العميقة', streak: 5, target: 15, color: 'text-emerald-400' },
  ];

  const getBgColor = (textCol: string) => {
    if (textCol.includes('primary')) return 'bg-brand-primary';
    if (textCol.includes('emerald') || textCol.includes('green')) return 'bg-emerald-500';
    if (textCol.includes('blue')) return 'bg-blue-500';
    if (textCol.includes('orange')) return 'bg-orange-500';
    return 'bg-brand-primary';
  };

  const handleCompleteMission = async (missionId: string, points: number) => {
    if (!user) return;
    const completedMissions = (user as any).completedMissions || [];
    if (!completedMissions.includes(missionId)) {
      const updated = [...completedMissions, missionId];
      const newXp = (user as any).xp !== undefined ? (user as any).xp + points : (Object.keys(user.completedTests || {}).length * 200 + (user.streak || 1) * 50 + points);
      
      // Also boost user discipline or confidence slightly depending on category
      const mission = MISSIONS.find(m => m.id === missionId);
      const updateData: any = { completedMissions: updated, xp: newXp };
      
      if (mission) {
        if (mission.category === 'Confidence' && user.confidence !== undefined) {
          updateData.confidence = Math.min(100, user.confidence + 3);
        } else if (mission.category === 'Discipline' && user.discipline !== undefined) {
          updateData.discipline = Math.min(100, user.discipline + 3);
        }
      }

      await updateUser(updateData);
    }
  };

  const completedMissionsIds = (user as any)?.completedMissions || [];
  const completedMissionsList = MISSIONS.filter(m => completedMissionsIds.includes(m.id));

  // Dynamic Index calculations
  const xpVal = (user as any)?.xp !== undefined 
    ? (user as any).xp 
    : (Object.keys(user?.completedTests || {}).length * 200 + (user?.streak || 1) * 50);

  const rankVal = Math.max(1, 1000 - Math.round(xpVal / 8));
  const doneCount = completedMissionsIds.length;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <Zap size={16} className="fill-brand-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{labels.layer}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{labels.title}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{labels.subtitle}</p>
        </div>
        
        <div className="px-4 py-2 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-500">
             <Flame size={16} className="fill-orange-500" />
           </div>
           <div>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none">{labels.streak}</p>
              <p className="text-sm font-bold text-white leading-none mt-1">
                {user?.streak !== undefined ? `${user.streak} ${language === 'ar' ? 'يوم' : 'Days'}` : (language === 'ar' ? '1 يوم' : '1 Day')}
              </p>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target size={20} className="text-brand-primary" />
                {labels.missions}
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Confidence', 'Discipline', 'Social'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                      activeCategory === cat 
                        ? "bg-brand-primary/10 border-brand-primary/30 text-brand-primary" 
                        : "bg-white/5 border-transparent text-slate-500 hover:text-white"
                    )}
                  >
                    {cat === 'All' ? (language === 'ar' ? 'الكل' : 'All') : cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {MISSIONS.filter(m => activeCategory === 'All' || m.category === activeCategory).map((mission) => {
                const isCompleted = completedMissionsIds.includes(mission.id);
                return (
                  <div 
                    key={mission.id}
                    className={cn(
                      "p-6 rounded-[2rem] border transition-all relative group overflow-hidden flex flex-col justify-between min-h-[220px]",
                      isCompleted 
                        ? "bg-emerald-500/5 border-emerald-500/10" 
                        : "bg-white/5 border-white/5 hover:border-brand-primary/30 hover:bg-brand-primary/5 cursor-pointer"
                    )}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded">
                          {language === 'ar' ? mission.catAr : mission.category}
                        </span>
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">+{mission.points} XP</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">{language === 'ar' ? mission.titleAr : mission.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{language === 'ar' ? mission.descriptionAr : mission.description}</p>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest",
                          mission.difficulty === 'Hard' ? "text-rose-400" : "text-emerald-400"
                        )}>
                          {language === 'ar' ? mission.diffAr : mission.difficulty}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-all">
                          <ChevronRight size={16} className={isRTL ? "rotate-180" : ""} />
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteMission(mission.id, mission.points);
                        }}
                        className={cn(
                          "w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                          isCompleted 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-default" 
                            : "bg-brand-primary text-white hover:brightness-110 active:scale-95 border-white/10"
                        )}
                        disabled={isCompleted}
                      >
                        {isCompleted 
                          ? (language === 'ar' ? 'تم إنجاز المهمة ✓' : 'Mission Completed ✓') 
                          : (language === 'ar' ? 'تسجيل كـ مكتملة (+XP)' : 'Mark as Completed (+XP)')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass-card">
             <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={20} className="text-brand-primary" />
                {labels.history}
             </h3>
             <div className="space-y-4">
                {completedMissionsList.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/5 text-slate-500 text-xs font-medium">
                    {language === 'ar' 
                      ? 'لا توجد مهمات منجزة بعد. قم بإكمال مهمة نشطة أعلاه لتسجيلها بالجدول الزمني.'
                      : 'No completed missions yet. Complete an active mission above to record it in your timeline.'}
                  </div>
                ) : (
                  completedMissionsList.map(mission => (
                    <div key={mission.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
                        <CheckCircle2 size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">{language === 'ar' ? mission.titleAr : mission.title}</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                          {language === 'ar' ? 'تم التسجيل والمزامنة' : 'Synced & Logged'} • +{mission.points} XP
                        </p>
                      </div>
                      <ArrowUpRight size={16} className="text-slate-600" />
                    </div>
                  ))
                )}
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Shield size={16} className="text-brand-primary" />
              {labels.habit_forge}
            </h3>
            <div className="space-y-6">
              {habits.map((habit) => (
                <div key={habit.id}>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-300">{language === 'ar' ? habit.nameAr : habit.name}</p>
                    <p className="text-[10px] font-black text-slate-500">{habit.streak}/{habit.target} {language === 'ar' ? 'يوم' : 'Days'}</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", getBgColor(habit.color))}
                      style={{ width: `${Math.min(100, (habit.streak / habit.target) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/habits')}
              className="w-full mt-8 py-3 rounded-xl bg-brand-primary/10 border border-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all"
            >
              {labels.init_habit}
            </button>
          </div>

          <div className="glass-card bg-brand-primary/5 border-brand-primary/20">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Star size={16} className="text-brand-primary" />
              {labels.index}
            </h3>
            <div className="space-y-4">
               <div className="flex justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{labels.total_xp}</span>
                  <span className="text-sm font-bold text-white">{xpVal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{labels.rank}</span>
                  <span className="text-sm font-bold text-white">#{rankVal}</span>
               </div>
               <div className="flex justify-between p-3 rounded-2xl bg-white/5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{labels.done}</span>
                  <span className="text-sm font-bold text-white">{doneCount}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
