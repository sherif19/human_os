import { User } from '../hooks/useAuth';

export interface PersonalityProfile {
  archetype: string;
  archetypeAr: string;
  primaryDriver: string;
  primaryDriverAr: string;
  strengths: string[];
  strengthsAr: string[];
  weaknesses: string[];
  weaknessesAr: string[];
  insight: string;
  insightAr: string;
  growthProtocol: string;
  growthProtocolAr: string;
  protocol01: string;
  protocol01Ar: string;
  protocol02: string;
  protocol02Ar: string;
}

export function analyzePersonality(user: User | null): PersonalityProfile {
  // Default values
  const defaultProfile: PersonalityProfile = {
    archetype: user?.archetype || 'The Strategist',
    archetypeAr: user?.archetypeAr || 'الاستراتيجي',
    primaryDriver: user?.primaryDriver || 'Logic & Efficiency',
    primaryDriverAr: user?.primaryDriverAr || 'المنطق والكفاءة',
    strengths: (user?.strengths || 'Complex System Mapping, Strategic Detachment, Extreme Focus').split(',').map(s => s.trim()),
    strengthsAr: (user?.strengthsAr || 'تخطيط الأنظمة المعقدة, الانفصال الاستراتيجي, التركيز الشديد').split(',').map(s => s.trim()),
    weaknesses: (user?.weaknesses || 'Tactical Spontaneity, Emotional Synchrony, Baseline Consistency').split(',').map(w => w.trim()),
    weaknessesAr: (user?.weaknessesAr || 'العفوية التكتيكية, التزامن العاطفي, الاتساق الأساسي').split(',').map(w => w.trim()),
    insight: user?.intelligenceInsight || 'System analysis detects a recurring avoidance pattern during social conflicts.',
    insightAr: user?.intelligenceInsightAr || 'يكشف تحليل النظام عن نمط تجنب متكرر أثناء النزاعات الاجتماعية.',
    growthProtocol: user?.growthProtocol || '"Phase I focus should be on Social Fluidity. Your current \'Analytical\' dominance is high-performing in isolation but creates friction in collaborative neural streams."',
    growthProtocolAr: user?.growthProtocolAr || '"يجب أن يكون تركيز المرحلة الأولى على السيولة الاجتماعية. سيادتك \"التحليلية\" الحالية عالية الأداء في العزلة ولكنها تخلق احتكاكاً في التيارات العصبية التعاونية."',
    protocol01: user?.protocol01 || 'Execute a 10s Pause during conflict.',
    protocol01Ar: user?.protocol01Ar || 'نفذ توقفاً لمدة 10 ثوانٍ أثناء النزاع.',
    protocol02: user?.protocol02 || 'Record thoughts in Journal immediately.',
    protocol02Ar: user?.protocol02Ar || 'سجل الأفكار في السجل العصبي فوراً.',
  };

  if (!user) return defaultProfile;

  // Check if they completed any tests
  const completedCount = user.completedTests ? Object.keys(user.completedTests).length : 0;
  if (completedCount === 0) {
    return defaultProfile;
  }

  // Get user parameters
  const metrics = [
    { key: 'confidence', label: 'Confidence', labelAr: 'الثقة', score: user.confidence ?? 65 },
    { key: 'discipline', label: 'Discipline', labelAr: 'الانضباط', score: user.discipline ?? 48 },
    { key: 'emotional', label: 'EQ', labelAr: 'الذكاء العاطفي', score: user.emotional ?? 75 },
    { key: 'charisma', label: 'Charisma', labelAr: 'الكاريزما', score: user.charisma ?? 50 },
    { key: 'leadership', label: 'Leadership', labelAr: 'القيادة', score: user.leadership ?? 60 },
    { key: 'selfWorth', label: 'Self Worth', labelAr: 'تقدير الذات', score: user.selfWorth ?? 55 },
    { key: 'consistency', label: 'Consistency', labelAr: 'الاتساق', score: user.consistency ?? 45 },
    { key: 'focus', label: 'Focus', labelAr: 'التركيز', score: user.focus ?? 85 },
    { key: 'social', label: 'Social Energy', labelAr: 'الطاقة الاجتماعية', score: user.social ?? 40 },
    { key: 'empathy', label: 'Resilience', labelAr: 'المرونة', score: user.empathy ?? 70 }
  ];

  // Sort metrics
  const sortedMetrics = [...metrics].sort((a, b) => b.score - a.score);
  const highest = sortedMetrics[0];
  const secondHighest = sortedMetrics[1];
  const lowest = sortedMetrics[metrics.length - 1];
  const secondLowest = sortedMetrics[metrics.length - 2];
  const thirdLowest = sortedMetrics[metrics.length - 3];

  // 1. Archetype detection
  let archetype = 'The Strategist';
  let archetypeAr = 'الاستراتيجي';

  const hKey1 = highest.key;
  const hKey2 = secondHighest.key;

  if ((hKey1 === 'focus' && hKey2 === 'discipline') || (hKey1 === 'discipline' && hKey2 === 'focus')) {
    archetype = 'The Mastermind';
    archetypeAr = 'المخطط الاستراتيجي';
  } else if ((hKey1 === 'charisma' && hKey2 === 'social') || (hKey1 === 'social' && hKey2 === 'charisma')) {
    archetype = 'The Inspiring Leader';
    archetypeAr = 'القائد الملهم';
  } else if ((hKey1 === 'empathy' && hKey2 === 'emotional') || (hKey1 === 'emotional' && hKey2 === 'empathy')) {
    archetype = 'The Harmonizer';
    archetypeAr = 'المصلح العاطفي';
  } else if ((hKey1 === 'leadership' && hKey2 === 'confidence') || (hKey1 === 'confidence' && hKey2 === 'leadership')) {
    archetype = 'The Sovereign';
    archetypeAr = 'القائد السيادي';
  } else if ((hKey1 === 'selfWorth' && hKey2 === 'focus') || (hKey1 === 'focus' && hKey2 === 'selfWorth')) {
    archetype = 'The Independent Thinker';
    archetypeAr = 'المفكر مستقل';
  } else if ((hKey1 === 'consistency' && hKey2 === 'discipline') || (hKey1 === 'discipline' && hKey2 === 'consistency')) {
    archetype = 'The Anchor';
    archetypeAr = 'المحرك الثابت';
  }

  // 2. Primary Driver
  let primaryDriver = 'Logic & Efficiency';
  let primaryDriverAr = 'المنطق والكفاءة';

  if (highest.key === 'discipline' || highest.key === 'consistency') {
    primaryDriver = 'Habits & Focus';
    primaryDriverAr = 'العادات والتركيز';
  } else if (highest.key === 'emotional' || highest.key === 'empathy') {
    primaryDriver = 'Emotional Sync';
    primaryDriverAr = 'التزامن العاطفي';
  } else if (highest.key === 'charisma' || highest.key === 'social') {
    primaryDriver = 'Social Dominance';
    primaryDriverAr = 'الهيمنة الاجتماعية';
  } else if (highest.key === 'confidence' || highest.key === 'selfWorth') {
    primaryDriver = 'Self Alignment';
    primaryDriverAr = 'التوافق الذاتي';
  } else if (highest.key === 'focus') {
    primaryDriver = 'Analytical Precision';
    primaryDriverAr = 'الدقة التحليلية';
  }

  // 3. Strengths Mapping (top 3)
  const strengthMapEn: Record<string, string> = {
    confidence: 'High Self-Assurance',
    discipline: 'Unwavering Discipline',
    emotional: 'Emotional Self-Awareness',
    charisma: 'Magnetic Presence',
    leadership: 'Strategic Command',
    selfWorth: 'Strong Sense of Identity',
    consistency: 'Systematic Consistency',
    focus: 'Deep Work Capacity',
    social: 'Social Fluidity',
    empathy: 'Compassionate Empathy'
  };

  const strengthMapAr: Record<string, string> = {
    confidence: 'ثقة عالية بالنفس',
    discipline: 'انضباط ثابت لا يتزعزع',
    emotional: 'وعي عاطفي ذاتي قوي',
    charisma: 'حضور مغناطيسي مقنع',
    leadership: 'قيادة استراتيجية واضحة',
    selfWorth: 'تقدير ذاتي وهويّة قوية',
    consistency: 'اتساق سلوكي متكرر',
    focus: 'قدرة عالية على التركيز',
    social: 'مرونة تواصل اجتماعي',
    empathy: 'تعاطف وفهم عميق للغير'
  };

  const strengths = sortedMetrics.slice(0, 3).map(m => strengthMapEn[m.key]);
  const strengthsAr = sortedMetrics.slice(0, 3).map(m => strengthMapAr[m.key]);

  // 4. Weaknesses Mapping (bottom 3)
  const weaknessMapEn: Record<string, string> = {
    confidence: 'Validation Dependency',
    discipline: 'Procrastination Vulnerability',
    emotional: 'Stress Reactivity',
    charisma: 'Social Hesitation',
    leadership: 'Delegation Friction',
    selfWorth: 'Sensitivity to Criticism',
    consistency: 'Erratic Energy Cycles',
    focus: 'Cognitive Overload',
    social: 'Social Battery Depletion',
    empathy: 'Emotional Detachment'
  };

  const weaknessMapAr: Record<string, string> = {
    confidence: 'الحاجة للتأكيد الخارجي',
    discipline: 'عرضة للتسويف والتأجيل',
    emotional: 'سرعة الانفعال تحت الضغط',
    charisma: 'التردد أو القلق الاجتماعي',
    leadership: 'صعوبة تفويض المهام للغير',
    selfWorth: 'حساسية مفرطة للنقد',
    consistency: 'تشتت روتين الطاقة والعمل',
    focus: 'تشتت ذهني سريع',
    social: 'سرعة استنزاف الطاقة الاجتماعية',
    empathy: 'الانفصال العاطفي والتحفظ'
  };

  const weaknesses = [lowest, secondLowest, thirdLowest].map(m => weaknessMapEn[m.key]);
  const weaknessesAr = [lowest, secondLowest, thirdLowest].map(m => weaknessMapAr[m.key]);

  // 5. Intelligence Insight
  let insight = 'Profile indicates stable analytical performance with potential for emotional growth.';
  let insightAr = 'يشير ملفك التعريفي إلى أداء تحليلي مستقر مع إمكانية للنمو العاطفي.';

  if (lowest.key === 'social' || lowest.key === 'empathy') {
    insight = 'System analysis detects a recurring avoidance pattern during social conflicts. Focus on active dialogue.';
    insightAr = 'يكشف تحليل النظام عن نمط تجنب متكرر أثناء النزاعات الاجتماعية. ركز على الحوار النشط.';
  } else if (lowest.key === 'discipline' || lowest.key === 'consistency') {
    insight = 'Behavioral audit reveals fluctuations in baseline habits. Prioritize low-friction micro-missions.';
    insightAr = 'يكشف التدقيق السلوكي عن تقلبات في العادات الأساسية. ركز على المهام الصغيرة منخفضة الاحتكاك.';
  } else if (lowest.key === 'focus') {
    insight = 'Cognitive diagnostic indicates elevated mental load and overthinking loops. Implement strategic silence.';
    insightAr = 'يشير التشخيص المعرفي إلى ارتفاع الحمل الذهني وحلقات التفكير المفرط. نفذ الصمت الاستراتيجي.';
  }

  // 6. Growth Protocol
  let growthProtocol = '"Phase I focus should be on Cognitive Integration. Balance deep focus with planned recovery cycles."';
  let growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على التكامل المعرفي. وازن بين التركيز العميق ودورات الاستشفاء المخططة."';

  if (lowest.key === 'empathy' || lowest.key === 'social') {
    growthProtocol = '"Phase I focus should be on Social Fluidity. Your current dominance is high-performing in isolation but benefit from active collaborative neural streams."';
    growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على السيولة الاجتماعية. سيادتك الحالية عالية الأداء في العزلة ولكنها تحتاج إلى تيارات عصبية تعاونية."';
  } else if (lowest.key === 'discipline') {
    growthProtocol = '"Phase I focus should be on Baseline Consistency. Build daily micro-habits before increasing target difficulty."';
    growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على الاتساق الأساسي. ابنِ عادات صغيرة يومية قبل زيادة الصعوبة التدريجية."';
  }

  // 7. Protocols 01 & 02
  let protocol01 = 'Execute a 10s Pause during conflict.';
  let protocol01Ar = 'نفذ توقفاً لمدة 10 ثوانٍ أثناء النزاع.';
  let protocol02 = 'Record thoughts in Journal immediately.';
  let protocol02Ar = 'سجل الأفكار في السجل العصبي فوراً.';

  if (lowest.key === 'focus') {
    protocol01 = 'Perform 4-7-8 Breathing exercises.';
    protocol01Ar = 'قم بتمارين التنفس 4-7-8 عند التشتت.';
    protocol02 = 'Audit daily screen-time blocks.';
    protocol02Ar = 'راقب أوقات تصفح الشاشات اليومية.';
  } else if (lowest.key === 'discipline') {
    protocol01 = 'Set a 5-minute timer for start actions.';
    protocol01Ar = 'اضبط مؤقتاً لـ 5 دقائق للبدء بالمهام.';
    protocol02 = 'Log habits immediately in Forge.';
    protocol02Ar = 'سجل عاداتك فوراً في منصة تشكيل العادات.';
  }

  return {
    archetype,
    archetypeAr,
    primaryDriver,
    primaryDriverAr,
    strengths,
    strengthsAr,
    weaknesses,
    weaknessesAr,
    insight,
    insightAr,
    growthProtocol,
    growthProtocolAr,
    protocol01,
    protocol01Ar,
    protocol02,
    protocol02Ar,
  };
}

