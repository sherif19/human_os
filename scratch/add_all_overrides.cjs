const fs = require('fs');
const path = require('path');

const transPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');
const brandingPath = path.join(__dirname, '..', 'src', 'pages', 'BrandingSettings.jsx');

// Load translations
let transContent = fs.readFileSync(transPath, 'utf8');

// 1. ADD ENGLISH TRANSLATIONS
const enKeys = `
    "diagnostic_completed": "DIAGNOSTIC COMPLETED",
    "recommended_protocol": "RECOMMENDED PROTOCOL",
    "claim_my_trial": "CLAIM MY TRIAL",
    "re_scan": "RE-SCAN",
    "flow_energy": "FLOW ENERGY",
    "cognitive_focus": "Cognitive Focus",
    "emotional_eq": "Emotional EQ",
    "habit_velocity": "Habit Velocity",
    "arch_architect_title": "The Neuro-Architect",
    "arch_architect_desc": "Your core strength is logic and deep structuring. You require precise tools to block cognitive noise and orchestrate structural deep-work.",
    "arch_architect_mod": "Logic Flow Engine",
    "arch_alchemist_title": "The Emotional Alchemist",
    "arch_alchemist_desc": "You excel at feeling and analyzing social vibrations. Your primary directive is shielding your empathy baseline from toxic drainage.",
    "arch_alchemist_mod": "Toxicity Shield",
    "arch_catalyst_title": "The Performance Catalyst",
    "arch_catalyst_desc": "You thrive on velocity and practical results. You require micro-habits synced with your biological timeline to avoid early burnout.",
    "arch_catalyst_mod": "Habit Forge",
    "vision_legacy_badge": "DEFAULT OS",
    "vision_legacy_title": "The Legacy Brain Script",
    "vision_card3_title": "Prefrontal Entropy",
    "vision_card3_desc": "Leaving your attention span open to incoming notifications and dopamine traps.",
    "vision_opt_badge": "HUMANOS PROTOCOL",
    "vision_opt_title": "The Encapsulated Evolution",
    "vision_opt_card1_title": "Cognitive Sandbox",
    "vision_opt_card1_desc": "Encapsulating your attention and energy metrics with clean software architectures.",
    "vision_opt_card2_title": "Biometric Synchronization",
    "vision_opt_card2_desc": "Daily recalculation of your task roadmap based on your real energy capacities.",
    "vision_opt_card3_title": "AI-Driven Command Interface",
    "vision_opt_card3_desc": "Your AI strategist available 24/7 to solve conflicts and rewrite focus patterns.",
    "books_tag1": "KNOWLEDGE VAULT",
    "books_label1": "Books",
    "books_title1": "Strategic Digital Books",
    "books_desc1": "A curated collection of digital books covering cognitive load anatomy, professional energy calibration, and scientific burnout prevention.",
    "books_tag2": "NEURAL DATA",
    "books_label2": "AI Guides",
    "books_title2": "Interactive AI Guides",
    "books_desc2": "Tailored action manuals generated on-the-fly and updated by your AI Coach to directly supplement your diagnosed personality archetype.",
    "books_tag3": "EXECUTION LOGS",
    "books_label3": "Templates",
    "books_title3": "Practical Strategic Templates",
    "books_desc3": "Practical tracking templates, emotional boundary matrices, and micro-mission logs designed to integrate into your daily growth routine.",
    "books_tag4": "HUMAN OS NETWORK",
    "books_label4": "Ecosystem",
    "books_title4": "Integrated Human Ecosystem",
    "books_desc4": "A unified system linking all neural assessments, AI Coach history, and progress trackers into a high-fidelity command center.",
    "quiz_title": "Explore Your Archetype",
    "quiz_subtitle": "Take the micro neuro-audit to initialize your growth roadmap.",
    "quiz_q1_title": "1. How do you respond to sudden high-stress situations?",
    "quiz_q1_optA": "Pause, analyze logical variables, and plan.",
    "quiz_q1_optB": "Focus on emotional containment and calming the vibe.",
    "quiz_q1_optC": "Take immediate, direct action to resolve the issue.",
    "quiz_q2_title": "2. How do you manage your energy levels throughout the day?",
    "quiz_q2_optA": "By locking in dedicated deep-work slots with zero noise.",
    "quiz_q2_optB": "By tracking my emotional bandwidth and resting periodically.",
    "quiz_q2_optC": "By pushing through tasks and maintaining pure momentum.",
    "quiz_q3_title": "3. What is your primary roadblock to personal evolution?",
    "quiz_q3_optA": "Mind chatter, mental noise, and lack of absolute focus.",
    "quiz_q3_optB": "Absorbing social toxicity and emotional drainage.",
    "quiz_q3_optC": "Difficulty staying consistent and maintaining habit loops.",
    "branding.quizSection": "Diagnostic Quiz & Archetypes",
`;

