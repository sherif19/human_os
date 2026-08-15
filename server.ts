import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Health check endpoint for cloud deployment monitors
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

// Load Firebase Config
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
);

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Helper to resolve AI configuration dynamically for a tenant
async function getTenantAIConfig(adminId?: string) {
  let geminiApiKey = process.env.GEMINI_API_KEY || "";
  let openaiApiKey = process.env.OPENAI_API_KEY || "";
  let aiProvider = "gemini";

  if (adminId) {
    try {
      const docRef = doc(db, "tenants", adminId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tenantData = docSnap.data();
        if (tenantData?.geminiApiKey) {
          geminiApiKey = tenantData.geminiApiKey;
        }
        if (tenantData?.openaiApiKey) {
          openaiApiKey = tenantData.openaiApiKey;
        }
        if (tenantData?.aiProvider) {
          aiProvider = tenantData.aiProvider;
        }
      }
    } catch (error) {
      console.error("Error fetching tenant AI config:", error);
    }
  }

  return { geminiApiKey, openaiApiKey, aiProvider };
}

// Helper to call OpenAI API using global fetch
async function callOpenAI(apiKey: string, messages: any[], systemInstruction?: string, jsonMode = false) {
  const formattedMessages: any[] = [];
  if (systemInstruction) {
    formattedMessages.push({ role: "system", content: systemInstruction });
  }
  formattedMessages.push(...messages);

  const requestBody: any = {
    model: "gpt-4o-mini",
    messages: formattedMessages,
    temperature: 0.7,
  };
  if (jsonMode) {
    requestBody.response_format = { type: "json_object" };
  }

  const response = await (globalThis as any).fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API request failed: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Helper function to calculate psychometric traits locally if AI is unavailable or unconfigured
function generateLocalPersonalityReport(answers: any, context: any) {
  const currentScores = context?.currentScores || {
    confidence: 65,
    discipline: 48,
    emotional: 75,
    charisma: 50,
    leadership: 60,
    selfWorth: 55,
    consistency: 45,
    focus: 85,
    social: 40,
    empathy: 70
  };

  const metrics = [
    { key: 'confidence', label: 'Confidence', score: currentScores.confidence },
    { key: 'discipline', label: 'Discipline', score: currentScores.discipline },
    { key: 'emotional', label: 'EQ', score: currentScores.emotional },
    { key: 'charisma', label: 'Charisma', score: currentScores.charisma },
    { key: 'leadership', label: 'Leadership', score: currentScores.leadership },
    { key: 'selfWorth', label: 'Self Worth', score: currentScores.selfWorth },
    { key: 'consistency', label: 'Consistency', score: currentScores.consistency },
    { key: 'focus', label: 'Focus', score: currentScores.focus },
    { key: 'social', label: 'Social Energy', score: currentScores.social },
    { key: 'empathy', label: 'Resilience', score: currentScores.empathy }
  ];

  const sortedMetrics = [...metrics].sort((a, b) => b.score - a.score);
  const highest = sortedMetrics[0];
  const secondHighest = sortedMetrics[1];
  const lowest = sortedMetrics[metrics.length - 1];
  const secondLowest = sortedMetrics[metrics.length - 2];
  const thirdLowest = sortedMetrics[metrics.length - 3];

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
    archetypeAr = 'المفكر المستقل';
  } else if ((hKey1 === 'consistency' && hKey2 === 'discipline') || (hKey1 === 'discipline' && hKey2 === 'consistency')) {
    archetype = 'The Anchor';
    archetypeAr = 'المحرك الثابت';
  }

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

  const strengths = sortedMetrics.slice(0, 3).map(m => strengthMapEn[m.key]);
  const strengthsAr = sortedMetrics.slice(0, 3).map(m => strengthMapAr[m.key]);
  const weaknesses = [lowest, secondLowest, thirdLowest].map(m => weaknessMapEn[m.key]);
  const weaknessesAr = [lowest, secondLowest, thirdLowest].map(m => weaknessMapAr[m.key]);

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

  let growthProtocol = '"Phase I focus should be on Cognitive Integration. Balance focus with planned recovery."';
  let growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على التكامل المعرفي. وازن بين التركيز ودورات الاستشفاء المخططة."';

  if (lowest.key === 'empathy' || lowest.key === 'social') {
    growthProtocol = '"Phase I focus should be on Social Fluidity. Your current dominance is high-performing in isolation but benefit from active collaborative neural streams."';
    growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على السيولة الاجتماعية. سيادتك الحالية عالية الأداء في العزلة ولكنها تحتاج إلى تيارات عصبية تعاونية."';
  } else if (lowest.key === 'discipline') {
    growthProtocol = '"Phase I focus should be on Baseline Consistency. Build daily micro-habits before increasing difficulty."';
    growthProtocolAr = '"يجب أن يكون تركيز المرحلة الأولى على الاتساق الأساسي. ابنِ عادات صغيرة يومية قبل زيادة الصعوبة التدريجية."';
  }

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
    insight,
    insightAr,
    strengths,
    strengthsAr,
    weaknesses,
    weaknessesAr,
    growthPath: [growthProtocol],
    growthPathAr: [growthProtocolAr],
    recommendations: [protocol01, protocol02],
    recommendationsAr: [protocol01Ar, protocol02Ar]
  };
}

