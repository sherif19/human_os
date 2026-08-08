import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Target, 
  Heart, 
  Zap, 
  Shield, 
  Clock,
  ChevronRight,
  Loader2,
  HelpCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { getUserJourneys, createJourney } from '../services/db';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';

interface Journey {
  id: string;
  name: string;
  type: string;
  progress?: number;
  status?: string;
  createdAt?: any;
}

export default function GrowthJourney() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const [searchTerm, setSearchTerm] = useState('');
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (user) {
      loadJourneys();
    }
  }, [user]);

  const loadJourneys = async () => {
    if (!user) return;
    try {
      const data = await getUserJourneys(user.uid);
      setJourneys((data as Journey[]) || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJourney = async () => {
    if (!user) return;
    const name = prompt(language === 'ar' ? 'أدخل اسم الرحلة:' : 'Enter Journey Name:');
    if (!name) return;
    try {
      await createJourney(user.uid, name, 'General');
      loadJourneys();
    } catch (err) {
       console.error(err);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-10 h-10 text-brand-primary animate-spin" /></div>;

  const filteredJourneys = journeys.filter(j => j.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">{t('growth_journey')}</h2>
          <p className="text-slate-400 mt-2 font-medium">{t('manage_projects')}</p>
        </div>
        <button 
          onClick={handleCreateJourney}
          className="px-6 py-3 bg-brand-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-transform"
        >
          <Plus className="w-5 h-5" />
          {t('create_new_journey')}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand-primary transition-colors" />
          <input 
            type="text" 
            placeholder={t('search_journeys')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all font-medium"
          />
        </div>
        <button className="h-12 px-4 glass rounded-xl flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all">
          <Filter className="w-4 h-4" />
          {language === 'ar' ? 'تصفية' : 'Filter'}
        </button>
      </div>

      <div className="grid gap-6">
        {filteredJourneys.map((journey) => {
          const Icon = Zap; 
          const color = 'text-brand-primary';
          const progress = journey.progress || 0;
          
          return (
            <motion.div 
              key={journey.id}
              whileHover={{ scale: 1.01 }}
              className="glass-card hover:border-white/20 transition-all cursor-pointer group flex flex-col md:flex-row items-center gap-8"
            >
              <div className={cn("w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0", color)}>
                <Icon className="w-8 h-8" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className={cn("flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2", isRTL && "md:flex-row-reverse")}>
                  <h4 className="text-xl font-bold text-white tracking-tight">{journey.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-black uppercase tracking-widest border border-brand-primary/20">
                    {journey.type}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {t('started_recently')}</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> {t('analysis_linked')}</span>
                </div>
              </div>

              <div className="w-full md:w-64 space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('mastery_level')}</p>
                  <span className="text-sm font-black text-white">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className={cn("h-full rounded-full", color.replace('text', 'bg'))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button className="text-[8px] font-black uppercase tracking-widest text-brand-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <HelpCircle size={10} /> {t('explanation')}
                 </button>
                <button className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                  <ChevronRight className={cn("w-5 h-5 text-slate-400 group-hover:text-white", isRTL && "rotate-180")} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredJourneys.length === 0 && (
          <div 
            onClick={handleCreateJourney}
            className="glass-card border-dashed border-white/10 bg-transparent flex flex-col items-center justify-center p-12 text-center group hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              <Plus className="w-8 h-8 text-slate-500 group-hover:text-brand-primary" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{t('init_neural_journey')}</h4>
            <p className="text-slate-500 max-w-xs font-medium">{t('select_area')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
