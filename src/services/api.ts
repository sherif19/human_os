export async function analyzePersonality(answers: any, context?: any, memory?: any, adminId?: string) {
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

export async function generateAITest(testId: string, testName: string, userProfile?: any, adminId?: string) {
  const response = await fetch("/api/ai/generate-test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ testId, testName, userProfile, adminId }),
  });
  if (!response.ok) throw new Error("Test generation failed");
  const data = await response.json();
  return data.questions;
}
