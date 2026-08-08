import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { Camera, Save, ArrowLeft, Mail, User as UserIcon, Phone, FileCode, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { language, isRTL } = { language: useLanguage().language, isRTL: useLanguage().isRTL };
  const t = (key: TranslationKey) => translations[language][key] || key;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    licenseCode: (user as any)?.licenseCode || ''
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sync form data once user state is fully loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: (user as any).phone || '',
        licenseCode: (user as any).licenseCode || ''
      });
    }
  }, [user]);

  // Handle Profile Details Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage('');
    try {
      await updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      } as any);
      setProfileMessage(language === 'ar' ? 'تم تحديث بيانات الملف الشخصي بنجاح!' : 'Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setProfileMessage(language === 'ar' ? 'فشل تحديث البيانات. يرجى المحاولة لاحقاً.' : 'Failed to update profile details.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordData.newPassword.length < 6) {
      setPasswordError(language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError(language === 'ar' ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    try {
      if (user?.uid.startsWith('demo-')) {
        // Mock success for demo users
        setTimeout(() => {
          setPasswordMessage(language === 'ar' ? 'تم تحديث كلمة المرور بنجاح (جلسة تجريبية)!' : 'Password updated successfully (Demo Session)!');
          setPasswordData({ newPassword: '', confirmPassword: '' });
          setPasswordLoading(false);
        }, 1000);
      } else {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await updatePassword(currentUser, passwordData.newPassword);
          setPasswordMessage(language === 'ar' ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!');
          setPasswordData({ newPassword: '', confirmPassword: '' });
        } else {
          throw new Error("No active firebase auth session");
        }
        setPasswordLoading(false);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError(language === 'ar' 
          ? 'لدواعي أمنية، يرجى تسجيل الخروج والولوج مجدداً لتغيير كلمة المرور.' 
          : 'For security, please log out and sign in again before changing password.');
      } else {
        setPasswordError(language === 'ar' ? 'فشل تحديث كلمة المرور.' : 'Failed to update password.');
      }
      setPasswordLoading(false);
    }
  };

  // Profile Picture Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors uppercase text-[10px] font-black tracking-widest"
      >
        <ArrowLeft size={14} className={cn(isRTL && "rotate-180")} />
        {language === 'ar' ? 'العودة' : 'Back'}
      </button>

      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-black text-white uppercase  tracking-tighter">{language === 'ar' ? 'الملف الشخصي' : 'USER PROFILE'}</h1>
        <p className="text-slate-500 font-medium">{language === 'ar' ? 'إدارة هويتك الرقمية ومعلمات الأمان الخاصة بك.' : 'Manage your digital identity and security parameters.'}</p>
      </div>

      <div className="grid gap-12">
        {/* User Card */}
        <div className="flex flex-col md:flex-row items-center gap-8 glass-card p-10">
           <div className="relative group">
              <input 
                type="file" 
                id="photo-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
              <label htmlFor="photo-upload" className="cursor-pointer block transition-transform hover:scale-105 active:scale-95">
                <div className="w-32 h-32 rounded-3xl bg-brand-primary/10 border-2 border-brand-primary/20 flex items-center justify-center overflow-hidden">
                   {user?.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                      <UserIcon size={48} className="text-brand-primary" />
                   )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary text-white rounded-xl shadow-xl flex items-center justify-center pointer-events-none">
                  <Camera size={18} />
                </div>
              </label>
           </div>
           
           <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-white mb-1 uppercase ">{user?.name || 'Explorer'}</h2>
              <p className="text-sm font-bold text-brand-primary mb-4">{user?.email}</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Link: ACTIVE</span>
              </div>
           </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="glass-card p-10 space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
               <UserIcon size={16} className="text-brand-primary" />
               {language === 'ar' ? 'البيانات الشخصية' : 'Personal Details'}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <UserIcon size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'الاسم بالكامل' : 'FULL NAME'}
                  </label>
                  <input 
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <Mail size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
                  </label>
                  <input 
                     type="email"
                     value={formData.email}
                     onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <Phone size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'رقم الهاتف' : 'PHONE NUMBER'}
                  </label>
                  <input 
                     type="tel"
                     value={formData.phone}
                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all"
                     placeholder="+20 100 000 0000"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <FileCode size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'كود الترخيص' : 'LICENSE CODE'}
                  </label>
                  <input 
                     type="text"
                     readOnly
                     value={formData.licenseCode}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-slate-500 font-bold outline-none cursor-not-allowed"
                  />
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-6">
               <button 
                 type="submit"
                 disabled={profileLoading}
                 className="w-full md:w-auto px-8 py-4 bg-brand-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
               >
                 {profileLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                 {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
               </button>
               
               {profileMessage && (
                 <p className="text-emerald-500 font-bold text-sm">
                   {profileMessage}
                 </p>
               )}
            </div>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handlePasswordUpdate} className="glass-card p-10 space-y-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
               <Lock size={16} className="text-brand-primary" />
               {language === 'ar' ? 'إعدادات الأمان وتغيير كلمة المرور' : 'Security Settings & Password Change'}
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <Lock size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'كلمة المرور الجديدة' : 'NEW PASSWORD'}
                  </label>
                  <input 
                     type="password"
                     value={passwordData.newPassword}
                     onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all"
                     placeholder="••••••••"
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                     <Lock size={12} className="text-brand-primary" />
                     {language === 'ar' ? 'تأكيد كلمة المرور' : 'CONFIRM PASSWORD'}
                  </label>
                  <input 
                     type="password"
                     value={passwordData.confirmPassword}
                     onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                     className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:border-brand-primary outline-none transition-all"
                     placeholder="••••••••"
                  />
               </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 pt-6">
               <button 
                 type="submit"
                 disabled={passwordLoading}
                 className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 hover:border-brand-primary/50 transition-all flex items-center justify-center gap-3"
               >
                 {passwordLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ShieldCheck size={18} />}
                 {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
               </button>
               
               {passwordMessage && (
                 <p className="text-emerald-500 font-bold text-sm">
                   {passwordMessage}
                 </p>
               )}
               {passwordError && (
                 <p className="text-rose-500 font-bold text-sm">
                   {passwordError}
                 </p>
               )}
            </div>
        </form>
      </div>
    </div>
  );
}