const axisDescriptions: Record<string, { strongestEn: string; strongestAr: string; growthEn: string; growthAr: string }> = {
  confidence: {
    strongestEn: "High trust in decision-making and agency under pressure.",
    strongestAr: "ثقة عالية في اتخاذ القرارات وقدرة ممتازة على التوجيه الذاتي تحت الضغط.",
    growthEn: "Decision-making friction and vulnerability to self-doubt.",
    growthAr: "صعوبة وتردد في اتخاذ القرارات، مع القابلية للشك الذاتي."
  },
  discipline: {
    strongestEn: "Exceptional self-regulation. You execute goals regardless of emotional state.",
    strongestAr: "تنظيم ذاتي استثنائي. تقوم بالتنفيذ بغض النظر عن حالتك المزاجية أو مشاعرك الحالية.",
    growthEn: "Friction in task initiation and vulnerability to short-term distractions.",
    growthAr: "صعوبة في البدء بالمهام وعرضة عالية للتشتت بالمغريات قصيرة المدى."
  },
  emotional: {
    strongestEn: "High emotional self-awareness and capacity to regulate stress.",
    strongestAr: "وعي عاطفي ذاتي قوي وقدرة متقدمة على تنظيم وتخفيف الضغوط النفسية.",
    growthEn: "High emotional reactivity or avoidance patterns during crises.",
    growthAr: "سرعة انفعال عاطفي أو اللجوء للهروب وتجنب المشاكل عند الأزمات."
  },
  charisma: {
    strongestEn: "Magnetic social presence and natural ability to influence groups.",
    strongestAr: "حضور اجتماعي لافت وقدرة طبيعية على الإقناع وترك انطباع قوي ومحبب لدى الآخرين.",
    growthEn: "Difficulty projecting warmth or maintaining social calibration.",
    growthAr: "صعوبة في نقل مشاعر المودة أو الموازنة بين القيادة والاندماج الاجتماعي."
  },
  leadership: {
    strongestEn: "Excellent strategic command, vision setting, and group delegation.",
    strongestAr: "قدرة عالية على التوجيه الاستراتيجي، تحديد الرؤية، وتفويض المسؤوليات بكفاءة.",
    growthEn: "Micro-management tendencies or hesitation to direct team outcomes.",
    growthAr: "الميل للإدارة التفصيلية للغير أو التردد في اتخاذ القرارات وحسم النتائج."
  },
  selfWorth: {
    strongestEn: "Solid internal validation. Value is decoupled from external feedback.",
    strongestAr: "تقدير داخلي صلب ومتين للذات. قيمتك الشخصية مستقلة عن رأي الآخرين أو الفشل.",
    growthEn: "High dependency on external validation to maintain self-esteem.",
    growthAr: "اعتماد مفرط على الثناء والتقييم الخارجي للشعور بالرضا والقيمة الشخصية."
  },
  consistency: {
    strongestEn: "Excellent loop stabilization. Highly predictable daily habits.",
    strongestAr: "ثبات ممتاز في السلوكيات والروتين. أنماطك اليومية مستقرة ومتوقعة للغاية.",
    growthEn: "Erratic energy cycles. High spikes followed by absolute inaction.",
    growthAr: "تذبذب عالي في النشاط والإنتاجية؛ فترات طاقة عشوائية تتبعها فترات خمول كامل."
  },
  focus: {
    strongestEn: "Deep cognitive immersion and exceptional sensory filtering.",
    strongestAr: "استغراق ذهني عميق وقدرة ممتازة على عزل الذات عن المشتتات والعمل بتركيز.",
    growthEn: "Cognitive fragmentation and mental drift from continuous tasks.",
    growthAr: "تشتت معرفي سريع وفقدان التركيز بسبب كثرة التفكير والانتقال بين المهام."
  },
  social: {
    strongestEn: "Highly optimized social battery with perfect balancing of engagement.",
    strongestAr: "تنظيم رائع للبطارية الاجتماعية، والقدرة على تحقيق التوازن الفعال بين المخالطة والاستشفاء.",
    growthEn: "Rapid social battery depletion, leading to isolation or performance anxiety.",
    growthAr: "استنزاف سريع جداً للطاقة عند التواصل الاجتماعي، مما يؤدي للرغبة في العزلة أو القلق الاجتماعي."
  },
  empathy: {
    strongestEn: "Rapid cognitive rebounding and high emotional resilience.",
    strongestAr: "ارتداد معرفي وتكيف سريع بعد الصدمات أو العقبات، مع مرونة نفسية عالية.",
    growthEn: "Extended recovery periods after stress or getting stuck in negative cycles.",
    growthAr: "صعوبة في تجاوز العقبات والانتكاسات، والتعلق لفترات طويلة بدوائر التفكير السلبي."
  }
};

