import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

function extractJSON(text) {
  let cleaned = text
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/im, "")
    .trim();
  try { return JSON.parse(cleaned); } catch {}
  const fb = cleaned.indexOf("{"), fa = cleaned.indexOf("[");
  let start = -1, close = "";
  if (fb !== -1 && (fa === -1 || fb < fa)) { start = fb; close = "}"; }
  else if (fa !== -1) { start = fa; close = "]"; }
  if (start !== -1) {
    const end = cleaned.lastIndexOf(close);
    if (end > start) try { return JSON.parse(cleaned.slice(start, end + 1)); } catch {}
  }
  throw new Error("Could not extract valid JSON");
}

export async function askGemini(systemPrompt, userPrompt) {
  const full = `${systemPrompt}\n\n---\n\nUser input:\n${userPrompt}\n\nIMPORTANT: Respond with valid JSON only. No markdown. No backticks. No explanation outside JSON.`;
  let last;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await model.generateContent(full);
      return extractJSON(r.response.text());
    } catch (e) {
      last = e;
      if (i < 2) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw last;
}

// Returns raw text — for README generation (not JSON)
export async function askGeminiRaw(systemPrompt, userPrompt) {
  const full = `${systemPrompt}\n\n---\n\n${userPrompt}`;
  let last;
  for (let i = 0; i < 3; i++) {
    try {
      const r = await model.generateContent(full);
      return r.response.text()
        .replace(/^```(?:markdown|md)?\s*/im, "")
        .replace(/\s*```\s*$/im, "")
        .trim();
    } catch (e) {
      last = e;
      if (i < 2) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw last;
}
