import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Zap, 
  RefreshCw, 
  Trophy, 
  Award, 
  Activity, 
  ShieldCheck, 
  Flame, 
  Check,
  RotateCcw
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { TEST_QUESTIONS } from '../../constants/questions';
import { generateAITest } from '../../services/api';

interface QuestionOption {
  value: number;
  label: string;
  labelAr: string;
  icon?: string;
}

interface Question {
  id: string;
  text: string;
  textAr: string;
  imageUrl?: string;
  options: QuestionOption[];
}

interface TestRunnerProps {
  test: { name: string; questions: number; id: string };
  onComplete: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

// Unsplash high quality psychological illustrations map
const TEST_IMAGES: Record<string, string> = {
  'assistant': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
  'daily-ritual': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80',
  'neural-flow': 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1000&q=80',
  'planner': 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1000&q=80',
  'empathy': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=80',
  'shadow': 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
  'confidence': 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  'charisma': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
  'eq': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1000&q=80',
  'discipline': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
  'default': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80'
};

const OPTION_ICONS = ['❌', '⚡', '⚖️', '🎯', '🔥'];

export function TestRunner({ test, onComplete, onCancel }: TestRunnerProps) {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [useAiQuestions, setUseAiQuestions] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Base static questions from predefined database
  const staticQuestions: Question[] = TEST_QUESTIONS[test.id] || [
    {
      id: `q-default-1`,
      text: `How consistently do you audit your psychological efficiency during high-stress situations?`,
      textAr: `ما مدى انتظامك في تدقيق كفاءتك النفسية أثناء مواجهة المواقف عالية الضغوط؟`,
      imageUrl: TEST_IMAGES[test.id] || TEST_IMAGES.default,
      options: [
        { value: 1, label: 'Never', labelAr: 'أبداً (0%)', icon: '❌' },
        { value: 2, label: 'Rarely', labelAr: 'نادراً (25%)', icon: '⚡' },
        { value: 3, label: 'Sometimes', labelAr: 'أحياناً (50%)', icon: '⚖️' },
        { value: 4, label: 'Often', labelAr: 'غالباً (75%)', icon: '🎯' },
        { value: 5, label: 'Always', labelAr: 'دائماً (100%)', icon: '🔥' },
      ]
    }
  ];

  const questions = (useAiQuestions && aiQuestions) ? aiQuestions : staticQuestions;

  const handleGenerateAiTest = async () => {
    setIsAiLoading(true);
    setError(null);
    try {
      const generated = await generateAITest(test.id, test.name);
      if (Array.isArray(generated) && generated.length > 0) {
        setAiQuestions(generated);
        setUseAiQuestions(true);
        setCurrentStep(0);
        setAnswers({});
      }
    } catch (err) {
      console.error("AI Generation error:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOptionSelect = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentStep]: value }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 220);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onComplete(answers);
    } catch (err: any) {
      console.error(err);
      setError(
        language === 'ar'
          ? 'فشل تحليل نتائج التقييم بالذكاء الاصطناعي. يرجى التحقق من اتصال الشبكة.'
          : 'Failed to analyze evaluation results. Please check your connection.'
      );
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === questions.length - 1;
  const currentQuestion = questions[currentStep];

  if (isSubmitting) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-8">
        <div className="relative w-28 h-28 mx-auto">
          <div className="absolute inset-0 rounded-full bg-brand-primary/20 blur-2xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-brand-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-2 rounded-full border border-dashed border-brand-primary/50 animate-spin" style={{ animationDuration: '6s' }} />
          <div className="absolute inset-4 rounded-full bg-slate-900 border border-brand-primary/40 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            {language === 'ar' ? 'جاري تحليل نتائج التقييم العصبي...' : 'Auditing Neural Assessment Results...'}
          </h3>
          <p className="text-xs md:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto font-normal">
            {language === 'ar' 
              ? 'يقوم المحرك الذكي برسم خرائط سلوكك وتحديث النسبة في ملفك الشخصي.' 
              : 'Our neural models are compiling your behavioral diagnosis and updating your DNA index.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-3 md:px-0">
      
      {/* HEADER & TOP CONTROLS */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button 
          onClick={onCancel} 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold"
        >
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          <span>{language === 'ar' ? 'الرجوع للقائمة' : 'Back to Tests'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateAiTest}
            disabled={isAiLoading}
            className={cn(
              "px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-md",
              useAiQuestions 
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300"
                : "bg-brand-primary/10 border-brand-primary/30 text-brand-primary hover:bg-brand-primary/20"
            )}
          >
            <Sparkles className={cn("w-3.5 h-3.5", isAiLoading && "animate-spin")} />
            <span>
              {isAiLoading 
                ? (language === 'ar' ? 'جاري التوليد...' : 'Generating...') 
                : useAiQuestions 
                  ? (language === 'ar' ? 'أسئلة بالذكاء الاصطناعي (نشطة)' : 'AI Questions Active')
                  : (language === 'ar' ? 'توليد أسئلة تفاعلية بالـ AI' : 'Generate AI Scenarios')}
            </span>
          </button>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {language === 'ar' ? 'السؤال' : 'Question'}
            </span>
            <span className="text-sm font-black text-brand-primary">
              {currentStep + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* GLOWING PROGRESS BAR */}
      <div className="h-2 w-full bg-slate-900 rounded-full mb-8 overflow-hidden border border-white/10 relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
          className="h-full bg-gradient-to-r from-brand-primary via-cyan-400 to-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center font-medium space-y-2 mb-6">
          <p>⚠️ {error}</p>
          <button 
            onClick={handleSubmit} 
            className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold transition-all"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      {/* QUESTION CARD CONTAINER WITH ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className="space-y-6"
        >
          {/* IMAGE BANNER IF PRESENT */}
          <div className="relative h-44 md:h-52 w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
            <img 
              src={currentQuestion?.imageUrl || TEST_IMAGES[test.id] || TEST_IMAGES.default} 
              alt="Scenario" 
              className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-brand-primary flex items-center gap-1.5">
                <Brain size={13} />
                <span>{test.name}</span>
              </span>

              {useAiQuestions && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 backdrop-blur-md border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <Sparkles size={11} />
                  <span>AI Dynamic Scenario</span>
                </span>
              )}
            </div>
          </div>

          {/* QUESTION TEXT */}
          <div className="p-4 md:p-6 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-xl">
            <h3 className="text-base md:text-xl font-bold text-white tracking-tight leading-relaxed">
              {language === 'ar' ? currentQuestion.textAr : currentQuestion.text}
            </h3>
          </div>

          {/* INTERACTIVE OPTIONS GRID */}
          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentStep] === opt.value;
              const iconSymbol = opt.icon || OPTION_ICONS[idx % OPTION_ICONS.length];

              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.01, x: isRTL ? -4 : 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleOptionSelect(opt.value)}
                  className={cn(
                    "p-3.5 md:p-4 rounded-xl border text-right transition-all flex items-center justify-between gap-3 shadow-md",
                    isSelected
                      ? "bg-gradient-to-r from-brand-primary via-indigo-600 to-purple-600 border-brand-primary text-white shadow-brand-primary/20 font-bold"
                      : "bg-slate-900/80 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm shrink-0 shadow-inner">
                      {iconSymbol}
                    </span>
                    <span className="text-xs md:text-sm font-semibold">
                      {language === 'ar' ? opt.labelAr : opt.label}
                    </span>
                  </div>

                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                    isSelected ? "bg-white border-white text-brand-primary" : "border-white/20"
                  )}>
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* BOTTOM NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-4 py-2 rounded-lg font-semibold text-slate-400 hover:text-white disabled:opacity-0 transition-all text-xs"
            >
              {language === 'ar' ? '← السؤال السابق' : '← Previous'}
            </button>

            {isLastStep && answers[currentStep] ? (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-indigo-600 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-brand-primary/30 hover:brightness-110 transition-all"
              >
                <span>{language === 'ar' ? 'حساب نتيجة التقييم' : 'Calculate DNA Score'}</span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </motion.button>
            ) : (
              <button
                disabled={!answers[currentStep]}
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-5 py-2 rounded-xl font-semibold text-white bg-white/10 border border-white/15 hover:bg-white/20 disabled:opacity-40 transition-all text-xs"
              >
                {language === 'ar' ? 'السؤال التالي →' : 'Next Question →'}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