// Insert English translations right before "ar: {"
const splitIndexEn = transContent.indexOf('ar: {');
if (splitIndexEn !== -1) {
  const beforeAr = transContent.substring(0, splitIndexEn);
  const afterAr = transContent.substring(splitIndexEn);
  // Find last comma before 'ar: {'
  const lastCommaIndex = beforeAr.lastIndexOf(',');
  if (lastCommaIndex !== -1) {
    transContent = beforeAr.substring(0, lastCommaIndex) + ',\n' + enKeys + beforeAr.substring(lastCommaIndex + 1) + afterAr;
  }
}

// 2. ADD ARABIC TRANSLATIONS
const arKeys = `
    "diagnostic_completed": "التشخيص مكتمل",
    "recommended_protocol": "الموديول الموصى به",
    "claim_my_trial": "حفظ وحجز الخزنة الخاصة بك",
    "re_scan": "إعادة الفحص",
    "flow_energy": "طاقة النموذج",
    "cognitive_focus": "مؤشر التركيز المعرفي",
    "emotional_eq": "مؤشر الذكاء العاطفي",
    "habit_velocity": "سرعة الإنجاز",
    "arch_architect_title": "المهندس العصبي (The Neuro-Architect)",
    "arch_architect_desc": "قوتك تكمن في المنطق والتنظيم العميق. أنت تتطلب أدوات تقلل من تشتت الذهن وتدير الحمل المعرفي بكفاءة عالية.",
    "arch_architect_mod": "Logic Flow Engine",
    "arch_alchemist_title": "الخيميائي العاطفي (The Emotional Alchemist)",
    "arch_alchemist_desc": "تتفوق في استشعار العواطف والمشاعر. التحدي الأكبر لديك هو حماية حدود طاقتك العاطفية ضد الاحتكاكات السامة.",
    "arch_alchemist_mod": "Toxicity Shield",
    "arch_catalyst_title": "محفز الأداء البشري (The Performance Catalyst)",
    "arch_catalyst_desc": "أنت تحب الحركة والنتائج السريعة. تحتاج عاداتك إلى مزامنة يومية لتقليل المقاومة العقلية والحفاظ على استمرارية الزخم.",
    "arch_catalyst_mod": "Habit Forge",
    "vision_legacy_badge": "الوضع التلقائي",
    "vision_legacy_title": "الحلقات العصبية العشوائية",
    "vision_card3_title": "التشتت المعرفي",
    "vision_card3_desc": "استهلاك كامل طاقتك في السوشيال ميديا والتفاصيل الفوضوية.",
    "vision_opt_badge": "الحل المحسن",
    "vision_opt_title": "الهندسة العصبية الحديثة",
    "vision_opt_card1_title": "عزل المشتتات المبرمج",
    "vision_opt_card1_desc": "حماية مساحتك العقلية ومستوى طاقتك بأدوات تشخيص عصبية ذكية.",
    "vision_opt_card2_title": "المزامنة البيولوجية اليومية",
    "vision_opt_card2_desc": "تحديث وتعديل مستمر لخطط الإنتاجية العاطفية بناءً على أدائك اليومي.",
    "vision_opt_card3_title": "واجهة التوجيه بالذكاء الاصطناعي",
    "vision_opt_card3_desc": "مدربك الذكي متوفر 24 ساعة للإجابة عن أسئلتك والتعامل مع النزاعات المهنية.",
    "books_tag1": "مكتبة المعرفة",
    "books_label1": "الكتب",
    "books_title1": "الكتب الرقمية الاستراتيجية",
    "books_desc1": "مجموعة من الكتب الحصرية التي تغطي تشريحات الوعي الذاتي، وإدارة الطاقة المهنية، والتغلب على الاحتراق النفسي بأساليب مدعومة علمياً.",
    "books_tag2": "الذكاء العصبي",
    "books_label2": "أدلة الذكاء الاصطناعي",
    "books_title2": "أدلة الذكاء الاصطناعي التفاعلية",
    "books_desc2": "أدلة إرشادية مخصصة يتم إنشاؤها وتحديثها ديناميكياً بواسطة مدرب الذكاء الاصطناعي لتناسب وتدعم نموذجك العصبي الخاص.",
    "books_tag3": "أدوات التنفيذ",
    "books_label3": "القوالب",
    "books_title3": "القوالب الاستراتيجية العملية",
    "books_desc3": "قوانين ونماذج تطبيقية لتتبع الاحتكاك السام، وتخطيط الميكرو-مهام اليومية، وتقييم مؤشرات الانضباط بشكل عملي.",
    "books_tag4": "محيط الأداء",
    "books_label4": "النظام البيني",
    "books_title4": "النظام البيئي البشري المتكامل",
    "books_desc4": "بيئة أداء موحدة تربط كافة التشخيصات، والتقارير اليومية، وتواصلك مع المدرب لتقديم مصفوفة تقدم متكاملة تتابع تطورك.",
    "quiz_title": "اكتشف نموذجك السلوكي",
    "quiz_subtitle": "أجب على الأسئلة الثلاثة لتهيئة مسار نموك.",
    "quiz_q1_title": "1. كيف تتعامل عادةً مع المواقف التي تسبب توتراً مفاجئاً؟",
    "quiz_q1_optA": "أتوقف لتحليل الموقف منطقياً ووضع استراتيجية للرد",
    "quiz_q1_optB": "أركز على السيطرة على مشاعري وتهدئة المتواجدين",
    "quiz_q1_optC": "أتغذى على التحدي وأتخذ خطوات عملية لحل المشكلة",
    "quiz_q2_title": "2. كيف تدير طاقتك الإنتاجية طوال اليوم؟",
    "quiz_q2_optA": "بوضع فترات عمل عميق (Deep Work) خالية من المشتتات",
    "quiz_q2_optB": "بمراقبة استنزاف طاقتي النفسية وأخذ فترات راحة",
    "quiz_q2_optC": "بالمحافظة على زخم الإنجاز المتواصل وتحدي الكسل",
    "quiz_q3_title": "3. ما هي عقبة النمو الأكثر إزعاجاً لك في الوقت الحالي؟",
    "quiz_q3_optA": "تشتت الانتباه وكثرة الأفكار العشوائية في عقلي",
    "quiz_q3_optB": "الاحتكاك الاجتماعي وامتصاص الطاقات السلبية للآخرين",
    "quiz_q3_optC": "صعوبة الالتزام بالروتين اليومي وبناء عادات مستدامة",
    "branding.quizSection": "اختبار التشخيص والأنماط",
`;

