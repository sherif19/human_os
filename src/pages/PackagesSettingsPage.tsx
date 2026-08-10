import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { Shield, Save, RefreshCw, Layers, CheckSquare, Square } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { TenantPackages, DEFAULT_PACKAGES, PackageConfig } from '../lib/subscription';

const TOOLS_LIST = [
  { key: 'neural_tests', nameEn: 'Neural Tests', nameAr: 'الاخبارات العصبية' },
  { key: 'personality_dna', nameEn: 'Personality DNA Mapping', nameAr: 'الحمض النووي للشخصية' },
  { key: 'archetype', nameEn: 'Core Archetype Analysis', nameAr: 'تحليل النموذج الأصلي' },
  { key: 'growth_velocity', nameEn: 'Growth Velocity Tracking', nameAr: 'مؤشر سرعة النمو' },
  { key: 'growth_lab', nameEn: 'Growth Lab Tasks', nameAr: 'مختبر النمو المهني' },
  { key: 'emotional_iq', nameEn: 'Emotional IQ Analysis', nameAr: 'مقياس الذكاء العاطفي' },
  { key: 'social_iq', nameEn: 'Social IQ Assessment', nameAr: 'مقياس الذكاء الاجتماعي' },
  { key: 'cog_load', nameEn: 'Cognitive Load Diagnostics', nameAr: 'الحمل المعرفي والسبل العميقة' },
  { key: 'toxicity', nameEn: 'Toxicity Shield & Battery', nameAr: 'درع السمية والطاقة' },
  { key: 'ai_coach', nameEn: 'AI Coach Conversations', nameAr: 'مدرب الذكاء الاصطناعي' },
  { key: 'book_appointment', nameEn: 'Appointment Booking Requests', nameAr: 'حجز واستشارة المواعيد' },
  { key: 'library', nameEn: 'Data Resource Library', nameAr: 'مكتبة البيانات والموارد' },
];

