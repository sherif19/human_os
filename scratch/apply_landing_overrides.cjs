const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rewrite quizQuestions array to use t()
const oldQuizQuestions = `  const quizQuestions = [
    {
      titleAr: "1. كيف تتعامل عادةً مع المواقف التي تسبب توتراً مفاجئاً؟",
      titleEn: "1. How do you respond to sudden high-stress situations?",
      options: [
        { code: "A", textAr: "أتوقف لتحليل الموقف منطقياً ووضع استراتيجية للرد", textEn: "Pause, analyze the logical variables, and plan." },
        { code: "B", textAr: "أركز على السيطرة على مشاعري وتهدئة المتواجدين", textEn: "Focus on emotional containment and calming the vibe." },
        { code: "C", textAr: "أتغذى على التحدي وأتخذ خطوات عملية لحل المشكلة", textEn: "Take immediate, direct action to resolve the issue." }
      ]
    },
    {
      titleAr: "2. كيف تدير طاقتك الإنتاجية طوال اليوم؟",
      titleEn: "2. How do you manage your energy levels throughout the day?",
      options: [
        { code: "A", textAr: "بوضع فترات عمل عميق (Deep Work) خالية من المشتتات", textEn: "By locking in dedicated deep-work slots with zero noise." },
        { code: "B", textAr: "بمراقبة استنزاف طاقتي النفسية وأخذ فترات راحة", textEn: "By tracking my emotional bandwidth and resting periodically." },
        { code: "C", textAr: "بالمحافظة على زخم الإنجاز المتواصل وتحدي الكسل", textEn: "By pushing through tasks and maintaining pure momentum." }
      ]
    },
    {
      titleAr: "3. ما هي عقبة النمو الأكثر إزعاجاً لك في الوقت الحالي؟",
      titleEn: "3. What is your primary roadblock to personal evolution?",
      options: [
        { code: "A", textAr: "تشتت الانتباه وكثرة الأفكار العشوائية في عقلي", textEn: "Mind chatter, mental noise, and lack of absolute focus." },
        { code: "B", textAr: "الاحتكاك الاجتماعي وامتصاص الطاقات السلبية للآخرين", textEn: "Absorbing social toxicity and emotional drainage." },
        { code: "C", textAr: "صعوبة الالتزام بالروتين اليومي وبناء عادات مستدامة", textEn: "Difficulty staying consistent and maintaining habit loops." }
      ]
    }
  ];`;

const newQuizQuestions = `  const quizQuestions = [
    {
      title: t('quiz_q1_title'),
      options: [
        { code: "A", text: t('quiz_q1_optA') },
        { code: "B", text: t('quiz_q1_optB') },
        { code: "C", text: t('quiz_q1_optC') }
      ]
    },
    {
      title: t('quiz_q2_title'),
      options: [
        { code: "A", text: t('quiz_q2_optA') },
        { code: "B", text: t('quiz_q2_optB') },
        { code: "C", text: t('quiz_q2_optC') }
      ]
    },
    {
      title: t('quiz_q3_title'),
      options: [
        { code: "A", text: t('quiz_q3_optA') },
        { code: "B", text: t('quiz_q3_optB') },
        { code: "C", text: t('quiz_q3_optC') }
      ]
    }
  ];`;

// 2. Rewrite archetypeDetails inside useEffect
const oldArchetypeDetails = `      const archetypeDetails: any = {
        neuro_architect: {
          titleAr: "المهندس العصبي (The Neuro-Architect)",
          titleEn: "The Neuro-Architect",
          descAr: "قوتك تكمن في المنطق والتنظيم العميق. أنت تتطلب أدوات تقلل من تشتت الذهن وتدير الحمل المعرفي بكفاءة عالية.",
          descEn: "Your core strength is logic and deep structuring. You require precise tools to block cognitive noise and orchestrate structural deep-work.",
          color: "from-indigo-500 to-violet-600",
          accentColor: "#6366f1",
          focusVal: 95,
          eqVal: 65,
          velocityVal: 70,
          moduleAr: "محرك تدفق المنطق (Logic Flow Engine)",
          moduleEn: "Logic Flow Engine"
        },
        emotional_alchemist: {
          titleAr: "الخيميائي العاطفي (The Emotional Alchemist)",
          titleEn: "The Emotional Alchemist",
          descAr: "تتفوق في استشعار العواطف والمشاعر. التحدي الأكبر لديك هو حماية حدود طاقتك العاطفية ضد الاحتكاكات السامة.",
          descEn: "You excel at feeling and analyzing social vibrations. Your primary directive is shielding your empathy baseline from toxic drainage.",
          color: "from-pink-500 to-rose-600",
          accentColor: "#ec4899",
          focusVal: 65,
          eqVal: 98,
          velocityVal: 60,
          moduleAr: "درع حماية السمية (Toxicity Shield)",
          moduleEn: "Toxicity Shield"
        },
        performance_catalyst: {
          titleAr: "محفز الأداء البشري (The Performance Catalyst)",
          titleEn: "The Performance Catalyst",
          descAr: "أنت تحب الحركة والنتائج السريعة. تحتاج عاداتك إلى مزامنة يومية لتقليل المقاومة العقلية والحفاظ على استمرارية الزخم.",
          descEn: "You thrive on velocity and practical results. You require micro-habits synced with your biological timeline to avoid early burnout.",
          color: "from-emerald-400 to-teal-600",
          accentColor: "#10b981",
          focusVal: 75,
          eqVal: 70,
          velocityVal: 95,
          moduleAr: "مسبك العادات اليومية (Habit Forge)",
          moduleEn: "Habit Forge"
        }
      };`;

