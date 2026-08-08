import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { CreditCard, Smartphone, Save, RefreshCw } from 'lucide-react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

interface PaymentMethods {
  instapay: { enabled: boolean; address: string };
  vodafone: { enabled: boolean; number: string };
  etisalat: { enabled: boolean; number: string };
  orange: { enabled: boolean; number: string };
  paypal: { enabled: boolean; email: string };
  stripe: { enabled: boolean; publishableKey: string; secretKey: string; paymentLink: string };
  paddle: { enabled: boolean; clientKey: string; environment: 'sandbox' | 'production' };
}

const DEFAULTS: PaymentMethods = {
  instapay: { enabled: false, address: '' },
  vodafone: { enabled: false, number: '' },
  etisalat: { enabled: false, number: '' },
  orange: { enabled: false, number: '' },
  paypal: { enabled: false, email: '' },
  stripe: { enabled: false, publishableKey: '', secretKey: '', paymentLink: '' },
  paddle: { enabled: false, clientKey: '', environment: 'sandbox' }
};

export default function PaymentSettingsPage() {
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const { user } = useAuth();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load existing tenant configuration
  useEffect(() => {
    if (!user?.uid) return;
    getDoc(doc(db, 'tenants', user.uid))
      .then(snap => {
        if (snap.exists()) {
          const data = snap.data();
          const rawMethods = data.paymentMethods || {};

          // Merge logic supporting backward compatibility (vodafoneCash -> vodafone)
          setPaymentMethods({
            instapay: {
              enabled: false,
              address: '',
              ...(typeof rawMethods.instapay === 'object' ? rawMethods.instapay : {})
            },
            vodafone: {
              enabled: rawMethods.vodafone?.enabled ?? rawMethods.vodafoneCash?.enabled ?? false,
              number: rawMethods.vodafone?.number ?? rawMethods.vodafoneCash?.number ?? '',
            },
            etisalat: {
              enabled: false,
              number: '',
              ...(typeof rawMethods.etisalat === 'object' ? rawMethods.etisalat : {})
            },
            orange: {
              enabled: false,
              number: '',
              ...(typeof rawMethods.orange === 'object' ? rawMethods.orange : {})
            },
            paypal: {
              enabled: false,
              email: '',
              ...(typeof rawMethods.paypal === 'object' ? rawMethods.paypal : {})
            },
            stripe: {
              enabled: false,
              publishableKey: '',
              secretKey: '',
              paymentLink: '',
              ...(typeof rawMethods.stripe === 'object' ? rawMethods.stripe : {})
            },
            paddle: {
              enabled: false,
              clientKey: '',
              environment: 'sandbox',
              ...(typeof rawMethods.paddle === 'object' ? rawMethods.paddle : {})
            }
          });
        }
      })
      .catch(() => setLoadError(t('branding.loadError')));
  }, [user?.uid]);

  const handleToggle = (method: keyof PaymentMethods) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        enabled: !prev[method].enabled
      }
    }));
  };

  const handleFieldChange = (method: keyof PaymentMethods, field: string, value: string) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'tenants', user.uid), {
        paymentMethods,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPaymentMethods(DEFAULTS);
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
          <CreditCard size={16} style={{ color: 'var(--brand-primary)' }} />
          <span>{t('branding.paymentMethods')}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
          
          {/* 1. INSTAPAY */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.instapay.enabled ? 'rgba(168, 85, 247, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.instapay.enabled ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.06) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.instapay.enabled ? 'rgba(168, 85, 247, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.instapay.enabled ? '#c084fc' : '#94a3b8'
                }}>
                  ⚡
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentInstapay')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentInstapayLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.instapay.enabled}
                  onChange={() => handleToggle('instapay')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.instapay.enabled ? '#a855f7' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.instapay.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.instapay.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentInstapayLabel')}</label>
                <input
                  type="text"
                  value={paymentMethods.instapay.address}
                  onChange={e => handleFieldChange('instapay', 'address', e.target.value)}
                  placeholder={t('branding.paymentInstapayPlaceholder')}
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 2. VODAFONE CASH */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.vodafone.enabled ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.vodafone.enabled ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.vodafone.enabled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.vodafone.enabled ? '#ef4444' : '#94a3b8'
                }}>
                  <Smartphone size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentVodafoneCash')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentVodafoneCashLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.vodafone.enabled}
                  onChange={() => handleToggle('vodafone')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.vodafone.enabled ? '#ef4444' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.vodafone.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.vodafone.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentVodafoneCashLabel')}</label>
                <input
                  type="tel"
                  value={paymentMethods.vodafone.number}
                  onChange={e => handleFieldChange('vodafone', 'number', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={t('branding.paymentVodafoneCashPlaceholder')}
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 3. ETISALAT CASH */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.etisalat.enabled ? 'rgba(0, 107, 51, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.etisalat.enabled ? 'linear-gradient(135deg, rgba(0, 107, 51, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.etisalat.enabled ? 'rgba(0, 107, 51, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.etisalat.enabled ? '#10b981' : '#94a3b8'
                }}>
                  <Smartphone size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentEtisalatCash')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentEtisalatCashLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.etisalat.enabled}
                  onChange={() => handleToggle('etisalat')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.etisalat.enabled ? '#006B33' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.etisalat.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.etisalat.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentEtisalatCashLabel')}</label>
                <input
                  type="tel"
                  value={paymentMethods.etisalat.number}
                  onChange={e => handleFieldChange('etisalat', 'number', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={t('branding.paymentEtisalatCashPlaceholder')}
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 4. ORANGE CASH */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.orange.enabled ? 'rgba(255, 102, 0, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.orange.enabled ? 'linear-gradient(135deg, rgba(255, 102, 0, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.orange.enabled ? 'rgba(255, 102, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.orange.enabled ? '#ff6600' : '#94a3b8'
                }}>
                  <Smartphone size={14} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentOrangeCash')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentOrangeCashLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.orange.enabled}
                  onChange={() => handleToggle('orange')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.orange.enabled ? '#ff6600' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.orange.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.orange.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentOrangeCashLabel')}</label>
                <input
                  type="tel"
                  value={paymentMethods.orange.number}
                  onChange={e => handleFieldChange('orange', 'number', e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder={t('branding.paymentOrangeCashPlaceholder')}
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 5. PAYPAL */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.paypal.enabled ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.paypal.enabled ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.paypal.enabled ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.paypal.enabled ? '#3b82f6' : '#94a3b8'
                }}>
                  🌐
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentPaypal')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentPaypalLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.paypal.enabled}
                  onChange={() => handleToggle('paypal')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.paypal.enabled ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.paypal.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.paypal.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentPaypalLabel')}</label>
                <input
                  type="email"
                  value={paymentMethods.paypal.email}
                  onChange={e => handleFieldChange('paypal', 'email', e.target.value)}
                  placeholder={t('branding.paymentPaypalPlaceholder')}
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 6. STRIPE */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.stripe.enabled ? 'rgba(99, 102, 241, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.stripe.enabled ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.stripe.enabled ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.stripe.enabled ? '#6366f1' : '#94a3b8'
                }}>
                  💳
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentStripe')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    Stripe Payment Link URL
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.stripe.enabled}
                  onChange={() => handleToggle('stripe')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.stripe.enabled ? '#6366f1' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.stripe.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.stripe.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentStripeLink')}</label>
                <input
                  type="text"
                  value={paymentMethods.stripe.paymentLink}
                  onChange={e => handleFieldChange('stripe', 'paymentLink', e.target.value)}
                  placeholder={t('branding.paymentStripeLinkPlaceholder')}
                  style={{ ...inputStyle, marginBottom: '12px' }}
                  dir="ltr"
                />
                <label style={labelStyle}>Publishable Key</label>
                <input
                  type="text"
                  value={paymentMethods.stripe.publishableKey}
                  onChange={e => handleFieldChange('stripe', 'publishableKey', e.target.value)}
                  placeholder="pk_live_..."
                  style={{ ...inputStyle, marginBottom: '12px' }}
                  dir="ltr"
                />
                <label style={labelStyle}>Secret Key</label>
                <input
                  type="password"
                  value={paymentMethods.stripe.secretKey}
                  onChange={e => handleFieldChange('stripe', 'secretKey', e.target.value)}
                  placeholder="sk_live_..."
                  style={inputStyle}
                  dir="ltr"
                />
              </div>
            )}
          </div>

          {/* 7. PADDLE */}
          <div style={{
            ...methodContainer,
            borderColor: paymentMethods.paddle.enabled ? 'rgba(0, 191, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)',
            background: paymentMethods.paddle.enabled ? 'linear-gradient(135deg, rgba(0, 191, 255, 0.05) 0%, rgba(9, 9, 11, 0.2) 100%)' : 'rgba(255,255,255,0.02)'
          }}>
            <div style={methodHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  ...iconWrapper,
                  background: paymentMethods.paddle.enabled ? 'rgba(0, 191, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                  color: paymentMethods.paddle.enabled ? '#00bfff' : '#94a3b8'
                }}>
                  💳
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', textAlign: 'start' }}>
                    {t('branding.paymentPaddle')}
                  </div>
                  <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textAlign: 'start' }}>
                    {t('branding.paymentPaddleLabel')}
                  </span>
                </div>
              </div>

              <label style={toggleSwitch}>
                <input
                  type="checkbox"
                  checked={paymentMethods.paddle.enabled}
                  onChange={() => handleToggle('paddle')}
                  style={toggleInput}
                />
                <span style={{
                  ...toggleSlider,
                  background: paymentMethods.paddle.enabled ? '#00bfff' : 'rgba(255,255,255,0.08)',
                }}>
                  <span style={{
                    ...toggleKnob,
                    transform: paymentMethods.paddle.enabled ? (isRTL ? 'translateX(-16px)' : 'translateX(16px)') : 'translateX(0)',
                    background: '#ffffff'
                  }} />
                </span>
              </label>
            </div>

            {paymentMethods.paddle.enabled && (
              <div style={collapsibleContent}>
                <label style={labelStyle}>{t('branding.paymentPaddleLabel')}</label>
                <input
                  type="text"
                  value={paymentMethods.paddle.clientKey}
                  onChange={e => handleFieldChange('paddle', 'clientKey', e.target.value)}
                  placeholder={t('branding.paymentPaddlePlaceholder')}
                  style={{ ...inputStyle, marginBottom: '12px' }}
                  dir="ltr"
                />
                <label style={labelStyle}>{t('branding.paymentPaddleEnv')}</label>
                <select
                  value={paymentMethods.paddle.environment}
                  onChange={e => handleFieldChange('paddle', 'environment', e.target.value)}
                  style={inputStyle}
                  dir="ltr"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="production">Production</option>
                </select>
              </div>
            )}
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
          <span>{saving ? t('branding.saving') : saved ? t('branding.saved') : t('branding.saveSettings')}</span>
        </button>
        <button onClick={handleReset} className="btn" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#fff', padding: '10px 14px' }}>
          <RefreshCw size={16} />
        </button>
      </div>
    </div>
  );
}

// Inline Styles mapped to custom layout settings compatible with target
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

const methodContainer: React.CSSProperties = {
  border: '1px solid rgba(255, 255, 255, 0.05)',
  borderRadius: '16px',
  padding: '14px',
  transition: 'all 0.25s ease',
};

const methodHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const iconWrapper: React.CSSProperties = {
  width: '32px',
  height: '32px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  transition: 'all 0.2s',
  flexShrink: 0,
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

const collapsibleContent: React.CSSProperties = {
  marginTop: '12px',
  paddingTop: '12px',
  borderTop: '1px dashed rgba(255, 255, 255, 0.05)',
};

const toggleSwitch: React.CSSProperties = {
  position: 'relative',
  display: 'inline-block',
  width: '36px',
  height: '20px',
  cursor: 'pointer',
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
};

const toggleKnob: React.CSSProperties = {
  height: '16px',
  width: '16px',
  borderRadius: '50%',
  transition: '.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'block',
};
