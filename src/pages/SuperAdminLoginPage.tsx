import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function SuperAdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const { signInWithEmail: login, signOut: logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loggingOut) {
      if (user.role === 'super_admin' || user.role === 'employee') {
        navigate('/super-admin', { replace: true });
      } else {
        setLoggingOut(true);
        logout().finally(() => {
          setLoggingOut(false);
        });
        setError('هذا الحساب ليس حساب مالك رئيسي (Super Admin). يرجى تسجيل الدخول من البوابة المخصصة لصلاحيتك.');
        setLoading(false);
      }
    }
  }, [user, navigate, logout, loggingOut]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setError('بيانات الدخول غير صحيحة أو ليس لديك صلاحية المالك العام.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-xs font-black uppercase tracking-widest">العودة للرئيسية</span>
        </button>

        <div className="glass-card p-10 w-full border border-indigo-500/10">
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
              <Shield className="w-8 h-8 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              HumanOS AI
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              بوابة تسجيل دخول المالك العام للمنصة
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span className="badge badge-blue text-xs px-3 py-1 font-bold">Super Admin Portal</span>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-3 justify-end text-right" style={{ direction: 'rtl' }}>
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" style={{ direction: 'rtl' }}>
            <div className="space-y-1 text-right">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">
                البريد الإلكتروني للمالك
              </label>
              <div className="relative">
                <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  required
                  type="email"
                  placeholder="owner@humanos.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/10 rounded-2xl py-4 pr-12 pl-6 outline-none transition-all text-white font-medium text-right font-sans"
                />
              </div>
            </div>

            <div className="space-y-1 text-right">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 focus:border-indigo-500/50 focus:bg-white/10 rounded-2xl py-4 pr-12 pl-6 outline-none transition-all text-white font-medium text-right font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-indigo-600/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>دخول لوحة التحكم العامة</span>
                  <ArrowRight className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '24px', lineHeight: '1.6' }}>
            <p>تسجيل دخول مخصص فقط للملاك العامين للمنصة وموظفيها.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