const newArchetypeDetails = `      const archetypeDetails: any = {
        neuro_architect: {
          title: t('arch_architect_title'),
          desc: t('arch_architect_desc'),
          color: "from-indigo-500 to-violet-600",
          accentColor: "#6366f1",
          focusVal: 95,
          eqVal: 65,
          velocityVal: 70,
          module: t('arch_architect_mod')
        },
        emotional_alchemist: {
          title: t('arch_alchemist_title'),
          desc: t('arch_alchemist_desc'),
          color: "from-pink-500 to-rose-600",
          accentColor: "#ec4899",
          focusVal: 65,
          eqVal: 98,
          velocityVal: 60,
          module: t('arch_alchemist_mod')
        },
        performance_catalyst: {
          title: t('arch_catalyst_title'),
          desc: t('arch_catalyst_desc'),
          color: "from-emerald-400 to-teal-600",
          accentColor: "#10b981",
          focusVal: 75,
          eqVal: 70,
          velocityVal: 95,
          module: t('arch_catalyst_mod')
        }
      };`;

// 3. Rewrite booksData array to use t()
const oldBooksData = `  const booksData = [
    {
      titleAr: "الكتب الرقمية الاستراتيجية",
      titleEn: "Strategic Digital Books",
      descAr: "مجموعة من الكتب الحصرية التي تغطي تشريحات الوعي الذاتي، وإدارة الطاقة المهنية، والتغلب على الاحتراق النفسي بأساليب مدعومة علمياً.",
      descEn: "A curated collection of digital books covering cognitive load anatomy, professional energy calibration, and scientific burnout prevention.",
      tagAr: "مكتبة المعرفة",
      tagEn: "KNOWLEDGE VAULT",
      icon: Book,
      color: "from-indigo-600/35 to-indigo-950/70 border-indigo-500/25",
      accent: "rgba(99, 102, 241, 0.4)",
      labelAr: "الكتب",
      labelEn: "Books"
    },
    {
      titleAr: "أدلة الذكاء الاصطناعي التفاعلية",
      titleEn: "Interactive AI Guides",
      descAr: "أدلة إرشادية مخصصة يتم إنشاؤها وتحديثها ديناميكياً بواسطة مدرب الذكاء الاصطناعي لتناسب وتدعم نموذجك العصبي الخاص.",
      descEn: "Tailored action manuals generated on-the-fly and updated by your AI Coach to directly supplement your diagnosed personality archetype.",
      tagAr: "الذكاء العصبي",
      tagEn: "NEURAL DATA",
      icon: Sparkles,
      color: "from-purple-600/35 to-purple-950/70 border-purple-500/25",
      accent: "rgba(168, 85, 247, 0.4)",
      labelAr: "أدلة الذكاء الاصطناعي",
      labelEn: "AI Guides"
    },
    {
      titleAr: "القوالب الاستراتيجية العملية",
      titleEn: "Practical Strategic Templates",
      descAr: "قوانين ونماذج تطبيقية لتتبع الاحتكاك السام، وتخطيط الميكرو-مهام اليومية، وتقييم مؤشرات الانضباط بشكل عملي.",
      descEn: "Practical tracking templates, emotional boundary matrices, and micro-mission logs designed to integrate into your daily growth routine.",
      tagAr: "أدوات التنفيذ",
      tagEn: "EXECUTION LOGS",
      icon: FileText,
      color: "from-emerald-600/35 to-emerald-950/70 border-emerald-500/25",
      accent: "rgba(16, 185, 129, 0.4)",
      labelAr: "القوالب",
      labelEn: "Templates"
    },
    {
      titleAr: "النظام البيئي البشري المتكامل",
      titleEn: "Integrated Human Ecosystem",
      descAr: "بيئة أداء موحدة تربط كافة التشخيصات، والتقارير اليومية، وتواصلك مع المدرب لتقديم مصفوفة تقدم متكاملة تتابع تطورك.",
      descEn: "A unified system linking all neural assessments, AI Coach history, and progress trackers into a high-fidelity command center.",
      tagAr: "محيط الأداء",
      tagEn: "HUMAN OS NETWORK",
      icon: Layers,
      color: "from-pink-600/35 to-pink-950/70 border-pink-500/25",
      accent: "rgba(236, 72, 153, 0.4)",
      labelAr: "النظام البيني",
      labelEn: "Ecosystem"
    }
  ];`;

