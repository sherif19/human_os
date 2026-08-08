import React, { useState, useEffect } from 'react';
import { 
  Book, 
  FileText, 
  Download, 
  Search, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Target,
  Shield,
  Heart,
  Lock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations, TranslationKey } from '../lib/translations';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { libDb } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

const categories = [
  { id: 'books', name: 'Books', nameAr: 'الكتب' },
  { id: 'templates', name: 'Templates & Automation', nameAr: 'القوالب والاوتوميشن' },
];

const staticResources = [
  { 
    id: 's1', 
    type: 'books', 
    title: 'Neural Dominance v1.2', 
    titleAr: 'الهيمنة العصبية v1.2',
    desc: 'The complete manual for prefrontal cortex optimization.',
    descAr: 'الدليل الكامل لتحسين قشرة الفص الجبهي.',
    icon: Book,
    tags: ['E-Book', 'Intelligence'],
    pdfUrl: '',
    imageUrl: ''
  },
  { 
    id: 's2', 
    type: 'templates', 
    title: 'Social Matrix Script', 
    titleAr: 'نص مصفوفة الاجتماعية',
    desc: 'Automated responses for high-stakes social interactions.',
    descAr: 'ردود مؤتمتة للتفاعلات الاجتماعية عالية المخاطر.',
    icon: FileText,
    tags: ['PDF', 'Social'],
    pdfUrl: '',
    imageUrl: ''
  },
  { 
    id: 's3', 
    type: 'books', 
    title: 'The Silent Strategist', 
    titleAr: 'الاستراتيجي الصامت',
    desc: 'Mastering the art of non-reaction in corporate games.',
    descAr: 'إتقان فن عدم الرد في ألعاب الشركات.',
    icon: Book,
    tags: ['E-Book', 'Strategy'],
    pdfUrl: '',
    imageUrl: ''
  },
  { 
    id: 's4', 
    type: 'templates', 
    title: 'Burnout Recovery Protocol', 
    titleAr: 'بروتوكول التعافي من الاحتراق',
    desc: 'Step-by-step neural reset for creative blockages.',
    descAr: 'إعادة ضبط عصبي خطوة بخطوة للانسدادات الإبداعية.',
    icon: FileText,
    tags: ['Guide', 'Emotional'],
    pdfUrl: '',
    imageUrl: ''
  },
  { 
    id: 's5', 
    type: 'templates', 
    title: 'Daily Habits Alpha', 
    titleAr: 'العادات اليومية ألفا',
    desc: 'A checklist for building automated excellence.',
    descAr: 'قائمة مراجعة لبناء التميز الآلي.',
    icon: Zap,
    tags: ['Sheet', 'Growth'],
    pdfUrl: '',
    imageUrl: ''
  },
  { 
    id: 's6', 
    type: 'books', 
    title: 'Archetype Unlocked', 
    titleAr: 'فتح النموذج الأصلي',
    desc: 'Detailed breakdown of the 12 primary neural prints.',
    descAr: 'تحليل مفصل للمطبوعات العصبية الـ 12 الأساسية.',
    icon: Target,
    tags: ['E-Book', 'DNA'],
    imageUrl: ''
  }
];

