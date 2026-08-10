import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Lock, Target, Clock, ChevronRight, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface NeuralTest {
  id: string;
  nameKey: string;
  descKey: string;
  nameEn: string;
  nameAr: string;
  category: string;
  questions: number;
  time: string;
  icon: any;
  status: 'completed' | 'available' | 'locked' | 'new';
}

interface NeuralTestCardProps {
  test: NeuralTest;
  onClick: () => void;
  language: 'ar' | 'en';
  isRTL: boolean;
  simplified?: boolean;
}

export interface CardTheme {
  themeColor: string;
  themeColorRgb: string;
  bgGradient: string;
  borderHover: string;
  iconStyle: string;
  glowColor: string;
  bgAnimType: 'orbit' | 'solar' | 'cyber' | 'radar' | 'heart' | 'shadow' | 'sparks' | 'shield';
}

export const getCardTheme = (id: string): CardTheme => {
  switch (id) {
    case 'assistant':
      return {
        themeColor: '#06b6d4',
        themeColorRgb: '6, 182, 212',
        bgGradient: 'from-cyan-500/10 via-teal-500/5 to-transparent',
        borderHover: 'group-hover:border-cyan-500/30',
        iconStyle: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]',
        bgAnimType: 'orbit'
      };
    case 'daily-ritual':
    case 'discipline':
    case 'habit':
    case 'self-worth':
      return {
        themeColor: '#f59e0b',
        themeColorRgb: '245, 158, 11',
        bgGradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        borderHover: 'group-hover:border-amber-500/30',
        iconStyle: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]',
        bgAnimType: 'solar'
      };
    case 'neural-flow':
    case 'focus':
    case 'growth-velocity':
    case 'dna-sync':
      return {
        themeColor: '#3b82f6',
        themeColorRgb: '59, 130, 246',
        bgGradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
        borderHover: 'group-hover:border-blue-500/30',
        iconStyle: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]',
        bgAnimType: 'cyber'
      };
    case 'planner':
    case 'mission':
    case 'leadership':
      return {
        themeColor: '#6366f1',
        themeColorRgb: '99, 102, 241',
        bgGradient: 'from-indigo-500/10 via-blue-500/5 to-transparent',
        borderHover: 'group-hover:border-indigo-500/30',
        iconStyle: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(99,102,241,0.15)]',
        bgAnimType: 'radar'
      };
    case 'empathy':
    case 'eq':
    case 'trauma':
      return {
        themeColor: '#f43f5e',
        themeColorRgb: '244, 63, 94',
        bgGradient: 'from-rose-500/10 via-pink-500/5 to-transparent',
        borderHover: 'group-hover:border-rose-500/30',
        iconStyle: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(244,63,94,0.15)]',
        bgAnimType: 'heart'
      };
    case 'shadow':
    case 'silence':
    case 'burnout':
      return {
        themeColor: '#a855f7',
        themeColorRgb: '168, 85, 247',
        bgGradient: 'from-purple-500/10 via-indigo-950/10 to-transparent',
        borderHover: 'group-hover:border-purple-500/30',
        iconStyle: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]',
        bgAnimType: 'shadow'
      };
    case 'confidence':
    case 'charisma':
    case 'social-energy':
    case 'communication':
      return {
        themeColor: '#ec4899',
        themeColorRgb: '236, 72, 153',
        bgGradient: 'from-pink-500/10 via-fuchsia-500/5 to-transparent',
        borderHover: 'group-hover:border-pink-500/30',
        iconStyle: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]',
        bgAnimType: 'sparks'
      };
    case 'conflict':
    case 'toxicity':
    default:
      return {
        themeColor: '#10b981',
        themeColorRgb: '16, 185, 129',
        bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        borderHover: 'group-hover:border-emerald-500/30',
        iconStyle: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        glowColor: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]',
        bgAnimType: 'shield'
      };
  }
};

