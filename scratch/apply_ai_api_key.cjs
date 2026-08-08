const fs = require('fs');
const path = require('path');

const transPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');
const brandingPath = path.join(__dirname, '..', 'src', 'pages', 'BrandingSettings.jsx');
const apiPath = path.join(__dirname, '..', 'src', 'services', 'api.ts');
const coachPath = path.join(__dirname, '..', 'src', 'pages', 'AICoach.tsx');
const serverPath = path.join(__dirname, '..', 'server.ts');

// 1. Edit translations.ts
let trans = fs.readFileSync(transPath, 'utf8');
trans = trans.replace(
  '"branding.quizSection": "Diagnostic Quiz & Archetypes",',
  `"branding.quizSection": "Diagnostic Quiz & Archetypes",
    "branding.aiConfig": "AI API Configuration",
    "branding.geminiApiKeyLabel": "Gemini API Key",
    "branding.geminiApiKeyHint": "Enter your Gemini API key. This will be used dynamically for generating AI coaching responses & assessments for your workspace.",`
);
trans = trans.replace(
  '"branding.quizSection": "اختبار التشخيص والأنماط",',
  `"branding.quizSection": "اختبار التشخيص والأنماط",
    "branding.aiConfig": "إعدادات الذكاء الاصطناعي",
    "branding.geminiApiKeyLabel": "مفتاح واجهة برمجة تطبيقات Gemini (API Key)",
    "branding.geminiApiKeyHint": "أدخل مفتاح Gemini API الخاص بك. سيتم استخدامه ديناميكياً لتوليد ردود الذكاء الاصطناعي وجلسات الكوتشينج الخاصة بمنصتك.",`
);
fs.writeFileSync(transPath, trans, 'utf8');
console.log("SUCCESS: Updated translations.ts");

// 2. Edit BrandingSettings.jsx
let branding = fs.readFileSync(brandingPath, 'utf8');
// Import Cpu
branding = branding.replace(
  "Palette, Type, Image, Save, RefreshCw, Eye, Upload, X, CreditCard, Plus, Trash2, Link, Copy, MessageCircle, Clock }",
  "Palette, Type, Image, Save, RefreshCw, Eye, Upload, X, CreditCard, Plus, Trash2, Link, Copy, MessageCircle, Clock, Cpu }"
);
// DEFAULTS
branding = branding.replace(
  "  i18nOverrides: { ar: {}, en: {} },\n};",
  "  i18nOverrides: { ar: {}, en: {} },\n  geminiApiKey: '',\n};"
);
// Insert AI Config card right before colors
const aiCardHtml = `        {/* AI API Configuration */}
        <div className="card" style={{ marginBottom: '12px' }}>
          <div style={sectionHeader}>
            <Cpu size={16} />
            <span>{t('branding.aiConfig')}</span>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>{t('branding.geminiApiKeyLabel')}</label>
            <input
              type="password"
              value={config.geminiApiKey || ''}
              onChange={e => handleChange('geminiApiKey', e.target.value)}
              placeholder="AIzaSy..."
              dir="ltr"
              style={{ ...inputStyle, textAlign: 'left', fontFamily: 'var(--mono)' }}
            />
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
              {t('branding.geminiApiKeyHint')}
            </div>
          </div>
        </div>

        {/* Colors */}`;

branding = branding.replace('        {/* Colors */}', aiCardHtml);
fs.writeFileSync(brandingPath, branding, 'utf8');
console.log("SUCCESS: Updated BrandingSettings.jsx");

// 3. Edit api.ts
let api = fs.readFileSync(apiPath, 'utf8');
api = `export async function analyzePersonality(answers: any, context?: any, memory?: any, adminId?: string) {
  const response = await fetch("/api/ai/analyze-personality", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers, context, memory, adminId }),
  });
  if (!response.ok) throw new Error("Analysis failed");
  return response.json();
}

export async function getAICoaching(message: string, mode: string, memory?: any, personalityData?: any, adminId?: string) {
  const response = await fetch("/api/ai/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode, memory, personalityData, adminId }),
  });
  if (!response.ok) throw new Error("Coaching failed");
  const data = await response.json();
  return data.response;
}
`;
fs.writeFileSync(apiPath, api, 'utf8');
console.log("SUCCESS: Updated api.ts");

// 4. Edit AICoach.tsx
let coach = fs.readFileSync(coachPath, 'utf8');
coach = coach.replace(
  "const response = await getAICoaching(userMessage, activeMode, [], dynamicPersonality);",
  "const adminId = user?.adminId || (user?.role === 'admin' || user?.role === 'super_admin' ? user.uid : '');\n      const response = await getAICoaching(userMessage, activeMode, [], dynamicPersonality, adminId);"
);
fs.writeFileSync(coachPath, coach, 'utf8');
console.log("SUCCESS: Updated AICoach.tsx");

