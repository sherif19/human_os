import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../lib/translations';
import '../admin.css';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  orderBy,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { db, storage, libDb, libStorage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { formatUserDate } from '../lib/utils';
import {
  UserPlus,
  Search,
  Shield,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  Activity,
  Users,
  BookOpen,
  Plus,
  Save,
  X,
  Zap,
  Smartphone,
  Filter,
  ChevronDown,
  UserCheck
} from 'lucide-react';

const firebaseConfig = {
  apiKey: "AIzaSyDJyR11o7caCMzAdMiBilJjm8qlNdi1O1I",
  authDomain: "digital-kanz.firebaseapp.com",
  projectId: "digital-kanz",
  storageBucket: "digital-kanz.firebasestorage.app",
  messagingSenderId: "535274035802",
  appId: "1:535274035802:web:eec26cacbc440ad5475663"
};

const countryData = {
  EG: { code: '+20', placeholder: '1xxxxxxxxx' },
  SA: { code: '+966', placeholder: '5xxxxxxxx' },
  AE: { code: '+971', placeholder: '5xxxxxxxx' },
  KW: { code: '+965', placeholder: 'xxxxxxxx' },
  QA: { code: '+974', placeholder: 'xxxxxxxx' },
  JO: { code: '+962', placeholder: '7xxxxxxxx' },
  MA: { code: '+212', placeholder: '6xxxxxxxx' },
  TN: { code: '+216', placeholder: 'xxxxxxxx' },
  OTHER: { code: '+', placeholder: '' }
};

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const currentUser = user;
  const userData = user;
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const t = (key) => translations[language][key] || key;
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'users_managers';

  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'admin', phoneNumber: '', licenseKey: '', country: 'EG', subscriptionType: 'months', subscriptionDuration: '1' });
  const [editingUser, setEditingUser] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [imageToUpload, setImageToUpload] = useState(null);

  const isEmployee = userData?.role === 'employee';
  const dateLocale = isRTL ? 'ar-EG' : 'en-US';

  const phoneSpanStyle = {
    position: 'absolute',
    [isRTL ? 'right' : 'left']: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text3)',
    fontSize: '12px',
    direction: 'ltr',
    [isRTL ? 'borderLeft' : 'borderRight']: '1px solid var(--line)',
    [isRTL ? 'paddingLeft' : 'paddingRight']: '8px'
  };

  const phoneInputStyle = {
    [isRTL ? 'paddingRight' : 'paddingLeft']: '56px',
    textAlign: 'left',
    direction: 'ltr'
  };

  const toast = (msg, type = 'info') => {
    const toastEl = document.createElement('div');
    toastEl.style.cssText = `position:fixed;bottom:20px;${isRTL ? 'right' : 'left'}:20px;padding:12px 24px;border-radius:8px;background:${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};color:#fff;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.1);font-weight:bold;`;
    toastEl.textContent = msg;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 3000);
  };

  const generateLicenseKey = (setter = setNewUser, prev = null) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const key = `GS-${segment()}-${segment()}-${segment()}`;
    if (setter === setNewUser) setNewUser(p => ({ ...p, licenseKey: key }));
    else setter(p => ({ ...p, licenseKey: key }));
  };

  const getDefaultRole = (tab) => {
    if (tab === 'users_team') return 'super_admin';
    if (tab === 'users_managers') return 'admin';
    return 'user';
  };

  useEffect(() => {
    setSelectedManager(null);
    setSearchTerm('');
    setFilterRole('all');
    setNewUser({ name: '', email: '', password: '', role: getDefaultRole(activeTab), phoneNumber: '', licenseKey: '', country: 'EG', subscriptionType: 'months', subscriptionDuration: '1' });
    if (activeTab.startsWith('users')) fetchUsers();
    else if (activeTab === 'library') fetchBooks();
    else if (activeTab === 'templates') fetchTemplates();
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError(t('superAdmin.errorLoadUsers'));
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const q = query(collection(libDb, 'brandLibrary'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setBooks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.type === 'book' || d.type === 'pdf'));
    } catch (err) {
      setError(t('superAdmin.errorLoadBooks'));
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const q = query(collection(libDb, 'brandLibrary'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setTemplates(snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(d => d.type === 'template' || d.type === 'automation'));
    } catch (err) {
      setError(t('superAdmin.errorLoadTemplates'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      const appName = `Secondary_${Date.now()}`;
      const secondaryApp = initializeApp(firebaseConfig, appName);
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, newUser.password);

      const userDoc = {
        uid: userCredential.user.uid,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      };

      if (newUser.role === 'user') {
        userDoc.phoneNumber = `${countryData[newUser.country].code}${newUser.phoneNumber}`;
        userDoc.licenseKey = newUser.licenseKey;
        userDoc.country = newUser.country;
        userDoc.adminId = currentUser.uid;
        userDoc.adminEmail = currentUser.email;
        userDoc.adminName = currentUser.email.split('@')[0];

        let expiresAt = null;
        if (newUser.subscriptionType === 'days') {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + parseInt(newUser.subscriptionDuration || '1'));
        } else if (newUser.subscriptionType === 'months') {
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + parseInt(newUser.subscriptionDuration || '1'));
        }
        userDoc.subscriptionType = newUser.subscriptionType || 'months';
        userDoc.subscriptionDuration = newUser.subscriptionType === 'lifetime' ? null : (newUser.subscriptionDuration || '1');
        userDoc.expiresAt = expiresAt;
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
      await signOut(secondaryAuth);
      await deleteApp(secondaryApp);

      setShowAddModal(false);
      setNewUser({ name: '', email: '', password: '', role: getDefaultRole(activeTab), phoneNumber: '', licenseKey: '', country: 'EG' });
      fetchUsers();
      toast(t('superAdmin.toastCreated'), 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditClick = (user) => {
    const country = user.country || 'EG';
    const code = countryData[country]?.code || '+20';
    setEditingUser({
      ...user,
      country,
      phoneNumber: user.phoneNumber?.startsWith(code) ? user.phoneNumber.slice(code.length) : (user.phoneNumber || '')
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      const updateData = { name: editingUser.name };
      if (editingUser.role === 'user') {
        updateData.phoneNumber = `${countryData[editingUser.country || 'EG'].code}${editingUser.phoneNumber}`;
        updateData.licenseKey = editingUser.licenseKey;
        updateData.country = editingUser.country || 'EG';

        let expiresAt = null;
        if (editingUser.subscriptionType === 'days') {
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + parseInt(editingUser.subscriptionDuration || '1'));
        } else if (editingUser.subscriptionType === 'months') {
          expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + parseInt(editingUser.subscriptionDuration || '1'));
        }
        updateData.subscriptionTier = editingUser.subscriptionTier || 'silver';
        updateData.subscriptionType = editingUser.subscriptionType;
        updateData.subscriptionDuration = editingUser.subscriptionType === 'lifetime' ? null : editingUser.subscriptionDuration;
        updateData.expiresAt = expiresAt;
        updateData.isTrial = false;
      }
      await updateDoc(doc(db, 'users', editingUser.id), updateData);
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
      toast(t('superAdmin.toastUpdated'), 'success');
    } catch (err) {
      setError(t('superAdmin.errorUpdate') + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQuickChangePlan = async (userId, newTier) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        subscriptionTier: newTier,
        isTrial: false
      });
      fetchUsers();
      toast(t('superAdmin.toastUpdated'), 'success');
    } catch (err) {
      console.error("Error updating plan:", err);
      setError(err.message);
    }
  };

  const handleQuickExtendSubscription = async (user, extraDays = 30) => {
    try {
      let currentExp = user.expiresAt ? (user.expiresAt.toDate ? user.expiresAt.toDate() : (user.expiresAt.seconds ? new Date(user.expiresAt.seconds * 1000) : new Date(user.expiresAt))) : new Date();
      if (currentExp < new Date()) currentExp = new Date();
      const newExp = new Date(currentExp);
      newExp.setDate(newExp.getDate() + extraDays);

      await updateDoc(doc(db, 'users', user.id), {
        expiresAt: newExp,
        isTrial: false
      });
      fetchUsers();
      toast(t('superAdmin.toastUpdated'), 'success');
    } catch (err) {
      console.error("Error extending subscription:", err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm(t('superAdmin.confirmDeleteAccount'))) return;
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast(t('superAdmin.toastDeleted'), 'info');
    } catch (err) {
      setError(t('superAdmin.errorDelete') + err.message);
    }
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    handleSaveTemplate(editingBook);
  };

  const handleSaveTemplate = async (template) => {
    setIsCreating(true);
    try {
      let updatedTemplate = { ...template };
      if (fileToUpload) {
        setUploading(true);
        const fileRef = ref(libStorage, `library/pdfs/${Date.now()}_${fileToUpload.name}`);
        const snapshot = await uploadBytes(fileRef, fileToUpload);
        updatedTemplate.pdfUrl = await getDownloadURL(snapshot.ref);
        setFileToUpload(null);
      }
      if (imageToUpload) {
        setUploading(true);
        const imgRef = ref(libStorage, `library/images/${Date.now()}_${imageToUpload.name}`);
        const snapshot = await uploadBytes(imgRef, imageToUpload);
        updatedTemplate.imageUrl = await getDownloadURL(snapshot.ref);
        setImageToUpload(null);
      }
      if (updatedTemplate.id) {
        const { id, ...data } = updatedTemplate;
        await setDoc(doc(libDb, 'brandLibrary', id), { ...data, updatedAt: Date.now() }, { merge: true });
      } else {
        await addDoc(collection(libDb, 'brandLibrary'), { ...updatedTemplate, createdAt: Date.now() });
      }
      if (updatedTemplate.type === 'template') fetchTemplates(); else fetchBooks();
      setShowBookModal(false);
      setEditingBook(null);
      setUploading(false);
      toast(t('superAdmin.toastSaved'), 'success');
    } catch (err) {
      setError(err.message);
      setUploading(false);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!window.confirm(t('superAdmin.confirmDeleteTemplate'))) return;
    try {
      await deleteDoc(doc(libDb, 'brandLibrary', id));
      fetchTemplates();
      toast(t('superAdmin.toastDeleted'), 'info');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm(t('superAdmin.confirmDeleteBook'))) return;
    try {
      await deleteDoc(doc(libDb, 'brandLibrary', id));
      fetchBooks();
      toast(t('superAdmin.toastDeleted'), 'info');
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedManager) {
      return matchesSearch && u.adminId === selectedManager.uid;
    }

    if (activeTab === 'users_team') {
      const isTeam = u.role === 'super_admin' || u.role === 'employee';
      if (!isTeam) return false;
      if (filterRole !== 'all' && u.role !== filterRole) return false;
      return matchesSearch;
    }

    const roleMap = { users_managers: 'admin', users_clients: 'user' };
    const targetRole = roleMap[activeTab];
    if (targetRole) return matchesSearch && u.role === targetRole;
    return matchesSearch;
  });

  const getTrialStatus = (user) => {
    if (!user.isTrial) return null;
    let expiresMs = 0;
    if (user.expiresAt) {
      const ts = user.expiresAt;
      expiresMs = ts?.toDate ? ts.toDate().getTime() : (ts?.seconds ? ts.seconds * 1000 : (ts ? new Date(ts).getTime() : 0));
    } else if (user.trialStartedAt) {
      const trialDays = 7; // Default trial days
      const ts = user.trialStartedAt;
      const startMs = ts?.toDate ? ts.toDate().getTime() : (ts?.seconds ? ts.seconds * 1000 : (ts ? new Date(ts).getTime() : 0));
      expiresMs = startMs + trialDays * 86400000;
    }
    if (!expiresMs) return null;
    if (Date.now() > expiresMs) return { expired: true, daysLeft: 0 };
    return { expired: false, daysLeft: Math.max(1, Math.ceil((expiresMs - Date.now()) / 86400000)) };
  };

  const getSubscriptionStatus = (user) => {
    if (!user.expiresAt) return null;
    const ts = user.expiresAt;
    const expiresMs = ts?.toDate ? ts.toDate().getTime() : (ts?.seconds ? ts.seconds * 1000 : (ts ? new Date(ts).getTime() : 0));
    if (Date.now() > expiresMs) return { expired: true, daysLeft: 0 };
    return { expired: false, daysLeft: Math.max(1, Math.ceil((expiresMs - Date.now()) / 86400000)) };
  };

  const getTabTitle = () => {
    const titles = {
      users_managers: t('superAdmin.managersTitle'),
      users_clients: t('superAdmin.clientsTitle'),
      users_team: t('superAdmin.teamTitle')
    };
    return titles[activeTab] || t('superAdmin.usersTitle');
  };

  const getTabDesc = () => {
    const descs = {
      users_managers: t('superAdmin.managersDesc'),
      users_clients: t('superAdmin.clientsDesc'),
      users_team: t('superAdmin.teamDesc')
    };
    return descs[activeTab] || t('superAdmin.usersDesc');
  };

  const getAddBtnLabel = () => {
    if (activeTab === 'users_team') return t('superAdmin.addTeamMember');
    if (activeTab === 'users_managers') return t('superAdmin.addManager');
    return t('superAdmin.addClient');
  };

  const roleBadge = (role) => {
    const map = {
      super_admin: { label: t('superAdmin.roleSuperAdmin'), cls: 'badge-blue' },
      employee: { label: t('superAdmin.roleEmployee'), cls: 'badge-purple' },
      admin: { label: t('superAdmin.roleAdmin'), cls: 'badge-amber' },
      user: { label: t('superAdmin.roleUser'), cls: 'badge-green' }
    };
    const r = map[role] || { label: role, cls: '' };
    return <span className={`badge ${r.cls}`}>{r.label}</span>;
  };

  return (
    <div className="animate-fade-slide">

      {activeTab.startsWith('users') ? (
        <>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {selectedManager && (
                  <button onClick={() => setSelectedManager(null)} className="btn btn-ghost" style={{ padding: '4px', borderRadius: '50%' }}>
                    <X size={20} />
                  </button>
                )}
                <h2 style={{ fontSize: '24px', fontWeight: '900' }}>
                  {selectedManager
                    ? t('superAdmin.clientsOf', { name: selectedManager.name || selectedManager.email.split('@')[0] })
                    : getTabTitle()}
                </h2>
                <span className="badge badge-blue" style={{ fontSize: '13px', padding: '4px 10px' }}>
                  {filteredUsers.length}
                </span>
              </div>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
                {selectedManager
                  ? t('superAdmin.addedBy', { email: selectedManager.email })
                  : getTabDesc()}
              </p>
              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red)', padding: '8px 14px', borderRadius: '8px', marginTop: '8px', fontSize: '13px', border: '1px solid rgba(239,68,68,0.2)' }}>
                  ⚠️ {error}
                </div>
              )}
            </div>
            {!isEmployee && (
              <button
                onClick={() => {
                  setNewUser({ name: '', email: '', password: '', role: getDefaultRole(activeTab), phoneNumber: '', licenseKey: '', country: 'EG' });
                  setError(null);
                  setShowAddModal(true);
                }}
                className="btn btn-primary"
              >
                <UserPlus size={18} />
                <span>{getAddBtnLabel()}</span>
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid-2" style={{ marginBottom: '24px' }}>
            <div className={`card ${activeTab.startsWith('users') ? 'active-stat' : ''}`} style={{ border: activeTab.startsWith('users') ? '1px solid var(--accent)' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Users size={20} color="var(--accent)" />
                <div className="badge badge-blue">{users.length}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text2)' }}>{t('superAdmin.totalAccounts')}</div>
            </div>
            <div className={`card ${activeTab === 'users_clients' ? 'active-stat' : ''}`} style={{ border: activeTab === 'users_clients' ? '1px solid var(--green)' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Activity size={20} color="var(--green)" />
                <div className="badge badge-green">{users.filter(u => u.role === 'user').length}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text2)' }}>{t('superAdmin.clients')}</div>
            </div>
            <div className={`card ${activeTab === 'users_managers' ? 'active-stat' : ''}`} style={{ border: activeTab === 'users_managers' ? '1px solid var(--amber)' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Shield size={20} color="var(--amber)" />
                <div className="badge badge-amber">{users.filter(u => u.role === 'admin').length}</div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text2)' }}>{t('superAdmin.managers')}</div>
            </div>
            <div className={`card ${activeTab === 'users_team' ? 'active-stat' : ''}`} style={{ border: activeTab === 'users_team' ? '1px solid var(--purple)' : '1px solid var(--line)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <UserCheck size={20} color="var(--purple)" />
                <div className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: 'var(--purple)' }}>
                  {users.filter(u => u.role === 'super_admin' || u.role === 'employee').length}
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text2)' }}>{t('superAdmin.team')}</div>
            </div>
          </div>

          {/* Table Card */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            {/* Search + Filter Bar */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px' }}>
                <Search size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
                <input
                  className="form-control"
                  style={{ [isRTL ? 'paddingRight' : 'paddingLeft']: '36px' }}
                  placeholder={t('superAdmin.searchPlaceholder')}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {activeTab === 'users_team' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Filter size={14} color="var(--text3)" />
                  {[
                    { val: 'all', label: t('superAdmin.allFilter') },
                    { val: 'super_admin', label: t('superAdmin.superAdminFilter') },
                    { val: 'employee', label: t('superAdmin.employeeFilter') }
                  ].map(f => (
                    <button
                      key={f.val}
                      onClick={() => setFilterRole(f.val)}
                      className={`filter-chip${filterRole === f.val ? ' active' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              <div style={{ marginInlineStart: 'auto', fontSize: '13px', color: 'var(--text3)', fontWeight: '600' }}>
                {t('superAdmin.results', { count: filteredUsers.length })}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}><div className="loader"></div></div>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--line)' }}>
                    <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.userCol')}</th>
                    <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.permissionCol')}</th>
                    {activeTab === 'users_clients' && (
                      <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.phoneCol')}</th>
                    )}
                    <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{language === 'ar' ? 'صلاحية الاشتراك' : 'Subscription'}</th>
                    <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.byCol')}</th>
                    <th style={{ padding: '14px 20px', textAlign: 'start', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.joinDateCol')}</th>
                    <th style={{ padding: '14px 20px', textAlign: 'center', fontSize: '12px', color: 'var(--text2)' }}>{t('superAdmin.operationsCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={activeTab === 'users_clients' ? "7" : "6"} style={{ padding: '60px', textAlign: 'center', color: 'var(--text3)' }}>
                        {t('superAdmin.noUsers')}
                      </td>
                    </tr>
                  ) : filteredUsers.map(user => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: '1px solid var(--line)',
                        cursor: (activeTab === 'users_managers' && !selectedManager) ? 'pointer' : 'default',
                        transition: 'background 0.15s'
                      }}
                      onClick={() => {
                        if (activeTab === 'users_managers' && !selectedManager) setSelectedManager(user);
                      }}
                      onMouseEnter={e => {
                        if (activeTab === 'users_managers' && !selectedManager) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>{user.name || t('superAdmin.noName')}</span>
                            <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>{roleBadge(user.role)}</td>
                      {activeTab === 'users_clients' && (
                        <td style={{ padding: '14px 20px', color: 'var(--text2)', fontSize: '13px' }}>
                          {user.phoneNumber || '—'}
                        </td>
                      )}
                      <td style={{ padding: '14px 20px' }}>
                        {user.role === 'super_admin' || user.role === 'employee' ? (
                          <span style={{ color: 'var(--text3)', fontSize: '12px' }}>
                            ♾️ {language === 'ar' ? 'وصول كامل' : 'Lifetime Access'}
                          </span>
                        ) : user.isTrial ? (() => {
                          const ts = getTrialStatus(user);
                          if (!ts) return <span style={{ fontSize: '12px', color: 'var(--text3)' }}>{language === 'ar' ? 'فترة تجريبية' : 'Free Trial'}</span>;
                          if (ts.expired) return (
                            <span style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                              ❌ {language === 'ar' ? 'انتهت التجريبية' : 'Trial Expired'}
                            </span>
                          );
                          return (
                            <span style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                              ⏰ {ts.daysLeft} {language === 'ar' ? 'يوم متبقي' : 'days left'}
                            </span>
                          );
                        })() : (() => {
                          const ss = getSubscriptionStatus(user);
                          if (!ss) return <span style={{ color: 'var(--text3)', fontSize: '12px' }}>♾️ {language === 'ar' ? 'وصول كامل' : 'Lifetime Access'}</span>;
                          if (ss.expired) return (
                            <span style={{ background: 'rgba(239,68,68,0.12)', color: 'var(--red)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                              ❌ {language === 'ar' ? 'منتهي' : 'Expired'}
                            </span>
                          );
                          return (
                            <span style={{ background: 'rgba(16,185,129,0.12)', color: 'var(--green)', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                              ⏰ {ss.daysLeft} {language === 'ar' ? 'يوم متبقي' : 'days left'}
                            </span>
                          );
                        })()}

                        {user.role === 'user' && (
                          <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                            <select
                              value={user.subscriptionTier || 'silver'}
                              onChange={(e) => handleQuickChangePlan(user.id, e.target.value)}
                              style={{
                                background: user.subscriptionTier === 'gold' ? 'rgba(245, 158, 11, 0.15)' : user.subscriptionTier === 'bronze' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                color: user.subscriptionTier === 'gold' ? '#f59e0b' : user.subscriptionTier === 'bronze' ? '#cbd5e1' : 'var(--accent)',
                                border: `1px solid ${user.subscriptionTier === 'gold' ? 'rgba(245, 158, 11, 0.3)' : user.subscriptionTier === 'bronze' ? 'rgba(148, 163, 184, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                                borderRadius: '6px',
                                padding: '2px 6px',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="bronze">{language === 'ar' ? '🥉 الباقة الأولى (Bronze)' : '🥉 Plan 1 (Bronze)'}</option>
                              <option value="silver">{language === 'ar' ? '🥈 الباقة الثانية (Silver)' : '🥈 Plan 2 (Silver)'}</option>
                              <option value="gold">{language === 'ar' ? '🥇 الباقة الذهبية (Gold VIP)' : '🥇 Plan 3 (Gold VIP)'}</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => handleQuickExtendSubscription(user, 30)}
                              className="btn btn-xs"
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: 'var(--green)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '6px',
                                padding: '2px 6px',
                                fontSize: '10px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                              }}
                              title={language === 'ar' ? 'تمديد الاشتراك لمدة 30 يوم' : 'Extend 30 Days'}
                            >
                              +30 {language === 'ar' ? 'يوم' : 'Days'}
                            </button>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text2)', fontSize: '13px' }}>
                        {user.adminName || (user.adminEmail ? user.adminEmail.split('@')[0] : <span style={{ color: 'var(--text3)' }}>{t('superAdmin.system')}</span>)}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--text2)', fontSize: '13px' }}>
                        {formatUserDate(user.createdAt, language)}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                        <button
                          onClick={ev => { ev.stopPropagation(); handleEditClick(user); }}
                          className="btn btn-ghost btn-sm"
                          title={t('common.edit')}
                          style={{ padding: '6px' }}
                        >
                          <Edit3 size={14} />
                        </button>
                        {!isEmployee && (
                          <button
                            onClick={ev => { ev.stopPropagation(); handleDeleteUser(user.id); }}
                            className="btn btn-ghost btn-sm"
                            title={t('common.delete')}
                            style={{ padding: '6px', color: 'var(--red)' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </>

      ) : activeTab === 'templates' ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900' }}>{t('superAdmin.templatesTitle')}</h2>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{t('superAdmin.templatesDesc')}</p>
            </div>
            <button onClick={() => { setEditingBook({ type: 'template', title: '', badge: '', badgeClass: 'badge-blue', description: '', downloadId: '', fileUrl: '' }); setShowBookModal(true); }} className="btn btn-primary">
              <Plus size={18} />
              <span>{t('superAdmin.addTemplate')}</span>
            </button>
          </div>
          <div className="grid-3">
            {templates.map((temp, i) => (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div className="flex-between" style={{ marginBottom: '12px' }}>
                  <div className={`badge ${temp.badgeClass}`}>{temp.badge}</div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { setEditingBook({ ...temp, type: 'template' }); setShowBookModal(true); }} className="btn btn-ghost btn-sm" style={{ padding: '6px' }}><Edit3 size={14} /></button>
                    <button onClick={() => handleDeleteTemplate(temp.id)} className="btn btn-ghost btn-sm" style={{ padding: '6px', color: 'var(--red)' }}><Trash2 size={14} /></button>
                  </div>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>{temp.title}</h3>
                <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{temp.description}</p>
                <div style={{ fontSize: '11px', color: 'var(--text3)', background: 'rgba(255,255,255,0.02)', padding: '6px 10px', borderRadius: '6px' }}>
                  ID: {temp.downloadId || 'N/A'}
                </div>
              </div>
            ))}
            {templates.length === 0 && !loading && (
              <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text3)' }}>{t('superAdmin.noTemplates')}</div>
            )}
          </div>
        </>

      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900' }}>{t('superAdmin.libraryTitle')}</h2>
              <p style={{ color: 'var(--text2)', fontSize: '14px' }}>{t('superAdmin.libraryDesc')}</p>
            </div>
            <button onClick={() => { setEditingBook({ type: 'book', title: '', badge: '', badgeClass: 'badge-blue', description: '', pdfUrl: '', imageUrl: '' }); setShowBookModal(true); }} className="btn btn-primary">
              <Plus size={18} />
              <span>{t('superAdmin.addBook')}</span>
            </button>
          </div>
          <div className="grid-3">
            {books.map((book, i) => (
              <div key={i} className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ height: '100px', background: book.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  {book.title}
                </div>
                <div style={{ padding: '15px' }}>
                  <div className={`badge ${book.badgeClass}`} style={{ marginBottom: '8px' }}>{book.badge}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>{book.description}</p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => { setEditingBook(book); setShowBookModal(true); }} className="btn btn-ghost btn-sm" style={{ flex: 1 }}><Edit3 size={14} /> {t('common.edit')}</button>
                    <button onClick={() => handleDeleteBook(book.id)} className="btn btn-ghost btn-sm" style={{ flex: 1, color: 'var(--red)' }}><Trash2 size={14} /> {t('common.delete')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ===== Add User Modal ===== */}
      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                {activeTab === 'users_team' ? t('superAdmin.addTeamTitle') : activeTab === 'users_managers' ? t('superAdmin.addManagerTitle') : t('superAdmin.addClientTitle')}
              </h3>
              <button onClick={() => { setShowAddModal(false); setError(null); }} className="btn btn-ghost" style={{ padding: '5px', borderRadius: '50%' }}><X size={20} /></button>
            </div>
            {error && <div style={{ padding: '10px 24px', color: 'var(--red)', fontSize: '13px' }}>⚠️ {error}</div>}
            <form onSubmit={handleAddUser}>
              <div className="modal-body">

                <div className="field">
                  <label className="field-label">{t('common.fullName')}</label>
                  <input className="form-control" type="text" required placeholder={t('superAdmin.fullNamePlaceholder')} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                </div>

                {activeTab === 'users_team' && (
                  <div className="field">
                    <label className="field-label">{t('superAdmin.memberType')}</label>
                    <select className="form-control" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                      <option value="super_admin">{t('superAdmin.superAdminRole')}</option>
                      <option value="employee">{t('superAdmin.employeeRole')}</option>
                    </select>
                  </div>
                )}

                {activeTab === 'users_clients' && (
                  <div className="grid-2">
                    <div className="field">
                      <label className="field-label">{t('common.country')}</label>
                      <select className="form-control" value={newUser.country} onChange={e => setNewUser({ ...newUser, country: e.target.value })}>
                        <option value="EG">{t('countries.EG')}</option>
                        <option value="SA">{t('countries.SA')}</option>
                        <option value="AE">{t('countries.AE')}</option>
                        <option value="KW">{t('countries.KW')}</option>
                        <option value="QA">{t('countries.QA')}</option>
                        <option value="JO">{t('countries.JO')}</option>
                        <option value="MA">{t('countries.MA')}</option>
                        <option value="TN">{t('countries.TN')}</option>
                        <option value="OTHER">{t('countries.OTHER')}</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="field-label">{t('common.phoneNumber')}</label>
                      <div style={{ position: 'relative' }}>
                        <span style={phoneSpanStyle}>
                          {countryData[newUser.country].code}
                        </span>
                        <input className="form-control" type="text" required value={newUser.phoneNumber} onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })} placeholder={countryData[newUser.country].placeholder} style={phoneInputStyle} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="field">
                  <label className="field-label">{t('common.email')}</label>
                  <input className="form-control" type="email" required value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@example.com" />
                </div>

                <div className="field">
                  <label className="field-label">{t('common.password')}</label>
                  <input className="form-control" type="password" required value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="••••••••" />
                </div>

                {activeTab === 'users_clients' && (
                  <>
                    <div className="field" style={{ marginBottom: '12px' }}>
                      <label className="field-label" style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                        {language === 'ar' ? 'خطة الاشتراك / الباقة (Subscription Plan)' : 'Subscription Plan'}
                      </label>
                      <select
                        className="form-control"
                        style={{ borderColor: 'var(--accent)', background: 'rgba(99,102,241,0.08)', fontWeight: 'bold' }}
                        value={newUser.subscriptionTier || 'silver'}
                        onChange={e => setNewUser({ ...newUser, subscriptionTier: e.target.value })}
                      >
                        <option value="bronze">{language === 'ar' ? '🥉 الباقة الأولى (Bronze Plan)' : '🥉 Plan 1 (Bronze)'}</option>
                        <option value="silver">{language === 'ar' ? '🥈 الباقة الثانية (Silver Plan - Pro)' : '🥈 Plan 2 (Silver)'}</option>
                        <option value="gold">{language === 'ar' ? '🥇 الباقة الذهبية (Gold Plan - VIP)' : '🥇 Plan 3 (Gold / VIP)'}</option>
                      </select>
                    </div>

                    <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
                      <div className="field">
                        <label className="field-label">{t('common.subType')}</label>
                        <select
                          className="form-control"
                          value={newUser.subscriptionType || 'months'}
                          onChange={e => setNewUser({ ...newUser, subscriptionType: e.target.value, subscriptionDuration: e.target.value === 'lifetime' ? '' : '1' })}
                        >
                          <option value="days">{t('common.daysOpt')}</option>
                          <option value="months">{t('common.monthsOpt')}</option>
                          <option value="lifetime">{t('common.lifetimeOpt')}</option>
                        </select>
                      </div>
                      {(newUser.subscriptionType || 'months') !== 'lifetime' && (
                        <div className="field">
                          <label className="field-label">{t('common.duration')}</label>
                          <input
                            className="form-control"
                            type="number"
                            min="1"
                            required
                            value={newUser.subscriptionDuration || '1'}
                            onChange={e => setNewUser({ ...newUser, subscriptionDuration: e.target.value })}
                            placeholder={t('common.duration')}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}


              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => { setShowAddModal(false); setError(null); }} className="btn" style={{ flex: 1 }}>{t('common.cancel')}</button>
                <button type="submit" disabled={isCreating} className="btn btn-primary" style={{ flex: 1 }}>
                  {isCreating ? t('common.adding') : t('common.createAccount')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Edit User Modal ===== */}
      {showEditModal && editingUser && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{t('superAdmin.editUserTitle')}</h3>
              <button onClick={() => { setShowEditModal(false); setError(null); }} className="btn btn-ghost" style={{ padding: '5px', borderRadius: '50%' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '4px 24px 0', fontSize: '12px', color: 'var(--text3)' }}>{editingUser.email}</div>
            {error && <div style={{ padding: '8px 24px', color: 'var(--red)', fontSize: '13px' }}>⚠️ {error}</div>}
            <form onSubmit={handleUpdateUser}>
              <div className="modal-body">
                <div className="field">
                  <label className="field-label">{t('common.fullName')}</label>
                  <input className="form-control" type="text" required value={editingUser.name || ''} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} placeholder={t('common.fullName')} />
                </div>

                {editingUser.role === 'user' && (
                  <>
                    <div className="grid-2">
                      <div className="field">
                        <label className="field-label">{t('common.country')}</label>
                        <select className="form-control" value={editingUser.country || 'EG'} onChange={e => setEditingUser({ ...editingUser, country: e.target.value })}>
                          <option value="EG">{t('countries.EG')}</option>
                          <option value="SA">{t('countries.SA')}</option>
                          <option value="AE">{t('countries.AE')}</option>
                          <option value="KW">{t('countries.KW')}</option>
                          <option value="QA">{t('countries.QA')}</option>
                          <option value="JO">{t('countries.JO')}</option>
                          <option value="MA">{t('countries.MA')}</option>
                          <option value="TN">{t('countries.TN')}</option>
                          <option value="OTHER">{t('countries.OTHER')}</option>
                        </select>
                      </div>
                      <div className="field">
                        <label className="field-label">{t('common.phoneNumber')}</label>
                        <div style={{ position: 'relative' }}>
                          <span style={phoneSpanStyle}>
                            {countryData[editingUser.country || 'EG'].code}
                          </span>
                          <input className="form-control" type="text" required value={editingUser.phoneNumber || ''} onChange={e => setEditingUser({ ...editingUser, phoneNumber: e.target.value })} placeholder={countryData[editingUser.country || 'EG'].placeholder} style={phoneInputStyle} />
                        </div>
                      </div>
                    </div>
                    <div className="field" style={{ marginBottom: '12px' }}>
                      <label className="field-label" style={{ fontWeight: 'bold', color: 'var(--accent)' }}>
                        {language === 'ar' ? 'خطة الاشتراك / الباقة (Subscription Plan)' : 'Subscription Plan'}
                      </label>
                      <select
                        className="form-control"
                        style={{ borderColor: 'var(--accent)', background: 'rgba(99,102,241,0.08)', fontWeight: 'bold' }}
                        value={editingUser.subscriptionTier || 'silver'}
                        onChange={e => setEditingUser({ ...editingUser, subscriptionTier: e.target.value })}
                      >
                        <option value="bronze">{language === 'ar' ? '🥉 الباقة الأولى (Bronze Plan)' : '🥉 Plan 1 (Bronze)'}</option>
                        <option value="silver">{language === 'ar' ? '🥈 الباقة الثانية (Silver Plan - Pro)' : '🥈 Plan 2 (Silver)'}</option>
                        <option value="gold">{language === 'ar' ? '🥇 الباقة الذهبية (Gold Plan - VIP)' : '🥇 Plan 3 (Gold / VIP)'}</option>
                      </select>
                    </div>

                    <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
                      <div className="field">
                        <label className="field-label">{t('common.subType')}</label>
                        <select
                          className="form-control"
                          value={editingUser.subscriptionType || 'months'}
                          onChange={e => setEditingUser({ ...editingUser, subscriptionType: e.target.value, subscriptionDuration: e.target.value === 'lifetime' ? '' : '1' })}
                        >
                          <option value="days">{t('common.daysOpt')}</option>
                          <option value="months">{t('common.monthsOpt')}</option>
                          <option value="lifetime">{t('common.lifetimeOpt')}</option>
                        </select>
                      </div>
                      {(editingUser.subscriptionType || 'months') !== 'lifetime' && (
                        <div className="field">
                          <label className="field-label">{t('common.duration')}</label>
                          <input
                            className="form-control"
                            type="number"
                            min="1"
                            required
                            value={editingUser.subscriptionDuration || '1'}
                            onChange={e => setEditingUser({ ...editingUser, subscriptionDuration: e.target.value })}
                            placeholder={t('common.duration')}
                          />
                        </div>
                      )}
                    </div>

                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => { setShowEditModal(false); setError(null); }} className="btn" style={{ flex: 1 }}>{t('common.cancel')}</button>
                <button type="submit" disabled={isCreating} className="btn btn-primary" style={{ flex: 1 }}>
                  {isCreating ? t('common.saving') : t('common.saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Book / Template Modal ===== */}
      {showBookModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '750px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                {editingBook?.id ? t('common.edit') : t('superAdmin.addBook').split(' ')[0]}{' '}
                {editingBook?.type === 'template' ? t('superAdmin.addTemplate').split(' ').slice(-1)[0] : t('superAdmin.addBook').split(' ').slice(-1)[0]}
              </h3>
              <button onClick={() => setShowBookModal(false)} className="btn btn-ghost" style={{ padding: '5px', borderRadius: '50%' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBook} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div className="modal-body">
                <div className="field">
                  <label className="field-label">{t('superAdmin.titleLabel')}</label>
                  <input className="form-control" required value={editingBook.title} onChange={e => setEditingBook({ ...editingBook, title: e.target.value })} />
                </div>
                <div className="grid-2">
                  <div className="field">
                    <label className="field-label">{t('superAdmin.badgeText')}</label>
                    <input className="form-control" value={editingBook.badge || ''} onChange={e => setEditingBook({ ...editingBook, badge: e.target.value })} />
                  </div>
                  <div className="field">
                    <label className="field-label">{t('superAdmin.badgeColor')}</label>
                    <select className="form-control" value={editingBook.badgeClass || 'badge-blue'} onChange={e => setEditingBook({ ...editingBook, badgeClass: e.target.value })}>
                      <option value="badge-blue">{t('superAdmin.blue')}</option>
                      <option value="badge-green">{t('superAdmin.green')}</option>
                      <option value="badge-purple">{t('superAdmin.purple')}</option>
                      <option value="badge-amber">{t('superAdmin.orange')}</option>
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">{t('superAdmin.descriptionLabel')}</label>
                  <textarea className="form-control" style={{ minHeight: '80px' }} value={editingBook.description || ''} onChange={e => setEditingBook({ ...editingBook, description: e.target.value })} />
                </div>
                <div className="field">
                  <label className="field-label">{t('superAdmin.fileUrlLabel')}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-control" placeholder="https://example.com/file.pdf" value={editingBook.pdfUrl || ''} onChange={e => setEditingBook({ ...editingBook, pdfUrl: e.target.value })} />
                    <label className="btn btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Plus size={14} /> {t('superAdmin.uploadPDF')}
                      <input type="file" accept=".pdf,.doc,.docx,.xlsx" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) { setFileToUpload(e.target.files[0]); toast(t('superAdmin.willUpload', { name: e.target.files[0].name }), 'info'); } }} />
                    </label>
                  </div>
                  {fileToUpload && <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '4px' }}>{t('superAdmin.willUpload', { name: fileToUpload.name })}</div>}
                </div>
                <div className="field">
                  <label className="field-label">{t('superAdmin.imageLabel')}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input className="form-control" placeholder="https://example.com/image.png" value={editingBook.imageUrl || ''} onChange={e => setEditingBook({ ...editingBook, imageUrl: e.target.value })} />
                    <label className="btn btn-sm" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Plus size={14} /> {t('superAdmin.uploadImage')}
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) { setImageToUpload(e.target.files[0]); toast(t('superAdmin.willUploadImage', { name: e.target.files[0].name }), 'info'); } }} />
                    </label>
                  </div>
                  {imageToUpload && <div style={{ fontSize: '11px', color: 'var(--green)', marginTop: '4px' }}>{t('superAdmin.willUploadImage', { name: imageToUpload.name })}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setShowBookModal(false)} className="btn" style={{ flex: 1 }}>{t('common.cancel')}</button>
                <button type="submit" onClick={e => { e.preventDefault(); handleSaveTemplate(editingBook); }} disabled={isCreating} className="btn btn-primary" style={{ flex: 1 }}>
                  <Save size={18} />
                  {isCreating ? t('common.saving') : (editingBook?.type === 'template' ? t('superAdmin.saveTemplate') : t('superAdmin.saveBook'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