// Insert Arabic translations right before the end of 'ar' section (before '}\n};')
const lastBraceIndex = transContent.lastIndexOf('}');
if (lastBraceIndex !== -1) {
  const beforeEnd = transContent.substring(0, lastBraceIndex);
  const afterEnd = transContent.substring(lastBraceIndex);
  const secondLastBrace = beforeEnd.lastIndexOf('}');
  if (secondLastBrace !== -1) {
    const mainPart = beforeEnd.substring(0, secondLastBrace);
    const endPart = beforeEnd.substring(secondLastBrace);
    transContent = mainPart + ',\n' + arKeys + endPart + afterEnd;
  }
}

fs.writeFileSync(transPath, transContent, 'utf8');
console.log("SUCCESS: translations.ts updated with new landing page keys.");

// 3. UPDATE BrandingSettings.jsx DICTIONARY_GROUPS
let brandingContent = fs.readFileSync(brandingPath, 'utf8');

// We want to replace DICTIONARY_GROUPS in BrandingSettings.jsx
const originalDictionaryGroups = `const DICTIONARY_GROUPS = [
  {
    id: 'hero',
    titleKey: 'branding.heroSection',
    keys: ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_sub', 'get_started', 'view_demo', 'sign_in_now']
  },
  {
    id: 'stats',
    titleKey: 'branding.statsSection',
    keys: ['stats_1_label', 'stats_1_value', 'stats_2_label', 'stats_2_value', 'stats_3_label', 'stats_3_value']
  },
  {
    id: 'vision',
    titleKey: 'branding.problemsSection',
    keys: ['vision_title', 'vision_heading', 'vision_desc', 'vision_card1_title', 'vision_card1_desc', 'vision_card2_title', 'vision_card2_desc']
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
    keys: ['library_heading', 'library', 'library_desc', 'explore_repository', 'books', 'templates', 'ai_guides', 'ecosystem']
  },
  {
    id: 'pricing',
    titleKey: 'branding.pricingFaqSection',
    keys: [
      'pricing_title', 'pricing_heading', 'pricing_badge_popular', 'initialize_phase',
      'pricing_plan1_name', 'pricing_plan1_feat1', 'pricing_plan1_feat2', 'pricing_plan1_feat3',
      'pricing_plan2_name', 'pricing_plan2_feat1', 'pricing_plan2_feat2', 'pricing_plan2_feat3',
      'pricing_plan3_name', 'pricing_plan3_feat1', 'pricing_plan3_feat2', 'pricing_plan3_feat3'
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
];`;