const getFallbackCover = (title: string, id: string) => {
  const t = title.toLowerCase();
  if (t.includes('تشغيل') || t.includes('دليل التشغيل')) {
    return 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('متجر') || t.includes('إلكتروني')) {
    return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('مدرب') || t.includes('دبلوومة')) {
    return 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('دخل') || t.includes('الذكي')) {
    return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('مبيعات') || t.includes('اعلانات')) {
    return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('عقلية') || t.includes('صاحب')) {
    return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('ميزانية') || t.includes('حماية')) {
    return 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('1000') || t.includes('الوصول')) {
    return 'https://images.unsplash.com/photo-1553729459-beb747028b4c?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('مهام') || t.includes('مدراء')) {
    return 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600';
  }
  if (t.includes('مساعد') || t.includes('قالب اتوميشن')) {
    return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80&w=600';
  }
  
  // Default fallbacks based on string characters/hash
  const defaultCovers = [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&q=80&w=600'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % defaultCovers.length;
  return defaultCovers[index];
};

export default function Library() {
  const { user } = useAuth();
  const { language, isRTL } = useLanguage();
  const t = (key: TranslationKey) => translations[language][key] || key;
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('books');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const showToast = (msg: string, type = 'info') => {
    const toastEl = document.createElement('div');
    toastEl.style.cssText = `position:fixed;bottom:20px;${isRTL ? 'right' : 'left'}:20px;padding:12px 24px;border-radius:12px;background:${type === 'error' ? '#EF4444' : '#3B82F6'};color:#fff;z-index:9999;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);font-weight:bold;font-size:13px;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(8px);`;
    toastEl.textContent = msg;
    document.body.appendChild(toastEl);
    setTimeout(() => toastEl.remove(), 4000);
  };

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const q = query(collection(libDb, 'brandLibrary'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const dbResources = snapshot.docs.map(doc => {
          const data = doc.data();
          const isBook = data.type === 'book' || data.type === 'pdf';
          const type = isBook ? 'books' : 'templates';
          return {
            id: doc.id,
            type,
            title: data.title || '',
            titleAr: data.title || '',
            desc: data.description || '',
            descAr: data.description || '',
            icon: isBook ? Book : FileText,
            tags: data.badge ? [data.badge] : (data.type === 'book' ? ['E-Book'] : ['Template']),
            pdfUrl: data.pdfUrl || '',
            imageUrl: data.imageUrl || '',
            badgeClass: data.badgeClass || 'badge-blue'
          };
        });
        
        if (dbResources.length > 0) {
          setResources(dbResources);
        } else {
          setResources(staticResources);
        }
      } catch (err) {
        console.error("Error fetching library resources:", err);
        setResources(staticResources);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filteredResources = resources.filter(res => {
    const matchesCategory = res.type === activeCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          res.titleAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate(-1)}
             className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all"
           >
             <ArrowLeft size={20} className={cn(isRTL && "rotate-180")} />
           </button>
           <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tighter uppercase">{t('library')}</h1>
              <p className="text-xs md:text-sm text-slate-500 font-bold tracking-widest uppercase flex items-center gap-2">
                 <Sparkles size={12} className="text-brand-primary" />
                 {t('books')} + {t('templates')}
              </p>
           </div>
        </div>
        
        <div className="w-full md:w-auto relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
           <input 
             type="text"
             placeholder={language === 'ar' ? 'ابحث في المكتبة...' : 'Search library...'}
             className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-white text-sm focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-10 no-scrollbar">
         {categories.map((cat) => (
           <button
             key={cat.id}
             onClick={() => setActiveCategory(cat.id)}
             className={cn(
               "px-6 py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border",
               activeCategory === cat.id 
                 ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/20" 
                 : "bg-white/5 text-slate-500 border-white/5 hover:border-white/20"
             )}
           >
             {language === 'ar' ? cat.nameAr : cat.name}
           </button>
         ))}
      </div>

      {/* Header Description from design */}
      <div className="text-center mb-10">
         <p className="text-xs md:text-sm text-slate-400 font-bold tracking-wide">
            {language === 'ar' 
              ? 'اكتشف المعرفة في أبعاد جديدة. تصفح وحمل أحدث الكتب.' 
              : 'Discover knowledge in new dimensions. Browse and download the latest books.'}
         </p>
      </div>

      {/* Library Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
           {filteredResources.map((res, index) => (
             <motion.div
               key={res.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
               className="relative bg-[#0d0e15] border border-white/5 rounded-[24px] overflow-hidden group hover:border-[#7c3aed]/50 transition-all duration-300 flex flex-col h-full hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] cursor-pointer"
             >
                {/* Image Cover aspect-[4/5] with bottom fading gradient */}
                <div className="relative aspect-[4/5] overflow-hidden bg-white/2">
                   <img 
                     src={res.imageUrl || getFallbackCover(res.title, res.id)} 
                     alt={language === 'ar' ? res.titleAr : res.title} 
                     className="w-full h-full object-cover group-hover:scale-[1.03] transition-all duration-500"
                     onError={(e) => {
                       const fallback = getFallbackCover(res.title, res.id);
                       if (e.currentTarget.src !== fallback) {
                         e.currentTarget.src = fallback;
                       }
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-transparent to-transparent opacity-95" />
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col items-center text-center flex-grow space-y-3">
                   {/* Title */}
                   <h3 className="text-base font-black text-white uppercase  tracking-tight group-hover:text-[#7c3aed] transition-colors line-clamp-1">
                     {language === 'ar' ? res.titleAr : res.title}
                   </h3>
                   
                   {/* Description */}
                   <p className="text-xs text-slate-400 leading-relaxed font-semibold line-clamp-3">
                     {language === 'ar' ? res.descAr : res.desc}
                   </p>

                   {/* Tags */}
                   <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                      {res.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary text-[8px] font-black uppercase tracking-widest">
                          {tag}
                        </span>
                      ))}
                   </div>
                   
                   {/* Spacer */}
                   <div className="flex-grow" />

                   {/* Full-width Download CTA Button */}
                   <div className="w-full pt-4">
                      {user?.isTrial ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast(
                              language === 'ar' 
                                ? 'تحميل الكتب والقوالب متاح فقط للمشتركين. يرجى تفعيل اشتراكك.' 
                                : 'Downloading books and templates is only available for subscribers. Please activate your subscription.',
                              'error'
                            );
                          }}
                          className="w-full py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-amber-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                          title={language === 'ar' ? 'مغلق للحساب التجريبي' : 'Locked for Free Trial'}
                        >
                           <Lock size={14} />
                           <span>{language === 'ar' ? 'تحميل النسخة' : 'Download Copy'}</span>
                        </button>
                      ) : res.pdfUrl ? (
                        <a 
                          href={res.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40"
                        >
                           <Download size={14} />
                           <span>{language === 'ar' ? 'تحميل النسخة' : 'Download Copy'}</span>
                        </a>
                      ) : (
                        <button 
                          disabled 
                          className="w-full py-3.5 bg-white/5 text-slate-500 border border-white/5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                        >
                           <Download size={14} />
                           <span>{language === 'ar' ? 'تحميل النسخة' : 'Download Copy'}</span>
                        </button>
                      )}
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}
    </div>
  );
}