// 5. Edit server.ts
let server = fs.readFileSync(serverPath, 'utf8');
// Remove old Gemini init
const oldGenAIInit = `// Gemini Initialization
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});`;

const newGenAIInit = `import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

// Load Firebase Config
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
);

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Helper to resolve Gemini client dynamically
async function getGenAIClient(adminId?: string) {
  let apiKey = process.env.GEMINI_API_KEY || "";
  
  if (adminId) {
    try {
      const docRef = doc(db, "tenants", adminId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tenantData = docSnap.data();
        if (tenantData?.geminiApiKey) {
          apiKey = tenantData.geminiApiKey;
          console.log(\`Using custom Gemini API Key for admin: \${adminId}\`);
        }
      }
    } catch (error) {
      console.error("Error fetching custom Gemini API Key:", error);
    }
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}`;

let normServer = server.replace(/\r\n/g, '\n');
const normOldInit = oldGenAIInit.replace(/\r\n/g, '\n');
const normNewInit = newGenAIInit.replace(/\r\n/g, '\n');

if (normServer.includes(normOldInit)) {
  normServer = normServer.replace(normOldInit, normNewInit);
  console.log("SUCCESS: Replaced top-level Gemini init in server.ts");
} else {
  console.log("ERROR: Could not find old Gemini init in server.ts");
}

// Replace body params in analyze-personality
const oldAnalyzeParams = `app.post("/api/ai/analyze-personality", async (req, res) => {
  try {
    const { answers, context, memory } = req.body;`;

const newAnalyzeParams = `app.post("/api/ai/analyze-personality", async (req, res) => {
  try {
    const { answers, context, memory, adminId } = req.body;`;

const normOldAnalyze = oldAnalyzeParams.replace(/\r\n/g, '\n');
const normNewAnalyze = newAnalyzeParams.replace(/\r\n/g, '\n');

if (normServer.includes(normOldAnalyze)) {
  normServer = normServer.replace(normOldAnalyze, normNewAnalyze);
  console.log("SUCCESS: Updated analyze-personality body parameters");
} else {
  console.log("ERROR: Could not find analyze-personality endpoint start in server.ts");
}

// Replace genAI reference in analyze-personality
const oldAnalyzeGenerate = `const result = await genAI.models.generateContent({`;
const newAnalyzeGenerate = `const genAIClient = await getGenAIClient(adminId);\n    const result = await genAIClient.models.generateContent({`;

if (normServer.includes(oldAnalyzeGenerate)) {
  normServer = normServer.replace(oldAnalyzeGenerate, newAnalyzeGenerate);
  console.log("SUCCESS: Updated analyze-personality genAI client generator");
} else {
  console.log("ERROR: Could not find analyze-personality generateContent in server.ts");
}

// Replace body params in coach
const oldCoachParams = `app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, mode, memory, personalityData } = req.body;`;

const newCoachParams = `app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, mode, memory, personalityData, adminId } = req.body;`;

const normOldCoach = oldCoachParams.replace(/\r\n/g, '\n');
const normNewCoach = newCoachParams.replace(/\r\n/g, '\n');

if (normServer.includes(normOldCoach)) {
  normServer = normServer.replace(normOldCoach, normNewCoach);
  console.log("SUCCESS: Updated coach body parameters");
} else {
  console.log("ERROR: Could not find coach endpoint start in server.ts");
}

// Replace genAI reference in coach (uses index since both generateContent look identical)
const oldCoachGenerate = `const result = await genAI.models.generateContent({
      model,
      contents: [{ parts: [{ text: message }] }],
      config: {
        systemInstruction
      }
    });`;

const newCoachGenerate = `const genAIClient = await getGenAIClient(adminId);
    const result = await genAIClient.models.generateContent({
      model,
      contents: [{ parts: [{ text: message }] }],
      config: {
        systemInstruction
      }
    });`;

const normOldCoachGen = oldCoachGenerate.replace(/\r\n/g, '\n');
const normNewCoachGen = newCoachGenerate.replace(/\r\n/g, '\n');

if (normServer.includes(normOldCoachGen)) {
  normServer = normServer.replace(normOldCoachGen, normNewCoachGen);
  console.log("SUCCESS: Updated coach genAI client generator");
} else {
  console.log("ERROR: Could not find coach generateContent in server.ts");
}

const finalServer = server.includes('\r\n') ? normServer.replace(/\n/g, '\r\n') : normServer;
fs.writeFileSync(serverPath, finalServer, 'utf8');
console.log("Finished updating server.ts");
