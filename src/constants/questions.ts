export interface QuestionOption {
  value: number;
  label: string;
  labelAr: string;
}

export interface Question {
  id: string;
  text: string;
  textAr: string;
  options: QuestionOption[];
}

const DEFAULT_OPTIONS: QuestionOption[] = [
  { value: 1, label: 'Never', labelAr: 'أبداً' },
  { value: 2, label: 'Rarely', labelAr: 'نادراً' },
  { value: 3, label: 'Sometimes', labelAr: 'أحياناً' },
  { value: 4, label: 'Often', labelAr: 'غالباً' },
  { value: 5, label: 'Always', labelAr: 'دائماً' },
];

export const TEST_QUESTIONS: Record<string, Question[]> = {
  // 1. Assistant (10 Questions)
  assistant: [
    {
      id: 'asst-1',
      text: 'Do you clearly define your personal growth goals each week?',
      textAr: 'هل تحدد بوضوح أهداف نموك الشخصي كل أسبوع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-2',
      text: 'Do you regularly consult tools or systems to help guide your daily decisions?',
      textAr: 'هل تستشير بانتظام أدوات أو أنظمة للمساعدة في توجيه قراراتك اليومية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-3',
      text: 'How easily do you implement guidance and feedback in your routines?',
      textAr: 'ما مدى سهولة تطبيق التوجيه والملاحظات في روتينك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-4',
      text: 'Do you track your progress on long-term goals consistently?',
      textAr: 'هل تتابع تقدمك في تحقيق الأهداف طويلة المدى باستمرار؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-5',
      text: 'Do you feel you have a clear plan for your personal evolution?',
      textAr: 'هل تشعر أن لديك خطة واضحة لتطورك الشخصي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-6',
      text: 'Do you break down complex challenges into structured action lists?',
      textAr: 'هل تقوم بتفكيك التحديات المعقدة إلى قوائم إجراءات منظمة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-7',
      text: 'How often do you use digital trackers or journals to audit your time?',
      textAr: 'كم مرة تستخدم متتبعات رقمية أو مذكرات لتدقيق وقتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-8',
      text: 'Do you adjust your action steps immediately when you receive new performance data?',
      textAr: 'هل تقوم بتعديل خطوات عملك فوراً عندما تتلقى بيانات أداء جديدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-9',
      text: 'Do you schedule weekly review sessions to analyze what went wrong?',
      textAr: 'هل تجدول جلسات مراجعة أسبوعية لتحليل الأخطاء التي وقعت؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'asst-10',
      text: 'Do you actively seek external frameworks to optimize your daily efficiency?',
      textAr: 'هل تبحث بنشاط عن أطر عمل خارجية لتحسين كفاءتك اليومية؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 2. Daily Ritual (10 Questions)
  'daily-ritual': [
    {
      id: 'rit-1',
      text: 'Do you start your day with a structured ritual?',
      textAr: 'هل تبدأ يومك بطقوس منظمة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-2',
      text: 'How consistent are you in executing your evening winding-down rituals?',
      textAr: 'ما مدى اتساقك في تنفيذ طقوس الاسترخاء المسائية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-3',
      text: 'Do your daily rituals align with your mental and physical health?',
      textAr: 'هل تتماشى طقوسك اليومية مع صحتك النفسية والجسدية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-4',
      text: 'Can you maintain your rituals when traveling or under high stress?',
      textAr: 'هل يمكنك الحفاظ على طقوسك عند السفر أو تحت الضغط الشديد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-5',
      text: 'Do your daily rituals help you feel grounded and focused?',
      textAr: 'هل تساعدك طقوسك اليومية على الشعور بالاستقرار والتركيز؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-6',
      text: 'Do you intentionally protect the first hour of your day from emails and social media?',
      textAr: 'هل تحمي عمداً الساعة الأولى من يومك من رسائل البريد الإلكتروني ووسائل التواصل الاجتماعي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-7',
      text: 'Do you have a consistent sleeping schedule that you follow even on weekends?',
      textAr: 'هل لديك جدول نوم ثابت تتبعه حتى في عطلات نهاية الأسبوع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-8',
      text: 'Do you allocate dedicated time for reflection or mindfulness during the day?',
      textAr: 'هل تخصص وقتاً محدداً للتأمل أو اليقظة الذهنية خلال اليوم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-9',
      text: 'How easily can you return to your routines after a major disruption?',
      textAr: 'ما مدى سهولة عودتك إلى روتينك المعتاد بعد حدوث اضطراب كبير؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'rit-10',
      text: 'Do you review and adjust your daily habits to fit your changing goals?',
      textAr: 'هل تراجع وتعدل عاداتك اليومية لتناسب أهدافك المتغيرة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 3. Neural Flow (12 Questions)
  'neural-flow': [
    {
      id: 'flow-1',
      text: 'How often do you enter a state of deep focus (flow state) during work?',
      textAr: 'كم مرة تدخل في حالة تركيز عميق (حالة التدفق) أثناء العمل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-2',
      text: 'Can you easily resume focus after an unexpected interruption?',
      textAr: 'هل يمكنك استئناف التركيز بسهولة بعد مقاطعة غير متوقعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-3',
      text: 'Do you feel mentally energized after completing a complex task?',
      textAr: 'هل تشعر بالطاقة الذهنية بعد إكمال مهمة معقدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-4',
      text: 'Do you structure your environment to minimize cognitive distractions?',
      textAr: 'هل تنظم بيئتك لتقليل المشتتات الذهنية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-5',
      text: 'How effectively do you transition between high-focus work and rest?',
      textAr: 'ما مدى فعاليتك في الانتقال بين العمل عالي التركيز والراحة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-6',
      text: 'Can you work on a single hard task for over 90 minutes without checking notifications?',
      textAr: 'هل يمكنك العمل على مهمة صعبة واحدة لأكثر من 90 دقيقة دون التحقق من الإشعارات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-7',
      text: 'Do you know your peak mental hours and schedule your hardest work then?',
      textAr: 'هل تعرف ساعات ذروتك الذهنية وتجدول أصعب أعمالك فيها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-8',
      text: 'How easily do you tune out background conversations or ambient noise?',
      textAr: 'ما مدى سهولة تجاهلك للمحادثات الجانبية أو الضوضاء المحيطة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-9',
      text: 'Do you use focus techniques (like Pomodoro or time-blocking) consistently?',
      textAr: 'هل تستخدم تقنيات التركيز (مثل البومودورو أو تقسيم الوقت) باستمرار؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-10',
      text: 'Do you experience mental clarity instead of brain fog during your work sessions?',
      textAr: 'هل تشعر بالوضوح الذهني بدلاً من التشتت والضبابية أثناء جلسات عملك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-11',
      text: 'Can you mentally isolate yourself to solve a problem under tight time pressure?',
      textAr: 'هل يمكنك عزل نفسك ذهنياً لحل مشكلة تحت ضغط الوقت الضيق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'flow-12',
      text: 'Do you finish work sessions feeling satisfied with your cognitive output?',
      textAr: 'هل تنهي جلسات العمل وأنت تشعر بالرضا عن مخرجاتك الذهنية؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 4. Strategic Planner (12 Questions)
  planner: [
    {
      id: 'plan-1',
      text: 'Do you plan your weekly schedule in advance?',
      textAr: 'هل تخطط لجدولك الأسبوعي مسبقاً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-2',
      text: 'How effectively do you prioritize long-term strategic projects over daily urgency?',
      textAr: 'ما مدى فعاليتك في ترتيب أولويات المشاريع الاستراتيجية طويلة المدى على العاجل اليومي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-3',
      text: 'Do you set measurable milestones for your personal goals?',
      textAr: 'هل تضع معالم قابلة للقياس لأهدافك الشخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-4',
      text: 'How easily do you adapt your plans when circumstances change?',
      textAr: 'ما مدى سهولة تكيف خططك عندما تتغير الظروف؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-5',
      text: 'Do you allocate specific time blocks for strategic planning?',
      textAr: 'هل تخصص فترات زمنية محددة للتخطيط الاستراتيجي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-6',
      text: 'Do you identify potential bottlenecks or risks before executing a project?',
      textAr: 'هل تحدد الاختناقات أو المخاطر المحتملة قبل البدء في تنفيذ المشروع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-7',
      text: 'Do you keep a clear separation between your vision and daily operational tasks?',
      textAr: 'هل تحافظ على فصل واضح بين رؤيتك العامة والمهام التشغيلية اليومية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-8',
      text: 'Do you analyze data and metrics to measure success rather than relying on gut feeling?',
      textAr: 'هل تحلل البيانات والمقاييس لقياس النجاح بدلاً من الاعتماد على الحدس؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-9',
      text: 'How frequently do you decline tasks because they do not align with your core objectives?',
      textAr: 'كم مرة ترفض مهاماً لأنها لا تتماشى مع أهدافك الأساسية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-10',
      text: 'Do you design contingency plans (Plan B) for high-stakes decisions?',
      textAr: 'هل تضع خطط طوارئ (خطة بديلة) للقرارات ذات الأهمية الكبيرة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-11',
      text: 'Do you review resources (time, money, energy) before committing to a new goal?',
      textAr: 'هل تراجع الموارد المتاحة (الوقت، المال، الطاقة) قبل الالتزام بهدف جديد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'plan-12',
      text: 'Do you evaluate the long-term compounding effects of your current strategies?',
      textAr: 'هل تقيم الآثار التراكمية طويلة المدى لاستراتيجياتك الحالية؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 5. Empathy (12 Questions)
  empathy: [
    {
      id: 'emp-1',
      text: 'Can you accurately sense what someone is feeling before they speak?',
      textAr: 'هل يمكنك الشعور بدقة بما يشعر به شخص ما قبل أن يتحدث؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-2',
      text: 'Do you actively listen and validate others\' emotions during conversations?',
      textAr: 'هل تستمع بنشاط وتثبت مشاعر الآخرين أثناء المحادثات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-3',
      text: 'How easily can you look at a situation from someone else\'s perspective?',
      textAr: 'ما مدى سهولة النظر إلى موقف ما من منظور شخص آخر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-4',
      text: 'Do you feel a strong connection to the emotional experiences of others?',
      textAr: 'هل تشعر بارتباط قوي بالتجارب العاطفية للآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-5',
      text: 'How well can you comfort someone who is going through a difficult time?',
      textAr: 'ما مدى قدرتك على مواساة شخص يمر بوقت عصيب؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-6',
      text: 'Do you notice subtle shifts in body language or facial expressions in meetings?',
      textAr: 'هل تلاحظ التغيرات الطفيفة في لغة الجسد أو تعبيرات الوجه في الاجتماعات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-7',
      text: 'Do you avoid interrupting others to give advice before they finish explaining?',
      textAr: 'هل تتجنب مقاطعة الآخرين لتقديم المشورة قبل أن ينتهوا من الشرح؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-8',
      text: 'Do you tailor your communication style depending on the emotional state of the listener?',
      textAr: 'هل تخصص أسلوب تواصلك بناءً على الحالة العاطفية للمستمع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-9',
      text: 'How often do you check in on friends or team members when you sense they are stressed?',
      textAr: 'كم مرة تطمئن على أصدقائك أو أعضاء فريقك عندما تشعر أنهم تحت ضغط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-10',
      text: 'Can you remain open and objective even when someone expresses views contrary to yours?',
      textAr: 'هل يمكنك البقاء منفتحاً وموضوعياً حتى عندما يعبر شخص ما عن آراء مخالفة لآرائك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-11',
      text: 'Do you feel genuine joy for others when they achieve major milestones?',
      textAr: 'هل تشعر بفرح حقيقي للآخرين عندما يحققون نجاحات كبيرة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'emp-12',
      text: 'Are you conscious of how your mood affects the emotional climate of the room?',
      textAr: 'هل أنت واعٍ بكيفية تأثير حالتك المزاجية على المناخ العاطفي للمكان؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 6. Shadow Work (15 Questions)
  shadow: [
    {
      id: 'shad-1',
      text: 'Do you investigate the underlying reasons for your sudden emotional triggers?',
      textAr: 'هل تبحث في الأسباب الكامنة وراء انفعالاتك العاطفية المفاجئة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-2',
      text: 'Are you aware of your subconscious defense mechanisms during stress?',
      textAr: 'هل أنت على دراية بآليات دفاعك اللاواعية أثناء التوتر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-3',
      text: 'Do you confront and accept your personal flaws and insecurities?',
      textAr: 'هل تواجه وتتقبل عيوبك الشخصية ومخاوفك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-4',
      text: 'How often do you reflect on past behavioral patterns you want to change?',
      textAr: 'كم مرة تفكر في الأنماط السلوكية السابقة التي تريد تغييرها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-5',
      text: 'Do you feel integrated and at peace with all parts of your personality?',
      textAr: 'هل تشعر بالتكامل والسلام مع جميع أجزاء شخصيتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-6',
      text: 'Do you notice when you project your own insecurities onto other people?',
      textAr: 'هل تلاحظ متى تسقط مخاوفك وقلقك الشخصي على الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-7',
      text: 'How comfortable are you exploring emotions that are generally considered negative (e.g., envy, resentment)?',
      textAr: 'ما مدى راحتك في استكشاف المشاعر التي تعتبر سلبية عموماً (مثل الحسد، الضغينة)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-8',
      text: 'Do you analyze your reactions to people you strongly dislike to see if they reflect your own shadow?',
      textAr: 'هل تحلل ردود أفعالك تجاه الأشخاص الذين تكرههم بشدة لمعرفة ما إذا كانوا يعكسون جانبك المظلم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-9',
      text: 'Do you avoid hiding your mistakes and weaknesses from yourself?',
      textAr: 'هل تتجنب إخفاء أخطائك ونقاط ضعفك عن نفسك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-10',
      text: 'Do you investigate your fear of failure to understand its root causes?',
      textAr: 'هل تبحث في خوفك من الفشل لفهم أسبابه الجذرية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-11',
      text: 'How often do you allow yourself to feel difficult emotions without suppressing them immediately?',
      textAr: 'كم مرة تسمح لنفسك بالشعور بالمشاعر الصعبة دون قمعها فوراً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-12',
      text: 'Do you recognize your childhood coping mechanisms that no longer serve you today?',
      textAr: 'هل تتعرف على آليات التكيف في طفولتك التي لم تعد تخدمك اليوم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-13',
      text: 'Can you accept feedback that contradicts your self-image without becoming defensive?',
      textAr: 'هل يمكنك قبول الملاحظات التي تتعارض مع صورتك الذاتية دون أن تصبح دفاعياً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-14',
      text: 'Do you understand how your hidden desires or repressions drive your behavior?',
      textAr: 'هل تفهم كيف تدفع رغباتك الخفية أو مكبوتاتك سلوكك اليومي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'shad-15',
      text: 'Are you working actively to forgive yourself for past mistakes and integrations?',
      textAr: 'هل تعمل بنشاط على مسامحة نفسك على أخطاء الماضي ودمجها؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 7. Confidence (15 Questions)
  confidence: [
    {
      id: 'conf-1',
      text: 'How comfortable are you expressing your opinions in large groups?',
      textAr: 'ما مدى راحتك في التعبير عن آرائك في المجموعات الكبيرة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-2',
      text: 'Do you trust your own decision-making in high-pressure situations?',
      textAr: 'هل تثق في اتخاذك للقرارات في المواقف الصعبة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-3',
      text: 'Do you feel confident to take on new challenges even if you might fail?',
      textAr: 'هل تشعر بالثقة لقبول تحديات جديدة حتى لو كان هناك احتمال للفشل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-4',
      text: 'How easily do you accept compliments and positive feedback from others?',
      textAr: 'ما مدى سهولة قبولك للإطراء والتعليقات الإيجابية من الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-5',
      text: 'Do you feel secure in your social standing without needing constant validation?',
      textAr: 'هل تشعر بالأمان في مكانتك الاجتماعية دون الحاجة إلى تأكيد مستمر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-6',
      text: 'Can you speak clearly and confidently when you are the center of attention?',
      textAr: 'هل يمكنك التحدث بوضوح وثقة عندما تكون مركز الاهتمام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-7',
      text: 'Do you maintain an open, assertive posture when walking into a room?',
      textAr: 'هل تحافظ على وضعية جسد منفتحة وواثقة عند دخولك أي مكان؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-8',
      text: 'How easily do you say "no" to demands that conflict with your priorities?',
      textAr: 'ما مدى سهولة قولك "لا" للمطالب التي تتعارض مع أولوياتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-9',
      text: 'Do you trust your capabilities when starting a task you have never done before?',
      textAr: 'هل تثق في قدراتك عندما تبدأ في تنفيذ مهمة لم تقم بها من قبل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-10',
      text: 'Can you handle rejection or failure without it crushing your sense of self?',
      textAr: 'هل يمكنك التعامل مع الرفض أو الفشل دون أن يحطم ذلك تقديرك لذاتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-11',
      text: 'Do you voice your disagreements with authority figures or peers constructively?',
      textAr: 'هل تعبر عن خلافك مع الشخصيات القيادية أو زملائك بشكل بناء؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-12',
      text: 'Do you avoid comparing yourself to peers and focus on your own timeline?',
      textAr: 'هل تتجنب مقارنة نفسك بأقرانك وتركز على مسارك الزمني الخاص؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-13',
      text: 'Are you comfortable showing vulnerability without feeling weak?',
      textAr: 'هل تشعر بالراحة عند إظهار ضعفك دون أن تشعر بالوهن أو قلة الحيلة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-14',
      text: 'Do you feel you deserve success and happiness as much as anyone else?',
      textAr: 'هل تشعر أنك تستحق النجاح والسعادة تماماً كأي شخص آخر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'conf-15',
      text: 'How quickly do you recover from a public mistake or embarrassing situation?',
      textAr: 'ما مدى سرعتك في التعافي من خطأ علني أو موقف محرج؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 8. Charisma (15 Questions)
  charisma: [
    {
      id: 'char-1',
      text: 'Do you find it easy to start conversations and build rapport with strangers?',
      textAr: 'هل تجد من السهل بدء محادثات وبناء علاقة جيدة مع الغرباء؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-2',
      text: 'How effectively can you persuade others to accept or support your ideas?',
      textAr: 'ما مدى فعاليتك في إقناع الآخرين بقبول أو دعم أفكارك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-3',
      text: 'Do people naturally look to you for guidance or energy in social settings?',
      textAr: 'هل يتطلع الناس إليك بشكل طبيعي للحصول على التوجيه أو الطاقة في التجمعات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-4',
      text: 'How confident are you in reading social cues and subtle body language?',
      textAr: 'ما مدى ثقتك في قراءة الإشارات الاجتماعية ولغة الجسد الدقيقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-5',
      text: 'Do you use storytelling or humor to captivate and engage an audience?',
      textAr: 'هل تستخدم سرد القصص أو الفكاهة لجذب انتباه الجمهور وإشراكهم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-6',
      text: 'Do you make others feel heard and valued when talking with them one-on-one?',
      textAr: 'هل تجعل الآخرين يشعرون بأنهم مسموعون ومقدرون عند التحدث معهم على انفراد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-7',
      text: 'Can you command the attention of a room without raising your voice?',
      textAr: 'هل يمكنك لفت انتباه الحضور في الغرفة دون الحاجة لرفع صوتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-8',
      text: 'How easily do you maintain relaxed, confident eye contact during deep dialogue?',
      textAr: 'ما مدى سهولة حفاظك على تواصل بصري مريح وواثق أثناء الحوارات العميقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-9',
      text: 'Do you adapt your conversational tone to match the energy of the room?',
      textAr: 'هل تكيف نبرة حديثك لتتوافق مع طاقة وحالة الموجودين في المكان؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-10',
      text: 'Do you remember names and personal details of people you met briefly?',
      textAr: 'هل تتذكر أسماء وتفاصيل الأشخاص الشخصية الذين قابلتهم لفترة وجيزة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-11',
      text: 'Do you project warmth and enthusiasm that makes others comfortable?',
      textAr: 'هل تعكس الدفء والحماس الذي يبعث الطمأنينة والراحة في نفوس الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-12',
      text: 'Are you skilled at finding common ground in negotiations or debates?',
      textAr: 'هل أنت ماهر في إيجاد أرضية مشتركة أثناء المفاوضات أو النقاشات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-13',
      text: 'Do people often describe you as inspiring or highly memorable?',
      textAr: 'هل يصفك الناس غالباً بأنك ملهم أو تترك أثراً قوياً لا يُنسى؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-14',
      text: 'Can you handle awkward social situations with poise and grace?',
      textAr: 'هل يمكنك التعامل مع المواقف الاجتماعية المحرجة باتزان ولباقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'char-15',
      text: 'Do you praise others publicly and support their achievements naturally?',
      textAr: 'هل تثني على الآخرين علناً وتدعم إنجازاتهم بشكل طبيعي؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 9. EQ (15 Questions)
  eq: [
    {
      id: 'eq-1',
      text: 'Can you accurately identify and label your emotions as you experience them?',
      textAr: 'هل يمكنك تحديد وتسمية مشاعرك بدقة أثناء تجربتك لها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-2',
      text: 'How well do you manage your emotions under intense stress or irritation?',
      textAr: 'ما مدى قدرتك على إدارة عواطفك تحت الضغط الشديد أو الاستفزاز؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-3',
      text: 'Are you able to understand and validate other people\'s perspectives in conflicts?',
      textAr: 'هل يمكنك فهم وتأكيد وجهات نظر الآخرين أثناء الخلافات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-4',
      text: 'How easily do you bounce back from emotional setbacks or failures?',
      textAr: 'ما مدى سهولة تعافيك من النكسات العاطفية أو الإخفاقات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-5',
      text: 'Do you listen actively to others without formulating your response prematurely?',
      textAr: 'هل تستمع بنشاط للآخرين دون صياغة ردك بشكل متسرع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-6',
      text: 'Do you avoid acting on immediate emotional impulses that you might regret later?',
      textAr: 'هل تتجنب التصرف بناءً على دوافع عاطفية فورية قد تندم عليها لاحقاً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-7',
      text: 'Can you express your anger or frustration constructively without attacking others?',
      textAr: 'هل يمكنك التعبير عن غضبك أو إحباطك بشكل بناء دون مهاجمة الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-8',
      text: 'Are you aware of the emotional impact your decisions have on those around you?',
      textAr: 'هل أنت على دراية بالأثر العاطفي لقراراتك على من حولك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-9',
      text: 'Do you practice techniques to calm your mind when feeling overwhelmed?',
      textAr: 'هل تمارس تقنيات لتهدئة عقلك عندما تشعر بالارتباك أو ثقل الأعباء؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-10',
      text: 'Can you separate facts from your emotional interpretations during arguments?',
      textAr: 'هل يمكنك فصل الحقائق عن تفسيراتك العاطفية أثناء النقاشات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-11',
      text: 'Do you actively show empathy towards yourself when you make a mistake?',
      textAr: 'هل تظهر تعاطفاً حقيقياً تجاه نفسك عندما ترتكب خطأ؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-12',
      text: 'How easily can you de-escalate tension in a group or relationship?',
      textAr: 'ما مدى سهولة تخفيفك لحدة التوتر في مجموعة أو علاقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-13',
      text: 'Do you seek to understand the underlying causes of your mood swings?',
      textAr: 'هل تسعى لفهم الأسباب الكامنة وراء تقلباتك المزاجية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-14',
      text: 'Are you comfortable receiving feedback on how you affect others emotionally?',
      textAr: 'هل تشعر بالراحة في تلقي الملاحظات حول كيفية تأثيرك العاطفي على الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'eq-15',
      text: 'Do you maintain emotional honesty, admitting when you are hurt or jealous?',
      textAr: 'هل تحافظ على الصدق العاطفي، معترفاً بصدق عندما تكون مجروحاً أو غيوراً؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 10. Discipline (18 Questions)
  discipline: [
    {
      id: 'disc-1',
      text: 'How consistent are you in following through on your planned daily routines?',
      textAr: 'ما مدى اتساقك في متابعة روتينك اليومي المخطط له؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-2',
      text: 'Do you complete tasks on time without succumbing to procrastination?',
      textAr: 'هل تكمل المهام في الوقت المحدد دون الاستسلام للتسويف؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-3',
      text: 'How easily can you resist temptations or short-term distractions?',
      textAr: 'ما مدى سهولة مقاومة المغريات أو المشتتات قصيرة المدى؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-4',
      text: 'Do you maintain your core work habits even when you lack emotional motivation?',
      textAr: 'هل تحافظ على عادات عملك الأساسية حتى عندما تفتقر إلى الدافع العاطفي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-5',
      text: 'Are you focused on delayed rewards and long-term milestones over instant gratification?',
      textAr: 'هل تركز على المكافآت المؤجلة والإنجازات طويلة المدى بدلاً من الإشباع الفوري؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-6',
      text: 'Do you wake up at your planned time without repeatedly hitting snooze?',
      textAr: 'هل تستيقظ في الوقت المحدد دون تكرار الضغط على غفوة المنبه؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-7',
      text: 'How strictly do you enforce limits on screen time or social media use?',
      textAr: 'ما مدى صرامتك في فرض حدود على وقت الشاشة أو استخدام وسائل التواصل الاجتماعي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-8',
      text: 'Do you stick to your savings and budget targets month-over-month?',
      textAr: 'هل تلتزم بأهدافك المالية والمدخرات شهراً بعد شهر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-9',
      text: 'Do you maintain a consistent physical exercise routine despite your busy schedule?',
      textAr: 'هل تحافظ على روتين تمارين بدنية منتظم على الرغم من جدولك المزدحم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-10',
      text: 'Do you complete unpleasant or boring duties first before moving to pleasant ones?',
      textAr: 'هل تنجز الواجبات غير السارة أو المملة أولاً قبل الانتقال للمهام المفضلة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-11',
      text: 'How well do you stay focused on a single project until it is fully finished?',
      textAr: 'ما مدى قدرتك على البقاء مركزاً على مشروع واحد حتى يكتمل تماماً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-12',
      text: 'Do you avoid working on tasks in a chaotic, unstructured manner?',
      textAr: 'هل تتجنب العمل على المهام بطريقة فوضوية أو غير منظمة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-13',
      text: 'How regularly do you audit your discipline levels and productivity records?',
      textAr: 'ما مدى انتظامك في مراجعة مستويات انضباطك وسجلات إنتاجيتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-14',
      text: 'Do you honor the commitments you make to yourself as highly as those to others?',
      textAr: 'هل تحترم التزاماتك تجاه نفسك بنفس قدر التزاماتك تجاه الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-15',
      text: 'Do you tidy your workspace and environment to support structured work?',
      textAr: 'هل تقوم بترتيب مساحة عملك وبيئتك لدعم العمل المنظم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-16',
      text: 'Can you work through temporary physical discomfort or boredom to finish a goal?',
      textAr: 'هل يمكنك العمل متجاوزاً الملل أو الانزعاج الجسدي المؤقت لإنهاء هدفك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-17',
      text: 'Do you maintain moderate dietary habits even when delicious junk food is available?',
      textAr: 'هل تحافظ على عادات غذائية معتدلة حتى عند توفر الأطعمة السريعة والمغرية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'disc-18',
      text: 'Do you go to sleep at a planned hour to protect your biological performance tomorrow?',
      textAr: 'هل تذهب للنوم في ساعة محددة لحماية أدائك الحيوي والذهني ليوم غد؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 11. Conflict (12 Questions)
  conflict: [
    {
      id: 'confl-1',
      text: 'Do you address conflicts directly instead of avoiding them?',
      textAr: 'هل تواجه الصراعات مباشرة بدلاً من تجنبها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-2',
      text: 'Can you remain calm and rational when discussing disagreements?',
      textAr: 'هل يمكنك البقاء هادئاً وعقلانياً عند مناقشة الخلافات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-3',
      text: 'How effectively do you seek win-win solutions that satisfy both parties?',
      textAr: 'ما مدى فعاليتك في البحث عن حلول مربحة للطرفين ترضي كليهما؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-4',
      text: 'Do you compromise when necessary to restore harmony?',
      textAr: 'هل تقدم تنازلات عند الضرورة لاستعادة الانسجام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-5',
      text: 'Can you separate personal feelings from professional conflicts?',
      textAr: 'هل يمكنك فصل المشاعر الشخصية عن النزاعات المهنية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-6',
      text: 'Do you listen to the opposing party\'s points without immediately preparing counter-arguments?',
      textAr: 'هل تستمع لوجهات نظر الطرف الآخر دون البدء الفوري في صياغة حجج مضادة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-7',
      text: 'Can you de-escalate aggressive energy in others by adjusting your voice and posture?',
      textAr: 'هل يمكنك تهدئة الطاقة الهجومية لدى الآخرين عن طريق تعديل صوتك ووضعية جسدك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-8',
      text: 'Do you ask clarifying questions to check your assumptions during disputes?',
      textAr: 'هل تطرح أسئلة توضيحية للتحقق من افتراضاتك أثناء النزاعات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-9',
      text: 'Do you deliver constructive, objective criticism instead of personal attacks?',
      textAr: 'هل تقدم نقداً بناءً وموضوعياً بدلاً من الهجمات الشخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-10',
      text: 'Are you ready to apologize sincerely when you recognize you were wrong?',
      textAr: 'هل أنت مستعد للاعتذار بصدق عندما تدرك أنك كنت مخطئاً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-11',
      text: 'Do you establish solid boundary parameters to prevent ongoing disrespect?',
      textAr: 'هل تضع حدوداً قوية وصارمة لمنع تكرار عدم الاحترام من الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'confl-12',
      text: 'Can you handle passive-aggressive behavior without reacting emotionally?',
      textAr: 'هل يمكنك التعامل مع السلوك السلبي العدواني دون ردود أفعال عاطفية متسرعة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 12. Self Worth (15 Questions)
  'self-worth': [
    {
      id: 'worth-1',
      text: 'Do you generally feel satisfied and secure with who you are?',
      textAr: 'هل تشعر عموماً بالرضا والأمان تجاه هويتك وشخصيتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-2',
      text: 'How rarely do you feel like a failure compared to your peers?',
      textAr: 'ما مدى ندرة شعورك بالفشل مقارنة بأقرانك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-3',
      text: 'Do you have a fundamentally positive and respectful attitude toward yourself?',
      textAr: 'هل لديك موقف إيجابي ومحترم أساسي تجاه نفسك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-4',
      text: 'How independent is your self-worth from other people\'s criticism?',
      textAr: 'ما مدى استقلالية تقديرك لذاتك عن انتقادات الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-5',
      text: 'Do you value your contribution to your workplace or community?',
      textAr: 'هل تقدر مساهمتك في مكان عملك أو مجتمعك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-6',
      text: 'Do you accept your physical appearance and body image without persistent anxiety?',
      textAr: 'هل تتقبل مظهرك الخارجي وصورة جسدك دون قلق مستمر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-7',
      text: 'How easily do you forgive yourself when you make a major mistake?',
      textAr: 'ما مدى سهولة مسامحتك لنفسك عندما ترتكب خطأ كبيراً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-8',
      text: 'Do you confidently assert your limits when others push too much?',
      textAr: 'هل تفرض حدودك بثقة عندما يضغط الآخرون عليك بشكل مفرط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-9',
      text: 'Do you believe in your capacity to learn, adapt, and build a positive future?',
      textAr: 'هل تؤمن بقدرتك على التعلم والتكيف وبناء مستقبل إيجابي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-10',
      text: 'Do you avoid people-pleasing behaviors that run counter to your values?',
      textAr: 'هل تتجنب سلوكيات إرضاء الآخرين التي تتعارض مع قيمك الخاصة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-11',
      text: 'Do you validate your own efforts and progress, regardless of external output?',
      textAr: 'هل تثبت وتقدر جهودك وتقدمك الشخصي بغض النظر عن النتائج الخارجية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-12',
      text: 'Does your self-esteem remain stable even when a key relationship fails?',
      textAr: 'هل يظل تقديرك لذاتك مستقراً حتى عندما تفشل علاقة أساسية في حياتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-13',
      text: 'Do you feel you deserve professional success and fair compensation?',
      textAr: 'هل تشعر أنك تستحق النجاح المهني والتعويض المالي العادل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-14',
      text: 'Do you reject thoughts of self-sabotage when things are going well?',
      textAr: 'هل ترفض أفكار التدمير الذاتي عندما تسير الأمور على ما يرام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'worth-15',
      text: 'Do you have a clear sense of personal purpose that anchors your identity?',
      textAr: 'هل لديك شعور واضح بالهدف الشخصي الذي يرسخ هويتك؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 13. Social Energy (10 Questions)
  'social-energy': [
    {
      id: 'nrg-1',
      text: 'Do you know your personal limits for social interaction before feeling drained?',
      textAr: 'هل تعرف حدودك الشخصية للتفاعل الاجتماعي قبل الشعور بالاستنزاف؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-2',
      text: 'Do you plan quiet recharge periods after major social events?',
      textAr: 'هل تخطط لفترات شحن هادئة بعد الفعاليات الاجتماعية الكبرى؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-3',
      text: 'How effectively can you say no to social invitations when you are tired?',
      textAr: 'ما مدى فعاليتك في قول لا للدعوات الاجتماعية عندما تكون متعباً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-4',
      text: 'Do you maintain high-quality connections over quantity of friends?',
      textAr: 'هل تحافظ على علاقات عالية الجودة مقارنة بكمية الأصدقاء؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-5',
      text: 'Do you feel comfortable spending time alone to recharge?',
      textAr: 'هل تشعر بالراحة في قضاء الوقت بمفردك لإعادة الشحن؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-6',
      text: 'Do you set clear boundaries in conversations to prevent energy depletion?',
      textAr: 'هل تضع حدوداً واضحة في المحادثات لمنع استنزاف طاقتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-7',
      text: 'How easily can you manage interactions in large crowds without sensory overload?',
      textAr: 'ما مدى سهولة إدارتك للتفاعلات في الحشود الكبيرة دون إرهاق حسي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-8',
      text: 'Do you carefully select the social activities that align with your energy levels?',
      textAr: 'هل تختار بعناية الأنشطة الاجتماعية التي تتماشى مع مستويات طاقتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-9',
      text: 'Do you recognize energy-draining individuals and limit your exposure to them?',
      textAr: 'هل تتعرف على الأشخاص المستنزفين للطاقة وتحد من تواصلك معهم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'nrg-10',
      text: 'Do you have effective practices to recharge your social battery quickly?',
      textAr: 'هل لديك ممارسات فعالة لإعادة شحن بطاريتك الاجتماعية بسرعة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 14. Focus (15 Questions)
  focus: [
    {
      id: 'foc-1',
      text: 'Can you easily stop analyzing past decisions or regrets?',
      textAr: 'هل يمكنك بسهولة التوقف عن تحليل القرارات السابقة أو الندم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-2',
      text: 'Do you fall asleep quickly without repetitive loops of worry about the future?',
      textAr: 'هل تنام سريعاً دون حلقات متكررة من القلق بشأن المستقبل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-3',
      text: 'How easily do you make simple, day-to-day choices without hesitation?',
      textAr: 'ما مدى سهولة اتخاذك للخيارات اليومية البسيطة دون تردد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-4',
      text: 'Do you avoid creating worst-case scenarios for minor problems?',
      textAr: 'هل تتجنب خلق سيناريوهات لأسوأ الحالات للمشاكل البسيطة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-5',
      text: 'Can you easily direct your focus away from racing or anxious thoughts?',
      textAr: 'هل يمكنك بسهولة توجيه تركيزك بعيداً عن الأفكار المتسارعة أو القلقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-6',
      text: 'How long can you maintain absolute focus on deep work before needing a break?',
      textAr: 'ما هي أطول مدة يمكنك فيها الحفاظ على التركيز المطلق في العمل العميق قبل الحاجة لاستراحة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-7',
      text: 'Do you set strict boundaries to avoid checking your phone during intensive sessions?',
      textAr: 'هل تضع حدوداً صارمة لتجنب فحص هاتفك أثناء جلسات العمل المكثفة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-8',
      text: 'Are you able to ignore minor interruptions in your work environment?',
      textAr: 'هل أنت قادر على تجاهل المقاطعات البسيطة في بيئة عملك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-9',
      text: 'Do you prioritize single-tasking over multitasking to optimize output?',
      textAr: 'هل تفضل التركيز على مهمة واحدة بدلاً من تعدد المهام لتحسين مخرجاتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-10',
      text: 'How clear is your cognitive workspace when resolving complex problems?',
      textAr: 'ما مدى وضوح مساحتك الذهنية عند البدء في حل المشكلات المعقدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-11',
      text: 'Can you maintain concentration even when working under extreme pressure?',
      textAr: 'هل يمكنك الحفاظ على تركيزك حتى عند العمل تحت الضغط الشديد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-12',
      text: 'Do you practice mindfulness or meditation to calm dynamic mental noise?',
      textAr: 'هل تمارس اليقظة الذهنية أو التأمل لتهدئة الضوضاء والأفكار المتسارعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-13',
      text: 'Do you avoid getting distracted by office gossip or social media chatter?',
      textAr: 'هل تتجنب التشتت بسبب نميمة زملائك أو الأحاديث الجانبية على وسائل التواصل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-14',
      text: 'Do you feel you have the mental endurance required for long periods of focus?',
      textAr: 'هل تشعر أن لديك القدرة على التحمل الذهني اللازمة لفترات طويلة من التركيز؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'foc-15',
      text: 'How easily can you focus on what is within your control rather than worrying about external events?',
      textAr: 'ما مدى سهولة تركيزك على ما هو تحت سيطرتك بدلاً من القلق بشأن الأحداث الخارجية؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 15. Burnout (10 Questions)
  burnout: [
    {
      id: 'burn-1',
      text: 'Do you feel energetic and enthusiastic when starting your work day?',
      textAr: 'هل تشعر بالنشاط والحماس عند بدء يوم عملك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-2',
      text: 'Do you feel connected and positive about the purpose of your daily tasks?',
      textAr: 'هل تشعر بالارتباط والإيجابية تجاه الغرض من مهامك اليومية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-3',
      text: 'How rarely do you feel physical or emotional exhaustion from your schedule?',
      textAr: 'ما مدى ندرة شعورك بالإرهاق الجسدي أو العاطفي من جدول أعمالك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-4',
      text: 'Do you feel confident that your work output is meaningful and high-quality?',
      textAr: 'هل تشعر بالثقة في أن مخرجات عملك ذات مغزى وجودة عالية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-5',
      text: 'Is it easy for you to concentrate on singular tasks without brain fog?',
      textAr: 'هل من السهل عليك التركيز على مهام فردية دون تشتت ذهني؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-6',
      text: 'Can you disconnect completely from work during evenings and weekends?',
      textAr: 'هل يمكنك الانفصال تماماً عن العمل خلال المساء وعطلات نهاية الأسبوع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-7',
      text: 'Do you feel you have a reasonable level of control over your workload?',
      textAr: 'هل تشعر أن لديك مستوى معقولاً من السيطرة والتحكم في حجم عملك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-8',
      text: 'Do you receive adequate appreciation and support from colleagues or management?',
      textAr: 'هل تتلقى التقدير والدعم المناسبين من زملائك أو الإدارة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-9',
      text: 'How balanced is your professional work with your personal life and relationships?',
      textAr: 'ما مدى توازن عملك المهني مع حياتك الشخصية وعلاقاتك العائلية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'burn-10',
      text: 'Do you maintain enthusiasm for activities and hobbies outside of work?',
      textAr: 'هل تحافظ على حماسك للأنشطة والهوايات خارج إطار العمل؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 16. Archetype (10 Questions)
  archetype: [
    {
      id: 'arch-1',
      text: 'Do you easily identify with specific behavioral roles (e.g., Leader, Creator, Observer)?',
      textAr: 'هل تحدد بسهولة أدواراً سلوكية معينة (مثل القائد، المبتكر، المراقب)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-2',
      text: 'Are you aware of how your archetype drives your choices?',
      textAr: 'هل أنت على دراية بكيفية دفع نموذجك الأصلي لخياراتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-3',
      text: 'Do you adapt your role depending on the group\'s needs?',
      textAr: 'هل تكيف دورك اعتماداً على احتياجات المجموعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-4',
      text: 'Do you understand the shadow side of your primary archetype?',
      textAr: 'هل تفهم الجانب المظلم لنموذجك الأصلي الأساسي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-5',
      text: 'Do you feel your archetype aligns with your true purpose?',
      textAr: 'هل تشعر أن نموذجك الأصلي يتماشى مع هدفك الحقيقي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-6',
      text: 'Can you easily recognize archetypal patterns in other people\'s behavior?',
      textAr: 'هل يمكنك بسهولة التعرف على الأنماط الأصلية في سلوك الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-7',
      text: 'Do you consciously balance different archetypes within your personality?',
      textAr: 'هل توازن بوعي بين النماذج الأصلية المختلفة في شخصيتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-8',
      text: 'Do you resist being labeled or locked into a single behavioral category?',
      textAr: 'هل تقاوم تصنيفك أو حبسك في فئة سلوكية واحدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-9',
      text: 'Do you leverage the specific strengths of your archetype to solve complex challenges?',
      textAr: 'هل تستغل نقاط القوة المحددة لنموذجك الأصلي لحل التحديات المعقدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'arch-10',
      text: 'Do you feel you are evolving along the natural path of your archetype?',
      textAr: 'هل تشعر أنك تتطور على طول المسار الطبيعي لنموذجك الأصلي؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 17. Habit (12 Questions)
  habit: [
    {
      id: 'hab-1',
      text: 'Can you stick to a new habit for more than 30 consecutive days?',
      textAr: 'هل يمكنك الالتزام بعادة جديدة لأكثر من 30 يوماً متتالياً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-2',
      text: 'Do you use triggers or anchors to build new habits?',
      textAr: 'هل تستخدم محفزات أو روابط لبناء عادات جديدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-3',
      text: 'How quickly do you get back on track after breaking a habit?',
      textAr: 'ما مدى سرعتك في العودة إلى المسار الصحيح بعد كسر عادة ما؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-4',
      text: 'Do you track your habits using an app, journal, or checklist?',
      textAr: 'هل تتبع عاداتك باستخدام تطبيق أو دفتر أو قائمة مرجعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-5',
      text: 'Do you eliminate bad habits by replacing them with positive ones?',
      textAr: 'هل تقضي على العادات السيئة باستبدالها بأخرى إيجابية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-6',
      text: 'Do you celebrate milestones and reward yourself for maintaining consistency?',
      textAr: 'هل تحتفل بالإنجازات وتكافئ نفسك على الحفاظ على الاستمرارية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-7',
      text: 'How easily do you reduce friction in your environment to support good habits?',
      textAr: 'ما مدى سهولة تقليلك للعقبات في بيئتك لدعم العادات الجيدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-8',
      text: 'Do you use "habit stacking" to link new routines with existing ones?',
      textAr: 'هل تستخدم "تراكم العادات" لربط الروتين الجديد بالروتين الحالي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-9',
      text: 'Are you focused on starting with tiny, micro-habits rather than massive changes?',
      textAr: 'هل تركز على البدء بعادات صغيرة جداً بدلاً من التغييرات الضخمة المفاجئة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-10',
      text: 'Do you use accountability partners or public commitments to stick to habits?',
      textAr: 'هل تستخدم شركاء للمساءلة أو التزامات علنية للالتزام بعاداتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-11',
      text: 'Do you prioritize consistency of execution over the intensity or duration of the habit?',
      textAr: 'هل تعطي الأولوية لاستمرارية التنفيذ على كثافة أو مدة العادة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'hab-12',
      text: 'Do you focus on changing your identity rather than just tracking outcomes?',
      textAr: 'هل تركز على تغيير هويتك ونظرتك لنفسك بدلاً من مجرد تتبع النتائج؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 18. Silence (10 Questions)
  silence: [
    {
      id: 'sil-1',
      text: 'Can you refrain from speaking when listening to others under stress?',
      textAr: 'هل يمكنك الامتناع عن التحدث عند الاستماع للآخرين تحت الضغط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-2',
      text: 'Do you use silence as a tool to gain control in negotiations or arguments?',
      textAr: 'هل تستخدم الصمت كأداة للسيطرة في المفاوضات أو النقاشات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-3',
      text: 'How comfortable are you with quiet moments during conversations?',
      textAr: 'ما مدى راحتك مع لحظات الصمت أثناء المحادثات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-4',
      text: 'Do you think before speaking to ensure your words have maximum impact?',
      textAr: 'هل تفكر قبل التحدث لضمان أن كلماتك لها أقصى تأثير؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-5',
      text: 'Do you regularly practice mental silence and meditation?',
      textAr: 'هل تمارس الصمت الذهني والتأمل بانتظام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-6',
      text: 'Can you ignore gossips or complaints and refuse to join key discussions?',
      textAr: 'هل يمكنك تجاهل النميمة أو الشكاوى ورفض الانضمام لنقاشات عقيمة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-7',
      text: 'Do you use intentional pauses in speech to emphasize key strategic points?',
      textAr: 'هل تستخدم فترات توقف مقصودة في حديثك للتأكيد على النقاط الاستراتيجية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-8',
      text: 'How comfortable are you remaining silent when someone tries to provoke you?',
      textAr: 'ما مدى راحتك في التزام الصمت عندما يحاول شخص ما استفزازك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-9',
      text: 'Can you hold confidential information and secrets without feeling an urge to share?',
      textAr: 'هل يمكنك حفظ المعلومات السرية والأسرار دون الشعور برغبة ملحة في مشاركتها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sil-10',
      text: 'Do you seek environments of complete physical silence to restore your focus?',
      textAr: 'هل تبحث عن بيئات تسودها الصمت المادي التام لاستعادة تركيزك؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 19. Mission (10 Questions)
  mission: [
    {
      id: 'mis-1',
      text: 'Do you break large, overwhelming goals into tiny micro-missions?',
      textAr: 'هل تقسم الأهداف الكبيرة والمربكة إلى مهام صغيرة جداً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-2',
      text: 'Do you celebrate small daily wins to maintain motivation?',
      textAr: 'هل تحتفل بالانتصارات اليومية الصغيرة للحفاظ على الدافعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-3',
      text: 'How easily can you complete a 5-minute task right now?',
      textAr: 'ما مدى سهولة إكمالك لمهمة مدتها 5 دقائق الآن؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-4',
      text: 'Do you focus on immediate actions rather than worrying about the end result?',
      textAr: 'هل تركز على الإجراءات الفورية بدلاً من القلق بشأن النتيجة النهائية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-5',
      text: 'Do you feel a sense of accomplishment from finishing micro-tasks?',
      textAr: 'هل تشعر بالإنجاز من إكمال المهام الصغيرة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-6',
      text: 'Do you use gamification (points, level-ups) to complete daily chores?',
      textAr: 'هل تستخدم أسلوب الألعاب (نقاط، ترقية المستوى) لإكمال أعمالك اليومية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-7',
      text: 'Are your daily to-do lists composed of specific action verbs rather than general topics?',
      textAr: 'هل تتكون قوائم مهامك اليومية من أفعال إجرائية محددة بدلاً من مواضيع عامة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-8',
      text: 'How quickly do you start the day\'s first task without lingering or delaying?',
      textAr: 'ما مدى سرعتك في بدء المهمة الأولى لليوم دون تسويف أو تأخير؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-9',
      text: 'Do you focus on creating momentum rather than waiting for complete motivation?',
      textAr: 'هل تركز على خلق الزخم والبدء في الحركة بدلاً من انتظار الدافع الكامل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mis-10',
      text: 'Do you limit your daily critical tasks to 3 high-impact items?',
      textAr: 'هل تحدد مهامك المصيرية اليومية بـ 3 مهام ذات تأثير عالٍ فقط؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 20. Journal (10 Questions)
  journal: [
    {
      id: 'jour-1',
      text: 'Do you write down your thoughts and emotions daily?',
      textAr: 'هل تكتب أفكارك ومشاعرك يومياً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-2',
      text: 'Does writing help you clarify complex decisions or feelings?',
      textAr: 'هل تساعدك الكتابة في توضيح القرارات أو المشاعر المعقدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-3',
      text: 'Do you review past journal entries to identify emotional trends?',
      textAr: 'هل تراجع مدخلات المذكرات السابقة لتحديد الاتجاهات العاطفية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-4',
      text: 'How honest are you with yourself when writing in your journal?',
      textAr: 'ما مدى صدقك مع نفسك عند الكتابة في مذكراتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-5',
      text: 'Do you use journaling as a tool to release mental stress?',
      textAr: 'هل تستخدم التدوين كأداة للتخلص من الضغط النفسي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-6',
      text: 'Do you use structured journal prompts to probe deep into your psychological states?',
      textAr: 'هل تستخدم أسئلة توجيهية منظمة في مذكراتك للبحث بعمق في حالاتك النفسية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-7',
      text: 'Do you keep a gratitude log to balance negative cognitive biases?',
      textAr: 'هل تحتفظ بسجل للامتنان لموازنة الانحيازات المعرفية السلبية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-8',
      text: 'Do you write down and analyze your dreams to capture subconscious signals?',
      textAr: 'هل تكتب أحلامك وتحللها لالتقاط إشارات العقل الباطن؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-9',
      text: 'Do you track lessons learned from failures so you don\'t repeat them?',
      textAr: 'هل تسجل الدروس المستفادة من الإخفاقات حتى لا تكررها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'jour-10',
      text: 'Do you find that brain-dumping on paper clears your workspace for action?',
      textAr: 'هل تجد أن تفريغ الأفكار على الورق يفسح المجال ذهنياً للبدء في العمل؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 21. Toxicity (12 Questions)
  toxicity: [
    {
      id: 'tox-1',
      text: 'Can you identify toxic behaviors in your relationships early on?',
      textAr: 'هل يمكنك تحديد السلوكيات السامة في علاقاتك في وقت مبكر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-2',
      text: 'Do you confidently set boundaries with negative or demanding people?',
      textAr: 'هل تضع حدوداً بثقة مع الأشخاص السلبيين أو المتطلبين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-3',
      text: 'How easily can you detach emotionally from someone else\'s drama?',
      textAr: 'ما مدى سهولة انفصالك عاطفياً عن مشاكل الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-4',
      text: 'Do you prioritize your mental health over keeping toxic people in your life?',
      textAr: 'هل تعطي الأولوية لصحتك النفسية على إبقاء الأشخاص السامين في حياتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-5',
      text: 'Do you recover quickly after spending time with energy-draining individuals?',
      textAr: 'هل تتعافى بسرعة بعد قضاء الوقت مع أشخاص يستنزفون الطاقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-6',
      text: 'Do you spot manipulative behavior (e.g., guilt trips, gaslighting) immediately?',
      textAr: 'هل ترصد سلوكيات التلاعب (مثل لوم الذات، الإنكار والتشكيك في الواقع) فوراً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-7',
      text: 'Can you walk away from conversations that turn into gossip or negativity?',
      textAr: 'هل يمكنك مغادرة الحوارات التي تتحول إلى نميمة أو طاقة سلبية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-8',
      text: 'Do you avoid keeping score of past grievances in your relationships?',
      textAr: 'هل تتجنب تصفية الحسابات وتسجيل أخطاء الماضي في علاقاتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-9',
      text: 'Do you reject requests that make you feel uncomfortable or taken advantage of?',
      textAr: 'هل ترفض الطلبات التي تجعلك تشعر بعدم الارتياح أو بالاستغلال؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-10',
      text: 'Are you conscious of codependent patterns where you feel responsible for fixing others?',
      textAr: 'هل أنت واعٍ بأنماط الاعتمادية المتبادلة حيث تشعر بالمسؤولية عن إصلاح شؤون الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-11',
      text: 'Do you speak up constructively when someone treats you with disrespect?',
      textAr: 'هل تتحدث بشكل بناء وجريء عندما يعاملك شخص ما بعدم احترام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'tox-12',
      text: 'Do you actively surround yourself with supportive, positive-minded individuals?',
      textAr: 'هل تحيط نفسك بنشاط بأشخاص داعمين وذوي تفكير إيجابي؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 22. Leadership (15 Questions)
  leadership: [
    {
      id: 'lead-1',
      text: 'Do you naturally step forward to take responsibility for group decisions?',
      textAr: 'هل تتقدم بشكل طبيعي لتحمل المسؤولية عن قرارات المجموعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-2',
      text: 'How well can you motivate and inspire others to achieve a shared vision?',
      textAr: 'ما مدى قدرتك على تحفيز وإلهام الآخرين لتحقيق رؤية مشتركة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-3',
      text: 'Are you comfortable delegating key tasks and trusting team members?',
      textAr: 'هل تشعر بالراحة في تفويض المهام الرئيسية والثقة في أعضاء الفريق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-4',
      text: 'How constructively do you handle conflict or performance issues within a team?',
      textAr: 'كيف تتعامل بشكل بناء مع النزاعات أو مشكلات الأداء داخل الفريق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-5',
      text: 'Do you actively seek and encourage diverse viewpoints before making a choice?',
      textAr: 'هل تبحث بنشاط وتشجع وجهات النظر المتنوعة قبل اتخاذ القرار؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-6',
      text: 'Do you provide clear, constructive feedback that helps others grow?',
      textAr: 'هل تقدم ملاحظات واضحة وبناءة تساعد الآخرين على التطور؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-7',
      text: 'Can you remain calm and lead others through high-stress crises?',
      textAr: 'هل يمكنك الحفاظ على هدوئك وقيادة الآخرين خلال الأزمات والضغوط الشديدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-8',
      text: 'Do you actively mentor or coach team members to reach their potential?',
      textAr: 'هل تقوم بنشاط بتوجيه وتدريب أعضاء الفريق للوصول إلى كامل إمكانياتهم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-9',
      text: 'Do you lead by example, maintaining high standards of work ethic?',
      textAr: 'هل تقود بالقدوة، محافظاً على معايير عالية لأخلاقيات العمل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-10',
      text: 'Are you transparent in your communication, building trust across the group?',
      textAr: 'هل أنت شفاف في تواصلك، مما يبني الثقة والاطمئنان لدى المجموعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-11',
      text: 'Do you make tough decisions in a timely manner even when they are unpopular?',
      textAr: 'هل تتخذ القرارات الصعبة في الوقت المناسب حتى عندما تكون غير محبوبة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-12',
      text: 'Do you celebrate team achievements and give credit where it is due?',
      textAr: 'هل تحتفل بإنجازات الفريق وتنسب الفضل والمجهود إلى أصحابه؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-13',
      text: 'Do you take personal accountability when your team fails to meet goals?',
      textAr: 'هل تتحمل المسؤولية الشخصية والمساءلة عندما يفشل فريقك في تحقيق الأهداف؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-14',
      text: 'How open are you to feedback on your own leadership style?',
      textAr: 'ما مدى انفتاحك على تلقي الملاحظات والنقد حول أسلوبك في القيادة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'lead-15',
      text: 'Do you align your team\'s activities with the overall organization strategies?',
      textAr: 'هل توازن بين أنشطة فريقك والاستراتيجيات العامة للمؤسسة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 23. Trauma (15 Questions)
  trauma: [
    {
      id: 'trm-1',
      text: 'Do you feel calm and react rationally when someone is upset with you?',
      textAr: 'هل تشعر بالهدوء وتتفاعل بعقلانية عندما يكون شخص ما غاضباً منك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-2',
      text: 'Is it easy for you to say "no" and enforce personal boundaries?',
      textAr: 'هل من السهل عليك قول "لا" وفرض حدودك الشخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-3',
      text: 'Do you feel physically relaxed and safe in unfamiliar surroundings?',
      textAr: 'هل تشعر بالاسترخاء الجسدي والأمان في البيئات غير المألوفة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-4',
      text: 'Can you handle criticism without feeling a sudden surge of shame or anger?',
      textAr: 'هل يمكنك التعامل مع النقد دون الشعور بموجة مفاجئة من الخجل أو الغضب؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-5',
      text: 'Do you feel secure in relationships without constantly pleasing others to avoid rejection?',
      textAr: 'هل تشعر بالأمان في العلاقات دون إرضاء الآخرين باستمرار لتجنب الرفض؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-6',
      text: 'Do you use breathing or somatic mindfulness to calm sudden nervous activation?',
      textAr: 'هل تستخدم التنفس أو اليقظة الجسدية لتهدئة استثارة جهازك العصبي المفاجئة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-7',
      text: 'Can you identify specific emotional triggers and why they cause strong reactions?',
      textAr: 'هل يمكنك تحديد انفعالاتك العاطفية المحددة ولماذا تسبب ردود أفعال قوية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-8',
      text: 'Do you feel comfortable in your own skin and safely present in your body?',
      textAr: 'هل تشعر بالارتياح والانسجام والوجود الآمن داخل جسدك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-9',
      text: 'How rarely do you experience hyper-vigilance (constantly scanning for threats)?',
      textAr: 'ما مدى ندرة شعورك بالحذر المفرط (مراقبة البيئة باستمرار بحثاً عن تهديدات)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-10',
      text: 'Are you comfortable sharing your vulnerabilities with people you trust?',
      textAr: 'هل تشعر بالراحة في مشاركة نقاط ضعفك ومخاوفك مع من تثق بهم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-11',
      text: 'Do you trust your own judgments and decisions without constant self-doubt?',
      textAr: 'هل تثق في أحكامك وقراراتك الخاصة دون شك ذاتي مستمر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-12',
      text: 'How easily do you release chronic physical tension (e.g., tight shoulders, jaw-clenching)?',
      textAr: 'ما مدى سهولة تخلصك من التوتر الجسدي المزمن (مثل تشنج الكتفين، إطباق الفك)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-13',
      text: 'Do you maintain flexible boundaries, allowing intimacy while protecting your space?',
      textAr: 'هل تحافظ على حدود مرنة تسمح بالقرب العاطفي مع حماية مساحتك الخاصة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-14',
      text: 'Can you separate your past painful events from current safe realities?',
      textAr: 'هل يمكنك فصل أحداث الماضي المؤلمة عن واقعك الآمن الحالي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-15',
      text: 'Do you actively seek support, healing methods, or therapies when needed?',
      textAr: 'هل تبحث بنشاط عن الدعم أو طرق التشافي أو الاستشارات النفسية عند الحاجة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 24. Communication (12 Questions)
  communication: [
    {
      id: 'comm-1',
      text: 'Do you express your thoughts clearly, assertively, and concisely?',
      textAr: 'هل تعبر عن أفكارك بوضوح وحزم وإيجاز؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-2',
      text: 'How well do you adapt your dialogue style to match different personalities?',
      textAr: 'ما مدى قدرتك على تكييف أسلوب حوارك ليتناسب مع الشخصيات المختلفة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-3',
      text: 'Do you encourage others to express themselves fully without interruption?',
      textAr: 'هل تشجع الآخرين على التعبير عن أنفسهم بالكامل دون مقاطعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-4',
      text: 'Do you comfortably handle difficult, high-stakes, or emotional conversations?',
      textAr: 'هل تتعامل براحة مع المحادثات الصعبة أو الحساسة أو العاطفية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-5',
      text: 'How active are you in seeking clarity and checking alignment during discussions?',
      textAr: 'ما مدى نشاطك في السعي للوضوح والتحقق من التوافق أثناء المناقشات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-6',
      text: 'Does your body language and tone of voice align with your spoken message?',
      textAr: 'هل تتوافق لغة جسدك ونبرة صوتك مع الرسالة التي تعبر عنها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-7',
      text: 'Do you formulate written communications (emails, text messages) with clarity and structure?',
      textAr: 'هل تصيغ اتصالاتك المكتوبة (رسائل البريد، الرسائل النصية) بوضوح وتنظيم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-8',
      text: 'Do you offer feedback in a constructive way without causing defensive reactions?',
      textAr: 'هل تقدم ملاحظاتك ونقدك بطريقة بناءة لا تسبب ردود أفعال دفاعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-9',
      text: 'Do you ask open-ended questions to invite deeper responses and insights?',
      textAr: 'هل تطرح أسئلة مفتوحة لدعوة الآخرين لتقديم ردود ورؤى أعمق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-10',
      text: 'How consistently do you regulate your tone of voice when you feel angry or upset?',
      textAr: 'ما مدى انتظامك في ضبط نبرة صوتك عندما تشعر بالغضب أو الانزعاج؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-11',
      text: 'Are you confident in presenting your ideas or speaking in front of an audience?',
      textAr: 'هل تشعر بالثقة عند عرض أفكارك أو التحدث أمام الجمهور؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'comm-12',
      text: 'Do you notice and respond appropriately to non-verbal cues from others?',
      textAr: 'هل تلاحظ الإشارات غير اللفظية من الآخرين وتستجيب لها بشكل مناسب؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 25. Growth Velocity (12 Questions)
  'growth-velocity': [
    {
      id: 'vel-1',
      text: 'Do you actively seek feedback to accelerate your learning?',
      textAr: 'هل تبحث بنشاط عن الملاحظات لتسريع تعلمك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-2',
      text: 'Do you set high-stretch goals that push you outside your comfort zone?',
      textAr: 'هل تضع أهدافاً طموحة تدفعك خارج منطقة راحتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-3',
      text: 'How quickly do you adopt new skills or tools in your work?',
      textAr: 'ما مدى سرعتك في تبني مهارات أو أدوات جديدة في عملك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-4',
      text: 'Do you measure and analyze your personal growth metrics?',
      textAr: 'هل تقيس وتحلل مقاييس نموك الشخصي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-5',
      text: 'Do you believe your capacity for growth is limitless (growth mindset)?',
      textAr: 'هل تعتقد أن قدرتك على النمو غير محدودة (عقلية النمو)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-6',
      text: 'Do you experiment with new learning methods to find what works best?',
      textAr: 'هل تجرب طرق تعلم جديدة لمعرفة ما هو الأكثر فعالية بالنسبة لك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-7',
      text: 'Do you view failures or mistakes as valuable lessons rather than personal setbacks?',
      textAr: 'هل تنظر إلى الإخفاقات أو الأخطاء كدروس قيمة بدلاً من نكسات شخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-8',
      text: 'Do you consume articles, books, or lectures related to development daily?',
      textAr: 'هل تقرأ مقالات أو كتباً أو تحضر محاضرات متعلقة بالتنمية الذاتية يومياً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-9',
      text: 'Do you dedicate structured hours weekly solely to skill development?',
      textAr: 'هل تخصص ساعات منظمة أسبوعياً لتطوير مهاراتك فقط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-10',
      text: 'Do you seek mentorship or learn from individuals who are ahead of you?',
      textAr: 'هل تبحث عن توجيه أو تتعلم من أشخاص يسبقونك في مجالك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-11',
      text: 'Do you track the speed at which you learn and adjust your methods accordingly?',
      textAr: 'هل تتتبع السرعة التي تتعلم بها وتعدل أساليبك بناءً على ذلك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'vel-12',
      text: 'Do you apply the knowledge you acquire immediately in real-world scenarios?',
      textAr: 'هل تطبق المعرفة التي تكتسبها فوراً في سيناريوهات وتطبيقات واقعية؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // 26. DNA Sync (10 Questions)
  'dna-sync': [
    {
      id: 'sync-1',
      text: 'Do you align your daily activities with your core biological energy levels?',
      textAr: 'هل توازن بين أنشطتك اليومية ومستويات طاقتك الحيوية الأساسية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-2',
      text: 'Do you feel your thoughts, words, and actions are fully synchronized?',
      textAr: 'هل تشعر أن أفكارك وكلماتك وأفعالك متزامنة بالكامل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-3',
      text: 'How regularly do you review your overall life path and alignment?',
      textAr: 'ما مدى انتظامك في مراجعة مسار حياتك العام وتوافقك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-4',
      text: 'Do you adjust your environment to support your fundamental personality traits?',
      textAr: 'هل تضبط بيئتك لدعم سمات شخصيتك الأساسية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-5',
      text: 'Do you feel a sense of complete integrity and unity in your identity?',
      textAr: 'هل تشعر بالنزاهة والوحدة الكاملة في هويتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-6',
      text: 'Do you communicate and act authentically without trying to please others?',
      textAr: 'هل تتواصل وتتصرف بصدق وأصالة دون محاولة التودد أو إرضاء الآخرين على حساب نفسك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-7',
      text: 'Do you let go of social pressure and expectations that do not fit your values?',
      textAr: 'هل تتجاهل الضغوط الاجتماعية والتوقعات التي لا تتماشى مع قيمك الشخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-8',
      text: 'Are you working towards goals that represent self-actualization for you?',
      textAr: 'هل تعمل على تحقيق أهداف تمثل تحقيقاً ذاتياً حقيقياً بالنسبة لك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-9',
      text: 'Do you design your daily schedule to accommodate your personal values and goals?',
      textAr: 'هل تصمم جدولك اليومي ليتسع ويخدم قيمك وأهدافك الشخصية العميقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'sync-10',
      text: 'Do you feel that your choices are guided by a strong inner compass and intuition?',
      textAr: 'هل تشعر أن خياراتك موجهة ببوصلة داخلية قوية وحدس صادق؟',
      options: DEFAULT_OPTIONS
    }
  ],

  // LEGACY ALIASES FOR SAFETY
  self_esteem: [
    {
      id: 'esteem-1',
      text: 'Do you generally feel satisfied and secure with who you are?',
      textAr: 'هل تشعر عموماً بالرضا والأمان تجاه هويتك وشخصيتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-2',
      text: 'How rarely do you feel like a failure compared to your peers?',
      textAr: 'ما مدى ندرة شعورك بالفشل مقارنة بأقرانك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-3',
      text: 'Do you have a fundamentally positive and respectful attitude toward yourself?',
      textAr: 'هل لديك موقف إيجابي ومحترم أساسي تجاه نفسك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-4',
      text: 'How independent is your self-worth from other people\'s criticism?',
      textAr: 'ما مدى استقلالية تقديرك لذاتك عن انتقادات الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-5',
      text: 'Do you value your contribution to your workplace or community?',
      textAr: 'هل تقدر مساهمتك في مكان عملك أو مجتمعك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-6',
      text: 'Do you accept your physical appearance and body image without persistent anxiety?',
      textAr: 'هل تتقبل مظهرك الخارجي وصورة جسدك دون قلق مستمر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-7',
      text: 'How easily do you forgive yourself when you make a major mistake?',
      textAr: 'ما مدى سهولة مسامحتك لنفسك عندما ترتكب خطأ كبيراً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-8',
      text: 'Do you confidently assert your limits when others push too much?',
      textAr: 'هل تفرض حدودك بثقة عندما يضغط الآخرون عليك بشكل مفرط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-9',
      text: 'Do you believe in your capacity to learn, adapt, and build a positive future?',
      textAr: 'هل تؤمن بقدرتك على التعلم والتكيف وبناء مستقبل إيجابي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-10',
      text: 'Do you avoid people-pleasing behaviors that run counter to your values?',
      textAr: 'هل تتجنب سلوكيات إرضاء الآخرين التي تتعارض مع قيمك الخاصة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-11',
      text: 'Do you validate your own efforts and progress, regardless of external output?',
      textAr: 'هل تثبت وتقدر جهودك وتقدمك الشخصي بغض النظر عن النتائج الخارجية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-12',
      text: 'Does your self-esteem remain stable even when a key relationship fails?',
      textAr: 'هل يظل تقديرك لذاتك مستقراً حتى عندما تفشل علاقة أساسية في حياتك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-13',
      text: 'Do you feel you deserve professional success and fair compensation?',
      textAr: 'هل تشعر أنك تستحق النجاح المهني والتعويض المالي العادل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-14',
      text: 'Do you reject thoughts of self-sabotage when things are going well?',
      textAr: 'هل ترفض أفكار التدمير الذاتي عندما تسير الأمور على ما يرام؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'esteem-15',
      text: 'Do you have a clear sense of personal purpose that anchors your identity?',
      textAr: 'هل لديك شعور واضح بالهدف الشخصي الذي يرسخ هويتك؟',
      options: DEFAULT_OPTIONS
    }
  ],

  social_anxiety: [
    {
      id: 'anx-1',
      text: 'Do you feel calm and relaxed when meeting new people or attending social events?',
      textAr: 'هل تشعر بالهدوء والاسترخاء عند مقابلة أشخاص جدد أو حضور مناسبات اجتماعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-2',
      text: 'Do you comfortably speak in front of groups without intense worry?',
      textAr: 'هل تتحدث بارتياح أمام المجموعات دون قلق شديد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-3',
      text: 'How rarely do you worry about being judged, rejected, or embarrassed by others?',
      textAr: 'ما مدى ندرة قلقك من أن يحكم عليك الآخرون، أو يرفضوك، أو يحرجوك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-4',
      text: 'Do you feel comfortable being the center of attention in social situations?',
      textAr: 'هل تشعر بالراحة لكونك مركز الاهتمام في المواقف الاجتماعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-5',
      text: 'Do you easily let go of social interactions instead of over-analyzing them afterward?',
      textAr: 'هل تتجاوز التفاعلات الاجتماعية بسهولة بدلاً من الإفراط في تحليلها بعد انتهائها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-6',
      text: 'Can you start a chat with a stranger without experiencing physical symptoms of anxiety?',
      textAr: 'هل يمكنك بدء حديث مع شخص غريب دون أن تشعر بأعراض جسدية للقلق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-7',
      text: 'Do you feel comfortable asserting your opinions during a dynamic debate?',
      textAr: 'هل تشعر بالراحة في إبراز آرائك خلال نقاش تفاعلي حاد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-8',
      text: 'Do you comfortably ask questions in meetings or social gatherings?',
      textAr: 'هل تطرح الأسئلة بارتياح في الاجتماعات أو التجمعات الاجتماعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-9',
      text: 'Do you avoid staying away from social situations due to fear of failure or awkwardness?',
      textAr: 'هل تتجنب الابتعاد عن المواقف الاجتماعية خوفاً من الفشل أو الحرج؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-10',
      text: 'Can you laugh at yourself when you make a minor mistake in public?',
      textAr: 'هل يمكنك الضحك على نفسك عندما ترتكب خطأ بسيطاً أمام الآخرين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-11',
      text: 'Do you feel secure that other people generally accept and respect you?',
      textAr: 'هل تشعر بالاطمئنان واليقين بأن الآخرين يقبلونك ويحترمونك عموماً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'anx-12',
      text: 'Do you comfortably make eye contact with everyone you interact with?',
      textAr: 'هل تنظر بارتياح في أعين كل من تتفاعل وتتحاور معه؟',
      options: DEFAULT_OPTIONS
    }
  ],

  overthinking: [
    {
      id: 'othk-1',
      text: 'Can you easily stop analyzing past decisions or regrets?',
      textAr: 'هل يمكنك بسهولة التوقف عن تحليل القرارات السابقة أو الندم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-2',
      text: 'Do you fall asleep quickly without repetitive loops of worry about the future?',
      textAr: 'هل تنام سريعاً دون حلقات متكررة من القلق بشأن المستقبل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-3',
      text: 'How easily do you make simple, day-to-day choices without hesitation?',
      textAr: 'ما مدى سهولة اتخاذك للخيارات اليومية البسيطة دون تردد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-4',
      text: 'Do you avoid creating worst-case scenarios for minor problems?',
      textAr: 'هل تتجنب خلق سيناريوهات لأسوأ الحالات للمشاكل البسيطة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-5',
      text: 'Can you easily direct your focus away from racing or anxious thoughts?',
      textAr: 'هل يمكنك بسهولة توجيه تركيزك بعيداً عن الأفكار المتسارعة أو القلقة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-6',
      text: 'Do you find that brainstorming solutions replaces worrying about problems?',
      textAr: 'هل تجد أن التفكير في الحلول يحل محل القلق والشكوى بشأن المشكلات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-7',
      text: 'How rarely do you read into the hidden intentions of messages or comments?',
      textAr: 'ما مدى ندرة محاولتك للبحث عن نوايا خفية وراء الرسائل أو التعليقات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-8',
      text: 'Do you comfortably take quick actions rather than seeking perfect certainty?',
      textAr: 'هل تتخذ إجراءات سريعة بارتياح بدلاً من البحث المستمر عن اليقين المطلق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-9',
      text: 'Do you feel at ease when you don\'t have full information about a future event?',
      textAr: 'هل تشعر بالارتياح والهدوء عندما لا تملك معلومات كاملة عن حدث مستقبلي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-10',
      text: 'Can you shut down mental discussions and focus on physical sensations instead?',
      textAr: 'هل يمكنك إيقاف النقاشات الذهنية والتركيز على الأحاسيس الجسدية بدلاً منها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-11',
      text: 'Do you avoid replaying conversations in your head long after they have ended?',
      textAr: 'هل تتجنب إعادة تشغيل وسماع المحادثات في رأسك لفترة طويلة بعد انتهائها؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-12',
      text: 'Do you practice techniques to clear your cognitive cache of minor daily stressors?',
      textAr: 'هل تمارس تقنيات لتفريغ ذاكرة التخزين الذهنية من الضغوط اليومية الصغيرة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-13',
      text: 'How quickly do you catch yourself over-analyzing and return to action?',
      textAr: 'ما مدى سرعتك في اكتشاف نفسك أثناء الإفراط في التحليل والعودة للعمل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-14',
      text: 'Do you feel you can trust your initial instinct or decision?',
      textAr: 'هل تشعر أنه يمكنك الوثوق بغريزتك الأولى أو قرارك الأولي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'othk-15',
      text: 'Do you let go of things that did not turn out as you planned?',
      textAr: 'هل تتقبل وتتجاوز الأمور التي لم تسر تماماً كما خططت لها؟',
      options: DEFAULT_OPTIONS
    }
  ],

  attachment: [
    {
      id: 'att-1',
      text: 'Do you find it easy to trust and depend on your close partners?',
      textAr: 'هل تجد من السهل الثقة والاعتماد على شركائك المقربين؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-2',
      text: 'Do you feel secure in your relations without worrying about abandonment?',
      textAr: 'هل تشعر بالأمان في علاقاتك دون القلق من الهجر أو الابتعاد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-3',
      text: 'Are you comfortable sharing your deepest vulnerabilities and feelings?',
      textAr: 'هل تشعر بالراحة في مشاركة أعمق نقاط ضعفك ومشاعرك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-4',
      text: 'Do you feel comfortable when partners need emotional closeness or intimacy?',
      textAr: 'هل تشعر بالراحة عندما يحتاج الشركاء إلى القرب العاطفي أو الحميمية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-5',
      text: 'Do you maintain healthy boundaries without pushing others away?',
      textAr: 'هل تحافظ على حدود صحية دون إبعاد الآخرين عنك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-6',
      text: 'Do you avoid testing your partner\'s commitment through actions or drama?',
      textAr: 'هل تتجنب اختبار التزام شريكك من خلال الأفعال المصطنعة أو إثارة المشاكل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-7',
      text: 'Can you handle temporary distance or absence without feeling panic or anxiety?',
      textAr: 'هل يمكنك التعامل مع البعد أو الغياب المؤقت دون الشعور بالذعر أو القلق؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-8',
      text: 'Do you feel you are worthy of love and close relationships just as you are?',
      textAr: 'هل تشعر أنك تستحق الحب والعلاقات الوثيقة كما أنت تماماً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-9',
      text: 'Do you support your partner\'s autonomy and independence without jealousy?',
      textAr: 'هل تدعم استقلالية شريكك وحريته الشخصية دون غيرة مفرطة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'att-10',
      text: 'Can you resolve relational conflicts through constructive and safe communication?',
      textAr: 'هل يمكنك حل النزاعات الزوجية أو العائلية من خلال التواصل البناء والآمن؟',
      options: DEFAULT_OPTIONS
    }
  ],

  personality_type: [
    {
      id: 'pt-1',
      text: 'Do you prefer logically structured frameworks over emotional values when solving a problem?',
      textAr: 'هل تفضل الأطر المنظمة منطقياً على القيم العاطفية عند حل مشكلة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-2',
      text: 'Do you gain clarity and energy from quiet introspection rather than social interaction?',
      textAr: 'هل تكتسب الوضوح والطاقة من التأمل الهادئ بدلاً من التفاعل الاجتماعي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-3',
      text: 'Do you feel more secure with planned schedules rather than leaving decisions open?',
      textAr: 'هل تشعر بمزيد من الأمان مع الجداول المخطط لها بدلاً من ترك القرارات مفتوحة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-4',
      text: 'Do you focus primarily on big-picture strategic visions rather than immediate detail execution?',
      textAr: 'هل تركز بشكل أساسي على الرؤى الاستراتيجية الكبيرة بدلاً من التنفيذ الفوري للتفاصيل؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-5',
      text: 'Do you resolve disputes using rational reasoning instead of personal connection?',
      textAr: 'هل تحل الخلافات باستخدام الاستدلال العقلاني بدلاً من الارتباط الشخصي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-6',
      text: 'Do you gather extensive facts and figures before coming to a decision?',
      textAr: 'هل تجمع الكثير من الحقائق والأرقام قبل الوصول إلى قرار ما؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-7',
      text: 'How often do you seek out new ideas, structures, and theoretical models?',
      textAr: 'كم مرة تبحث فيها عن أفكار وهياكل ونماذج نظرية جديدة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-8',
      text: 'Do you prefer to plan your vacation details in advance rather than being spontaneous?',
      textAr: 'هل تفضل التخطيط لتفاصيل عطلتك مسبقاً بدلاً من العفوية التامة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-9',
      text: 'Do you find energy in debating complex concepts even if no clear solution exists?',
      textAr: 'هل تجد طاقة وحيوية في مناقشة المفاهيم المعقدة حتى لو لم يكن هناك حل واضح؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'pt-10',
      text: 'Do you maintain an orderly, organized environment at home or work?',
      textAr: 'هل تحافظ على بيئة مرتبة ومنظمة للغاية في المنزل أو العمل؟',
      options: DEFAULT_OPTIONS
    }
  ],

  stress_resistance: [
    {
      id: 'strs-1',
      text: 'Do you stay calm and centered when plans fall apart unexpectedly?',
      textAr: 'هل تظل هادئاً ومتماسكاً عندما تنهار الخطط بشكل غير متوقع؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-2',
      text: 'Can you think clearly and make decisive choices in high-stress situations?',
      textAr: 'هل يمكنك التفكير بوضوح واتخاذ خيارات حاسمة في المواقف شديدة التوتر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-3',
      text: 'Do you bounce back quickly without lingering physical tension after pressure?',
      textAr: 'هل تتعافى بسرعة دون استمرار التوتر الجسدي بعد زوال الضغط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-4',
      text: 'Do you rely on breathing, meditation, or coping mechanisms when stressed?',
      textAr: 'هل تعتمد على التنفس أو التأمل أو آليات التكيف عند الشعور بالضغط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-5',
      text: 'Do you look at unpredictable events as opportunities to test yourself?',
      textAr: 'هل تنظر إلى الأحداث غير المتوقعة كفرص لاختبار نفسك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-6',
      text: 'Do you keep a perspective, knowing that difficult moments are temporary?',
      textAr: 'هل تحتفظ برؤية متزنة، مع علمك بأن اللحظات الصعبة مؤقتة وستزول؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-7',
      text: 'How rarely do you experience panic attacks or physical shakes during crises?',
      textAr: 'ما مدى ندرة تعرضك لنوبات ذعر أو ارتجاف جسدي أثناء الأزمات؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-8',
      text: 'Do you make decisions based on logical calculation rather than fear under pressure?',
      textAr: 'هل تتخذ قراراتك بناءً على حسابات منطقية بدلاً من الخوف عندما تكون تحت الضغط؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-9',
      text: 'Can you compartmentalize issues so that work stress doesn\'t ruin your evening?',
      textAr: 'هل يمكنك تجزئة مشاكلك بحيث لا يفسد ضغط العمل أوقاتك المسائية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-10',
      text: 'Do you maintain supportive friendships to help cushion unexpected emotional shocks?',
      textAr: 'هل تحافظ على علاقات صداقة داعمة للمساعدة في تخفيف الصدمات العاطفية غير المتوقعة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-11',
      text: 'How easily do you fall asleep even after a highly stressful or demanding day?',
      textAr: 'ما مدى سهولة نومك حتى بعد يوم حافل بالضغوط أو المتطلبات العالية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'strs-12',
      text: 'Do you view criticism as constructive information rather than a threat to your stability?',
      textAr: 'هل تنظر للنقد كمعلومات بناءة تفيدك بدلاً من اعتباره تهديداً لاستقرارك؟',
      options: DEFAULT_OPTIONS
    }
  ],

  trauma_pattern: [
    {
      id: 'trm-1',
      text: 'Do you feel calm and react rationally when someone is upset with you?',
      textAr: 'هل تشعر بالهدوء وتتفاعل بعقلانية عندما يكون شخص ما غاضباً منك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-2',
      text: 'Is it easy for you to say "no" and enforce personal boundaries?',
      textAr: 'هل من السهل عليك قول "لا" وفرض حدودك الشخصية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-3',
      text: 'Do you feel physically relaxed and safe in unfamiliar surroundings?',
      textAr: 'هل تشعر بالاسترخاء الجسدي والأمان في البيئات غير المألوفة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-4',
      text: 'Can you handle criticism without feeling a sudden surge of shame or anger?',
      textAr: 'هل يمكنك التعامل مع النقد دون الشعور بموجة مفاجئة من الخجل أو الغضب؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-5',
      text: 'Do you feel secure in relationships without constantly pleasing others to avoid rejection?',
      textAr: 'هل تشعر بالأمان في العلاقات دون إرضاء الآخرين باستمرار لتجنب الرفض؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-6',
      text: 'Do you use breathing or somatic mindfulness to calm sudden nervous activation?',
      textAr: 'هل تستخدم التنفس أو اليقظة الجسدية لتهدئة استثارة جهازك العصبي المفاجئة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-7',
      text: 'Can you identify specific emotional triggers and why they cause strong reactions?',
      textAr: 'هل يمكنك تحديد انفعالاتك العاطفية المحددة ولماذا تسبب ردود أفعال قوية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-8',
      text: 'Do you feel comfortable in your own skin and safely present in your body?',
      textAr: 'هل تشعر بالارتياح والانسجام والوجود الآمن داخل جسدك؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-9',
      text: 'How rarely do you experience hyper-vigilance (constantly scanning for threats)?',
      textAr: 'ما مدى ندرة شعورك بالحذر المفرط (مراقبة البيئة باستمرار بحثاً عن تهديدات)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-10',
      text: 'Are you comfortable sharing your vulnerabilities with people you trust?',
      textAr: 'هل تشعر بالراحة في مشاركة نقاط ضعفك ومخاوفك مع من تثق بهم؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-11',
      text: 'Do you trust your own judgments and decisions without constant self-doubt?',
      textAr: 'هل تثق في أحكامك وقراراتك الخاصة دون شك ذاتي مستمر؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-12',
      text: 'How easily do you release chronic physical tension (e.g., tight shoulders, jaw-clenching)?',
      textAr: 'ما مدى سهولة تخلصك من التوتر الجسدي المزمن (مثل تشنج الكتفين، إطباق الفك)؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-13',
      text: 'Do you maintain flexible boundaries, allowing intimacy while protecting your space?',
      textAr: 'هل تحافظ على حدود مرنة تسمح بالقرب العاطفي مع حماية مساحتك الخاصة؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-14',
      text: 'Can you separate your past painful events from current safe realities?',
      textAr: 'هل يمكنك فصل أحداث الماضي المؤلمة عن واقعك الآمن الحالي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'trm-15',
      text: 'Do you actively seek support, healing methods, or therapies when needed?',
      textAr: 'هل تبحث بنشاط عن الدعم أو طرق التشافي أو الاستشارات النفسية عند الحاجة؟',
      options: DEFAULT_OPTIONS
    }
  ],

  emotional_maturity: [
    {
      id: 'mat-1',
      text: 'Can you easily take full responsibility for mistakes without defensiveness?',
      textAr: 'هل يمكنك بسهولة تحمل المسؤولية الكاملة عن الأخطاء دون دفاعية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-2',
      text: 'Do you accept constructive feedback without taking it personally?',
      textAr: 'هل تقبل التعليقات البناءة دون أخذها بشكل شخصي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-3',
      text: 'Are you able to delay gratification for the sake of long-term goals?',
      textAr: 'هل يمكنك تأجيل الإشباع الفوري من أجل تحقيق أهداف طويلة المدى؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-4',
      text: 'Do you resolve arguments through calm communication instead of emotional outbursts?',
      textAr: 'هل تحل الخلافات من خلال التواصل الهادئ بدلاً من الانفجارات العاطفية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-5',
      text: 'Do you respect opinions that differ from yours without feeling threatened?',
      textAr: 'هل تحترم الآراء التي تختلف عن آرائك دون الشعور بالتهديد؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-6',
      text: 'Do you avoid blame games and focus entirely on solution mapping?',
      textAr: 'هل تتجنب أسلوب إلقاء اللوم وتركز بالكامل على رسم خريطة للحلول؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-7',
      text: 'Are you conscious of your projection patterns and correct them immediately?',
      textAr: 'هل أنت واعٍ بأنماط الإسقاط لديك وتقوم بتصحيحها فوراً؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-8',
      text: 'Do you acknowledge others\' feelings and contributions even when they disagree with you?',
      textAr: 'هل تعترف بمشاعر الآخرين ومساهماتهم حتى لو اختلفوا معك في الرأي؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-9',
      text: 'How stably do you maintain your commitments regardless of your emotional spikes?',
      textAr: 'ما مدى استقرارك في الحفاظ على التزاماتك بغض النظر عن تقلباتك العاطفية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-10',
      text: 'Do you recognize your personal needs and communicate them assertively and calmly?',
      textAr: 'هل تتعرف على احتياجاتك الشخصية وتعبر عنها بوضوح وحسم وهدوء؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-11',
      text: 'Can you comfortably say "I don\'t know" when you lack information or expertise?',
      textAr: 'هل تقول بارتياح "لا أعلم" عندما تفتقر إلى المعلومات أو الخبرة الكافية؟',
      options: DEFAULT_OPTIONS
    },
    {
      id: 'mat-12',
      text: 'Do you actively work to solve underlying character deficiencies rather than masking symptoms?',
      textAr: 'هل تعمل بنشاط على علاج نقاط الضعف الأساسية في شخصيتك بدلاً من إخفاء الأعراض؟',
      options: DEFAULT_OPTIONS
    }
  ]
};
