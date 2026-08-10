import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Dna,
  BrainCircuit,
  BookHeart,
  Settings,
  Calendar,
  MessageSquare,
  Activity,
  Users,
  Target,
  LogOut,
  Zap,
  Shield,
  Repeat,
  History,
  FileText,
  Brain,
  TrendingUp,
  CreditCard,
  ChevronLeft,
  Globe,
  Lock
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
}

export function Sidebar({ isOpen, onClose, isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { language, setLanguage, isRTL } = useLanguage();
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

  const systemItems: { icon: any, labelKey: TranslationKey, path: string }[] = [
    { icon: LayoutDashboard, labelKey: 'dashboard', path: '/dashboard' },
    { icon: BrainCircuit, labelKey: 'neural_tests', path: '/tests' },
    { icon: Dna, labelKey: 'personality_dna', path: '/dna' },
    { icon: Brain, labelKey: 'archetype', path: '/archetype' },
    { icon: TrendingUp, labelKey: 'growth_velocity', path: '/velocity' },
    { icon: Target, labelKey: 'growth_lab', path: '/growth-lab' },
    { icon: Activity, labelKey: 'emotional_iq', path: '/emotional-iq' },
    { icon: Users, labelKey: 'social_iq', path: '/social-iq' },
    { icon: Zap, labelKey: 'cog_load', path: '/cognitive-load' },
    { icon: Shield, labelKey: 'toxicity', path: '/toxicity' },
  ];

  const personalItems: { icon: any, labelKey: TranslationKey, path: string }[] = [
    { icon: BookHeart, labelKey: 'library', path: '/library' },
    { icon: Calendar, labelKey: 'book_appointment', path: '/booking' },
    { icon: CreditCard, labelKey: 'branding.billingTitle', path: '/billing' },
  ];

  return (
    <>
      {/* Blurred Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={cn(
        "h-screen bg-bg-sidebar border-white/5 flex flex-col fixed top-0 z-50 overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out lg:translate-x-0 lg:flex",
        isCollapsed ? "w-64 lg:w-20 p-4" : "w-64 lg:w-64 p-6",
        isRTL 
          ? cn("right-0 border-l", isOpen ? "translate-x-0" : "translate-x-full") 
          : cn("left-0 border-r", isOpen ? "translate-x-0" : "-translate-x-full")
      )}>
        {/* Toggle Collapse Edge Button (Desktop only) */}
        <button
          onClick={onToggleCollapse}
          className={cn(
            "hidden lg:flex w-6 h-6 rounded-full bg-bg-sidebar border border-white/10 hover:border-brand-primary/50 text-slate-400 hover:text-white items-center justify-center absolute top-7 z-50 transition-all duration-300 shadow-xl cursor-pointer hover:scale-105 active:scale-95",
            isRTL 
              ? (isCollapsed ? "left-[-12px]" : "left-[-12px]") 
              : (isCollapsed ? "right-[-12px]" : "right-[-12px]")
          )}
        >
          <ChevronLeft 
            size={13} 
            className={cn(
              "transition-transform duration-300", 
              isRTL 
                ? (isCollapsed ? "" : "rotate-180") 
                : (isCollapsed ? "rotate-180" : "")
            )} 
          />
        </button>

        {/* Logo Section */}
        <div className={cn("flex items-center gap-3 mb-8 px-2 transition-all duration-300", isCollapsed ? "justify-center" : "")}>
          <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-lg shadow-brand-primary/20">H</div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-xl font-semibold tracking-tight text-white flex items-center gap-1 whitespace-nowrap"
            >
              HumanOS <span className="text-brand-primary text-[10px] bg-brand-primary/10 px-1 rounded align-top font-black">AI</span>
            </motion.span>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1">
          {/* 1. System Modules Section */}
          {!isCollapsed ? (
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 mt-6 px-3 font-black">
              {language === 'ar' ? 'وحدات النظام' : 'System Modules'}
            </div>
          ) : (
            <div className="h-px bg-white/5 my-4 mx-2" />
          )}
          
          <div className="space-y-1">
            {systemItems.map((item) => {
              const isUnlocked = isPathUnlocked(user, item.path, tenantConfig);
              return (
                <div key={item.labelKey} className="relative group/tooltip">
                  <NavLink
                    to={isUnlocked ? item.path : '/billing'}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "sidebar-link group transition-all duration-200",
                      isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                      isActive && isUnlocked
                        ? "bg-brand-primary/10 text-white border border-brand-primary/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn(
                          "w-4 h-4 transition-colors shrink-0",
                          isActive && isUnlocked ? "text-brand-primary" : "text-slate-600 group-hover:text-slate-400"
                        )} />
                        {!isCollapsed && (
                          <span className="font-bold text-xs uppercase tracking-widest flex items-center justify-between w-full">
                            <span>{t(item.labelKey)}</span>
                            {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                          </span>
                        )}
                        {isCollapsed && !isUnlocked && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-bg-sidebar shadow-md animate-pulse" />
                        )}
                      </>
                    )}
                  </NavLink>
                  
                  {isCollapsed && (
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                      isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                    )}>
                      {t(item.labelKey)} {!isUnlocked && '🔒'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 2. AI Section */}
          {!isCollapsed ? (
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 mt-8 px-3 font-black">
              {language === 'ar' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}
            </div>
          ) : (
            <div className="h-px bg-white/5 my-4 mx-2" />
          )}
          
          <div className="space-y-1">
            {(() => {
              const isUnlocked = isPathUnlocked(user, '/coach', tenantConfig);
              return (
                <div className="relative group/tooltip">
                  <NavLink
                    to={isUnlocked ? "/coach" : "/billing"}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "sidebar-link group transition-all duration-200",
                      isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                      isActive && isUnlocked ? "bg-brand-primary/10 text-white border border-brand-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <MessageSquare className="w-4 h-4 text-brand-primary shrink-0" />
                    {!isCollapsed && (
                      <span className="font-bold text-xs uppercase tracking-widest flex items-center justify-between w-full">
                        <span>{t('ai_coach')}</span>
                        {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                      </span>
                    )}
                    {isCollapsed && !isUnlocked && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-bg-sidebar shadow-md animate-pulse" />
                    )}
                  </NavLink>

                  {isCollapsed && (
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                      isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                    )}>
                      {t('ai_coach')} {!isUnlocked && '🔒'}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* 3. Library Section */}
          {!isCollapsed ? (
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 mt-8 px-3 font-black">
              {language === 'ar' ? 'البيانات والمكتبة' : 'Data & Library'}
            </div>
          ) : (
            <div className="h-px bg-white/5 my-4 mx-2" />
          )}

          <div className="space-y-1">
            {personalItems.map((item) => {
              const isUnlocked = isPathUnlocked(user, item.path, tenantConfig);
              return (
                <div key={item.labelKey} className="relative group/tooltip">
                  <NavLink
                    to={isUnlocked ? item.path : '/billing'}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "sidebar-link group transition-all duration-200",
                      isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                      isActive && isUnlocked
                        ? "bg-brand-primary/10 text-white border border-brand-primary/20"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className={cn(
                          "w-4 h-4 transition-colors shrink-0",
                          isActive && isUnlocked ? "text-brand-primary" : "text-slate-600 group-hover:text-slate-400"
                        )} />
                        {!isCollapsed && (
                          <span className="font-bold text-xs uppercase tracking-widest flex items-center justify-between w-full">
                            <span>{t(item.labelKey)}</span>
                            {!isUnlocked && <Lock size={12} className="text-slate-500 hover:text-white shrink-0 ml-1.5" />}
                          </span>
                        )}
                        {isCollapsed && !isUnlocked && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-primary border border-bg-sidebar shadow-md animate-pulse" />
                        )}
                      </>
                    )}
                  </NavLink>

                  {isCollapsed && (
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                      isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                    )}>
                      {t(item.labelKey)} {!isUnlocked && '🔒'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 4. Admin Management Section */}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <>
              {!isCollapsed ? (
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3 mt-8 px-3 font-black">
                  {language === 'ar' ? 'الإدارة والتحكم' : 'Management & Control'}
                </div>
              ) : (
                <div className="h-px bg-white/5 my-4 mx-2" />
              )}
              
              <div className="space-y-1">
                <div className="relative group/tooltip">
                  <NavLink
                    to="/admin"
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      "sidebar-link group transition-all duration-200",
                      isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                      isActive ? "bg-brand-primary/10 text-white border border-brand-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Shield className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                    {!isCollapsed && (
                      <span className="font-bold text-xs uppercase tracking-widest">
                        {language === 'ar' ? 'لوحة المدير' : 'Admin Panel'}
                      </span>
                    )}
                  </NavLink>

                  {isCollapsed && (
                    <div className={cn(
                      "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                      isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                    )}>
                      {language === 'ar' ? 'لوحة المدير' : 'Admin Panel'}
                    </div>
                  )}
                </div>

                {user.role === 'super_admin' && (
                  <div className="relative group/tooltip">
                    <NavLink
                      to="/super-admin"
                      onClick={onClose}
                      className={({ isActive }) => cn(
                        "sidebar-link group transition-all duration-200",
                        isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                        isActive ? "bg-brand-primary/10 text-white border border-brand-primary/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
                      {!isCollapsed && (
                        <span className="font-bold text-xs uppercase tracking-widest">
                          {language === 'ar' ? 'لوحة المالك' : 'Super Admin'}
                        </span>
                      )}
                    </NavLink>

                    {isCollapsed && (
                      <div className={cn(
                        "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                        isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                      )}>
                        {language === 'ar' ? 'لوحة المالك' : 'Super Admin'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        {/* Footer Actions Section */}
        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
          <div className="space-y-1">
            {/* Profile Link */}
            <div className="relative group/tooltip">
              <NavLink
                to="/profile"
                onClick={onClose}
                className={({ isActive }) => cn(
                  "sidebar-link group transition-all duration-200",
                  isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : "",
                  isActive ? "bg-white/5 text-white" : "text-slate-400 hover:text-white"
                )}
              >
                <Users className="w-4 h-4 text-slate-600 group-hover:text-slate-400 shrink-0" />
                {!isCollapsed && (
                  <span className="font-bold text-xs uppercase tracking-widest">{t('profile')}</span>
                )}
              </NavLink>

              {isCollapsed && (
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                  isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
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
                  "w-full sidebar-link group text-slate-400 hover:text-red-400 transition-colors duration-200",
                  isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto rounded-xl" : ""
                )}
              >
                <LogOut className="w-4 h-4 text-slate-600 group-hover:text-red-400 shrink-0" />
                {!isCollapsed && (
                  <span className="font-bold text-xs uppercase tracking-widest">{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
                )}
              </button>

              {isCollapsed && (
                <div className={cn(
                  "absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-200 z-50 px-3 py-1.5 bg-bg-sidebar border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap shadow-xl",
                  isRTL ? "right-full mr-3 translate-x-2 group-hover/tooltip:translate-x-0" : "left-full ml-3 -translate-x-2 group-hover/tooltip:translate-x-0"
                )}>
                  {language === 'ar' ? 'تسجيل الخروج' : 'Logout'}
                </div>
              )}
            </div>
          </div>

          {/* Neural Metrics / Language Swappers widget */}
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2 pt-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:border-brand-primary/45 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-white transition-colors duration-200 uppercase"
                title={language === 'en' ? 'العربية' : 'English'}
              >
                {language === 'en' ? 'AR' : 'EN'}
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-brand-primary/5 rounded-2xl border border-brand-primary/10 font-bold"
            >
              <div className="flex gap-1 mb-4">
                <button
                  onClick={() => setLanguage('en')}
                  className={cn("flex-1 py-1 rounded-lg text-[9px] uppercase tracking-widest transition-all", language === 'en' ? "bg-brand-primary text-white" : "bg-white/5 text-slate-500 hover:text-slate-300")}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={cn("flex-1 py-1 rounded-lg text-[9px] uppercase tracking-widest transition-all", language === 'ar' ? "bg-brand-primary text-white" : "bg-white/5 text-slate-500 hover:text-slate-300")}
                >
                  AR
                </button>
              </div>
              
              <div className="text-[9px] uppercase tracking-[0.2em] text-slate-500 mb-2 font-black flex justify-between">
                <span>{language === 'ar' ? 'الاتساق العصبي' : 'Neural Consistency'}</span>
                <span className="text-brand-primary">{language === 'ar' ? 'إثبات' : 'PROOF'}</span>
              </div>
              
              <div className="text-xs font-bold text-white mb-2">Verified Protocol IV</div>
              
              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-brand-primary h-full w-3/4 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
              </div>
            </motion.div>
          )}
        </div>
      </aside>
    </>
  );
}
