import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Palette, Type, Image, Save, RefreshCw, Eye, Upload, X, CreditCard, Plus, Trash2, Link, Copy, MessageCircle, Clock, Cpu, Shield } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, libStorage } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';

const DICTIONARY_GROUPS = [
  {
    id: 'hero',
    titleKey: 'branding.heroSection',
    keys: ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_sub', 'get_started', 'view_demo', 'sign_in_now', 'initiating_neural_scan']
  },
  {
    id: 'hud',
    titleKey: 'branding.hudSection',
    keys: [
      'hud_header_status',
      'hud_s1_title', 'hud_s1_prompt', 'hud_s1_log1', 'hud_s1_log2', 'hud_s1_log3', 'hud_s1_log4',
      'hud_s2_title', 'hud_s2_prompt', 'hud_s2_log1', 'hud_s2_log2', 'hud_s2_log3', 'hud_s2_log4',
      'hud_s3_title', 'hud_s3_prompt', 'hud_s3_log1', 'hud_s3_log2', 'hud_s3_log3', 'hud_s3_log4'
    ]
  },
  {
    id: 'stats',
    titleKey: 'branding.statsSection',
    keys: ['stats_1_label', 'stats_1_value', 'stats_2_label', 'stats_2_value', 'stats_3_label', 'stats_3_value']
  },
  {
    id: 'vision',
    titleKey: 'branding.problemsSection',
    keys: [
      'vision_title', 'vision_heading', 'vision_desc', 
      'vision_legacy_badge', 'vision_legacy_title', 'vision_card1_title', 'vision_card1_desc', 'vision_card2_title', 'vision_card2_desc', 'vision_card3_title', 'vision_card3_desc',
      'vision_opt_badge', 'vision_opt_title', 'vision_opt_card1_title', 'vision_opt_card1_desc', 'vision_opt_card2_title', 'vision_opt_card2_desc', 'vision_opt_card3_title', 'vision_opt_card3_desc'
    ]
  },
  {
    id: 'architecture',
    titleKey: 'branding.solutionSection',
    keys: [
      'architecture_title', 'architecture_heading', 
      'architecture_card1_title', 'architecture_card1_desc', 
      'architecture_card2_title', 'architecture_card2_desc', 
      'architecture_card3_title', 'architecture_card3_desc', 
      'architecture_card4_title', 'architecture_card4_desc',
      'toolset_title', 'tools_heading', 'view_full_catalog',
      'logic_flow_engine', 'neural_conflict_res', 'deep_sleep_protocol', 'body_language_scan', 'focus_recovery'
    ]
  },
  {
    id: 'library',
    titleKey: 'branding.librarySection',
    keys: [
      'library_heading', 'library', 'library_desc', 'explore_repository', 'books', 'templates', 'ai_guides', 'ecosystem',
      'books_tag1', 'books_label1', 'books_title1', 'books_desc1',
      'books_tag2', 'books_label2', 'books_title2', 'books_desc2',
      'books_tag3', 'books_label3', 'books_title3', 'books_desc3',
      'books_tag4', 'books_label4', 'books_title4', 'books_desc4'
    ]
  },
  {
    id: 'tools_section',
    titleKey: 'branding.toolsCatalogSection',
    keys: ['cat_all', 'cat_cognitive', 'cat_emotional', 'cat_social', 'cat_growth', 'cat_bio', 'search_placeholder']
  },
  {
    id: 'quiz',
    titleKey: 'branding.quizSection',
    keys: [
      'quiz_title', 'quiz_subtitle',
      'quiz_q1_title', 'quiz_q1_optA', 'quiz_q1_optB', 'quiz_q1_optC',
      'quiz_q2_title', 'quiz_q2_optA', 'quiz_q2_optB', 'quiz_q2_optC',
      'quiz_q3_title', 'quiz_q3_optA', 'quiz_q3_optB', 'quiz_q3_optC',
      'diagnostic_completed', 'recommended_protocol', 'claim_my_trial', 're_scan', 'flow_energy',
      'cognitive_focus', 'emotional_eq', 'habit_velocity',
      'arch_architect_title', 'arch_architect_desc', 'arch_architect_mod',
      'arch_alchemist_title', 'arch_alchemist_desc', 'arch_alchemist_mod',
      'arch_catalyst_title', 'arch_catalyst_desc', 'arch_catalyst_mod'
    ]
  },
  {
    id: 'pricing',
    titleKey: 'branding.pricingFaqSection',
    keys: [
      'pricing_title', 'pricing_heading', 'pricing_badge_popular', 'initialize_phase',
      'pricing_monthly', 'pricing_yearly', 'pricing_save_percentage',
      'pricing_plan1_name', 'pricing_plan1_price', 'pricing_plan1_feat1', 'pricing_plan1_feat2', 'pricing_plan1_feat3',
      'pricing_plan2_name', 'pricing_plan2_price', 'pricing_plan2_feat1', 'pricing_plan2_feat2', 'pricing_plan2_feat3',
      'pricing_plan3_name', 'pricing_plan3_price', 'pricing_plan3_feat1', 'pricing_plan3_feat2', 'pricing_plan3_feat3'
    ]
  },
  {
    id: 'faq',
    titleKey: 'branding.faqSection',
    keys: ['faq_title', 'faq_heading', 'faq_q1', 'faq_a1', 'faq_q2', 'faq_a2', 'faq_q3', 'faq_a3', 'faq_q4', 'faq_a4']
  },
  {
    id: 'reviews',
    titleKey: 'branding.reviewsSection',
    keys: [
      'reviews_heading', 'reviews_subheading', 
      'review_1_text', 'review_1_author', 'review_1_role', 
      'review_2_text', 'review_2_author', 'review_2_role', 
      'review_3_text', 'review_3_author', 'review_3_role', 
      'review_4_text', 'review_4_author', 'review_4_role'
    ]
  },
  {
    id: 'footer',
    titleKey: 'branding.footerSection',
    keys: [
      'footer_text', 'footer_subtext', 'footer_product_heading', 'footer_legal_heading', 
      'footer_link_dna', 'footer_link_coach', 'footer_link_library', 'footer_link_pricing', 
      'footer_link_privacy', 'footer_link_terms', 'footer_link_data', 
      'footer_social_twitter', 'footer_social_discord', 'footer_social_medium'
    ]
  }
];