export default function PackagesSettingsPage() {
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user } = useAuth();

  const [activeTier, setActiveTier] = useState<'bronze' | 'silver' | 'gold'>('bronze');
  const [packages, setPackages] = useState<TenantPackages>(DEFAULT_PACKAGES);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load existing tenant packages
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'tenants', user.uid))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          if (data.packages) {
            setPackages(data.packages as TenantPackages);
          }
        }
      })
      .catch(() => setLoadError(language === 'ar' ? 'فشل تحميل إعدادات الباقات.' : 'Failed to load packages settings.'));
  }, [user?.uid]);

  const handleFieldChange = (tier: 'bronze' | 'silver' | 'gold', field: keyof PackageConfig, value: any) => {
    setPackages(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [field]: value
      }
    }));
    setSaved(false);
  };

  const handleToggleTool = (tier: 'bronze' | 'silver' | 'gold', toolKey: string) => {
    const currentTools = packages[tier].unlockedTools || [];
    let updatedTools = [];
    if (currentTools.includes(toolKey)) {
      updatedTools = currentTools.filter(k => k !== toolKey);
    } else {
      updatedTools = [...currentTools, toolKey];
    }
    handleFieldChange(tier, 'unlockedTools', updatedTools);
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'tenants', user.uid), {
        packages,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save packages config:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPackages(DEFAULT_PACKAGES);
    setSaved(false);
  };

  const currentPlan = packages[activeTier];

  return (
    <div style={{ animation: 'fadeSlide 0.4s ease', width: '100%' }}>
      {loadError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
          ⚠️ {loadError}
        </div>
      )}

      {/* Tier Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['bronze', 'silver', 'gold'] as const).map(tier => {
          const isActive = activeTier === tier;
          const tierColors = {
            bronze: { border: 'rgba(205, 127, 50, 0.4)', bg: 'rgba(205, 127, 50, 0.08)', text: '#cd7f32' },
            silver: { border: 'rgba(192, 192, 192, 0.4)', bg: 'rgba(192, 192, 192, 0.08)', text: '#c0c0c0' },
            gold: { border: 'rgba(255, 215, 0, 0.4)', bg: 'rgba(255, 215, 0, 0.08)', text: '#ffd700' }
          };
          const colors = tierColors[tier];
          
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setActiveTier(tier)}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: isActive ? colors.bg : 'rgba(255,255,255,0.02)',
                borderColor: isActive ? colors.border : 'rgba(255,255,255,0.05)',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: 'bold',
                fontSize: '12px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span style={{ color: colors.text }}>●</span>
              <span>
                {language === 'ar' 
                  ? (tier === 'bronze' ? 'البرونزية' : tier === 'silver' ? 'الفضية' : 'الذهبية') 
                  : tier}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card" style={{ marginBottom: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '240px',
          height: '240px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={sectionHeader}>
          <Layers size={16} style={{ color: 'var(--brand-primary)' }} />
          <span>
            {language === 'ar' 
              ? `إعدادات الباقة ${activeTier === 'bronze' ? 'البرونزية' : activeTier === 'silver' ? 'الفضية' : 'الذهبية'}`
              : `${activeTier.toUpperCase()} Package Config`}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          
          {/* Switch: Enable/Disable Package */}
          <div 
            onClick={() => handleFieldChange(activeTier, 'enabled', currentPlan.enabled !== false ? false : true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'start' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                {language === 'ar' ? 'تفعيل باقة الاشتراك' : 'Activate Subscription Plan'}
              </span>
              <span style={{ fontSize: '10px', color: '#64748b' }}>
                {language === 'ar' 
                  ? 'إذا تم إلغاء التفعيل، فلن تظهر هذه الباقة للمستخدمين في صفحة الدفع.' 
                  : 'If deactivated, this package will not be shown to users on the pricing/payment page.'}
              </span>
            </div>

            {/* Custom slider switch */}
            <div 
              style={{ 
                direction: 'ltr',
                width: '44px',
                height: '24px',
                borderRadius: '999px',
                padding: '2px',
                background: currentPlan.enabled !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                border: `1px solid ${currentPlan.enabled !== false ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: currentPlan.enabled !== false ? 'flex-end' : 'flex-start',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div 
                style={{ 
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: currentPlan.enabled !== false ? '#10b981' : '#ef4444',
                  boxShadow: `0 0 10px ${currentPlan.enabled !== false ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </div>
          </div>
          
          {/* Row: Name (English & Arabic) */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Plan Name (EN)</label>
              <input
                type="text"
                value={currentPlan.nameEn}
                onChange={e => handleFieldChange(activeTier, 'nameEn', e.target.value)}
                style={inputStyle}
                dir="ltr"
              />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>اسم الباقة (AR)</label>
              <input
                type="text"
                value={currentPlan.nameAr}
                onChange={e => handleFieldChange(activeTier, 'nameAr', e.target.value)}
                style={inputStyle}
                dir="rtl"
              />
            </div>
          </div>

          {/* Row: Price & Currency (English & Arabic) */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>{language === 'ar' ? 'السعر' : 'Price'}</label>
              <input
                type="text"
                value={currentPlan.price}
                onChange={e => handleFieldChange(activeTier, 'price', e.target.value)}
                style={inputStyle}
                dir="ltr"
              />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Currency (EN)</label>
              <input
                type="text"
                value={currentPlan.currencyEn}
                onChange={e => handleFieldChange(activeTier, 'currencyEn', e.target.value)}
                style={inputStyle}
                dir="ltr"
              />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>العملة (AR)</label>
              <input
                type="text"
                value={currentPlan.currency}
                onChange={e => handleFieldChange(activeTier, 'currency', e.target.value)}
                style={inputStyle}
                dir="rtl"
              />
            </div>
          </div>

          {/* Row: Period (English & Arabic) */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>Period Duration (EN)</label>
              <input
                type="text"
                value={currentPlan.periodEn}
                onChange={e => handleFieldChange(activeTier, 'periodEn', e.target.value)}
                placeholder="e.g. monthly, yearly, one-time"
                style={inputStyle}
                dir="ltr"
              />
            </div>
            <div style={{ ...formGroup, flex: 1 }}>
              <label style={labelStyle}>مدة الاشتراك (AR)</label>
              <input
                type="text"
                value={currentPlan.period}
                onChange={e => handleFieldChange(activeTier, 'period', e.target.value)}
                placeholder="مثال: شهرياً، سنوياً، دفعة واحدة"
                style={inputStyle}
                dir="rtl"
              />
            </div>
          </div>

          {/* Checklist of Unlocked Tools */}
          <div style={formGroup}>
            <label style={{ ...labelStyle, marginBottom: '10px' }}>
              {language === 'ar' ? 'الأدوات والصفحات المفتوحة في هذه الباقة' : 'Unlocked Tools & Modules Checklist'}
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '10px',
              background: '#09090b',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '14px'
            }}>
              {TOOLS_LIST.map(tool => {
                const isChecked = (currentPlan.unlockedTools || []).includes(tool.key);
                return (
                  <div
                    key={tool.key}
                    onClick={() => handleToggleTool(activeTier, tool.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      background: isChecked ? 'rgba(99,102,241,0.06)' : 'transparent',
                      border: `1px solid ${isChecked ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
                      transition: 'all 0.15s ease',
                      userSelect: 'none'
                    }}
                  >
                    {isChecked ? (
                      <CheckSquare size={14} style={{ color: 'var(--brand-primary)' }} />
                    ) : (
                      <Square size={14} style={{ color: '#475569' }} />
                    )}
                    <span style={{ fontSize: '11px', fontWeight: 'bold', color: isChecked ? '#fff' : '#94a3b8' }}>
                      {language === 'ar' ? tool.nameAr : tool.nameEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', paddingBottom: '20px' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary"
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          <Save size={16} />
          <span>
            {saving 
              ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
              : saved 
                ? (language === 'ar' ? 'تم الحفظ!' : 'Saved!') 
                : (language === 'ar' ? 'حفظ إعدادات الباقات' : 'Save Plan Settings')}
          </span>
        </button>
        <button onClick={handleReset} className="btn" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px 14px' }}>
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}

const sectionHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '13px',
  fontWeight: '800',
  color: '#fff',
  marginBottom: '16px',
  paddingBottom: '10px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
};

const formGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#09090b',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '10px 14px',
  fontSize: '13px',
  color: '#fff',
  outline: 'none',
  transition: 'border-color 0.2s',
  textAlign: 'start'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '10px',
  fontWeight: '800',
  color: '#94a3b8',
  marginBottom: '4px',
  textTransform: 'uppercase',
  textAlign: 'start'
};