const newBooksData = `  const booksData = [
    {
      title: t('books_title1'),
      desc: t('books_desc1'),
      tag: t('books_tag1'),
      icon: Book,
      color: "from-indigo-600/35 to-indigo-950/70 border-indigo-500/25",
      accent: "rgba(99, 102, 241, 0.4)",
      label: t('books_label1')
    },
    {
      title: t('books_title2'),
      desc: t('books_desc2'),
      tag: t('books_tag2'),
      icon: Sparkles,
      color: "from-purple-600/35 to-purple-950/70 border-purple-500/25",
      accent: "rgba(168, 85, 247, 0.4)",
      label: t('books_label2')
    },
    {
      title: t('books_title3'),
      desc: t('books_desc3'),
      tag: t('books_tag3'),
      icon: FileText,
      color: "from-emerald-600/35 to-emerald-950/70 border-emerald-500/25",
      accent: "rgba(16, 185, 129, 0.4)",
      label: t('books_label3')
    },
    {
      title: t('books_title4'),
      desc: t('books_desc4'),
      tag: t('books_tag4'),
      icon: Layers,
      color: "from-pink-600/35 to-pink-950/70 border-pink-500/25",
      accent: "rgba(236, 72, 153, 0.4)",
      label: t('books_label4')
    }
  ];`;

// Normalize content line-endings
let norm = content.replace(/\r\n/g, '\n');

// Perform replacements
let replacedCount = 0;

const replaceBlock = (oldText, newText, label) => {
  const normOld = oldText.replace(/\r\n/g, '\n');
  const normNew = newText.replace(/\r\n/g, '\n');
  if (norm.includes(normOld)) {
    norm = norm.replace(normOld, normNew);
    console.log(`Replaced: ${label}`);
    replacedCount++;
  } else {
    console.log(`FAILED TO REPLACE: ${label}`);
  }
};

// Apply array replacements
replaceBlock(oldQuizQuestions, newQuizQuestions, "quizQuestions array");
replaceBlock(oldArchetypeDetails, newArchetypeDetails, "archetypeDetails block");
replaceBlock(oldBooksData, newBooksData, "booksData array");

// Perform tag updates
// Quiz intro and results rendering replacements:
norm = norm.replace(
  `{language === 'ar' ? 'جاهز لبدء المعايرة السريعة؟' : 'Ready to Start Fast Calibration?'}`,
  `{t('quiz_ready')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'تهيئة الاختبار العصبي' : 'INITIALIZE DIAGNOSTIC'}`,
  `{t('initialize_diagnostic')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'السؤال' : 'QUESTION'} {quizStep}/{quizQuestions.length}`,
  `{t('question_label')} {quizStep}/{quizQuestions.length}`
);
norm = norm.replace(
  `{language === 'ar' ? 'المعايرة نشطة' : 'CALIBRATING'}`,
  `{t('calibrating_label')}`
);
norm = norm.replace(
  `{language === 'ar' ? quizQuestions[quizStep - 1].titleAr : quizQuestions[quizStep - 1].titleEn}`,
  `{quizQuestions[quizStep - 1].title}`
);
norm = norm.replace(
  `{language === 'ar' ? opt.textAr : opt.textEn}`,
  `{opt.text}`
);
norm = norm.replace(
  `{language === 'ar' ? 'التشخيص مكتمل' : 'DIAGNOSTIC COMPLETED'}`,
  `{t('diagnostic_completed')}`
);
norm = norm.replace(
  `{language === 'ar' ? computedArchetype.titleAr : computedArchetype.titleEn}`,
  `{computedArchetype.title}`
);
norm = norm.replace(
  `{language === 'ar' ? computedArchetype.descAr : computedArchetype.descEn}`,
  `{computedArchetype.desc}`
);
norm = norm.replace(
  `{language === 'ar' ? 'الموديول الموصى به' : 'RECOMMENDED PROTOCOL'}`,
  `{t('recommended_protocol')}`
);
norm = norm.replace(
  `{language === 'ar' ? computedArchetype.moduleAr : computedArchetype.moduleEn}`,
  `{computedArchetype.module}`
);
norm = norm.replace(
  `{language === 'ar' ? 'حفظ وحجز الخزنة الخاصة بك' : 'CLAIM MY TRIAL'}`,
  `{t('claim_my_trial')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'إعادة الفحص' : 'RE-SCAN'}`,
  `{t('re_scan')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'طاقة النموذج' : 'FLOW ENERGY'}`,
  `{t('flow_energy')}`
);
norm = norm.replace(
  `<span>{language === 'ar' ? 'مؤشر التركيز المعرفي' : 'Cognitive Focus'}</span>`,
  `<span>{t('cognitive_focus')}</span>`
);
norm = norm.replace(
  `<span>{language === 'ar' ? 'مؤشر الذكاء العاطفي' : 'Emotional EQ'}</span>`,
  `<span>{t('emotional_eq')}</span>`
);
norm = norm.replace(
  `<span>{language === 'ar' ? 'سرعة الإنجاز' : 'Habit Velocity'}</span>`,
  `<span>{t('habit_velocity')}</span>`
);

