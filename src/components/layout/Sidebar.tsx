import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Dna,
  BrainCircuit,
  BookHeart,
  Calendar,
  MessageSquare,
  Activity,
  Users,
  Target,
  LogOut,
  Zap,
  Shield,
  Brain,
  TrendingUp,
  CreditCard,
  ChevronLeft,
  Lock,
  Sparkles,
  UserCheck,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { isPathUnlocked } from '../../lib/subscription';
import { translations, TranslationKey } from '../../lib/translations';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse, onNavigate }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
  const location = useLocation();

  const handleLinkClick = () => {
    onClose?.();
    onNavigate?.();
  };
  const t = (key: TranslationKey) => translations[language][key] || key;

  const [tenantConfig, setTenantConfig] = React.useState<any>(null);
  const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');

  React.useEffect(() => {
    if (!adminId) return;
    getDoc(doc(db, 'tenants', adminId))
      .then(snap => {
        if (snap.exists()) {
          setTenantConfig(snap.data());
        }
      })
      .catch((err) => {
        console.error("Sidebar: Error loading tenant config", err);
      });
  }, [adminId]);

  const systemItems = [
    { icon: LayoutDashboard, labelKey: 'dashboard' as TranslationKey, path: '/dashboard', color: 'text-cyan-400' },
    { icon: BrainCircuit, labelKey: 'neural_tests' as TranslationKey, path: '/tests', color: 'text-indigo-400' },
    { icon: Dna, labelKey: 'personality_dna' as TranslationKey, path: '/dna', color: 'text-fuchsia-400' },
    { icon: Brain, labelKey: 'archetype' as TranslationKey, path: '/archetype', color: 'text-emerald-400' },
    { icon: TrendingUp, labelKey: 'growth_velocity' as TranslationKey, path: '/velocity', color: 'text-amber-400' },
    { icon: Target, labelKey: 'growth_lab' as TranslationKey, path: '/growth-lab', color: 'text-rose-400' },
    { icon: Activity, labelKey: 'emotional_iq' as TranslationKey, path: '/emotional-iq', color: 'text-pink-400' },
    { icon: Users, labelKey: 'social_iq' as TranslationKey, path: '/social-iq', color: 'text-sky-400' },
    { icon: Zap, labelKey: 'cog_load' as TranslationKey, path: '/cognitive-load', color: 'text-violet-400' },
    { icon: Shield, labelKey: 'toxicity' as TranslationKey, path: '/toxicity', color: 'text-red-400' },
  ];

  const personalItems = [
    { icon: BookHeart, labelKey: 'library' as TranslationKey, path: '/library', color: 'text-teal-400' },
    { icon: Calendar, labelKey: 'book_appointment' as TranslationKey, path: '/booking', color: 'text-emerald-400' },
    { icon: CreditCard, labelKey: 'branding.billingTitle' as TranslationKey, path: '/billing', color: 'text-amber-400' },
  ];

  return (
    <>
      {/* Blurred Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={cn(
        "h-screen bg-slate-950/95 backdrop-blur-2xl border-white/10 flex flex-col fixed top-0 z-50 overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out lg:translate-x-0 lg:flex shadow-2xl shadow-black/80",
        isCollapsed ? "w-64 lg:w-20 p-3" : "w-64 lg:w-64 p-5",
        isRTL 
          ? cn("right-0 border-l", isOpen ? "translate-x-0" : "translate-x-full") 
          : cn("left-0 border-r", isOpen ? "translate-x-0" : "-translate-x-full")
      )}>
        {/* Toggle Collapse Edge Button (Desktop only) */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:flex w-7 h-7 rounded-full bg-slate-900 border border-white/20 hover:border-brand-primary/60 text-slate-400 hover:text-white items-center justify-center absolute top-7 z-50 transition-all duration-300 shadow-xl cursor-pointer hover:scale-110 active:scale-95",
            isRTL ? "left-[-14px]" : "right-[-14px]"
          )}
        >
          <ChevronLeft 
            size={14} 
            className={cn(
              "transition-transform duration-300", 
              isRTL 
                ? (isCollapsed ? "" : "rotate-180") 
                : (isCollapsed ? "rotate-180" : "")
            )} 
          />
        </button>

        {/* Logo Section */}
        <div className={cn("flex items-center gap-3 mb-6 px-1 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
          <div className="relative flex items-center justify-center shrink-0">
            <div className="absolute inset-0 bg-brand-primary/40 rounded-xl blur-md animate-pulse" />
            <div className="w-10 h-10 bg-gradient-to-tr from-brand-primary via-indigo-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-white text-xl relative z-10 shadow-lg shadow-brand-primary/30 border border-white/20">
              H
            </div>
          </div>

          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <div className="text-lg font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
                <span>HumanOS</span>
                <span className="text-[9px] font-black tracking-widest text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-1.5 py-0.5 rounded-full uppercase">
                  AI v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold mt-1">
                {language === 'ar' ? 'النظام العصبي الشخصي' : 'Neural Operating OS'}
              </span>
            </motion.div>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-6">
          {/* 1. System Modules Section */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 px-3 font-extrabold">
                <span>{language === 'ar' ? 'وحدات النظام' : 'System Modules'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
              </div>
            ) : (
              <div className="h-px bg-white/10 my-3 mx-2" />
            )}
            
            <div className="space-y-1">
              {systemItems.map((item) => {
                const isUnlocked = isPathUnlocked(user, item.path, tenantConfig);
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.labelKey} className="relative group/tooltip">
                    <NavLink
                      to={isUnlocked ? item.path : '/billing'}
                      onClick={handleLinkClick}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/link",
                        isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                        isActive && isUnlocked
                          ? "text-white font-extrabold"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && isUnlocked && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-primary/15 to-indigo-500/10 border border-brand-primary/40 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      <item.icon className={cn(
                        "w-4 h-4 transition-transform duration-200 shrink-0 group-hover/link:scale-110 relative z-10",
                        isActive && isUnlocked ? "text-brand-primary" : item.color
                      )} />

                      {!isCollapsed && (
                        <span className="uppercase tracking-wider flex items-center justify-between w-full relative z-10 text-[11px]">
                          <span>{t(item.labelKey)}</span>
                          {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                        </span>
                      )}

                      {isCollapsed && !isUnlocked && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-slate-950 shadow-md animate-pulse" />
                      )}
                    </NavLink>
                    
                    {/* Collapsed Tooltip */}
                    {isCollapsed && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-brand-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                        isRTL ? "right-full mr-3" : "left-full ml-3"
                      )}>
                        {t(item.labelKey)} {!isUnlocked && '🔒'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. AI Section */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 px-3 font-extrabold">
                <span>{language === 'ar' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</span>
                <Sparkles size={10} className="text-brand-primary animate-pulse" />
              </div>
            ) : (
              <div className="h-px bg-white/10 my-3 mx-2" />
            )}
            
            <div className="space-y-1">
              {(() => {
                const isUnlocked = isPathUnlocked(user, '/coach', tenantConfig);
                const isActive = location.pathname === '/coach';
                return (
                  <div className="relative group/tooltip">
                    <NavLink
                      to={isUnlocked ? "/coach" : "/billing"}
                      onClick={handleLinkClick}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/link",
                        isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                        isActive && isUnlocked
                          ? "text-white font-extrabold"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && isUnlocked && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-primary/15 to-indigo-500/10 border border-brand-primary/40 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      <MessageSquare className="w-4 h-4 text-brand-primary shrink-0 relative z-10 group-hover/link:scale-110 transition-transform" />
                      
                      {!isCollapsed && (
                        <span className="uppercase tracking-wider flex items-center justify-between w-full relative z-10 text-[11px]">
                          <span className="flex items-center gap-1.5">
                            {t('ai_coach')}
                            <Flame size={12} className="text-amber-400 animate-bounce" />
                          </span>
                          {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                        </span>
                      )}

                      {isCollapsed && !isUnlocked && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-slate-950 shadow-md animate-pulse" />
                      )}
                    </NavLink>

                    {isCollapsed && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-brand-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                        isRTL ? "right-full mr-3" : "left-full ml-3"
                      )}>
                        {t('ai_coach')} {!isUnlocked && '🔒'}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* 3. Data & Library Section */}
          <div>
            {!isCollapsed ? (
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 px-3 font-extrabold">
                <span>{language === 'ar' ? 'البيانات والمكتبة' : 'Data & Library'}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.6)]" />
              </div>
            ) : (
              <div className="h-px bg-white/10 my-3 mx-2" />
            )}

            <div className="space-y-1">
              {personalItems.map((item) => {
                const isUnlocked = isPathUnlocked(user, item.path, tenantConfig);
                const isActive = location.pathname === item.path;
                return (
                  <div key={item.labelKey} className="relative group/tooltip">
                    <NavLink
                      to={isUnlocked ? item.path : '/billing'}
                      onClick={handleLinkClick}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/link",
                        isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                        isActive && isUnlocked
                          ? "text-white font-extrabold"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {isActive && isUnlocked && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-primary/15 to-indigo-500/10 border border-brand-primary/40 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)]"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}

                      <item.icon className={cn(
                        "w-4 h-4 transition-transform duration-200 shrink-0 group-hover/link:scale-110 relative z-10",
                        isActive && isUnlocked ? "text-brand-primary" : item.color
                      )} />

                      {!isCollapsed && (
                        <span className="uppercase tracking-wider flex items-center justify-between w-full relative z-10 text-[11px]">
                          <span>{t(item.labelKey)}</span>
                          {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                        </span>
                      )}

                      {isCollapsed && !isUnlocked && (
                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-slate-950 shadow-md animate-pulse" />
                      )}
                    </NavLink>

                    {isCollapsed && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-brand-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                        isRTL ? "right-full mr-3" : "left-full ml-3"
                      )}>
                        {t(item.labelKey)} {!isUnlocked && '🔒'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Admin Management Section */}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <div>
              {!isCollapsed ? (
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2.5 px-3 font-extrabold">
                  <span>{language === 'ar' ? 'الإدارة والتحكم' : 'Management & Control'}</span>
                  <Shield size={10} className="text-indigo-400" />
                </div>
              ) : (
                <div className="h-px bg-white/10 my-3 mx-2" />
              )}
              
              <div className="space-y-1">
                <div className="relative group/tooltip">
                  <NavLink
                    to="/admin"
                    onClick={handleLinkClick}
                    className={({ isActive }) => cn(
                      "relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/link",
                      isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                      isActive ? "text-white font-extrabold bg-brand-primary/10 border border-brand-primary/30" : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Shield className="w-4 h-4 text-indigo-400 shrink-0 group-hover/link:scale-110 transition-transform" />
                    {!isCollapsed && (
                      <span className="uppercase tracking-wider text-[11px]">
                        {language === 'ar' ? 'لوحة المدير' : 'Admin Panel'}
                      </span>
                    )}
                  </NavLink>

                  {isCollapsed && (
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-brand-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                      isRTL ? "right-full mr-3" : "left-full ml-3"
                    )}>
                      {language === 'ar' ? 'لوحة المدير' : 'Admin Panel'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Footer Actions Section */}
        <div className="mt-auto pt-4 border-t border-white/10 space-y-3">
          <div className="space-y-1">
            {/* Profile Link */}
            <div className="relative group/tooltip">
              <NavLink
                to="/profile"
                onClick={handleLinkClick}
                className={({ isActive }) => cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/link",
                  isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                  isActive ? "text-white bg-white/10" : "text-slate-400 hover:text-white hover:bg-white/5"
                )}
              >
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover/link:scale-110 transition-transform" />
                {!isCollapsed && (
                  <span className="uppercase tracking-wider text-[11px]">{t('profile')}</span>
                )}
              </NavLink>

              {isCollapsed && (
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-brand-primary/30 text-white text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                  isRTL ? "right-full mr-3" : "left-full ml-3"
                )}>
                  {t('profile')}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="relative group/tooltip">
              <button
                onClick={() => {
                  onClose?.();
                  signOut();
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 group/logout cursor-pointer",
                  isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : ""
                )}
              >
                <LogOut className="w-4 h-4 text-slate-500 group-hover/logout:text-rose-400 shrink-0 group-hover/logout:scale-110 transition-transform" />
                {!isCollapsed && (
                  <span className="uppercase tracking-wider text-[11px]">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                )}
              </button>

              {isCollapsed && (
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-slate-900 border border-rose-500/30 text-rose-300 text-[10px] font-black uppercase tracking-widest rounded-xl whitespace-nowrap shadow-2xl backdrop-blur-md",
                  isRTL ? "right-full mr-3" : "left-full ml-3"
                )}>
                  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </div>
              )}
            </div>
          </div>

          {/* Neural Consistency Widget (الاتساق العصبي - Verified Protocol IV) */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2 pt-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 hover:border-brand-primary/60 flex items-center justify-center text-[10px] font-black text-slate-300 hover:text-white transition-all shadow-md active:scale-95 uppercase"
                title={language === 'en' ? 'العربية' : 'English'}
              >
                {language === 'en' ? 'AR' : 'EN'}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-gradient-to-br from-brand-primary/10 via-slate-900 to-indigo-950/40 rounded-2xl border border-brand-primary/20 shadow-xl space-y-2.5"
            >
              {/* Language Switcher Bar */}
              <div className="flex bg-slate-950/80 p-1 rounded-xl border border-white/10">
                <button
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    language === 'en' ? "bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={cn(
                    "flex-1 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                    language === 'ar' ? "bg-gradient-to-r from-brand-primary to-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  AR
                </button>
              </div>
              
              {/* Consistency Header */}
              <div className="flex justify-between items-center text-[10px] font-black">
                <span className="text-slate-400 uppercase tracking-wider">
                  {language === 'ar' ? 'الاتساق العصبي' : 'Neural Consistency'}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] flex items-center gap-1">
                  <CheckCircle2 size={10} />
                  {language === 'ar' ? 'إثبات' : 'PROOF'}
                </span>
              </div>
              
              {/* Protocol Name */}
              <div className="text-xs font-black text-white tracking-tight flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Verified Protocol IV</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5">
                <div className="bg-gradient-to-r from-brand-primary via-indigo-400 to-emerald-400 h-full w-4/5 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.6)] animate-pulse" />
              </div>
            </motion.div>
          )}
        </div>
      </aside>
    </>
  );
}
