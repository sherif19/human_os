import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth, User } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { db, storage, libStorage } from '../lib/firebase';
import { DEFAULT_PACKAGES, TenantPackages } from '../lib/subscription';

const toolNamesMapEn: Record<string, string> = {
  neural_tests: 'Neural Diagnostic Tests',
  personality_dna: 'Personality DNA Mapping',
  archetype: 'Core Archetype Analysis',
  growth_velocity: 'Growth Velocity Tracking',
  growth_lab: 'Growth Lab Tasks',
  emotional_iq: 'Emotional IQ Analysis',
  social_iq: 'Social IQ Assessment',
  cog_load: 'Cognitive Load Diagnostics',
  toxicity: 'Toxicity Shield & Battery',
  ai_coach: 'AI Coach Conversations',
  book_appointment: 'Appointment Booking Requests',
  library: 'Data Resource Library'
};

const toolNamesMapAr: Record<string, string> = {
  neural_tests: 'الاختبارات العصبية التشخيصية',
  personality_dna: 'رسم خرائط الحمض النووي للشخصية',
  archetype: 'تحليل النموذج والذات العميقة',
  growth_velocity: 'مؤشر سرعة النمو الشخصي',
  growth_lab: 'مهام مختبر النمو العصبي',
  emotional_iq: 'مقياس ذكاء المشاعر والانفعالات',
  social_iq: 'مقياس الذكاء الاجتماعي والعلاقات',
  cog_load: 'الحمل المعرفي والسبل العميقة',
  toxicity: 'مصفوفة درع السمية والطاقة',
  ai_coach: 'جلسات مدرب الذكاء الاصطناعي',
  book_appointment: 'حجز واستشارة المواعيد الخاصة',
  library: 'مكتبة الموارد والبيانات الكاملة'
};
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  CreditCard,
  Smartphone,
  Copy,
  Check,
  UploadCloud,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Activity,
  Sparkles,
  DollarSign
} from 'lucide-react';

interface Plan {
  visible: boolean;
  name: string;
  price: string;
  currency: string;
  period: string;
  badge: string;
  ctaText: string;
  features: string[];
  nameEn: string;
  badgeEn: string;
  currencyEn: string;
  periodEn: string;
  ctaTextEn: string;
  featuresEn: string[];
  paddlePriceId?: string;
}

interface PaymentMethods {
  instapay: { enabled: boolean; address: string };
  vodafone: { enabled: boolean; number: string };
  etisalat: { enabled: boolean; number: string };
  orange: { enabled: boolean; number: string };
  paypal: { enabled: boolean; email: string };
  stripe: { enabled: boolean; publishableKey: string; secretKey: string; paymentLink: string };
  paddle: { enabled: boolean; clientKey: string; environment: 'sandbox' | 'production' };
}

interface TenantConfig {
  plan: Plan;
  paymentMethods?: PaymentMethods;
  whatsappNumber?: string;
  freeTrial?: { enabled: boolean; days: number };
  packages?: TenantPackages;
}

interface PaymentRecord {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  adminId: string;
  amount: string;
  currency: string;
  planName: string;
  planDuration: string;
  paymentMethod: string;
  receiptUrl?: string;
  stripeSessionId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: any;
}

const DEFAULT_PLAN: Plan = {
  visible: true,
  name: 'الباقة الاحترافية',
  price: '99',
  currency: 'ج.م',
  period: 'شهرياً',
  badge: 'الأكثر شعبية',
  ctaText: 'اشترك الآن',
  features: [
    'التأسيس والتهيئة العصبية',
    'الوصول الكامل إلى مدرب الذكاء الاصطناعي',
    'تقارير الحمض النووي للشخصية',
    'مصفوفة ودرع السمية الاجتماعية',
    'اتقان التركيز ومؤشر الانضباط',
  ],
  nameEn: 'Pro Optimization Plan',
  badgeEn: 'Most Popular',
  currencyEn: 'EGP',
  periodEn: 'monthly',
  ctaTextEn: 'Subscribe Now',
  featuresEn: [
    'Setup & neural configuration',
    'Full access to AI Coach interface',
    'Detailed Personality DNA mapping',
    'Toxicity shield & social energy trackers',
    'Focus mastery & discipline index metrics',
  ]
};

