import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  MessageSquareMore, 
  Zap, 
  Target,
  ChevronRight,
  Flag,
  UserPlus,
  ArrowUpRight,
  Sparkles,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../hooks/useAuth';

export default function SocialIntelligence() {
  const { language, isRTL } = { language: useLanguage().language, isRTL: useLanguage().isRTL };
  const { user, updateUser } = useAuth();

  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanScore, setScanScore] = useState<number | null>(null);

  // Charisma profile local state
  const [socialHours, setSocialHours] = useState('4');
  const [socialBattery, setSocialBattery] = useState('70');

  // Dynamic Metrics
  const confidence = user?.confidence ?? 65;
  const empathy = user?.empathy ?? 70;
  const influence = Math.round(((user?.charisma ?? 50) + (user?.social ?? 40)) / 2);

  // Dynamic network stats
  const totalConnections = 100 + (user?.charisma ?? 50) + (user?.social ?? 40);
  const activeConflicts = Math.max(0, Math.round((100 - (user?.stability ?? 90)) / 10));

  // Determine lowest metric to provide custom social script
  const lowestMetric = Object.entries({
    confidence: confidence,
    empathy: empathy,
    social: user?.social ?? 40
  }).sort((a, b) => a[1] - b[1])[0][0];

  const getCustomScript = () => {
    if (lowestMetric === 'confidence') {
      return {
        title: language === 'ar' ? 'بروتوكول وضع الحدود' : 'Boundary Assertion Protocol',
        desc: language === 'ar' 
          ? '"أفهم وجهة نظرك وأقدر جهدك، ولكنني بحاجة إلى التركيز على تسليم مهامي الحالية أولاً للالتزام بالجدول الزمني."' 
          : '"I understand your perspective and appreciate the effort, but I need to focus on delivering my current tasks first to keep the timeline on track."',
      };
    } else if (lowestMetric === 'empathy') {
      return {
        title: language === 'ar' ? 'بروتوكول الدعم النشط' : 'Active Support Protocol',
        desc: language === 'ar'
          ? '"يبدو أن هذا الموقف سبب لك ضغطاً كبيراً. كيف يمكنني مساعدتك أو تخفيف الحمل عنك في هذه المرحلة؟"'
          : '"It sounds like this situation has caused you a lot of pressure. How can I best help or lighten the load for you at this stage?"',
      };
    } else {
      return {
        title: language === 'ar' ? 'بروتوكول الوضوح والاتساق' : 'Clarity & Alignment Protocol',
        desc: language === 'ar'
          ? '"دعنا نتفق على بروتوكول اتصال واضح ونقاط فحص أسبوعية لضمان استقرار العمل وتجنب سوء الفهم."'
          : '"Let\'s align on a clear communication protocol and weekly check-ins to ensure workflow stability and avoid misunderstandings."',
      };
    }
  };

  const currentScript = getCustomScript();

  // Run Analyzer Scan
  const handleScan = () => {
    if (!inputText.trim() && activeTool !== 'charisma') return;
    setIsScanning(true);
    setScanResult(null);

    setTimeout(async () => {
      setIsScanning(false);
      
      if (activeTool === 'conversation') {
        const text = inputText.toLowerCase();
        if (/(shutup|shut up|idiot|hate|worst|lazy|always|never|غبي|اخرس|أكره|سيء|دائما|أبدا)/i.test(text)) {
          setScanResult(language === 'ar' 
            ? 'مستوى خطورة عالٍ: تم رصد نبرة هجومية/تلاعب. نوصي بتطبيق بروتوكول التوقف لمدة 10 ثوانٍ وعدم التصعيد.' 
            : 'High Risk: Aggressive/manipulative tone detected. Recommend executing the 10s pause protocol and avoiding escalation.');
          setScanScore(35);
        } else if (/(sorry|apologize|please|kindly|thank|appreciate|ممتن|شكرا|آسف|أعتذر|لطفا)/i.test(text)) {
          setScanResult(language === 'ar'
            ? 'مستوى خطورة منخفض: تم رصد نبرة تعاونية ومحترمة. توافق اجتماعي ممتاز.'
            : 'Low Risk: Cooperative, polite tone detected. Excellent social alignment.');
          setScanScore(88);
        } else if (/(buy|deal|price|offer|contract|sell|صفقة|سعر|عقد|شراء|بيع)/i.test(text)) {
          setScanResult(language === 'ar'
            ? 'سياق تجاري/تفاوضي: نبرة موضوعية وعملية. حافظ على ثباتك ولا تقدم تنازلات متسرعة.'
            : 'Commercial/Negotiation Context: Objective, transactional tone. Maintain logic and avoid hasty concessions.');
          setScanScore(72);
        } else {
          setScanResult(language === 'ar'
            ? 'تفاعل متزن: النبرة محايدة. استمر في البناء على هذا الأساس.'
            : 'Balanced Interaction: Tone is neutral. Continue building on this foundation.');
          setScanScore(65);
        }
      } 
      
      else if (activeTool === 'redflag') {
        const text = inputText.toLowerCase();
        if (/(crazy|delusional|imagined|fault|blame|exaggerating|مجنون|تتخيل|غلطتك|تخريف|مبالغة)/i.test(text)) {
          setScanResult(language === 'ar'
            ? 'تنبيه أحمر: تم اكتشاف محاولة إنكار للواقع (Gaslighting). لا تدخل في جدال لإثبات الحقيقة؛ ضع حدوداً صارمة.'
            : 'Red Flag Alert: Gaslighting pattern detected. Do not argue to prove your reality; set absolute boundaries.');
          setScanScore(20);
        } else {
          setScanResult(language === 'ar'
            ? 'لم يتم العثور على مؤشرات تلاعب قوية. يبدو التواصل طبيعياً.'
            : 'No strong manipulation indicators found. Communication appears safe.');
          setScanScore(80);
        }
      } 
      
      else if (activeTool === 'charisma') {
        const hours = parseFloat(socialHours) || 0;
        const batt = parseFloat(socialBattery) || 100;
        const drainRate = Math.round((hours * 15) * (1 - (batt / 100)));
        
        setScanResult(language === 'ar'
          ? `معدل استهلاك الطاقة الاجتماعية: ${drainRate} نقطة/ساعة. نوصي بفترات عزلة تعافي لا تقل عن ساعتين اليوم.`
          : `Social battery drain rate computed at ${drainRate} pts/hr. Recommend at least 2 hours of isolation recovery today.`);
        setScanScore(Math.max(10, 100 - drainRate));
      }

      // Update social/empathy score slightly in Firestore
      if (user) {
        const currentSocial = user.social ?? 40;
        const currentEmpathy = user.empathy ?? 70;
        await updateUser({
          social: Math.min(100, currentSocial + 1),
          empathy: Math.min(100, currentEmpathy + 1)
        });
      }

    }, 2000);
  };

  const labels = {
    en: {
      layer: 'Social Intelligence Layer',
      title: 'Social Dynamic',
      subtitle: 'Strategic communication analysis and relationship optimization.',
      coach: 'AI Comm Coach',
      analyzer: 'Context Analyzer',
      connection: 'Conversation Analysis',
      connection_desc: 'Paste chat logs to detect tone and intent.',
      red_flag: 'Red Flag Detection',
      red_flag_desc: 'Identify psychological manipulation patterns.',
      conflict: 'Charisma Calculator',
      conflict_desc: 'Analyze social battery depletion and charge.',
      charisma: 'Dynamic Social Scripts',
      charisma_desc: 'Context-specific scripts based on personal profile.',
      metrics: 'Social Intelligence Metrics',
      active_contexts: 'Active Contexts',
      recommendation: 'Neural Social Recommendation',
      reco_desc: 'Your recent interactions show high alignment. Keep stabilizing communication.',
      strategy: 'Sync Social Parameters',
      network: 'Network Stats',
      total_connections: 'Total Connections',
      active_conflicts: 'Active Conflicts',
      strat_alert: 'Strategy alert',
      quote: '"True power in social dynamics comes from the ability to remain unmoved by external pressure."',
      scan_btn: 'Run Analysis Scan',
      scanning: 'Scanning Neural Tone...',
      score: 'Alignment Score',
      p_placeholder: 'Paste communication log text here...',
      close: 'Close Workspace',
      hours: 'Social Interaction (Hours)',
      battery: 'Current Social Battery (%)'
    },
    ar: {
      layer: 'طبقة الذكاء الاجتماعي',
      title: 'الديناميكيات الاجتماعية',
      subtitle: 'تحليل التواصل الاستراتيجي وتحسين العلاقات.',
      coach: 'مدرب التواصل الذكي',
      analyzer: 'محلل السياق',
      connection: 'تحليل المحادثة',
      connection_desc: 'الصق سجلات الدردشة لاكتشاف النبرة والقصد.',
      red_flag: 'كشف العلامات الحمراء',
      red_flag_desc: 'تحديد أنماط التلاعب النفسي.',
      conflict: 'حاسبة الكاريزما',
      conflict_desc: 'تحليل استهلاك الطاقة الاجتماعية والشحن.',
      charisma: 'النصوص الاجتماعية التفاعلية',
      charisma_desc: 'نصوص مخصصة للسياقات بناءً على ملفك الشخصي.',
      metrics: 'مقاييس الذكاء الاجتماعي',
      active_contexts: 'السياقات النشطة',
      recommendation: 'توصية اجتماعية عصبية',
      reco_desc: 'تظهر تفاعلاتك الأخيرة توافقاً عالياً. استمر في تثبيت التواصل.',
      strategy: 'مزامنة المعلمات الاجتماعية',
      network: 'إحصائيات الشبكة',
      total_connections: 'إجمالي الاتصالات',
      active_conflicts: 'النزاعات النشطة',
      strat_alert: 'تنبيه الاستراتيجية',
      quote: '"القوة الحقيقية في الديناميكيات الاجتماعية تأتي من القدرة على البقاء غير متأثر بالضغط الخارجي."',
      scan_btn: 'تشغيل خوارزمية الفحص',
      scanning: 'جاري فحص النبرة العصبية...',
      score: 'درجة المواءمة',
      p_placeholder: 'الصق نص سجل المحادثة هنا...',
      close: 'إغلاق مساحة العمل',
      hours: 'مدة التفاعل الاجتماعي (ساعات)',
      battery: 'البطارية الاجتماعية الحالية (%)'
    }
  }[language];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <Users size={16} className="fill-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{labels.layer}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{labels.title}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{labels.subtitle}</p>
        </div>
        
        <div className="flex gap-2">
           <button className="px-5 py-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 hover:bg-brand-primary hover:text-white transition-all">
             <MessageSquareMore size={14} />
             {labels.coach}
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-8">
              <Shield size={20} className="text-indigo-400" />
              {labels.analyzer}
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { id: 'conversation', title: labels.connection, desc: labels.connection_desc, icon: MessageSquareMore },
                { id: 'redflag', title: labels.red_flag, desc: labels.red_flag_desc, icon: Flag },
                { id: 'charisma', title: labels.conflict, desc: labels.conflict_desc, icon: Zap },
              ].map((tool) => (
                <div 
                  key={tool.id} 
                  onClick={() => {
                    setActiveTool(tool.id);
                    setScanResult(null);
                    setScanScore(null);
                    setInputText('');
                  }}
                  className={cn(
                    "p-6 rounded-[2rem] bg-white/5 border border-white/5 hover:border-brand-primary/30 transition-all cursor-pointer group relative",
                    activeTool === tool.id && "border-brand-primary/50 bg-brand-primary/5"
                  )}
                >
                   <tool.icon size={32} className={cn("text-slate-500 mb-4 group-hover:text-brand-primary transition-colors", activeTool === tool.id && "text-brand-primary")} />
                   <h4 className="text-sm font-bold text-white mb-2">{tool.title}</h4>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>

            {/* Interactive Scanning Area */}
            {activeTool && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6 relative overflow-hidden">
                <button 
                  onClick={() => setActiveTool(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>

                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  {activeTool === 'conversation' && labels.connection}
                  {activeTool === 'redflag' && labels.red_flag}
                  {activeTool === 'charisma' && labels.conflict}
                </h4>

                {activeTool !== 'charisma' ? (
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={labels.p_placeholder}
                    className="w-full h-32 bg-white/5 border border-white/5 rounded-xl p-4 text-xs text-white font-medium focus:outline-none focus:border-brand-primary/30 transition-all resize-none placeholder:text-slate-600"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">{labels.hours}</label>
                      <input 
                        type="number"
                        value={socialHours}
                        onChange={(e) => setSocialHours(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-primary/30"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">{labels.battery}</label>
                      <input 
                        type="number"
                        value={socialBattery}
                        onChange={(e) => setSocialBattery(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-primary/30"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <button 
                    onClick={handleScan}
                    disabled={isScanning}
                    className="px-6 py-3 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Search size={14} />
                    {isScanning ? labels.scanning : labels.scan_btn}
                  </button>
                  {isScanning && (
                    <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {scanResult && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} className="text-brand-primary" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <p className="text-xs text-white font-medium leading-relaxed">{scanResult}</p>
                      {scanScore !== null && (
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{labels.score}</span>
                          <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary" style={{ width: `${scanScore}%` }} />
                          </div>
                          <span className="text-xs font-black text-white">{scanScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="glass-card">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8">{labels.metrics}</h3>
             <div className="grid sm:grid-cols-3 gap-6">
                {[
                  { label: "Confidence", labelAr: "الثقة", score: confidence, trend: confidence > 70 ? "+5%" : "-2%" },
                  { label: "Empathy", labelAr: "التعاطف", score: empathy, trend: empathy > 75 ? "+8%" : "+3%" },
                  { label: "Influence", labelAr: "التأثير", score: influence, trend: influence > 60 ? "+12%" : "+4%" },
                ].map((metric) => (
                  <div key={metric.label} className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">{language === 'ar' ? metric.labelAr : metric.label}</p>
                    <div className="text-3xl font-black text-white mb-1">{metric.score}</div>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest",
                      metric.trend.startsWith('+') ? "text-emerald-500" : "text-rose-500"
                    )}>{metric.trend}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Social Script Showcase */}
          <div className="glass-card">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6">{labels.charisma}</h3>
              <div className="p-6 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                <h4 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-3">{currentScript.title}</h4>
                <p className="text-sm text-white font-medium leading-relaxed ">{currentScript.desc}</p>
              </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="glass-card">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center shadow-2xl shadow-brand-primary/20 mb-6 text-white">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 leading-tight">{labels.recommendation}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">{labels.reco_desc}</p>
              <button 
                onClick={async () => {
                  if (user) {
                    await updateUser({
                      social: Math.min(100, (user.social ?? 40) + 3),
                      charisma: Math.min(100, (user.charisma ?? 50) + 3)
                    });
                    alert(language === 'ar' ? 'تمت مزامنة المعلمات الاجتماعية بنجاح!' : 'Social parameters successfully synchronized!');
                  }
                }}
                className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:brightness-110 transition-all"
              >
                {labels.strategy}
              </button>
           </div>
           
           <div className="glass-card">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <UserPlus size={16} className="text-emerald-400" />
                {labels.network}
             </h3>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{labels.total_connections}</span>
                   <span className="text-sm font-bold text-white">{totalConnections}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{labels.active_conflicts}</span>
                   <span className="text-sm font-bold text-rose-500">{activeConflicts}</span>
                </div>
             </div>
           </div>

           <div className="glass-card bg-indigo-500/5 border-indigo-500/20">
             <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                <ArrowUpRight size={16} /> {labels.strat_alert}
             </h4>
             <p className="text-xs text-slate-300 font-medium leading-relaxed ">{labels.quote}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