const newDictionaryGroups = `const DICTIONARY_GROUPS = [
  {
    id: 'hero',
    titleKey: 'branding.heroSection',
    keys: ['hero_title', 'hero_subtitle', 'hero_badge', 'hero_sub', 'get_started', 'view_demo', 'sign_in_now']
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
      'pricing_plan1_name', 'pricing_plan1_feat1', 'pricing_plan1_feat2', 'pricing_plan1_feat3',
      'pricing_plan2_name', 'pricing_plan2_feat1', 'pricing_plan2_feat2', 'pricing_plan2_feat3',
      'pricing_plan3_name', 'pricing_plan3_feat1', 'pricing_plan3_feat2', 'pricing_plan3_feat3'
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
];`;

// Normalize content to prevent CRLF mismatches
const normBranding = brandingContent.replace(/\r\n/g, '\n');
const normOriginal = originalDictionaryGroups.replace(/\r\n/g, '\n');
const normNew = newDictionaryGroups.replace(/\r\n/g, '\n');

if (normBranding.includes(normOriginal)) {
  const updatedBranding = normBranding.replace(normOriginal, normNew);
  const finalBranding = brandingContent.includes('\r\n') ? updatedBranding.replace(/\n/g, '\r\n') : updatedBranding;
  fs.writeFileSync(brandingPath, finalBranding, 'utf8');
  console.log("SUCCESS: BrandingSettings.jsx DICTIONARY_GROUPS expanded successfully.");
} else {
  console.log("ERROR: DICTIONARY_GROUPS target not found in BrandingSettings.jsx.");
}