const DEFAULT_PLAN = {
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

const DEFAULTS = {
  appName: 'HumanOS AI',
  appNameEn: 'HumanOS AI',
  tagline: 'مساعدك الذكي للتطوير الشخصي والمهني',
  taglineEn: 'Your Intelligent Assistant for Personal & Professional Development',
  primaryColor: '#6366f1',
  accentColor: '#a855f7',
  bgColor: '#09090b',
  panelColor: '#111113',
  navBgColor: '#09090b',
  sidebarBgColor: '#0c0c0e',
  footerBgColor: '#09090b',
  textColor: '#e2e8f0',
  text2Color: '#94a3b8',
  logoUrl: '',
  footerText: '© 2026 HumanOS AI — نظام تشغيل الأداء البشري الذكي',
  footerTextEn: '© 2026 HumanOS AI — The Ultimate OS for Personal Evolution',
  heroBadge: 'النظام الأول للتطور البشري بالذكاء الاصطناعي',
  heroBadgeEn: 'The #1 System for AI-Driven Human Evolution',
  heroSub: 'HumanOS AI ليس مجرد تطبيق — بل هو مرشدك العصبي لتطوير ذكائك العاطفي وإنتاجيتك.',
  heroSubEn: 'HumanOS AI is not just an app — it\'s your neural guide to optimize emotional intelligence & productivity.',
  domain: '',
  plan: DEFAULT_PLAN,
  whatsappNumber: '',
  freeTrial: { enabled: false, days: 7 },
  i18nOverrides: { ar: {}, en: {} },
  geminiApiKey: '',
  termsEnabled: false,
  termsTextAr: '',
  termsTextEn: '',
};

const BrandingSettings = () => {
  const { language, isRTL } = useLanguage();
  const t = (key) => translations[language][key] || key;
  const { user: currentUser } = useAuth();
  const [config, setConfig] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const iframeRef = useRef(null);
  const debounceRef = useRef(null);
  const [openGroup, setOpenGroup] = useState(null);

  const handleOverrideChange = (lang, key, value) => {
    const currentOverrides = config.i18nOverrides || { ar: {}, en: {} };
    const nextOverrides = {
      ...currentOverrides,
      [lang]: {
        ...(currentOverrides[lang] || {}),
        [key]: value
      }
    };
    if (!value) {
      delete nextOverrides[lang][key];
    }
    handleChange('i18nOverrides', nextOverrides);
  };

  // Load existing tenant config
  useEffect(() => {
    if (!currentUser?.uid) return;
    getDoc(doc(db, 'tenants', currentUser.uid))
      .then(snap => {
        const data = snap.exists() ? snap.data() : {};
        // Auto-detect parent platform domain when embedded in iframe
        try {
          if (window !== window.top) {
            let parentHost = null;
            // ancestorOrigins: most reliable, works even without referrer header
            if (window.location.ancestorOrigins?.length) {
              parentHost = new URL(window.location.ancestorOrigins[0]).hostname;
            } else if (document.referrer) {
              parentHost = new URL(document.referrer).hostname;
            }
            if (parentHost && parentHost !== window.location.hostname) {
              data.domain = parentHost;
            }
          }
        } catch (_) { }
        setConfig(prev => {
          const mergedPlan = {
            ...prev.plan,
            ...(data.plan || {}),
          };
          if (!data.plan?.featuresEn) mergedPlan.featuresEn = prev.plan.featuresEn;
          if (!data.plan?.features) mergedPlan.features = prev.plan.features;

          return {
            ...prev,
            ...data,
            plan: mergedPlan,
            i18nOverrides: {
              ...prev.i18nOverrides,
              ...(data.i18nOverrides || {})
            }
          };
        });
      })
      .catch(() => setLoadError(t('branding.loadError')));
  }, [currentUser]);

  // Send branding to iframe with debounce
  const pushToIframe = useCallback((cfg) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'TENANT_BRANDING', config: cfg },
        '*'
      );
    }, 150);
  }, []);

  const handleChange = (field, value) => {
    const next = { ...config, [field]: value };
    setConfig(next);
    pushToIframe(next);
    setSaved(false);
  };

  const handleIframeLoad = () => {
    // Push current config once iframe is ready
    setTimeout(() => pushToIframe(config), 300);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const storageRef = ref(libStorage, `tenants/${currentUser.uid}/logo_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      handleChange('logoUrl', url);
    } catch {
      // silently fail — user can retry
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'tenants', currentUser.uid), {
        ...config,
        adminId: currentUser.uid,
        adminEmail: currentUser.email || '',
        adminName: currentUser.name || currentUser.email?.split('@')[0] || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // keep saving=false so user can retry
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULTS);
    pushToIframe(DEFAULTS);
    setSaved(false);
  };

  const field = (label, fieldKey, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text2)', marginBottom: '6px', textTransform: 'uppercase' }}>
        {label}
      </label>
      {type === 'color' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="color"
            value={config[fieldKey]}
            onChange={e => handleChange(fieldKey, e.target.value)}
            style={{ width: '44px', height: '44px', border: 'none', borderRadius: '10px', cursor: 'pointer', background: 'transparent', padding: '2px' }}
          />
          <input
            type="text"
            value={config[fieldKey]}
            onChange={e => handleChange(fieldKey, e.target.value)}
            style={inputStyle}
            maxLength={7}
            placeholder="#3B82F6"
          />
        </div>
      ) : type === 'textarea' ? (
        <textarea
          value={config[fieldKey]}
          onChange={e => handleChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', height: 'auto', padding: '10px 14px' }}
        />
      ) : type === 'text_i18n' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            value={config[fieldKey]}
            onChange={e => handleChange(fieldKey, e.target.value)}
            placeholder={placeholder + ` ${t('branding.arabic')}`}
            style={inputStyle}
            dir="rtl"
          />
          <input
            type="text"
            value={config[`${fieldKey}En`] || ''}
            onChange={e => handleChange(`${fieldKey}En`, e.target.value)}
            placeholder={placeholder + ` ${t('branding.english')}`}
            style={{ ...inputStyle, textAlign: 'left' }}
            dir="ltr"
          />
        </div>
      ) : type === 'textarea_i18n' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={config[fieldKey]}
            onChange={e => handleChange(fieldKey, e.target.value)}
            placeholder={placeholder + ` ${t('branding.arabic')}`}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', height: 'auto', padding: '10px 14px' }}
            dir="rtl"
          />
          <textarea
            value={config[`${fieldKey}En`] || ''}
            onChange={e => handleChange(`${fieldKey}En`, e.target.value)}
            placeholder={placeholder + ` ${t('branding.english')}`}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', height: 'auto', padding: '10px 14px', textAlign: 'left' }}
            dir="ltr"
          />
        </div>
      ) : (
        <input
          type="text"
          value={config[fieldKey]}
          onChange={e => handleChange(fieldKey, e.target.value)}
          placeholder={placeholder}
          style={inputStyle}
        />
      )}
    </div>
  );

  return (
    <div className="branding-container">

      {/* ── Controls Panel ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0', overflowY: 'auto' }}>

        {loadError && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {loadError}
          </div>
        )}

        {/* App Identity */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Type size={16} />
            <span>{t('branding.appIdentity')}</span>
          </div>
          {field(t('branding.appName'), 'appName', 'text_i18n', t('branding.placeholderApp'))}
          {field(t('branding.tagline'), 'tagline', 'text_i18n', t('branding.placeholderTagline'))}

          {/* UpKlick tenant URL */}
          {/* <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>رابط الـ Landing Page (للـ UpKlick)</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ ...inputStyle, flex: 1, fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                {`${window.location.origin}/gigsniper_v2.html?tenant=${currentUser?.uid || 'UID'}`}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`${window.location.origin}/gigsniper_v2.html?tenant=${currentUser?.uid}`)}
                className="btn"
                title="نسخ الرابط"
                style={{ background: 'var(--bg3)', border: '1px solid var(--line2)', color: 'var(--text2)', padding: '0 12px', flexShrink: 0 }}
              >
                <Copy size={14} />
              </button>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '5px' }}>
              حط الرابط ده كـ iframe src في صفحة UpKlick بتاعتك
            </div>
          </div> */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text2)', marginBottom: '6px', textTransform: 'uppercase' }}>
              {t('branding.domainLabel')}
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={config.domain}
                readOnly
                placeholder={t('branding.domainPlaceholder')}
                style={{ ...inputStyle, flex: 1, cursor: 'not-allowed', opacity: 0.7 }}
              />
              <button
                type="button"
                onClick={() => {
                  let detected = window.location.hostname;
                  try {
                    if (window !== window.top) {
                      let parentHost = null;
                      if (window.location.ancestorOrigins?.length) {
                        parentHost = new URL(window.location.ancestorOrigins[0]).hostname;
                      } else if (document.referrer) {
                        parentHost = new URL(document.referrer).hostname;
                      }
                      if (parentHost && parentHost !== window.location.hostname) detected = parentHost;
                    }
                  } catch (_) { }
                  handleChange('domain', detected);
                }}
                className="btn"
                title={t('branding.domainDetectTitle')}
                style={{ background: 'var(--bg3)', border: '1px solid var(--line2)', color: 'var(--text2)', padding: '0 12px', flexShrink: 0, fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                {t('branding.detectDomain')}
              </button>
            </div>
          </div>
        </div>
        {/* Free Trial & WhatsApp */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <MessageCircle size={16} />
            <span>{t('branding.trialWhatsapp')}</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('branding.whatsappLabel')}</label>
            <input
              type="tel"
              value={config.whatsappNumber}
              onChange={e => handleChange('whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="201xxxxxxxx"
              dir="ltr"
              style={{ ...inputStyle, textAlign: 'left', fontFamily: 'var(--mono)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
              {t('branding.whatsappHint')}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg3)', borderRadius: '10px', border: '1px solid var(--line2)', marginBottom: config.freeTrial?.enabled ? '12px' : '0' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} />
                {t('branding.freeTrialLabel')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                {t('branding.freeTrialHint')}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.freeTrial?.enabled || false}
                onChange={e => handleChange('freeTrial', { ...config.freeTrial, enabled: e.target.checked })}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
            </label>
          </div>

          {config.freeTrial?.enabled && (
            <div>
              <label style={labelStyle}>{t('branding.trialDays')}</label>
              <input
                type="number"
                min="1"
                max="365"
                value={config.freeTrial?.days || 7}
                onChange={e => handleChange('freeTrial', { ...config.freeTrial, days: Math.max(1, parseInt(e.target.value) || 7) })}
                style={{ ...inputStyle, width: '140px' }}
              />
            </div>
          )}
        </div>
        {/* AI API Configuration */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Cpu size={16} />
            <span>{t('branding.aiConfig')}</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('branding.geminiApiKeyLabel')}</label>
            <input
              type="password"
              value={config.geminiApiKey || ''}
              onChange={e => handleChange('geminiApiKey', e.target.value)}
              placeholder="AIzaSy..."
              dir="ltr"
              style={{ ...inputStyle, textAlign: 'left', fontFamily: 'var(--mono)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
              {t('branding.geminiApiKeyHint')}
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Shield size={16} />
            <span>{t('branding.termsTitle')}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--bg3)', borderRadius: '10px', border: '1px solid var(--line2)', marginBottom: config.termsEnabled ? '12px' : '0' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} />
                {t('branding.termsEnabled')}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                {t('branding.termsEnabledHint')}
              </div>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={config.termsEnabled || false}
                onChange={e => handleChange('termsEnabled', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
            </label>
          </div>

          {config.termsEnabled && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>
                  {t('branding.termsTextAr')}
                </label>
                <textarea
                  value={config.termsTextAr || ''}
                  onChange={e => handleChange('termsTextAr', e.target.value)}
                  placeholder={t('branding.termsPlaceholderAr')}
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical', height: 'auto', padding: '10px 14px' }}
                  dir="rtl"
                />
              </div>

              <div>
                <label style={labelStyle}>
                  {t('branding.termsTextEn')}
                </label>
                <textarea
                  value={config.termsTextEn || ''}
                  onChange={e => handleChange('termsTextEn', e.target.value)}
                  placeholder={t('branding.termsPlaceholderEn')}
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical', height: 'auto', padding: '10px 14px', textAlign: 'left' }}
                  dir="ltr"
                />
              </div>
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Palette size={16} />
            <span>{t('branding.mainColors')}</span>
          </div>
          {field(t('branding.primaryColor'), 'primaryColor', 'color')}
          {field(t('branding.accentColor'), 'accentColor', 'color')}
        </div>

        {/* Advanced Colors */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Palette size={16} />
            <span>{t('branding.bgColors')}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>{t('branding.pageBg')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.bgColor} onChange={e => handleChange('bgColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.bgColor} onChange={e => handleChange('bgColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.panelBg')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.panelColor} onChange={e => handleChange('panelColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.panelColor} onChange={e => handleChange('panelColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.navBg')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.navBgColor} onChange={e => handleChange('navBgColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.navBgColor} onChange={e => handleChange('navBgColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.sidebarBg')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.sidebarBgColor} onChange={e => handleChange('sidebarBgColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.sidebarBgColor} onChange={e => handleChange('sidebarBgColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.footerBg')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.footerBgColor} onChange={e => handleChange('footerBgColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.footerBgColor} onChange={e => handleChange('footerBgColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Type size={16} />
            <span>{t('branding.textColors')}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={labelStyle}>{t('branding.primaryText')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.textColor} onChange={e => handleChange('textColor', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.textColor} onChange={e => handleChange('textColor', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.secondaryText')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={config.text2Color} onChange={e => handleChange('text2Color', e.target.value)} style={colorSwatchStyle} />
                <input type="text" value={config.text2Color} onChange={e => handleChange('text2Color', e.target.value)} style={{ ...inputStyle, fontSize: '12px' }} maxLength={7} />
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Image size={16} />
            <span>{t('branding.logo')}</span>
          </div>
          {config.logoUrl && (
            <div style={{ position: 'relative', marginBottom: '12px', display: 'inline-block' }}>
              <img src={config.logoUrl} alt="logo" style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '12px', border: '1px solid var(--line)' }} />
              <button
                onClick={() => handleChange('logoUrl', '')}
                style={{ position: 'absolute', top: '-8px', right: '-8px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--red)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
              >
                <X size={12} />
              </button>
            </div>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: uploading ? 'not-allowed' : 'pointer', background: 'var(--bg3)', border: '1px dashed var(--line2)', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: 'var(--text2)', transition: 'border-color 0.2s' }}>
            <Upload size={16} />
            <span>{uploading ? t('branding.uploading') : t('branding.uploadLogo')}</span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Content */}


        {/* Plan & Pricing */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <CreditCard size={16} />
            <span>{t('branding.planPricing')}</span>
            <label style={{ marginRight: 'auto', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: 'var(--text2)', fontWeight: '600' }}>
              <input
                type="checkbox"
                checked={config.plan?.visible !== false}
                onChange={e => handleChange('plan', { ...config.plan, visible: e.target.checked })}
                style={{ width: '14px', height: '14px', accentColor: 'var(--accent)', cursor: 'pointer' }}
              />
              {t('branding.showOnSite')}
            </label>
          </div>

          {/* Plan name + badge */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>{t('branding.planName')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input type="text" dir="rtl" value={config.plan?.name || ''} onChange={e => handleChange('plan', { ...config.plan, name: e.target.value })} placeholder={t('branding.placeholderPlanName')} style={inputStyle} />
                <input type="text" dir="ltr" value={config.plan?.nameEn || ''} onChange={e => handleChange('plan', { ...config.plan, nameEn: e.target.value })} placeholder={t('branding.placeholderPlanName') + ' ' + t('branding.english')} style={{ ...inputStyle, textAlign: 'left' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.planBadge')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input type="text" dir="rtl" value={config.plan?.badge || ''} onChange={e => handleChange('plan', { ...config.plan, badge: e.target.value })} placeholder={t('branding.placeholderBadge')} style={inputStyle} />
                <input type="text" dir="ltr" value={config.plan?.badgeEn || ''} onChange={e => handleChange('plan', { ...config.plan, badgeEn: e.target.value })} placeholder={t('branding.placeholderBadge') + ' ' + t('branding.english')} style={{ ...inputStyle, textAlign: 'left' }} />
              </div>
            </div>
          </div>

          {/* Price + currency + period */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>{t('branding.planPrice')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <input type="number" min="0" value={config.plan?.price || ''} onChange={e => handleChange('plan', { ...config.plan, price: e.target.value })} placeholder="99" style={{...inputStyle, height: '100%'}} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.planCurrency')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <select dir="rtl" value={config.plan?.currency || 'ج.م'} onChange={e => handleChange('plan', { ...config.plan, currency: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="ج.م">ج.م (EGP)</option>
                  <option value="$">$ (USD)</option>
                  <option value="ر.س">ر.س (SAR)</option>
                  <option value="د.إ">د.إ (AED)</option>
                  <option value="€">€ (EUR)</option>
                </select>
                <select dir="ltr" value={config.plan?.currencyEn || 'EGP'} onChange={e => handleChange('plan', { ...config.plan, currencyEn: e.target.value })} style={{ ...inputStyle, cursor: 'pointer', textAlign: 'left' }}>
                  <option value="EGP">EGP</option>
                  <option value="USD">USD</option>
                  <option value="SAR">SAR</option>
                  <option value="AED">AED</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>{t('branding.planPeriod')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <select dir="rtl" value={config.plan?.period || 'شهرياً'} onChange={e => handleChange('plan', { ...config.plan, period: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="شهرياً">{t('branding.monthly')}</option>
                  <option value="سنوياً">{t('branding.yearly')}</option>
                  <option value="مرة واحدة">{t('branding.onetime')}</option>
                </select>
                <select dir="ltr" value={config.plan?.periodEn || 'monthly'} onChange={e => handleChange('plan', { ...config.plan, periodEn: e.target.value })} style={{ ...inputStyle, cursor: 'pointer', textAlign: 'left' }}>
                  <option value="monthly">monthly</option>
                  <option value="yearly">yearly</option>
                  <option value="one-time">one-time</option>
                </select>
              </div>
            </div>
          </div>

          {/* CTA text */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('branding.ctaText')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <input type="text" dir="rtl" value={config.plan?.ctaText || ''} onChange={e => handleChange('plan', { ...config.plan, ctaText: e.target.value })} placeholder={t('branding.placeholderCta')} style={inputStyle} />
              <input type="text" dir="ltr" value={config.plan?.ctaTextEn || ''} onChange={e => handleChange('plan', { ...config.plan, ctaTextEn: e.target.value })} placeholder={t('branding.placeholderCta') + ' ' + t('branding.english')} style={{ ...inputStyle, textAlign: 'left' }} />
            </div>
          </div>

          {/* Paddle Price ID */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Paddle Price ID (for Paddle Checkout)</label>
            <input type="text" dir="ltr" value={config.plan?.paddlePriceId || ''} onChange={e => handleChange('plan', { ...config.plan, paddlePriceId: e.target.value })} placeholder="pri_xxxxxxxxxxxxxx" style={{ ...inputStyle, textAlign: 'left' }} />
          </div>

          {/* Features list */}
          <div>
            <label style={labelStyle}>{t('branding.planFeatures')}</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
              {(config.plan?.features || []).map((feat, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      type="text"
                      dir="rtl"
                      value={feat}
                      onChange={e => {
                        const next = [...(config.plan?.features || [])];
                        next[idx] = e.target.value;
                        handleChange('plan', { ...config.plan, features: next });
                      }}
                      style={{ ...inputStyle, padding: '8px 12px', fontSize: '12px' }}
                      placeholder={t('branding.planFeatures')}
                    />
                    <input
                      type="text"
                      dir="ltr"
                      value={(config.plan?.featuresEn || [])[idx] || ''}
                      onChange={e => {
                        const nextEn = [...(config.plan?.featuresEn || config.plan?.features || [])];
                        while (nextEn.length < config.plan.features.length) nextEn.push('');
                        nextEn[idx] = e.target.value;
                        handleChange('plan', { ...config.plan, featuresEn: nextEn });
                      }}
                      style={{ ...inputStyle, padding: '8px 12px', fontSize: '12px', textAlign: 'left' }}
                      placeholder={t('branding.planFeatures') + ' ' + t('branding.english')}
                    />
                  </div>
                  <button
                    onClick={() => {
                      const next = (config.plan?.features || []).filter((_, i) => i !== idx);
                      const nextEn = (config.plan?.featuresEn || config.plan?.features || []).filter((_, i) => i !== idx);
                      handleChange('plan', { ...config.plan, features: next, featuresEn: nextEn });
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: '4px', marginTop: '6px', flexShrink: 0 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => handleChange('plan', { ...config.plan, features: [...(config.plan?.features || []), ''] })}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg3)', border: '1px dashed var(--line2)', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: 'var(--text2)', cursor: 'pointer', width: '100%', justifyContent: 'center' }}
            >
              <Plus size={14} />
              {t('branding.addFeature')}
            </button>
          </div>
        </div>

        {/* Advanced Dictionary Overrides */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Type size={16} />
            <span>{t('branding.advancedTitle')}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '16px' }}>
            {t('branding.advancedSub')}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {DICTIONARY_GROUPS.map(group => {
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id} style={{ border: '1px solid var(--line2)', borderRadius: '8px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : group.id)}
                    style={{ width: '100%', background: 'var(--bg3)', border: 'none', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--text)', fontSize: '13px', fontWeight: '600' }}
                  >
                    <span>{t(group.titleKey) || group.titleKey}</span>
                    <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text3)' }}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '16px', background: 'var(--bg2)', display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid var(--line2)' }}>
                      {group.keys.map(key => {
                        const defaultAr = translations.ar[key] || '';
                        const defaultEn = translations.en[key] || defaultAr;
                        const valAr = config.i18nOverrides?.ar?.[key] || '';
                        const valEn = config.i18nOverrides?.en?.[key] || '';
                        return (
                          <div key={key}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text2)', marginBottom: '6px' }}>
                              <span title={defaultAr.replace(/<[^>]*>?/gm, '')}>
                                {defaultAr.replace(/<[^>]*>?/gm, '').length > 50 ? defaultAr.replace(/<[^>]*>?/gm, '').substring(0, 50) + '...' : defaultAr.replace(/<[^>]*>?/gm, '')}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)', marginInlineStart: '8px', fontWeight: 'normal' }}>
                                ({key})
                              </span>
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <input
                                type="text"
                                dir="rtl"
                                placeholder={defaultAr}
                                value={valAr}
                                onChange={e => handleOverrideChange('ar', key, e.target.value)}
                                style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }}
                                title="عربي"
                              />
                              <input
                                type="text"
                                dir="ltr"
                                placeholder={defaultEn}
                                value={valEn}
                                onChange={e => handleOverrideChange('en', key, e.target.value)}
                                style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px', textAlign: 'left' }}
                                title="English"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', paddingBottom: '20px' }}>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            <Save size={16} />
            <span>{saving ? t('branding.saving') : saved ? t('branding.saved') : t('branding.saveSettings')}</span>
          </button>
          <button onClick={handleReset} className="btn" style={{ background: 'var(--bg3)', border: '1px solid var(--line)', color: 'var(--text2)' }}>
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div style={{ display: 'flex', flexDirection: 'column', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--line)', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', borderBottom: '1px solid var(--line)', background: 'var(--bg3)' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
          </div>
          <div style={{ flex: 1, background: 'var(--bg4)', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
            {config.domain || 'your-domain.com'} · {t('branding.livePreview')}
          </div>
          <Eye size={14} style={{ color: 'var(--text3)' }} />
        </div>
        <iframe
          ref={iframeRef}
          src="/?preview=true"
          onLoad={handleIframeLoad}
          style={{ flex: 1, border: 'none', width: '100%' }}
          title="Landing Page Preview"
        />
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg3)',
  border: '1px solid var(--line2)',
  borderRadius: '10px',
  padding: '10px 14px',
  fontSize: '13px',
  color: 'var(--text)',
  outline: 'none',
  fontFamily: 'var(--font)',
  transition: 'border-color 0.2s',
};

const colorSwatchStyle = {
  width: '36px',
  height: '36px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  background: 'transparent',
  padding: '2px',
  flexShrink: 0,
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--text2)',
  marginBottom: '5px',
  textTransform: 'uppercase',
};

const sectionHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: '800',
  color: 'var(--text)',
  marginBottom: '16px',
  paddingBottom: '10px',
  borderBottom: '1px solid var(--line)',
};

export default BrandingSettings;
