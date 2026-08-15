import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { Brain, Lock, Mail, Zap, ArrowRight, ArrowLeft, MessageCircle, User, Dna, Shield, Layers, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [isFreeTrialEnabled, setIsFreeTrialEnabled] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseCode: '',
    password: ''
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [tenantConfig, setTenantConfig] = useState<{
    termsEnabled?: boolean;
    termsTextAr?: string;
    termsTextEn?: string;
  }>({});

  const { signIn, signInWithEmail, signOut, user, loading: authLoading } = useAuth();
  const { language, isRTL } = useLanguage();
  const navigate = useNavigate();
  const t = (key: TranslationKey) => translations[language][key] || key;

  // Load branding settings dynamically
  useEffect(() => {
    const fetchWhatsapp = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tenants'));
        if (!querySnapshot.empty) {
          const tenantData = querySnapshot.docs[0].data();
          setTenantConfig({
            termsEnabled: tenantData.termsEnabled || false,
            termsTextAr: tenantData.termsTextAr || '',
            termsTextEn: tenantData.termsTextEn || '',
          });
          if (tenantData.whatsappNumber) {
            setWhatsappNumber(tenantData.whatsappNumber);
          }
          if (tenantData.freeTrial?.enabled) {
            setIsFreeTrialEnabled(true);
          }
        }
      } catch (err) {
        console.warn("Unable to fetch branding settings (tenants collection):", err instanceof Error ? err.message : err);
      }
    };
    fetchWhatsapp();
  }, []);

  useEffect(() => {
    if (user && !authLoading) {
      if (user.role === 'super_admin') {
        navigate('/super-admin');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!isFreeTrialEnabled && mode === 'signup') {
      setMode('login');
    }
  }, [isFreeTrialEnabled, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        if (!formData.email || !formData.password) {
          throw new Error(
            language === 'ar'
              ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور'
              : 'Please enter email and password'
          );
        }

        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const uid = userCredential.user.uid;

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        // Login check completed successfully without license key requirement
      } else {
        if (!formData.email || !formData.password) {
          throw new Error(language === 'ar' ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields');
        }

        if (tenantConfig.termsEnabled && !termsAccepted) {
          throw new Error(
            language === 'ar'
              ? 'يجب عليك الموافقة على الشروط والأحكام للمتابعة'
              : 'You must agree to the Terms and Conditions to proceed'
          );
        }

        const querySnapshot = await getDocs(collection(db, 'tenants'));
        let isTrial = false;
        let tenantAdminId = '';
        let tenantAdminEmail = '';
        let tenantAdminName = '';
        let trialDays = 7;
        if (!querySnapshot.empty) {
          const tenantDoc = querySnapshot.docs[0];
          const tenantData = tenantDoc.data();
          tenantAdminId = tenantDoc.id;
          tenantAdminEmail = tenantData.adminEmail || '';
          tenantAdminName = tenantData.adminName || tenantAdminEmail.split('@')[0] || '';
          if (tenantData.freeTrial?.enabled) {
            isTrial = true;
            trialDays = tenantData.freeTrial?.days || 7;
          }
        }

        if (!isTrial) {
          throw new Error(
            language === 'ar'
              ? 'التسجيل المفتوح للفترة التجريبية غير مفعل حالياً'
              : 'Open registration for free trial is currently disabled'
          );
        }

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        let expiresAt: Date | null = null;
        if (isTrial) {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + trialDays);
        }

        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: formData.name || formData.email.split('@')[0],
          email: formData.email,
          licenseKey: formData.licenseCode || '',
          role: 'user',
          adminId: tenantAdminId,
          adminEmail: tenantAdminEmail,
          adminName: tenantAdminName,
          isTrial: isTrial,
          trialStartedAt: isTrial ? serverTimestamp() : null,
          expiresAt: expiresAt,
          createdAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      let friendlyMessage = err.message;
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyMessage = language === 'ar'
          ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
          : 'Invalid email or password';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = language === 'ar'
          ? 'البريد الإلكتروني مستخدم بالفعل'
          : 'Email is already in use';
      } else if (friendlyMessage.includes('password')) {
        friendlyMessage = language === 'ar'
          ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'
          : 'Password must be at least 6 characters long';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const currentWhatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(language === 'ar' ? 'مرحباً، أود تفعيل حسابي على منصة Humanos AI.' : 'Hello, I would like to activate my Humanos AI account.')}`
    : 'https://wa.me/201145680938';

  return (
    <div className="min-h-screen bg-bg-dark grid lg:grid-cols-12 relative overflow-hidden" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Background Neon Glowing Decor */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-primary/30 rounded-full blur-[130px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-secondary/30 rounded-full blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── Left Column: Authentication Form Panel ── */}
      <div className="col-span-12 lg:col-span-5 flex flex-col justify-between min-h-screen p-8 sm:p-12 md:p-16 bg-bg-sidebar/45 border-r border-white/5 relative z-10 overflow-y-auto">
        
        {/* Back Link */}
        <div className="w-full">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 group"
          >
            {isRTL ? (
              <>
                <span className="text-xs font-black uppercase tracking-widest">{language === 'ar' ? 'العودة' : 'Back'}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-xs font-black uppercase tracking-widest">{language === 'ar' ? 'العودة' : 'Back'}</span>
              </>
            )}
          </button>
        </div>

        {/* Content Container */}
        <div className="w-full max-w-sm mx-auto my-auto space-y-8">
          
          {/* Section Header */}
          <div className="text-center lg:text-start">
            <div className="w-14 h-14 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 shadow-2xl shadow-brand-primary/20">
              <Brain className="w-7 h-7 text-brand-primary" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
              {mode === 'signup'
                ? (language === 'ar' ? 'تهيئة ملفك العصبي' : 'Initialize Neural Profile')
                : (language === 'ar' ? 'تسجيل الدخول للنظام' : 'System Access')
              }
            </h1>
            <p className="text-slate-500 font-medium text-xs leading-relaxed">
              {language === 'ar' ? 'أدخل تفاصيلك للوصول إلى طبقة الاستخبارات.' : 'Enter your details to access the intelligence layer.'}
            </p>
          </div>

          {/* Form Mode Selector Tabs */}
          {isFreeTrialEnabled && (
            <div className="flex p-1 bg-white/5 border border-white/5 rounded-2xl relative">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all relative z-10",
                  mode === 'login' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                )}
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className={cn(
                  "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all relative z-10",
                  mode === 'signup' ? "bg-brand-primary text-white shadow-lg" : "text-slate-400 hover:text-white"
                )}
              >
                {language === 'ar' ? 'حساب جديد' : 'New Account'}
              </button>
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                  {language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600", isRTL ? "right-4" : "left-4")} />
                  <input
                    required={mode === 'signup'}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'ar' ? 'محمد أحمد' : 'John Doe'}
                    className={cn(
                      "w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 focus:bg-white/10 rounded-2xl py-4 outline-none transition-all text-white font-medium text-sm",
                      isRTL ? "pr-12 pl-6 text-right" : "pl-12 pr-6 text-left"
                    )}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600", isRTL ? "right-4" : "left-4")} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className={cn(
                    "w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 focus:bg-white/10 rounded-2xl py-4 outline-none transition-all text-white font-medium text-sm",
                    isRTL ? "pr-12 pl-6 text-right" : "pl-12 pr-6 text-left"
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600", isRTL ? "right-4" : "left-4")} />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={cn(
                    "w-full bg-white/5 border border-white/5 focus:border-brand-primary/50 focus:bg-white/10 rounded-2xl py-4 outline-none transition-all text-white font-medium text-sm",
                    isRTL ? "pr-12 pl-6 text-right" : "pl-12 pr-6 text-left"
                  )}
                />
              </div>
            </div>



            {mode === 'signup' && tenantConfig.termsEnabled && (
              <div className="flex items-start gap-3 mt-4 select-none">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-4.5 h-4.5 accent-brand-primary rounded-lg cursor-pointer shrink-0"
                />
                <label htmlFor="termsAccepted" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                  {language === 'ar' ? (
                    <>
                      لقد قرأت وأوافق على{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-brand-primary font-bold hover:underline inline ml-1 mr-1"
                      >
                        الشروط والأحكام
                      </button>
                    </>
                  ) : (
                    <>
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-brand-primary font-bold hover:underline inline ml-1 mr-1"
                      >
                        Terms and Conditions
                      </button>
                    </>
                  )}
                </label>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-brand-primary text-white font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-xl shadow-brand-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'login' ? (language === 'ar' ? 'دخول' : 'Sign In') : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')}</span>
                  <ArrowRight className={cn("w-5 h-5 transition-transform", isRTL ? "rotate-180" : "")} />
                </>
              )}
            </button>
          </form>

          {/* Social SSO Switch */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                {language === 'ar' ? 'أو عبر Google' : 'OR VIA GOOGLE'}
              </span>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <button
              onClick={() => signIn()}
              className="w-full py-4 rounded-2xl border border-white/5 hover:bg-white/5 text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              {t('sign_in_google')}
            </button>
          </div>

          {/* Mode Toggler footer link */}
          {isFreeTrialEnabled && (
            <p className="text-center text-xs text-slate-500 font-medium">
              {mode === 'signup'
                ? (language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?')
                : (language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?")
              }{' '}
              <button
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
                className="text-brand-primary font-bold hover:underline"
              >
                {mode === 'signup'
                  ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                  : (language === 'ar' ? 'حساب جديد' : 'Create Account')
                }
              </button>
            </p>
          )}
        </div>

        {/* Support contacts footer */}
        <div className="w-full pt-6 border-t border-white/5 text-center mt-10">
          <a
            href={currentWhatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-primary transition-colors text-xs font-bold"
          >
            <MessageCircle size={14} className="text-green-500 animate-pulse" />
            <span>{language === 'ar' ? 'تواصل معنا لتفعيل حسابك 💬' : 'Contact us to activate your account 💬'}</span>
          </a>
        </div>
      </div>

      {/* ── Right Column: Interactive Animated Graphic HUD ── */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-black/20 flex-col items-center justify-center p-12 overflow-hidden border-l border-white/5 select-none z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.08]" />
        
        {/* Ambient Pulsating Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-primary/5 blur-[140px] rounded-full pointer-events-none" />
        
        {/* Central Rotating HUD Widget */}
        <div className="relative w-[400px] h-[400px] flex items-center justify-center z-10">
           <motion.div 
              className="absolute border border-dashed border-brand-primary/20 rounded-full w-[360px] h-[360px]"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           />
           <motion.div 
              className="absolute border border-dotted border-brand-secondary/35 rounded-full w-[280px] h-[280px]"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           />
           <motion.div 
              className="absolute border border-dashed border-white/5 rounded-full w-[200px] h-[200px]"
              animate={{ rotate: 180 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
           />

           {/* Pulsing Brain core icon */}
           <div className="w-28 h-28 rounded-full bg-bg-card border border-white/10 flex items-center justify-center text-brand-primary shadow-[0_0_40px_rgba(99,102,241,0.25)] relative z-20">
              <Brain className="w-14 h-14 animate-pulse text-indigo-400/90" />
           </div>
        </div>

        {/* Floating Interactive Diagnostic Badges */}
        {/* Badge 1: DNA Sync Map */}
        <motion.div 
           className="absolute top-20 left-20 glass-card p-4 border-white/5 shadow-2xl flex items-center gap-3.5 z-20 max-w-[200px] bg-bg-card/90"
           animate={{ y: [-8, 8] }}
           transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
           <Dna className="text-indigo-400 shrink-0 animate-pulse" size={20} />
           <div>
              <p className="text-[8px] font-bold text-slate-500 uppercase">{language === 'ar' ? 'الشبكة العصبية' : 'NEURAL CORE'}</p>
              <span className="text-[10px] font-black text-white uppercase">{language === 'ar' ? 'متزامن بنسبة 98%' : 'SYNCED: 98%'}</span>
           </div>
        </motion.div>

        {/* Badge 2: AI Coach dialogue bubble */}
        <motion.div 
           className="absolute bottom-24 right-16 glass-card p-4 border-brand-primary/20 bg-brand-primary/5 shadow-2xl flex items-start gap-3 z-20 max-w-[260px]"
           animate={{ y: [10, -10] }}
           transition={{ duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
           <MessageCircle className="text-brand-primary shrink-0 mt-0.5" size={20} />
           <div className="space-y-1">
              <p className="text-[8px] font-bold text-slate-400 uppercase">{language === 'ar' ? 'استجابة المدرب' : 'COACH STATUS'}</p>
              <p className="text-[10px] font-extrabold text-white leading-normal">
                 {language === 'ar' ? 'تمت معايرة القشرة الجبهية بنجاح. حظر مشتتات التركيز نشط.' : 'Prefrontal flow synchronized successfully. Attention shielding active.'}
              </p>
           </div>
        </motion.div>

        {/* Badge 3: Social Toxicity Shield status */}
        <motion.div 
           className="absolute top-1/3 right-12 glass-card p-4 border-pink-500/20 bg-pink-500/[0.02] shadow-2xl flex items-center gap-3.5 z-20 max-w-[210px] bg-bg-card/90"
           animate={{ y: [-12, 12] }}
           transition={{ duration: 3.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
           <Shield className="text-pink-400 shrink-0" size={20} />
           <div>
             <p className="text-[8px] font-bold text-slate-500 uppercase">{language === 'ar' ? 'درع السمية' : 'TOXICITY SHIELD'}</p>
             <span className="text-[10px] font-black text-pink-400 uppercase">{language === 'ar' ? 'الدرع نشط ومستقر' : 'SHIELD STATUS: OK'}</span>
           </div>
        </motion.div>
      </div>

      {/* ── Terms & Conditions Popup Modal ── */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-2xl bg-bg-card/95 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[80vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-primary/10 border border-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                      {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {language === 'ar' ? 'الرجاء مراجعة الشروط قبل التسجيل' : 'Please review our terms before proceeding'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div 
                className="p-6 overflow-y-auto flex-1 text-slate-300 text-sm leading-relaxed" 
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  maxHeight: 'calc(80vh - 180px)',
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr' 
                }}
              >
                {language === 'ar' 
                  ? (tenantConfig.termsTextAr || 'الشروط والأحكام غير متوفرة حالياً.') 
                  : (tenantConfig.termsTextEn || 'Terms and conditions are currently unavailable.')
                }
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="px-5 py-3 rounded-xl border border-white/5 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTermsAccepted(true);
                    setShowTermsModal(false);
                  }}
                  className="bg-brand-primary hover:brightness-110 text-white font-black uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all"
                >
                  {language === 'ar' ? 'أوافق على الشروط' : 'I Agree to Terms'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

     </div>
   );
 }
