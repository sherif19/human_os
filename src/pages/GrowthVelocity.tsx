import React from 'react';
import { TrendingUp, BarChart3, Zap, Target, ArrowUpRight, Activity } from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function GrowthVelocity() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Dynamic Momentum Index Calculation
  const momentum = user ? Math.min(100, Math.round((user.streak ?? 1) * 5 + (user.completedTests ? Object.keys(user.completedTests).length * 10 : 0))) : 42;
  
  const chartData = [
    { name: 'W1', value: Math.round(momentum * 0.4) },
    { name: 'W2', value: Math.round(momentum * 0.6) },
    { name: 'W3', value: Math.round(momentum * 0.5) },
    { name: 'W4', value: Math.round(momentum * 0.75) },
    { name: 'W5', value: Math.round(momentum * 0.9) },
    { name: 'W6', value: momentum },
  ];

  // Dynamic grade calculation
  const avgScore = user ? Math.round(((user.focus ?? 85) + (user.discipline ?? 48) + (user.emotional ?? 75) + (user.confidence ?? 65) + (user.selfWorth ?? 55) + (user.consistency ?? 45) + (user.social ?? 40) + (user.empathy ?? 70) + (user.charisma ?? 50) + (user.leadership ?? 60)) / 10) : 60;
  
  let grade = 'C';
  if (avgScore >= 85) grade = 'A+';
  else if (avgScore >= 75) grade = 'A';
  else if (avgScore >= 65) grade = 'B+';
  else if (avgScore >= 55) grade = 'B';
  else if (avgScore >= 45) grade = 'C+';

  const consistencyPrediction = Math.min(99, Math.round((user?.consistency ?? 45) * 0.8 + (user?.streak ?? 1) * 2));

  // Dynamic Strengths mapping
  const strengthsList = [
    { name: language === 'ar' ? 'التركيز' : 'Focus', val: user?.focus ?? 85, color: 'bg-brand-primary' },
    { name: language === 'ar' ? 'الانضباط' : 'Discipline', val: user?.discipline ?? 48, color: 'bg-emerald-500' },
    { name: language === 'ar' ? 'الاتساق' : 'Consistency', val: user?.consistency ?? 45, color: 'bg-indigo-500' },
    { name: language === 'ar' ? 'تقدير الذات' : 'Self Worth', val: user?.selfWorth ?? 55, color: 'bg-rose-500' },
    { name: language === 'ar' ? 'الذكاء العاطفي' : 'EQ', val: user?.emotional ?? 75, color: 'bg-amber-500' },
  ].sort((a, b) => b.val - a.val);

  const categoryComparisonData = [
    { name: 'DNA', val: user?.confidence ?? 65 },
    { name: 'EQ', val: user?.emotional ?? 75 },
    { name: 'Soc', val: user?.social ?? 40 },
    { name: 'Hab', val: user?.discipline ?? 48 },
  ];

  const currentStability = user ? Math.round(((user.focus ?? 85) + (user.discipline ?? 48) + (user.emotional ?? 75)) / 3) : 92;
  const nextTargetStability = currentStability >= 95 ? 100 : 95;

  return (
    <div className="pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
            <TrendingUp size={20} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase ">
            {language === 'ar' ? 'سرعة النمو' : 'GROWTH VELOCITY'}
          </h1>
        </div>
        <p className="text-slate-400 font-medium max-w-2xl">
          {language === 'ar' 
            ? 'قياس معدل تطورك عبر جميع المقاييس العصبية والسلوكية لتوقع مسار النجاح.'
            : 'Measure your rate of evolution across all neural and behavioral metrics to predict your success trajectory.'}
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="glass-card p-8">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{language === 'ar' ? 'مؤشر الزخم' : 'MOMENTUM INDEX'}</h3>
                <div className="text-right">
                   <p className="text-2xl font-black text-emerald-400 ">+{momentum}%</p>
                   <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{language === 'ar' ? 'نمو شهري' : 'MONTHLY GROWTH'}</p>
                </div>
             </div>
             
             <div className="h-64 w-full min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '10px' }}
                       itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#velocityGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
             <div className="glass-card p-8 flex flex-col justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">{language === 'ar' ? 'توقع الأداء' : 'PERFORMANCE PREDICTION'}</h3>
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 flex items-center justify-center">
                      <span className="text-xl font-black text-white ">{grade}</span>
                   </div>
                   <div>
                      <p className="text-xs font-bold text-white uppercase mb-1">{language === 'ar' ? 'مسار النمو المتوقع' : 'EXPECTED GROWTH TRAJECTORY'}</p>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest leading-relaxed">
                        {language === 'ar' 
                          ? `أداء متسق متوقع بنسبة ${consistencyPrediction}٪ للشهر القادم.` 
                          : `${consistencyPrediction}% consistent performance predicted for next month.`}
                      </p>
                   </div>
                </div>
             </div>
             
             <div className="glass-card p-8 flex flex-col justify-between">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4">{language === 'ar' ? 'نقاط القوة النشطة' : 'ACTIVE STRENGTHS'}</h3>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Zap size={12} className="text-brand-primary" />
                         <span className="text-[10px] font-bold text-white uppercase">{strengthsList[0].name}</span>
                      </div>
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary" style={{ width: `${strengthsList[0].val}%` }} />
                      </div>
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Activity size={12} className="text-emerald-500" />
                         <span className="text-[10px] font-bold text-white uppercase">{strengthsList[1].name}</span>
                      </div>
                      <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${strengthsList[1].val}%` }} />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-8 bg-white/5">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">{language === 'ar' ? 'مقارنة الفئات' : 'CATEGORY COMPARISON'}</h3>
             <div className="h-64 w-full min-w-0 min-h-0">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                   <BarChart data={categoryComparisonData}>
                      <Bar dataKey="val">
                         {categoryComparisonData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#ffffff10'} />
                         ))}
                      </Bar>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 8, fontWeight: 900 }} />
                      <YAxis hide />
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </div>
          
          <div className="glass-card p-8 border-brand-primary/20">
             <div className="flex items-center gap-3 mb-6">
                <Target size={20} className="text-brand-primary" />
                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{language === 'ar' ? 'الهدف القادم' : 'NEXT TARGET'}</h4>
             </div>
             <h2 className="text-xl font-bold text-white uppercase  mb-4 leading-tight">
                {language === 'ar' ? `الوصول لنسبة استقرار ${nextTargetStability}٪` : `REACH ${nextTargetStability}% STABILITY INDEX`}
             </h2>
             <button 
               onClick={() => navigate('/tests')}
               className="w-full py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all"
             >
                {language === 'ar' ? 'ابدأ الفحص والتقييم' : 'START AUDIT & PROCESS'}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
