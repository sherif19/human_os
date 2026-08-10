import React from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import '../admin.css';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Menu } from 'lucide-react';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user: userData, signOut: logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const t = (key: TranslationKey) => translations[language][key] || key;

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const [tenantConfig, setTenantConfig] = React.useState<any>(null);

  React.useEffect(() => {
    if (userData?.role === 'admin' && userData.uid) {
      getDoc(doc(db, 'tenants', userData.uid))
        .then(snap => {
          if (snap.exists()) {
            setTenantConfig(snap.data());
          }
        })
        .catch(err => console.error("Error loading tenant config on AdminLayout:", err));
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const navGroups = [
    {
      label: t('nav.adminCtrl'),
      items: [
        { path: '/admin?tab=stats', label: t('nav.statsPanel'), step: 1, roles: ['admin', 'super_admin'] }
      ]
    },
    {
      label: t('nav.userMgmt'),
      items: [
        { path: '/super-admin?tab=users_managers', label: t('nav.managersMgmt'), step: 1, roles: ['super_admin', 'employee'] },
        { path: '/super-admin?tab=users_clients', label: t('nav.clientsMgmt'), step: 2, roles: ['super_admin', 'employee'] },
        { path: '/super-admin?tab=users_team', label: t('nav.teamMgmt'), step: 3, roles: ['super_admin', 'employee'] },
        { path: '/admin?tab=users', label: t('nav.myUsersMgmt'), step: 2, roles: ['admin'] }
      ]
    },
    {
      label: t('nav.contentMgmt'),
      items: [
        { path: '/super-admin?tab=library', label: t('nav.libraryMgmt'), step: 1, roles: ['super_admin', 'employee'] },
        { path: '/super-admin?tab=templates', label: t('nav.templatesMgmt'), step: 2, roles: ['super_admin', 'employee'] },
        { path: '/admin?tab=sales', label: t('nav.salesMgmt'), step: 1, roles: ['admin'] },
        { path: '/admin?tab=branding', label: t('nav.brandingSettings'), step: 2, roles: ['admin'] },
        { path: '/admin?tab=payments', label: t('nav.paymentSettings'), step: 3, roles: ['admin'] },
        { path: '/admin?tab=packages', label: t('nav.packagesSettings'), step: 4, roles: ['admin'] },
        { path: '/admin?tab=appointments', label: t('nav.appointments'), step: 5, roles: ['admin'] },
        { path: '/admin?tab=ai', label: t('nav.aiSettings'), step: 6, roles: ['admin'] },
      ]
    }
  ];

  const isLinkActive = (path: string) => {
    const currentFull = location.pathname + location.search;
    if (path.includes('?')) {
      return currentFull === path;
    }
    return location.pathname === path;
  };

  const userRole = userData?.role || 'user';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', width: '100vw', maxWidth: '100vw' }}>
      {/* Backdrop overlay */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg viewBox="0 0 24 24" style={{ width: '17px', height: '17px', fill: 'none', stroke: '#fff', strokeWidth: '2.5', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1>HumanOS AI</h1>
            <span>إصدار المسؤولين · V2.0</span>
          </div>
        </div>

        <div className="user-card">
          <div className="user-card-inner">
            <div className="user-avatar">
              {userData?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{userData?.email?.split('@')[0]}</div>
              <div className="user-meta">
                {userRole === 'super_admin' ? t('dashboard.superAdmin') : userRole === 'employee' ? 'موظف' : t('dashboard.admin')}
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className={`user-badge ${userRole === 'super_admin' ? 'blue' : userRole === 'employee' ? 'purple' : 'amber'}`}>
              {userRole === 'super_admin' ? 'Super Admin' : userRole === 'employee' ? 'Employee' : 'Admin'}
            </div>
            
            {userRole === 'admin' && (
              <div 
                style={{ 
                  fontSize: '10px', 
                  fontWeight: '700', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  cursor: 'pointer',
                  background: 'rgba(245, 158, 11, 0.12)',
                  color: '#f59e0b',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}
                onClick={() => {
                  setIsSidebarOpen(false);
                  navigate('/billing');
                }}
                title={language === 'ar' ? 'عرض تفاصيل الاشتراك' : 'View Subscription Details'}
              >
                {(() => {
                  if (userData?.isTrial && userData?.trialStartedAt) {
                    const trialDays = tenantConfig?.freeTrial?.days || 7;
                    const ts = userData.trialStartedAt;
                    const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
                    const expiresMs = startMs + trialDays * 86400000;
                    const daysLeft = Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
                    return daysLeft > 0 
                      ? (language === 'ar' ? `تجريبي: ${daysLeft} يوم` : `Trial: ${daysLeft}d`)
                      : (language === 'ar' ? 'انتهى التجريبي' : 'Trial Expired');
                  }
                  if (userData?.expiresAt) {
                    const ts = userData.expiresAt;
                    const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
                    const daysLeft = Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
                    return daysLeft > 0 
                      ? (language === 'ar' ? `${daysLeft} يوم متبقي` : `${daysLeft}d left`)
                      : (language === 'ar' ? 'منتهي' : 'Expired');
                  }
                  return language === 'ar' ? 'دائم' : 'Lifetime';
                })()}
              </div>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '0 6px' }}>
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="nav-section">
              <div className="nav-label">{group.label}</div>
              {group.items.map((item) => (
                item.roles.includes(userRole) && (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={() => isLinkActive(item.path) ? 'nav-item active' : 'nav-item'}
                  >
                    <div className="nav-step">{item.step}</div>
                    <span>{item.label}</span>
                  </NavLink>
                )
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleLanguage} className="footer-btn">🌐 {language === 'ar' ? 'English' : 'عربي'}</button>
          <button onClick={() => {
            setIsSidebarOpen(false);
            handleLogout();
          }} className="footer-btn">{t('nav.logout')}</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all flex items-center justify-center cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="topbar-title">
                {userRole === 'super_admin' ? t('dashboard.superAdminCenter') : userRole === 'employee' ? 'لوحة الموظفين' : t('dashboard.adminPanel')}
              </div>
              <div className="topbar-subtitle">{t('dashboard.systemMonitoring')}</div>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="topbar-chip active">
              <div className="api-dot active" style={{ width: '6px', height: '6px', background: 'var(--green)', borderRadius: '50%', display: 'inline-block', marginInlineEnd: '8px' }}></div>
              <span>{t('dashboard.systemRunning')}</span>
            </div>
          </div>
        </header>

        <div className="content-area">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
