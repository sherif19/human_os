import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';
import { Brain, Sparkles, Cpu } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function NeuralContentLoader() {
  const { language } = useLanguage();
  return (
    <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/10 flex flex-col items-center justify-center p-6 text-center select-none min-h-[70vh]">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-brand-primary/40 rounded-full blur-xl animate-pulse" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary via-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-brand-primary/40 relative z-10 animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center border border-white/20">
            <Brain size={32} className="text-brand-primary animate-pulse" />
          </div>
        </div>
        <Sparkles size={18} className="absolute -top-2 -right-2 text-cyan-400 animate-spin" />
        <Cpu size={14} className="absolute -bottom-2 -left-2 text-indigo-400 animate-pulse" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
          <span>{language === 'ar' ? 'جاري تحميل HumanOS ....' : 'Loading HumanOS ....'}</span>
        </h2>
        <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-brand-primary/90">
          {language === 'ar' ? 'مزامنة وتفعيل وحدة المعالجة العصبية' : 'SYNCHRONIZING NEURAL PROCESSING MODULE'}
        </p>
      </div>

      <div className="w-56 max-w-xs bg-white/10 h-1.5 rounded-full overflow-hidden mt-5 p-0.5 border border-white/10">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
          className="w-full h-full bg-gradient-to-r from-transparent via-brand-primary to-cyan-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]"
        />
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    return localStorage.getItem('humanos_sidebar_collapsed') === 'true';
  });

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    localStorage.setItem('humanos_sidebar_collapsed', String(nextVal));
  };

  return (
    <div className="min-h-screen bg-bg-dark font-sans overflow-x-hidden w-full max-w-[100vw]">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <div className={cn(
        "flex flex-col min-h-screen w-full max-w-[100vw] transition-all duration-300",
        isRTL 
          ? (isCollapsed ? "lg:pr-20" : "lg:pr-64") 
          : (isCollapsed ? "lg:pl-20" : "lg:pl-64")
      )}>
        <Topbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 md:p-8 flex-1 w-full max-w-[100vw] main-content overflow-x-hidden relative min-h-[80vh]">
          <React.Suspense fallback={<NeuralContentLoader />}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </React.Suspense>
        </main>
      </div>
      
      {/* Background Decorative Elements - Subtle grain and glows */}
      <div className="fixed inset-0 -z-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />
      <div className={cn(
        "fixed top-0 -z-10 w-[800px] h-[800px] bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 pointer-events-none",
        isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      )} />
    </div>
  );
}
