import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Brain, 
  ShieldCheck, 
  MessageSquareMore,
  User,
  Target,
  Zap,
  Heart,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { getAICoaching } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { useAuth } from '../hooks/useAuth';
import { analyzePersonality, getDynamicStability } from '../lib/personalityAnalyzer';

const coachModes = [
  { name: 'Warm Therapist', nameAr: 'معالج ودود', icon: Heart, description: 'Empathetic & validating', descAr: 'متعاطف وداعم' },
  { name: 'Tough Coach', nameAr: 'مدرب صارم', icon: Target, description: 'Direct & results-driven', descAr: 'مباشر ويركز على النتائج' },
  { name: 'Wise Mentor', nameAr: 'mentor حكيم', icon: Brain, description: 'Strategic & philosophical', descAr: 'استراتيجي وفلسفي' },
  { name: 'Best Friend', nameAr: 'صديق مقرب', icon: User, description: 'Relatable & loyal', descAr: 'ودود ومخلص' },
  { name: 'Productivity Expert', nameAr: 'خبير إنتاجية', icon: Zap, description: 'Systems & focus', descAr: 'أنظمة وتركيز' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AICoach() {
  const { language, isRTL } = { language: useLanguage().language, isRTL: useLanguage().isRTL };
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState(coachModes[2].name);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Load welcome message dynamically when user state loads
  useEffect(() => {
    if (messages.length === 0) {
      const profile = analyzePersonality(user);
      const stabilityVal = getDynamicStability(user);
      
      const welcomeMessage = language === 'ar'
        ? `# أهلاً بك من جديد، ${user?.name || 'أيها المستكشف'}.\nلقد قمت بمراجعة بيانات نموك الأخيرة كنموذج **${profile.archetypeAr || profile.archetype}**. استقرارك العصبي الحالي يقدر بـ **${stabilityVal}%**.\n\nكيف يمكنني مساعدتك في تطوير وتحسين قدراتك اليوم؟`
        : `# Welcome back, ${user?.name || 'Explorer'}.\nI have reviewed your recent growth data. As **${profile.archetype}** with a stability of **${stabilityVal}%**, I am ready to sync.\n\nHow can I assist your optimization today?`;
      
      setMessages([
        { role: 'assistant', content: welcomeMessage }
      ]);
    }
  }, [user, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const profile = analyzePersonality(user);
      const stabilityVal = getDynamicStability(user);
      
      const lowestMetricName = user
        ? Object.entries({
            focus: user.focus ?? 85,
            discipline: user.discipline ?? 48,
            consistency: user.consistency ?? 45,
            empathy: user.empathy ?? 70,
            social: user.social ?? 40,
            confidence: user.confidence ?? 65
          }).sort((a, b) => a[1] - b[1])[0][0]
        : 'consistency';

      const dynamicPersonality = {
        archetype: profile.archetype,
        primaryDriver: profile.primaryDriver,
        stability: stabilityVal,
        lowestMetric: lowestMetricName,
        focus: user?.focus ?? 85,
        discipline: user?.discipline ?? 48,
        consistency: user?.consistency ?? 45,
        empathy: user?.empathy ?? 70,
        social: user?.social ?? 40,
        confidence: user?.confidence ?? 65,
      };

      const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');
      const response = await getAICoaching(userMessage, activeMode, [], dynamicPersonality, adminId);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: language === 'ar' ? 'واجهت خطأ في المزامنة. يرجى التحقق من اتصالك.' : "I encountered a synchronization error. Please check your network context." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col lg:flex-row gap-8">
      {/* Left Chat Area */}
      <div className="flex-1 glass-card p-0 flex flex-col relative overflow-hidden bg-bg-sidebar/30">
        {/* Chat Header */}
        <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-bg-sidebar/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-brand-primary to-indigo-400 flex items-center justify-center shrink-0 shadow-lg shadow-brand-primary/20 relative">
              <div className="absolute inset-0 border border-white/20 rounded-xl md:rounded-2xl" />
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div>
              <h4 className="text-sm md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {t('neural_interface')} 
                <span className="text-[8px] md:text-[10px] bg-brand-primary/20 border border-brand-primary/30 px-1.5 py-0.5 rounded text-brand-primary font-black uppercase tracking-widest">{t('status_active')}</span>
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
                {language === 'ar' ? coachModes.find(m => m.name === activeMode)?.nameAr : activeMode} {language === 'ar' ? 'وحدة' : 'Module'}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-10 no-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "flex gap-3 md:gap-6 max-w-[90%] md:max-w-4xl",
                msg.role === 'user' ? (isRTL ? "mr-auto flex-row" : "ml-auto flex-row-reverse") : (isRTL ? "ml-auto flex-row-reverse" : "mr-auto")
              )}
            >
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl shrink-0 flex items-center justify-center border transition-all",
                msg.role === 'user' ? "bg-white/5 border-white/10" : "bg-brand-primary/10 border-brand-primary/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
              )}>
                {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5 text-slate-400" /> : <Brain className="w-4 h-4 md:w-5 md:h-5 text-brand-primary" />}
              </div>
              <div className={cn(
                "p-4 md:p-6 rounded-2xl md:rounded-3xl text-xs md:text-sm font-medium leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-brand-primary text-white rounded-tr-none shadow-brand-primary/20" 
                  : "bg-white/5 border border-white/5 text-slate-300 rounded-tl-none prose prose-invert max-w-none shadow-xl shadow-black/20"
              )}>
                {msg.role === 'assistant' ? (
                   <div className="prose-h1:text-white prose-h1:text-lg md:prose-h1:text-xl prose-h1:font-black prose-h1:mb-4 prose-h1:tracking-tight prose-strong:text-brand-primary prose-strong:font-bold">
                    <ReactMarkdown>
                      {msg.content}
                    </ReactMarkdown>
                   </div>
                ) : (
                  msg.content
                )}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <div className={cn("flex gap-3 md:gap-6", isRTL ? "ml-auto flex-row-reverse" : "mr-auto")}>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 rounded-tl-none flex gap-1.5 items-center">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-brand-primary rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-white/5 bg-bg-sidebar/50 backdrop-blur-md">
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={t('signal_thought')}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl pl-6 pr-14 py-3 md:py-4 focus:outline-none focus:border-brand-primary/50 focus:bg-white/10 transition-all text-white font-medium resize-none min-h-[48px] md:min-h-[56px] max-h-[200px] text-xs md:text-sm"
            />
            <button 
              onClick={handleSend}
              className={cn(
                "absolute right-3 bottom-2 md:bottom-2.5 p-2 md:p-2.5 rounded-lg md:rounded-xl transition-all",
                input.trim() ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:brightness-110" : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              <Send className={cn("w-4 h-4 md:w-5 md:h-5", isRTL && "rotate-180")} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Context & Modes */}
      <div className="w-full lg:w-80 space-y-4 md:space-y-6">
        <div className="glass-card">
          <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4 md:mb-6 flex items-center gap-2">
            <MessageSquareMore className="w-4 h-4 text-brand-primary" />
            {t('coach_interface')}
          </h4>
          <div className="space-y-2">
            {coachModes.map((mode) => (
              <button
                key={mode.name}
                onClick={() => setActiveMode(mode.name)}
                className={cn(
                  "w-full p-3 md:p-4 rounded-2xl md:rounded-3xl flex items-center gap-3 md:gap-4 transition-all border text-left",
                  activeMode === mode.name 
                    ? "bg-brand-primary/10 border-brand-primary/30 text-white" 
                    : "bg-white/5 border-transparent text-slate-500 hover:bg-white/10"
                )}
              >
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center transition-colors",
                  activeMode === mode.name ? "bg-brand-primary text-white" : "bg-white/5 text-slate-600"
                )}>
                  <mode.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold tracking-tight">{language === 'ar' ? mode.nameAr : mode.name}</p>
                  <p className="text-[8px] md:text-[10px] opacity-60 font-bold uppercase tracking-wider">{language === 'ar' ? mode.descAr : mode.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Professional Support Info */}
        <div className="glass-card bg-brand-primary/5 border-brand-primary/20">
          <div className="flex items-center gap-2 text-brand-primary mb-4">
             <ShieldCheck className="w-4 h-4" />
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{t('professional_support')}</h4>
          </div>
          <p className="text-[10px] md:text-[11px] text-slate-500 leading-relaxed font-medium mb-4">
            {t('crisis_info')}
          </p>
          <div className="space-y-2">
             <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{t('improve_life')}</span>
                <ArrowRight className={cn("w-3 h-3 text-brand-primary", isRTL && "rotate-180")} />
             </div>
             <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">{t('dealing_with_anxiety')}</span>
                <ArrowRight className={cn("w-3 h-3 text-brand-primary", isRTL && "rotate-180")} />
             </div>
          </div>
        </div>

        <div className="glass-card border-amber-500/10">
           <div className="flex items-center gap-2 text-amber-500 mb-4">
              <ShieldAlert className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">{t('safety_alert')}</h4>
           </div>
           <p className="text-[10px] md:text-[11px] text-slate-500 font-medium">
             {t('encryption_notice')}
           </p>
        </div>
      </div>
    </div>
  );
}