const mapSubjectToKey = (subj: string): string => {
  const s = subj.toLowerCase().trim();
  if (s === 'self worth' || s === 'selfworth' || s === 'الذات' || s === 'تقدير الذات') return 'selfWorth';
  if (s === 'social energy' || s === 'social' || s === 'اجتماعي' || s === 'الطاقة الاجتماعية') return 'social';
  if (s === 'resilience' || s === 'empathy' || s === 'المرونة' || s === 'التعاطف') return 'empathy';
  if (s === 'eq' || s === 'emotional' || s === 'عاطفي' || s === 'الذكاء العاطفي') return 'emotional';
  return s;
};

export function getAxisDescription(subject: string, type: 'strongest' | 'growth', language: 'en' | 'ar'): string {
  const key = mapSubjectToKey(subject);
  const desc = axisDescriptions[key];
  if (!desc) return '';
  if (type === 'strongest') {
    return language === 'ar' ? desc.strongestAr : desc.strongestEn;
  } else {
    return language === 'ar' ? desc.growthAr : desc.growthEn;
  }
}

export function getDynamicStability(user: any): number {
  if (!user) return 60;
  
  // If burnout test has been completed, use the recorded stability value
  if (user.completedTests && user.completedTests['burnout']) {
    return user.stability !== undefined ? user.stability : 92;
  }
  
  // Otherwise, calculate as average of all 10 neural metrics
  const metrics = [
    user.confidence !== undefined ? user.confidence : 65,
    user.discipline !== undefined ? user.discipline : 48,
    user.emotional !== undefined ? user.emotional : 75,
    user.charisma !== undefined ? user.charisma : 50,
    user.leadership !== undefined ? user.leadership : 60,
    user.selfWorth !== undefined ? user.selfWorth : 55,
    user.consistency !== undefined ? user.consistency : 45,
    user.focus !== undefined ? user.focus : 85,
    user.social !== undefined ? user.social : 40,
    user.empathy !== undefined ? user.empathy : 70
  ];
  
  const sum = metrics.reduce((a, b) => a + b, 0);
  return Math.round(sum / metrics.length);
}