// Personality DNA Analysis Endpoint
app.post("/api/ai/analyze-personality", async (req, res) => {
  try {
    const { answers, context, memory, adminId } = req.body;
    
    const prompt = `
      As a multidisciplinary expert team (consisting of a Clinical Psychologist, Behavioral Analyst, Life Coach, and Mindset Mentor), analyze these assessment answers:
      ${JSON.stringify(answers)}
      
      User Context: ${JSON.stringify(context)}
      Previous AI Memory: ${JSON.stringify(memory)}
      
      Your goal is to decode the user's "Personality DNA" into a high-density intelligence report. 
      Avoid all generic motivational language. Be specific, clinical yet empathetic, and brutally honest where necessary for growth.
      
      Provide all fields in both English and Arabic so the UI can toggle languages seamlessly.
      
      Format the response in JSON:
      {
        "archetype": "A creative and distinct name for their personality pattern in English (e.g., 'The Relentless Optimizer', 'The Guarded Visionary')",
        "archetypeAr": "Arabic translation of the archetype",
        "insight": "A 1-2 sentence clinical insight in English (e.g., 'System analysis detects a recurring avoidance pattern during social conflicts.')",
        "insightAr": "Arabic translation of the insight",
        "scores": { 
          "confidence": number, 
          "discipline": number, 
          "eq": number, 
          "charisma": number, 
          "leadership": number, 
          "focus": number, 
          "selfWorth": number, 
          "socialEnergy": number, 
          "consistency": number,
          "resilience": number
        },
        "strengths": ["list 3-5 very specific high-performing behaviors detected in English"],
        "strengthsAr": ["Arabic translation of the strengths"],
        "weaknesses": ["list 3-5 specific psychological friction points or avoidance patterns in English"],
        "weaknessesAr": ["Arabic translation of the weaknesses"],
        "hiddenPatterns": ["Describe 2-3 'under the radar' behaviors the AI detected in the data in English (e.g., 'Your tendency to use logic to avoid emotional discomfort')"],
        "hiddenPatternsAr": ["Arabic translation of the hidden patterns"],
        "growthPath": ["A 3-step high-level protocol for the next 30 days in English"],
        "growthPathAr": ["Arabic translation of the growth path"],
        "recommendations": ["specific actionable tools or missions to initialize in English"],
        "recommendationsAr": ["Arabic translation of the recommendations"]
      }
      All scores should be between 0 and 100 based on the data provided.
    `;

    const aiConfig = await getTenantAIConfig(adminId);
    let resultText = "";
    let useFallback = false;

    // Check if we have a valid key for the chosen provider
    const hasKey = aiConfig.aiProvider === "openai" 
      ? !!aiConfig.openaiApiKey 
      : !!(aiConfig.geminiApiKey || process.env.GEMINI_API_KEY);

    if (!hasKey) {
      console.log("No API Key configured for the active AI provider, using local psychometric fallback");
      useFallback = true;
    } else {
      try {
        if (aiConfig.aiProvider === "openai" && aiConfig.openaiApiKey) {
          console.log(`Using OpenAI (GPT) for personality analysis (adminId: ${adminId})`);
          resultText = await callOpenAI(
            aiConfig.openaiApiKey,
            [{ role: "user", content: prompt }],
            "You are an expert psychology and behavioral analysis system.",
            true
          );
        } else {
          console.log(`Using Gemini for personality analysis (adminId: ${adminId})`);
          const genAIClient = new GoogleGenAI({
            apiKey: aiConfig.geminiApiKey || process.env.GEMINI_API_KEY || "",
            httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
          });
          const result = await genAIClient.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ parts: [{ text: prompt }] }],
            config: { responseMimeType: "application/json" }
          });
          resultText = result.text || "{}";
        }
      } catch (error) {
        console.error("AI API call failed, falling back to local algorithm:", error);
        useFallback = true;
      }
    }

    if (useFallback) {
      const fallbackReport = generateLocalPersonalityReport(answers, context);
      res.json(fallbackReport);
    } else {
      res.json(JSON.parse(resultText));
    }
  } catch (error: any) {
    console.error("Personality Analysis Endpoint Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Coaching Endpoint
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, mode, memory, personalityData, adminId } = req.body;
    
    const modes: Record<string, string> = {
      "Warm Therapist": "Embody a world-class Psychologist & Counselor. Focus on emotional validation, deep listening, and warm empathetic dialogue.",
      "Tough Coach": "Embody a high-performance Behavior Analyst & Hardcore Coach. Focus on raw accountability, zero excuses, and concrete action steps.",
      "Wise Mentor": "Embody a Strategic Mindset Mentor. Focus on long-term philosophy, meta-strategy, and wise tailored reflection.",
      "Best Friend": "Embody a loyal, relatable companion who understands internal struggles and speaks casually and warmly.",
      "Productivity Expert": "Embody a Systems Architect. Focus on focus optimization, habit systems, and high-efficiency output.",
    };

    const systemInstruction = `
      CURRENT PERSONA MODE: ${modes[mode] || modes["Wise Mentor"]}
      
      GLOBAL IDENTITY: You are the core Intelligence Mentor of HumanOS AI. You are engaged in a LIVE, DYNAMIC CONVERSATION with the user.
      
      CRITICAL DIALOGUE DIRECTIVES:
      1. REAL CONVERSATION: You are having an ongoing dialogue with the user. Read the entire conversation history carefully.
      2. NO REPETITIVE TEMPLATES: DO NOT start every response with rigid repeated headings like "# فهم التوتر" or "# استراتيجيات". Respond naturally, conversationally, and direct to the point.
      3. DIRECT REACTION TO USER: Address the user's EXACT message and emotion. If the user asks why responses are repeated or static, acknowledge it candidly as a human mentor would, apologize for any previous rigid structure, and speak directly from the heart.
      4. VARY YOUR STYLE & LENGTH: Match the user's message length and intensity. If the user sends a quick question or complaint, give a direct, concise, natural response. Don't write a long article when a conversational answer is needed.
      5. LANGUAGE & TONE: Always mirror the user's exact language (Arabic vs English). Use warm, intelligent, authentic Arabic if the user speaks Arabic.
      
      USER DNA PROFILE:
      ${JSON.stringify(personalityData)}
    `;

    const aiConfig = await getTenantAIConfig(adminId);
    let responseText = "";

    const conversationHistory = Array.isArray(memory) ? memory : [];

    if (aiConfig.aiProvider === "openai" && aiConfig.openaiApiKey) {
      console.log(`Using OpenAI (GPT) for coaching (adminId: ${adminId})`);
      const formattedOpenAiMessages = conversationHistory.map((m: any) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content
      }));
      formattedOpenAiMessages.push({ role: "user", content: message });

      responseText = await callOpenAI(
        aiConfig.openaiApiKey,
        formattedOpenAiMessages,
        systemInstruction
      );
    } else {
      console.log(`Using Gemini for coaching (adminId: ${adminId})`);
      const genAIClient = new GoogleGenAI({
        apiKey: aiConfig.geminiApiKey || process.env.GEMINI_API_KEY || "",
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const formattedGeminiContents = conversationHistory.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      formattedGeminiContents.push({ role: 'user', parts: [{ text: message }] });

      const result = await genAIClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: formattedGeminiContents,
        config: {
          systemInstruction
        }
      });
      responseText = result.text || "";
    }

    res.json({ response: responseText });
  } catch (error: any) {
    console.error("Coaching Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Dynamic Test Generation Endpoint
app.post("/api/ai/generate-test", async (req, res) => {
  try {
    const { testId, testName, userProfile, adminId } = req.body;
    
    const systemInstruction = `
      You are HumanOS AI Neural Diagnostic Engine.
      Generate 5 highly realistic, engaging, psychological & behavioral assessment questions for the test "${testName}" (ID: ${testId}).
      
      Requirements:
      - Return ONLY a valid JSON array of 5 question objects. No markdown backticks, no text outside JSON.
      - Each question object MUST have:
        {
          "id": "q1",
          "text": "English question text presenting a vivid scenario",
          "textAr": "نص السؤال بالعربية يمثل سيناريو واقعي مشوق وعميق",
          "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          "options": [
            { "value": 1, "label": "Strongly Disagree", "labelAr": "لا ينطبق عليّ إطلاقاً", "icon": "❌" },
            { "value": 2, "label": "Slightly Disagree", "labelAr": "ينطبق بنسبة ضئيلة", "icon": "⚡" },
            { "value": 3, "label": "Neutral", "labelAr": "ينطبق محايداً أحياناً", "icon": "⚖️" },
            { "value": 4, "label": "Mostly Agree", "labelAr": "ينطبق عليّ كثيراً", "icon": "🎯" },
            { "value": 5, "label": "Strongly Agree", "labelAr": "ينطبق بامتياز دائماً", "icon": "🔥" }
          ]
        }
      - Make the scenarios deeply relevant to: ${userProfile ? JSON.stringify(userProfile) : "General Human Development"}.
    `;

    const aiConfig = await getTenantAIConfig(adminId);
    let responseText = "";

    if (aiConfig.aiProvider === "openai" && aiConfig.openaiApiKey) {
      responseText = await callOpenAI(
        aiConfig.openaiApiKey,
        [{ role: "user", content: `Generate 5 dynamic JSON questions for ${testName}` }],
        systemInstruction
      );
    } else {
      const genAIClient = new GoogleGenAI({
        apiKey: aiConfig.geminiApiKey || process.env.GEMINI_API_KEY || "",
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      const result = await genAIClient.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: `Generate 5 dynamic JSON questions for ${testName}` }] }],
        config: { systemInstruction }
      });
      responseText = result.text || "";
    }

    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(cleanedText);
    res.json({ questions });
  } catch (error: any) {
    console.error("Test Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`HumanOS AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
