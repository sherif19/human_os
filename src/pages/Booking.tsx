import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  FileText,
  User,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { cn } from '../lib/utils';
import { db } from '../lib/firebase';
import { collection, setDoc, doc, query, where, getDocs, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Booking() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [note, setNote] = useState('');
  
  // Bookings list state
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Time Slots definition (Localized, 30-minute intervals from 09:00 AM to 06:00 PM)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM
    
    const formatNumberAr = (num: number) => {
      const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return String(num).split('').map(digit => arDigits[parseInt(digit)] || digit).join('');
    };

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === endHour && minute > 0) break; // Don't exceed 06:00 PM
        
        const isPM = hour >= 12;
        const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
        const ampm = isPM ? 'PM' : 'AM';
        const ampmAr = isPM ? 'م' : 'ص';
        
        const hourStr = String(displayHour).padStart(2, '0');
        const minuteStr = String(minute).padStart(2, '0');
        
        const value = `${hourStr}:${minuteStr} ${ampm}`;
        const label = `${hourStr}:${minuteStr} ${ampm}`;
        
        const hourStrAr = formatNumberAr(displayHour).padStart(2, '٠');
        const minuteStrAr = formatNumberAr(minute).padStart(2, '٠');
        const labelAr = `${hourStrAr}:${minuteStrAr} ${ampmAr}`;
        
        slots.push({ value, label, labelAr });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch appointments
  useEffect(() => {
    if (!user) return;

    if (user.uid.startsWith('demo-')) {
      // Demo Mode: Load from localStorage
      const loadDemoBookings = () => {
        const stored = localStorage.getItem('humanos_demo_appointments');
        if (stored) {
          const parsed = JSON.parse(stored);
          // filter by user ID
          const userBookings = parsed.filter((b: any) => b.userId === user.uid);
          // Sort by creation date descending
          userBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setAppointments(userBookings);
        }
      };

      loadDemoBookings();
      // Listen to storage events to keep updated in case changes occur in another tab (or admin dashboard simulation)
      window.addEventListener('storage', loadDemoBookings);
      return () => window.removeEventListener('storage', loadDemoBookings);
    } else {
      // Firebase Mode: Listen to database
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(q, {
        next: (snapshot) => {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Sort in JS because composite index might not exist yet
          data.sort((a: any, b: any) => {
            const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
            const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
            return timeB - timeA;
          });
          setAppointments(data);
          setError(null);
        },
        error: (err) => {
          console.error("Error listening to appointments changes:", err);
          setError(err.message);
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Calendar Math Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const monthsList = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    ar: [
      'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
  }[language];

  const weekDays = {
    en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    ar: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت']
  }[language];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (dayNum: number) => {
    const today = new Date();
    return today.getDate() === dayNum && today.getMonth() === month && today.getFullYear() === year;
  };

  const isSelected = (dayNum: number) => {
    if (!selectedDate) return false;
    return selectedDate.getDate() === dayNum && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const isPast = (dayNum: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, dayNum);
    return checkDate < today;
  };

  const handleDayClick = (dayNum: number) => {
    if (isPast(dayNum)) return;
    setSelectedDate(new Date(year, month, dayNum));
    setSelectedSlot(null); // Reset slot choice when day changes
  };

  // Submit Booking request
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !user) return;

    setLoading(true);
    try {
      const apptId = user.uid.startsWith('demo-') ? `appt-${Date.now()}` : doc(collection(db, 'appointments')).id;
      const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      const newAppointment = {
        id: apptId,
        userId: user.uid,
        userName: user.name || user.email?.split('@')[0] || 'Client',
        userEmail: user.email || 'guest@humanos.ai',
        adminId: user.adminId || 'demo-admin', // default to demo admin
        date: formattedDate,
        timeSlot: selectedSlot,
        note: note.trim(),
        status: 'pending',
        createdAt: user.uid.startsWith('demo-') ? new Date().toISOString() : serverTimestamp()
      };

      if (user.uid.startsWith('demo-')) {
        // Save to localStorage simulation
        const existing = localStorage.getItem('humanos_demo_appointments');
        const parsed = existing ? JSON.parse(existing) : [];
        parsed.push(newAppointment);
        localStorage.setItem('humanos_demo_appointments', JSON.stringify(parsed));
        
        // Trigger storage event manually for same window notification
        window.dispatchEvent(new Event('storage'));
        
        // Refresh local state list
        const userBookings = parsed.filter((b: any) => b.userId === user.uid);
        userBookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAppointments(userBookings);
      } else {
        // Save to Firestore
        await setDoc(doc(db, 'appointments', apptId), newAppointment);
      }

      setSubmitSuccess(true);
      setNote('');
      setSelectedDate(null);
      setSelectedSlot(null);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);

    } catch (err) {
      console.error("Failed to save appointment:", err);
      alert(language === 'ar' ? 'فشل حجز الموعد. يرجى المحاولة مرة أخرى.' : 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rendering Helper
  const calendarDays = [];
  
  // Fill preceding month offsets
  for (let i = firstDayIndex; i > 0; i--) {
    calendarDays.push({
      dayNum: prevMonthDays - i + 1,
      isCurrentMonth: false,
      isPast: true
    });
  }

  // Fill current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      dayNum: i,
      isCurrentMonth: true,
      isPast: isPast(i)
    });
  }

  // Localized Labels
  const labels = {
    en: {
      title: "Book an Appointment",
      subtitle: "Schedule a private optimization session with your assigned manager/administrator.",
      selectDate: "1. Select Appointment Date",
      selectSlot: "2. Select Time Slot",
      additionalNotes: "3. Brief Purpose or Notes (Optional)",
      notesPlaceholder: "e.g., Discussion about my Personality DNA profile & consistency protocol...",
      submitBtn: "Submit Booking Request",
      bookingDetails: "Booking Summary",
      dateLabel: "Date Selected",
      slotLabel: "Time Slot",
      managerLabel: "Advisor / Admin",
      adminName: user?.adminName || "Assigned HumanOS Manager",
      requestSubmitted: "Appointment Request Submitted Successfully!",
      requestSubmittedSub: "Your manager will review and approve/reschedule the request shortly. You can track status below.",
      historyTitle: "My Appointment History",
      noHistory: "No appointment requests recorded yet.",
      colDate: "Date & Time",
      colNote: "Note",
      colStatus: "Status",
      statusPending: "Pending",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      backDashboard: "Back to Dashboard",
      advisorRole: "Advisor"
    },
    ar: {
      title: "حجز موعد جديد",
      subtitle: "جدولة جلسة تحسين وتطوير شخصية خاصة مع المدير أو المستشار المسؤول عن حسابك.",
      selectDate: "١. اختر تاريخ الموعد",
      selectSlot: "٢. اختر التوقيت المتاح",
      additionalNotes: "٣. سبب الحجز أو ملاحظات إضافية (اختياري)",
      notesPlaceholder: "مثال: مناقشة تقرير الحمض النووي للشخصية وبروتوكول الاتساق...",
      submitBtn: "إرسال طلب حجز الموعد",
      bookingDetails: "تفاصيل الحجز",
      dateLabel: "التاريخ المحدد",
      slotLabel: "التوقيت المختار",
      managerLabel: "المستشار / المسؤول",
      adminName: user?.adminName || "مسؤول النظام البشري",
      requestSubmitted: "تم إرسال طلب الموعد بنجاح!",
      requestSubmittedSub: "جاري مراجعة طلبك من قبل المسؤول للموافقة عليه أو تعديله. يمكنك متابعة حالة الطلب بالأسفل.",
      historyTitle: "سجل مواعيدي السابقة",
      noHistory: "لم يتم تسجيل أي طلبات مواعيد حتى الآن.",
      colDate: "التاريخ والتوقيت",
      colNote: "الملاحظات",
      colStatus: "الحالة",
      statusPending: "معلق",
      statusApproved: "مقبول",
      statusRejected: "مرفوض",
      backDashboard: "العودة للوحة التحكم",
      advisorRole: "المستشار"
    }
  }[language];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <CalendarIcon size={16} className="fill-brand-primary/10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{language === 'ar' ? 'جلسات الاستشارة الخاصة' : 'Private Consultation Engine'}</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">{labels.title}</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">{labels.subtitle}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Booking Interface */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 md:p-8">
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/10">
                    <CheckCircle2 size={40} />
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-white">{labels.requestSubmitted}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-medium">
                      {labels.requestSubmittedSub}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Step 1: Calendar */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-[10px]">1</span>
                      {labels.selectDate}
                    </h3>
                    
                    <div className="bg-white/5 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                      {/* Month Navigation */}
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-lg font-black text-white  tracking-tight uppercase">
                          {monthsList[month]} {year}
                        </h4>
                        <div className="flex gap-2">
                          <button 
                            type="button" 
                            onClick={handlePrevMonth}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button 
                            type="button" 
                            onClick={handleNextMonth}
                            className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:text-white transition-all"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 gap-2 text-center text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                        {weekDays.map(d => (
                          <div key={d} className="py-2">{d}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calendarDays.map((cell, idx) => {
                          const isSel = cell.isCurrentMonth && isSelected(cell.dayNum);
                          const isTod = cell.isCurrentMonth && isToday(cell.dayNum);
                          return (
                            <button
                              key={idx}
                              type="button"
                              disabled={!cell.isCurrentMonth || cell.isPast}
                              onClick={() => cell.isCurrentMonth && handleDayClick(cell.dayNum)}
                              className={cn(
                                "aspect-square rounded-2xl flex items-center justify-center font-bold text-sm transition-all border",
                                !cell.isCurrentMonth && "text-slate-700 border-transparent bg-transparent cursor-default",
                                cell.isCurrentMonth && cell.isPast && "text-slate-600 border-transparent bg-white/2 cursor-not-allowed",
                                cell.isCurrentMonth && !cell.isPast && !isSel && !isTod && "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-white/10",
                                isTod && !isSel && "border-brand-primary/40 bg-brand-primary/5 text-brand-primary",
                                isSel && "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20 hover:scale-105"
                              )}
                            >
                              {cell.dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Time Slots */}
                  {selectedDate && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-[10px]">2</span>
                        {labels.selectSlot}
                      </h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.value}
                            type="button"
                            onClick={() => setSelectedSlot(slot.value)}
                            className={cn(
                              "p-4 rounded-2xl border text-center transition-all group font-bold text-xs uppercase tracking-widest",
                              selectedSlot === slot.value
                                ? "bg-brand-primary border-brand-primary text-white shadow-xl shadow-brand-primary/20"
                                : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-white"
                            )}
                          >
                            <span className="flex items-center justify-center gap-1.5">
                              <Clock size={12} className={cn(selectedSlot === slot.value ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                              {language === 'ar' ? slot.labelAr : slot.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Additional note */}
                  {selectedSlot && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-primary/15 text-brand-primary flex items-center justify-center text-[10px]">3</span>
                        {labels.additionalNotes}
                      </h3>
                      
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={labels.notesPlaceholder}
                        rows={3}
                        className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/30 rounded-2xl p-4 text-sm text-white focus:outline-none transition-all placeholder:text-slate-600 resize-none font-medium"
                      />

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/25 hover:scale-[1.01] active:scale-[0.99] hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Sparkles size={14} />
                            {labels.submitBtn}
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-6">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] border-b border-white/5 pb-4">
              {labels.bookingDetails}
            </h3>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest">{labels.managerLabel}</span>
                <span className="text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  {labels.adminName}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest">{labels.dateLabel}</span>
                <span className="text-brand-primary uppercase tracking-wider">
                  {selectedDate ? selectedDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-500 uppercase tracking-widest">{labels.slotLabel}</span>
                <span className="text-brand-primary">
                  {selectedSlot ? (
                    timeSlots.find(s => s.value === selectedSlot)?.[language === 'ar' ? 'labelAr' : 'label']
                  ) : '—'}
                </span>
              </div>
            </div>

            <div className="p-4 bg-brand-primary/5 border border-brand-primary/10 rounded-2xl flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-brand-primary shrink-0" />
              <div className="space-y-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-white">{labels.advisorRole}</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                  {language === 'ar' 
                    ? 'سيقوم مستشارك بمراجعة طلبك وإما اعتماده أو التواصل معك لتغيير الوقت عند وجود تعارض.'
                    : 'Your advisor will review your requested day and slot. Once approved, you will receive an active calendar lock.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment History List */}
      <div className="glass-card">
        <div className="px-6 py-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-brand-primary" />
            {labels.historyTitle}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/2">
                <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">{labels.colDate}</th>
                <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest">{labels.colNote}</th>
                <th className="p-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">{labels.colStatus}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-semibold text-slate-400">
              {error ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-rose-500 font-bold">
                    {language === 'ar' 
                      ? 'حدث خطأ أثناء تحميل سجل المواعيد. يرجى مراجعة المسؤول لتفعيل الصلاحيات.' 
                      : 'An error occurred loading appointment history. Please contact the administrator to enable rules.'}
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-10 text-center text-slate-600 font-bold uppercase tracking-widest">
                    {labels.noHistory}
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => {
                  const statusColors = {
                    pending: "bg-amber-500/10 text-amber-500 border-amber-500/10",
                    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
                    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/10"
                  }[appt.status as 'pending' | 'approved' | 'rejected'] || "bg-slate-500/10 text-slate-500";

                  const statusLabels = {
                    pending: labels.statusPending,
                    approved: labels.statusApproved,
                    rejected: labels.statusRejected
                  }[appt.status as 'pending' | 'approved' | 'rejected'] || appt.status;

                  // Format Date nicely
                  const displayDate = appt.date ? new Date(appt.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
                  const slotLabel = timeSlots.find(s => s.value === appt.timeSlot)?.[language === 'ar' ? 'labelAr' : 'label'] || appt.timeSlot;

                  return (
                    <tr key={appt.id} className="hover:bg-white/2 transition-colors">
                      <td className="p-5">
                        <div className="font-bold text-white text-sm">{displayDate}</div>
                        <div className="text-[10px] text-slate-500 tracking-wider font-black uppercase mt-1 flex items-center gap-1.5">
                          <Clock size={10} />
                          {slotLabel}
                        </div>
                      </td>
                      <td className="p-5 max-w-xs truncate font-medium text-slate-300">
                        {appt.note || '—'}
                      </td>
                      <td className="p-5 text-center">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          statusColors
                        )}>
                          {statusLabels}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