export const CardBackgroundAnimation = ({ type, id, isHovered }: { type: string; id: string; isHovered: boolean }) => {
  switch (type) {
    case 'orbit':
      return (
        <svg className="absolute -right-10 -top-10 w-44 h-44 text-[rgba(var(--theme-color-rgb),0.12)] pointer-events-none transition-transform duration-500 group-hover:scale-110" viewBox="0 0 120 120">
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="4 4"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="38"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="12 4"
            animate={isHovered ? { rotate: -360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="25"
            stroke="currentColor"
            strokeWidth="0.25"
            fill="none"
            strokeDasharray="2 10"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          />
        </svg>
      );
    case 'solar':
      return (
        <svg className="absolute -right-10 -top-10 w-44 h-44 text-[rgba(var(--theme-color-rgb),0.12)] pointer-events-none transition-transform duration-500 group-hover:scale-110" viewBox="0 0 120 120">
          <motion.circle
            cx="60"
            cy="60"
            r="22"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="4 2"
            animate={isHovered ? { scale: [1, 1.15, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          />
          <motion.circle
            cx="60"
            cy="60"
            r="44"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            strokeDasharray="1 6"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          />
          <motion.line
            x1="60"
            y1="60"
            x2="60"
            y2="22"
            stroke="currentColor"
            strokeWidth="0.75"
            animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
            style={{ transformOrigin: '60px 60px' }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
          />
        </svg>
      );
    case 'cyber':
      return (
        <svg className="absolute inset-0 w-full h-full text-[rgba(var(--theme-color-rgb),0.08)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`cyber-grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#cyber-grid-${id})`} className="opacity-40" />
          <motion.path
            d="M -50 50 L 300 350"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="30 120"
            animate={{ strokeDashoffset: isHovered ? [0, -300] : [0, -150] }}
            transition={{ repeat: Infinity, duration: isHovered ? 2.5 : 5, ease: "linear" }}
          />
          <motion.path
            d="M 50 -50 L 400 250"
            stroke="currentColor"
            strokeWidth="0.75"
            strokeDasharray="20 180"
            animate={{ strokeDashoffset: isHovered ? [0, -360] : [0, -180] }}
            transition={{ repeat: Infinity, duration: isHovered ? 3.5 : 7, ease: "linear" }}
          />
        </svg>
      );
    case 'radar':
      return (
        <svg className="absolute inset-0 w-full h-full text-[rgba(var(--theme-color-rgb),0.1)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`radar-grid-${id}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="0.75" fill="currentColor" className="opacity-50" />
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.25" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#radar-grid-${id})`} />
          <motion.rect
            x="0"
            y="0"
            width="100%"
            height="1.5"
            fill="currentColor"
            opacity="0.3"
            animate={{ y: [0, 240] }}
            transition={{ repeat: Infinity, duration: isHovered ? 2 : 4, ease: "linear" }}
          />
          <g transform="translate(180, 35)" className="opacity-70">
            <circle cx="0" cy="0" r="24" stroke="currentColor" strokeWidth="0.5" fill="none" />
            <circle cx="0" cy="0" r="12" stroke="currentColor" strokeWidth="0.25" fill="none" />
            <motion.line
              x1="0"
              y1="0"
              x2="0"
              y2="-24"
              stroke="currentColor"
              strokeWidth="0.75"
              animate={{ rotate: 360 }}
              style={{ transformOrigin: '0px 0px' }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            />
          </g>
        </svg>
      );
    case 'heart':
      return (
        <svg className="absolute -right-5 -bottom-5 w-36 h-36 text-[rgba(var(--theme-color-rgb),0.1)] pointer-events-none" viewBox="0 0 100 100">
          <motion.circle
            cx="50"
            cy="50"
            r="38"
            stroke="currentColor"
            strokeWidth="0.5"
            fill="none"
            animate={{
              scale: isHovered ? [0.8, 1.25, 0.8] : [0.9, 1.1, 0.9],
              opacity: isHovered ? [0.2, 0.8, 0.2] : [0.3, 0.6, 0.3]
            }}
            transition={{ repeat: Infinity, duration: isHovered ? 1.8 : 3.6, ease: "easeInOut" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="22"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            animate={{
              scale: isHovered ? [1.1, 0.7, 1.1] : [1, 0.85, 1],
              opacity: isHovered ? [0.8, 0.2, 0.8] : [0.6, 0.3, 0.6]
            }}
            transition={{ repeat: Infinity, duration: isHovered ? 1.8 : 3.6, ease: "easeInOut" }}
          />
          <motion.path
            d="M 5 50 L 30 50 L 36 38 L 42 66 L 48 26 L 54 58 L 60 46 L 66 50 L 95 50"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            strokeDasharray="120"
            animate={{ strokeDashoffset: [120, 0] }}
            transition={{ repeat: Infinity, duration: isHovered ? 1.5 : 3, ease: "linear" }}
          />
        </svg>
      );
    case 'shadow':
      return (
        <svg className="absolute inset-0 w-full h-full text-[rgba(var(--theme-color-rgb),0.1)] pointer-events-none" style={{ filter: "blur(20px)" }}>
          <motion.circle
            cx="60"
            cy="60"
            r="28"
            fill="currentColor"
            animate={isHovered ? {
              cx: [30, 85, 45, 30],
              cy: [35, 75, 65, 35]
            } : {
              cx: [45, 65, 45],
              cy: [55, 65, 55]
            }}
            transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
          />
          <motion.circle
            cx="140"
            cy="90"
            r="32"
            fill="currentColor"
            animate={isHovered ? {
              cx: [150, 105, 140, 150],
              cy: [110, 65, 120, 110]
            } : {
              cx: [130, 110, 130],
              cy: [85, 100, 85]
            }}
            transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
          />
        </svg>
      );
    case 'sparks':
      return (
        <svg className="absolute inset-0 w-full h-full text-[rgba(var(--theme-color-rgb),0.12)] pointer-events-none">
          <g className="opacity-90">
            <motion.path
              d="M 35 35 L 37 40 L 42 42 L 37 44 L 35 49 L 33 44 L 28 42 L 33 40 Z"
              fill="currentColor"
              animate={{
                scale: [0.6, 1.2, 0.6],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0 }}
            />
            <motion.path
              d="M 190 70 L 191.5 73.5 L 195 75 L 191.5 76.5 L 190 80 L 188.5 76.5 L 185 75 L 188.5 73.5 Z"
              fill="currentColor"
              animate={{
                scale: [1, 0.4, 1],
                opacity: [0.9, 0.2, 0.9]
              }}
              transition={{ repeat: Infinity, duration: 2.8, delay: 0.4 }}
            />
            <motion.circle
              cx="80"
              cy="160"
              r="2.2"
              fill="currentColor"
              animate={{
                y: [0, -90],
                opacity: [0, 1, 0]
              }}
              transition={{ repeat: Infinity, duration: 3.2, ease: "easeOut" }}
            />
            <motion.circle
              cx="140"
              cy="120"
              r="1.8"
              fill="currentColor"
              animate={{
                y: [0, -70],
                opacity: [0, 0.9, 0]
              }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeOut", delay: 0.5 }}
            />
          </g>
        </svg>
      );
    case 'shield':
    default:
      return (
        <svg className="absolute inset-0 w-full h-full text-[rgba(var(--theme-color-rgb),0.08)] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <pattern id={`hex-grid-${id}`} width="28" height="48.5" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
            <path d="M 28 0 L 14 8 L 0 0 L 0 16 L 14 24 L 28 16 Z M 0 24.25 L 14 32.25 L 28 24.25 L 28 40.25 L 14 48.25 L 0 40.25 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#hex-grid-${id})`} />
          <motion.circle
            cx="170"
            cy="75"
            r="55"
            stroke="currentColor"
            strokeWidth="0.75"
            fill="none"
            opacity="0.35"
            animate={{
              scale: isHovered ? [0.95, 1.25, 0.95] : 1,
              opacity: isHovered ? [0.25, 0.65, 0.25] : 0.25
            }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
          />
        </svg>
      );
  }
};

export function NeuralTestCard({ test, onClick, language, isRTL, simplified = false }: NeuralTestCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const theme = getCardTheme(test.id);

  // If completed, blend with emerald green (Success theme)
  const isCompleted = test.status === 'completed';
  const displayThemeColor = isCompleted ? '#10b981' : theme.themeColor;
  const displayThemeRgb = isCompleted ? '16, 185, 129' : theme.themeColorRgb;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setCoords({ x: 0.5, y: 0.5 });
  };

  // 3D Tilt calculation (max 12 degrees)
  const tiltX = isHovered ? (coords.y - 0.5) * -12 : 0;
  const tiltY = isHovered ? (coords.x - 0.5) * 12 : 0;

  // Specular reflection shine position
  const sheenX = coords.x * 100;
  const sheenY = coords.y * 100;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => test.status !== 'locked' && onClick()}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        WebkitTransformStyle: 'preserve-3d',
        ['--theme-color' as any]: displayThemeColor,
        ['--theme-color-rgb' as any]: displayThemeRgb,
      }}
      className={cn(
        "glass-card p-6 border group transition-all duration-300 cursor-pointer relative overflow-hidden select-none",
        isCompleted
          ? "border-emerald-500/20 bg-emerald-500/[0.02] hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
          : "border-white/5 bg-bg-card hover:border-[rgba(var(--theme-color-rgb),0.35)]",
        test.status === 'locked' && "opacity-40 grayscale cursor-not-allowed pointer-events-none",
        !isCompleted && test.status !== 'locked' && theme.glowColor
      )}
    >
      {/* Dynamic Specular Sheen (Shine Reflection) */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${sheenX}% ${sheenY}%, rgba(var(--theme-color-rgb), 0.12) 0%, transparent 65%)`,
        }}
      />

      {/* Animated Concept-Specific SVGs */}
      {test.status !== 'locked' && (
        <CardBackgroundAnimation type={theme.bgAnimType} id={test.id} isHovered={isHovered} />
      )}

      {/* Card Contents */}
      <div className="relative z-20 h-full flex flex-col justify-between" style={{ transform: 'translateZ(20px)' }}>
        <div>
          {/* Top Row: Icon and Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <motion.div
              animate={isHovered ? { scale: 1.08, rotate: [0, -3, 3, 0] } : { scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-300",
                isCompleted 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-white/5 text-slate-400 border-white/5 group-hover:bg-[rgba(var(--theme-color-rgb),0.1)] group-hover:text-[var(--theme-color)] group-hover:border-[rgba(var(--theme-color-rgb),0.2)]"
              )}
            >
              <test.icon className="w-6 h-6" />
            </motion.div>

            <div className="flex flex-col items-end gap-1 select-none">
              {test.status === 'new' && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-brand-primary text-white px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.4)] animate-pulse">
                  {language === 'ar' ? 'جديد' : 'New'}
                </span>
              )}
              {isCompleted && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)] flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'مكتمل' : 'Done'}
                </span>
              )}
              {test.status === 'locked' && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-slate-700">
                  <Lock className="w-2.5 h-2.5" />
                  {language === 'ar' ? 'مغلق' : 'Locked'}
                </span>
              )}
            </div>
          </div>

          {/* Test Name */}
          <h4 className="text-lg font-bold text-white mb-2 group-hover:text-[var(--theme-color)] transition-colors duration-300 tracking-tight">
            {language === 'ar' ? test.nameAr : test.nameEn}
          </h4>

          {/* Info Details (Only shown in detailed view, not simplified) */}
          {!simplified && (
            <div className="flex items-center gap-4 text-slate-500 mb-8 select-none">
              <div className="flex items-center gap-1.5 font-bold group-hover:text-slate-400 transition-colors">
                <Target className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase tracking-widest">{test.questions * 5} {language === 'ar' ? 'نقاط' : 'Pts'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold group-hover:text-slate-400 transition-colors">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[9px] uppercase tracking-widest">{test.time}</span>
              </div>
            </div>
          )}

          {simplified && (
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-6 select-none">
              {test.questions} {language === 'ar' ? 'فصل في التقييم' : 'Assessment Points'}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          className={cn(
            "w-full py-3 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border select-none",
            isCompleted
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-white/5 text-slate-400 border-white/5 group-hover:bg-[var(--theme-color)] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_0_20px_rgba(var(--theme-color-rgb),0.35)]"
          )}
        >
          {isCompleted
            ? (language === 'ar' ? 'إعادة التدقيق' : 'Re-Audit Neural Path')
            : (language === 'ar' ? 'بدء التقييم' : 'Begin Assessment')}
          <ChevronRight className={cn("w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5", isRTL && "rotate-180 group-hover:-translate-x-0.5")} />
        </button>
      </div>
    </motion.div>
  );
}
