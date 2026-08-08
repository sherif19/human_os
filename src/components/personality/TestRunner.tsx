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

  const isLastStep = currentStep === questions.length - 1;
  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center justify-between mb-12">
        <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
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
                "p-6 rounded-2xl border text-left transition-all group",
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
            className="px-8 py-3 rounded-xl font-bold text-slate-500 hover:text-white disabled:opacity-0 transition-all uppercase tracking-widest text-[10px]"
          >
            {language === 'ar' ? 'السابق' : 'Previous'}
          </button>
          {isLastStep && answers[currentStep] ? (
            <button
              onClick={() => onComplete(answers)}
              className="px-10 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 shadow-2xl shadow-brand-primary/40 hover:scale-105 active:scale-95 transition-all"
            >
              {language === 'ar' ? 'حساب نتائج الحمض النووي' : 'Calculate Results DNA'}
              <Sparkles className="w-4 h-4" />
            </button>
          ) : (
            <button
              disabled={!answers[currentStep]}
              onClick={() => setCurrentStep(prev => prev + 1)}
              className="px-8 py-3 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-50 uppercase tracking-widest text-[10px]"
            >
              {language === 'ar' ? 'السؤال التالي' : 'Next Question'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
