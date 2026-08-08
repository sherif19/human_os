import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
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
        <main className="p-4 md:p-8 flex-1 w-full max-w-[100vw] main-content overflow-x-hidden">
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
