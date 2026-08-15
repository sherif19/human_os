import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  Brain, 
  User, 
  Target, 
  Zap, 
  Heart, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  Activity, 
  Flame, 
  Bot, 
  Compass, 
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { getAICoaching } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { useAuth } from '../hooks/useAuth';
import { analyzePersonality, getDynamicStability } from '../lib/personalityAnalyzer';

const coachModes = [
  { name: 'Wise Mentor', nameAr: 'حكيم هومان', icon: Brain, description: 'Strategic & philosophical', descAr: 'استراتيجي وفلسفي عميق' },
  { name: 'Tough Coach', nameAr: 'مدرب النواة الصلبة', icon: Target, description: 'Direct & results-driven', descAr: 'صارم ومباشر ويركز على النتائج' },
  { name: 'Warm Therapist', nameAr: 'معالج نفسي ودود', icon: Heart, description: 'Empathetic & validating', descAr: 'متعاطف ودعم نفسي متزن' },
  { name: 'Productivity Expert', nameAr: 'خبير الإنتاجية الفائقة', icon: Zap, description: 'Systems & focus', descAr: 'أنظمة إدارة الوقت والتركيز' },
  { name: 'Best Friend', nameAr: 'صديق استراتيجي', icon: User, description: 'Relatable & loyal', descAr: 'صديق مقرب يفهم دوافعك' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function AICoach() {
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState(coachModes[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const profile = analyzePersonality(user);
  const stabilityVal = getDynamicStability(user);

  // Dynamic Prompt Suggestions
  const promptSuggestions = language === 'ar' ? [
    `كيف أنفذ بروتوكول ${user?.protocol01Ar || 'التوقف لـ 10 ثوانٍ'}؟`,
    `حلل نمطي الذهني (${profile.archetypeAr || profile.archetype})`,
    `كيف أرفع انضباطي العصبي إلى 90%؟`,
    `صمم لي جدول تركيز يناسب محركي الأساسي`
  ] : [
    `How to execute my 10s pause protocol?`,
    `Analyze my archetype (${profile.archetype})`,
    `How to boost my neural discipline to 90%?`,
    `Design a focus schedule for my core driver`
  ];

  // Initialize welcome message dynamically
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeContent = language === 'ar'
        ? `أهلاً بك يا ${user?.name || 'صديقي'}.\nأنا معك الآن كـ **${coachModes.find(m => m.name === activeMode)?.nameAr}**، ومربوط مباشرةً بملفك النفسي والعصبي (${profile.archetypeAr || profile.archetype}).\n\nتحدث معي براحتك في أي موضوع أو تحدٍ تشعر به، وسنتناقش بشكل مباشر ومخصص لك.`
        : `Welcome ${user?.name || 'my friend'}.\nI am synced with your profile as **${activeMode}** (${profile.archetype}).\n\nFeel free to talk about any goal or challenge, and we will discuss it dynamically.`;

      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: welcomeContent,
          timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [user, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = (customMessage || input).trim();
    if (!textToSend || isLoading) return;

    if (!customMessage) setInput('');

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const personalityData = {
        name: user?.name || 'المستخدم',
        archetype: profile.archetype,
        archetypeAr: profile.archetypeAr || profile.archetype,
        primaryDriver: profile.primaryDriver,
        primaryDriverAr: profile.primaryDriverAr || profile.primaryDriver,
        stability: stabilityVal,
        anxiety: user?.anxiety ?? 12,
        diagnosticFocus: user?.diagnosticFocus ?? 88,
        confidence: user?.confidence ?? 65,
        discipline: user?.discipline ?? 48,
        emotional: user?.emotional ?? 75,
        charisma: user?.charisma ?? 50,
        leadership: user?.leadership ?? 60,
        consistency: user?.consistency ?? 45,
        focus: user?.focus ?? 85,
        social: user?.social ?? 40,
        selfWorth: user?.selfWorth ?? 55,
        empathy: user?.empathy ?? 70,
        strengths: user?.strengthsAr || user?.strengths || 'تخطيط الأنظمة المعقدة, التركيز الشديد',
        weaknesses: user?.weaknessesAr || user?.weaknesses || 'العفوية التكتيكية, التزامن العاطفي',
        protocol01: user?.protocol01Ar || user?.protocol01 || 'نفذ توقفاً لمدة 10 ثوانٍ أثناء النزاع',
        protocol02: user?.protocol02Ar || user?.protocol02 || 'سجل الأفكار في السجل العصبي فوراً',
        growthProtocol: user?.growthProtocolAr || user?.growthProtocol || 'تركيز المرحلة الأولى على السيولة الاجتماعية'
      };

      // PASS THE CONVERSATION HISTORY MEMORY TO THE SERVER (up to last 10 turns)
      const memory = updatedMessages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');
      const responseText = await getAICoaching(textToSend, activeMode, memory, personalityData, adminId);

      const aiMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: `msg-${Date.now() + 2}`,
        role: 'assistant',
        content: language === 'ar'
          ? 'عذراً، حدث انقطاع مؤقت في الاتصال. حاول إرسال رسالتك مرة أخرى.'
          : 'Sorry, connection interrupted temporarily. Please retry.',
        timestamp: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking === id) {
        window.speechSynthesis.cancel();
        setIsSpeaking(null);
      } else {
        window.speechSynthesis.cancel();
        const cleanText = text.replace(/[#*`_~]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US';
        utterance.onend = () => setIsSpeaking(null);
        utterance.onerror = () => setIsSpeaking(null);
        setIsSpeaking(id);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleResetChat = () => {
    if (!window.confirm(language === 'ar' ? 'هل ترغب في بدء محادثة جديدة وتصفية الذاكرة؟' : 'Start a fresh conversation?')) return;
    window.speechSynthesis?.cancel();
    setIsSpeaking(null);
    setMessages([]);
  };

  return (
    <div className="w-full flex flex-col gap-2.5 text-slate-100 h-[calc(100vh-110px)] max-h-[calc(100vh-110px)] overflow-hidden">
      
      {/* 🌟 SLEEK TOP USER HEADER BAR */}
      <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-brand-primary/20 backdrop-blur-xl flex items-center justify-between gap-3 shadow-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Bot size={18} className="animate-pulse" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs md:text-sm font-bold text-white tracking-tight">
              {user?.name || 'المستكشف'}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-brand-primary/20 text-brand-primary font-bold border border-brand-primary/30">
              🧬 {profile.archetypeAr || profile.archetype}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1">
              <Activity size={10} />
              <span>استقرار {stabilityVal}%</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowProfileDrawer(!showProfileDrawer)}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 shrink-0"
        >
          <Compass size={13} className="text-brand-primary" />
          <span>{showProfileDrawer ? (language === 'ar' ? 'إخفاء الملف' : 'Hide DNA') : (language === 'ar' ? 'ملفك العصبي' : 'Profile DNA')}</span>
        </button>
      </div>

      {/* 📊 COLLAPSIBLE PROFILE DRAWER */}
      <AnimatePresence>
        {showProfileDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden shrink-0"
          >
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="font-bold text-brand-primary mb-1 flex items-center gap-1.5">
                  <Brain size={14} />
                  <span>{language === 'ar' ? 'المحرك الأساسي' : 'Primary Driver'}</span>
                </div>
                <p className="text-slate-300 font-medium">{profile.primaryDriverAr || profile.primaryDriver}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <Zap size={14} />
                  <span>{language === 'ar' ? 'نقاط القوة' : 'Strengths'}</span>
                </div>
                <p className="text-slate-300 font-medium">{user?.strengthsAr || user?.strengths || 'التركيز الشديد، التخطيط العميق'}</p>
              </div>

              <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Target size={14} />
                  <span>{language === 'ar' ? 'البروتوكول الرئيسي' : 'Primary Protocol'}</span>
                </div>
                <p className="text-slate-300 font-medium">{user?.protocol01Ar || user?.protocol01 || 'التوقف لمدة 10 ثوانٍ عند المواجهة'}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PERSONA SELECTION STRIP */}
      <div className="px-3 py-2 rounded-xl bg-slate-950/70 border border-white/10 flex items-center justify-between gap-2 overflow-x-auto shrink-0 no-scrollbar">
        <div className="flex items-center gap-1.5 w-full overflow-x-auto no-scrollbar">
          {coachModes.map((mode) => {
            const isActive = activeMode === mode.name;
            const ModeIcon = mode.icon;
            return (
              <button
                key={mode.name}
                onClick={() => setActiveMode(mode.name)}
                className={cn(
                  "px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 border text-xs font-semibold",
                  isActive
                    ? "bg-gradient-to-r from-brand-primary to-indigo-600 border-brand-primary/60 text-white shadow-md shadow-brand-primary/20"
                    : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <ModeIcon size={14} />
                <span>{language === 'ar' ? mode.nameAr : mode.name}</span>
              </button>
            );
          })}
        </div>

        {messages.length > 1 && (
          <button
            onClick={handleResetChat}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all text-xs flex items-center gap-1.5 shrink-0 border border-white/10"
            title={language === 'ar' ? 'بدء محادثة جديدة' : 'Reset Conversation'}
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">{language === 'ar' ? 'محادثة جديدة' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* MAIN CHAT WINDOW CONTAINER */}
      <div className="flex-1 min-h-0 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* MESSAGES TRAJECTORY WITH PERFECT RTL ALIGNMENT & SCROLLBAR */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 border-b border-white/5">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "flex items-start gap-2.5 w-full",
                    isUser
                      ? (isRTL ? "justify-start flex-row" : "justify-end flex-row")
                      : (isRTL ? "justify-end flex-row" : "justify-start flex-row")
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border transition-all mt-1 text-xs font-bold shadow-sm",
                    isUser 
                      ? "bg-gradient-to-tr from-brand-primary to-indigo-600 border-brand-primary/40 text-white" 
                      : "bg-slate-900 border-white/15 text-cyan-400"
                  )}>
                    {isUser ? <User size={14} /> : <Brain size={14} />}
                  </div>

                  {/* Message Content Bubble */}
                  <div className={cn(
                    "flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] md:max-w-[65%]",
                    isUser ? "items-start" : "items-end"
                  )}>
                    <div className={cn(
                      "p-3.5 rounded-2xl text-xs md:text-sm font-normal leading-relaxed relative shadow-md backdrop-blur-md",
                      isUser 
                        ? "bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 text-white rounded-tr-none shadow-indigo-500/20" 
                        : "bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none shadow-black/40"
                    )}>
                      {!isUser ? (
                        <div className="prose prose-invert max-w-none text-xs md:text-sm leading-relaxed prose-p:my-1 prose-p:leading-relaxed prose-strong:text-cyan-300 prose-strong:font-bold prose-ul:my-1 prose-li:my-0.5 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-amber-300">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      )}

                      {/* Action buttons for assistant messages */}
                      {!isUser && (
                        <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-white/10 justify-end text-slate-400">
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                            title={language === 'ar' ? 'نسخ النص' : 'Copy'}
                          >
                            {copiedId === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                            <span>{copiedId === msg.id ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-500 font-medium px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Thinking / Typing indicator */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-2.5 items-center w-full", isRTL ? "justify-end flex-row" : "justify-start flex-row")}
            >
              <div className="w-7 h-7 rounded-lg bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-cyan-400">
                <Cpu size={14} className="animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                <span className="text-[11px] text-slate-400">
                  {language === 'ar' ? 'يكتب إجابته...' : 'Thinking...'}
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* DYNAMIC PROMPT SUGGESTION CHIPS */}
        {messages.length < 5 && (
          <div className="px-3 py-1.5 border-t border-white/5 bg-slate-950/60 overflow-x-auto flex gap-1.5 no-scrollbar">
            {promptSuggestions.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-brand-primary/20 border border-white/10 text-[11px] font-normal text-slate-300 hover:text-white transition-all whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Sparkles size={11} className="text-amber-400" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* INPUT BAR */}
        <div className="p-3 border-t border-white/10 bg-slate-950/95 backdrop-blur-md">
          <div className="relative flex items-center">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={language === 'ar' ? 'اكتب رسالتك للمدرب واستشره بحرية...' : 'Type your message...'}
              rows={1}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-10 py-3 focus:outline-none focus:border-brand-primary focus:bg-white/10 transition-all text-white font-normal resize-none min-h-[42px] max-h-[120px] text-xs md:text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className={cn(
                "absolute right-2 p-2 rounded-lg transition-all",
                input.trim() && !isLoading
                  ? "bg-brand-primary text-white hover:brightness-110 shadow-md shadow-brand-primary/20"
                  : "bg-white/5 text-slate-600 cursor-not-allowed"
              )}
            >
              <Send className={cn("w-4 h-4", isRTL && "rotate-180")} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
