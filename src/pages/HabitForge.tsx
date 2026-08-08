import React, { useState } from 'react';
import { Flame, Target, Zap, Clock, CheckCircle2, TrendingUp, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { translations, TranslationKey } from '../lib/translations';

export default function HabitForge() {
  const { language, isRTL } = useLanguage();
  const { user, updateUser } = useAuth();
  const t = (key: TranslationKey) => translations[language][key] || key;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState(30);
  const [newHabitColor, setNewHabitColor] = useState('text-brand-primary');

  const defaultHabits = [
    { id: 'h1', name: 'Morning Meditation', nameAr: 'التأمل الصباحي', streak: 12, target: 30, color: 'text-brand-primary', lastCompleted: '', history: [] as string[] },
    { id: 'h2', name: 'Deep Reading', nameAr: 'القراءة العميقة', streak: 5, target: 15, color: 'text-emerald-400', lastCompleted: '', history: [] as string[] },
  ];

  const habits = user?.habits || defaultHabits;

  // Handle adding a new habit
  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit = {
      id: `habit-${Date.now()}`,
      name: newHabitName,
      nameAr: newHabitName,
      streak: 0,
      target: newHabitTarget,
      color: newHabitColor,
      lastCompleted: '',
      history: [] as string[]
    };

    const updatedHabits = [...habits, newHabit];
    await updateUser({ habits: updatedHabits });
    setNewHabitName('');
    setIsAddModalOpen(false);
  };

  // Handle checking off a habit for the day
  const handleCompleteHabit = async (habitId: string) => {
    // Get current local date formatted as YYYY-MM-DD
    const localToday = new Date();
    const year = localToday.getFullYear();
    const month = String(localToday.getMonth() + 1).padStart(2, '0');
    const day = String(localToday.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;

    const updatedHabits = habits.map(h => {
      if (h.id === habitId) {
        if (h.lastCompleted === todayStr) {
          alert(language === 'ar' ? 'لقد أكملت هذه العادة اليوم بالفعل!' : 'You have already completed this habit today!');
          return h;
        }

        const newHistory = h.history ? [...h.history, todayStr] : [todayStr];
        let newStreak = h.streak || 0;

        if (!h.lastCompleted) {
          newStreak = 1;
        } else {
          const lastDate = new Date(h.lastCompleted);
          const todayDate = new Date(todayStr);
          const diffTime = todayDate.getTime() - lastDate.getTime();
          const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1;
          } else if (diffDays > 1) {
            newStreak = 1; // Reset streak if user skipped a day
          }
        }

        return {
          ...h,
          streak: newStreak,
          lastCompleted: todayStr,
          history: newHistory
        };
      }
      return h;
    });

    await updateUser({ habits: updatedHabits });
  };

  // Handle deleting a habit
  const handleDeleteHabit = async (habitId: string) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    await updateUser({ habits: updatedHabits });
  };

  // Calculate dynamic consistency statistics
  const totalProgress = habits.reduce((acc, h) => {
    const progress = h.target > 0 ? (h.streak / h.target) * 100 : 0;
    return acc + Math.min(100, progress);
  }, 0);
  
  const successRate = habits.length > 0 ? Math.round(totalProgress / habits.length) : 0;
  const completedCount = habits.filter(h => h.streak >= h.target).length;
  const totalCount = habits.length;

  return (
    <div className="pb-20 relative">
      
      {/* 1. Modal for New Habit */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="glass-card max-w-md w-full p-6 md:p-8 relative overflow-hidden"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className={`absolute top-6 text-slate-500 hover:text-white transition-colors ${isRTL ? "left-6" : "right-6"}`}
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">
                {language === 'ar' ? 'إنشاء عادة جديدة' : 'Create New Habit'}
              </h2>

              <form onSubmit={handleAddHabit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    {language === 'ar' ? 'اسم العادة' : 'Habit Name'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={language === 'ar' ? 'مثال: القراءة اليومية، شرب الماء...' : 'e.g. Daily Coding, Gym, Water...'} 
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-primary/40 transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    {language === 'ar' ? 'المدة المستهدفة (أيام)' : 'Target Duration (Days)'}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[7, 15, 21, 30].map(days => (
                      <button
                        type="button"
                        key={days}
                        onClick={() => setNewHabitTarget(days)}
                        className={cn(
                          "py-2.5 rounded-xl text-xs font-bold border transition-all",
                          newHabitTarget === days
                            ? "bg-brand-primary border-brand-primary text-white"
                            : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                        )}
                      >
                        {days} {language === 'ar' ? 'يوم' : 'Days'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                    {language === 'ar' ? 'اللون المميز' : 'Accent Color'}
                  </label>
                  <div className="flex gap-4">
                    {[
                      { class: 'text-brand-primary', bg: 'bg-brand-primary' },
                      { class: 'text-emerald-400', bg: 'bg-emerald-400' },
                      { class: 'text-amber-400', bg: 'bg-amber-400' },
                      { class: 'text-rose-400', bg: 'bg-rose-400' },
                    ].map(col => (
                      <button
                        type="button"
                        key={col.class}
                        onClick={() => setNewHabitColor(col.class)}
                        className={cn(
                          "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                          newHabitColor === col.class ? "border-white scale-110" : "border-transparent"
                        )}
                      >
                        <div className={cn("w-5 h-5 rounded-full", col.bg)} />
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-brand-primary/20"
                >
                  {language === 'ar' ? 'حفظ العادة' : 'Save Habit'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Flame size={20} />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase ">
              {language === 'ar' ? 'تشكيل العادات' : 'HABIT FORGE'}
            </h1>
          </div>
          <p className="text-slate-400 font-medium max-w-2xl">
            {language === 'ar' 
              ? 'برمجة السلوكيات التلقائية لتقليل استهلاك الإرادة وضمان الاستمرارية.'
              : 'Program automatic behaviors to reduce willpower consumption and ensure consistency.'}
          </p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-brand-primary/20"
        >
          <Plus size={14} />
          {language === 'ar' ? 'عادة جديدة' : 'NEW HABIT'}
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Habit List */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {habits.length === 0 ? (
            <div className="glass-card p-12 text-center text-slate-500">
               {language === 'ar' ? 'لا توجد عادات مسجلة حالياً. اضغط على عادة جديدة للبدء!' : 'No habits tracked. Click New Habit to start!'}
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {habits.map((habit: any) => {
                const localToday = new Date();
                const todayStr = `${localToday.getFullYear()}-${String(localToday.getMonth() + 1).padStart(2, '0')}-${String(localToday.getDate()).padStart(2, '0')}`;
                const isCompletedToday = habit.lastCompleted === todayStr;

                return (
                  <motion.div 
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 group"
                  >
                    <div className={cn("w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0", habit.color)}>
                      <Zap size={24} />
                    </div>
                    
                    <div className="flex-1 w-full text-center md:text-left" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-bold text-white">{language === 'ar' ? habit.nameAr || habit.name : habit.name}</h4>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ">{habit.streak} / {habit.target} DAYS</span>
                      </div>
                      <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (habit.streak / habit.target) * 100)}%` }}
                          className={cn("h-full rounded-full", habit.color.replace('text-', 'bg-'))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => handleCompleteHabit(habit.id)}
                        disabled={isCompletedToday}
                        className={cn(
                          "w-12 h-12 rounded-xl border flex items-center justify-center transition-all",
                          isCompletedToday 
                            ? "bg-emerald-500 text-white border-transparent cursor-not-allowed opacity-80"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                        )}
                        title={isCompletedToday ? (language === 'ar' ? 'تم اليوم' : 'Completed Today') : (language === 'ar' ? 'تسجيل إكمال' : 'Mark Completed')}
                      >
                        <CheckCircle2 size={20} />
                      </button>
                      <button 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 text-slate-500 flex items-center justify-center hover:bg-rose-500/10 hover:text-red-500 transition-all"
                        title={language === 'ar' ? 'حذف العادة' : 'Delete Habit'}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Stats Column */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="glass-card p-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">{language === 'ar' ? 'إحصائيات الاتساق' : 'CONSISTENCY STATS'}</h3>
            
            <div className="flex justify-between items-end mb-8">
               <div>
                  <p className="text-4xl font-black text-white ">{successRate}%</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{language === 'ar' ? 'معدل النجاح' : 'SUCCESS RATE'}</p>
               </div>
               <TrendingUp size={40} className="text-brand-primary opacity-20" />
            </div>

            <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-center">
                  <Clock className="text-slate-500 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{language === 'ar' ? 'وقت الذروة' : 'PEAK TIME'}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">07:00 AM - 09:00 AM</p>
                  </div>
               </div>
               <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex gap-4 items-center">
                  <Target className="text-slate-500 shrink-0" size={20} />
                  <div>
                    <p className="text-xs font-bold text-white uppercase">{language === 'ar' ? 'تحقيق الأهداف' : 'GOAL REACH'}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                      {completedCount} / {totalCount} {language === 'ar' ? 'العادات المكتملة' : 'TOTAL HABITS'}
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
