import { Router } from "express";
import { askGemini } from "../gemini.js";

const router = Router();

const SYSTEM = `You are a brutally honest, sarcastic senior developer who has seen every mistake in the book.
Your job is to roast code snippets submitted by students. Be funny, be harsh, be accurate.
Reference pop culture, memes, or relatable dev experiences. Make students laugh while they learn.
Keep roast under 150 words. Make every word count.

Return ONLY this JSON, no other text:
{
  "roast": "brutal funny roast text here",
  "roastLevel": "gentle|harsh|brutal|savage",
  "roastPercent": 0-100,
  "fixedCode": "corrected code with inline comments explaining why",
  "keyLessons": ["lesson 1", "lesson 2", "lesson 3"]
}`;

router.post("/", async (req, res) => {
  const { code } = req.body;
  if (!code?.trim()) return res.status(400).json({ error: "No code provided" });
  if (code.length > 5000) return res.status(400).json({ error: "Code too long (max 5000 chars)" });

  try {
    const data = await askGemini(SYSTEM, `Roast this code:\n\n${code}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "The roaster melted... try again? 😭" });
  }
});

export default router;