const DEFAULT_PAYMENT_METHODS: PaymentMethods = {
  instapay: { enabled: true, address: 'support@instapay' },
  vodafone: { enabled: true, number: '01012345678' },
  etisalat: { enabled: false, number: '' },
  orange: { enabled: false, number: '' },
  paypal: { enabled: false, email: '' },
  stripe: { enabled: false, publishableKey: '', secretKey: '', paymentLink: '' },
  paddle: { enabled: false, clientKey: '', environment: 'sandbox' }
};

export default function Billing() {
  const { user, updateUser } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Tenant configurations state
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  // Payments logic state
  const [pendingPayment, setPendingPayment] = useState<PaymentRecord | null>(null);
  const [loadingPending, setLoadingPending] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState<'vodafone' | 'etisalat' | 'orange' | 'instapay' | 'paypal' | 'stripe' | 'paddle' | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [stripeProcessing, setStripeProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [paddleLoading, setPaddleLoading] = useState(false);

  const packagesList: TenantPackages = tenantConfig?.packages || DEFAULT_PACKAGES;
  const [selectedPlanTier, setSelectedPlanTier] = useState<'bronze' | 'silver' | 'gold'>('bronze');

  useEffect(() => {
    if (packagesList) {
      const enabledTiers = (['bronze', 'silver', 'gold'] as const).filter(
        t => packagesList[t]?.enabled !== false
      );
      if (enabledTiers.length > 0 && !enabledTiers.includes(selectedPlanTier)) {
        setSelectedPlanTier(enabledTiers[0]);
      }
    }
  }, [packagesList]);
  const planInfo = {
    visible: true,
    name: language === 'ar' ? packagesList[selectedPlanTier].nameAr : packagesList[selectedPlanTier].nameEn,
    nameEn: packagesList[selectedPlanTier].nameEn,
    price: packagesList[selectedPlanTier].price,
    currency: packagesList[selectedPlanTier].currency,
    currencyEn: packagesList[selectedPlanTier].currencyEn,
    period: language === 'ar' ? packagesList[selectedPlanTier].period : packagesList[selectedPlanTier].periodEn,
    periodEn: packagesList[selectedPlanTier].periodEn,
    badge: selectedPlanTier === 'silver' ? (language === 'ar' ? 'الأكثر شعبية' : 'Most Popular') : '',
    badgeEn: selectedPlanTier === 'silver' ? 'Most Popular' : '',
    features: (packagesList[selectedPlanTier].unlockedTools || []).map(k => language === 'ar' ? toolNamesMapAr[k] || k : toolNamesMapEn[k] || k),
    featuresEn: (packagesList[selectedPlanTier].unlockedTools || []).map(k => toolNamesMapEn[k] || k),
    ctaText: language === 'ar' ? 'اشترك الآن' : 'Subscribe Now',
    ctaTextEn: 'Subscribe Now',
    paddlePriceId: (packagesList[selectedPlanTier] as any).paddlePriceId || tenantConfig?.plan?.paddlePriceId
  };
  const isPlanVisible = true;

  const hasConfiguredMethods = tenantConfig?.paymentMethods && 
    Object.values(tenantConfig.paymentMethods).some((m: any) => m?.enabled === true);

  const activePaymentMethods = hasConfiguredMethods 
    ? tenantConfig!.paymentMethods! 
    : DEFAULT_PAYMENT_METHODS;

  // Load and initialize Paddle SDK if client key is configured and enabled
  useEffect(() => {
    if (!activePaymentMethods.paddle?.enabled || !activePaymentMethods.paddle?.clientKey) return;

    const loadPaddle = () => {
      if ((window as any).Paddle) {
        (window as any).Paddle.Initialize({ 
          token: activePaymentMethods.paddle.clientKey,
          environment: activePaymentMethods.paddle.environment || 'sandbox'
        });
        return;
      }

      const script = document.createElement('script');
      script.src = "https://cdn.paddle.com/paddle/v3/paddle.js";
      script.async = true;
      script.onload = () => {
        if ((window as any).Paddle) {
          (window as any).Paddle.Initialize({ 
            token: activePaymentMethods.paddle.clientKey,
            environment: activePaymentMethods.paddle.environment || 'sandbox'
          });
        }
      };
      document.body.appendChild(script);
    };

    loadPaddle();
  }, [activePaymentMethods.paddle?.enabled, activePaymentMethods.paddle?.clientKey, activePaymentMethods.paddle?.environment]);

  const handlePaddleCheckout = async () => {
    if (!user) return;
    
    if (!(window as any).Paddle) {
      toast(language === 'ar' ? 'فشل تحميل مكتبة دفع Paddle' : 'Failed to load Paddle SDK', 'error');
      return;
    }

    const paddlePriceId = planInfo.paddlePriceId;
    if (!paddlePriceId) {
      toast(language === 'ar' ? 'بوابة Paddle غير مهيأة لهذه الباقة في إعدادات المسؤول.' : 'Paddle Price ID is not configured for this plan in Admin settings.', 'error');
      return;
    }

    setPaddleLoading(true);
    try {
      (window as any).Paddle.Checkout.open({
        items: [
          {
            priceId: paddlePriceId,
            quantity: 1
          }
        ],
        customer: {
          email: user.email || ''
        },
        customData: {
          userId: user.uid,
          adminId: adminId,
          planId: (planInfo.nameEn || planInfo.name || 'Pro Plan'),
          durationDays: (planInfo.periodEn?.includes('year') ? '365' : '30')
        }
      });
    } catch (err: any) {
      console.error(err);
      toast(language === 'ar' ? 'فشل بدء معالجة الدفع عبر Paddle' : 'Failed to initialize Paddle checkout', 'error');
    } finally {
      setPaddleLoading(false);
    }
  };

  // Resolved tenant admin ID
  const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');

  const toast = (msg: string, type = 'info') => {
    const toastEl = document.createElement('div');
    toastEl.style.cssText = `position:fixed;bottom:20px;${isRTL ? 'right' : 'left'}:20px;padding:12px 24px;border-radius:8px;background:${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};color:#fff;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.1);font-weight:bold;font-size:12px;`;
    toastEl.textContent = msg;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 4000);
  };

  // Load configured tenant data
  useEffect(() => {
    if (!adminId) {
      setLoadingConfig(false);
      return;
    }
    setLoadingConfig(true);
    getDoc(doc(db, 'tenants', adminId))
      .then(snap => {
        if (snap.exists()) {
          setTenantConfig(snap.data() as TenantConfig);
        }
      })
      .catch((err) => {
        console.error("Error loading billing details:", err);
      })
      .finally(() => {
        setLoadingConfig(false);
      });
  }, [adminId]);

  // Load user's pending payments to enforce uploader lock
  useEffect(() => {
    if (!user?.uid) {
      setLoadingPending(false);
      return;
    }
    setLoadingPending(true);

    const q = query(
      collection(db, 'payments'),
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Grab the most recent pending payment
        const docSnap = snapshot.docs[0];
        setPendingPayment({ id: docSnap.id, ...docSnap.data() } as PaymentRecord);
      } else {
        setPendingPayment(null);
      }
      setLoadingPending(false);
    }, (err) => {
      console.error("Error watching pending payments:", err);
      setLoadingPending(false);
    });

    return () => unsub();
  }, [user?.uid]);

  // Handle Stripe Redirection Success Parameter validation
  useEffect(() => {
    const isStripeSuccess = searchParams.get('stripe') === 'success';
    const sessionId = searchParams.get('session_id');

    if (isStripeSuccess && sessionId && user?.uid) {
      const processStripePayment = async () => {
        setStripeProcessing(true);
        setErrorMsg(null);
        try {
          // 1. Replay fraud protection check
          const q = query(
            collection(db, 'payments'),
            where('stripeSessionId', '==', sessionId)
          );
          const snap = await getDocs(q);

          if (!snap.empty) {
            // Already processed
            toast(language === 'ar' ? 'تم معالجة هذا الاشتراك مسبقاً.' : 'This checkout session was already processed.', 'info');
            setStripeProcessing(false);
            // Clear URL params
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
            return;
          }

          // 2. Add approved payment receipt
          const userEmail = user.email || `${user.uid}@humanos.ai`;
          const userName = user.name || userEmail.split('@')[0];

          await addDoc(collection(db, 'payments'), {
            userId: user.uid,
            userName: userName,
            userEmail: userEmail,
            adminId: adminId,
            amount: planInfo.price || '99',
            currency: language === 'ar' ? (planInfo.currency || 'ج.م') : (planInfo.currencyEn || 'EGP'),
            planName: language === 'ar' ? (planInfo.name || 'الباقة الاحترافية') : (planInfo.nameEn || 'Pro Optimization Plan'),
            planDuration: language === 'ar' ? (planInfo.period || 'شهرياً') : (planInfo.periodEn || 'monthly'),
            paymentMethod: 'stripe',
            stripeSessionId: sessionId,
            status: 'approved',
            createdAt: serverTimestamp()
          });

          // 3. Add to sales record
          await addDoc(collection(db, 'sales'), {
            userId: user.uid,
            customerName: userName,
            amount: Number(planInfo.price || '99'),
            adminId: adminId,
            createdAt: serverTimestamp()
          });

          // 4. Update expiresAt in users collection
          let baseDate = Date.now();
          const currentExpires = user.expiresAt;
          if (currentExpires) {
            const currentMs = currentExpires.toDate
              ? currentExpires.toDate().getTime()
              : (currentExpires.seconds ? currentExpires.seconds * 1000 : new Date(currentExpires).getTime());
            if (currentMs > Date.now()) {
              baseDate = currentMs;
            }
          }

          let daysToAdd = 30;
          const duration = planInfo.periodEn || 'monthly';
          if (duration.includes('year') || duration.includes('سنو')) daysToAdd = 365;
          else if (duration.includes('time') || duration.includes('مرة')) daysToAdd = 9999;

          const newExpiresDate = new Date(baseDate);
          newExpiresDate.setDate(newExpiresDate.getDate() + daysToAdd);

          await updateUser({
            expiresAt: newExpiresDate,
            isTrial: false
          });

          toast(t('branding.paymentSuccess'), 'success');

          // Clear URL params
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);

        } catch (err: any) {
          console.error("Stripe verification failed:", err);
          setErrorMsg(language === 'ar' ? 'فشلت عملية التحقق من الدفع عبر Stripe.' : 'Failed to verify Stripe checkout session.');
        } finally {
          setStripeProcessing(false);
        }
      };

      processStripePayment();
    }
  }, [searchParams, user]);

  // Handle manual receipt file uploads
  const handleReceiptUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile || !user?.uid || !adminId) return;

    setUploading(true);
    setErrorMsg(null);
    try {
      const timestamp = Date.now();
      const storageRef = ref(libStorage, `receipts/${adminId}/${user.uid}_${timestamp}`);
      
      const uploadResult = await uploadBytes(storageRef, receiptFile);
      const receiptUrl = await getDownloadURL(uploadResult.ref);

      const userEmail = user.email || `${user.uid}@humanos.ai`;
      const userName = user.name || userEmail.split('@')[0];

      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
        userName: userName,
        userEmail: userEmail,
        adminId: adminId,
        amount: planInfo.price || '99',
        currency: language === 'ar' ? (planInfo.currency || 'ج.م') : (planInfo.currencyEn || 'EGP'),
        planName: language === 'ar' ? (planInfo.name || 'الباقة الاحترافية') : (planInfo.nameEn || 'Pro Optimization Plan'),
        planDuration: language === 'ar' ? (planInfo.period || 'شهرياً') : (planInfo.periodEn || 'monthly'),
        paymentMethod: selectedMethod || 'vodafone',
        receiptUrl: receiptUrl,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setUploadSuccess(true);
      setReceiptFile(null);
      toast(language === 'ar' ? 'تم إرسال إثبات الدفع بنجاح! جاري المراجعة.' : 'Payment receipt uploaded successfully! Under review.', 'success');
    } catch (err: any) {
      console.error("Failed uploading receipt:", err);
      setErrorMsg(language === 'ar' ? 'فشل رفع إثبات الدفع. يرجى المحاولة لاحقاً.' : 'Failed to upload billing receipt.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getDaysRemaining = () => {
    if (user?.isTrial) {
      let expiresMs = 0;
      if (user.expiresAt) {
        const ts = user.expiresAt;
        expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      } else if (user.trialStartedAt) {
        const trialDays = tenantConfig?.freeTrial?.days || 7;
        const ts = user.trialStartedAt;
        const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
        expiresMs = startMs + trialDays * 86400000;
      }
      if (expiresMs) {
        return Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
      }
    }
    if (!user?.expiresAt) return 0;
    const ts = user.expiresAt;
    const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
    return Math.max(0, Math.ceil((expiresMs - Date.now()) / 86400000));
  };

  const isSubscriptionActive = () => {
    if (user?.isTrial) {
      let expiresMs = 0;
      if (user.expiresAt) {
        const ts = user.expiresAt;
        expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
      } else if (user.trialStartedAt) {
        const trialDays = tenantConfig?.freeTrial?.days || 7;
        const ts = user.trialStartedAt;
        const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
        expiresMs = startMs + trialDays * 86400000;
      }
      if (expiresMs) {
        return expiresMs > Date.now();
      }
    }
    if (!user?.expiresAt) return false;
    const ts = user.expiresAt;
    const expiresMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
    return expiresMs > Date.now();
  };

  const dateLocale = isRTL ? 'ar-EG' : 'en-US';
  const daysLeft = getDaysRemaining();
  const isActive = isSubscriptionActive();

  const formattedExpiryDate = () => {
    if (user?.isTrial) {
      let expiresDate: Date | null = null;
      if (user.expiresAt) {
        const ts = user.expiresAt;
        expiresDate = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts));
      } else if (user.trialStartedAt) {
        const trialDays = tenantConfig?.freeTrial?.days || 7;
        const ts = user.trialStartedAt;
        const startMs = ts.toDate ? ts.toDate().getTime() : (ts.seconds ? ts.seconds * 1000 : new Date(ts).getTime());
        expiresDate = new Date(startMs + trialDays * 86400000);
      }
      if (expiresDate) {
        return expiresDate.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
      }
    }
    if (!user?.expiresAt) return '—';
    const ts = user.expiresAt;
    const date = ts.toDate ? ts.toDate() : (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts));
    return date.toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // UI loading state
  if (loadingConfig || loadingPending || stripeProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Activity className="w-10 h-10 text-brand-primary animate-pulse" />
        <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">
          {stripeProcessing
            ? (language === 'ar' ? 'جاري التحقق من الدفع... 💳' : 'Verifying transaction context... 💳')
            : t('common.loading')}
        </span>
      </div>
    );
  }

  // Admin notification view
  if (user?.role === 'admin' || user?.role === 'super_admin') {
    return (
      <div className="max-w-xl mx-auto space-y-6 pb-20">
        <div className="glass-card flex flex-col justify-center items-center text-center p-8 border border-indigo-500/10">
          <ShieldCheck size={48} className="text-indigo-400 mb-4 animate-bounce" />
          <h2 className="text-2xl font-black text-white uppercase  tracking-tighter mb-2">
            {language === 'ar' ? 'حساب إداري' : 'Administrative Account'}
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
            {language === 'ar'
              ? 'أنت مسجل حالياً كمسؤول أو مالك النظام. حسابك لا يخضع لخطط الدفع العادية ويتمتع بحرية كاملة للوصول.'
              : 'You are logged in as an Administrator or Owner. Your subscription is managed system-wide with full developer authority.'}
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-2.5 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all"
          >
            {language === 'ar' ? 'الذهاب للوحة المدير' : 'Go to Admin Dashboard'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white  uppercase tracking-tighter">
          {t('branding.billingTitle')}
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          {t('branding.billingDesc')}
        </p>
      </div>

      {errorMsg && (
        <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Subscription Status Card */}
      <div className="glass-card border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
          {t('branding.currentStatus')}
        </h3>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                isActive
                  ? (user?.isTrial 
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400')
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {isActive 
                  ? (user?.isTrial 
                    ? (language === 'ar' ? 'فترة تجريبية نشطة' : 'Free Trial Active') 
                    : t('branding.subscriptionActive')) 
                  : (user?.isTrial 
                    ? (language === 'ar' ? 'انتهت الفترة التجريبية' : 'Free Trial Expired') 
                    : t('branding.subscriptionExpired'))}
              </span>
              {isActive && (
                <span className="text-[10px] text-slate-400 font-bold bg-white/5 px-2 py-0.5 rounded-full">
                  {daysLeft} {t('admin.daysLeft')}
                </span>
              )}
            </div>
            <div className="text-slate-400 text-xs font-bold mt-2">
              {t('branding.expiresOn')}: <span className="text-white font-mono">{formattedExpiryDate()}</span>
            </div>
          </div>

          {!isActive && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl w-full">
              <div className="flex items-center gap-2 flex-1">
                <AlertTriangle size={16} className="flex-shrink-0 text-amber-500" />
                <span>
                  {user?.isTrial 
                    ? (language === 'ar' 
                      ? 'انتهت الفترة التجريبية الخاصة بك. يرجى التواصل معنا عبر الواتساب لتفعيل حسابك.' 
                      : 'Your free trial has ended. Please contact us via WhatsApp to activate your account.')
                    : (language === 'ar' 
                      ? 'الرجاء تجديد الاشتراك لتجنب انقطاع الخدمة.' 
                      : 'Please renew subscription to unlock diagnostics.')
                  }
                </span>
              </div>
              {user?.isTrial && (() => {
                const whatsappNumber = tenantConfig?.whatsappNumber;
                const whatsappLink = whatsappNumber 
                  ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحسابي (${user?.email}) وأود تفعيل الاشتراك.` : `Hello, my free trial has ended for (${user?.email}) and I would like to activate my subscription.`)}`
                  : `https://wa.me/201145680938?text=${encodeURIComponent(language === 'ar' ? `مرحباً، لقد انتهت الفترة التجريبية لحسابي (${user?.email}) وأرغب في تفعيل الاشتراك.` : `Hello, my free trial has ended for (${user?.email}) and I would like to activate my subscription.`)}`;
                return (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors whitespace-nowrap self-stretch sm:self-auto justify-center"
                  >
                    <span>{language === 'ar' ? 'تواصل عبر الواتساب لتفعيل الحساب' : 'Activate via WhatsApp'}</span>
                  </a>
                );
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Three Evolution Tiers Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(['bronze', 'silver', 'gold'] as const)
          .filter(tier => (packagesList[tier] || DEFAULT_PACKAGES[tier]).enabled !== false)
          .map((tier) => {
            const plan = packagesList[tier] || DEFAULT_PACKAGES[tier];
          const isSelected = selectedPlanTier === tier;
          const isUserCurrent = user?.subscriptionTier === tier && isActive;
          
          const tierColors = {
            bronze: { text: '#cd7f32', border: 'rgba(205, 127, 50, 0.2)', bg: 'rgba(205, 127, 50, 0.03)' },
            silver: { text: '#c0c0c0', border: 'rgba(192, 192, 192, 0.2)', bg: 'rgba(192, 192, 192, 0.03)' },
            gold: { text: '#ffd700', border: 'rgba(255, 215, 0, 0.2)', bg: 'rgba(255, 215, 0, 0.03)' }
          };
          const colors = tierColors[tier];

          return (
            <div 
              key={tier}
              onClick={() => {
                setSelectedPlanTier(tier);
                setSelectedMethod(null);
              }}
              className={`glass-card border flex flex-col justify-between cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                isSelected 
                  ? 'border-brand-primary shadow-lg shadow-brand-primary/5' 
                  : 'border-white/5 hover:border-white/10'
              }`}
              style={{
                background: isSelected ? 'rgba(99,102,241,0.03)' : 'rgba(255,255,255,0.01)'
              }}
            >
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="text-lg font-black tracking-tight uppercase" style={{ color: colors.text }}>
                    {language === 'ar' ? plan.nameAr : plan.nameEn}
                  </h4>
                  {isUserCurrent && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded">
                      {language === 'ar' ? 'باقاتك الحالية' : 'Current Plan'}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex items-baseline gap-1 text-white">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-xs font-bold text-slate-400 font-mono">
                    {language === 'ar' ? plan.currency : plan.currencyEn} / {language === 'ar' ? plan.period : plan.periodEn}
                  </span>
                </div>

                <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mt-4 mb-2">
                  {language === 'ar' ? 'الأدوات والميزات المتاحة:' : 'Unlocked Tools & Features:'}
                </div>
                <ul className="space-y-2 text-[11px] text-slate-400 font-semibold max-h-[220px] overflow-y-auto no-scrollbar">
                  {(plan.unlockedTools || []).map((toolKey) => {
                    const toolName = language === 'ar' ? toolNamesMapAr[toolKey] || toolKey : toolNamesMapEn[toolKey] || toolKey;
                    return (
                      <li key={toolKey} className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-brand-primary flex-shrink-0" />
                        <span>{toolName}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                type="button"
                className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all mt-6 ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'bg-white/5 border border-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {isSelected 
                  ? (language === 'ar' ? 'تم اختيار الباقة' : 'Plan Selected') 
                  : (language === 'ar' ? 'اختر الباقة' : 'Choose Plan')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment Selection for Selected Tier */}
      <div className="glass-card border border-white/5 flex flex-col justify-between">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
            {language === 'ar' 
              ? `إتمام عملية الدفع لباقة: ${planInfo.name}`
              : `Complete payment for: ${planInfo.nameEn}`}
          </h3>
          <p className="text-slate-400 text-xs font-medium mb-6">
            {language === 'ar'
              ? `حدد طريقة الدفع المفضلة لديك لتحويل مبلغ ${planInfo.price} ${planInfo.currency}.`
              : `Select your preferred payment gateway to transfer ${planInfo.price} ${planInfo.currencyEn}.`}
          </p>

          {/* Duplicate check constraint: locked pending status */}
          {pendingPayment ? (
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex flex-col items-center text-center space-y-4">
              <Clock size={36} className="text-amber-500 animate-spin" />
              <h4 className="text-sm font-black text-white uppercase tracking-tight">
                {t('branding.receiptSubmittedTitle')}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                {t('branding.receiptSubmittedDesc')}
              </p>
              <div className="w-full pt-4 border-t border-white/5 text-[11px] text-slate-500 font-mono space-y-1 text-start">
                <div>{language === 'ar' ? 'المبلغ:' : 'Amount:'} {pendingPayment.amount} {pendingPayment.currency}</div>
                <div>{language === 'ar' ? 'الباقة:' : 'Plan:'} {pendingPayment.planName}</div>
                <div>{language === 'ar' ? 'طريقة التحويل:' : 'Method:'} <span className="capitalize">{pendingPayment.paymentMethod}</span></div>
                <div>
                  {language === 'ar' ? 'تاريخ التقديم:' : 'Submitted:'} 
                  {pendingPayment.createdAt?.toDate 
                    ? pendingPayment.createdAt.toDate().toLocaleString(dateLocale) 
                    : pendingPayment.createdAt ? new Date(pendingPayment.createdAt.seconds * 1000).toLocaleString(dateLocale) : '—'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Vodafone Cash */}
                {activePaymentMethods.vodafone?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('vodafone')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'vodafone'
                        ? 'bg-red-500/10 border-red-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone size={18} className={selectedMethod === 'vodafone' ? 'text-red-500' : 'text-slate-500'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentVodafoneCash')}</span>
                  </button>
                )}

                {/* Etisalat Cash */}
                {activePaymentMethods.etisalat?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('etisalat')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'etisalat'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone size={18} className={selectedMethod === 'etisalat' ? 'text-emerald-500' : 'text-slate-500'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentEtisalatCash')}</span>
                  </button>
                )}

                {/* Orange Cash */}
                {activePaymentMethods.orange?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('orange')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'orange'
                        ? 'bg-orange-500/10 border-orange-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone size={18} className={selectedMethod === 'orange' ? 'text-orange-500' : 'text-slate-500'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentOrangeCash')}</span>
                  </button>
                )}

                {/* InstaPay */}
                {activePaymentMethods.instapay?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('instapay')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'instapay'
                        ? 'bg-purple-500/10 border-purple-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`text-[15px] font-black ${selectedMethod === 'instapay' ? 'text-purple-400' : 'text-slate-500'}`}>⚡</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentInstapay')}</span>
                  </button>
                )}

                {/* PayPal */}
                {activePaymentMethods.paypal?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('paypal')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'paypal'
                        ? 'bg-blue-500/10 border-blue-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className={`text-[15px] ${selectedMethod === 'paypal' ? 'text-blue-400' : 'text-slate-500'}`}>🌐</span>
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentPaypal')}</span>
                  </button>
                )}

                {/* Stripe */}
                {activePaymentMethods.stripe?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('stripe')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'stripe'
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard size={18} className={selectedMethod === 'stripe' ? 'text-indigo-400' : 'text-slate-500'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentStripe')}</span>
                  </button>
                )}

                {/* Paddle */}
                {activePaymentMethods.paddle?.enabled && (
                  <button
                    onClick={() => setSelectedMethod('paddle')}
                    className={`p-4 border rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all ${
                      selectedMethod === 'paddle'
                        ? 'bg-sky-500/10 border-sky-500/30 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard size={18} className={selectedMethod === 'paddle' ? 'text-sky-400' : 'text-slate-500'} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('branding.paymentPaddle')}</span>
                  </button>
                )}
              </div>

              {/* Manual Payment detail view & receipt upload */}
              {selectedMethod && selectedMethod !== 'stripe' && selectedMethod !== 'paddle' && (
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs font-medium text-slate-300">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      {t('branding.manualPaymentInstructions')}
                    </div>

                    {selectedMethod === 'vodafone' && (
                      <div className="flex justify-between items-center bg-[#09090b] px-4 py-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-white text-[13px]">{activePaymentMethods.vodafone?.number}</span>
                        <button
                          onClick={() => copyToClipboard(activePaymentMethods.vodafone?.number || '', 'vodafone')}
                          className="text-slate-500 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-black tracking-widest"
                        >
                          {copiedField === 'vodafone' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedField === 'vodafone' ? t('branding.copied') : t('branding.copyDetails')}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'etisalat' && (
                      <div className="flex justify-between items-center bg-[#09090b] px-4 py-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-white text-[13px]">{activePaymentMethods.etisalat?.number}</span>
                        <button
                          onClick={() => copyToClipboard(activePaymentMethods.etisalat?.number || '', 'etisalat')}
                          className="text-slate-500 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-black tracking-widest"
                        >
                          {copiedField === 'etisalat' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedField === 'etisalat' ? t('branding.copied') : t('branding.copyDetails')}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'orange' && (
                      <div className="flex justify-between items-center bg-[#09090b] px-4 py-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-white text-[13px]">{activePaymentMethods.orange?.number}</span>
                        <button
                          onClick={() => copyToClipboard(activePaymentMethods.orange?.number || '', 'orange')}
                          className="text-slate-500 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-black tracking-widest"
                        >
                          {copiedField === 'orange' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedField === 'orange' ? t('branding.copied') : t('branding.copyDetails')}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'instapay' && (
                      <div className="flex justify-between items-center bg-[#09090b] px-4 py-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-white text-[13px]">{activePaymentMethods.instapay?.address}</span>
                        <button
                          onClick={() => copyToClipboard(activePaymentMethods.instapay?.address || '', 'instapay')}
                          className="text-slate-500 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-black tracking-widest"
                        >
                          {copiedField === 'instapay' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedField === 'instapay' ? t('branding.copied') : t('branding.copyDetails')}</span>
                        </button>
                      </div>
                    )}

                    {selectedMethod === 'paypal' && (
                      <div className="flex justify-between items-center bg-[#09090b] px-4 py-2.5 rounded-xl border border-white/5">
                        <span className="font-mono text-white text-[13px]">{activePaymentMethods.paypal?.email}</span>
                        <button
                          onClick={() => copyToClipboard(activePaymentMethods.paypal?.email || '', 'paypal')}
                          className="text-slate-500 hover:text-white transition-all flex items-center gap-1 text-[10px] uppercase font-black tracking-widest"
                        >
                          {copiedField === 'paypal' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          <span>{copiedField === 'paypal' ? t('branding.copied') : t('branding.copyDetails')}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* File drop / Uploader form */}
                  <form onSubmit={handleReceiptUpload} className="space-y-4">
                    <label className="border-2 border-dashed border-white/10 hover:border-brand-primary/40 bg-white/[0.01] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
                      <UploadCloud size={28} className="text-slate-500" />
                      <span className="text-xs text-slate-400 font-bold uppercase text-center max-w-xs">
                        {receiptFile ? receiptFile.name : t('branding.dragAndDropReceipt')}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                        className="hidden"
                        required
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={uploading || !receiptFile}
                      className="w-full py-3 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Clock size={14} className="animate-spin" />
                          <span>{t('branding.uploadingReceipt')}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} />
                          <span>{t('branding.submitReceipt')}</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Stripe Payment Redirect UI */}
              {selectedMethod === 'stripe' && (
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed text-start">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      {t('branding.stripeCardTitle')}
                    </div>
                    {t('branding.stripeRedirectDesc')}
                  </div>

                  <a
                    href={activePaymentMethods.stripe?.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink size={14} />
                    <span>{t('branding.stripePayNow')}</span>
                  </a>
                </div>
              )}

              {/* Paddle Payment Redirect UI */}
              {selectedMethod === 'paddle' && (
                <div className="pt-4 border-t border-white/5 space-y-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-slate-300 leading-relaxed text-start">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      {t('branding.paymentPaddle')}
                    </div>
                    {language === 'ar'
                      ? 'سيتم فتح نافذة دفع آمنة خاصة بـ Paddle لإتمام عملية الاشتراك بنجاح.'
                      : 'A secure Paddle checkout window will open to complete your subscription.'}
                  </div>

                  <button
                    onClick={handlePaddleCheckout}
                    disabled={paddleLoading}
                    className="w-full py-3 bg-sky-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:brightness-110 shadow-lg shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
                  >
                    {paddleLoading ? (
                      <>
                        <Clock size={14} className="animate-spin" />
                        <span>{t('common.loading')}</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink size={14} />
                        <span>{language === 'ar' ? 'ادفع الآن بواسطة Paddle 💳' : 'Pay Now with Paddle 💳'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