// Vision Section replacements:
norm = norm.replace(
  `{language === 'ar' ? 'الوضع التلقائي' : 'DEFAULT OS'}`,
  `{t('vision_legacy_badge')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'الحلقات العصبية العشوائية' : 'The Legacy Brain Script'}`,
  `{t('vision_legacy_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'التشتت المعرفي' : 'Prefrontal Entropy'}`,
  `{t('vision_card3_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? "استهلاك كامل طاقتك في السوشيال ميديا والتفاصيل الفوضوية." : "Leaving your attention span open to incoming notifications and dopamine traps."}`,
  `{t('vision_card3_desc')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'الحل المحسن' : 'HUMANOS PROTOCOL'}`,
  `{t('vision_opt_badge')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'الهندسة العصبية الحديثة' : 'The Encapsulated Evolution'}`,
  `{t('vision_opt_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'عزل المشتتات المبرمج' : 'Cognitive Sandbox'}`,
  `{t('vision_opt_card1_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? "حماية مساحتك العقلية ومستوى طاقتك بأدوات تشخيص عصبية ذكية." : "Encapsulating your attention and energy metrics with clean software architectures."}`,
  `{t('vision_opt_card1_desc')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'المزامنة البيولوجية اليومية' : 'Biometric Synchronization'}`,
  `{t('vision_opt_card2_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? "تحديث وتعديل مستمر لخطط الإنتاجية العاطفية بناءً على أدائك اليومي." : "Daily recalculation of your task roadmap based on your real energy capacities."}`,
  `{t('vision_opt_card2_desc')}`
);
norm = norm.replace(
  `{language === 'ar' ? 'واجهة التوجيه بالذكاء الاصطناعي' : 'AI-Driven Command Interface'}`,
  `{t('vision_opt_card3_title')}`
);
norm = norm.replace(
  `{language === 'ar' ? "مدربك الذكي متوفر 24 ساعة للإجابة عن أسئلتك والتعامل مع النزاعات المهنية." : "Your AI strategist available 24/7 to solve conflicts and rewrite focus patterns."}`,
  `{t('vision_opt_card3_desc')}`
);

// 3D Shelf replacements:
norm = norm.replace(
  `{language === 'ar' ? book.tagAr : book.tagEn}`,
  `{book.tag}`
);
norm = norm.replace(
  `{language === 'ar' ? book.labelAr : book.labelEn}`,
  `{book.label}`
);
norm = norm.replace(
  `{language === 'ar' ? booksData[selectedBook].tagAr : booksData[selectedBook].tagEn}`,
  `{booksData[selectedBook].tag}`
);
norm = norm.replace(
  `{language === 'ar' ? booksData[selectedBook].titleAr : booksData[selectedBook].titleEn}`,
  `{booksData[selectedBook].title}`
);
norm = norm.replace(
  `{language === 'ar' ? booksData[selectedBook].descAr : booksData[selectedBook].descEn}`,
  `{booksData[selectedBook].desc}`
);
norm = norm.replace(
  `{language === 'ar' ? booksData[selectedBook].labelAr : booksData[selectedBook].labelEn}`,
  `{booksData[selectedBook].label}`
);

// Write back to file, preserving CRLF if present
const finalContent = content.includes('\r\n') ? norm.replace(/\n/g, '\r\n') : norm;
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log("SUCCESS: LandingPage.tsx updated with translation keys.");
