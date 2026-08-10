import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { TEST_QUESTIONS } from '../../constants/questions';

interface Question {
  id: string;
  text: string;
  textAr: string;
  options: { value: number; label: string; labelAr: string }[];
}

interface TestRunnerProps {
  test: { name: string; questions: number; id: string };
  onComplete: (answers: Record<number, number>) => void;
  onCancel: () => void;
}

export function TestRunner({ test, onComplete, onCancel }: TestRunnerProps) {
  const { language, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Retrieve real assessment questions from our database
  const questions: Question[] = TEST_QUESTIONS[test.id] || [
    {
      id: `q-default`,
      text: `Question for ${test.name}: How often do you experience this pattern?`,
      textAr: `السؤال لـ ${test.name}: كم مرة تواجه هذا النمط؟`,
      options: [
        { value: 1, label: 'Never', labelAr: 'أبداً' },
        { value: 2, label: 'Rarely', labelAr: 'نادراً' },
        { value: 3, label: 'Sometimes', labelAr: 'أحياناً' },
        { value: 4, label: 'Often', labelAr: 'غالباً' },
        { value: 5, label: 'Always', labelAr: 'دائماً' },
      ]
    }
  ];

  const handleOptionSelect = (value: number) => {
    setAnswers(prev => ({ ...prev, [currentStep]: value }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 200);
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
          ? 'فشل توليد التقرير بالذكاء الاصطناعي. يرجى التحقق من اتصال الشبكة أو إعدادات مفتاح API الخاص بالمنصة.'
          : 'Failed to generate AI report. Please check your network connection or platform API key settings.'
      );
      setIsSubmitting(false);
    }
  };

  const isLastStep = currentStep === questions.length - 1;

  if (isSubmitting) {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-10" style={{ animation: 'fadeSlide 0.4s ease' }}>
        <div className="relative w-28 h-28 mx-auto">
          {/* Glowing outer aura */}
          <div className="absolute inset-0 rounded-full bg-brand-primary/10 blur-xl animate-pulse" />
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full border-2 border-brand-primary/10 animate-ping" style={{ animationDuration: '2s' }} />
          {/* Inner orbit spin */}
          <div className="absolute inset-2 rounded-full border border-dashed border-brand-primary/40 animate-spin" style={{ animationDuration: '8s' }} />
          {/* Core glow */}
          <div className="absolute inset-4 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-black text-white tracking-tight">
            {language === 'ar' ? 'جاري تحليل البصمة النفسية...' : 'Analyzing Psychological DNA...'}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto font-medium">
            {language === 'ar' 
              ? 'يقوم الذكاء الاصطناعي حالياً برسم خرائط السمات الشخصية وتوليد التقرير السلوكي الخاص بك.' 
              : 'Our neural models are currently auditing your responses and compiling a behavior report.'}
          </p>
        </div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] animate-pulse">
          {language === 'ar' ? 'قد يستغرق هذا الإجراء من 5 لـ 10 ثوانٍ' : 'This may take 5-10 seconds'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className={cn("w-4 h-4", isRTL && "rotate-180")} />
          {language === 'ar' ? 'إلغاء الاختبار' : 'Cancel Test'}
        </button>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{language === 'ar' ? 'تقدم التقييم' : 'Assessment Progress'}</p>
          <p className="text-lg font-black text-white">{currentStep + 1} / {questions.length}</p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-white/5 rounded-full mb-16 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          className="h-full bg-brand-primary shadow-[0_0_15px_rgba(99,102,241,0.5)]"
        />
      </div>

      {error && (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium space-y-4 mb-8">
          <p>⚠️ {error}</p>
          <button 
            onClick={handleSubmit} 
            className="px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            {language === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      )}

      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-12"
      >
        <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
          {language === 'ar' ? questions[currentStep].textAr : questions[currentStep].text}
        </h3>

        <div className="grid gap-4">
          {questions[currentStep].options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleOptionSelect(opt.value)}
              className={cn(
                "p-6 rounded-2xl border text-left transition-all group cursor-pointer",
                answers[currentStep] === opt.value
                  ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20"
                  : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{language === 'ar' ? opt.labelAr : opt.label}</span>
                {answers[currentStep] === opt.value && <CheckCircle2 className="w-6 h-6 text-white" />}
              </div>
            </button>
          ))}
        </div>

        <div className="flex justify-between pt-8">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-all uppercase tracking-widest text-[10px] cursor-pointer"
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </button>
          {isLastStep && answers[currentStep] ? (
            <button
              onClick={handleSubmit}
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-2xl shadow-brand-primary/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {language === 'ar' ? 'حساب نتائج الحمض النووي' : 'Calculate Results DNA'}
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!answers[currentStep]}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-8 py-3 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 uppercase tracking-widest text-[10px] cursor-pointer"
            >
              {language === 'ar' ? 'السؤال التالي' : 'Next Question'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
