import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

import { initializeApp } from "firebase/app";
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
          console.log(`Using custom Gemini API Key for admin: ${adminId}`);
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
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Personality DNA Analysis Endpoint
app.post("/api/ai/analyze-personality", async (req, res) => {
  try {
    const { answers, context, memory, adminId } = req.body;
    
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      As a multidisciplinary expert team (consisting of a Clinical Psychologist, Behavioral Analyst, Life Coach, and Mindset Mentor), analyze these assessment answers:
      ${JSON.stringify(answers)}
      
      User Context: ${JSON.stringify(context)}
      Previous AI Memory: ${JSON.stringify(memory)}
      
      Your goal is to decode the user's "Personality DNA" into a high-density intelligence report. 
      Avoid all generic motivational language. Be specific, clinical yet empathetic, and brutally honest where necessary for growth.
      
      Format the response in JSON:
      {
        "archetype": "A creative and distinct name for their personality pattern (e.g., 'The Relentless Optimizer', 'The Guarded Visionary')",
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
        "strengths": ["list 3-5 very specific high-performing behaviors detected"],
        "weaknesses": ["list 3-5 specific psychological friction points or avoidance patterns"],
        "hiddenPatterns": ["Describe 2-3 'under the radar' behaviors the AI detected in the data (e.g., 'Your tendency to use logic to avoid emotional discomfort')"],
        "growthPath": ["A 3-step high-level protocol for the next 30 days"],
        "recommendations": ["specific actionable tools or missions to initialize"]
      }
      All scores should be between 0 and 100 based on the data provided.
    `;

    const genAIClient = await getGenAIClient(adminId);
    const result = await genAIClient.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json"
      }
    });

    res.json(JSON.parse(result.text || "{}"));
  } catch (error: any) {
    console.error("Gemini Personality Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// AI Coaching Endpoint
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, mode, memory, personalityData, adminId } = req.body;
    
    const modes: Record<string, string> = {
      "Warm Therapist": "Embody a world-class Psychologist. Focus on emotional IQ, validation of deep-seated patterns, and safe space for exploration.",
      "Tough Coach": "Embody a high-performance Behavior Analyst and Coach. Focus on elimination of excuses, raw discipline, and measurable output.",
      "Wise Mentor": "Embody a Strategic Mindset Mentor. Focus on long-term philosophy, identifying the 'meta-game' of life, and wisdom-sharing.",
      "Best Friend": "Embody a loyal, high-EQ companion who understands the user's internal struggles but won't let them stay down.",
      "Productivity Expert": "Embody a Systems Architect. Focus on time usage, neural bandwidth optimization, and extreme efficiency.",
    };

    const systemInstruction = `
      ${modes[mode] || modes["Wise Mentor"]}
      
      GLOBAL IDENTITY: You are the core Intelligence Layer of HumanOS AI. You are NOT a generic chatbot. You are a multidisciplinary mentor (Psychologist + Coach + Strategist).
      
      CORE MANDATE:
      1. Be specific, psychologically informed, and emotionally intelligent. 
      2. No generic motivational talk. Tell the user what they NEED to hear based on their data.
      3. Use their Personality DNA to personalize every strategy.
      4. If they have a 'Strategist' archetype, speak in models and logic. If they have an 'Empathetic' archetype, speak in feelings and connection.
      
      USER DNA CONTEXT:
      ${JSON.stringify(personalityData)}
      
      CONVERSATION MEMORY:
      ${JSON.stringify(memory)}
      
      Rules:
      - Max 3 paragraphs per response.
      - Use Markdown for hierarchy (Headers, Bold, Lists).
      - Always end with a challenging question or a precise next step.
    `;

    const model = "gemini-3-flash-preview";
    const genAIClient = await getGenAIClient(adminId);
    const result = await genAIClient.models.generateContent({
      model,
      contents: [{ parts: [{ text: message }] }],
      config: {
        systemInstruction
      }
    });

    res.json({ response: result.text });
  } catch (error: any) {
    console.error("Gemini Coach Error:", error);
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
