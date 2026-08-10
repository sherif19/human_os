import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { Cpu, Save, RefreshCw, Key, Sparkles } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface AIConfig {
  aiProvider: 'gemini' | 'openai';
  openaiApiKey: string;
  geminiApiKey: string;
  autoAssess: boolean;
}

const DEFAULTS: AIConfig = {
  aiProvider: 'gemini',
  openaiApiKey: '',
  geminiApiKey: '',
  autoAssess: true,
};

export default function AISettingsPage() {
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user } = useAuth();

  const [config, setConfig] = useState<AIConfig>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load existing tenant configurations
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'tenants', user.uid))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          setConfig({
            aiProvider: data.aiProvider || 'gemini',
            openaiApiKey: data.openaiApiKey || '',
            geminiApiKey: data.geminiApiKey || '',
            autoAssess: data.autoAssess ?? true,
          });
        }
      })
      .catch(() => setLoadError(t('ai.loadError')));
  }, [user?.uid]);

  const handleChange = (field: keyof AIConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'tenants', user.uid), {
        ...config,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save AI config:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULTS);
    setSaved(false);
  };

  return (
    <div style={{ animation: 'fadeSlide 0.4s ease', maxWidth: '600px', margin: '0 auto' }}>
      {loadError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
          ⚠️ {loadError}
        </div>
      )}

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
          <Cpu size={16} style={{ color: 'var(--brand-primary)' }} />
          <span>{t('ai.title')}</span>
        </div>

        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6', position: 'relative', zIndex: 1, textAlign: 'start' }}>
          {t('ai.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
          
          {/* Provider Selector */}
          <div style={formGroup}>
            <label style={labelStyle}>{t('ai.providerLabel')}</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              <button
                type="button"
                onClick={() => handleChange('aiProvider', 'gemini')}
                style={{
                  ...providerTab,
                  borderColor: config.aiProvider === 'gemini' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255,255,255,0.05)',
                  background: config.aiProvider === 'gemini' ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.02)',
                  color: config.aiProvider === 'gemini' ? '#fff' : '#94a3b8'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>💎</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{t('ai.providerGemini')}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleChange('aiProvider', 'openai')}
                style={{
                  ...providerTab,
                  borderColor: config.aiProvider === 'openai' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.05)',
                  background: config.aiProvider === 'openai' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                  color: config.aiProvider === 'openai' ? '#fff' : '#94a3b8'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px' }}>🧠</span>
                  <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{t('ai.providerOpenAI')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* OpenAI API Key (Shown only if OpenAI GPT is selected) */}
          {config.aiProvider === 'openai' && (
            <div style={formGroup}>
              <label style={labelStyle}>{t('ai.openaiKeyLabel')}</label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  value={config.openaiApiKey}
                  onChange={e => handleChange('openaiApiKey', e.target.value)}
                  placeholder={t('ai.openaiKeyPlaceholder')}
                  style={{ ...inputStyle, [isRTL ? 'paddingRight' : 'paddingLeft']: '36px' }}
                  dir="ltr"
                />
              </div>
              <p style={hintStyle}>{t('ai.openaiKeyHint')}</p>
            </div>
          )}

          {/* Gemini API Key (Shown only if Google Gemini is selected) */}
          {config.aiProvider === 'gemini' && (
            <div style={formGroup}>
              <label style={labelStyle}>{t('ai.geminiKeyLabel')}</label>
              <div style={{ position: 'relative' }}>
                <Key size={14} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input
                  type="password"
                  value={config.geminiApiKey}
                  onChange={e => handleChange('geminiApiKey', e.target.value)}
                  placeholder={t('ai.geminiKeyPlaceholder')}
                  style={{ ...inputStyle, [isRTL ? 'paddingRight' : 'paddingLeft']: '36px' }}
                  dir="ltr"
                />
              </div>
              <p style={hintStyle}>{t('ai.geminiKeyHint')}</p>
            </div>
          )}

          {/* Auto Generate Assessments Toggle */}
          <div 
            onClick={() => handleChange('autoAssess', !config.autoAssess)}
            style={{
              ...toggleContainer,
              borderColor: config.autoAssess ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.15)',
              background: config.autoAssess ? 'rgba(16, 185, 129, 0.04)' : 'rgba(239, 68, 68, 0.02)',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: config.autoAssess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.1)',
                  color: config.autoAssess ? '#10b981' : '#ef4444'
                }}>
                  <Sparkles size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('ai.autoGenerateAssessments')}
                  </div>
                </div>
              </div>

              <label style={toggleSwitch} onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={config.autoAssess}
                  onChange={e => handleChange('autoAssess', e.target.checked)}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: config.autoAssess ? '#10b981' : 'rgba(239, 68, 68, 0.2)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: config.autoAssess ? 'translateX(16px)' : 'translateX(0)',
                    background: config.autoAssess ? '#ffffff' : '#fca5a5'
                  }} />
                </span>
              </label>
            </div>
            <p style={{ ...hintStyle, marginTop: '8px', padding: '0 4px', textAlign: 'start' }}>
              {t('ai.autoGenerateAssessmentsHint')}
            </p>
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
          <span>{saving ? t('ai.saving') : saved ? t('ai.saved') : t('ai.saveSettings')}</span>
        </button>
        <button onClick={handleReset} className="btn" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px 14px' }}>
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}

// Styling classes aligned with the platform design theme
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

const providerTab: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: '#94a3b8',
  marginBottom: '6px',
  textTransform: 'uppercase',
  textAlign: 'start'
};

const hintStyle: React.CSSProperties = {
  fontSize: '10px',
  color: '#64748b',
  marginTop: '4px',
  lineHeight: '1.5',
  textAlign: 'start'
};

const toggleContainer: React.CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: '14px',
  transition: 'all 0.25s ease',
};

const iconWrapper: React.CSSProperties = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  transition: 'all 0.2s',
  flexShrink: 0,
};

const toggleSwitch: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  width: '36px',
  height: '20px',
  cursor: 'pointer',
  flexShrink: 0,
};

const toggleInput: React.CSSProperties = {
  opacity: 0,
  width: 0,
  height: 0,
};

const toggleSlider: React.CSSProperties = {
  position: 'absolute',
  cursor: 'pointer',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '34px',
  transition: '.3s',
  display: 'flex',
  alignItems: 'center',
  padding: '0 2px',
  direction: 'ltr',
  justifyContent: 'flex-start',
};

const toggleKnob: React.CSSProperties = {
  height: '16px',
  width: '16px',
  borderRadius: '50%',
  transition: '.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'block',
};
